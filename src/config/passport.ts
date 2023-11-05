import passport from "passport";
import { UserCRUD } from "../CRUD/UserCRUD";
import { MongoDataStorage } from "../dataStorage/MongoDataStorage";
import { UserEntity } from "../models/UserEntity";
import UserModel from "../models/mongo/userSchema";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import env from "../env";

const DATA_STORAGE = new MongoDataStorage<UserEntity>(UserModel);
const USER_REPOSITORY = new UserRepository(DATA_STORAGE);
const USER_CRUD = new UserCRUD(USER_REPOSITORY);

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((userId: string, cb) => {
    cb(null, { id: userId });
});


passport.use(new LocalStrategy( async (username, password, cb) => {
    try {
        const existingUser = await USER_CRUD.readOne({ username }, "+email +password");

        if(!existingUser || !existingUser.password){
            return cb(null, false);
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if(!passwordMatch){
            return cb(null, false);
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
    callbackURL: env.SERVER_URL + "/users/oauth2/redirect/google",
    scope: ["profile"], //general profile information
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        let user = await USER_CRUD.readOne({ googleId: profile.id });

        if(!user){
            user = await USER_CRUD.create({
                googleId: profile.id,
                username: profile.displayName,
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