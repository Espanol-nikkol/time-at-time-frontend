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
    type ApiUserSettingsChangePayload,
    type ApiUserSettingsChangeResponse,
} from '@api/protocol';
import { getToken, saveToken } from '@api/token';

enum Method {
    Post = 'POST',
    Get = 'GET',
    Delete = 'DELETE',
}

// TODO: change on axios?
const createRequest = async <Request, Response>(url: string, method: Method, body?: Request): Promise<Response> => {
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
        if (response.ok) {
            const result = await response.json();

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

const getRequest = <Request extends object | void, Response>(url: string, payload?: Request): Promise<Response> => {
    const searchParams = new URLSearchParams();

    if (payload !== undefined) {
        for (const [key, value] of Object.entries(payload)) {
            searchParams.set(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
    }
    const urlWithParams = searchParams.size === 0 ? url : `${url}?${searchParams.toString()}`;
    return createRequest<Request, Response>(urlWithParams, Method.Get);
};

const deleteRequest = <Request, Response>(url: string, body: Request): Promise<Response> =>
    createRequest<Request, Response>(url, Method.Delete, body);

export const apiAuthLogin = (payload: ApiAuthLoginPayload) =>
    postRequest<ApiAuthLoginPayload, ApiAuthLoginResponse>('/api/auth/login', payload);

export const apiAuthRegister = (payload: ApiAuthRegisterPayload) =>
    postRequest<ApiAuthRegisterPayload, ApiAuthRegisterResponse>('/api/auth/register', payload);

export const apiTimeCreate = (payload: ApiTimeCreatePayload) =>
    postRequest<ApiTimeCreatePayload, ApiTimeCreateResponse>('/api/time', payload);

export const apiGetStatistic = (payload: ApiGetStatisticPayload) => getRequest<ApiGetStatisticPayload, ApiGetStatisticResponse>('/api/time/statistic', payload);

export const apiGetUser = () => getRequest<ApiGetUserPayload, ApiGetUserResponse>('/api/user');

export const apiDeleteTimeForPeriod = (payload: ApiTimeDeleteForPeriodPayload) =>
    deleteRequest<ApiTimeDeleteForPeriodPayload, ApiTimeDeleteForPeriodResponse>(
        '/api/time/delete-for-period',
        payload
    );

export const apiUserSettingsChange = (payload: ApiUserSettingsChangePayload) =>
    postRequest<ApiUserSettingsChangePayload, ApiUserSettingsChangeResponse>('/api/user/settings', payload);
