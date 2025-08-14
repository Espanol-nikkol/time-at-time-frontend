import type { MigrationStrategies, RxJsonSchema } from 'rxdb';

import type { UserSettings } from '@domains/user';

import { ApiDateIso } from '@utils/date';

export type StatisticDbEntity = {
    id: string;
    restTime: number;
    productiveTime: number;
    countRecords: number;
    streak: number;
};

// TODO: field props
export const statisticSchema: RxJsonSchema<StatisticDbEntity> = {
    version: 0,
    type: 'object',
    primaryKey: 'id',
    properties: {
        id: { type: 'string', maxLength: 5 },
        restTime: { type: 'number' },
        productiveTime: { type: 'number' },
        countRecords: { type: 'number' },
        streak: { type: 'number' },
    },
    required: ['id', 'restTime', 'productiveTime', 'countRecords', 'streak'],
} as const;

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
            required: ['ratioProductiveTimeToRestTime'],
        },
    },
    required: ['id', 'email', 'name', 'settings'],
} as const;

export type TimeDbEntity = {
    id: string;
    type: 'rest' | 'productive';
    date: string;
    value: number;
};

export const timeSchema: RxJsonSchema<TimeDbEntity> = {
    version: 1,
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

export const timeMigrationStrategies: MigrationStrategies<TimeDbEntity> = {
    // 0 -> 1
    1: (oldRecord) => {
        oldRecord.date = ApiDateIso.from(oldRecord.date).toISOString();
        return oldRecord;
    },
};
