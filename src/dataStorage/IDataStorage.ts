import { IEntity } from "../models/IEntity";

export type DataStorageId = string;

export interface IDataStorage<T extends IEntity>{
    findAllEntities(obj: Partial<T>): Promise<T[]>;
    createEntity(entity: Omit<T, 'id'>): Promise<T>;
    findOneEntityByKey(obj: Partial<T>, select?: string): Promise<T>;
    updateEntity(entity: Required<IEntity> & Partial<T>): Promise<T>;
    deleteEntity(id: DataStorageId): Promise<T>;
    deleteAllEntities(obj: Partial<T>): Promise<T[]>;
}