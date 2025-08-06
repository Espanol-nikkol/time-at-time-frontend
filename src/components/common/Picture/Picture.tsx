import { type CSSProperties, FC } from 'react';

import { clsx } from 'clsx';

import styles from 'components/common/Picture/Picture.module.scss';

export type Images = {
    '1x': string;
    '2x': string;
};

type ClassKey = 'root' | 'image';

type PictureProps = {
    images: Images;
    width: number;
    height: number;
    alt: string;
} & ClassesProp<ClassKey>;

export const Picture: FC<PictureProps> = (props) => {
    const { images, width, height, alt, classes } = props;
    return (
        <picture className={clsx(styles.root, classes?.root)}>
            <source srcSet={images['2x']} media="(min-resolution: 2dppx)" width={width * 2} height={height * 2} />
            <img
                src={images['1x']}
                srcSet={`${images['2x']} 2x`}
                width={width}
                height={height}
                alt={alt}
                className={clsx(styles.image, classes?.image)}
                style={{ '--width': `${width}px`, '--height': `${height}px` } as CSSProperties}
            />
        </picture>
    );
};
