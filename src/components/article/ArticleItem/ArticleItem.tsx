import { FC } from 'react';

import { clsx } from 'clsx';

import { Typography } from '@mui/material';

import type { ArticleContent } from '@domains/article';

import styles from './ArticleItem.module.scss';

type ArticleItemProps = {
    item: ArticleContent;
    idPrefix: string;
};

export const ArticleItem: FC<ArticleItemProps> = (props) => {
    const { item, idPrefix } = props;

    return (
        <>
            {item.title !== undefined && (
                <Typography variant="h6" className={clsx(styles.itemTitle, styles.anchor)} id={idPrefix}>
                    {item.title}
                </Typography>
            )}
            {item.subtitle !== undefined && (
                <Typography variant="body2Bold" className={clsx(styles.itemSubtitle, styles.anchor)} id={idPrefix}>
                    {item.subtitle}
                </Typography>
            )}
            {item.text !== undefined && (
                <Typography variant="body2" className={styles.text}>
                    {item.text}
                </Typography>
            )}
            {item.paragraphs?.map((item, index) => (
                <ArticleItem
                    key={`${idPrefix}-subitem-${index}`}
                    item={item}
                    idPrefix={`${idPrefix}-subitem-${index}`}
                />
            ))}
        </>
    );
};
