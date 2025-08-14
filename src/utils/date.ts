import { format, parse } from 'date-fns';
import { endOfWeek, startOfWeek } from 'date-fns/fp';
import { pipe } from 'fp-ts/function';

import { Iso } from '@domains/common';
import { PeriodPayload } from '@domains/time';

export const formatDate = (date: Date) => format(date, 'dd.MM.yyyy');
const parseDate = (dateString: string) => parse(dateString, 'dd.MM.yyyy', new Date());

export const ApiDateIso: Iso<Date, string> = {
    get: formatDate,
    from: parseDate,
};

export const getDefaultPeriod = (): PeriodPayload => ({
    startDate: pipe(new Date(), startOfWeek, ApiDateIso.get),
    endDate: pipe(new Date(), endOfWeek, ApiDateIso.get),
});