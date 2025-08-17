import { attach } from 'effector';

import { TimeType } from '@domains/time';

import { ApiTimeCreatePayload } from '@api/protocol';

import { ApiDateIso, getDefaultPeriod } from '@utils/date';

import { createTimeFx, deleteTimeFx } from './time';

const today = new Date();

export const resetProductiveTimeFx = attach({
    effect: deleteTimeFx,
    mapParams: (_: void) => ({
        ...getDefaultPeriod(),
        type: TimeType.Productive,
    }),
});

export const createTimeProductiveFx = attach({
    effect: createTimeFx,
    mapParams: (value: number): ApiTimeCreatePayload => ({
        value,
        date: ApiDateIso.get(today),
        type: TimeType.Productive,
    }),
});
