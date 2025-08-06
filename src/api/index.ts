import {
    ApiAuthLoginPayload,
    ApiAuthLoginResponse,
    ApiAuthRegisterPayload,
    ApiAuthRegisterResponse,
    ApiGetStatisticPayload,
    ApiGetStatisticResponse,
    ApiGetUserPayload,
    ApiGetUserResponse,
    ApiTimeCreatePayload,
    ApiTimeCreateResponse,
    ApiTimeDeleteForPeriodPayload,
    ApiTimeDeleteForPeriodResponse,
} from '@api/protocol';
import { getToken, saveToken } from '@api/token';

enum Method {
    Post = 'POST',
    Get = 'GET',
    Delete = 'DELETE',
}

// TODO: change on axios?
const createRequest = <Request, Response>(url: string, method: Method, body?: Request): Promise<Response> => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });
    const token = getToken();

    if (token !== null) {
        headers.append('Authorization', `Bearer ${token}`);
    }
    const options: RequestInit = {
        method,
        headers,
    };

    if (body !== undefined) {
        options.body = JSON.stringify(body);
    }
    return fetch(url, options).then(async (response) => {
        console.log({ response });

        if (response.ok) {
            const result = await response.json();
            console.log({ result });

            if (typeof result === 'object' && 'accessToken' in result && typeof result['accessToken'] === 'string') {
                saveToken(result['accessToken']);
            }
            return result;
        }

        throw new Error(`${response.url} ${response.status}: ${response.statusText}`);
    });
};

const postRequest = <Request, Response>(url: string, body: Request): Promise<Response> =>
    createRequest<Request, Response>(url, Method.Post, body);

const getRequest = <Request, Response>(url: string, body: Request): Promise<Response> =>
    createRequest<Request, Response>(url, Method.Get, body);

const deleteRequest = <Request, Response>(url: string, body: Request): Promise<Response> =>
    createRequest<Request, Response>(url, Method.Delete, body);

export const apiAuthLogin = (payload: ApiAuthLoginPayload) =>
    postRequest<ApiAuthLoginPayload, ApiAuthLoginResponse>('/api/auth/login', payload);

export const apiAuthRegister = (payload: ApiAuthRegisterPayload) =>
    postRequest<ApiAuthRegisterPayload, ApiAuthRegisterResponse>('/api/auth/register', payload);

export const apiTimeCreate = (payload: ApiTimeCreatePayload) =>
    postRequest<ApiTimeCreatePayload, ApiTimeCreateResponse>('/api/time/create', payload);

export const apiStatisticGet = (payload: ApiGetStatisticPayload) =>
    postRequest<ApiGetStatisticPayload, ApiGetStatisticResponse>('/api/time/statistic', payload);

export const apiUserGet = (payload: ApiGetUserPayload) =>
    getRequest<ApiGetUserPayload, ApiGetUserResponse>('/api/user', payload);

export const apiDeleteTimeForPeriod = (payload: ApiTimeDeleteForPeriodPayload) =>
    deleteRequest<ApiTimeDeleteForPeriodPayload, ApiTimeDeleteForPeriodResponse>(
        '/api/time/delete-for-period',
        payload
    );
