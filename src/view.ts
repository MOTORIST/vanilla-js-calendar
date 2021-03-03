import $, { Dom } from "./utils/dom";
import { CLASSES } from "./constants";
import { Mod } from "./types";
import { State } from "./state";
import { InitialState } from "./initial-state";
import { getMonthDates, range } from "./helpers";

export default class View {
  private root: Dom;
  private container!: Dom;
  private datesView!: Dom;
  private monthsView!: Dom;
  private yearsView!: Dom;
  private titleMonth!: Dom;
  private titleYear!: Dom;
  private titleRangeYears!: Dom;
  private state: State<InitialState>;

  constructor(root: HTMLElement, state: State<InitialState>) {
    this.root = $(root);
    this.state = state;
    this.initElements();
    this.initStateWatchers();
  }

  render() {
    this.container.appendTo(this.root);
    this.renderDatesView();
    this.renderMonthsView();
    this.renderYearsView();
  }

  getContainer() {
    return this.container;
  }

  setMod() {
    this.container.addModClass(this.getModClass());
  }

  setActiveViewItem(item: HTMLElement, isClearSibling: boolean = true) {
    if (isClearSibling) {
      const view = item.closest(`.${CLASSES.View}`);
      if (!view) return;
      view.querySelectorAll(`.${CLASSES.ViewItem}`).forEach((item) => {
        $(item as HTMLElement).removeClass(CLASSES.ViewItem_status_active);
      });
    }

    $(item).addModClass(CLASSES.ViewItem_status_active);
  }

  removeActiveViewItem(item: HTMLElement) {
    $(item).removeClass(CLASSES.ViewItem_status_active);
  }

  clearActiveDates() {
    const dates = this.datesView
      .getElement()
      .querySelectorAll<HTMLElement>(`.${CLASSES.ViewItem}`);

    Array.from(dates).forEach((d) =>
      d.classList.remove(`${CLASSES.ViewItem_status_active}`)
    );
  }

  private initElements() {
    this.container = this.createContainer();
    this.datesView = this.container.find(`.${CLASSES.View_type_dates}`);
    this.monthsView = this.container.find(`.${CLASSES.View_type_months}`);
    this.yearsView = this.container.find(`.${CLASSES.View_type_years}`);
    this.titleMonth = this.container.find(`.${CLASSES.TitleMonth}`);
    this.titleYear = this.container.find(`.${CLASSES.TitleYear}`);
    this.titleRangeYears = this.container.find(`.${CLASSES.TitleRangeYears}`);
  }

  private initStateWatchers() {
    this.state.setWatchers({
      mod: [() => this.setMod()],
      month: [() => this.setTitleMonth(), () => this.renderDatesView()],
      year: [
        () => this.setTitleYear(),
        () => this.setTitleRangeYears(),
        () => this.renderDatesView(),
        () => this.renderYearsView(),
      ],
    });
  }

  private setTitleMonth() {
    const name = this.state.monthNames[this.state.month];
    this.titleMonth.text(name);
  }

  private setTitleYear() {
    this.titleYear.text(this.state.year);
  }

  private setTitleRangeYears() {
    const text = this.getRangeYearsText();
    this.titleRangeYears.text(text);
  }

  private createContainer() {
    const monthName = this.getMonthName();
    const year = this.state.year;
    const rangeYears = this.getRangeYearsText();

    return $.createElement("div")
      .addClass(CLASSES.Calendar, this.getModClass())
      .html(this.template(monthName, year, rangeYears));
  }

  private renderDatesView() {
    this.datesView.html("");
    this.renderWeekDays();
    this.renderDates();
  }

  private renderMonthsView() {
    this.renderMonths();
  }

  private renderYearsView() {
    this.yearsView.html("");
    this.renderYears();
  }

  private renderWeekDays() {
    const weekDays = $.createElement("div")
      .addClass(CLASSES.WeekDays)
      .appendTo(this.datesView);

    this.state.weekDaysNames.forEach((name) => {
      $.createElement("div")
        .addClass(CLASSES.WeekDay)
        .text(name)
        .appendTo(weekDays);
    });
  }

