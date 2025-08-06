import { sample } from 'effector';
import { restore } from 'effector/effector.umd';
import { constVoid } from 'fp-ts/function';

import type { User } from '@domains/user';

import { ApiGetUserPayload, ApiGetUserResponse } from '@api/protocol';

import { apiUserGet } from '@api';

import { $isLoggedIn, clearedSession, isLoggedIn } from './auth';
import { $isDemoMode } from './demo';
import { appDomain } from './domain';
import { AppGate } from './gate';

export const fetchUserFx = appDomain.effect<ApiGetUserPayload, ApiGetUserResponse>(apiUserGet);

export const $user = restore(fetchUserFx.doneData, null).reset(clearedSession);

sample({
    clock: AppGate.open,
    source: $isLoggedIn,
    filter: (isLoggedIn) => isLoggedIn,
    fn: constVoid,
    target: fetchUserFx,
});

sample({
    clock: isLoggedIn,
    fn: constVoid,
    target: fetchUserFx,
});

sample({
    clock: $isDemoMode,
    filter: (isDemoMode) => isDemoMode,
    fn: (): User => ({
        email: 'lapa@eda.kushat',
        name: 'Лапориан Валерианович',
        settings: {
            ratioProductiveTimeToRestTime: 2,
        },
    }),
    target: $user,
});
