import { forwardRef } from 'react';

import { TextField, type TextFieldProps, Typography } from '@mui/material';
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form';

import styles from './EmailField.module.scss';

type EmailFieldProps = {
    name: string;
    label?: string;
    rules?: UseControllerProps['rules'];
    fieldProps?: TextFieldProps;
};

export const EmailField = forwardRef<HTMLDivElement, EmailFieldProps>((props, ref) => {
    const { name, label, rules, fieldProps } = props;
    const { control } = useFormContext();

    return (
        <Controller
            render={({ field, fieldState }) => (
                <>
                    <TextField
                        {...field}
                        ref={ref}
                        type="email"
                        label={label}
                        error={fieldState.error !== undefined}
                        autoComplete="email"
                        fullWidth
                        {...fieldProps}
                    />
                    {fieldState.error !== undefined && (
                        <Typography variant="caption" className={styles.error}>
                            {fieldState.error.message}
                        </Typography>
                    )}
                </>
            )}
            name={name}
            control={control}
            rules={rules}
        />
    );
});
