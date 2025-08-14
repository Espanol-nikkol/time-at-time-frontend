import { FC, useState } from 'react';

import { clsx } from 'clsx';

import { Tab, Tabs } from '@mui/material';
import { useUnit } from 'effector-react';

import { $statistic, fetchStatisticFx } from '@stores/statistic';
import { createTimeProductiveFx, createTimeRestFx, resetProductiveTimeFx, resetRestTimeFx } from '@stores/time';

import { TabContent } from '@components/common/TabContent/TabContent';
import { TimeControlBlock } from '@components/time/TimeControlBlock/TimeControlBlock';

import styles from './TimeControlTabs.module.scss';

type Classes = 'tabs' | 'tab';

type TimeControlBlockProps = ClassesProp<Classes>;

enum Mode {
    Rest = 'rest',
    Create = 'create',
}

const modeToCaptionMap: Record<Mode, string> = {
    [Mode.Create]:
        'Созидательный отдых\u00a0\u2014 это время, затраченное на\u00a0совершенствование себя и\u00a0мира вокруг. Занятия спортом, чтение, решение бытовых вопросов',
    [Mode.Rest]:
        'Восстановительный отдых\u00a0\u2014 это время, потраченное на\u00a0отвлечение от\u00a0основной деятельности, например, видеоигры или просмотр сериалов',
};

export const TimeControlTabs: FC<TimeControlBlockProps> = (props) => {
    const { classes } = props;

    const { statistic, isLoading } = useUnit({ statistic: $statistic, isLoading: fetchStatisticFx.pending });

    const [mode, setMode] = useState(Mode.Rest);

    return (
        <div className={clsx(styles.root)}>
            <Tabs
                value={mode}
                onChange={(_, value) => setMode(value)}
                classes={{
                    root: clsx(styles.tabPanelRoot, classes?.tabs),
                    list: styles.tabPanel,
                    indicator: styles.indicator,
                }}
            >
                {/* TODO: правило на сокращенные теги */}
                {/* TODO: разобраться с aria-label */}
                <Tab
                    label="Восстановительно"
                    value={Mode.Rest}
                    aria-label={`simple-tab-${Mode.Rest}`}
                    classes={{ root: styles.tabButton, selected: styles.isSelected }}
                />
                <Tab
                    label="Созидательно"
                    value={Mode.Create}
                    aria-label={`simple-tab-${Mode.Create}`}
                    classes={{ root: styles.tabButton, selected: styles.isSelected }}
                />
            </Tabs>
            <TabContent value={Mode.Rest} isSelected={mode === Mode.Rest}>
                <TimeControlBlock
                    currentTime={statistic?.restTime}
                    onChange={createTimeRestFx}
                    onReset={resetRestTimeFx}
                    caption={modeToCaptionMap[Mode.Rest]}
                    className={classes?.tab}
                />
            </TabContent>
            <TabContent value={Mode.Create} isSelected={mode === Mode.Create}>
                <TimeControlBlock
                    currentTime={statistic?.productiveTime}
                    onChange={createTimeProductiveFx}
                    onReset={resetProductiveTimeFx}
                    caption={modeToCaptionMap[Mode.Create]}
                    className={classes?.tab}
                />
            </TabContent>
        </div>
    );
};
