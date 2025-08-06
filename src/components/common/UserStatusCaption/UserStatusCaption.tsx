import { FC } from 'react';

import { clsx } from 'clsx';

import { Typography } from '@mui/material';

import { UserStatus } from '@domains/user';

import styles from './UserStatusCaption.module.scss';

type ClassKey = 'title' | 'description';

type UserStatusCaptionProps = {
    status: UserStatus;
} & ClassesProp<ClassKey>;

const userStatusToTitleMap: Record<UserStatus, string> = {
    [UserStatus.Neutral]: 'пока тихо...',
    [UserStatus.WorkLight]: 'вы — гуру баланса',
    [UserStatus.Work]: 'вы в ударе',
    [UserStatus.WorkExtra]: 'вы — супергерой',
    [UserStatus.RelaxLight]: 'вы — мастер отвлечения',
    [UserStatus.Relax]: 'вы в потоке',
    [UserStatus.RelaxExtra]: 'вы — архимаг',
};

const userStatusToDescriptionMap: Record<UserStatus, string> = {
    [UserStatus.Neutral]: 'Вы\u00a0пока не\u00a0делали записи об\u00a0отдыхе.\n' + 'Самое время начать!',
    [UserStatus.WorkLight]:
        'Уделяете больше времени созидательному отдыху, но\u00a0и\u00a0про восстановление не\u00a0забываете',
    [UserStatus.Work]: 'Уделяете как можно больше времени  созидательному отдыху. Все получится!',
    [UserStatus.WorkExtra]: 'Посвящаете максимум времени  созидательному отдыху. Все цели не\u00a0за\u00a0горами!',
    [UserStatus.RelaxLight]: 'Уделяете больше времени восстановлению, но\u00a0балансируете с\u00a0созиданием',
    [UserStatus.Relax]: 'Уделяете как можно больше времени восстановительному отдыху. Расслабляться важно!',
    [UserStatus.RelaxExtra]: 'Посвящаете максимум времени  восстановительному отдыху. Волшебство отдыха!',
};

export const UserStatusCaption: FC<UserStatusCaptionProps> = (props) => {
    const { status, classes } = props;
    const title = userStatusToTitleMap[status];
    const description = userStatusToDescriptionMap[status];
    return (
        <>
            <Typography variant="h5Branded" className={clsx(styles.title, classes?.title)}>
                {title}
            </Typography>
            <Typography variant="body2" className={clsx(styles.description, classes?.description)}>
                {description}
            </Typography>
        </>
    );
};
