import axios from "axios";
import UserModel from "../../src/models/mongo/userSchema";
import VerificationTokenModel from "../../src/models/mongo/verificationTokenSchema";
import { clearDB, findOneEntityFromDb, initializeActiveAccount, initializeMemberAccount, initializePendingAccount } from "./mongoTestUtils";

const userAPIBaseUrl = "http://localhost:4000";

describe("unit", () => {

    describe("userAPI", () => {
    
        beforeEach( async () => {
            await clearDB();
        });

        const testUser = {
            username: "testUsername",
            password: "testPassword",
            email: "testEmail@gmail.com",
            tenantId: "testTenantId"
        };

        const testLoginCredentials = {
            username: "testUsername",
            password: "testPassword",
        }

        describe("/signup", () => {
            it("Should return new saved user without password and email when successfull", async () => {
                const createNewUser2 = await axios.post(userAPIBaseUrl + "/signup", {...testUser, username: "asd", password: "asd", email: "asdasd@asd.com", tenantId: "asdasdasd"})
                .catch( err => console.log(err.response));
                const createNewUser = await axios.post(userAPIBaseUrl + "/signup", testUser);
                const { email, createdAt, updatedAt, ...newUser } = createNewUser.data;
                console.log(createNewUser);
                const findUser = await findOneEntityFromDb(UserModel, { id: newUser.id });

                expect(createNewUser.status).toBe(200);
                expect(findUser).toEqual(newUser);
            });

            it("Should create a verificationToken in the db when successfull", async () => {
                const createNewUser = await axios.post(userAPIBaseUrl + "/signup", testUser);

                const findToken = await findOneEntityFromDb(VerificationTokenModel, { userId: createNewUser.data.id });
                
                expect(findToken).toBeDefined();
                expect(findToken).toHaveProperty("verificationCode");
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

            it("Should return error when tenantId is already taken", async () => {
                await axios.post("http://localhost:4000/signup", testUser);
                const createAccountWithSameTenantId = await axios.post("http://localhost:4000/signup", {...testUser, username: "notTestUsername", email: "notTestEmail@gmail.com" })
                .catch( err => {
                    expect(err.response.status).toBe(409);
                    expect(err.response.data).toEqual({ error: "Group name already taken" });
                });

                expect(createAccountWithSameTenantId).toBeUndefined();
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
                const initializeUser = await initializeActiveAccount();
                const { updatedAt, createdAt, password, ...newUser} = initializeUser;

                const logIn = await axios.post(userAPIBaseUrl + "/login", testLoginCredentials);
                const { updatedAt: updateAt2, createdAt: createdAt2, ...loggedUser} = logIn.data;

                expect(logIn.status).toBe(200);
                expect(loggedUser).toEqual(newUser);
            });

            it("Should return error when username is not valid",async () => {
                await initializeActiveAccount();

                const logIn = await axios.post(userAPIBaseUrl + "/login", {...testLoginCredentials, username: "notTestUsername" })
                .catch( err => {
                    expect(err.response.status).toBe(401);
                    expect(err.response.data).toEqual({ error: "Invalid credentials" });
                });

                expect(logIn).toBeUndefined();
            });

            it("Should return error when password is not valid",async () => {
                await initializeActiveAccount();

                const logIn = await axios.post(userAPIBaseUrl + "/login", {...testLoginCredentials, password: "notTestPassword" })
                .catch( err => {
                    expect(err.response.status).toBe(401);
                    expect(err.response.data).toEqual({ error: "Invalid credentials" });
                });

                expect(logIn).toBeUndefined();
            });

            it("Should return error when try to login into a 'Pending' account", async () => {
                await axios.post(userAPIBaseUrl + "/signup", testUser);
                const logIn = await axios.post(userAPIBaseUrl + "/login", testLoginCredentials)
                .catch( err => {
                    expect(err.response.status).toBe(401);
                    expect(err.response.data).toEqual({ error: "Please check your email inbox and verify your account" });
                });

                expect(logIn).toBeUndefined();
            });
        });

        describe("/logout", () => {
            it("Should return success message when user logs out", async () => {
                await initializeActiveAccount();

                const logIn = await axios.post(userAPIBaseUrl + "/login", testLoginCredentials, {
                    withCredentials: true
                });

                const logout = await axios.post(userAPIBaseUrl + "/logout", {}, {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    },
                    withCredentials: true
                })

                expect(logout.status).toBe(200);
                expect(logout.data).toEqual({ success: "User logged out!"});
            });
        });

        describe("/me", () => {
            it("Should return user when successfully", async () => {
                const initializeUser = await initializeActiveAccount();
                const { updatedAt, createdAt, email, password, ...newUser } = initializeUser;

                const logIn = await axios.post(userAPIBaseUrl + "/login", testLoginCredentials);

                const getUser = await axios.get(userAPIBaseUrl + "/me", {
                    headers: {
                        Cookie: logIn.headers["set-cookie"]
                    }
                })
                const { updatedAt: updateAt2, createdAt: createdAt2, ...authenticatedUser} = getUser.data;
    
                expect(getUser.status).toBe(200);
                expect(authenticatedUser).toEqual(newUser);
            });

            it("Should return error when user is not logged in", async () => {
                const getUser = await axios.get(userAPIBaseUrl + "/me")
                .catch( err => {
                    expect(err.response.status).toBe(401);
                    expect(err.response.data).toEqual({ error: "User not authenticated" });
                });

                expect(getUser).toBeUndefined();
            });
        });

        describe("/account-verification", () => {
            it("Should return updated user(status: 'Active') when successfully", async () => {
                const createAccount = await initializePendingAccount();
                const { user, token, verificationCode } = createAccount;
                const { createdAt, updatedAt, email, password, ...newUser} = user;

                const accountVerification = await axios.get(userAPIBaseUrl + `/account-verification?userId=${token.userId}&verificationCode=${verificationCode}`);
                const { createdAt: createdAt2, updatedAt: updateAt2, ...updatedUser } = accountVerification.data;

                expect({ ...newUser, status: "Active" }).toEqual(updatedUser);
            });

            it("Should return error when token is not valid", async () => {
                const createAccount = await initializePendingAccount();
                const { user, token, verificationCode } = createAccount;
                const { createdAt, updatedAt, email, password, ...newUser} = user;

                const accountVerification = await axios.get(userAPIBaseUrl + `/account-verification?userId=${"fakeUserid"}&verificationCode=${verificationCode}`)
                .catch( err => {
                    expect(err.response.status).toBe(404);
                    expect(err.response.data).toEqual({ error: "VerificationToken not found"});
                });
                
                expect(accountVerification).toBeUndefined();
            });

            it("Should return error when verificationCode is not valid", async () => {
                const createAccount = await initializePendingAccount();
                const { user, token, verificationCode } = createAccount;
                const { createdAt, updatedAt, email, password, ...newUser} = user;

                const accountVerification = await axios.get(userAPIBaseUrl + `/account-verification?userId=${token.userId}&verificationCode=${"fakeVerificationCode"}`)
                .catch( err => {
                    expect(err.response.status).toBe(401);
                    expect(err.response.data).toEqual({ error: "Unauthorized, your verificationCode is not valid"});
                });

                expect(accountVerification).toBeUndefined();
            });
        });

        describe("/create-member-account", () => {
            it("Should create a new member account", async () => {
                await initializeActiveAccount();
                const logIn = await axios.post(userAPIBaseUrl + "/login", { username: testUser.username, password: testUser.password });

                const createNewMember = await axios.post(userAPIBaseUrl + "/group/create-member-account", 
                    { username: "testMemberUsername", password: "testMemberPassword" }, 
                    { headers: 
                        {
                            Cookie: logIn.headers["set-cookie"]
                        }
                    }
                );
                const { createdAt, updatedAt, ...newMember } = createNewMember.data;

                const findUser = await findOneEntityFromDb(UserModel, { id: newMember.id });
                
                expect(newMember).toEqual(findUser);
            });

            it("Should return error when account creator is not an Admin", async () => {
                await initializeMemberAccount();
                const logIn = await axios.post(userAPIBaseUrl + "/login", { username: "testUsername", password: "testPassword" });
                
                const createNewMember = await axios.post(userAPIBaseUrl + "/group/create-member-account", 
                    { username: "testMemberUsername", password: "testMemberPassword" }, 
                    { headers: 
                        {
                            Cookie: logIn.headers["set-cookie"]
                        }
                    }
                )
                .catch( err => {
                    expect(err.response.status).toBe(403);
                    expect(err.response.data).toEqual({error: "Must be Admin to access this resource"});
                })

                expect(createNewMember).toBeUndefined();
            });

            it("Should return error when the username for new member is already taken", async () => {
                const newUser = await initializeActiveAccount();
                const logIn = await axios.post(userAPIBaseUrl + "/login", { username: testUser.username, password: testUser.password });

                const createNewMember = await axios.post(userAPIBaseUrl + "/group/create-member-account", 
                    { username: newUser.username, password: "testMemberPassword" }, 
                    { headers: 
                        {
                            Cookie: logIn.headers["set-cookie"]
                        }
                    }
                )
                .catch( err => {
                    expect(err.response.status).toBe(409);
                    expect(err.response.data).toEqual({error: "Username already taken"});
                })

                expect(createNewMember).toBeUndefined();
            });
        });

        describe("/send-verification-email", () => {
            it("Should return sent email when successfully", async () => {
                const sendEmail = await axios.post(userAPIBaseUrl + "/send-verification-email", {
                    username: "testUsername",
                    email: "testEmail@gmail.com",
                    userId: "testUserId",
                    VerificationCode: "testVerificationCode"
                });

                expect(sendEmail).toBeDefined();
                expect(sendEmail.data).toEqual(expect.objectContaining({
                    accepted: expect.any(Array),
                    rejected: expect.any(Array),
                    ehlo: expect.any(Array),
                    envelopeTime: expect.any(Number),
                    messageTime: expect.any(Number),
                    messageSize: expect.any(Number),
                    response: expect.any(String),
                    envelope: expect.any(Object),
                    messageId: expect.any(String)
                }));
            });
        });
    });
});