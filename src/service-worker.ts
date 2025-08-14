import { endOfWeekWithOptions, startOfWeekWithOptions } from 'date-fns/fp';
import { pipe } from 'fp-ts/function';
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { z } from 'zod';

import { TimeType } from '@domains/time';

import { ApiDateIso } from '@utils/date';

import { DB } from './mock-server/db';
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

    return async () => {
        if (userRepository !== null && timeRepository !== null) {
            return { userRepository, timeRepository };
        }

        const dbInstance = await dbInstancePromise;
        userRepository = new UserRepository(dbInstance);
        timeRepository = new TimeRepository(dbInstance);
        return { userRepository, timeRepository };
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
            const { timeRepository } = await getRepositories();
            const parsedPayload = z
                .object({
                    startDate: zDateSchema,
                    endDate: zDateSchema,
                })
                .safeParse(payload);

            if (!parsedPayload.success) {
                throw new Error(parsedPayload.error.message);
            }
            return timeRepository.getStatistic(parsedPayload.data);
        },
        method: 'GET',
    },
    {
        urlPart: '/api/time',
        method: 'POST',
        getData: async (_, payload) => {
            const { timeRepository } = await getRepositories();
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
            return timeRepository.getStatistic({
                startDate: pipe(new Date(), startOfWeekWithOptions({ weekStartsOn: 1 }), ApiDateIso.get),
                endDate: pipe(new Date(), endOfWeekWithOptions({ weekStartsOn: 1 }), ApiDateIso.get),
            });
        },
    },
    {
        urlPart: '/api/time/delete-for-period',
        method: 'DELETE',
        getData: async (_, payload) => {
            const { timeRepository } = await getRepositories();
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
            return timeRepository.getStatistic({
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
