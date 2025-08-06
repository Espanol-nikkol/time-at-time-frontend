export enum Routes {
    Main,
    Articles,
    Article,
    Login,
    Register,
    PasswordRecovery,
}

type RouteData = {
    name: Routes;
    title: string;
    path: string;
};

export const routeToPathMap: Record<Routes, string> = {
    [Routes.Main]: '/',
    [Routes.Articles]: '/articles',
    [Routes.Article]: '/articles/:slugId',
    [Routes.Login]: '/login',
    [Routes.Register]: '/register',
    [Routes.PasswordRecovery]: '/password-recovery',
};

export const routes: RouteData[] = [
    {
        name: Routes.Main,
        title: 'Главная',
        path: routeToPathMap[Routes.Main],
    },
    {
        name: Routes.Articles,
        title: 'Теория',
        path: routeToPathMap[Routes.Articles],
    },
    {
        name: Routes.Article,
        title: 'Статья',
        path: routeToPathMap[Routes.Article],
    },
    {
        name: Routes.Login,
        title: 'Авторизация',
        path: routeToPathMap[Routes.Login],
    },
    {
        name: Routes.Register,
        title: 'Регистрация',
        path: routeToPathMap[Routes.Register],
    },
    {
        name: Routes.PasswordRecovery,
        title: 'Восстановление пароля',
        path: routeToPathMap[Routes.PasswordRecovery],
    },
];

export const getArticleRoute = (slug: string, id: number) =>
    routeToPathMap[Routes.Article].replace(':slugId', `${slug}-${id}`);
