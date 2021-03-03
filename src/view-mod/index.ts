import { State } from "../state";
import { InitialState } from "../initial-state";
import View from "../view";
import { Mod } from "../types";
import { DatesViewMod } from "./dates";
import { MonthViewMod } from "./month";
import { YearsViewMod } from "./years";
import { ViewMod } from "./view-mod";
import EventEmitter from "../utils/event-emitter";

export default function getViewModInstance(
  element: HTMLElement,
  state: State<InitialState>,
  view: View,
  ee: EventEmitter
): ViewMod {
  switch (state.mod) {
    case Mod.Dates:
      return new DatesViewMod(element, state, view, ee);
    case Mod.Months:
      return new MonthViewMod(element, state, view, ee);
    case Mod.Years:
      return new YearsViewMod(element, state, view, ee);
  }
}
