import { CSSProperties } from 'react';

import {
    TypographyVariant as _TypographyVariant,
    TypographyVariantsOptions as _TypographyVariantsOptions,
} from '@mui/material';

declare module '@mui/material/styles' {
    interface TypographyVariant extends _TypographyVariant {
        captionBranded: CSSProperties;
        h5Branded: CSSProperties;
        body2: CSSProperties;
        body2Bold: CSSProperties;
    }

    interface TypographyVariantsOptions extends _TypographyVariantsOptions {
        captionBranded?: CSSProperties;
        h5Branded?: CSSProperties;
        body2?: CSSProperties;
        body2Bold?: CSSProperties;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        captionBranded: true;
        h5Branded: true;
        body2: true;
        body2Bold: true;
    }
}
