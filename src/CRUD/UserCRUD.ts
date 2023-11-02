import createHttpError from "http-errors";
import { IEntity } from "src/models/IEntity";
import { UserEntity } from "src/models/UserEntity";
import { IRepository } from "src/repositories/IRepository";
import { ICRUD } from "./ICRUD";

export class UserCRUD implements ICRUD<UserEntity>{
    constructor(private repository: IRepository<UserEntity>){}

    async create(obj: Omit<UserEntity, "id">): Promise<UserEntity> {

        if(!obj.userRole){
            throw createHttpError(400, "Missing parameter userRole");
        }

        const result = await this.repository.add(obj);
        return result;
    }

    async readAll(obj: { [key: string]: unknown; }): Promise<UserEntity[]> {
        const result = await this.repository.browseAll(obj);
        return result;
    }

    async readOne(obj: { [key: string]: unknown; }, select?: string): Promise<UserEntity> {
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

    async deleteAll(obj: { [key: string]: unknown; }): Promise<UserEntity[]> {
        throw new Error("Method not implemented.");
    }
}