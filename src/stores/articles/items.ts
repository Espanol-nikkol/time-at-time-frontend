import { restore, sample } from 'effector';

import type { ArticleLight } from '@domains/article';

import { AppGate, clearedSession } from '@stores/app';

import { articlesDomain } from './domain';

import { mockShortArticles } from '../../mock/articles';

const fetchArticlesFx = articlesDomain.effect<void, ArticleLight[]>(() => mockShortArticles.items);

const defaultState: ArticleLight[] = [];

export const $articles = restore(fetchArticlesFx.doneData, defaultState).reset(clearedSession);

sample({
    clock: AppGate.open,
    target: fetchArticlesFx,
});
