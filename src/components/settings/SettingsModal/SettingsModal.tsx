import { type FC } from 'react';

import { Button, OutlinedInput, type OutlinedInputProps, Typography } from '@mui/material';
import { useUnit } from 'effector-react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import { displaySuccessMessage } from '@stores/effect-handling';
import { $settings, $settingsModal, settingsModalApi, updateSettingsFx } from '@stores/settings';

import { SnackBar } from '@utils/snackbar';

import { BaseModal } from '@components/common/BaseModal/BaseModal';

import styles from './SettingsModal.module.scss';

import DoubleChevronDownIcon from '@assets/icons/chevrons-down.svg?react';
import RotateClockwiseIcon from '@assets/icons/rotate-clockwise.svg?react';

type FormData = {
    ratio: number | null;
};

const DEFAULT_RATIO = 2;

export const SettingsModal: FC = () => {
    const { state, settings } = useUnit({ state: $settingsModal, settings: $settings });

    const form = useForm<FormData>({
        defaultValues: {
            ratio: settings?.ratioProductiveTimeToRestTime ?? DEFAULT_RATIO,
        },
    });

    const handleReset = () => {
        form.setValue('ratio', DEFAULT_RATIO);
    };

    const handleSubmit: SubmitHandler<FormData> = (data) => {
        const { ratio } = data;
        form.clearErrors();

        if (ratio === null) {
            form.setError('ratio', { type: 'required' });
            SnackBar.error('Заполните вес созидательного отдыха');
            return;
        }

        if (ratio === 0) {
            form.setError('ratio', { type: 'min' });
            SnackBar.error('Коэффициент должен быть больше 0');
            return;
        }

        updateSettingsFx({ ratioProductiveTimeToRestTime: ratio }).then(() => {
            displaySuccessMessage('Статистика новых записей будет рассчитываться с\u00a0учетом изменений');
            settingsModalApi.close();
        });
    };

    const handleClose = () => {
        form.reset();
        settingsModalApi.close();
    };

    return (
        <BaseModal
            title={
                <>
                    Вес <span className={styles.accent}>созидательного</span> отдыха
                </>
            }
            isOpen={state.isOpen}
            onClose={handleClose}
        >
            <Typography variant="body2" className={styles.text}>
                Влияет на&nbsp;ваш баланс между восстановлением и&nbsp;созиданием
            </Typography>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
                    <div className={styles.fields}>
                        <div className={styles.restTypeContainer}>
                            <Typography variant="caption" className={styles.typeName}>
                                Восстановительный
                            </Typography>
                            <Typography variant="h6" className={styles.value}>
                                1
                            </Typography>
                            <Typography variant="caption" className={styles.unit}>
                                мин
                            </Typography>
                        </div>
                        <div className={styles.separator}>
                            <div className={styles.iconContainer}>
                                <DoubleChevronDownIcon className={styles.icon} />
                            </div>
                        </div>
                        <div className={styles.restTypeContainer}>
                            <label htmlFor="productive-value">
                                <Typography variant="caption" className={styles.typeName}>
                                    Созидательный
                                </Typography>
                            </label>
                            <Controller
                                render={({ field, fieldState }) => (
                                    <NumericFormat<OutlinedInputProps>
                                        {...field}
                                        value={field.value}
                                        customInput={OutlinedInput}
                                        id="productive-value"
                                        classes={{ input: styles.input, root: styles.inputContainer }}
                                        error={fieldState.error !== undefined}
                                        allowedDecimalSeparators={[',', '.']}
                                        endAdornment={
                                            <Typography variant="caption" className={styles.unit}>
                                                мин
                                            </Typography>
                                        }
                                        onChange={(data) => {
                                            const { value } = data.target;

                                            if (value.length === 0) {
                                                form.setValue('ratio', null);
                                                return;
                                            }
                                            form.setValue('ratio', Number(value));
                                        }}
                                        allowNegative={false}
                                    />
                                )}
                                name="ratio"
                                control={form.control}
                            />
                        </div>
                    </div>
                    <Button type="submit" color="primary" variant="contained" fullWidth>
                        Сохранить
                    </Button>
                    <Button variant="text" color="secondary" onClick={handleReset} className={styles.resetButton}>
                        <RotateClockwiseIcon />{' '}
                        <Typography variant="body2" className={styles.resetText}>
                            Восстановить значение по умолчанию (2)
                        </Typography>
                    </Button>
                </form>
            </FormProvider>
        </BaseModal>
    );
};
