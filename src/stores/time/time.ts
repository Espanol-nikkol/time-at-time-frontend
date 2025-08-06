import { sample, split } from 'effector';

import { $currentMode, AppMode } from '@stores/app';
import { displayApiError } from '@stores/effect-handling';

import {
    ApiTimeCreatePayload,
    ApiTimeCreateResponse,
    ApiTimeDeleteForPeriodPayload,
    ApiTimeDeleteForPeriodResponse,
} from '@api/protocol';

import { apiDeleteTimeForPeriod, apiTimeCreate } from '@api';

import { timeDomain } from './domain';

//TODO: Mocking API Calls with MSW (Mock Service Worker) for demo mode

export const createTimeFx = timeDomain.effect<ApiTimeCreatePayload, ApiTimeCreateResponse>(apiTimeCreate);

// type CreateTimeDemoPayload = {
//     payload: ApiTimeCreatePayload;
//     statistic: Statistic;
// };

// export const createTimeDemo = timeDomain.effect<CreateTimeDemoPayload, ApiTimeCreateResponse>((data) => {
//     const { payload, statistic } = data;
//     return {
//         productiveTime: statistic.productiveTime + payload.type === TimeType.Productive ? payload.value : 0,
//         restTime: statistic.restTime + payload.type === TimeType.Rest ? payload.value : 0,
//         countRecords: statistic.countRecords + 1,
//         length: 0,
//         startDate: statistic.startDate,
//         endDate: statistic.endDate,
//     };
// });

// export const createTimeFn = timeDomain.event<ApiTimeCreatePayload>();

export const deleteTimeFx = timeDomain.effect<ApiTimeDeleteForPeriodPayload, ApiTimeDeleteForPeriodResponse>(
    apiDeleteTimeForPeriod
);

// type DeleteTimeDemoPayload = {
//     payload: ApiTimeDeleteForPeriodPayload;
//     statistic: Statistic;
// };

// const _deleteTimeDemoFx = timeDomain.effect<DeleteTimeDemoPayload, ApiTimeDeleteForPeriodResponse>((data) => {
//     const { statistic, payload } = data;
//     return {
//         productiveTime: payload.type === TimeType.Productive ? 0 : statistic.productiveTime,
//         restTime: payload.type === TimeType.Rest ? 0 : statistic.restTime,
//         countRecords: statistic.countRecords,
//         length: 0,
//         startDate: statistic.startDate,
//         endDate: statistic.endDate,
//     };
// });

// export const deleteTimeDemoFx = attach({
//     effect: _deleteTimeDemoFx,
//     source: $statistic,
//     mapParams: (payload: ApiTimeDeleteForPeriodPayload, statistic: Statistic) => ({ payload, statistic }),
// });

export const deleteTimeFn = timeDomain.event<ApiTimeDeleteForPeriodPayload>();

split({
    source: deleteTimeFn,
    match: $currentMode,
    cases: {
        // [AppMode.Demo]: deleteTimeDemoFx,
        [AppMode.Normal]: deleteTimeFx,
    },
});

sample({
    clock: [createTimeFx.failData, deleteTimeFx.failData],
    target: displayApiError,
});
