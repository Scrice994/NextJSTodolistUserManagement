import { VerificationTokenEntity } from "src/models/VerificationTokenEntity";
import { IRepository } from "./IRepository";
import { IEntity } from "src/models/IEntity";
import { IDataStorage } from "src/dataStorage/IDataStorage";

export class VerificationTokenRepository implements IRepository<VerificationTokenEntity>{
    constructor(private dataStorage: IDataStorage<VerificationTokenEntity>){}

    async add(obj: Omit<VerificationTokenEntity, "id">): Promise<VerificationTokenEntity> {
        const result = await this.dataStorage.createEntity(obj);
        return result;
    }

    async browseOne(obj: Partial<VerificationTokenEntity>): Promise<VerificationTokenEntity> {
        const result = await this.dataStorage.findOneEntityByKey(obj);
        return result;
    }

    async removeOne(id: string): Promise<VerificationTokenEntity> {
        const result = await this.dataStorage.deleteEntity(id);
        return result;
    } 

    browseAll(obj: Partial<VerificationTokenEntity>): Promise<VerificationTokenEntity[]> {
        throw new Error("Method not implemented.");
    }

    changeOne(obj: Required<IEntity> & Partial<VerificationTokenEntity>): Promise<VerificationTokenEntity> {
        throw new Error("Method not implemented.");
    }

    removeAll(obj: Partial<VerificationTokenEntity>): Promise<VerificationTokenEntity[]> {
        throw new Error("Method not implemented.");
    }
}