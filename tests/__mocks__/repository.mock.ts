import { IEntity } from "src/models/IEntity";
import { IRepository } from "src/repositories/IRepository";

export class RepositoryMock<T extends IEntity> implements IRepository<T>{
    add = jest.fn();
    browseAll = jest.fn();
    browseOne = jest.fn();
    changeOne = jest.fn();
    removeOne = jest.fn();
    removeAll = jest.fn();
}