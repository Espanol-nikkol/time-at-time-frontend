import type { Statistic } from '@domains/statistic';

import { BaseRepository } from './db';

export class StatisticRepository extends BaseRepository {
    static async get(payload: { startDate: string; endDate: string }) {
        const { startDate, endDate } = payload;
        const db = await this.db.getInstance();

        let data = await db.statistic.findOne().exec();

        console.log(data);

        if (data === null) {
            data = await db.statistic.insert({
                id: crypto.randomUUID(),
                streak: 0,
                countRecords: 0,
                productiveTime: 0,
                restTime: 0,
            });
        }
        return { ...data.toJSON(), startDate, endDate };
    }

    static async update(payload: Partial<Statistic>) {
        const data = await this.db.statistic.findOne().exec();

        if (data === null) throw new Error('statistic data not found');

        const response = await data.update({
            $set: payload,
        });
        return response.toJSON();
    }
}
