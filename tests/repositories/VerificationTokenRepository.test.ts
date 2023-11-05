import { VerificationTokenRepository } from "../../src/repositories/VeificationTokenRepository";
import { DataStorageMock } from "../__mocks__/dataStorage.mock";

describe("unit", () => {
    describe("VerificationTokenRepository", () => {
        const dataStorage = new DataStorageMock();
        const VERIFICATION_TOKEN_REPOSITORY = new VerificationTokenRepository(dataStorage);

        const testToken = {
            userId: "testUserId",
            verificationCode: "testVerificationCode"
        }

        describe("add()", () => {
            it("Should call createEntity from the dataStorage", async () => {
                dataStorage.createEntity.mockImplementationOnce(() => Promise.resolve(testToken));

                const createNewToken = await VERIFICATION_TOKEN_REPOSITORY.add(testToken);
    
                expect(createNewToken).toEqual(testToken);
            });
        });

        describe("browseOne()", () => {
            it("Should call findOneEntityByKey from the dataStorage", async () => {
                dataStorage.findOneEntityByKey.mockImplementationOnce(() => Promise.resolve(testToken));

                const findToken = await VERIFICATION_TOKEN_REPOSITORY.browseOne({ userId: testToken.userId });
    
                expect(findToken).toEqual(testToken);
            });
        });

        describe("removeOne()", () => {
            it("Should call deleteEntity from the dataStorage", async () => {
                dataStorage.deleteEntity.mockImplementationOnce(() => Promise.resolve(testToken));

                const deleteToken = await VERIFICATION_TOKEN_REPOSITORY.removeOne(testToken.userId);
    
                expect(deleteToken).toEqual(testToken);
            });
        });
    });
});