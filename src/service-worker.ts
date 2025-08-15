import * as A from 'fp-ts/Array';
import * as D from 'fp-ts/Date';
import { differenceInCalendarDays, isToday, isYesterday, parseISO } from 'date-fns';
import { pipe } from 'fp-ts/function';
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { z } from 'zod';

import { TimeType } from '@domains/time';

import { ApiDateIso } from '@utils/date';

import { DB } from './mock-server/db';
import type { StatisticDbEntity } from './mock-server/entities';
import { StatisticRepository } from './mock-server/statistic';
import { TimeRepository } from './mock-server/time';
import { UserRepository } from './mock-server/user';

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
clientsClaim();

const zDateSchema = z.string().refine((value) => {
    const date = ApiDateIso.from(value);
    return !Number.isNaN(date.getTime());
});

type Config = {
    urlPart: string;
    method: string;
    getData: (event: FetchEvent, payload: unknown) => Promise<unknown>;
};
const db = new DB();
const dbInstancePromise = db.init();

const initRepositories = () => {
    let userRepository: UserRepository | null = null;
    let timeRepository: TimeRepository | null = null;
    let statisticRepository: StatisticRepository | null = null;

    return async () => {
        if (userRepository !== null && timeRepository !== null && statisticRepository !== null) {
            return { userRepository, timeRepository, statisticRepository };
        }

        const dbInstance = await dbInstancePromise;
        userRepository = new UserRepository(dbInstance);
        timeRepository = new TimeRepository(dbInstance);
        statisticRepository = new StatisticRepository(dbInstance);
        return { userRepository, timeRepository, statisticRepository };
    };
};

const getRepositories = initRepositories();

const config: Config[] = [
    {
        urlPart: '/api/user',
        method: 'GET',
        getData: async () => {
            const { userRepository } = await getRepositories();
            return userRepository.get();
        },
    },
    {
        urlPart: '/api/user/settings',
        method: 'POST',
        getData: async (_, payload) => {
            const { userRepository } = await getRepositories();
            const parsedPayload = z
                .object({
                    ratioProductiveTimeToRestTime: z.number(),
                })
                .safeParse(payload);

            if (!parsedPayload.success) {
                throw new Error(parsedPayload.error.message);
            }
            return userRepository.update({
                ratioProductiveTimeToRestTime: parsedPayload.data.ratioProductiveTimeToRestTime,
            });
        },
    },
    {
        urlPart: '/api/time/statistic',
        getData: async (_, payload) => {
            const { statisticRepository } = await getRepositories();
            const parsedPayload = z
                .object({
                    startDate: zDateSchema,
                    endDate: zDateSchema,
                })
                .safeParse(payload);

            if (!parsedPayload.success) {
                throw new Error(parsedPayload.error.message);
            }
            return statisticRepository.get(parsedPayload.data);
        },
        method: 'GET',
    },
    {
        urlPart: '/api/time',
        method: 'POST',
        getData: async (_, payload) => {
            const { timeRepository, statisticRepository } = await getRepositories();
            const parsedPayload = z
                .object({
                    value: z.number(),
                    date: zDateSchema,
                    type: z.enum(TimeType),
                })
                .safeParse(payload);

            if (!parsedPayload.success) {
                throw new Error(parsedPayload.error.message);
            }
            await timeRepository.create(parsedPayload.data);
            return statisticRepository.updateOnTimeAdd(parsedPayload.data);
        },
    },
    {
        urlPart: '/api/time/delete-for-period',
        method: 'DELETE',
        getData: async (_, payload) => {
            const { timeRepository, statisticRepository } = await getRepositories();
            const parsedPayload = z
                .object({
                    startDate: zDateSchema,
                    endDate: zDateSchema,
                    type: z.enum(TimeType),
                })
                .safeParse(payload);

            if (!parsedPayload.success) {
                throw new Error(parsedPayload.error.message);
            }
            await timeRepository.delete(parsedPayload.data);
            const timeItems = await timeRepository.getItems();
            const uniqDates = pipe(
                timeItems,
                A.map((item) => parseISO(item.date)),
                A.uniq(D.eqDate)
            );

            let streak = 0;

            for (const [index, date] of uniqDates.entries()) {
                if (index === 0) {
                    if (isToday(date) || isYesterday(date)) {
                        streak = 1;
                    } else {
                        break;
                    }
                }
                const previousDate = uniqDates[index - 1];

                if (previousDate === undefined) {
                    break;
                }
                const diff = differenceInCalendarDays(previousDate, date);

                if (diff === 1) {
                    streak += 1;
                } else {
                    break;
                }
            }
            const statisticPayload: Partial<StatisticDbEntity> = {
                streak,
                lastRecordDate: timeItems[0]?.date ?? null,
                countRecords: timeItems.length,
            };

            if (parsedPayload.data.type === TimeType.Productive) {
                statisticPayload.productiveTime = 0;
            } else {
                statisticPayload.restTime = 0;
            }

            return statisticRepository.updateRaw(statisticPayload, {
                startDate: parsedPayload.data.startDate,
                endDate: parsedPayload.data.endDate,
            });
        },
    },
];

async function handleFetchWithMocks(event: FetchEvent): Promise<Response> {
    const currentConfig = config.find(
        ({ urlPart, method }) => event.request.url.includes(urlPart) && event.request.method === method
    );

    if (currentConfig === undefined || 'Authorization' in event.request.headers) {
        return fetch(event.request);
    }
    let payload = {};

    if (event.request.method === 'GET') {
        payload = Object.fromEntries(new URL(event.request.url).searchParams.entries());
    } else {
        payload = await event.request.json();
    }

    try {
        const mockData = await currentConfig.getData(event, payload);
        return new Response(JSON.stringify(mockData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('catch error', error);
        return new Response(error, {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

self.addEventListener('fetch', (event: FetchEvent) => {
    event.respondWith(handleFetchWithMocks(event));
});
