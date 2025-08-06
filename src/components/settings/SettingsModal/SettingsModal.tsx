import type { FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Rotate90DegreesCw } from '@mui/icons-material';
import { Button, TextField, Typography } from '@mui/material';
import { useUnit } from 'effector-react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { z } from 'zod';

import { $settings, $settingsModal, settingsModalApi } from '@stores/app';

import { BaseModal } from '@components/common/BaseModal/BaseModal';

type FormData = {
    ratio: number;
};

const DEFAULT_RATIO = 2;

const schema = z.object({
    ratio: z.number().min(0, 'Коэффициент должен быть больше 0'),
});

export const SettingsModal: FC = () => {
    const { state, settings } = useUnit({ state: $settingsModal, settings: $settings });

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            ratio: settings?.ratioProductiveTimeToRestTime ?? DEFAULT_RATIO,
        },
    });

    const handleSubmit: SubmitHandler<FormData> = (data) => {
        const parsedData = schema.safeParse(data);

        if (!parsedData.success) {
            // TODO: notify
            // TODO: process zod error
            return;
        }

        console.log(`save new ratio ${parsedData.data.ratio}`);
    };

    return (
        <BaseModal
            title={
                <Typography>
                    Вес <span>созидательного</span> отдыха
                </Typography>
            }
            isOpen={state.isOpen}
            onClose={settingsModalApi.close}
        >
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    {/*TODO: add typography*/}
                    <Typography>Влияет на ваш баланс между восстановлением и созиданием</Typography>
                    <dl>
                        <dd>Восстановительный</dd>
                        <dt>1 мин</dt>
                        <dd>Созидательный</dd>
                        <dt>
                            <Controller
                                render={({ field, fieldState }) => (
                                    <>
                                        <NumericFormat
                                            customInput={(props) => (
                                                <TextField
                                                    {...field}
                                                    type="text"
                                                    error={fieldState.error !== undefined}
                                                    slotProps={{
                                                        // separate props is unmatched with target
                                                        input: { ...props, color: undefined, size: undefined },
                                                    }}
                                                />
                                            )}
                                        />
                                        {fieldState.error !== undefined && (
                                            <Typography variant="caption">{fieldState.error.message}</Typography>
                                        )}
                                    </>
                                )}
                                name="ratio"
                                control={form.control}
                            />
                        </dt>
                    </dl>
                    <Button type="submit">Сохранить</Button>
                    <Button variant="text">
                        <Rotate90DegreesCw /> Восстановить значение по умолчанию (2)
                    </Button>
                </form>
            </FormProvider>
        </BaseModal>
    );
};
