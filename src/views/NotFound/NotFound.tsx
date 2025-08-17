import { FC } from 'react';

import { Button, Typography } from '@mui/material';

import { Routes, routeToPathMap } from '@routes';

import { CommonLayout } from '@layouts/CommonLayout/CommonLayout';

import { type Images, Picture } from '@components/common/Picture/Picture';
import { StyledContainer } from '@components/common/StyledContainer/StyledContainer';

import styles from './NotFound.module.scss';

import NotFoundImage from '@assets/images/avatar-404.png';
import NotFoundImage2x from '@assets/images/avatar-404@2x.png';
import LogoImage from '@assets/images/logo.png';
import Logo2x from '@assets/images/logo@2x.png';

const mainImage: Images = {
    '1x': NotFoundImage,
    '2x': NotFoundImage2x,
};
const logoImage: Images = {
    '1x': LogoImage,
    '2x': Logo2x,
};

export const NotFound: FC = () => {
    console.log();
    return (
        <CommonLayout>
            <StyledContainer className={styles.topContainer}>
                <Picture images={logoImage} width={79} height={36} alt="" classes={{ root: styles.logo }} />
            </StyledContainer>
            <StyledContainer>
                <Picture images={mainImage} width={224} height={194} alt="" classes={{ root: styles.logo }} />
                <Typography variant="h5Branded" className={styles.title}>
                    страница не найдена
                </Typography>
                <Typography variant="body2" className={styles.text}>
                    Кажется, у нас нет такой страницы.
                    <br />
                    Проверьте правильность введенного адреса или вернитесь на главную
                </Typography>
                <Button variant="contained" href={routeToPathMap[Routes.Main]} fullWidth>
                    На главную
                </Button>
            </StyledContainer>
        </CommonLayout>
    );
};
