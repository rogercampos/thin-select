import {onRemoveMultiOptionType, onSearchType, Option, Search, SingleSelected, MultiSelected } from "./models"

const buildContainer = (className?: string) => {
  const container = document.createElement('div');
  container.classList.add('ss-main');
  if (className) {
    container.classList.add(className);
  }
  return container;
}

const buildContent = () => {
  const content = document.createElement('div');
  content.classList.add('ss-content');
  return content;
}

const buildSearch = (onSearch: onSearchType) => {
  const container = document.createElement('div')
  container.classList.add('ss-search');
  const input = document.createElement('input')
  
  const searchReturn: Search = {
    container,
    input
  }
  
  input.type = 'search'
  input.tabIndex = 0
  input.placeholder = 'Search'
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
    type: 'single',
    container,
    title,
    arrowIcon: {
      container: arrowContainer,
      arrow: arrowIcon
    }
  }
}

const buildMultiSelect = (onClick: () => void): MultiSelected => {
  const container: HTMLDivElement = document.createElement('div')
  container.classList.add('ss-multi-selected')
  
  // values
  const values = document.createElement('div')
  values.classList.add('ss-values')
  container.appendChild(values)
  
  // Arrow
  const arrowContainer: HTMLSpanElement = document.createElement('span')
  arrowContainer.classList.add('ss-arrow')
  
  const arrowIcon = document.createElement('span')
  arrowIcon.classList.add('arrow-down')
  arrowContainer.appendChild(arrowIcon)
  container.appendChild(arrowContainer)
  
  container.onclick = onClick;
  
  return {
    type: 'multi',
    container,
    values,
    arrowIcon: {
      container: arrowContainer,
      arrow: arrowIcon
    }
  }
}

const buildOption = (option: Option, onOptionSelect: (a: Option) => void) => {
  const optionEl = document.createElement('div')
  optionEl.classList.add('ss-option')
  if (option.innerHtml) {
    optionEl.classList.add('ss-custom-html')
  }
  optionEl.setAttribute('role', 'option')
  optionEl.dataset.ssValue = option.value;
  
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

const buildMultiTitleBadge = (option: Option, onRemoveMultiOption: onRemoveMultiOptionType) => {
  const badge = document.createElement('div')
  badge.classList.add('ss-value');
  badge.dataset.value = option.value;
  
  const span = document.createElement('span')
  span.innerText = option.text || '\xa0';
  span.classList.add('ss-value-text');
  
  const del = document.createElement('span');
  del.innerText = '⨯';
  del.classList.add('ss-value-delete');
  del.onclick = (e) => {
    e.stopPropagation();
    onRemoveMultiOption(option);
  }
  
  badge.appendChild(span);
  badge.appendChild(del);
  
  return badge;
}
  

export { buildContainer, buildContent, buildSearch, buildResultsList, buildSingleSelect, buildMultiSelect, buildOption, buildMultiTitleBadge };