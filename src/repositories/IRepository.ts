import { DataStorageId } from "../dataStorage/IDataStorage";
import { IEntity } from "../models/IEntity";

export interface IRepository<T extends IEntity>{
    add(obj: Omit<T, 'id'>): Promise<T>;
    browseAll(obj: Partial<T>): Promise<T[]>;
    browseOne(obj: Partial<T>, select?: string): Promise<T>;
    changeOne(obj: Required<IEntity> & Partial<T>): Promise<T>;
    removeOne(id: DataStorageId): Promise<T>;
    removeAll(obj: Partial<T>): Promise<T[]>;
}