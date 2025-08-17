import * as React from 'react';
import { FC, type HTMLProps, PropsWithChildren } from 'react';

import { clsx } from 'clsx';

import { Breakpoint, Container } from '@mui/material';

import styles from './StyledContainer.module.scss';

type StyledContainerProps = {
    component?: React.ElementType;
    width?: Breakpoint;
    className?: string;
} & HTMLProps<HTMLDivElement>;

export const StyledContainer: FC<PropsWithChildren<StyledContainerProps>> = (props) => {
    const { children, component = 'div', width = 'xl', className, ...htmlProps } = props;
    return (
        <Container className={clsx(styles.root, className)} component={component} maxWidth={width} {...htmlProps}>
            {children}
        </Container>
    );
};
