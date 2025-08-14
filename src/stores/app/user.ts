import { createApi, sample } from 'effector';
import { restore } from 'effector/effector.umd';
import { constVoid } from 'fp-ts/function';

import type { User } from '@domains/user';

import { ApiGetUserPayload, ApiGetUserResponse } from '@api/protocol';

import { apiGetUser } from '@api';

import { $isLoggedIn, clearedSession, isLoggedIn } from './auth';
import { appDomain } from './domain';
import { AppGate } from './gate';

export const fetchUserFx = appDomain.effect<ApiGetUserPayload, ApiGetUserResponse>(apiGetUser);

export const $user = restore<User | null>(fetchUserFx.doneData, null).reset(clearedSession);

export const userApi = createApi($user, {
    update: (_, data: User | null) => data,
});

sample({
    clock: [AppGate.open, isLoggedIn],
    fn: constVoid,
    target: fetchUserFx,
});
export const $isDemoMode = $isLoggedIn.map((value) => !value);