import { FC, useState } from 'react';

import { Typography } from '@mui/material';
import { constant } from 'fp-ts/function';
import { Link } from 'react-router';
import { match } from 'ts-pattern';

import { Routes, routeToPathMap } from '@routes';

import { LoginLayout } from '@layouts/LoginLayout/LoginLayout';

import { RegisterForm } from '@components/auth/RegisterForm/RegisterForm';
import { RegisterSuccess } from '@components/auth/RegisterForm/RegisterSuccess';

import styles from './RegisterView.module.scss';

enum Step {
    Form = 'form',
    Success = 'success',
}

export const RegisterView: FC = () => {
    const [step, setStep] = useState(Step.Form);

    const handleSubmit = () => setStep(Step.Success);

    const title = match<Step>(step)
        .with(Step.Form, constant('Давайте познакомимся'))
        .with(Step.Success, constant('Очень приятно'))
        .exhaustive();

    const notion = (
        <Typography variant="body2" className={styles.notion}>
            Уже зарегистрированы?{' '}
            <Link to={routeToPathMap[Routes.Login]} className={styles.registerLink}>
                Войдите в аккаунт
            </Link>
        </Typography>
    );

    return (
        <LoginLayout title={title} notion={notion} backLink={routeToPathMap[Routes.Login]}>
            {step === Step.Form && <RegisterForm className={styles.form} onSubmit={handleSubmit} />}
            {step === Step.Success && <RegisterSuccess />}
        </LoginLayout>
    );
};
