import { endOfWeek, startOfWeek } from 'date-fns/fp';
import { attach, createApi, restore, sample } from 'effector';
import { constVoid, SK } from 'fp-ts/function';

import { Statistic } from '@domains/statistic';

import { $isLoggedIn, AppGate, clearedSession, isLoggedIn } from '@stores/app';
import { createTimeFx, deleteTimeFx } from '@stores/time';

import { ApiGetStatisticPayload, ApiGetStatisticResponse } from '@api/protocol';

import { apiStatisticGet } from '@api';

import { ApiDateIso, getDefaultPeriod } from '@utils/date';

import { statisticDomain } from './domain';

const _fetchStatisticFx = statisticDomain.effect<ApiGetStatisticPayload, ApiGetStatisticResponse>(apiStatisticGet);

export const fetchStatisticFx = attach({
    effect: _fetchStatisticFx,
    mapParams: (_: void): ApiGetStatisticPayload => getDefaultPeriod(),
});

const defaultState: Statistic = {
    restTime: 0,
    endDate: ApiDateIso.get(endOfWeek()(new Date())),
    startDate: ApiDateIso.get(startOfWeek()(new Date())),
    length: 0,
    productiveTime: 0,
    countRecords: 0,
};

export const $statistic = restore<Statistic>(fetchStatisticFx.doneData, defaultState).reset(clearedSession);

const statisticApi = createApi($statistic, {
    update: SK,
});

sample({
    clock: [AppGate.open, isLoggedIn],
    source: $isLoggedIn,
    filter: (isLoggedIn) => isLoggedIn,
    target: fetchStatisticFx,
});

sample({
    clock: isLoggedIn,
    fn: constVoid,
    target: fetchStatisticFx,
});

sample({
    clock: [createTimeFx.doneData, deleteTimeFx.doneData],
    target: statisticApi.update,
});

// const today = new Date();

// sample({
//     clock: $isDemoMode,
//     fn: constant<Statistic>({
//         countRecords: 0,
//         endDate: flow(startOfWeek, ApiDateIso.get)(today),
//         length: 0,
//         productiveTime: 0,
//         restTime: 0,
//         startDate: flow(endOfWeek, ApiDateIso.get)(today),
//     }),
//     target: $statistic,
// });
