import { State } from "./../state";
import { InitialState } from "./../initial-state";
import View from "./../view";
import { CLASSES } from "../constants";
import EventEmitter from "../utils/event-emitter";

export abstract class ViewMod {
  protected element: HTMLElement;
  protected state: State<InitialState>;
  protected view: View;
  protected ee: EventEmitter;

  constructor(
    element: HTMLElement,
    state: State<InitialState>,
    view: View,
    ee: EventEmitter
  ) {
    this.element = element;
    this.state = state;
    this.view = view;
    this.ee = ee;
  }

  abstract pickValue(): void;
  abstract nextView(): void;
  abstract prevView(): void;

  protected get isActiveItem(): boolean {
    return this.element.classList.contains(CLASSES.ViewItem_status_active);
  }

  protected get value(): number {
    return Number.parseInt(this.element.dataset.value as string, 10);
  }
}
