import { createApi, sample } from 'effector';

import { $user, clearedSession, userApi } from '@stores/app';
import { displayApiError } from '@stores/effect-handling';

import type { ApiUserSettingsChangePayload, ApiUserSettingsChangeResponse } from '@api/protocol';

import { apiUserSettingsChange } from '@api';

import { settingsDomain } from './domain';

export const updateSettingsFx = settingsDomain.effect<ApiUserSettingsChangePayload, ApiUserSettingsChangeResponse>(
    apiUserSettingsChange
);

export const $settings = $user.map((user) => user?.settings ?? null);

type SettingsModalState = {
    isOpen: boolean;
};

const settingsModalInitialState: SettingsModalState = {
    isOpen: false,
};

export const $settingsModal = settingsDomain.store(settingsModalInitialState).reset(clearedSession);

export const settingsModalApi = createApi($settingsModal, {
    open: () => ({ isOpen: true }),
    close: () => ({ isOpen: false }),
});

sample({
    clock: updateSettingsFx.doneData,
    target: userApi.update,
});

sample({
    clock: updateSettingsFx.failData,
    target: displayApiError,
});
