import { setDefaultOptions } from 'date-fns';
import { ru } from 'date-fns/locale';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { App } from './App';

import '@styles/global.scss';
import '@styles/vendor/mui/index.scss';

setDefaultOptions({
    weekStartsOn: 1,
    locale: ru,
});

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
