import { FC } from 'react';

import { Typography } from '@mui/material';

import styles from './RecoveryForm.module.scss';

export const RecoverySuccess: FC = () => (
    <div className={styles.successContainer}>
        <Typography variant="body2" className={styles.successText}>
            На&nbsp;указанный адрес электронной почты мы&nbsp;выслали вам письмо со&nbsp;ссылкой
            для&nbsp;ее&nbsp;подтверждения.
        </Typography>
        <Typography variant="body2" className={styles.successText}>
            Проверьте &laquo;Входящие&raquo; или &laquo;Спам&raquo;, а&nbsp;затем перейдите по&nbsp;ссылке
            из&nbsp;письма
        </Typography>
    </div>
);
