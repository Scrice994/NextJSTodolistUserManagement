import { UserEntity } from "src/models/UserEntity";
import { MongoDataStorage } from "../../src/dataStorage/MongoDataStorage";
import UserModel from "../../src/models/mongo/userSchema";
import { clearFakeData, closeFakeConnection, connectFakeDB } from "./mongoDataStorageTestSetup";

describe("unit", () => {
    describe("MongoDataStorage", () => {

        beforeAll(async () => {
            await connectFakeDB();
        });

        beforeEach(async () => {
            await clearFakeData();
        });

        afterAll(async() => {
            await closeFakeConnection();
        });

        const testUser = {
            username: "testUsername",
            password: "testPassword",
            email: "testEmail",
            userRole: "Admin",
        }
        
        const UserDataStorage = new MongoDataStorage<UserEntity>(UserModel);

        describe("createEntity()", () => {
            it("should create a new obj in the db", async () => {
                const createEntity = await UserDataStorage.createEntity(testUser);
                const { password, email, ...result } = createEntity;

                const findEntity = await UserDataStorage.findOneEntityByKey({});

                expect(findEntity).toEqual(result);
            });
        });

        describe("FindAllEntities()", () => {
            it("should return an array of objects that are the entities that match the filter in the db",async () => {
                const createEntity = await UserDataStorage.createEntity(testUser);
                const { password, email, ...result } = createEntity;
                const createEntity2 = await UserDataStorage.createEntity(testUser);
                const { password: password2, email: email2, ...result2 } = createEntity2;

                const findAllEntities = await UserDataStorage.findAllEntities({});

                expect(findAllEntities).toEqual([result, result2]);
            });
        });

        describe("findOneEntityByKey()", () => {
            it("should return the first object that match the filter in the db",async () => {
                await UserDataStorage.createEntity(testUser);
                const createEntity2 = await UserDataStorage.createEntity(testUser);
                const { password, email, ...result } = createEntity2;

                const findOneEntity = await UserDataStorage.findOneEntityByKey({id: createEntity2.id});

                expect(findOneEntity).toEqual(result);
            });

            it("Should return additional information of the found obj whith select parameter", async () => {
                const createEntity = await UserDataStorage.createEntity(testUser);

                const findCreateEntityWithSelect = await UserDataStorage.findOneEntityByKey({ id: createEntity.id }, "+password +email");
                const findCreateEntityNoSelect = await UserDataStorage.findOneEntityByKey({ id: createEntity.id });

                expect(createEntity).toEqual(findCreateEntityWithSelect);
                expect(createEntity).not.toEqual(findCreateEntityNoSelect);
            });
        });

        describe("updateEntity()", () => {
            it("Should return the updated entity from the db",async () => {
                const createEntity = await UserDataStorage.createEntity(testUser);
                const { password, email, ...result } = createEntity;

                const updatedEntity = await UserDataStorage.updateEntity({ id: createEntity.id, status: "Active" });

                expect(updatedEntity).toEqual({ ...result, status: "Active", updatedAt: updatedEntity.updatedAt });
            });
        });

        describe("deleteEntity()", () => {
            it("Should remove the entity with the given id from the db",async () => {
                const createEntity = await UserDataStorage.createEntity(testUser);
                const { password, email, ...result } = createEntity;
                const createEntity2 = await UserDataStorage.createEntity(testUser);
                const { password: password2, email: email2, ...result2 } = createEntity2;

                const deleteEntity = await UserDataStorage.deleteEntity(createEntity2.id);
                const findEntities = await UserDataStorage.findAllEntities({});

                expect(deleteEntity).toEqual(result2);
                expect(findEntities).toEqual([result]);
            });
        });

        describe("deleteAllEntities()", () => {
            it("Should remove all entities that match the filter from the db",async () => {
                const createEntity = await UserDataStorage.createEntity(testUser);
                const { password, email, ...result } = createEntity;
                const createEntity2 = await UserDataStorage.createEntity(testUser);
                const { password: password2, email: email2, ...result2 } = createEntity2;

                const deleteEntities = await UserDataStorage.deleteAllEntities({username: createEntity.username});

                const findEntities = await UserDataStorage.findAllEntities({});

                expect(findEntities).toEqual([]);
                expect(deleteEntities).toEqual([result, result2]);
            });
        });
   });
});

