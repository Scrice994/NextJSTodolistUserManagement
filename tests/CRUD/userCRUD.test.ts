import { UserCRUD } from "../../src/CRUD/UserCRUD";
import { RepositoryMock } from "../__mocks__/repository.mock";
import { BadRequest } from "http-errors";

describe("unit", () => {
    describe("userCRUD", () => {

        const repository = new RepositoryMock();
        const crud = new UserCRUD(repository);

        const fakeResponse = {
            id: 'testUserId',
            username: 'testUsername',
            userRole: 'testUserRole'
        }

        describe("readOne()", () => {
            it("Should return founded user based on the filter when runs successfully",async () => {
                repository.browseOne.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const findUser = await crud.readOne({ username: 'testUsername' });

                expect(findUser).toEqual(fakeResponse);
            });
        });

        describe("create()", () => {
            it("Should return new user when runs successfully",async () => {
                repository.add.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const createUser = await crud.create({ username: 'testUsername', userRole: 'testUserRole' });

                expect(createUser).toEqual(fakeResponse);
            });

            it("Should return badRequest(400) error and errorMessage when userRole is not provided", async () => {
                await crud.create(JSON.parse(JSON.stringify({ username: 'testUsername' })))
                .catch( err => {
                    expect(err).toBeInstanceOf(BadRequest);
                    expect(err.message);
                });
            });
        });

        describe("readAll()", () => {
            it("should return all users based on the filter when runs successfully", async () => {
                repository.browseAll.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const createUser = await crud.readAll({ username: 'testUsername'});

                expect(createUser).toEqual(fakeResponse);
            }); 
        });

        describe("updateOne()", () => {
            it("Should return the udpated user when runs successfully", async () => {
                repository.changeOne.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                const updateUser = await crud.updateOne({ id: 'testUserId' });

                expect(updateUser).toEqual(fakeResponse);
            });

            it("Should return badRequest(400) error and errorMessage when id parameter is not provided", async () => {
                await crud.updateOne(JSON.parse(JSON.stringify({})))
                .catch( err => {
                    expect(err).toBeInstanceOf(BadRequest);
                    expect(err.message).toEqual("Missing parameter id");
                })
            });
        });
    });
});