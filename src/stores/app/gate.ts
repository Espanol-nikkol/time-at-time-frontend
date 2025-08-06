import { createGate } from 'effector-react';

import { appDomain } from '@stores/app/domain';

export const AppGate = createGate<void>({ domain: appDomain });
