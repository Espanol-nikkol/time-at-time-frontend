import { attach } from 'effector';

import { TimeType } from '@domains/time';

import { ApiTimeCreatePayload } from '@api/protocol';

import { ApiDateIso, getDefaultPeriod } from '@utils/date';

import { createTimeFx, deleteTimeFx } from './time';

export const resetRestTimeFx = attach({
    effect: deleteTimeFx,
    mapParams: (_: void) => ({
        ...getDefaultPeriod(),
        type: TimeType.Rest,
    }),
});

export const createTimeRestFx = attach({
    effect: createTimeFx,
    mapParams: (value: number): ApiTimeCreatePayload => ({
        value,
        date: ApiDateIso.get(new Date()),
        type: TimeType.Rest,
    }),
});
