import { FC, useState } from 'react';

import { clsx } from 'clsx';

import { Tab, Tabs } from '@mui/material';
import { useUnit } from 'effector-react';

import { doActionWithConfirm } from '@stores/confirm-modal';
import { $statistic } from '@stores/statistic';
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

// TODO: дебаунс с кумулятивным эффектом, чтобы можно было накликать, а отправлялось одним запросом
export const TimeControlTabs: FC<TimeControlBlockProps> = (props) => {
    const { classes } = props;

    const { statistic } = useUnit({ statistic: $statistic });

    const [mode, setMode] = useState(Mode.Rest);

    const handleReset = (mode: Mode) => () => {
        doActionWithConfirm({
            action: mode === Mode.Rest ? resetRestTimeFx : resetProductiveTimeFx,
            isRequiredConfirm: true,
            title: (
                <>
                    Действительно хотите удалить записи о&nbsp;
                    <span className={styles.accent}>
                        {mode === Mode.Rest ? 'восстановительном' : 'продуктивном'}
                    </span>{' '}
                    отдыхе?
                </>
            ),
            message: 'Это действие нельзя отменить. Оно приведет к\u00a0пересчету статистики за\u00a0эту неделю',
            buttonLabels: {
                submit: 'Да, удалить',
                cancel: 'Не хочу',
            },
        });
    };

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
                    onReset={handleReset(Mode.Rest)}
                    caption={modeToCaptionMap[Mode.Rest]}
                    className={classes?.tab}
                />
            </TabContent>
            <TabContent value={Mode.Create} isSelected={mode === Mode.Create}>
                <TimeControlBlock
                    currentTime={statistic?.productiveTime}
                    onChange={createTimeProductiveFx}
                    onReset={handleReset(Mode.Create)}
                    caption={modeToCaptionMap[Mode.Create]}
                    className={classes?.tab}
                />
            </TabContent>
        </div>
    );
};
