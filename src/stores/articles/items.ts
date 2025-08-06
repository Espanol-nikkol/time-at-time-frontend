import { restore, sample } from 'effector';
import { type ArticleLight, mockShortArticles } from 'mock/articles';

import { AppGate, clearedSession } from '@stores/app';

import { articlesDomain } from './domain';

const fetchArticlesFx = articlesDomain.effect<void, ArticleLight[]>(() => mockShortArticles.items);

const defaultState: ArticleLight[] = [];

export const $articles = restore(fetchArticlesFx.doneData, defaultState).reset(clearedSession);

sample({
    clock: AppGate.open,
    target: fetchArticlesFx,
});
