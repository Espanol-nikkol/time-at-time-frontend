import { type CSSProperties, type FC, useState } from 'react';

import { clsx } from 'clsx';

import { Button, Collapse, Typography } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';

import styles from './Contents.module.scss';

import ContentsIcon from '@assets/icons/contents.svg?react';

type ContentsProps = {
    className?: string;
};

// TODO: данные и генерация

export const Contents: FC<ContentsProps> = (props) => {
    const { className } = props;

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={clsx(styles.root, className)}>
            <Button className={styles.headerButton} variant="text" onClick={() => setIsExpanded((prev) => !prev)}>
                <ContentsIcon className={styles.icon} />
                <Typography variant="body2" className={styles.itemTitle}>
                    Оглавление
                </Typography>
            </Button>
            <Collapse in={isExpanded}>
                <SimpleTreeView
                    expandedItems={['title', 'subtitle-1']}
                    slotProps={{
                        collapseIcon: { className: styles.icon },
                        root: {
                            className: styles.rootItem,
                            style: { '--TreeView-itemChildrenIndentation': '4px' } as CSSProperties,
                        },
                    }}
                >
                    <TreeItem
                        itemId={'title'}
                        label={
                            <Typography variant="body2" className={styles.subtitle}>
                                Терминология
                            </Typography>
                        }
                        classes={{ content: styles.item, label: styles.label }}
                    >
                        <TreeItem
                            itemId={'subtitle-1'}
                            label={
                                <Typography variant="body2" className={styles.subtitle}>
                                    Отдых
                                </Typography>
                            }
                            classes={{ content: styles.subitem, label: styles.label }}
                            slotProps={{
                                groupTransition: {
                                    style: { '--TreeView-itemChildrenIndentation': '12px' } as CSSProperties,
                                },
                            }}
                        >
                            <TreeItem
                                itemId={'subsubtitle-2'}
                                label={
                                    <Typography variant="body2" className={styles.subtitle}>
                                        Созидательный отдых
                                    </Typography>
                                }
                                classes={{ label: styles.label }}
                            ></TreeItem>
                            <TreeItem
                                itemId={'subsubtitle-3'}
                                classes={{ label: styles.label }}
                                label={
                                    <Typography variant="body2" className={styles.subtitle}>
                                        Восстановительный отдых
                                    </Typography>
                                }
                            ></TreeItem>
                            <TreeItem
                                itemId={'subsubtitle-4'}
                                classes={{ label: styles.label }}
                                label={
                                    <Typography variant="body2" className={styles.subtitle}>
                                        Базовая потребность в восстановительном отдыхе
                                    </Typography>
                                }
                            ></TreeItem>
                            <TreeItem
                                itemId={'subtitle-5'}
                                classes={{ label: styles.label, root: styles.subitem }}
                                label={
                                    <Typography variant="body2" className={styles.subtitle}>
                                        Повышенный интерес к восстановительному отдыху
                                    </Typography>
                                }
                            ></TreeItem>
                        </TreeItem>
                    </TreeItem>
                </SimpleTreeView>
            </Collapse>
        </div>
    );
};
