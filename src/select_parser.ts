import {Option} from "./models";

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
      options.push({value: option.value, text: option.text, selected: option.selected});
    });
    
    // Follows default browser behavior on choosing what option to display initially:
    // Last of the selected or the first one (only for single selects).
    let defaultSingleOption;
    
    options.forEach(option => {
      if (option.selected) {
        defaultSingleOption = option;
      }
    });
    
    defaultSingleOption = defaultSingleOption || options[0];
    
    return ({
      isMultiple,
      options,
      defaultSingleOption
    });
  }
}
