import axios from "axios";

describe("unit", () => {
    describe("userAPI", () => {
        describe("SignUp", () => {
            it("Should return new saved user without password and email", async () => {
                const createNewUser = await axios.post("http://localhost:4000/signup", {
                    username: "testUsername",
                    password: "testPassword",
                    email: "testEmail@gmail.com"
                });

                const findUser = await axios.get("http://localhost:4000");

                expect(createNewUser).toEqual([findUser]);
            });

            it("Should return error when username is already taken", async () => {
                const createNewUser = await axios.post("http://localhost:4000/signup", {
                    username: "testUsername",
                    password: "testPassword",
                    email: "testEmail@gmail.com"
                });

                const createUserWithSameUsername = await axios.post("http://localhost:4000/signup", {
                    username: "testUsername",
                    password: "testPassword2",
                    email: "testEmail2@gmail.com"
                });

                expect(createUserWithSameUsername.status).toBe(409);
                expect(createUserWithSameUsername.data).toEqual({error: "Username already taken"});
            });

            it("Should return error when email is already taken", async () => {
                const createNewUser = await axios.post("http://localhost:4000/signup", {
                    username: "testUsername",
                    password: "testPassword",
                    email: "testEmail@gmail.com"
                });

                const createUserWithSameUsername = await axios.post("http://localhost:4000/signup", {
                    username: "testUsername2",
                    password: "testPassword2",
                    email: "testEmail@gmail.com"
                });

                expect(createUserWithSameUsername.status).toBe(409);
                expect(createUserWithSameUsername.data).toEqual({error: "A user with this email address already exists. Please log in instead"});
            });
        });
    });
});