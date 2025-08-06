import { createGate } from 'effector-react';

import { articlesDomain } from './domain';

export const ArticleGate = createGate<{ slugId: string | undefined }>({ domain: articlesDomain });
