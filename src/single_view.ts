import {onCloseType, onOpenType, onOptionSelectType, onSearchType, Option} from "./models";
import {
  buildContent,
  buildResultsList,
  buildSearch,
  buildSingleSelect,
} from "./dom_factory";
import View from "./view";


export default class SingleView extends View {
  constructor(
      el: HTMLSelectElement,
      onSearch: onSearchType,
      onOptionSelect: onOptionSelectType,
      onClose: onCloseType,
      onOpen: onOpenType,
  ) {
    super(el, onSearch, onOptionSelect, onClose, onOpen);
    
    this.content = buildContent();
    this.search = buildSearch(this.onSearch);
    this.list = buildResultsList();
    
    this.titleBar = buildSingleSelect(this.onClickOverTitle);
    
    this.container.appendChild(this.titleBar.container)
    this.container.appendChild(this.content)
    
    this.content.appendChild(this.search.container)
    this.content.appendChild(this.list)
  }
  
  setSelected = (option: Option): void => {
    if (this.titleBar.type === 'single') {
      this.titleBar.title.innerText = option.text;
    }
    
    Array.from(this.element.options).forEach((o) => {
      if (o.value === option.value) {
        o.selected = true;
      } else {
        o.selected = false;
      }
    })
    
    this.element.dispatchEvent(new CustomEvent('change', { bubbles: true }))
  }
  
}