  private renderDates(): void {
    const dates = getMonthDates(
      this.state.year,
      this.state.month,
      this.state.weekStart
    );

    for (let i = 0; i < 6; i++) {
      const row = $.createElement("div")
        .addClass(CLASSES.ViewRow)
        .appendTo(this.datesView);

      dates.slice(i * 7, (i + 1) * 7).forEach((d) => {
        const isPrevMonthDate = d.month !== this.state.month;
        const isActiveDate = this.state.activeDates.has(d.time);
        const today = new Date();
        const isToday =
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          ).getTime() === d.time;

        const date = $.createElement("button")
          .addClass(CLASSES.ViewItem, CLASSES.Button)
          .text(d.date)
          .data("value", d.time);

        if (isToday) {
          date.addClass(CLASSES.ViewItem_today);
        }

        if (isPrevMonthDate) {
          date.addClass(CLASSES.ViewItem_disable).attr("disable", "disabled");
        }

        if (isActiveDate && !isPrevMonthDate) {
          date.addClass(CLASSES.ViewItem_status_active);
        }

        date.appendTo(row);
      });
    }
  }

  private renderMonths(): void {
    const months = this.state.monthNames.map<{ value: number; name: string }>(
      (d, i) => ({ value: i, name: d.slice(0, 3) })
    );

    for (let i = 0; i < 3; i++) {
      const row = $.createElement("div")
        .addClass("Calendar-ViewRow")
        .appendTo(this.monthsView);

      months.slice(i * 4, (i + 1) * 4).forEach((m) => {
        const month = $.createElement("button")
          .addClass("Calendar-ViewItem", "Calendar-Button")
          .text(m.name)
          .data("value", m.value);

        if (m.value === this.state.month) {
          month.addClass(CLASSES.ViewItem_status_active);
        }

        month.appendTo(row);
      });
    }
  }

  private renderYears(): void {
    const years = this.getRangeYears();

    for (let i = 0; i < 3; i++) {
      const row = $.createElement("div")
        .addClass("Calendar-ViewRow")
        .appendTo(this.yearsView);

      years.slice(i * 4, (i + 1) * 4).forEach((y) => {
        const year = $.createElement("button")
          .addClass("Calendar-ViewItem", "Calendar-Button")
          .text(y)
          .data("value", y);

        if (y === this.state.year) {
          year.addClass(CLASSES.ViewItem_status_active);
        }

        year.appendTo(row);
      });
    }
  }

  private getModClass(): string {
    return {
      [Mod.Dates]: CLASSES.Calendar_mod_dates,
      [Mod.Months]: CLASSES.Calendar_mod_months,
      [Mod.Years]: CLASSES.Calendar_mod_years,
    }[this.state.mod];
  }

  private getMonthName(): string {
    return this.state.monthNames[this.state.month];
  }

  private getRangeYears(): number[] {
    const start = this.state.year;
    const end = start + 11;
    return range(start, end);
  }

  private getRangeYearsText(): string {
    const start = this.state.year;
    const end = start + 11;
    return `${start} - ${end}`;
  }

  private template(month: string, year: number, rangeYears: string) {
    const {
      Wrapper,
      Header,
      Button,
      PrevButton,
      NextButton,
      Title,
      TitleMonth,
      TitleYear,
      TitleRangeYears,
      Body,
      View,
      View_type_dates,
      View_type_months,
      View_type_years,
      Toolbar,
      ToolbarButton,
      ClearActiveDatesButton,
      TodayButton,
      Icon,
    } = CLASSES;
    return `
      <div class="${Wrapper}">
          <div class="${Header}">
            <button class="${Button} ${PrevButton}"></button>
            <div class="${Title}">
              <button class="${Button} ${TitleMonth}">${month}</button>
              <button class="${Button} ${TitleYear}">${year}</button>
              <div class="${TitleRangeYears}">${rangeYears}</div>
            </div>
            <button class="${Button} ${NextButton}"></button>
          </div>
          <div class="${Body}">
            <div class="${View} ${View_type_dates}"></div>
            <div class="${View} ${View_type_months}"></div>
            <div class="${View} ${View_type_years}"></div>
          </div>
      </div>
      <div class="${Toolbar}">
        <button class="${Button} ${ToolbarButton} ${TodayButton}">
          <svg class="${Icon}" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="2" opacity=".3"></circle>
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm8.94-3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
          </svg>
        </button>
        <button class="${Button} ${ToolbarButton} ${ClearActiveDatesButton}">
          <svg class="${Icon}" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 9h8v10H8z" opacity=".3"></path><path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"></path>
          </svg>
        </button>
      </div>
    `;
  }
}
