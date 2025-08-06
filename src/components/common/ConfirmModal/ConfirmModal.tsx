import { type FC, useState } from 'react';

import { Button, Typography } from '@mui/material';
import { useUnit } from 'effector-react';

import { $confirmModal, confirmModalApi, type ConfirmModalState } from '@stores/confirm-modal';

import styles from './ConfirmModal.module.scss';

import { BaseModal } from '../BaseModal/BaseModal';

const DEFAULT_LABELS: ConfirmModalState['buttonLabels'] = {
    cancel: 'Нет',
    submit: 'Да',
};

export const ConfirmModal: FC = () => {
    const { state } = useUnit({ state: $confirmModal });

    // TODO: был какой-то хук для загрузки
    const [isLoading, setIsLoading] = useState(false);

    if (state.modal === null || !state.isOpen) return;

    const { action, title, message, buttonLabels } = state.modal;

    const cancelLabel = buttonLabels?.cancel ?? DEFAULT_LABELS.cancel;
    const submitLabel = buttonLabels?.submit ?? DEFAULT_LABELS.submit;

    const handleClose = () => {
        confirmModalApi.close();
    };

    const handleAgree = async () => {
        setIsLoading(true);
        action()
            .then(() => {
                handleClose();
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <BaseModal title={title} isOpen={state.isOpen} onClose={handleClose}>
            {message !== undefined && (
                <Typography variant="body2" className={styles.message}>
                    {message}
                </Typography>
            )}
            <div className={styles.buttonContainer}>
                <Button
                    variant="outlined"
                    color="primary"
                    loading={isLoading}
                    onClick={handleAgree}
                    className={styles.button}
                >
                    {submitLabel}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    onClick={handleClose}
                    className={styles.button}
                >
                    {cancelLabel}
                </Button>
            </div>
        </BaseModal>
    );
};
