// [POST] api/auth/login
import { Statistic } from '@domains/statistic';
import { PeriodPayload, TimeType } from '@domains/time';
import { User, type UserSettings } from '@domains/user';

export type ApiAuthLoginPayload = {
    email: string;
    password: string;
};
export type ApiAuthLoginResponse = {
    token: string;
    userId: string;
};

// [POST] api/auth/register
export type ApiAuthRegisterPayload = {
    email: string;
    password: string;
};
export type ApiAuthRegisterResponse = {
    token: string;
    userId: string;
};

// [POST] api/time/create
export type ApiTimeCreatePayload = {
    date: string;
    value: number;
    type: TimeType;
};
export type ApiTimeCreateResponse = Statistic;

// [DELETE] api/time/delete-for-period
export type ApiTimeDeleteForPeriodPayload = PeriodPayload & {
    type: TimeType;
};
export type ApiTimeDeleteForPeriodResponse = Statistic;

// [GET] api/time/statistic
export type ApiGetStatisticPayload = PeriodPayload;
export type ApiGetStatisticResponse = Statistic;

// [GET] api/user
export type ApiGetUserPayload = void;
export type ApiGetUserResponse = User;

// [POST] api/user/settings
export type ApiUserSettingsChangePayload = Partial<UserSettings>;
export type ApiUserSettingsChangeResponse = User;
