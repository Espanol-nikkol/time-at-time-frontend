import { FC } from 'react';

import { clsx } from 'clsx';

import { List } from '@mui/material';

import { TimeControlData } from '@domains/time-control';

import { TimeControl } from '@components/time/TimeControlsOld/TimeControl';

import styles from './TimeControls.module.scss';

const TIME_SECTION_COLUMN_COUNT = 4;

enum Direction {
    Down,
    Right,
    Up,
}

type TimeControlsProps = {
    items: TimeControlData[];
    onChange: (value: number) => void;
    className?: string;
};

type Position = {
    row: number;
    column: number;
};

export const TimeControlsOld: FC<TimeControlsProps> = (props) => {
    const { items, onChange, className } = props;

    const countControls = items.length;
    const countVerticalControls = countControls - TIME_SECTION_COLUMN_COUNT;
    const countControlsInColumn = Math.floor(countVerticalControls / 2);

    if (countVerticalControls % 2 !== 0) {
        console.error('Кнопки управления распределены не равномерно!');
    }

    const calcDirectionByIndex = (index: number) => {
        if (index < countControlsInColumn) {
            return Direction.Down;
        } else if (index < countControlsInColumn + TIME_SECTION_COLUMN_COUNT) {
            return Direction.Right;
        }
        return Direction.Up;
    };

    const calcPositionByIndex = (index: number): Position => {
        const direction = calcDirectionByIndex(index);
        let column = 1;
        let row = 1;

        if (direction === Direction.Down) {
            column = 1;
            row = -(countControlsInColumn - index) - 1;
        }

        if (direction === Direction.Right) {
            column = 1 + index - countControlsInColumn;
            row = -1;
        }

        if (direction === Direction.Up) {
            column = -1;
            row = -(index - countControlsInColumn - TIME_SECTION_COLUMN_COUNT + 1) - 1;
        }
        return { row, column };
    };

    return (
        <List className={clsx(styles.controls, className)}>
            {items.map((item, index) => {
                const { row, column } = calcPositionByIndex(index);
                return <TimeControl key={item.value} data={item} row={row} column={column} onChange={onChange} />;
            })}
        </List>
    );
};
