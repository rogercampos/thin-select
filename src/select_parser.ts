import { Option} from "./models";

export default class SelectParser {
  public el: HTMLSelectElement;
  
  constructor(el: HTMLElement) {
    if (!(el instanceof HTMLSelectElement)) {
      throw new Error('thin-select: "select" dom element must be an HTMLSelectElement');
    }
    this.el = el;
  }
  
  analyze() {
    const isMultiple = this.el.multiple;
    const options: Option[] = [];
  
    Array.from(this.el.options).forEach((option: HTMLOptionElement) => {
      options.push({ value: option.value, text: option.text, selected: option.selected });
    });
  
    return({
      isMultiple,
      options
    });
  }
}
