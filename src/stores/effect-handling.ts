import { createEffect } from 'effector';

import { SnackBar } from '@utils/snackbar';

// --- Domain ---

// --- Events ---

export const displayApiError = createEffect<Error, void>((error) => {
    SnackBar.error(error.message);
    console.error(error);
});

export const displaySuccessMessage = createEffect<string, void>((message) => {
    SnackBar.success(message);
});
