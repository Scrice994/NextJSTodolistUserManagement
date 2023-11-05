import { VerificationTokenCRUD } from "../../src/CRUD/VerificationTokenCRUD";
import { RepositoryMock } from "../__mocks__/repository.mock";
import { BadRequest } from "http-errors";

describe("unit", () => {
    describe("verificationTokenCRUD", () => {
        const repository = new RepositoryMock();
        const VERIFICATION_TOKEN_CRUD = new VerificationTokenCRUD(repository);

        const testToken = {
            id: "testTokenId",
            userId: "testUserId",
            verificationCode: "testVerificationCode"
        }

        describe("create()",() => {
            it("Should call add() from the repository and return verificationToken when successfully", async () => {
                repository.add.mockImplementationOnce(() => Promise.resolve(testToken));

                const createToken = await VERIFICATION_TOKEN_CRUD.create(testToken);

                expect(createToken).toEqual(testToken);
            });

            it("Should return error when userId is not provided", async () => {
                const createToken = await VERIFICATION_TOKEN_CRUD.create(testToken)
                .catch(err => {
                    expect(err).toBeInstanceOf(BadRequest);
                    expect(err.message).toEqual("Missing paramenter userId");
                })
            });

            it("Should return error when verificationCode is not provided", async () => {
                const createToken = await VERIFICATION_TOKEN_CRUD.create(testToken)
                .catch(err => {
                    expect(err).toBeInstanceOf(BadRequest);
                    expect(err.message).toEqual("Missing paramenter verificationCode");
                })
            });
        });

        describe("readOne()",() => {
            it("Should call browseOne() from the repository and return verificationToken when successfully", async () => {
                repository.browseOne.mockImplementationOnce(() => Promise.resolve(testToken));

                const findToken = await VERIFICATION_TOKEN_CRUD.readOne({userId: testToken.userId});

                expect(findToken).toEqual(testToken); 
            });
        });

        describe("deleteOne()",() => {
            it("Should call removeOne() from the repository and return verificationToken when successfully", async () => {
                repository.removeOne.mockImplementationOnce(() => Promise.resolve(testToken));

                const removeToken = await VERIFICATION_TOKEN_CRUD.deleteOne(testToken.id);

                expect(removeToken).toEqual(testToken); 
            });

            it("Shoul return error when id is not provided", async () => {
                const removeToken = await VERIFICATION_TOKEN_CRUD.deleteOne("")
                .catch( err => {
                    expect(err).toBeInstanceOf(BadRequest);
                    expect(err.message).toEqual("Missing parameter Id");
                });

                expect(removeToken).toBe(undefined);
            });
        });
    });
});