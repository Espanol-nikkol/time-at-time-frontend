import { FC } from 'react';

import { Button, Typography } from '@mui/material';
import { Link } from 'react-router';

import { Routes, routeToPathMap } from '@routes';

import { LoginLayout } from '@layouts/LoginLayout/LoginLayout';

import { LoginForm } from '@components/auth/LoginForm/LoginForm';

import styles from './LoginView.module.scss';

export const LoginView: FC = () => {
    const notion = (
        <Typography variant="body2" className={styles.notion}>
            Еще нет аккаунта?{' '}
            <Link to={routeToPathMap[Routes.Register]} className={styles.registerLink}>
                Зарегистрируйтесь
            </Link>
        </Typography>
    );

    return (
        <LoginLayout title="С возвращением" notion={notion}>
            <LoginForm className={styles.form} />
            <Button variant="text" className={styles.link} href={routeToPathMap[Routes.PasswordRecovery]} fullWidth>
                <Typography variant="body2" className={styles.linkCaption}>
                    Забыли пароль?
                </Typography>
            </Button>
        </LoginLayout>
    );
};
