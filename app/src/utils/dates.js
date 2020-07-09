import {
  addMonths,
  addDays,
  isDate,
  differenceInCalendarDays,
  isToday,
} from "date-fns";
import { monthNames } from "./localization";

export const getDateWithOffset = date => {
  const offset = new Date().getTimezoneOffset() * 60000;
  const dateWithOffset = new Date(date).getTime();
  return new Date(dateWithOffset + offset);
};

const daysQuantity = {
  q: 14,
  s: 7,
  d: 1,
};

export const getDiffOfDaysToToday = date =>
  differenceInCalendarDays(date, new Date());

export const isTheDateToday = date => isToday(date);

export const getFormattedDate = date => {
  let dateAux = date;
  if (!isDate(dateAux)) dateAux = new Date(date);
  const day = dateAux.getUTCDate();
  const month = dateAux.getMonth() + 1;
  const year = dateAux.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

export const getHoursAndMinutes = date => {
  let dateAux = date;
  if (!isDate(dateAux)) dateAux = new Date(date);
  const minutes = dateAux.getMinutes();
  const hours = dateAux.getHours();
  return `${hours}:${minutes}`;
};

const getDatesForCalendar = date => ({
  month: date.getUTCMonth(),
  day: date.getUTCDate(),
  date,
});

export const getPaymentDate = (date, frequency, number) => {
  const properDate = new Date(date);
  if (frequency === "m") {
    const newDate = addMonths(properDate, number);
    return getDatesForCalendar(newDate);
  }
  const daysToAdd = n => daysQuantity[frequency] * n;
  const calculatedDays = daysToAdd(number);
  const finalDate = addDays(properDate, calculatedDays);

  return getDatesForCalendar(finalDate);
};

export const getEndDate = (startDate, frequency, maxNumber) => {
  const { date } = getPaymentDate(startDate, frequency, maxNumber);
  return date;
};

export const getStartDate = (startDate, frequency) => {
  const { date } = getPaymentDate(startDate, frequency, 1);
  return date;
};

/**
 *
 * @param {*} index zero-index month to get
 * @returns String of the month name
 */
export const getMonthName = index => monthNames[index];
