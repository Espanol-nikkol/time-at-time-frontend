import * as React from 'react';
import { FC, PropsWithChildren } from 'react';

import { clsx } from 'clsx';

import { Breakpoint, Container } from '@mui/material';

import styles from './StyledContainer.module.scss';

type StyledContainerProps = {
    component?: React.ElementType;
    width?: Breakpoint;
    className?: string;
};

export const StyledContainer: FC<PropsWithChildren<StyledContainerProps>> = (props) => {
    const { children, component = 'div', width = 'xl', className } = props;
    return (
        <Container className={clsx(styles.root, className)} component={component} maxWidth={width}>
            {children}
        </Container>
    );
};
