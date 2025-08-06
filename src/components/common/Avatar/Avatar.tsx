import { FC } from 'react';

import { UserStatus } from '@domains/user';

import { Picture } from '@components/common/Picture/Picture';

import NeutralImage from '@assets/images/avatar-neutral.png';
import NeutralImage2x from '@assets/images/avatar-neutral@2x.png';
import RelaxExtraImage from '@assets/images/avatar-relax-extra.png';
import RelaxExtraImage2x from '@assets/images/avatar-relax-extra@2x.png';
import RelaxLightImage from '@assets/images/avatar-relax-light.png';
import RelaxLightImage2x from '@assets/images/avatar-relax-light@2x.png';
import RelaxImage from '@assets/images/avatar-relax.png';
import RelaxImage2x from '@assets/images/avatar-relax@2x.png';
import WorkExtraImage from '@assets/images/avatar-work-extra.png';
import WorkExtraImage2x from '@assets/images/avatar-work-extra@2x.png';
import WorkLightImage from '@assets/images/avatar-work-light.png';
import WorkLightImage2x from '@assets/images/avatar-work-light@2x.png';
import WorkImage from '@assets/images/avatar-work.png';
import WorkImage2x from '@assets/images/avatar-work@2x.png';

type AvatarProps = {
    status: UserStatus;
};

type Images = {
    '1x': string;
    '2x': string;
};

const userStatusToPictureMap: Record<UserStatus, Images> = {
    [UserStatus.Neutral]: {
        '1x': NeutralImage,
        '2x': NeutralImage2x,
    },
    [UserStatus.WorkLight]: {
        '1x': WorkLightImage,
        '2x': WorkLightImage2x,
    },
    [UserStatus.Work]: {
        '1x': WorkImage,
        '2x': WorkImage2x,
    },
    [UserStatus.WorkExtra]: {
        '1x': WorkExtraImage,
        '2x': WorkExtraImage2x,
    },
    [UserStatus.RelaxLight]: {
        '1x': RelaxLightImage,
        '2x': RelaxLightImage2x,
    },
    [UserStatus.Relax]: {
        '1x': RelaxImage,
        '2x': RelaxImage2x,
    },
    [UserStatus.RelaxExtra]: {
        '1x': RelaxExtraImage,
        '2x': RelaxExtraImage2x,
    },
};

// TODO: add captions
const userStatusToCaptionMap: Record<UserStatus, string> = {
    [UserStatus.Neutral]: '',
    [UserStatus.WorkLight]: '',
    [UserStatus.Work]: '',
    [UserStatus.WorkExtra]: '',
    [UserStatus.RelaxLight]: '',
    [UserStatus.Relax]: '',
    [UserStatus.RelaxExtra]: '',
};

export const Avatar: FC<AvatarProps> = (props) => {
    const { status } = props;
    const images = userStatusToPictureMap[status];
    return <Picture images={images} width={340} height={295} alt={userStatusToCaptionMap[status]} />;
};
