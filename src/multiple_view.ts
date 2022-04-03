import {Option} from "./models";
import {
  buildContainer,
  buildContent,
  buildResultsList,
  buildSearch,
  buildMultiSelect,
  generateOption,
  buildMultiTitleBadge
} from "./dom_factory";

export interface MultiSelected {
  container: HTMLDivElement
  values: HTMLDivElement
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


export default class MultiView {
  public container: HTMLDivElement
  public content: HTMLDivElement
  public search: Search
  public list: HTMLDivElement
  public multiSelected: MultiSelected
  
  public onSearch: any
  public onClose: any
  public onOpen: any
  public onOptionSelect: any
  public onRemoveMultiOption: any
  public isOpened: boolean
  
  public element: HTMLSelectElement;
  
  public originalElementDisplay: string;
  
  targetBelongsToContainer = (target: HTMLElement): boolean => {
    if (target === this.container) {
      return true;
    } else if (target.parentNode) {
      return this.targetBelongsToContainer(target.parentNode as HTMLElement);
    } else {
      return false;
    }
  }
  
  onDocumentClick = (e: MouseEvent) => {
    if (this.isOpened && e.target instanceof HTMLElement && !this.targetBelongsToContainer(e.target)) {
      this.onClose();
    }
  }
  
  constructor(
      el: HTMLSelectElement,
      onSearch: any,
      onOptionSelect: any,
      onClose: any,
      onOpen: any,
      onRemoveMultiOption: any
  ) {
    this.element = el;
    this.originalElementDisplay = el.style.display;
    
    this.onSearch = onSearch;
    this.onOptionSelect = onOptionSelect;
    this.onRemoveMultiOption = onRemoveMultiOption;
    this.onClose = onClose;
    this.onOpen = onOpen;
    
    this.isOpened = false;
    
    this.container = buildContainer();
    
    this.content = buildContent();
    this.search = buildSearch(this.onSearch);
    this.list = buildResultsList();
    
    const onClick = (): void => {
      this.isOpened ? this.onClose() : this.onOpen();
    }
    this.multiSelected = buildMultiSelect(onClick);
    
    this.container.appendChild(this.multiSelected.container)
    this.container.appendChild(this.content)
    
    this.content.appendChild(this.search.container)
    this.content.appendChild(this.list)
    
    el.style.display = 'none';
    
    if (el.parentNode) {
      el.parentNode.insertBefore(this.container, el.nextSibling)
    } else {
      throw new Error('thin-select: The given select element must have a parent node');
    }
    
    document.addEventListener('click', this.onDocumentClick);
  }

  destroy = (): void => {
    this.element.style.display = this.originalElementDisplay;
    document.removeEventListener('click', this.onDocumentClick);
    
    if (this.element.parentElement) {
      this.element.parentElement.removeChild(this.container)
    }
  }
  
  openPanel = (): void => {
    this.isOpened = true;
    
    this.multiSelected.arrowIcon.arrow.classList.remove('arrow-down')
    this.multiSelected.arrowIcon.arrow.classList.add('arrow-up')
      
    this.multiSelected.container.classList.add('ss-open-below')
    
    this.content.classList.add('ss-open')
    
    // setTimeout is for animation completion
    setTimeout(() => {
      this.search.input.focus()
    }, 100)
  }
  
  closePanel = (): void => {
    this.isOpened = false;
    this.search.input.value = '';
    
    this.multiSelected.container.classList.remove('ss-open-above')
    this.multiSelected.container.classList.remove('ss-open-below')
    this.multiSelected.arrowIcon.arrow.classList.add('arrow-down')
    this.multiSelected.arrowIcon.arrow.classList.remove('arrow-up')
    
    this.content.classList.remove('ss-open')
  }
  
  
  setSelected = (options: Option[]): void => {
    options.forEach((option) => {
      const badge = buildMultiTitleBadge(option, this.onRemoveMultiOption);
      this.multiSelected.values.appendChild(badge);
    })
    
    Array.from(this.element.options).forEach((o) => {
      if (options.find((x) => x.selected && x.value === o.value)) {
        o.selected = true;
      } else {
        o.selected = false;
      }
    })
  }
  
  appendSelected = (option: Option): void => {
    const badge = buildMultiTitleBadge(option, this.onRemoveMultiOption);
    this.multiSelected.values.appendChild(badge);
  
    Array.from(this.list.children).forEach((x) => {
      if (x instanceof HTMLElement && x.dataset.ssValue === option.value) {
        x.classList.add('ss-option-selected');
      }
    })
    
    const domOption = Array.from(this.element.options).find((o) => o.value === option.value)
    if (domOption) {
      domOption.selected = true;
    }
  }
  
  removeSelected = (option: Option): void => {
    const domBadge = Array.from(this.multiSelected.values.children).find((x) => {
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
  }
  
  setDisplayList = (options: Option[]): void => {
    this.list.innerHTML = '';
    options.forEach((option) => this.list.appendChild(generateOption(option, this.onOptionSelect)))
  };
  
  setElementOptions = (options: Option[]): void => {
    this.element.innerHTML = '';
  
    options.forEach((option) => {
      const opt = document.createElement('option');
      opt.value = option.value;
      opt.innerText = option.text;
      opt.selected = option.selected;
      this.element.appendChild(opt);
    })
  }
  
}