import { DataStorageId } from "src/dataStorage/IDataStorage";
import { IEntity } from "src/models/IEntity";

export interface IRepository<T extends IEntity>{
    add(obj: Omit<T, 'id'>): Promise<T>;
    browseAll(obj: {[key: string]: unknown}): Promise<T[]>;
    browseOne(obj: {[key: string]: unknown}, select?: string): Promise<T>;
    changeOne(obj: Required<IEntity> & Partial<T>): Promise<T>;
    removeOne(id: DataStorageId): Promise<T>;
    removeAll(obj: {[key: string]: unknown}): Promise<T[]>;
}