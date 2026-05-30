import { forwardRef, useState } from 'react';

import { Button, TextField, type TextFieldProps, Typography } from '@mui/material';
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form';

import styles from './PasswordField.module.scss';

import EyeOffIcon from '@assets/icons/eye-off.svg?react';
import EyeIcon from '@assets/icons/eye.svg?react';

type PasswordFieldProps = {
    name: string;
    label?: string;
    rules?: UseControllerProps['rules'];
    fieldProps?: TextFieldProps;
};

export const PasswordField = forwardRef<HTMLDivElement, PasswordFieldProps>((props, ref) => {
    const { name, label, rules, fieldProps } = props;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { control } = useFormContext();

    const handleShowPasswordClick = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    return (
        <Controller
            render={({ field, fieldState }) => (
                <div className={styles.root}>
                    <TextField
                        {...field}
                        error={fieldState.error !== undefined}
                        type={isPasswordVisible ? 'text' : 'password'}
                        label={label}
                        ref={ref}
                        fullWidth
                        {...fieldProps}
                    />
                    {fieldState.error !== undefined && (
                        <Typography variant="caption" className={styles.error}>
                            {fieldState.error.message}
                        </Typography>
                    )}
                    <Button onClick={handleShowPasswordClick} className={styles.showPasswordButton}>
                        {isPasswordVisible ? <EyeIcon /> : <EyeOffIcon />}
                    </Button>
                </div>
            )}
            name={name}
            control={control}
            rules={rules}
        />
    );
});
