import { EVENTS } from "../constants";
import { ViewMod } from "./view-mod";

export class DatesViewMod extends ViewMod {
  pickValue() {
    if (this.isActiveItem) {
      this.view.removeActiveViewItem(this.element);
      this.removeValueFromState();
      this.ee.emit(EVENTS.REMOVE_DATE, this.value);
    } else {
      const isClearSibling = !this.state.multidate;
      this.view.setActiveViewItem(this.element, isClearSibling);
      this.addValueToState();
      this.ee.emit(EVENTS.ADD_DATE, this.value);
    }
  }

  nextView() {
    const value = this.state.month + 1;

    if (value > 11) {
      const year = this.state.year + 1;
      const month = 0;
      this.state.setState({ month, year });
    } else {
      this.state.setState({ month: value });
    }
  }

  prevView() {
    const value = this.state.month - 1;

    if (value < 0) {
      const year = this.state.year - 1;
      const month = 11;
      this.state.setState({ month, year });
    } else {
      this.state.setState({ month: value });
    }
  }

  private addValueToState() {
    const activeDates = this.state.multidate
      ? this.state.activeDates.add(this.value)
      : new Set([this.value]);

    this.state.setState({ activeDates });
  }

  private removeValueFromState() {
    const activeDates = this.state.activeDates;
    activeDates.delete(this.value);
    this.state.setState({ activeDates });
  }
}
