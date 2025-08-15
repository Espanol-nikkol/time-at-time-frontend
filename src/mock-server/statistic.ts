import { endOfWeek, isToday, isYesterday, parseISO, startOfWeek } from 'date-fns';

import { BaseRepository } from './db';
import type { StatisticDbEntity } from './entities';

import type { ApiTimeCreatePayload } from '../api/protocol';
import { type PeriodPayload, TimeType } from '../domains/time';
import { ApiDateIso } from '../utils/date';

export class StatisticRepository extends BaseRepository {
    async get(payload: PeriodPayload) {
        const startDate = ApiDateIso.from(payload.startDate).toISOString();
        const endDate = ApiDateIso.from(payload.endDate).toISOString();
        const data = await this.db.statistic
            .findOne({
                selector: {
                    startDate: {
                        $eq: startDate,
                    },
                    endDate: {
                        $eq: endDate,
                    },
                },
            })
            .exec();

        if (data === null) {
            return this.db.statistic.insert({
                id: crypto.randomUUID(),
                countRecords: 0,
                startDate,
                endDate,
                streak: 0,
                lastRecordDate: null,
                restTime: 0,
                productiveTime: 0,
            });
        }
        const lastRecordDate = data.lastRecordDate !== null ? parseISO(data.lastRecordDate) : null;

        if (lastRecordDate !== null && !isYesterday(lastRecordDate) && !isToday(lastRecordDate)) {
            return data.update({
                $set: {
                    streak: 0,
                },
            });
        }
        return data;
    }

    public async updateOnTimeAdd(payload: ApiTimeCreatePayload) {
        const date = ApiDateIso.from(payload.date);
        const startDate = ApiDateIso.get(startOfWeek(date, { weekStartsOn: 1 }));
        const endDate = ApiDateIso.get(endOfWeek(date, { weekStartsOn: 1 }));
        const data = await this.get({ startDate, endDate });
        const newData: Partial<StatisticDbEntity> = {};

        if (data.lastRecordDate === null) {
            newData.streak = 1;
        } else if (isYesterday(date)) {
            newData.streak = data.streak + 1;
        } else {
            newData.streak = 1;
        }
        newData.lastRecordDate = date.toISOString();

        if (payload.type === TimeType.Rest) {
            newData.restTime = data.restTime + payload.value;
        } else {
            newData.productiveTime = data.productiveTime + payload.value;
        }
        newData.countRecords = data.countRecords + 1;
        return data
            .update({
                $set: newData,
            })
            .then((result) => result.toJSON());
    }

    public async updateRaw(data: Partial<StatisticDbEntity>, payload: PeriodPayload) {
        const record = await this.get(payload);
        return record.update({
            $set: {
                ...data,
            },
        });
    }
}
