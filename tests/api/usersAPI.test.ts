import axios from "axios";
import { VERIFICATION_CRUD } from "../../src/controllers/users";
import { USER_CRUD } from "../../src/controllers/users";
import { clearDB } from "./mongoTestUtils";

describe("unit", () => {
    describe("userAPI", () => {

        // beforeEach( async () => {
        //     await clearDB();
        // });

        const userAPIBaseUrl = "http://localhost:4000";

        const testUser = {
            username: "testUsername",
            password: "testPassword",
            email: "testEmail@gmail.com"
        }

        const testLoginCredentials = {
            username: "testUsername",
            password: "testPassword",
        }

        describe("/signup", () => {
            it("Should return new saved user without password and email", async () => {
                const createNewUser = await axios.post(userAPIBaseUrl + "/signup", testUser);
                const { email, createdAt, updatedAt, ...createNewresult } = createNewUser.data;

                const findUser = await USER_CRUD.readOne({});
                const { createdAt: findCreatedAt, updatedAt: findUpdatedAt, ...findUserResult } = findUser;

                expect(createNewUser.status).toBe(200);
                expect(findUserResult).toEqual(createNewresult);
            });

            it("Should create a verificationToken in the db when successfull", async () => {
                const createNewUser = await axios.post(userAPIBaseUrl + "/signup", testUser);

                const findToken = await VERIFICATION_CRUD.readOne({ userId:  createNewUser.data.id });
                
                expect(findToken).toBeDefined();
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

            it("Should return error when username is not provided(Validation-ErrorHandler-test)", async () => {
                const createNewUser = await axios.post("http://localhost:4000/signup", {...testUser, username: ""})
                .catch(err => {
                    expect(err.response.status).toBe(400);
                    expect(err.response.data).toEqual({ error: "body.username is a required field" });
                });

                expect(createNewUser).toBe(undefined);
            });
        });

        describe("/login", () => {
            it("Should return logged user when successfully", async () => {
                const createNewUser = await axios.post(userAPIBaseUrl + "/signup", testUser);
                const { password, ...result} = createNewUser.data;

                const logIn = await axios.post(userAPIBaseUrl + "/login", testLoginCredentials);
                
                expect(logIn.status).toBe(200);
                expect(logIn.data).toEqual(result);
            });

            it("Should fail when username don't match",async () => {
                const createNewUser = await axios.post(userAPIBaseUrl + "/signup", testUser);

                const logIn = await axios.post(userAPIBaseUrl + "/login", {...testLoginCredentials, username: "notTestUsername" })
                .catch( err => {
                    expect(err.response.status).toBe(401);
                    expect(err.response.data).toEqual("Unauthorized");
                });

                expect(logIn).toBe(undefined);
            });

            it("Should fail when password don't match",async () => {
                const createNewUser = await axios.post(userAPIBaseUrl + "/signup", testUser);

                const logIn = await axios.post(userAPIBaseUrl + "/login", {...testLoginCredentials, password: "notTestPassword" })
                .catch( err => {
                    expect(err.response.status).toBe(401);
                    expect(err.response.data).toEqual("Unauthorized");
                });

                expect(logIn).toBe(undefined);
            });
        });

        describe("/logout", () => {
            it("Should return success message when user logs out", async () => {
                const createNewUser = await axios.post(userAPIBaseUrl + "/signup", testUser);

                const logIn = await axios.post(userAPIBaseUrl + "/login", testLoginCredentials, {
                    withCredentials: true
                });

                const logout = await axios.post(userAPIBaseUrl + "/logout", {}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]![0].split(";")[0]
                    },
                    withCredentials: true
                })

                expect(logout.status).toBe(200);
                expect(logout.data).toEqual({ success: "User logged out!"});
            });

            it("Should return error and errorMessage(test Authorization-middleware)", async () => {
                const logout = await axios.post(userAPIBaseUrl + "/logout")
                .catch( err => {
                    expect(err.response.status).toBe(401);
                    expect(err.response.data).toEqual({ error: "User not authenticated" });
                });

                expect(logout).toBe(undefined);
            });
        });

        describe("/me", () => {
            it("Should return user when successfully", async () => {
                const createNewUser = await axios.post(userAPIBaseUrl + "/signup", testUser);
                const { password, email, ...result } = createNewUser.data;

                const logIn = await axios.post(userAPIBaseUrl + "/login", testLoginCredentials);

                const getUser = await axios.get(userAPIBaseUrl + "/me", {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]![0].split(";")[0]
                    }
                })

                expect(getUser.status).toBe(200);
                expect(getUser.data).toEqual(result);
            });

            it("Should fail when user is not logged in", async () => {
                const getUser = await axios.get(userAPIBaseUrl + "/me")
                .catch( err => {
                    expect(err.response.status).toBe(401);
                    expect(err.response.data).toEqual({ error: "User not authenticated" });
                });

                expect(getUser).toBe(undefined);
            });
        });

        describe("/account-verification", () => {
            it("Should return updated user when successfully", async () => {
                const createNewUser = await axios.post(userAPIBaseUrl + "/signup", testUser);
                const { password, email, updatedAt, ...createdUser } = createNewUser.data;

                const findToken = await VERIFICATION_CRUD.readOne({ userId: createdUser.id });

                const accountVerification = await axios.get(userAPIBaseUrl + `/account-verification?userId=${findToken.userId}&verificationCode=${findToken.verificationCode}`);
                const { updatedAt: updateAt2, ...updatedUser } = accountVerification.data;

                expect({ ...createdUser, status: "Active" }).toEqual(updatedUser);
            });
        });
    });
});