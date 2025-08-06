import { FC } from 'react';

import { clsx } from 'clsx';

import { pipe } from 'fp-ts/function';
import { GaugeComponent, SubArc } from 'react-gauge-component';

import { maxFp, minFp } from '@utils/math';

import styles from './Gauge.module.scss';

// TODO: попробовать другой график
// import {Gauge} from '@mui/x-charts';

type GaugeProps = {
    deltaTime: number;
    className?: string;
};

const MINUTE_LIMIT = 240;

// const ticks: Tick[] = A.makeBy((MINUTE_LIMIT * 2) / minutesInHour, (hour) => ({
//     value: -MINUTE_LIMIT + minutesInHour * hour,
// }));

const ARC_LIMITS: (number | undefined)[] = [-240, -180, -120, -60, 0, 60, 120, 180, 240];
const getSubArcs = (currentValue: number): SubArc[] =>
    ARC_LIMITS.map((limit, index, array) => {
        const bottom = array[index - 1] ?? MINUTE_LIMIT * -1 - 60;
        const up = limit ?? MINUTE_LIMIT + 60;
        let color = bottom <= currentValue && currentValue < up ? 'white' : 'rgba(255, 255, 255, 0.35)';

        if (index === array.length - 1) {
            color = bottom <= currentValue && currentValue <= up ? 'white' : 'rgba(255, 255, 255, 0.35)';
        }

        if (currentValue === 0)
            return {
                limit,
                color: 'rgba(255, 255, 255, 0.35)',
            };
        return {
            limit,
            color,
        };
    });

// вызвать принудительное колыхание, когда значение больше макс/мин

export const Gauge: FC<GaugeProps> = (props) => {
    const { deltaTime, className } = props;
    const normalizedValue = pipe(deltaTime, maxFp(-MINUTE_LIMIT), minFp(MINUTE_LIMIT));

    return (
        <GaugeComponent
            value={normalizedValue}
            type="radial"
            minValue={-MINUTE_LIMIT}
            maxValue={MINUTE_LIMIT}
            labels={{
                tickLabels: {
                    ticks: undefined,
                    hideMinMax: true,
                },
                valueLabel: {
                    hide: true,
                },
            }}
            arc={{
                subArcs: getSubArcs(normalizedValue),
                padding: 0,
                cornerRadius: 20,
                width: 0.1,
            }}
            pointer={{
                elastic: true,
                type: 'blob',
                width: 10,
                baseColor: '#A3AEBD',
                strokeWidth: 4,
            }}
            className={clsx(styles.root, className)}
        />
    );
};
