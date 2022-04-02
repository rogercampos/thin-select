import {Option} from "./models"
import { Search, SingleSelected } from "./view";

const buildContainer = () => {
  const container = document.createElement('div');
  container.classList.add('ss-main');
  return container;
}

const buildContent = () => {
  const content = document.createElement('div');
  content.classList.add('ss-content');
  return content;
}

const buildSearch = (onSearch: (text: string) => void) => {
  const container = document.createElement('div')
  container.classList.add('ss-search');
  const input = document.createElement('input')
  
  const searchReturn: Search = {
    container,
    input
  }
  
  input.type = 'search'
  input.tabIndex = 0
  input.setAttribute('aria-label', "Search...")
  input.setAttribute('autocapitalize', 'off')
  input.setAttribute('autocomplete', 'off')
  input.setAttribute('autocorrect', 'off')
  
  input.addEventListener('input', () => {
    onSearch(input.value);
  })
  
  container.appendChild(input)
  
  return searchReturn;
}


const buildResultsList = () => {
  const list = document.createElement('div')
  list.classList.add('ss-list')
  list.setAttribute('role', 'listbox')
  return list;
}


const buildSingleSelect = (onClick: () => void): SingleSelected => {
  const container: HTMLDivElement = document.createElement('div')
  container.classList.add('ss-single-selected')
  
  // Title text
  const title: HTMLSpanElement = document.createElement('span')
  title.classList.add('placeholder')
  container.appendChild(title)
  
  // Arrow
  const arrowContainer: HTMLSpanElement = document.createElement('span')
  arrowContainer.classList.add('ss-arrow')
  
  const arrowIcon = document.createElement('span')
  arrowIcon.classList.add('arrow-down')
  arrowContainer.appendChild(arrowIcon)
  container.appendChild(arrowContainer)
  
  container.onclick = onClick;
  
  return {
    container,
    title,
    arrowIcon: {
      container: arrowContainer,
      arrow: arrowIcon
    }
  }
}


const generateOption = (option: Option, onOptionSelect: (a: Option) => void) => {
  const optionEl = document.createElement('div')
  optionEl.classList.add('ss-option')
  optionEl.setAttribute('role', 'option')
  
  optionEl.addEventListener('click', () => {
    onOptionSelect(option);
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
  

export { buildContainer, buildContent, buildSearch, buildResultsList, buildSingleSelect, generateOption };