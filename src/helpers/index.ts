export function getMonthsNames(locale: string = navigator.language) {
  return new Array(12).fill(0).map((_, m) => {
    return new Intl.DateTimeFormat(locale, { month: "long" }).format(
      new Date(2020, m, 1)
    );
  });
}

interface WeekDaysNamesOptions {
  length?: "narrow" | "short" | "long";
  weekStart?: number;
}

export function getWeekDaysNames(
  locale: string = navigator.language,
  { length = "short", weekStart = 0 }: WeekDaysNamesOptions = {}
) {
  let weekDays = new Array(7).fill(5).map((v, i) => {
    return new Intl.DateTimeFormat(locale, { weekday: length }).format(
      new Date(2020, 0, i + v)
    );
  });

  if (weekStart !== 0) {
    weekDays = [...weekDays.slice(weekStart), ...weekDays.slice(0, weekStart)];
  }

  return weekDays;
}

export interface Days {
  date: number;
  time: number;
  month: number;
  year: number;
}

export function getMonthDates(
  year: number,
  month: number,
  startWeek: number = 0
): Days[] {
  const dates = new Array(42);
  const date = new Date(year, month, 1);
  const d = date.getDay() - startWeek;
  const offset = (d > -1 ? d : d + 7) - 1;
  date.setDate(-offset);

  for (let i = 0; i < 42; i++) {
    dates[i] = {
      date: date.getDate(),
      time: date.getTime(),
      month: date.getMonth(),
      year: date.getFullYear()
    };

    date.setDate(date.getDate() + 1);
  }

  return dates;
}

export function isToday(year: number, month: number, date: number): boolean {
  const today = new Date();

  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === date
  );
}

export function getTargetHtmlElement(
  event: Event,
  selector: string
): HTMLElement | null {
  const target = event.target;
  return target instanceof Element ? target.closest(selector) : null;
}

export function range(start: number, end: number): number[] {
  const len = end - start + 1;
  const result = new Array(len);

  for (let i = 0; i < len; i++) {
    result[i] = start + i;
  }

  return result;
}

export function isObject(item: any): boolean {
  return item && typeof item === "object";
}
