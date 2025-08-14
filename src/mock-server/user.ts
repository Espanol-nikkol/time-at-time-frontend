import type { UserSettings } from '@domains/user';

import { BaseRepository } from './db';

export class UserRepository extends BaseRepository {
    async get() {
        let user = await this.db.users.findOne().exec();

        if (user === null) {
            user = await this.db.users.insert({
                id: crypto.randomUUID(),
                name: 'Таинственный котий',
                email: '',
                settings: {
                    ratioProductiveTimeToRestTime: 1,
                },
            });
        }
        return user.toJSON();
    }

    async update(payload: UserSettings) {
        const user = await this.db.users.findOne().exec();

        if (user === null) throw new Error('user not found');

        const response = await user.update({
            $set: {
                settings: payload,
            },
        });
        return response.toJSON();
    }
}
