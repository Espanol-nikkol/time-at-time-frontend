import { FC, useEffect } from 'react';

import { Typography } from '@mui/material';
import { secondsToMilliseconds } from 'date-fns';
import { Link, useNavigate } from 'react-router';

import { Routes, routeToPathMap } from '@routes';

const MAIN_REDIRECT_TIMEOUT = secondsToMilliseconds(2);

export const RegisterSuccess: FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timeoutId = setTimeout(() => navigate(routeToPathMap[Routes.Main]), MAIN_REDIRECT_TIMEOUT);
        return () => clearTimeout(timeoutId);
    }, [navigate]);

    return (
        <div>
            <Typography>
                Через несколько секунд вы будете направлены на главную страницу Time At Time.
                <br />
                Если этого не произошло, нажмите на кнопку ниже
            </Typography>
            <Link to={routeToPathMap[Routes.Main]}>Перейти в Time At Time</Link>
        </div>
    );
};
