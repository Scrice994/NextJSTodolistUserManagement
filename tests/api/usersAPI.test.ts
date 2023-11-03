import axios from "axios";
import { clearDB } from "./mongoTestUtils";
import { UserCRUD } from "../../src/CRUD/UserCRUD";
import { MongoDataStorage } from "../../src/dataStorage/MongoDataStorage";
import { UserEntity } from "../../src/models/UserEntity";
import { UserRepository } from "../../src/repositories/UserRepository";
import UserModel from "../../src/models/mongo/userSchema";

describe("unit", () => {
    describe("userAPI", () => {

        beforeEach( async () => {
            await clearDB();
        });

        const USER_DATA_STORAGE = new MongoDataStorage<UserEntity>(UserModel);
        const USER_REPOSITORY = new UserRepository(USER_DATA_STORAGE);
        const USER_CRUD = new UserCRUD(USER_REPOSITORY);

        const userAPIBaseUrl = "http://localhost:4000";
        const testUser = {
            username: "testUsername",
            password: "testPassword",
            email: "testEmail@gmail.com"
        }

        describe("SignUp", () => {
            it("Should return new saved user without password and email", async () => {
                const createNewUser = await axios.post(userAPIBaseUrl + "/signup", testUser);
                const { email, createdAt, updatedAt, ...createNewresult } = createNewUser.data;

                const findUser = await USER_CRUD.readOne({});
                const { createdAt: findCreatedAt, updatedAt: findUpdatedAt, ...findUserResult } = findUser;

                expect(createNewUser.status).toBe(200);
                expect(findUserResult).toEqual(createNewresult);
            });

            it("Should return error when username is already taken", async () => {
                await axios.post(userAPIBaseUrl + "/signup", testUser);
                const createUserWithSameUsername = await axios.post("http://localhost:4000/signup", {...testUser, email: "testEmail2@gmail.com" })
                .catch( err => {
                    expect(err.response.status).toBe(409);
                    expect(err.response.data).toEqual({ error: "Username already taken" });
                });

                expect(createUserWithSameUsername).toBe(undefined);
            });

            it("Should return error when email is already taken", async () => {
                await axios.post("http://localhost:4000/signup", testUser);
                const createUserWithSameEmail = await axios.post("http://localhost:4000/signup", {...testUser, username: "testUsername2" })
                .catch( err => {
                    expect(err.response.status).toBe(409);
                    expect(err.response.data).toEqual({ error: "A user with this email address already exists. Please log in instead" });
                });

                expect(createUserWithSameEmail).toBe(undefined);
            });

            it("Should return error when an uknown error occour in the server(ErrorHandler-test)", async () => {
                const createNewUser = await axios.post("http://localhost:4000/signup")
                .catch(err => {
                    expect(err.response.status).toBe(500);
                    expect(err.response.data).toEqual({ error: "An unknown error occour" });
                });

                expect(createNewUser).toBe(undefined);
            });
        });
    });
});