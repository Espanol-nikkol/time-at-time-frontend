const TOKEN_KEY = 'token';

export const saveToken = (token: string) => {
    window.localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => window.localStorage.getItem(TOKEN_KEY);

export const removeToken = () => {
    window.localStorage.removeItem(TOKEN_KEY);
};
