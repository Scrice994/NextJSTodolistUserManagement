import axios, { AxiosRequestConfig } from "axios"

interface Request {
    method: string
    body?: any
    headers?: any
}

interface IHttpClient {
    sendRequest(url: string, request: Request): Promise<any>
}

export class HttpClient implements IHttpClient{
    async sendRequest(url: string, request: Request): Promise<any> {
        const result = await axios({ url, ...this._requestToFetch(request) });
        return result;
    }

    private _requestToFetch(request: Request): AxiosRequestConfig {
        return {
            method: request.method,
            data: request.body,
            headers: request.headers
        }
    }
}