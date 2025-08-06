import { createApi } from 'effector';

import type { UserSettings } from '@domains/user';

import { clearedSession } from './auth';
import { appDomain } from './domain';
import { $user } from './user';

export const updateSettingsFx = appDomain.effect<Partial<UserSettings>, UserSettings>((payload) => {
    console.log(`update settings with ${payload}`);
    return { ratioProductiveTimeToRestTime: payload?.ratioProductiveTimeToRestTime ?? 2 };
});

export const $settings = $user.map((user) => user?.settings ?? null);

type SettingsModalState = {
    isOpen: boolean;
};

const settingsModalInitialState: SettingsModalState = {
    isOpen: false,
};

export const $settingsModal = appDomain.store(settingsModalInitialState, { name: 'settings' }).reset(clearedSession);

export const settingsModalApi = createApi($settingsModal, {
    open: () => ({ isOpen: true }),
    close: () => ({ isOpen: false }),
});
