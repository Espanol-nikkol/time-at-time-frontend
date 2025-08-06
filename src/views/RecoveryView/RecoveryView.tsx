import { FC, useEffect, useState } from 'react';

import { constant } from 'fp-ts/function';
import { useSearchParams } from 'react-router';
import { match } from 'ts-pattern';

import { Routes, routeToPathMap } from '@routes';

import { LoginLayout } from '@layouts/LoginLayout/LoginLayout';

import { NewPasswordForm } from '@components/auth/NewPasswordForm/NewPasswordForm';
import { RecoveryForm } from '@components/auth/RecoveryForm/RecoveryForm';
import { RecoverySuccess } from '@components/auth/RecoveryForm/RecoverySuccess';

enum Step {
    Form = 'form',
    Success = 'success',
    NewPassword = 'newPassword',
}

export const RecoveryView: FC = () => {
    const [step, setStep] = useState(Step.Form);
    const [isLoading, setIsLoading] = useState(true);
    const [params] = useSearchParams();

    const code = params.get('code');

    const handleSubmit = () => setStep(Step.Success);

    const { title, content, backLink } = match(step)
        .with(
            Step.Form,
            constant({
                title: 'Восстановление пароля',
                content: <RecoveryForm onSubmit={handleSubmit} />,
                backLink: routeToPathMap[Routes.Login],
            })
        )
        .with(
            Step.Success,
            constant({
                title: 'Подтвердите почту',
                content: <RecoverySuccess />,
                //     // TODO: проверить, что при переходе по ссылке на себя же сбросится стейт
                backLink: routeToPathMap[Routes.PasswordRecovery],
            })
        )
        .with(
            Step.NewPassword,
            constant({
                title: 'Создайте новый пароль',
                content: <NewPasswordForm code={code} />,
                // TODO: may be not
                backLink: routeToPathMap[Routes.PasswordRecovery],
            })
        )
        .exhaustive();

    // const content = match(step)
    //     .with(Step.Form, constant(<RecoveryForm onSubmit={handleSubmit} />))
    //     .with(Step.Success, constant(<RecoverySuccess />))
    //     .with(Step.NewPassword, constant(<NewPasswordForm code={code} />))
    //     .exhaustive();
    //
    // const backLink = match(step)
    //     .with(Step.Form, constant(routeToPathMap[Routes.Login]))
    //     .with(Step.Success, constant(routeToPathMap[Routes.PasswordRecovery]))
    //     .otherwise(constUndefined);

    useEffect(() => {
        if (code !== null) {
            setStep(Step.NewPassword);
        }
        setIsLoading(false);
    }, [code]);

    // TODO: check behaviour without loader
    // TODO: loader
    if (isLoading) return <div>LOADER</div>;

    return (
        <LoginLayout title={title} backLink={backLink}>
            {content}
        </LoginLayout>
    );
};
