import React from 'react';

import { type ProviderContext, useSnackbar, VariantType } from 'notistack';

import { SNACK_BAR_AUTO_HIDE_DURATION } from './constants';

let snackbarRef: ProviderContext;

export const SnackbarUtilsConfigurator: React.FC = () => {
    snackbarRef = useSnackbar();
    return null;
};

export const SnackBar = {
    toast(message: string, variant: VariantType = 'default'): void {
        snackbarRef.enqueueSnackbar(message, {
            variant,
            autoHideDuration: SNACK_BAR_AUTO_HIDE_DURATION,
            persist: false,
            preventDuplicate: true,
            anchorOrigin: {
                horizontal: 'right',
                vertical: 'top',
            },
        });
    },

    success(message: string): void {
        this.toast(message, 'success');
    },

    warning(message: string): void {
        this.toast(message, 'warning');
    },

    info(message: string): void {
        this.toast(message, 'info');
    },

    error(message: string) {
        console.log(this);
        this.toast(message, 'error');
    },
};
