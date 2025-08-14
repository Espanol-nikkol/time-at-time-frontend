import { addRxPlugin, createRxDatabase, type RxCollection, type RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { wrappedValidateZSchemaStorage } from 'rxdb/plugins/validate-z-schema';

import { type TimeDbEntity, timeMigrationStrategies, timeSchema, type UserDbEntity, userSchema } from './entities';

addRxPlugin(RxDBMigrationSchemaPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBDevModePlugin);

export type DbCollection = {
    users: RxCollection<UserDbEntity>;
    time: RxCollection<TimeDbEntity>;
};

export class DB {
    public async init() {
        const db = await createRxDatabase<DbCollection>({
            name: 'mydb1',
            storage: wrappedValidateZSchemaStorage({ storage: getRxStorageDexie() }),
            // TODO: only for develop?
            closeDuplicates: true,
        });

        await db.addCollections({
            users: {
                schema: userSchema,
            },
            time: {
                schema: timeSchema,
                migrationStrategies: timeMigrationStrategies,
            },
        });
        return db;
    }
}

export class BaseRepository {
    protected db: RxDatabase<DbCollection>;
    constructor(db: RxDatabase<DbCollection>) {
        this.db = db;
    }
}
