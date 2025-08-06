import { CSSProperties, FC } from 'react';

import { ListItem } from '@mui/material';

import { TimeControlData } from '@domains/time-control';

import styles from './TimeControls.module.scss';

type TimeControlProps = {
    data: TimeControlData;
    row: number;
    column: number;
    onChange: (value: number) => void;
};

export const TimeControl: FC<TimeControlProps> = (props) => {
    const { data, row, onChange, column } = props;

    return (
        <ListItem
            disableGutters
            disablePadding
            key={data.value}
            className={styles.controlItem}
            style={{ '--grid-column': column, '--grid-row': row } as CSSProperties}
        >
            <button type="button" onClick={() => onChange(data.value)}>
                {data.caption}
            </button>
        </ListItem>
    );
};
