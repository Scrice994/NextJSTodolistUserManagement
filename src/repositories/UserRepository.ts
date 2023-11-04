import { UserEntity } from "src/models/UserEntity";
import { IRepository } from "./IRepository";
import { IEntity } from "src/models/IEntity";
import { IDataStorage } from "src/dataStorage/IDataStorage";

export class UserRepository implements IRepository<UserEntity>{
    constructor(private dataStorage: IDataStorage<UserEntity>){}

    async add(obj: Omit<UserEntity, "id">): Promise<UserEntity> {
        const result = await this.dataStorage.createEntity(obj);
        return result; 
    }

    async browseAll(obj: Partial<UserEntity>): Promise<UserEntity[]> {
        const result = await this.dataStorage.findAllEntities(obj);
        return result;
    }

    async browseOne(obj: Partial<UserEntity>, select?: string): Promise<UserEntity> {
        const result = await this.dataStorage.findOneEntityByKey(obj, select);
        return result;
    }

    async changeOne(obj: Required<IEntity> & Partial<UserEntity>): Promise<UserEntity> {
        const result = await this.dataStorage.updateEntity(obj);
        return result;
    }

    async removeOne(id: string): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }

    async removeAll(obj: Partial<UserEntity>): Promise<UserEntity[]> {
        throw new Error("Method not implemented.");
    }

}