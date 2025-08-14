import { differenceInCalendarDays, isSameDay, isToday, isWithinInterval, isYesterday, parseISO } from 'date-fns';

import { type PeriodPayload, TimeType } from '@domains/time';

import type { ApiTimeCreatePayload, ApiTimeDeleteForPeriodPayload } from '@api/protocol';

import { ApiDateIso } from '@utils/date';

import { BaseRepository } from './db';

export const inDatePeriod = (period: PeriodPayload, targetIsoDate: string) =>
    isWithinInterval(parseISO(targetIsoDate), {
        start: ApiDateIso.from(period.startDate),
        end: ApiDateIso.from(period.endDate),
    });

export const isOneApiDayAgo = (recordIsoDate: string, anotherApiDate: string) =>
    Math.abs(differenceInCalendarDays(parseISO(recordIsoDate), ApiDateIso.from(anotherApiDate))) === 1;

export const isSameApiDay = (recordIsoDate: string, anotherApiDate: string) =>
    isSameDay(parseISO(recordIsoDate), ApiDateIso.from(anotherApiDate));

export class TimeRepository extends BaseRepository {
    async getStatistic(payload: PeriodPayload) {
        const allRecords = await this.db.time
            .find({
                sort: [{ date: 'desc' }],
            })
            .exec();
        let streak: number | null = 0;
        let productiveTime = 0;
        let restTime = 0;

        for (const [index, record] of allRecords.entries()) {
            if (inDatePeriod(payload, record.date)) {
                if (record.type === TimeType.Rest) {
                    restTime += record.value;
                } else {
                    productiveTime += record.value;
                }
            }
            const previousRecord = allRecords[index - 1];

            if (streak !== null) {
                const parsedRecordDate = parseISO(record.date);

                if (previousRecord === undefined && !(isToday(parsedRecordDate) || isYesterday(parsedRecordDate))) {
                    streak = null;
                    continue;
                }

                if (previousRecord === undefined) {
                    streak = 1;
                } else if (isOneApiDayAgo(record.date, previousRecord.date)) {
                    streak += 1;
                } else if (!isSameApiDay(record.date, previousRecord.date)) {
                    streak = 1;
                }
            }
        }

        return {
            startDate: payload.startDate,
            endDate: payload.endDate,
            countRecords: allRecords.length,
            streak,
            productiveTime,
            restTime,
        };
    }

    public async delete(payload: ApiTimeDeleteForPeriodPayload) {
        const records = await this.db.time
            .find({
                selector: {
                    date: {
                        $gte: ApiDateIso.from(payload.startDate).toISOString(),
                        $lte: ApiDateIso.from(payload.endDate).toISOString(),
                    },
                    type: {
                        $eq: payload.type,
                    },
                },
            })
            .exec();
        await this.db.time.bulkRemove(records);
        return this.getStatistic({ startDate: payload.startDate, endDate: payload.endDate });
    }

    public async create(payload: ApiTimeCreatePayload) {
        const response = await this.db.time.insert({
            id: crypto.randomUUID(),
            ...payload,
            date: ApiDateIso.from(payload.date).toISOString(),
        });
        return response.toJSON();
    }
}
