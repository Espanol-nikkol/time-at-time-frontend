import { FC, PropsWithChildren, ReactNode } from 'react';

import { Button, Typography } from '@mui/material';

import { type Images, Picture } from '@components/common/Picture/Picture';
import { StyledContainer } from '@components/common/StyledContainer/StyledContainer';

import styles from './LoginLayout.module.scss';

import ChevronLeftIcon from '@assets/icons/chevron-left.svg?react';
import LogoImage from '@assets/images/logo.png';
import Logo2x from '@assets/images/logo@2x.png';

const image: Images = {
    '1x': LogoImage,
    '2x': Logo2x,
};

type LoginLayoutProps = {
    title: string | null;
    notion?: ReactNode;
    backLink?: string;
};

export const LoginLayout: FC<PropsWithChildren<LoginLayoutProps>> = (props) => {
    const { title, children, notion, backLink } = props;

    return (
        <>
            <StyledContainer component="header" className={styles.header}>
                {backLink !== undefined && (
                    <Button href={backLink} variant="text" className={styles.backLink}>
                        <ChevronLeftIcon />
                        <Typography variant="body2" className={styles.backLinkCaption}>
                            Назад
                        </Typography>
                    </Button>
                )}
                <Picture images={image} width={79} height={36} alt="" classes={{ root: styles.logo }} />
            </StyledContainer>
            <StyledContainer component="main" className={styles.main}>
                {title !== null && (
                    <Typography variant="h5Branded" className={styles.title}>
                        {title}
                    </Typography>
                )}
                {children}
                {notion}
            </StyledContainer>
            <footer></footer>
        </>
    );
};
