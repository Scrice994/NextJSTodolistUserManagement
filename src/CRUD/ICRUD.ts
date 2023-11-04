import { DataStorageId } from "src/dataStorage/IDataStorage";
import { IEntity } from "src/models/IEntity";

export interface ICRUD<T extends IEntity>{
    create(obj: Omit<T, 'id'>): Promise<T>;
    readAll(obj: Partial<T>): Promise<T[]>;
    readOne(obj: Partial<T>, select?: string): Promise<T>;
    updateOne(obj: Required<IEntity> & Partial<T>): Promise<T>;
    deleteOne(id: DataStorageId): Promise<T>;
    deleteAll(obj: Partial<T>): Promise<T[]>;
}