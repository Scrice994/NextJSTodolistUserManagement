import * as testUtils from "./mongoTestUtils";

beforeAll(async () => {
    await testUtils.databaseConnection();
});

afterAll(async () => {
    await testUtils.clearDB();
    await testUtils.closeDatabaseConnection();
});
