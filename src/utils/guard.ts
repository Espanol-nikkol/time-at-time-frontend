export const isValueSet = <T>(data?: T | null): data is T => data !== null && data !== undefined;
