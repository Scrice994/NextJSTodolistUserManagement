import createHttpError from "http-errors";
import { IEntity } from "../models/IEntity";
import { UserEntity } from "../models/UserEntity";
import { IRepository } from "../repositories/IRepository";
import { ICRUD } from "./ICRUD";

type K = keyof UserEntity;

export class UserCRUD implements ICRUD<UserEntity>{
    constructor(private repository: IRepository<UserEntity>){}

    async create(obj: Omit<UserEntity, "id">): Promise<UserEntity> {

        if(!obj.userRole){
            throw createHttpError(400, "Missing parameter userRole");
        }

        const result = await this.repository.add(obj);
        return result;
    }

    async readAll(obj: Partial<UserEntity>): Promise<UserEntity[]> {
        const result = await this.repository.browseAll(obj);
        return result;
    }

    async readOne(obj: Partial<UserEntity>, select?: string): Promise<UserEntity> {
        const result = await this.repository.browseOne(obj, select);
        return result;
    }

    async updateOne(obj: Required<IEntity> & Partial<UserEntity>): Promise<UserEntity> {
        if(!obj.id){
            throw createHttpError(400, "Missing parameter id");
        }

        const result = await this.repository.changeOne(obj);
        return result;
    }

    async deleteOne(id: string): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }

    async deleteAll(obj: Partial<UserEntity>): Promise<UserEntity[]> {
        throw new Error("Method not implemented.");
    }
}