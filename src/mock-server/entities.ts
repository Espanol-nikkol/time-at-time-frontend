import type { RxJsonSchema } from 'rxdb';

import type { UserSettings } from '@domains/user';

export type UserDbEntity = {
    id: string;
    email: string;
    name: string;
    settings: UserSettings;
};

export const userSchema: RxJsonSchema<UserDbEntity> = {
    version: 0,
    type: 'object',
    primaryKey: 'id',
    properties: {
        id: { type: 'string', maxLength: 100 },
        email: { type: 'string' },
        name: { type: 'string' },
        settings: {
            type: 'object',
            properties: {
                ratioProductiveTimeToRestTime: { type: 'number' },
            },
            default: {
                ratioProductiveTimeToRestTime: 2,
            },
        },
    },
    required: ['id', 'email', 'name'],
} as const;

export type TimeDbEntity = {
    id: string;
    type: 'rest' | 'productive';
    date: string;
    value: number;
};

export const timeSchema: RxJsonSchema<TimeDbEntity> = {
    version: 0,
    type: 'object',
    primaryKey: 'id',
    properties: {
        id: {
            type: 'string',
            maxLength: 100,
        },
        type: {
            type: 'string',
            enum: ['rest', 'productive'],
        },
        date: {
            type: 'string',
            format: 'date-time',
        },
        value: {
            type: 'number',
        },
    },
    required: ['id', 'type', 'date', 'value'],
};

export type StatisticDbEntity = {
    id: string;
    lastRecordDate: string | null;
    productiveTime: number;
    restTime: number;
    streak: number;
    countRecords: number;
    startDate: string;
    endDate: string;
};

export const statisticSchema: RxJsonSchema<StatisticDbEntity> = {
    version: 0,
    type: 'object',
    primaryKey: 'id',
    properties: {
        id: {
            type: 'string',
            maxLength: 100,
        },
        startDate: {
            type: 'string',
            format: 'date-time',
        },
        endDate: {
            type: 'string',
            format: 'date-time',
        },
        lastRecordDate: {
            default: null,
            type: ['string', 'null'],
            format: 'date-time',
        },
        restTime: {
            type: 'number',
            default: 0,
        },
        productiveTime: {
            type: 'number',
            default: 0,
        },
        streak: {
            type: 'number',
            default: 0,
        },
        countRecords: {
            type: 'number',
        },
    },
    required: ['id', 'startDate', 'endDate'],
};
