import { Fn } from "../types";

export default class EventEmitter {
  private events: Map<string, Fn[]>;

  constructor() {
    this.events = new Map();
  }

  public on(eventName: string, fn: Fn): void {
    const event = this.events.get(eventName);

    if (event) event.push(fn);
    else this.events.set(eventName, [fn]);
  }

  public off(eventName: string, fn: Fn): void {
    const event = this.events.get(eventName);

    if (!event) return;
    const i = event.indexOf(fn);

    if (i === -1) return;
    event.splice(i, 1);
  }

  public emit(eventName: string, ...args: any): void {
    const event = this.events.get(eventName);
    if (!event) return;
    event.forEach((fn) => fn(...args));
  }
}
