import {
  onCloseType,
  onOpenType,
  onOptionSelectType,
  onRemoveMultiOptionType,
  onSearchType,
  Option
} from "./models";
import {
  buildContent,
  buildResultsList,
  buildSearch,
  buildMultiSelect,
  buildMultiTitleBadge
} from "./dom_factory";
import View from "./view";


export default class MultiView extends View {
  public onRemoveMultiOption: onRemoveMultiOptionType
  
  constructor(
      el: HTMLSelectElement,
      className: string | undefined,
      onSearch: onSearchType,
      onOptionSelect: onOptionSelectType,
      onClose: onCloseType,
      onOpen: onOpenType,
      onRemoveMultiOption: onRemoveMultiOptionType
  ) {
    super(el, className, onSearch, onOptionSelect, onClose, onOpen);
    this.onRemoveMultiOption = onRemoveMultiOption;
    
    this.content = buildContent();
    this.search = buildSearch(this.onSearch);
    this.list = buildResultsList();
    
    this.titleBar = buildMultiSelect(this.onClickOverTitle);
    
    this.container.appendChild(this.titleBar.container)
    this.container.appendChild(this.content)
    
    this.content.appendChild(this.search.container)
    this.content.appendChild(this.list)
  }
  
  
  setSelected = (options: Option[]): void => {
    options.forEach((option) => {
      const badge = buildMultiTitleBadge(option, this.onRemoveMultiOption);
      if (this.titleBar.type === 'multi') {
        this.titleBar.values.appendChild(badge);
      }
    })
    
    Array.from(this.element.options).forEach((o) => {
      if (options.find((x) => x.selected && x.value === o.value)) {
        o.selected = true;
      } else {
        o.selected = false;
      }
    })
  
    this.element.dispatchEvent(new CustomEvent('change', { bubbles: true }))
  }
  
  appendSelected = (option: Option): void => {
    if (this.titleBar.type === 'multi') {
      
      const badge = buildMultiTitleBadge(option, this.onRemoveMultiOption);
      this.titleBar.values.appendChild(badge);
      
      Array.from(this.list.children).forEach((x) => {
        if (x instanceof HTMLElement && x.dataset.ssValue === option.value) {
          x.classList.add('ss-option-selected');
        }
      })
      
      const domOption = Array.from(this.element.options).find((o) => o.value === option.value)
      if (domOption) {
        domOption.selected = true;
      } else {
        const newOption = document.createElement('option');
        newOption.value = option.value;
        newOption.innerText = option.text;
        newOption.selected = true;
        this.element.appendChild(newOption);
      }
      
      this.element.dispatchEvent(new CustomEvent('change', { bubbles: true }))
    }
  }
  
  removeSelected = (option: Option): void => {
    
    
    if (this.titleBar.type === 'multi') {
      const domBadge = Array.from(this.titleBar.values.children).find((x) => {
        return (x instanceof HTMLElement) && x.dataset.value === option.value;
      })
  
      if (domBadge) {
        domBadge.remove();
      }
      
      Array.from(this.list.children).forEach((x) => {
        if (x instanceof HTMLElement && x.dataset.ssValue === option.value) {
          x.classList.remove('ss-option-selected');
        }
      })
      
      const domOption = Array.from(this.element.options).find((o) => o.value === option.value)
      if (domOption) {
        domOption.selected = false;
      }
  
      this.element.dispatchEvent(new CustomEvent('change', { bubbles: true }))
    }
  }
  
}