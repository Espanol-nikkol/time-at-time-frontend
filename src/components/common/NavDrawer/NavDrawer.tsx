import { FC, ReactNode } from 'react';

import { clsx } from 'clsx';

import { Button, Drawer, IconButton, List, ListItem, Typography } from '@mui/material';
import { useUnit } from 'effector-react/effector-react.umd';
import { Link, NavLink } from 'react-router';

import { Routes, routeToPathMap } from '@routes';

import { $isDemoMode, logoutFx } from '@stores/app';
import { doActionWithConfirm } from '@stores/confirm-modal';

import { StyledContainer } from '@components/common/StyledContainer/StyledContainer';

import styles from './NavDrawer.module.scss';

import CloseIcon from '@assets/icons/close.svg?react';
import FileIcon from '@assets/icons/file.svg?react';
import LoginIcon from '@assets/icons/login.svg?react';
import LogoutIcon from '@assets/icons/logout.svg?react';
import SpeedtestIcon from '@assets/icons/speedtest.svg?react';

type NavDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

type Link = {
    path: string;
    title: string;
    icon?: ReactNode;
};

const links: Link[] = [
    { path: routeToPathMap[Routes.Main], title: 'Трекер отдыха', icon: <SpeedtestIcon /> },
    { path: routeToPathMap[Routes.Articles], title: 'Статьи', icon: <FileIcon /> },
];

export const NavDrawer: FC<NavDrawerProps> = (props) => {
    const { isOpen, onClose } = props;

    const { isDemoMode } = useUnit({ isDemoMode: $isDemoMode });

    const onLogoutClick = () => {
        onClose();
        doActionWithConfirm({
            isRequiredConfirm: true,
            action: logoutFx,
            title: 'Уже уходите?',
            message: 'Мы\u00a0будем скучать! Снова войти в\u00a0аккаунт можно по\u00a0почте и\u00a0паролю',
            buttonLabels: {
                submit: 'Да, выйти',
                cancel: 'Нет',
            },
        });
    };

    return (
        <Drawer open={isOpen} onClose={onClose} classes={{ paper: styles.paper }}>
            <StyledContainer component="nav" className={styles.nav}>
                <List disablePadding className={styles.list}>
                    {links.map((item) => (
                        <ListItem disablePadding key={item.path} className={styles.item}>
                            <NavLink
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    clsx(styles.link, { [styles.isActive as string]: isActive })
                                }
                            >
                                {item.icon}
                                <Typography variant="body2" className={styles.text}>
                                    {item.title}
                                </Typography>
                            </NavLink>
                        </ListItem>
                    ))}
                </List>
                <div className={styles.footer}>
                    {isDemoMode ? (
                        <>
                            <Typography variant="body2" className={styles.captionDemo}>
                                Вы&nbsp;в&nbsp;
                                <Typography variant="body2Bold" className={styles.accent}>
                                    демо-режиме
                                </Typography>
                                , и&nbsp;ваши записи об&nbsp;отдыхе не&nbsp;сохраняются.
                                <br />
                                Чтобы они сохранялись, войдите в&nbsp;аккаунт
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                href={routeToPathMap[Routes.Login]}
                                className={styles.loginLink}
                            >
                                <LoginIcon /> <Typography variant="body2Bold"> Войти или зарегистрироваться</Typography>
                            </Button>
                        </>
                    ) : (
                        <Button onClick={onLogoutClick} className={styles.logoutButon} color="error" variant="text">
                            <LogoutIcon /> Выйти из аккаунта
                        </Button>
                    )}
                </div>
            </StyledContainer>
            <IconButton className={styles.closeButton} onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </Drawer>
    );
};
