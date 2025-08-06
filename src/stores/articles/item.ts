import { restore, sample } from 'effector';
import { type Article, mockArticles } from 'mock/articles';

import { clearedSession } from '@stores/app';
import { displayApiError } from '@stores/effect-handling';

import { articlesDomain } from './domain';
import { ArticleGate } from './gate';

type FetchArticlePayload = {
    slugId?: string;
};

const fetchArticleFx = articlesDomain.effect<FetchArticlePayload, Article | null>((payload) => {
    // TODO: throw custom error
    if (payload.slugId === undefined) throw new Error('Не указан slugId статьи');
    const [_, id] = payload.slugId.split('-');

    if (id === undefined || Number.isNaN(id)) throw new Error('Ошибка в id статьи');
    return mockArticles.find((item) => item.id === Number(id)) ?? null;
});

export const $article = restore<Article | null>(fetchArticleFx.doneData, null).reset(clearedSession);

sample({
    clock: ArticleGate.open,
    filter: ({ slugId }) => slugId !== undefined,
    target: fetchArticleFx,
});

sample({
    clock: fetchArticleFx.failData,
    target: displayApiError,
});
