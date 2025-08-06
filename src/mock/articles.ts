export type Article = {
    id: number;
    slug: string;
    description: string;
    title: string;
    content: string;
};

export type ArticleLight = Omit<Article, 'content'>;

const startWorkArticle: Article = {
    id: 0,
    slug: 'start_work',
    description: 'Инструкция, как пользоваться приложением. Основные параметры и\u00a0настройки',
    title: 'Начало работы',
    content: '',
};

const principleArticle: Article = {
    id: 1,
    slug: 'principles',
    description:
        'Идея об\u00a0отдыхе, заложенная  в\u00a0Time\u00a0At\u00a0Time, термины  и\u00a0концепция\u00a0приложения',
    title: 'Наши основные принципы',
    content: '',
};

const balanceArticle: Article = {
    id: 0,
    slug: 'balance',
    description:
        'Как успевать и\u00a0разгрузить голову, и\u00a0извлечь пользу из\u00a0времени отдыха? Даем ответы на\u00a0эти вопросы в\u00a0статье',
    title: 'Как найти баланс отдыха?',
    content: '',
};

export const mockShortArticles: List<ArticleLight> = {
    items: [startWorkArticle, principleArticle, balanceArticle],
};

export const mockArticles: Article[] = [startWorkArticle, principleArticle, balanceArticle];
