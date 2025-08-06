import { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mui/material';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { EmailField } from '@components/common/EmailField/EmailField';

import styles from './RecoveryForm.module.scss';

type FormData = {
    email: string;
};

const defaultValues: FormData = {
    email: '',
};

const schema = z.object({
    email: z.email('Введите почту в формате: "xxx@xxx.xx"'),
});

type RecoveryFormProps = {
    onSubmit: () => void;
};

export const RecoveryForm: FC<RecoveryFormProps> = (props) => {
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

        console.log('Recovery password request');
        // TODO: error about unregistered email
        onSubmit();
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
                <EmailField name="email" label="E-mail" fieldProps={{ fullWidth: true }} />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Продолжить
                </Button>
            </form>
        </FormProvider>
    );
};
