import { VerificationTokenEntity } from "src/models/VerificationTokenEntity";
import { ICRUD } from "./ICRUD";
import { IEntity } from "src/models/IEntity";
import { IRepository } from "src/repositories/IRepository";
import createHttpError from "http-errors";

export class VerificationTokenCRUD implements ICRUD<VerificationTokenEntity>{
    constructor(private repository: IRepository<VerificationTokenEntity>){}

    async create(obj: Omit<VerificationTokenEntity, "id">): Promise<VerificationTokenEntity> {
        if(!obj.userId){
            throw createHttpError(400, "Missing parameter userId");
        }

        if(!obj.verificationCode){
            throw createHttpError(400, "Missing parameter verificationCode");
        }

        const result = await this.repository.add(obj);
        return result;
    }

    async readOne(obj: Partial<VerificationTokenEntity>): Promise<VerificationTokenEntity> {
        const result = await this.repository.browseOne(obj);
        return result;
    }

    async deleteOne(id: string): Promise<VerificationTokenEntity> {
        if(!id){
            throw createHttpError(400, "Missing parameter Id");
        }

        const result = await this.repository.removeOne(id);
        return result;
    }

    async readAll(obj: Partial<VerificationTokenEntity>): Promise<VerificationTokenEntity[]> {
        throw new Error("Method not implemented.");
    }

    updateOne(obj: Required<IEntity> & Partial<VerificationTokenEntity>): Promise<VerificationTokenEntity> {
        throw new Error("Method not implemented.");
    }

    deleteAll(obj: Partial<VerificationTokenEntity>): Promise<VerificationTokenEntity[]> {
        throw new Error("Method not implemented.");
    }
    
}