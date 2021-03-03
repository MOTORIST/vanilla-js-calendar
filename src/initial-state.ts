import { CalendarOptions, Month, WeekDay, Mod } from "./types";
import { getMonthsNames, getWeekDaysNames } from "./helpers";

export interface InitialState extends CalendarOptions {
  prevMod: Mod;
  activeDates: Set<any>;
  monthNames: string[];
  weekDaysNames: string[];
}

export default function initialState(
  options?: Partial<CalendarOptions>
): InitialState {
  const today = new Date();
  const year = (options && options.year) || today.getFullYear();
  const month = today.getMonth() as Month;
  const weekStart = (options && options.weekStart) || (0 as WeekDay);
  const locale = (options && options.locale) || navigator.language || "en";
  const multidate = (options && options.multidate) || false;
  const mod = (options && options.mod) || Mod.Dates;
  const prevMod = mod;
  const activeDates = new Set();
  const monthNames = getMonthsNames(locale);
  const weekDaysNames = getWeekDaysNames(locale, { weekStart });

  return {
    year,
    month,
    weekStart,
    locale,
    multidate,
    mod,
    prevMod,
    activeDates,
    monthNames,
    weekDaysNames
  };
}
