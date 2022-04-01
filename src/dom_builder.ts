import {Option} from "./models"

interface SingleSelected {
  container: HTMLDivElement
  placeholder: HTMLSpanElement
  deselect: HTMLSpanElement
  arrowIcon: {
    container: HTMLSpanElement
    arrow: HTMLSpanElement
  }
}

interface Search {
  container: HTMLDivElement
  input: HTMLInputElement
  addable?: HTMLDivElement
}


export default class DomBuilder {
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
    
    this.container = document.createElement('div');
    this.container.id = id;
    this.container.classList.add('ss-main');
    
    this.content = document.createElement('div');
    this.content.classList.add('ss-content');
    this.search = this.#searchDiv()
    this.list = this.#listDiv()
  
    this.singleSelected = this.singleSelectedDiv()
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
  
  openPanel = () => {
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
  
  closePanel = () => {
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
  
  setDisplayList = (options: Option[]) => {
    // Clear out innerHtml
    this.list.innerHTML = '';
  
    for (const d of options) {
      this.list.appendChild(this.#generateOption(d))
    }
  }
  
  #generateOption = (option: Option) => {
    const optionEl = document.createElement('div')
    optionEl.classList.add('ss-option')
    optionEl.setAttribute('role', 'option')
    
  
    optionEl.addEventListener('click', (e: MouseEvent) => {
      this.onOptionSelect(option);
    })
    
    if (option.selected) {
      optionEl.classList.add('ss-option-selected');
    }
    
    if (option.innerHtml) {
      optionEl.innerHTML = option.innerHtml;
    } else {
      optionEl.innerText = option.text || '\xa0';
    }
    
    return optionEl;
  }
  
  setSelected = (option: Option) => {
    if (this.singleSelected) {
      this.singleSelected.placeholder.innerText = option.text;
    }
  
    Array.from(this.element.options).forEach((o) => {
      if (o.value === option.value) {
        o.selected = true;
      } else {
        o.selected = false;
      }
    })
  }
  
  
  #searchDiv(): Search {
    const container = document.createElement('div')
    container.classList.add('ss-search');
    const input = document.createElement('input')
    const addable = document.createElement('div')
    
    // Setup search return object
    const searchReturn: Search = {
      container,
      input
    }
    
    input.type = 'search'
    input.placeholder = "Search..."
    input.tabIndex = 0
    input.setAttribute('aria-label', input.placeholder)
    input.setAttribute('autocapitalize', 'off')
    input.setAttribute('autocomplete', 'off')
    input.setAttribute('autocorrect', 'off')
    
    input.addEventListener('input', (e) => {
      this.onSearch(e.target.value);
    })
    
    container.appendChild(input)
    
    // addable.innerHTML = '+'
    // addable.onclick = (e) => {
    //   e.preventDefault()
    //   e.stopPropagation()
    //
    //   const inputValue = this.search.input.value
    //   if (inputValue.trim() === '') {
    //     this.search.input.focus();
    //     return
    //   }
    //
    //   const addableValue = this.main.addable(inputValue)
    //   let addableValueStr = ''
    //   if (!addableValue) {
    //     return
    //   }
    //
    //   if (typeof addableValue === 'object') {
    //     const validValue = validateOption(addableValue)
    //     if (validValue) {
    //       this.main.addData(addableValue)
    //       addableValueStr = (addableValue.value ? addableValue.value : addableValue.text)
    //     }
    //   } else {
    //     this.main.addData(this.main.data.newOption({
    //       text: addableValue,
    //       value: addableValue
    //     }))
    //     addableValueStr = addableValue
    //   }
    //
    //   this.main.search('')
    //   setTimeout(() => { // Temp fix to solve multi render issue
    //     this.main.set(addableValueStr, 'value', false, false)
    //   }, 100)
    //
    //   // Close it only if closeOnSelect = true
    //   if (this.main.config.closeOnSelect) {
    //     setTimeout(() => { // Give it a little padding for a better looking animation
    //       this.main.close()
    //     }, 100)
    //   }
    // }
    // container.appendChild(addable)
    //
    // searchReturn.addable = addable
    
    return searchReturn;
  }
  
  #listDiv(): HTMLDivElement {
    const list = document.createElement('div')
    list.classList.add('ss-list')
    list.setAttribute('role', 'listbox')
    return list
  }
  
  public singleSelectedDiv(): SingleSelected {
    const container: HTMLDivElement = document.createElement('div')
    container.classList.add('ss-single-selected')
    
    // Placeholder text
    const placeholder: HTMLSpanElement = document.createElement('span')
    placeholder.classList.add('placeholder')
    container.appendChild(placeholder)
    
    // Deselect
    const deselect = document.createElement('span')
    deselect.innerHTML = "x"
    deselect.classList.add('ss-deselect', 'ss-hide')
    deselect.onclick = this.onDeselect;
    container.appendChild(deselect)
    
    // Arrow
    const arrowContainer: HTMLSpanElement = document.createElement('span')
    arrowContainer.classList.add('ss-arrow')
    
    const arrowIcon = document.createElement('span')
    arrowIcon.classList.add('arrow-down')
    arrowContainer.appendChild(arrowIcon)
    container.appendChild(arrowContainer)
    
    // Add onclick for main selector div
    container.onclick = () => {
      this.isOpened ? this.onClose() : this.onOpen();
    }
    
    return {
      container,
      placeholder,
      deselect,
      arrowIcon: {
        container: arrowContainer,
        arrow: arrowIcon
      }
    }
  }
}