export const pluralize = (count: number, words: string[], withDigit = false): string => {
    const cases: number[] = [2, 0, 1, 1, 1, 2];
    const currentForm = words[count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]];

    if (withDigit) return `${count} ${currentForm}`;
    return currentForm;
};
