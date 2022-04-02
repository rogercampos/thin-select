import {Option} from "./models";
import {
  buildContainer,
  buildContent,
  buildResultsList,
  buildSearch,
  buildSingleSelect,
  generateOption
} from "./dom_factory";

export interface SingleSelected {
  container: HTMLDivElement
  title: HTMLSpanElement
  deselect: HTMLSpanElement
  arrowIcon: {
    container: HTMLSpanElement
    arrow: HTMLSpanElement
  }
}

export interface Search {
  container: HTMLDivElement
  input: HTMLInputElement
  addable?: HTMLDivElement
}


export default class View {
  public container: HTMLDivElement
  public content: HTMLDivElement
  public search: Search
  public list: HTMLDivElement
  public singleSelected: SingleSelected | null
  
  public onSearch: any
  public onDeselect: any
  public onClose: any
  public onOpen: any
  public onOptionSelect: any
  public isMultiple: boolean
  public isOpened: boolean
  
  public element: HTMLSelectElement;
  
  constructor(
      el: HTMLSelectElement,
      id: string,
      isMultiple: boolean,
      onSearch: any,
      onOptionSelect: any,
      onDeselect: any,
      onClose: any,
      onOpen: any,
  ) {
    this.element = el;
    this.onSearch = onSearch;
    this.onDeselect = onDeselect;
    this.onOptionSelect = onOptionSelect;
    this.onClose = onClose;
    this.onOpen = onOpen;
    
    this.isMultiple = isMultiple;
    this.isOpened = false;
    
    this.container = buildContainer(id);
    
    this.content = buildContent();
    this.search = buildSearch(this.onSearch);
    this.list = buildResultsList();
    
    const onClick = (): void => {
      this.isOpened ? this.onClose() : this.onOpen();
    }
    this.singleSelected = buildSingleSelect(onClick, this.onDeselect);
    
    this.container.appendChild(this.singleSelected.container)
    this.container.appendChild(this.content)
    
    this.content.appendChild(this.search.container)
    this.content.appendChild(this.list)
    
    el.style.display = 'none';
    el.dataset.tsid = id;
    
    if (el.parentNode) {
      el.parentNode.insertBefore(this.container, el.nextSibling)
    } else {
      throw new Error('thin-select: The given select element must have a parent node');
    }
  }
  
  openPanel = (): void => {
    this.isOpened = true;
    
    if (this.singleSelected) {
      this.singleSelected.arrowIcon.arrow.classList.remove('arrow-down')
      this.singleSelected.arrowIcon.arrow.classList.add('arrow-up')
      
      this.singleSelected.container.classList.add('ss-open-below')
    }
    
    this.content.classList.add('ss-open')
    
    // setTimeout is for animation completion
    setTimeout(() => {
      this.search.input.focus()
    }, 100)
  }
  
  closePanel = (): void => {
    this.isOpened = false;
    this.search.input.value = '';
    
    if (this.singleSelected) {
      this.singleSelected.container.classList.remove('ss-open-above')
      this.singleSelected.container.classList.remove('ss-open-below')
      this.singleSelected.arrowIcon.arrow.classList.add('arrow-down')
      this.singleSelected.arrowIcon.arrow.classList.remove('arrow-up')
    }
    
    this.content.classList.remove('ss-open')
  }
  
  
  setSelected = (option: Option): void => {
    if (this.singleSelected) {
      this.singleSelected.title.innerText = option.text;
    }
    
    Array.from(this.element.options).forEach((o) => {
      if (o.value === option.value) {
        o.selected = true;
      } else {
        o.selected = false;
      }
    })
  }
  
  setDisplayList = (options: Option[]): void => {
    this.list.innerHTML = '';
    options.forEach((option) => this.list.appendChild(generateOption(option, this.onOptionSelect)))
  };
  
}