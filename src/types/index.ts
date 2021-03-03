export interface CalendarOptions {
  year: number;
  month: Month;
  weekStart: WeekDay;
  locale: string;
  multidate: boolean;
  mod: Mod;
}

export enum Mod {
  Dates = 1,
  Months,
  Years
}

export type Month = Enumerate<12>;

export type WeekDay = Enumerate<7>;

export type Fn = (...args: any[]) => void;

export type FixedLengthTuple<TItem, TLength extends number> = [
  TItem,
  ...TItem[]
] & { length: TLength };

// https://github.com/microsoft/TypeScript/issues/15480#issuecomment-601714262
export type Enumerate<N extends number> = EnumerateInternal<
  [],
  N
> extends (infer E)[]
  ? E
  : never;

export type Range<FROM extends number, TO extends number> = Exclude<
  Enumerate<TO>,
  Enumerate<FROM>
>;

type PrependNextNum<A extends Array<unknown>> = A["length"] extends infer T
  ? ((t: T, ...a: A) => void) extends (...x: infer X) => void
    ? X
    : never
  : never;

type EnumerateInternal<A extends Array<unknown>, N extends number> = {
  0: A;
  1: EnumerateInternal<PrependNextNum<A>, N>;
}[N extends A["length"] ? 0 : 1];
