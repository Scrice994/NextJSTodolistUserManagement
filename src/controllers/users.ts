import { RequestHandler } from "express";
import { MongoDataStorage } from "src/dataStorage/MongoDataStorage";
import { SignUpBody } from "src/validation/users";
import UserModel from "../models/mongo/userSchema";
import { UserRepository } from "src/repositories/UserRepository";
import { UserEntity } from "src/models/UserEntity";
import { UserCRUD } from "src/CRUD/UserCRUD";

const USER_DATA_STORAGE = new MongoDataStorage<UserEntity>(UserModel);
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
    try {
        
    } catch (error) {
        next(error);
    }
}