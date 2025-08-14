import { sample } from 'effector';

import { displayApiError } from '@stores/effect-handling';

import {
    ApiTimeCreatePayload,
    ApiTimeCreateResponse,
    ApiTimeDeleteForPeriodPayload,
    ApiTimeDeleteForPeriodResponse,
} from '@api/protocol';

import { apiDeleteTimeForPeriod, apiTimeCreate } from '@api';

import { timeDomain } from './domain';

export const createTimeFx = timeDomain.effect<ApiTimeCreatePayload, ApiTimeCreateResponse>(apiTimeCreate);

export const deleteTimeFx = timeDomain.effect<ApiTimeDeleteForPeriodPayload, ApiTimeDeleteForPeriodResponse>(
    apiDeleteTimeForPeriod
);

sample({
    clock: [createTimeFx.failData, deleteTimeFx.failData],
    target: displayApiError,
});
