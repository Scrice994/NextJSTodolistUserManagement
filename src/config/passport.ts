import "dotenv/config";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { UserCRUD } from "../CRUD/UserCRUD";
import { MongoDataStorage } from "../dataStorage/MongoDataStorage";
import env from "../env";
import { UserEntity } from "../models/UserEntity";
import UserModel from "../models/mongo/userSchema";
import { UserRepository } from "../repositories/UserRepository";

const DATA_STORAGE = new MongoDataStorage<UserEntity>(UserModel);
const USER_REPOSITORY = new UserRepository(DATA_STORAGE);
const USER_CRUD = new UserCRUD(USER_REPOSITORY);

passport.serializeUser((user, cb) => {
    const serializedUser = {
        id: user.id,
        tenantId: user.tenantId,
        userRole: user.userRole
    };
    
    cb(null, serializedUser);
});

passport.deserializeUser((serializedUser: Express.User, cb) => {
    const user = {
        id: serializedUser.id,
        tenantId: serializedUser.tenantId,
        userRole: serializedUser.userRole
    };

    cb(null, user);
});


passport.use(new LocalStrategy( async (username, password, cb) => {
    try {
        const existingUser = await USER_CRUD.readOne({ username }, "+email +password");

        if(!existingUser || !existingUser.password){
            return cb(null, false, { message: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if(!passwordMatch){
            return cb(null, false, { message: "Invalid credentials" });
        }

        if(existingUser.status !== "Active"){
            return cb(null, false, { message: "Please check your email inbox and verify your account" });
        }

        const user = existingUser;

        delete user.password;

        return cb(null, user);

    } catch (error) {
        cb(error);
    }
}));

passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.SERVER_URL + "/oauth2/redirect/google",
    scope: ["profile", "email"], //general profile information
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        let user = await USER_CRUD.readOne({ googleId: profile.id });

        if(!user){
            user = await USER_CRUD.create({
                googleId: profile.id,
                username: profile.displayName,
                email: profile._json.email,
                userRole: "Admin",
                status: "Active"
            });
        }

        cb(null, user);
    } catch (error) {
        if(error instanceof Error){
            cb(error);
        } else {
            throw error;
        }
    }
}));