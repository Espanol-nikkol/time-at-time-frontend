export enum TimeType {
    Rest = 'rest',
    Productive = 'productive',
}

export type Time = {
    id: number;
    type: TimeType;
    date: string;
    value: number;
};

export type PeriodPayload = {
    startDate: string;
    endDate: string;
};
