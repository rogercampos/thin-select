import {onCloseType, onOpenType, onOptionSelectType, onSearchType, Option, Search, SingleSelected, MultiSelected } from "./models";
import {
  buildContainer,
  buildOption
} from "./dom_factory";

export default class View {
  public container: HTMLDivElement
  public content!: HTMLDivElement
  public search!: Search
  public list!: HTMLDivElement
  public titleBar!: SingleSelected | MultiSelected
  
  public onSearch: onSearchType
  public onClose: onCloseType
  public onOpen: onOpenType
  public onOptionSelect: onOptionSelectType
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
  
  onClickOverTitle = (): void => {
    this.isOpened ? this.onClose() : this.onOpen();
  }
  
  constructor(
      el: HTMLSelectElement,
      className: string | undefined,
      onSearch: onSearchType,
      onOptionSelect: onOptionSelectType,
      onClose: onCloseType,
      onOpen: onOpenType,
  ) {
    this.element = el;
    this.originalElementDisplay = el.style.display;
    
    this.onSearch = onSearch;
    this.onOptionSelect = onOptionSelect;
    this.onClose = onClose;
    this.onOpen = onOpen;
    
    this.isOpened = false;
    
    this.container = buildContainer(className);
    
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
    
    this.titleBar.arrowIcon.arrow.classList.remove('arrow-down')
    this.titleBar.arrowIcon.arrow.classList.add('arrow-up')
    
    this.titleBar.container.classList.add('ss-open-below')
    
    this.content.classList.add('ss-open')
    
    // setTimeout is for animation completion
    setTimeout(() => {
      this.search.input.focus()
    }, 100)
  }
  
  closePanel = (): void => {
    this.isOpened = false;
    this.search.input.value = '';
    
    this.titleBar.container.classList.remove('ss-open-above')
    this.titleBar.container.classList.remove('ss-open-below')
    this.titleBar.arrowIcon.arrow.classList.add('arrow-down')
    this.titleBar.arrowIcon.arrow.classList.remove('arrow-up')
    
    this.content.classList.remove('ss-open')
  }
  
  
  setDisplayList = (options: Option[]): void => {
    this.list.innerHTML = '';
    options.forEach((option) => this.list.appendChild(buildOption(option, this.onOptionSelect)))
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