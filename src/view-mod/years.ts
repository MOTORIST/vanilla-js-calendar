import { ViewMod } from "./view-mod";
import { Mod } from "../types";
import { EVENTS } from "../constants";

export class YearsViewMod extends ViewMod {
  pickValue() {
    this.view.setActiveViewItem(this.element);
    this.changeMod();
    this.changeStateValue();
    this.ee.emit(EVENTS.CHANGE_YEAR, this.value);
  }

  nextView() {
    const year = this.state.year + 12;
    this.state.setState({ year });
  }

  prevView() {
    const year = this.state.year - 12;
    this.state.setState({ year });
  }

  private changeStateValue() {
    this.state.setState({ year: this.value });
  }

  private changeMod() {
    const isMonthsPrevMod = this.state.prevMod === Mod.Months;
    const mod = isMonthsPrevMod ? Mod.Months : Mod.Dates;
    const prevMod = isMonthsPrevMod ? Mod.Years : Mod.Dates;

    this.state.setState({ mod, prevMod });
  }
}
