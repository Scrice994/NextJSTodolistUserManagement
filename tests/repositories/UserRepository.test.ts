import { UserRepository } from "../../src/repositories/UserRepository";
import { DataStorageMock } from "../__mocks__/dataStorage.mock";

describe("unit", () => {
    describe("UserRepository", () => {
        const dataStorage = new DataStorageMock();
        const repository = new UserRepository(dataStorage);

        const fakeResponse = {
            id: 'testUserId',
            username: 'testUsername',
            userRole: 'testUserRole'
        }

        describe("add()", () => {
            it("Should call createEntity from dataStorage and return the result",async () => {
                dataStorage.createEntity.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const createUser = await repository.add({ username: 'testUsername', userRole: 'admin' });

                expect(createUser).toEqual(fakeResponse);
            });
        });

        describe("browseAll()", () => {
            it("Should call findAllEntities from dataStorage and return the result", async () => {
                dataStorage.findAllEntities.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const findAllUsers = await repository.browseAll({});

                expect(findAllUsers).toEqual(fakeResponse);
            });
        });

        describe("browseOne()", () => {
            it("Should call findOneEntityByKey from the dataStorage and return the result", async () => {
                dataStorage.findOneEntityByKey.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const findUser = await repository.browseOne({ username: 'testUsername' });

                expect(findUser).toEqual(fakeResponse);
            });
        });

        describe("ChangeOne()", () => {
            it("Should call updateEntity from the dataStorage and return the result", async () => {
                dataStorage.updateEntity.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const updateUser = await repository.changeOne({ id: "testUserId" });

                expect(updateUser).toEqual(fakeResponse);
            });
        });
    });
});