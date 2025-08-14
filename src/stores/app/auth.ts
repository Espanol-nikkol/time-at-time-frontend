import { sample } from 'effector';
import { constTrue, constVoid } from 'fp-ts/function';

import {
    ApiAuthLoginPayload,
    ApiAuthLoginResponse,
    ApiAuthRegisterPayload,
    ApiAuthRegisterResponse,
} from '@api/protocol';
import { removeToken } from '@api/token';

import { apiLogin, apiRegister } from '@api';

import { appDomain } from './domain';

export const loginFx = appDomain.effect<ApiAuthLoginPayload, ApiAuthLoginResponse>(apiLogin);
export const logoutFx = appDomain.effect<void, unknown>();
export const registerFx = appDomain.effect<ApiAuthRegisterPayload, ApiAuthRegisterResponse>(apiRegister);

export const isLoggedIn = appDomain.event();

export const clearedSession = appDomain.event();

export const $isLoggedIn = appDomain
    .store(false, { name: 'isLoggedIn' })
    .on([loginFx.doneData, registerFx.doneData], constTrue)
    .reset(logoutFx.doneData);

sample({
    clock: logoutFx.doneData,
    target: clearedSession,
}).watch(removeToken);

sample({
    clock: [loginFx.doneData, registerFx.doneData],
    fn: constVoid,
    target: isLoggedIn,
});
