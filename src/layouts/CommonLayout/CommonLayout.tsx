import { FC, PropsWithChildren, useState } from 'react';

import { clsx } from 'clsx';

import { IconButton } from '@mui/material';

import { NavDrawer } from '@components/common/NavDrawer/NavDrawer';

import styles from './CommonLayout.module.scss';

import CloseIcon from '@assets/icons/close.svg?react';
import MenuIcon from '@assets/icons/menu.svg?react';

type CommonLayoutProps = {
    className?: string;
};

export const CommonLayout: FC<PropsWithChildren<CommonLayoutProps>> = (props) => {
    const { className, children } = props;

    const [isOpenNav, setIsOpenNav] = useState(false);

    return (
        <>
            <header>
                <NavDrawer isOpen={isOpenNav} onClose={() => setIsOpenNav(false)} />
            </header>
            <main className={clsx(className, styles.main)}>
                {children}
                <IconButton onClick={() => setIsOpenNav((prev) => !prev)} className={styles.drawerButton}>
                    {isOpenNav ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </main>
        </>
    );
};
