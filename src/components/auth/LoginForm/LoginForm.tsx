import { FC } from 'react';

import { clsx } from 'clsx';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Typography } from '@mui/material';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { Routes, routeToPathMap } from '@routes';

import { loginFx } from '@stores/app';

import { EmailField } from '@components/common/EmailField/EmailField';
import { PasswordField } from '@components/common/PasswordField/PasswordField';

import styles from './LoginForm.module.scss';

type FormData = {
    email: string;
    password: string;
};

const defaultValues: FormData = {
    email: '',
    password: '',
};

const schema = z.object({
    email: z.email('Введите почту в формате: "xxx@xxx.xx"'),
    password: z.string().min(4, 'Длина пароля должна быть более 3 символов'),
});

type LoginFormProps = {
    className?: string;
};

export const LoginForm: FC<LoginFormProps> = (props) => {
    const { className } = props;
    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues,
    });
    const navigate = useNavigate();

    const handleSubmit: SubmitHandler<FormData> = (rawData) => {
        const data = schema.safeParse(rawData);

        if (!data.success) {
            // TODO: notify
            // TODO: process zod error
            return;
        }

        // TODO: error about unregistered email
        // TODO: error about wrong password
        loginFx(data.data).then(() => {
            // TODO: notify
            navigate(routeToPathMap[Routes.Main]);
        });
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className={clsx(styles.root, className)}>
                <EmailField name="email" label="E-mail" fieldProps={{ fullWidth: true }} />
                <PasswordField name="password" label="Пароль" fieldProps={{ fullWidth: true }} />
                <Button variant="contained" color="primary" type="submit" className={styles.button}>
                    <Typography variant="body2Bold">Войти</Typography>
                </Button>
            </form>
        </FormProvider>
    );
};
