import { DataStorageId } from "src/dataStorage/IDataStorage";
import { IEntity } from "src/models/IEntity";

export interface ICRUD<T extends IEntity>{
    create(obj: Omit<T, 'id'>): Promise<T>;
    readAll(obj: {[key: string]: unknown}): Promise<T[]>;
    readOne(obj: {[key: string]: unknown}, select?: string): Promise<T>;
    updateOne(obj: Required<IEntity> & Partial<T>): Promise<T>;
    deleteOne(id: DataStorageId): Promise<T>;
    deleteAll(obj: {[key: string]: unknown}): Promise<T[]>;
}