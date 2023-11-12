import bcrypt from "bcrypt";
import crypto from "crypto";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { UserCRUD } from "../CRUD/UserCRUD";
import { VerificationTokenCRUD } from "../CRUD/VerificationTokenCRUD";
import { MongoDataStorage } from "../dataStorage/MongoDataStorage";
import { UserEntity } from "../models/UserEntity";
import { VerificationTokenEntity } from "../models/VerificationTokenEntity";
import UserModel from "../models/mongo/userSchema";
import verificationTokenModel from "../models/mongo/verificationTokenSchema";
import { UserRepository } from "../repositories/UserRepository";
import { VerificationTokenRepository } from "../repositories/VeificationTokenRepository";
import { assertIsDefined } from "../utils/assertIsDefined";
import { LogInBody, SignUpBody } from "../validation/users";
import * as Email from "../utils/emailService";

const USER_DATA_STORAGE = new MongoDataStorage<UserEntity>(UserModel);
const USER_REPOSITORY = new UserRepository(USER_DATA_STORAGE);
export const USER_CRUD = new UserCRUD(USER_REPOSITORY);
const VERIFICATION_STORAGE = new MongoDataStorage<VerificationTokenEntity>(verificationTokenModel);
const VERIFICATION_REPOSITORY = new VerificationTokenRepository(VERIFICATION_STORAGE);
export const VERIFICATION_CRUD = new VerificationTokenCRUD(VERIFICATION_REPOSITORY);

export const getAuthorization: RequestHandler = async (req, res, next) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        next(error);
    }
}

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUser = req.user;
    try {
        assertIsDefined(authenticatedUser);
        const findUser = await USER_CRUD.readOne({ id: authenticatedUser.id });
        res.status(200).json(findUser);
    } catch (error) {
        next(error);
    }
}

export const signup: RequestHandler<unknown, unknown, SignUpBody, unknown> =  async (req, res, next) => {
    const { username, email, password: passwordRaw, tenantId } = req.body;

    try {
        const findExistingUsername = await USER_CRUD.readOne({ username });
        if(findExistingUsername){
            throw createHttpError(409, "Username already taken");
        }

        const findExistingEmail = await USER_CRUD.readOne({ email });
        if(findExistingEmail){
            throw createHttpError(409, "A user with this email address already exists. Please log in instead");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10); 

        const verificationCode = crypto.randomInt(100000, 999999).toString();

        const verificationCodeHashed = await bcrypt.hash(verificationCode, 10);

        const newUser = await USER_CRUD.create({
            username,
            email,
            password: passwordHashed,
            tenantId,
            userRole: "Admin"
        });

        delete newUser.password;

        const verificationToken = await VERIFICATION_CRUD.create({
            userId: newUser.id,
            verificationCode: verificationCodeHashed
        });

        
        await Email.sendVerificationEmail(username, email, newUser.id, verificationCode);

        res.status(200).json(newUser);
    } catch (error) {
        next(error);
    }
}

export const login: RequestHandler<unknown, unknown, LogInBody, unknown> = async (req, res, next) => {
    try {
        res.status(200).json({ user: req.user })
    } catch (error) {
        next(error);
    }
}

interface AccountVerificationQueryParams{
    userId: string
    verificationCode: string
}

export const accountVerification: RequestHandler<unknown, unknown, unknown, AccountVerificationQueryParams> = async (req, res, next) => {
    const { userId, verificationCode } = req.query;
    try {
        assertIsDefined(userId);
        assertIsDefined(verificationCode);

        const findToken = await VERIFICATION_CRUD.readOne({ userId });
        
        if(!findToken){
            throw createHttpError(404, "VerificationToken not found");
        }

        const verificationMatch = bcrypt.compare(verificationCode, findToken.verificationCode);

        if(!verificationMatch){
            throw createHttpError(401, "Unauthorized, your verificationCode is not valid");
        }

        const verifiedUser = await USER_CRUD.updateOne({ id: userId, status: "Active" });

        res.status(200).json(verifiedUser);
    } catch (error) {
        next(error);
    }
}

export const logout: RequestHandler = (req, res, next) => {
    try {
        req.logOut( error => {
            if(error) throw error;
        });
        req.session.destroy( error => {
            if(!error){
                res.status(200).json({ success: "User logged out!"})
            } else {
                throw error;
            }
        });
    } catch (error) {
        next(error);
    }
}