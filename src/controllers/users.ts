import { RequestHandler } from "express";
import { MongoDataStorage } from "../dataStorage/MongoDataStorage";
import { SignUpBody } from "../validation/users";
import UserModel from "../models/mongo/userSchema";
import { UserRepository } from "../repositories/UserRepository";
import { UserEntity } from "../models/UserEntity";
import { UserCRUD } from "../CRUD/UserCRUD";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

export const USER_DATA_STORAGE = new MongoDataStorage<UserEntity>(UserModel);
const USER_REPOSITORY = new UserRepository(USER_DATA_STORAGE);
const USER_CRUD = new UserCRUD(USER_REPOSITORY);

export const findUsers: RequestHandler = async (req, res, next) => {
    try {
        const users = await USER_CRUD.readAll({});
        res.status(200).json(users);
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

        const newUser = await USER_CRUD.create({
            username,
            email,
            password: passwordHashed,
            tenantId,
            userRole: "Admin"
        });

        delete newUser.password;

        res.status(200).json(newUser);
    } catch (error) {
        next(error);
    }
}