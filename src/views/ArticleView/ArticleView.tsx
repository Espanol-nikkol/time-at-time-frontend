import { FC } from 'react';

import { clsx } from 'clsx';

import { Button, Typography } from '@mui/material';
import { useGate, useUnit } from 'effector-react';
import { useParams } from 'react-router';

import { Routes, routeToPathMap } from '@routes';

import { ArticleGate } from '@stores/articles';
import { $article } from '@stores/articles/item';

import { NotFound } from '@views/NotFound/NotFound';

import { CommonLayout } from '@layouts/CommonLayout/CommonLayout.tsx';

import { ArticleItem } from '@components/article/ArticleItem/ArticleItem';
import { Contents } from '@components/article/Contents/Contents';
import { type Images, Picture } from '@components/common/Picture/Picture';
import { StyledContainer } from '@components/common/StyledContainer/StyledContainer';

import styles from './ArticleView.module.scss';

import ChevronLeftIcon from '@assets/icons/chevron-left.svg?react';
import LogoImage from '@assets/images/logo.png';
import Logo2x from '@assets/images/logo@2x.png';

const image: Images = {
    '1x': LogoImage,
    '2x': Logo2x,
};

type Params = {
    slugId: string;
};

export const ArticleView: FC = () => {
    const { slugId } = useParams<Params>();
    const { data } = useUnit({ data: $article });

    useGate(ArticleGate, { slugId });

    if (data === null) return <NotFound />;

    const { content } = data;

    return (
        <CommonLayout>
            <StyledContainer className={styles.topContainer}>
                <Button href={routeToPathMap[Routes.Articles]} variant="text" className={styles.backLink}>
                    <ChevronLeftIcon />
                    <Typography variant="body2" className={styles.backLinkCaption}>
                        Назад
                    </Typography>
                </Button>
                <Picture images={image} width={79} height={36} alt="" classes={{ root: styles.logo }} />
            </StyledContainer>
            <StyledContainer className={styles.contentsContainer}>
                <Contents className={styles.contents} data={data} />
            </StyledContainer>
            <StyledContainer className={styles.content}>
                {content.title !== undefined && (
                    <Typography variant="h5" className={clsx(styles.title, styles.anchor)} id="title">
                        {content.title}
                    </Typography>
                )}
                {content.text !== undefined && (
                    <Typography variant="body2" className={styles.text}>
                        {content.text}
                    </Typography>
                )}
                {'paragraphs' in content &&
                    content.paragraphs?.map((item, index) => (
                        <ArticleItem key={`item-${index}`} item={item} idPrefix={`item-${index}`} />
                    ))}
            </StyledContainer>
        </CommonLayout>
    );
};
