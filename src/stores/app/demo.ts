import { $isLoggedIn } from './auth';

export enum AppMode {
    Demo,
    Normal,
}

export const $isDemoMode = $isLoggedIn.map((value) => !value);
export const $currentMode = $isLoggedIn.map((value) => (value ? AppMode.Normal : AppMode.Demo));
