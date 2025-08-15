import { type CSSProperties, FC } from 'react';

import { clsx } from 'clsx';

import { Button, LinearProgress, List, ListItem, Skeleton, Typography } from '@mui/material';
import { type Duration, formatDuration } from 'date-fns';
import { minutesInHour } from 'date-fns/constants';
import { useUnit } from 'effector-react';

import { fetchStatisticFx } from '@stores/statistic';

import styles from './TimeControlBlock.module.scss';

import RotateClockwise from '@assets/icons/rotate-clockwise.svg?react';

const timeValues: Duration[] = [
    { minutes: 5 },
    { minutes: 10 },
    { minutes: 15 },
    { minutes: 20 },
    { minutes: 30 },
    { hours: 1 },
    { hours: 1, minutes: 30 },
    { hours: 2 },
];

const getTimeCaption = (value: Duration) => {
    const { hours = 0, minutes = 0 } = value;

    if (hours === 0 && minutes === 0) return;

    if (hours === 0) {
        return (
            <>
                <span className={styles.controlValue}>{minutes}</span>
                <span className={styles.controlCaption}>мин</span>
            </>
        );
    }

    if (minutes === 0) {
        return (
            <>
                <span className={styles.controlValue}>{hours}</span>
                <span className={styles.controlCaption}>ч</span>
            </>
        );
    }

    return (
        <>
            <span className={styles.controlValue}>{hours}</span>
            <span className={styles.controlValue}>{minutes}</span>
            <span className={styles.controlCaption}>ч</span>
            <span className={styles.controlCaption}>мин</span>
        </>
    );
};

const MAX_PROGRESS_VALUE = 1000;

const normalizeCurrentTime = (value: number) => Math.min(100, (value * 100) / MAX_PROGRESS_VALUE);

type TimeControlBlockProps = {
    currentTime?: number;
    onChange: (value: number) => void;
    onReset: () => void;
    caption?: string;
    className?: string;
};

export const TimeControlBlock: FC<TimeControlBlockProps> = (props) => {
    const { currentTime, onChange, onReset, caption, className } = props;

    const { isLoading } = useUnit({ isLoading: fetchStatisticFx.pending });

    const handleChange = (duration: Duration) => {
        const { hours = 0, minutes = 0 } = duration;

        onChange(minutes + hours * minutesInHour);
    };

    return (
        <div className={clsx(styles.root, className)}>
            <div className={styles.barContainer}>
                <Typography variant="body2" className={styles.barTitle}>
                    На этой неделе:
                </Typography>
                <Typography variant="body2" className={styles.barValue}>
                    {currentTime === undefined && isLoading ? <Skeleton /> : <>{currentTime} мин</>}
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={normalizeCurrentTime(currentTime ?? 0)}
                    className={styles.bar}
                />
            </div>
            <div className={styles.controlsContainer}>
                <Typography variant="body2" className={styles.controlsTitle}>
                    Добавить время:
                </Typography>
                <List className={styles.controls} disablePadding>
                    {timeValues.map((value) => (
                        <ListItem key={formatDuration(value)} disablePadding className={styles.controlItem}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleChange(value)}
                                className={styles.control}
                                style={{ '--count-columns': Object.keys(value).length } as CSSProperties}
                            >
                                {getTimeCaption(value)}
                            </Button>
                        </ListItem>
                    ))}
                </List>
                <Button variant="text" onClick={onReset} className={styles.resetButton} fullWidth>
                    <Typography variant="body2" className={styles.resetButtonCaption}>
                        <RotateClockwise />
                        Удалить записи за эту неделю
                    </Typography>
                </Button>
                {caption !== undefined && (
                    <Typography variant="caption" className={styles.caption}>
                        {caption}
                    </Typography>
                )}
            </div>
        </div>
    );
};
