import { createDomain } from 'effector';
import { persist } from 'effector-storage/local';

export const appDomain = createDomain();

appDomain.onCreateStore((store) => persist({ store }));
