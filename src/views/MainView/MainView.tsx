import { FC } from 'react';

import { Button, Typography } from '@mui/material';
import { useUnit } from 'effector-react';

import { UserStatus } from '@domains/user';

import { $settings, settingsModalApi } from '@stores/settings';
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

// TODO: add skeleton wrapper
const getUserStatusByDeltaTime = (value: number) => {
    if (value >= 180) return UserStatus.WorkExtra;

    if (90 <= value && value < 180) return UserStatus.Work;

    if (0 < value && value < 90) return UserStatus.WorkLight;

    if (-90 < value && value < 0) return UserStatus.RelaxLight;

    if (-180 < value && value <= -90) return UserStatus.Relax;

    if (value <= -180) return UserStatus.RelaxExtra;

    return UserStatus.Neutral;
};

export const MainView: FC = () => {
    const { statistic, settings } = useUnit({ statistic: $statistic, settings: $settings });

    const restTime = statistic?.restTime ?? 0;
    const productiveTime = statistic?.productiveTime ?? 0;
    const countRecord = statistic?.countRecords ?? 0;
    const statisticLength = statistic?.streak ?? 0;

    const handleSettingsClick = () => {
        settingsModalApi.open();
    };

    const deltaTime = productiveTime / (settings?.ratioProductiveTimeToRestTime ?? 1) - restTime;
    const status = getUserStatusByDeltaTime(deltaTime);

    return (
        <CommonLayout className={styles.root}>
            <StyledContainer className={styles.topContainer}>
                <div className={styles.header}>
                    <Typography variant="caption" className={styles.infoChip}>
                        <Typography variant="captionBranded">{countRecord}</Typography>{' '}
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
                    <Gauge deltaTime={deltaTime} className={styles.gauge} />
                    <Avatar status={status} />
                    <UserStatusCaption status={status} classes={{ title: styles.statusTitle }} />
                </div>
            </StyledContainer>
            <StyledContainer className={styles.controlsContainer}>
                <TimeControlTabs classes={{ tab: styles.tab }} />
            </StyledContainer>

            <SettingsModal />
        </CommonLayout>
    );
};
