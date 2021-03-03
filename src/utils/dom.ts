export class Dom {
  private el: HTMLElement;

  constructor(selector: string | HTMLElement) {
    if (selector instanceof HTMLElement) {
      this.el = selector;
    } else if (typeof selector === "string") {
      const element = document.querySelector(selector);

      if (!element) {
        throw new Error(`${selector} - element not found`);
      }

      if (!(element instanceof HTMLElement)) {
        throw new Error(`${selector} - is not HTMLElement`);
      }

      this.el = element;
    } else {
      throw new Error(`${selector} must be string or HTMLElement`);
    }
  }

  static createElement(tagName: string) {
    const el = document.createElement(tagName);
    return new Dom(el);
  }

  getElement() {
    return this.el;
  }

  text(str: string | number) {
    this.el.innerText = `${str}`;
    return this;
  }

  html(str: string | number) {
    this.el.innerHTML = `${str}`;
    return this;
  }

  data(key: string, value: any): Dom;
  data(key: string, value?: any): string;
  data(key: any, value: any): any {
    if (value === undefined) return this.el.dataset[key];
    this.el.dataset[key] = value;

    return this;
  }

  addClass(...classes: string[]) {
    this.el.classList.add(...classes);
    return this;
  }

  removeClass(...classes: string[]) {
    this.el.classList.remove(...classes);
    return this;
  }

  hasClass(cl: string) {
    return this.el.classList.contains(cl);
  }

  classes() {
    return Array.from(this.el.classList);
  }

  addModClass(className: string) {
    const modName = className.split("_")[1];

    const classes = this.classes().filter((cl) => {
      const bem = cl.split("_");
      return bem.length > 0 && bem[1] === modName;
    });

    this.removeClass(...classes).addClass(className);
    return this;
  }

  append(...elements: Array<HTMLElement | Dom>) {
    const els = elements.map((el) =>
      el instanceof Dom ? el.getElement() : el
    );

    this.el.append(...els);
    return this;
  }

  appendTo(element: HTMLElement | Dom) {
    if (element instanceof Dom) {
      element.getElement().append(this.el);
    } else {
      element.append(this.el);
    }

    return this;
  }

  closest(selectors: string) {
    const el = this.el.closest<HTMLElement>(selectors);
    return el ? $(el) : null;
  }

  attr(name: string, value: string | number | boolean) {
    this.el.setAttribute(name, value.toString());
    return this;
  }

  find(selectors: string) {
    const el = this.getElement().querySelector(selectors);
    return el ? new Dom(el as HTMLElement) : this;
  }
}

export default function $(selector: string | HTMLElement) {
  return new Dom(selector);
}

$.createElement = Dom.createElement;
