import { createRef, JSX } from 'react';

import { Close } from '@mui/icons-material';
import { createTheme, IconButton, Shadows, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { ruRU } from '@mui/material/locale';
import { useGate } from 'effector-react';
import { SnackbarKey, SnackbarProvider } from 'notistack';
import { Route, Routes as RoutesComponent } from 'react-router';

import { routes, Routes } from '@routes';

import { AppGate } from '@stores/app';

import { SnackbarUtilsConfigurator } from '@utils/snackbar';

import { ArticlesView } from '@views/ArticlesView/ArticlesView.tsx';
import { ArticleView } from '@views/ArticleView/ArticleView';
import { LoginView } from '@views/LoginView/LoginView';
import { MainView } from '@views/MainView/MainView.tsx';
import { RecoveryView } from '@views/RecoveryView/RecoveryView';
import { RegisterView } from '@views/RegisterView/RegisterView';

import { ConfirmModal } from '@components/common/ConfirmModal/ConfirmModal';

const theme = createTheme(
    {
        breakpoints: {
            values: {
                xs: 425,
                sm: 640,
                md: 900,
                lg: 1000,
                xl: 1200,
            },
        },
        // TODO: разобраться с палитрой
        // palette: {
        //     primary: {
        //         main: '#2f6dcb',
        //         dark: '#20242b',
        //         light: '#b4bbc5',
        //     },
        //     text: {
        //         primary: '#ffffff',
        //         secondary: '#0C1015',
        //     },
        //     divider: '#e6e9ee',
        // },
        typography: {
            fontFamily: `"Manrope", sans-serif`,
        },
        // TODO: разобраться с тенями
        shadows: Array(25).fill('none') as Shadows,
        components: {
            MuiTypography: {
                defaultProps: {
                    variantMapping: {
                        // TODO: подумать над заголовками
                        captionBranded: 'span',
                        h5Branded: 'h5',
                        body2: 'span',
                        body2Bold: 'span',
                    },
                },
            },
        },
    },
    ruRU
);

const routeElementByNameMap: Record<Routes, JSX.Element> = {
    [Routes.Main]: <MainView />,
    [Routes.Articles]: <ArticlesView />,
    [Routes.Article]: <ArticleView />,
    [Routes.Login]: <LoginView />,
    [Routes.PasswordRecovery]: <RecoveryView />,
    [Routes.Register]: <RegisterView />,
};

// TODO: включить реакт компилер
export const App = () => {
    const notistackRef = createRef<SnackbarProvider>();

    const onClickDismiss = (key: SnackbarKey) => () => {
        if (notistackRef.current === null) return;
        notistackRef.current.closeSnackbar(key);
    };

    useGate(AppGate);

    return (
        <SnackbarProvider
            maxSnack={3}
            ref={notistackRef}
            action={(key) => (
                <IconButton size="small" color="inherit" onClick={onClickDismiss(key)}>
                    <Close />
                </IconButton>
            )}
        >
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <SnackbarUtilsConfigurator />
                    <RoutesComponent>
                        {routes.map((route) => (
                            <Route key={route.name} path={route.path} element={routeElementByNameMap[route.name]} />
                        ))}
                    </RoutesComponent>
                    <ConfirmModal />
                </ThemeProvider>
            </StyledEngineProvider>
        </SnackbarProvider>
    );
};
