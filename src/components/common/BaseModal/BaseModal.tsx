import type { FC, PropsWithChildren, ReactNode } from 'react';

import { IconButton, Modal, Typography } from '@mui/material';

import { StyledContainer } from '@components/common/StyledContainer/StyledContainer';

import styles from './BaseModal.module.scss';

import CloseIcon from '@assets/icons/close.svg?react';

type BaseModalProps = {
    title: string | ReactNode;
    isOpen: boolean;
    onClose?: () => void;
};

export const BaseModal: FC<PropsWithChildren<BaseModalProps>> = (props) => {
    const { title, isOpen, onClose, children } = props;

    return (
        <Modal open={isOpen} onClose={() => onClose?.()} classes={{ backdrop: styles.backdrop }}>
            <StyledContainer className={styles.body}>
                <Typography variant="h6" className={styles.title}>
                    {title}
                </Typography>
                {children}
                <IconButton onClick={onClose} className={styles.closeButton}>
                    <CloseIcon />
                </IconButton>
            </StyledContainer>
        </Modal>
    );
};
