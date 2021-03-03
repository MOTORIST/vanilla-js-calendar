import { ViewMod } from "./view-mod";
import { Mod } from "../types";
import { EVENTS } from "../constants";

export class MonthViewMod extends ViewMod {
  pickValue() {
    this.view.setActiveViewItem(this.element);
    this.changeStateValue();
    this.changeMod();
    this.ee.emit(EVENTS.CHANGE_MONTH, this.value);
  }

  nextView() {
    const year = this.state.year + 1;
    this.state.setState({ year });
  }

  prevView() {
    const year = this.state.year - 1;
    this.state.setState({ year });
  }

  private changeStateValue() {
    this.state.setState({ month: this.value });
  }

  private changeMod() {
    const mod = Mod.Dates;
    const prevMod = this.state.mod;
    this.state.setState({ mod, prevMod });
  }
}
