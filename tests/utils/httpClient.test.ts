import axios from "axios";
import { HttpClient } from "../../src/utils/HttpClient";

jest.mock("axios");
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe("unit", () => {
    describe("HttpClient", () => {
        describe("sendRequest()", () => {
            it("Should return the result from the http call", async () => {
                const httpClient = new HttpClient();
                mockedAxios.mockImplementationOnce(() => Promise.resolve({data: "mockData"}));

                const fetchData = await httpClient.sendRequest("testUrl", { method: "get" });
                
                expect(fetchData).toEqual({data: "mockData"});
            });
        });
    });
});