import type { ReactNode } from 'react';

import { createApi } from 'effector';
import { constant } from 'fp-ts/function';

import { clearedSession } from '@stores/app';

import { confirmModalDomain } from './domain';

export type ConfirmModalState = {
    title: ReactNode | string;
    message?: string;
    action: () => Promise<unknown>;
    buttonLabels?: {
        // Default - "Да"
        submit?: string;
        // Default - "Нет"
        cancel?: string;
    };
};

type State = {
    isOpen: boolean;
    modal: ConfirmModalState | null;
};

const initialState: State = {
    isOpen: false,
    modal: null,
};

export const $confirmModal = confirmModalDomain.store<State>(initialState).reset(clearedSession);

export const confirmModalApi = createApi($confirmModal, {
    open: (_, modal: ConfirmModalState) => ({ isOpen: true, modal }),
    close: constant(initialState),
});

type DoActionWithConfirmPayload = ConfirmModalState & {
    isRequiredConfirm: boolean;
};

export const doActionWithConfirm = (payload: DoActionWithConfirmPayload) => {
    const { isRequiredConfirm, ...modalPayload } = payload;

    if (isRequiredConfirm) {
        confirmModalApi.open(modalPayload);
        return;
    }
    payload.action();
};
