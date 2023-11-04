import mongoose from "mongoose";
import { IEntity } from "../models/IEntity";
import { DataStorageId, IDataStorage } from "./IDataStorage";

export class MongoDataStorage<T extends IEntity> implements IDataStorage<T>{
    constructor(private _model: mongoose.Model<any>){}

    async createEntity(entity: Omit<T, "id">): Promise<T> {
        const newEntityResult = await this._model.create(entity);
        const { _id, __v, ...result } = newEntityResult.toObject();
        return result;
    }

    async findAllEntities(obj: Partial<T>): Promise<T[]> {
        const findAllEntities = await this._model.find(obj);
        return findAllEntities.map( item => {
            const { _id, __v, ...result } = item.toObject();
            return result;
        });
    }

    async findOneEntityByKey(obj: Partial<T>, select?: string ): Promise<T> {
        let findEntity;

        if(select){
            const returnCompleteEntity = await this._model.findOne(obj)
            .collation({ locale: "en", strength: 2 })
            .select(select);
            
            findEntity = returnCompleteEntity;
        } else {
            const returnEntity = await this._model.findOne(obj)
            .collation({ locale: "en", strength: 2 });

            findEntity = returnEntity;
        }

        if(findEntity === null){
            return findEntity;
        }

        const { _id, __v, ...result } = findEntity.toObject();
        return result;
    }

    async updateEntity(entity: Required<IEntity> & Partial<T>): Promise<T> {
        const { id, ...toUpdate } = entity;
        const updatedEntity = await this._model.findOneAndUpdate({ id }, toUpdate, { new: true });
        const { __v, _id, ...result } = updatedEntity.toObject();
        return result;
    }

    async deleteEntity(id: DataStorageId): Promise<T> {
        const deletedEntity = await this._model.findOneAndDelete({id});
        const { _id, __v, ...result } = deletedEntity.toObject();
        return result;
    }

    async deleteAllEntities(obj: Partial<T>): Promise<T[]> {
        const entitiesToDelete = await this.findAllEntities(obj);
        await this._model.deleteMany(obj);
        return entitiesToDelete;
    }

}