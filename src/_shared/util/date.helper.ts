/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { PeriodUnitEnum } from 'app/enum';
import * as moment from 'moment';

function isFutureDate(date: Date): boolean {
  // Convert string to Moment object
  const dateMoment = moment(date);

  // Check if the date is after the current moment
  return dateMoment.isAfter(moment());
}

/**
 * Checks if a given date range is correct.
 *
 * @param from - The start date of the range.
 * @param to - The end date of the range.
 * @param forFuture - Optional boolean indicating if the range should be in the future.
 * @returns A boolean indicating whether the date range is correct.
 */
function isCorrectRange(from: Date, to: Date, forFuture?: boolean): boolean {
  // Create moment objects from the dates
  const start = moment(from);
  const end = moment(to);
  if (forFuture) {
    return start.isAfter(moment()) && start.isBefore(end);
  }
  // Check if start date is before, or the same as the end date
  return start.isBefore(end);
}
function fDate(date: Date): string {
  if (date) return moment(date).format('DD.MM.YYYY HH:mm');
  return '';
}

function generateRandomDate(from: string, to: string): Date {
  const start = new Date(from);
  const end = new Date(to);
  const milliseconds = Math.random() * (end.getTime() - start.getTime()) + start.getTime();
  return new Date(milliseconds);
}

/**
 * Validates whether a given date is valid.
 *
 * @param date - The date to be validated.
 * @returns A boolean indicating whether the date is valid.
 */
function isValidDate(date: Date): boolean {
  // Try parsing the string with moment and check if it's valid
  const parsedMoment = moment(date);
  return parsedMoment.isValid();
}

function isValidDates(dates: Date[]): boolean {
  // Try parsing the string with moment and check if it's valid
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const parsedMoment = moment(date);
    if (!parsedMoment.isValid()) return false;
  }
  return true;
}

function getMomentDate(date: Date): Date {
  if (isValidDate(date)) {
    return moment(date).toDate();
  } else {
    return null as any;
  }
}

function getIntervalDates(
  interval: number,
  inFuture: boolean,
  type?: PeriodUnitEnum,
) {
  const from = new Date();
  const to = new Date();
  if (inFuture) {
    switch (type) {
      case PeriodUnitEnum.MINUTE:
        to.setMinutes(to.getMinutes() + 30);
        break;
      case PeriodUnitEnum.HOUR:
        to.setHours(to.getHours() + interval);
        break;
      case PeriodUnitEnum.DAY:
        to.setDate(to.getDate() + interval);
        break;
      case PeriodUnitEnum.MONTH:
        to.setMonth(to.getMonth() + interval);
        break;
      case PeriodUnitEnum.YEAR:
        to.setFullYear(to.getFullYear() + interval);
        break;
      default:
        to.setSeconds(to.getSeconds() + interval);
        break;
    }
  } else {
    switch (type) {
      case PeriodUnitEnum.MINUTE:
        from.setMinutes(from.getMinutes() - interval);
        break;
      case PeriodUnitEnum.HOUR:
        from.setHours(from.getHours() - interval);
        break;
      case PeriodUnitEnum.DAY:
        from.setDate(from.getDate() - interval);
        break;
      case PeriodUnitEnum.MONTH:
        from.setMonth(from.getMonth() - interval);
        break;
      case PeriodUnitEnum.YEAR:
        from.setFullYear(from.getFullYear() - interval);
        break;
      default:
        from.setSeconds(from.getSeconds() - interval);
        break;
    }
  }

  return { from, to };
}

function getDatePart(date: Date, part: PeriodUnitEnum): number {
  const momentDate = moment(date);

  switch (part) {
    case PeriodUnitEnum.WEEK:
      return momentDate.week();
    case PeriodUnitEnum.MONTH:
      return momentDate.month() + 1; // Ajouter 1 car les mois sont 0-indexés
    case PeriodUnitEnum.DAY:
      return momentDate.date();
    case PeriodUnitEnum.YEAR:
      return momentDate.year();
    default:
      throw new Error('Invalid date part');
  }
}

function getPeriodDates(period: PeriodUnitEnum): { from: Date; to: Date } {
  const momentDate = moment(new Date());
  let seperator: moment.unitOfTime.StartOf;
  switch (period) {
    case PeriodUnitEnum.WEEK:
      seperator = 'week';
      break;
    case PeriodUnitEnum.MONTH:
      seperator = 'month';
      break;
    case PeriodUnitEnum.DAY:
      seperator = 'date';
      break;
    case PeriodUnitEnum.YEAR:
      seperator = 'year';
      break;
    default:
      break;
  }

  if (seperator!)
    return {
      from: momentDate.startOf(seperator).toDate(),
      to: momentDate.endOf(seperator).toDate(),
    };
  return { from: null as any, to: null as any };
}

function setPrevOrNextDate(date: Date, isFuture?: boolean): Date {
  if (isValidDate(date)) {
    if (isFuture) {
      return moment(date).add(1, 'd').toDate();
    }
    return moment(date).add(-1, 'd').toDate();
  }
  return null as any;
}

function getDates(date: string): { from: Date; to: Date } {
  const from = new Date(date);
  const to = new Date(date);
  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);
  to.setDate(to.getDate() + 1);
  return { from, to };
}

function filterObject<T>(obj: T): {
  [P in keyof T as Exclude<P, undefined | null>]: T[P];
} {
  return Object.fromEntries(
    Object.entries(obj!).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([key, value]) => value !== null && value !== undefined,
    ),
  ) as { [P in keyof T as Exclude<P, undefined | null>]: T[P] };
}
export {
  isCorrectRange,
  getMomentDate,
  isValidDates,
  isValidDate,
  isFutureDate,
  getIntervalDates,
  filterObject,
  getDates,
  getDatePart,
  setPrevOrNextDate,
  getPeriodDates,
  fDate,
  generateRandomDate
};
