import { type CSSProperties, type FC, useState } from 'react';

import { clsx } from 'clsx';

import { Button, Collapse, Typography } from '@mui/material';
import { SimpleTreeView, type SimpleTreeViewProps, TreeItem } from '@mui/x-tree-view';

import type { Article } from '@domains/article';

import styles from './Contents.module.scss';

import ContentsIcon from '@assets/icons/contents.svg?react';

type ContentsProps = {
    className?: string;
    data: Article;
};

export const Contents: FC<ContentsProps> = (props) => {
    const { className, data } = props;

    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick: SimpleTreeViewProps<false>['onItemClick'] = (_, id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const expandedItems =
        data.content?.paragraphs?.reduce(
            (items, item, index) => [
                ...items,
                `item-${index}`,
                ...(item.paragraphs?.map((_, subItemIndex) => `item-${index}-subitem-${subItemIndex}`) ?? []),
            ],
            ['title']
        ) ?? [];

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
                    onItemClick={handleClick}
                    expandedItems={expandedItems}
                    slotProps={{
                        collapseIcon: { className: styles.icon },
                        root: {
                            className: styles.rootItem,
                            style: { '--TreeView-itemChildrenIndentation': '4px' } as CSSProperties,
                        },
                    }}
                >
                    {data.content.title !== undefined && (
                        <TreeItem
                            itemId="title"
                            label={
                                <Typography variant="body2" className={styles.subtitle}>
                                    {data.content.title}
                                </Typography>
                            }
                            classes={{ content: styles.item, label: styles.label }}
                        >
                            {data.content.paragraphs?.map((item, index) => {
                                const itemIdPrefix = `item-${index}`;
                                return (
                                    <TreeItem
                                        itemId={itemIdPrefix}
                                        key={itemIdPrefix}
                                        label={
                                            <Typography variant="body2" className={styles.subtitle}>
                                                {item.title}
                                            </Typography>
                                        }
                                        classes={{ content: styles.subitem, label: styles.label }}
                                        slotProps={{
                                            groupTransition: {
                                                style: {
                                                    '--TreeView-itemChildrenIndentation': '12px',
                                                } as CSSProperties,
                                            },
                                        }}
                                    >
                                        {item.paragraphs?.map((subItem, subItemIndex) => {
                                            const subItemIdPrefix = `${itemIdPrefix}-subitem-${subItemIndex}`;
                                            return (
                                                <TreeItem
                                                    itemId={subItemIdPrefix}
                                                    key={subItemIdPrefix}
                                                    label={
                                                        <Typography variant="body2" className={styles.subtitle}>
                                                            {subItem.title ?? subItem.subtitle}
                                                        </Typography>
                                                    }
                                                    classes={{ label: styles.label }}
                                                ></TreeItem>
                                            );
                                        })}
                                    </TreeItem>
                                );
                            })}
                        </TreeItem>
                    )}
                </SimpleTreeView>
            </Collapse>
        </div>
    );
};
