import { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mui/material';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { registerFx } from '@stores/app';

import { EmailField } from '@components/common/EmailField/EmailField';
import { PasswordField } from '@components/common/PasswordField/PasswordField';

type FormData = {
    email: string;
    password: string;
    repeatedPassword: string;
};

const defaultValues: FormData = {
    email: '',
    password: '',
    repeatedPassword: '',
};

const schema = z.object({
    email: z.email('Введите почту в формате: "xxx@xxx.xx"'),
    password: z.string().min(4, 'Длина пароля должна быть более 3 символов'),
    repeatedPassword: z.string().nonempty({ error: 'Повторите пароль' }),
});

type RegisterFormProps = {
    onSubmit?: () => void;
};

// TODO: think about abstract process zod error
export const RegisterForm: FC<RegisterFormProps> = (props) => {
    const { onSubmit } = props;

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

        // TODO: error about busy email
        registerFx(data.data).then(onSubmit);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <EmailField name="email" label="E-mail" />
                <PasswordField name="password" label="Пароль" />
                <PasswordField
                    name="repeatedPassword"
                    label="Повторите пароль"
                    rules={{
                        validate: (value, formValues) => {
                            if (value !== formValues.password) return 'Пароли должны совпадать';
                            return true;
                        },
                    }}
                />
                <Button type="submit">Зарегистрироваться</Button>
            </form>
        </FormProvider>
    );
};
