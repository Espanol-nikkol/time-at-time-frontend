import { attach, createApi, restore, sample } from 'effector';
import { constVoid, SK } from 'fp-ts/function';

import { Statistic } from '@domains/statistic';

import { AppGate, clearedSession, isLoggedIn } from '@stores/app';
import { displayApiError } from '@stores/effect-handling';
import { createTimeFx, deleteTimeFx } from '@stores/time';

import { ApiGetStatisticPayload, ApiGetStatisticResponse } from '@api/protocol';

import { apiGetStatistic } from '@api';

import { getDefaultPeriod } from '@utils/date';

import { statisticDomain } from './domain';

const _fetchStatisticFx = statisticDomain.effect<ApiGetStatisticPayload, ApiGetStatisticResponse>(apiGetStatistic);

export const fetchStatisticFx = attach({
    effect: _fetchStatisticFx,
    mapParams: (_: void): ApiGetStatisticPayload => getDefaultPeriod(),
});

export const $statistic = restore<Statistic | null>(fetchStatisticFx.doneData, null).reset(clearedSession);

const statisticApi = createApi($statistic, {
    update: SK,
});

sample({
    clock: [AppGate.open, isLoggedIn],
    fn: constVoid,
    target: fetchStatisticFx,
});

sample({
    clock: [createTimeFx.doneData, deleteTimeFx.doneData],
    target: statisticApi.update,
});

sample({
    clock: fetchStatisticFx.failData,
    target: displayApiError,
});
