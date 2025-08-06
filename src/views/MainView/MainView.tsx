import { FC } from 'react';

import { Button, Typography } from '@mui/material';
import { useUnit } from 'effector-react';

import { UserStatus } from '@domains/user';

import { $settings } from '@stores/app';
import { settingsModalApi } from '@stores/app/settings';
import { $statistic } from '@stores/statistic';

import { pluralize } from '@utils/pluralize';

import { CommonLayout } from '@layouts/CommonLayout/CommonLayout';

import { Avatar } from '@components/common/Avatar/Avatar';
import { StyledContainer } from '@components/common/StyledContainer/StyledContainer';
import { UserStatusCaption } from '@components/common/UserStatusCaption/UserStatusCaption';
import { SettingsModal } from '@components/settings/SettingsModal/SettingsModal';
import { Gauge } from '@components/time/Gauge/Gauge';
import { TimeControlTabs } from '@components/time/TimeControlTabs/TimeControlTabs';

import styles from './MainView.module.scss';

import PencilIcon from '@assets/icons/pencil.svg?react';

// type ControlItem = {
//     value: number;
//     caption: string;
// };

// const timeValues: number[] = [5, 10, 15, 30, 45, 60, 90, 120];

// const timeControls: ControlItem[] = timeValues.map((value) => ({ value, caption: `+${value}` }));

// TODO: add skeleton wrapper

export const MainView: FC = () => {
    const { statistic, settings } = useUnit({ statistic: $statistic, settings: $settings });

    const restTime = statistic?.restTime ?? 0;
    const productiveTime = statistic?.productiveTime ?? 0;
    const countRecord = statistic?.countRecords ?? 0;
    const statisticLength = statistic?.length ?? 0;

    const handleSettingsClick = () => {
        settingsModalApi.open();
    };

    return (
        <CommonLayout className={styles.root}>
            <StyledContainer className={styles.topContainer}>
                <div className={styles.header}>
                    <Typography variant="caption" className={styles.infoChip}>
                        <Typography variant="captionBranded" className={styles.infoChipValue}>
                            {countRecord}
                        </Typography>{' '}
                        {pluralize(countRecord, ['запись', 'записи', 'записей'])}
                    </Typography>
                    <Typography variant="caption" className={styles.infoChip}>
                        Серия:{' '}
                        <Typography variant="captionBranded" className={styles.infoChipValue}>
                            {statisticLength}
                        </Typography>{' '}
                        {pluralize(statisticLength, ['день', 'дня', 'дней'])}
                    </Typography>
                    <Button variant="text" onClick={handleSettingsClick} className={styles.settingsButton}>
                        <Typography variant="caption">
                            Вес созидательного: {settings?.ratioProductiveTimeToRestTime ?? 0}
                        </Typography>
                        <PencilIcon className={styles.editIcon} />
                    </Button>
                </div>
                <div className={styles.statisticContainer}>
                    <Gauge deltaTime={restTime - productiveTime} className={styles.gauge} />
                    <Avatar status={UserStatus.Neutral} />
                    <UserStatusCaption status={UserStatus.Neutral} classes={{ title: styles.statusTitle }} />
                </div>
            </StyledContainer>
            <StyledContainer className={styles.controlsContainer}>
                <TimeControlTabs classes={{ tab: styles.tab }} />
            </StyledContainer>

            <SettingsModal />
        </CommonLayout>
    );
};
