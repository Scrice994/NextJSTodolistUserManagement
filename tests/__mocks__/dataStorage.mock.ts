import { IDataStorage } from "src/dataStorage/IDataStorage";
import { IEntity } from "src/models/IEntity";

export class DataStorageMock<T extends IEntity> implements IDataStorage<T>{
    findAllEntities = jest.fn();
    createEntity = jest.fn();
    findOneEntityByKey = jest.fn();
    updateEntity = jest.fn();
    deleteEntity = jest.fn();
    deleteAllEntities = jest.fn();
}