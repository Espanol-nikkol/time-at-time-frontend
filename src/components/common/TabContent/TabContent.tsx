import { PropsWithChildren } from 'react';

type TabContentProps<T> = {
    value: T;
    isSelected: boolean;
};

export const TabContent = <T,>(props: PropsWithChildren<TabContentProps<T>>) => {
    const { children, value, isSelected } = props;
    return (
        <div role="tabpanel" hidden={!isSelected} aria-labelledby={`simple-tab-${value}`}>
            {children}
        </div>
    );
};
