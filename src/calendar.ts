import { CalendarOptions, Mod } from "./types";
import View from "./view";
import { CLASSES, EVENTS } from "./constants";
import { getTargetHtmlElement } from "./helpers";
import createState, { State } from "./state";
import initialState, { InitialState } from "./initial-state";
import getViewModInstance from "./view-mod";
import EventEmitter from "./utils/event-emitter";

type CalendarEventsKey = keyof typeof EVENTS;
type CalendarEvents = typeof EVENTS[CalendarEventsKey];

interface To {
  year?: number;
  month?: number;
  date: Date;
}

export default class Calendar {
  private view: View;
  private state: State<InitialState>;
  private ee: EventEmitter;

  constructor(root: HTMLElement, options?: Partial<CalendarOptions>) {
    this.state = createState<InitialState>(initialState(options));
    this.view = new View(root, this.state);
    this.ee = new EventEmitter();
    this.registerEvents();
    this.initEventWatchers();
  }

  init(): Calendar {
    this.view.render();
    return this;
  }

  on(event: CalendarEvents, cb: (data: any) => void) {
    this.ee.on(event, cb);
  }

  to({ year, month, date }: To): void {
    year = (date && date.getFullYear()) || year || this.state.year;
    month = (date && date.getMonth()) || month || this.state.month;
    const mod = Mod.Dates;
    const prevMod = Mod.Dates;
    this.state.setState({ year, month, mod, prevMod });
  }

  toToday(): void {
    const date = new Date();
    this.to({ date });
  }

  getActiveDates() {
    return [...this.state.activeDates];
  }

  clearActiveDates(): void {
    this.state.setState({ activeDates: new Set() });
    this.view.clearActiveDates();
    this.ee.emit(EVENTS.CLEAR_ACTIVE_DATES);
  }

  private initEventWatchers() {
    this.state.setWatchers({
      activeDates: [
        () =>
          this.ee.emit(EVENTS.CHANGE_DATA, {
            activeDates: [...this.state.activeDates],
          }),
      ],
    });
  }

  private registerEvents() {
    const container = this.view.getContainer();
    if (!container) throw new Error("Container not rendered");

    container.getElement().addEventListener("click", this);
  }

  handleEvent(event: Event) {
    const isEvent = (type: string) => event.type === type;

    if (isEvent("click")) {
      this.handleClickMonth(event);
      this.handleClickYear(event);
      this.handleClickViewItem(event);
      this.handleClickNextButton(event);
      this.handleClickPrevButton(event);
      this.handleClickToTodayButton(event);
      this.handleClickClearActiveDatesButton(event);
    }
  }

  private handleClickMonth(event: Event) {
    const element = getTargetHtmlElement(event, `.${CLASSES.TitleMonth}`);
    if (!element) return;

    this.changeMod(Mod.Months);
  }

  private handleClickYear(event: Event) {
    const element = getTargetHtmlElement(event, `.${CLASSES.TitleYear}`);
    if (!element) return;

    this.changeMod(Mod.Years);
  }

  private handleClickViewItem(event: Event) {
    const element = getTargetHtmlElement(event, `.${CLASSES.ViewItem}`);
    if (!element) return;

    const viewMod = this.getViewModInstance(element);
    viewMod.pickValue();
  }

  private handleClickNextButton(event: Event) {
    const element = getTargetHtmlElement(event, `.${CLASSES.NextButton}`);
    if (!element) return;

    const viewMod = this.getViewModInstance(element);
    viewMod.nextView();
  }

  private handleClickPrevButton(event: Event) {
    const element = getTargetHtmlElement(event, `.${CLASSES.PrevButton}`);
    if (!element) return;

    const viewMod = this.getViewModInstance(element);
    viewMod.prevView();
  }

  private handleClickToTodayButton(event: Event) {
    const element = getTargetHtmlElement(event, `.${CLASSES.TodayButton}`);
    if (!element) return;
    this.toToday();
  }

  private handleClickClearActiveDatesButton(event: Event) {
    const element = getTargetHtmlElement(
      event,
      `.${CLASSES.ClearActiveDatesButton}`
    );
    if (!element) return;

    this.clearActiveDates();
  }

  private changeMod(mod: Mod, prevMod?: Mod) {
    this.state.setState({
      prevMod: prevMod || this.state.mod,
      mod,
    });
  }

  private getViewModInstance(element: HTMLElement) {
    return getViewModInstance(element, this.state, this.view, this.ee);
  }
}
