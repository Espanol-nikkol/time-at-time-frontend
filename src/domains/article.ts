export type ArticleContent = {
    title?: string;
    subtitle?: string;
    text?: string;
    paragraphs?: ArticleContent[];
};

export type ArticleTopLevelContent = {
    title: string;
    text?: string;
    paragraphs?: ArticleContent[];
};

export type Article = {
    id: number;
    slug: string;
    description: string;
    title: string;
    content: ArticleContent;
};
export type ArticleLight = Omit<Article, 'content'>;
