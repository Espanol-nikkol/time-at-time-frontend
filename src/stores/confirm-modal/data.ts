import { createApi } from 'effector';
import { constant } from 'fp-ts/function';

import { confirmModalDomain } from './domain';

import { clearedSession } from '../app';

export type ConfirmModalState = {
    title: string;
    message?: string;
    action: () => Promise<unknown>;
    buttonLabels?: {
        submit?: string;
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
// export const doActionWithConfirm2 = confirmModalDomain.event<DoActionWithConfirmPayload>();
//
// sample({
//     clock: doActionWithConfirm,
//     filter: (payload) => payload.isRequiredConfirm,
//     target: confirmModalApi.open,
// });

// split({
//     clock: doActionWithConfirm2,
//     source: doActionWithConfirm2,
//     cases: {
//         a: () => false,
//     },
//     match: {
//         a: confirmModalApi.open,
//     },
// });

export const doActionWithConfirm = (payload: DoActionWithConfirmPayload) => {
    const { isRequiredConfirm, ...modalPayload } = payload;

    if (isRequiredConfirm) {
        confirmModalApi.open(modalPayload);
        return;
    }
    payload.action();
};
