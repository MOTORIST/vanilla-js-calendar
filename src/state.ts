import { Fn } from "./types";

class BaseState {
  private watchers?: Record<string, Array<Fn>>;

  setState(value: Record<string, any>) {
    Object.assign(this, value);
  }

  getState() {
    return this;
  }

  setWatchers(watchers: Record<string, Fn[]>) {
    if (this.watchers) {
      for (let key in watchers) {
        if (!watchers.hasOwnProperty(key)) return;

        this.watchers[key] = this.watchers[key]
          ? this.watchers[key].concat(watchers[key])
          : watchers[key];
      }
    } else {
      this.watchers = watchers;
    }
  }

  getWatchers() {
    return this.watchers;
  }
}

export type State<T = {}> = BaseState & T;

export default function createState<T = {}>(
  initState: Record<string, any>
): State<T> {
  const instance = new BaseState();

  return new Proxy(Object.assign(instance, initState || {}), {
    set: function (state, key, value) {
      state[key as keyof typeof state] = value;
      const watchers = instance.getWatchers();

      if (watchers) {
        const fns = watchers[key as string];
        fns && fns.forEach((fn) => fn());
      }

      return true;
    }
  }) as State<T>;
}
