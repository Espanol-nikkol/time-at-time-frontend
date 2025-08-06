import { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mui/material';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { Routes, routeToPathMap } from '@routes';

import { PasswordField } from '@components/common/PasswordField/PasswordField';

import styles from './NewPasswordForm.module.scss';

type FormData = {
    password: string;
    repeatedPassword: string;
};

const defaultValues: FormData = {
    password: '',
    repeatedPassword: '',
};

const schema = z.object({
    password: z.string().min(4, 'Длина пароля должна быть более 3 символов'),
    repeatedPassword: z.string().nonempty({ error: 'Повторите пароль' }),
});

type NewPasswordFormProps = {
    code: string | null;
};

export const NewPasswordForm: FC<NewPasswordFormProps> = (props) => {
    const { code } = props;
    const navigate = useNavigate();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const handleSubmit: SubmitHandler<FormData> = (rawData) => {
        const data = schema.safeParse(rawData);

        if (!data.success) {
            // TODO: notify
            // TODO: process zod error
            return;
        }

        // TODO: notify
        // TODO: maybe should redirect to login view
        console.log(`Recovery password request with ${code}`);
        navigate(routeToPathMap[Routes.Main]);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
                <PasswordField name="password" label="Новый пароль" fieldProps={{ fullWidth: true }} />
                <PasswordField
                    name="repeatedPassword"
                    label="Новый пароль ещё раз"
                    fieldProps={{ fullWidth: true }}
                    rules={{
                        validate: (value, formValues) => {
                            if (value !== formValues.password) return 'Пароли должны совпадать';
                            return true;
                        },
                    }}
                />
                <Button type="submit" variant="contained" color="primary">
                    Сохранить
                </Button>
            </form>
        </FormProvider>
    );
};
