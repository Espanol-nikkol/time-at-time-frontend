import type { ApiTimeCreatePayload, ApiTimeDeleteForPeriodPayload } from '@api/protocol';

import { ApiDateIso } from '@utils/date';

import { BaseRepository } from './db';

export class TimeRepository extends BaseRepository {
    public async getItems() {
        return this.db.time
            .find({
                sort: [{ date: 'desc' }],
            })
            .exec();
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
        return this.db.time.bulkRemove(records);
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
