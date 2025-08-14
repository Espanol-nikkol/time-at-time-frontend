export type User = {
    id: string;
    email: string;
    name: string;
    settings: UserSettings;
};

export type UserSettings = {
    ratioProductiveTimeToRestTime: number;
};

export enum UserStatus {
    Neutral = 'Neutral',
    WorkLight = 'WorkLight',
    Work = 'Work',
    WorkExtra = 'WorkExtra',
    RelaxLight = 'RelaxLight',
    Relax = 'Relax',
    RelaxExtra = 'RelaxExtra',
}
