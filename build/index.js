class Config {
    id = '';
    style;
    class;
    isMultiple = false;
    isAjax = false;
    isSearching = false;
    showSearch = true;
    searchFocus = true;
    searchHighlight = false;
    closeOnSelect = true;
    showContent = 'auto'; // options: auto, up, down
    searchPlaceholder = 'Search';
    searchText = 'No Results';
    searchingText = 'Searching...';
    placeholderText = 'Select Value';
    allowDeselect = false;
    allowDeselectOption = false;
    hideSelectedOption = false;
    deselectLabel = 'x';
    isEnabled = true;
    valuesUseText = false;
    showOptionTooltips = false;
    selectByGroup = false;
    limit = 0;
    timeoutDelay = 200;
    addToBody = false;
    // Classes
    main = 'ss-main';
    singleSelected = 'ss-single-selected';
    arrow = 'ss-arrow';
    multiSelected = 'ss-multi-selected';
    add = 'ss-add';
    plus = 'ss-plus';
    values = 'ss-values';
    value = 'ss-value';
    valueText = 'ss-value-text';
    valueDelete = 'ss-value-delete';
    content = 'ss-content';
    open = 'ss-open';
    openAbove = 'ss-open-above';
    openBelow = 'ss-open-below';
    search = 'ss-search';
    searchHighlighter = 'ss-search-highlight';
    addable = 'ss-addable';
    list = 'ss-list';
    optgroup = 'ss-optgroup';
    optgroupLabel = 'ss-optgroup-label';
    optgroupLabelSelectable = 'ss-optgroup-label-selectable';
    option = 'ss-option';
    optionSelected = 'ss-option-selected';
    highlighted = 'ss-highlighted';
    disabled = 'ss-disabled';
    hide = 'ss-hide';
    constructor(info) {
        this.id = 'ss-' + Math.floor(Math.random() * 100000);
        this.style = info.select.style.cssText;
        this.class = info.select.className.split(' ');
        this.isMultiple = info.select.multiple;
        this.isAjax = info.isAjax;
        this.showSearch = (info.showSearch === false ? false : true);
        this.searchFocus = (info.searchFocus === false ? false : true);
        this.searchHighlight = (info.searchHighlight === true ? true : false);
        this.closeOnSelect = (info.closeOnSelect === false ? false : true);
        if (info.showContent) {
            this.showContent = info.showContent;
        }
        this.isEnabled = (info.isEnabled === false ? false : true);
        if (info.searchPlaceholder) {
            this.searchPlaceholder = info.searchPlaceholder;
        }
        if (info.searchText) {
            this.searchText = info.searchText;
        }
        if (info.searchingText) {
            this.searchingText = info.searchingText;
        }
        if (info.placeholderText) {
            this.placeholderText = info.placeholderText;
        }
        this.allowDeselect = (info.allowDeselect === true ? true : false);
        this.allowDeselectOption = (info.allowDeselectOption === true ? true : false);
        this.hideSelectedOption = (info.hideSelectedOption === true ? true : false);
        if (info.deselectLabel) {
            this.deselectLabel = info.deselectLabel;
        }
        if (info.valuesUseText) {
            this.valuesUseText = info.valuesUseText;
        }
        if (info.showOptionTooltips) {
            this.showOptionTooltips = info.showOptionTooltips;
        }
        if (info.selectByGroup) {
            this.selectByGroup = info.selectByGroup;
        }
        if (info.limit) {
            this.limit = info.limit;
        }
        if (info.searchFilter) {
            this.searchFilter = info.searchFilter;
        }
        if (info.timeoutDelay != null) {
            this.timeoutDelay = info.timeoutDelay;
        }
        this.addToBody = (info.addToBody === true ? true : false);
    }
    searchFilter(opt, search) {
        return opt.text.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    }
}

function hasClassInTree(element, className) {
    function hasClass(e, c) {
        if (!(!c || !e || !e.classList || !e.classList.contains(c))) {
            return e;
        }
        return null;
    }
    function parentByClass(e, c) {
        if (!e || e === document) {
            return null;
        }
        else if (hasClass(e, c)) {
            return e;
        }
        else {
            return parentByClass(e.parentNode, c);
        }
    }
    return hasClass(element, className) || parentByClass(element, className);
}
function ensureElementInView(container, element) {
    // Determine container top and bottom
    const cTop = container.scrollTop + container.offsetTop; // Make sure to have offsetTop
    const cBottom = cTop + container.clientHeight;
    // Determine element top and bottom
    const eTop = element.offsetTop;
    const eBottom = eTop + element.clientHeight;
    // Check if out of view
    if (eTop < cTop) {
        container.scrollTop -= (cTop - eTop);
    }
    else if (eBottom > cBottom) {
        container.scrollTop += (eBottom - cBottom);
    }
}
function putContent(el, currentPosition, isOpen) {
    const height = el.offsetHeight;
    const rect = el.getBoundingClientRect();
    const elemTop = (isOpen ? rect.top : rect.top - height);
    const elemBottom = (isOpen ? rect.bottom : rect.bottom + height);
    if (elemTop <= 0) {
        return 'below';
    }
    if (elemBottom >= window.innerHeight) {
        return 'above';
    }
    return (isOpen ? currentPosition : 'below');
}
function debounce(func, wait = 100, immediate = false) {
    let timeout;
    return function (...args) {
        const context = self;
        const later = () => {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}
function isValueInArrayOfObjects(selected, key, value) {
    if (!Array.isArray(selected)) {
        return selected[key] === value;
    }
    for (const s of selected) {
        if (s && s[key] && s[key] === value) {
            return true;
        }
    }
    return false;
}
function highlight(str, search, className) {
    // the completed string will be itself if already set, otherwise, the string that was passed in
    let completedString = str;
    const regex = new RegExp('(' + search.trim() + ')(?![^<]*>[^<>]*</)', 'i');
    // If the regex doesn't match the string just exit
    if (!str.match(regex)) {
        return str;
    }
    // Otherwise, get to highlighting
    const matchStartPosition = str.match(regex).index;
    const matchEndPosition = matchStartPosition + str.match(regex)[0].toString().length;
    const originalTextFoundByRegex = str.substring(matchStartPosition, matchEndPosition);
    completedString = completedString.replace(regex, `<mark class="${className}">${originalTextFoundByRegex}</mark>`);
    return completedString;
}
function kebabCase(str) {
    const result = str.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, (match) => '-' + match.toLowerCase());
    return (str[0] === str[0].toUpperCase())
        ? result.substring(1)
        : result;
}

class Select {
    element;
    main;
    mutationObserver;
    triggerMutationObserver = true;
    constructor(info) {
        this.element = info.select;
        this.main = info.main;
        // If original select is set to disabled lets make sure slim is too
        if (this.element.disabled) {
            this.main.config.isEnabled = false;
        }
        this.addAttributes();
        this.addEventListeners();
        this.mutationObserver = null;
        this.addMutationObserver();
        // Add slim to original select dropdown
        const el = this.element;
        el.slim = info.main;
    }
    setValue() {
        if (!this.main.data.getSelected()) {
            return;
        }
        if (this.main.config.isMultiple) {
            // If multiple loop through options and set selected
            const selected = this.main.data.getSelected();
            const options = this.element.options;
            for (const o of options) {
                o.selected = false;
                for (const s of selected) {
                    if (s.value === o.value) {
                        o.selected = true;
                    }
                }
            }
        }
        else {
            // If single select simply set value
            const selected = this.main.data.getSelected();
            this.element.value = (selected ? selected.value : '');
        }
        // Do not trigger onChange callbacks for this event listener
        this.main.data.isOnChangeEnabled = false;
        this.element.dispatchEvent(new CustomEvent('change', { bubbles: true }));
        this.main.data.isOnChangeEnabled = true;
    }
    addAttributes() {
        this.element.tabIndex = -1;
        this.element.style.display = 'none';
        // Add slim select id
        this.element.dataset.ssid = this.main.config.id;
        this.element.setAttribute('aria-hidden', 'true');
    }
    // Add onChange listener to original select
    addEventListeners() {
        this.element.addEventListener('change', (e) => {
            this.main.data.setSelectedFromSelect();
            this.main.render();
        });
    }
    // Add MutationObserver to select
    addMutationObserver() {
        // Only add if not in ajax mode
        if (this.main.config.isAjax) {
            return;
        }
        this.mutationObserver = new MutationObserver((mutations) => {
            if (!this.triggerMutationObserver) {
                return;
            }
            this.main.data.parseSelectData();
            this.main.data.setSelectedFromSelect();
            this.main.render();
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    this.main.slim.updateContainerDivClass(this.main.slim.container);
                }
            });
        });
        this.observeMutationObserver();
    }
    observeMutationObserver() {
        if (!this.mutationObserver) {
            return;
        }
        this.mutationObserver.observe(this.element, {
            attributes: true,
            childList: true,
            characterData: true
        });
    }
    disconnectMutationObserver() {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
    }
    // Create select element and optgroup/options
    create(data) {
        // Clear out select
        this.element.innerHTML = '';
        for (const d of data) {
            if (d.hasOwnProperty('options')) {
                const optgroupObject = d;
                const optgroupEl = document.createElement('optgroup');
                optgroupEl.label = optgroupObject.label;
                if (optgroupObject.options) {
                    for (const oo of optgroupObject.options) {
                        optgroupEl.appendChild(this.createOption(oo));
                    }
                }
                this.element.appendChild(optgroupEl);
            }
            else {
                this.element.appendChild(this.createOption(d));
            }
        }
    }
    createOption(info) {
        const optionEl = document.createElement('option');
        optionEl.value = info.value !== '' ? info.value : info.text;
        optionEl.innerHTML = info.innerHTML || info.text;
        if (info.selected) {
            optionEl.selected = info.selected;
        }
        if (info.display === false) {
            optionEl.style.display = 'none';
        }
        if (info.disabled) {
            optionEl.disabled = true;
        }
        if (info.placeholder) {
            optionEl.setAttribute('data-placeholder', 'true');
        }
        if (info.mandatory) {
            optionEl.setAttribute('data-mandatory', 'true');
        }
        if (info.class) {
            info.class.split(' ').forEach((optionClass) => {
                optionEl.classList.add(optionClass);
            });
        }
        if (info.data && typeof info.data === 'object') {
            Object.keys(info.data).forEach((key) => {
                optionEl.setAttribute('data-' + kebabCase(key), info.data[key]);
            });
        }
        return optionEl;
    }
}

// Class is responsible for managing the data
class Data {
    main;
    searchValue;
    data;
    filtered;
    contentOpen = false;
    contentPosition = 'below';
    isOnChangeEnabled = true;
    constructor(info) {
        this.main = info.main;
        this.searchValue = '';
        this.data = [];
        this.filtered = null;
        this.parseSelectData();
        this.setSelectedFromSelect();
    }
    newOption(info) {
        return {
            id: (info.id ? info.id : String(Math.floor(Math.random() * 100000000))),
            value: (info.value ? info.value : ''),
            text: (info.text ? info.text : ''),
            innerHTML: (info.innerHTML ? info.innerHTML : ''),
            selected: (info.selected ? info.selected : false),
            display: (info.display !== undefined ? info.display : true),
            disabled: (info.disabled ? info.disabled : false),
            placeholder: (info.placeholder ? info.placeholder : false),
            class: (info.class ? info.class : undefined),
            data: (info.data ? info.data : {}),
            mandatory: (info.mandatory ? info.mandatory : false)
        };
    }
    // Add to the current data array
    add(data) {
        this.data.push({
            id: String(Math.floor(Math.random() * 100000000)),
            value: data.value,
            text: data.text,
            innerHTML: '',
            selected: false,
            display: true,
            disabled: false,
            placeholder: false,
            class: undefined,
            mandatory: data.mandatory,
            data: {}
        });
    }
    // From passed in select element pull optgroup and options into data
    parseSelectData() {
        this.data = [];
        // Loop through nodes and create data
        const nodes = this.main.select.element.childNodes;
        for (const n of nodes) {
            if (n.nodeName === 'OPTGROUP') {
                const node = n;
                const optgroup = {
                    label: node.label,
                    options: []
                };
                const options = n.childNodes;
                for (const o of options) {
                    if (o.nodeName === 'OPTION') {
                        const option = this.pullOptionData(o);
                        optgroup.options.push(option);
                        // If option has placeholder set to true set placeholder text
                        if (option.placeholder && option.text.trim() !== '') {
                            this.main.config.placeholderText = option.text;
                        }
                    }
                }
                this.data.push(optgroup);
            }
            else if (n.nodeName === 'OPTION') {
                const option = this.pullOptionData(n);
                this.data.push(option);
                // If option has placeholder set to true set placeholder text
                if (option.placeholder && option.text.trim() !== '') {
                    this.main.config.placeholderText = option.text;
                }
            }
        }
    }
    // From passed in option pull pieces of usable information
    pullOptionData(option) {
        return {
            id: (option.dataset ? option.dataset.id : false) || String(Math.floor(Math.random() * 100000000)),
            value: option.value,
            text: option.text,
            innerHTML: option.innerHTML,
            selected: option.selected,
            disabled: option.disabled,
            placeholder: option.dataset.placeholder === 'true',
            class: option.className,
            style: option.style.cssText,
            data: option.dataset,
            mandatory: (option.dataset ? option.dataset.mandatory === 'true' : false)
        };
    }
    // From select element get current selected and set selected
    setSelectedFromSelect() {
        if (this.main.config.isMultiple) {
            const options = this.main.select.element.options;
            const newSelected = [];
            for (const o of options) {
                if (o.selected) {
                    const newOption = this.getObjectFromData(o.value, 'value');
                    if (newOption && newOption.id) {
                        newSelected.push(newOption.id);
                    }
                }
            }
            this.setSelected(newSelected, 'id');
        }
        else {
            const element = this.main.select.element;
            // Single select element
            if (element.selectedIndex !== -1) {
                const option = element.options[element.selectedIndex];
                const value = option.value;
                this.setSelected(value, 'value');
            }
        }
    }
    // From value set the selected value
    setSelected(value, type = 'id') {
        // Loop through data and set selected values
        for (const d of this.data) {
            // Deal with optgroups
            if (d.hasOwnProperty('label')) {
                if (d.hasOwnProperty('options')) {
                    const options = d.options;
                    if (options) {
                        for (const o of options) {
                            // Do not select if its a placeholder
                            if (o.placeholder) {
                                continue;
                            }
                            o.selected = this.shouldBeSelected(o, value, type);
                        }
                    }
                }
            }
            else {
                d.selected = this.shouldBeSelected(d, value, type);
            }
        }
    }
    // Determines whether or not passed in option should be selected based upon possible values
    shouldBeSelected(option, value, type = 'id') {
        if (Array.isArray(value)) {
            for (const v of value) {
                if (type in option && String(option[type]) === String(v)) {
                    return true;
                }
            }
        }
        else {
            if (type in option && String(option[type]) === String(value)) {
                return true;
            }
        }
        return false;
    }
    // From data get option | option[] of selected values
    // If single select return last selected value
    getSelected() {
        let value = { text: '', placeholder: this.main.config.placeholderText }; // Dont worry about setting this(make typescript happy). If single a value will be selected
        const values = [];
        for (const d of this.data) {
            // Deal with optgroups
            if (d.hasOwnProperty('label')) {
                if (d.hasOwnProperty('options')) {
                    const options = d.options;
                    if (options) {
                        for (const o of options) {
                            if (o.selected) {
                                // If single return option
                                if (!this.main.config.isMultiple) {
                                    value = o;
                                }
                                else {
                                    // Push to multiple array
                                    values.push(o);
                                }
                            }
                        }
                    }
                }
            }
            else {
                // Push options to array
                if (d.selected) {
                    // If single return option
                    if (!this.main.config.isMultiple) {
                        value = d;
                    }
                    else {
                        // Push to multiple array
                        values.push(d);
                    }
                }
            }
        }
        // Either return array or object or null
        if (this.main.config.isMultiple) {
            return values;
        }
        return value;
    }
    // If select type is multiple append value and set selected
    addToSelected(value, type = 'id') {
        if (this.main.config.isMultiple) {
            const values = [];
            const selected = this.getSelected();
            if (Array.isArray(selected)) {
                for (const s of selected) {
                    values.push(s[type]);
                }
            }
            values.push(value);
            this.setSelected(values, type);
        }
    }
    // Remove object from selected
    removeFromSelected(value, type = 'id') {
        if (this.main.config.isMultiple) {
            const values = [];
            const selected = this.getSelected();
            for (const s of selected) {
                if (String(s[type]) !== String(value)) {
                    values.push(s[type]);
                }
            }
            this.setSelected(values, type);
        }
    }
    // Trigger onChange callback
    onDataChange() {
        if (this.main.onChange && this.isOnChangeEnabled) {
            this.main.onChange(JSON.parse(JSON.stringify(this.getSelected())));
        }
    }
    // Take in a value loop through the data till you find it and return it
    getObjectFromData(value, type = 'id') {
        for (const d of this.data) {
            // If option check if value is the same
            if (type in d && String(d[type]) === String(value)) {
                return d;
            }
            // If optgroup loop through options
            if (d.hasOwnProperty('options')) {
                const optgroupObject = d;
                if (optgroupObject.options) {
                    for (const oo of optgroupObject.options) {
                        if (String(oo[type]) === String(value)) {
                            return oo;
                        }
                    }
                }
            }
        }
        return null;
    }
    // Take in search string and return filtered list of values
    search(search) {
        this.searchValue = search;
        if (search.trim() === '') {
            this.filtered = null;
            return;
        }
        const searchFilter = this.main.config.searchFilter;
        const valuesArray = this.data.slice(0);
        search = search.trim();
        const filtered = valuesArray.map((obj) => {
            // If optgroup
            if (obj.hasOwnProperty('options')) {
                const optgroupObj = obj;
                let options = [];
                if (optgroupObj.options) {
                    options = optgroupObj.options.filter((opt) => {
                        return searchFilter(opt, search);
                    });
                }
                if (options.length !== 0) {
                    const optgroup = Object.assign({}, optgroupObj); // Break pointer
                    optgroup.options = options;
                    return optgroup;
                }
            }
            // If single option
            if (obj.hasOwnProperty('text')) {
                const optionObj = obj;
                if (searchFilter(optionObj, search)) {
                    return obj;
                }
            }
            return null;
        });
        // Filter out false values
        this.filtered = filtered.filter((info) => info);
    }
}
function validateData(data) {
    if (!data) {
        console.error('Data must be an array of objects');
        return false;
    }
    let isValid = false;
    let errorCount = 0;
    for (const d of data) {
        if (d.hasOwnProperty('label')) {
            if (d.hasOwnProperty('options')) {
                const optgroup = d;
                const options = optgroup.options;
                if (options) {
                    for (const o of options) {
                        isValid = validateOption(o);
                        if (!isValid) {
                            errorCount++;
                        }
                    }
                }
            }
        }
        else {
            const option = d;
            isValid = validateOption(option);
            if (!isValid) {
                errorCount++;
            }
        }
    }
    return errorCount === 0;
}
function validateOption(option) {
    if (option.text === undefined) {
        console.error('Data object option must have at least have a text value. Check object: ' + JSON.stringify(option));
        return false;
    }
    return true;
}

// Class is responsible for creating all the elements
class Slim {
    main;
    container;
    singleSelected;
    multiSelected;
    content;
    search;
    list;
    constructor(info) {
        this.main = info.main;
        // Create elements in order of appending
        this.container = this.containerDiv();
        this.content = this.contentDiv();
        this.search = this.searchDiv();
        this.list = this.listDiv();
        this.options();
        this.singleSelected = null;
        this.multiSelected = null;
        if (this.main.config.isMultiple) {
            this.multiSelected = this.multiSelectedDiv();
            if (this.multiSelected) {
                this.container.appendChild(this.multiSelected.container);
            }
        }
        else {
            this.singleSelected = this.singleSelectedDiv();
            this.container.appendChild(this.singleSelected.container);
        }
        if (this.main.config.addToBody) {
            // add the id to the content as a class as well
            // this is important on touch devices as the close method is
            // triggered when clicks on the document body occur
            this.content.classList.add(this.main.config.id);
            document.body.appendChild(this.content);
        }
        else {
            this.container.appendChild(this.content);
        }
        this.content.appendChild(this.search.container);
        this.content.appendChild(this.list);
    }
    // Create main container
    containerDiv() {
        // Create main container
        const container = document.createElement('div');
        // Add style and classes
        container.style.cssText = this.main.config.style;
        this.updateContainerDivClass(container);
        return container;
    }
    // Will look at the original select and pull classes from it
    updateContainerDivClass(container) {
        // Set config class
        this.main.config.class = this.main.select.element.className.split(' ');
        // Clear out classlist
        container.className = '';
        // Loop through config class and add
        container.classList.add(this.main.config.id);
        container.classList.add(this.main.config.main);
        for (const c of this.main.config.class) {
            if (c.trim() !== '') {
                container.classList.add(c);
            }
        }
    }
    singleSelectedDiv() {
        const container = document.createElement('div');
        container.classList.add(this.main.config.singleSelected);
        // Placeholder text
        const placeholder = document.createElement('span');
        placeholder.classList.add('placeholder');
        container.appendChild(placeholder);
        // Deselect
        const deselect = document.createElement('span');
        deselect.innerHTML = this.main.config.deselectLabel;
        deselect.classList.add('ss-deselect');
        deselect.onclick = (e) => {
            e.stopPropagation();
            // Dont do anything if disabled
            if (!this.main.config.isEnabled) {
                return;
            }
            this.main.set('');
        };
        container.appendChild(deselect);
        // Arrow
        const arrowContainer = document.createElement('span');
        arrowContainer.classList.add(this.main.config.arrow);
        const arrowIcon = document.createElement('span');
        arrowIcon.classList.add('arrow-down');
        arrowContainer.appendChild(arrowIcon);
        container.appendChild(arrowContainer);
        // Add onclick for main selector div
        container.onclick = () => {
            if (!this.main.config.isEnabled) {
                return;
            }
            this.main.data.contentOpen ? this.main.close() : this.main.open();
        };
        return {
            container,
            placeholder,
            deselect,
            arrowIcon: {
                container: arrowContainer,
                arrow: arrowIcon
            }
        };
    }
    // Based upon current selection set placeholder text
    placeholder() {
        const selected = this.main.data.getSelected();
        // Placeholder display
        if (selected === null || (selected && selected.placeholder)) {
            const placeholder = document.createElement('span');
            placeholder.classList.add(this.main.config.disabled);
            placeholder.innerHTML = this.main.config.placeholderText;
            if (this.singleSelected) {
                this.singleSelected.placeholder.innerHTML = placeholder.outerHTML;
            }
        }
        else {
            let selectedValue = '';
            if (selected) {
                selectedValue = selected.innerHTML && this.main.config.valuesUseText !== true ? selected.innerHTML : selected.text;
            }
            if (this.singleSelected) {
                this.singleSelected.placeholder.innerHTML = (selected ? selectedValue : '');
            }
        }
    }
    // Based upon current selection/settings hide/show deselect
    deselect() {
        if (this.singleSelected) {
            // if allowDeselect is false just hide it
            if (!this.main.config.allowDeselect) {
                this.singleSelected.deselect.classList.add('ss-hide');
                return;
            }
            if (this.main.selected() === '') {
                this.singleSelected.deselect.classList.add('ss-hide');
            }
            else {
                this.singleSelected.deselect.classList.remove('ss-hide');
            }
        }
    }
    multiSelectedDiv() {
        const container = document.createElement('div');
        container.classList.add(this.main.config.multiSelected);
        const values = document.createElement('div');
        values.classList.add(this.main.config.values);
        container.appendChild(values);
        const add = document.createElement('div');
        add.classList.add(this.main.config.add);
        const plus = document.createElement('span');
        plus.classList.add(this.main.config.plus);
        plus.onclick = (e) => {
            if (this.main.data.contentOpen) {
                this.main.close();
                e.stopPropagation();
            }
        };
        add.appendChild(plus);
        container.appendChild(add);
        container.onclick = (e) => {
            if (!this.main.config.isEnabled) {
                return;
            }
            // Open only if you are not clicking on x text
            const target = e.target;
            if (!target.classList.contains(this.main.config.valueDelete)) {
                this.main.data.contentOpen ? this.main.close() : this.main.open();
            }
        };
        return {
            container,
            values,
            add,
            plus
        };
    }
    // Get selected values and append to multiSelected values container
    // and remove those who shouldnt exist
    values() {
        if (!this.multiSelected) {
            return;
        }
        let currentNodes = this.multiSelected.values.childNodes;
        const selected = this.main.data.getSelected();
        // Remove nodes that shouldnt be there
        let exists;
        const nodesToRemove = [];
        for (const c of currentNodes) {
            exists = true;
            for (const s of selected) {
                if (String(s.id) === String(c.dataset.id)) {
                    exists = false;
                }
            }
            if (exists) {
                nodesToRemove.push(c);
            }
        }
        for (const n of nodesToRemove) {
            n.classList.add('ss-out');
            this.multiSelected.values.removeChild(n);
        }
        // Add values that dont currently exist
        currentNodes = this.multiSelected.values.childNodes;
        for (let s = 0; s < selected.length; s++) {
            exists = false;
            for (const c of currentNodes) {
                if (String(selected[s].id) === String(c.dataset.id)) {
                    exists = true;
                }
            }
            if (!exists) {
                if (currentNodes.length === 0 || !HTMLElement.prototype.insertAdjacentElement) {
                    this.multiSelected.values.appendChild(this.valueDiv(selected[s]));
                }
                else if (s === 0) {
                    this.multiSelected.values.insertBefore(this.valueDiv(selected[s]), currentNodes[s]);
                }
                else {
                    currentNodes[s - 1].insertAdjacentElement('afterend', this.valueDiv(selected[s]));
                }
            }
        }
        // If there are no values set placeholder
        if (selected.length === 0) {
            const placeholder = document.createElement('span');
            placeholder.classList.add(this.main.config.disabled);
            placeholder.innerHTML = this.main.config.placeholderText;
            this.multiSelected.values.innerHTML = placeholder.outerHTML;
        }
    }
    valueDiv(optionObj) {
        const value = document.createElement('div');
        value.classList.add(this.main.config.value);
        value.dataset.id = optionObj.id;
        const text = document.createElement('span');
        text.classList.add(this.main.config.valueText);
        text.innerHTML = (optionObj.innerHTML && this.main.config.valuesUseText !== true ? optionObj.innerHTML : optionObj.text);
        value.appendChild(text);
        if (!optionObj.mandatory) {
            const deleteSpan = document.createElement('span');
            deleteSpan.classList.add(this.main.config.valueDelete);
            deleteSpan.innerHTML = this.main.config.deselectLabel;
            deleteSpan.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                let shouldUpdate = false;
                // If no beforeOnChange is set automatically update at end
                if (!this.main.beforeOnChange) {
                    shouldUpdate = true;
                }
                if (this.main.beforeOnChange) {
                    const selected = this.main.data.getSelected();
                    const currentValues = JSON.parse(JSON.stringify(selected));
                    // Remove from current selection
                    for (let i = 0; i < currentValues.length; i++) {
                        if (currentValues[i].id === optionObj.id) {
                            currentValues.splice(i, 1);
                        }
                    }
                    const beforeOnchange = this.main.beforeOnChange(currentValues);
                    if (beforeOnchange !== false) {
                        shouldUpdate = true;
                    }
                }
                if (shouldUpdate) {
                    this.main.data.removeFromSelected(optionObj.id, 'id');
                    this.main.render();
                    this.main.select.setValue();
                    this.main.data.onDataChange(); // Trigger on change callback
                }
            };
            value.appendChild(deleteSpan);
        }
        return value;
    }
    // Create content container
    contentDiv() {
        const container = document.createElement('div');
        container.classList.add(this.main.config.content);
        return container;
    }
    searchDiv() {
        const container = document.createElement('div');
        const input = document.createElement('input');
        const addable = document.createElement('div');
        container.classList.add(this.main.config.search);
        // Setup search return object
        const searchReturn = {
            container,
            input
        };
        // We still want the search to be tabable but not shown
        if (!this.main.config.showSearch) {
            container.classList.add(this.main.config.hide);
            input.readOnly = true;
        }
        input.type = 'search';
        input.placeholder = this.main.config.searchPlaceholder;
        input.tabIndex = 0;
        input.setAttribute('aria-label', this.main.config.searchPlaceholder);
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocorrect', 'off');
        input.onclick = (e) => {
            setTimeout(() => {
                const target = e.target;
                if (target.value === '') {
                    this.main.search('');
                }
            }, 10);
        };
        input.onkeydown = (e) => {
            if (e.key === 'ArrowUp') {
                this.main.open();
                this.highlightUp();
                e.preventDefault();
            }
            else if (e.key === 'ArrowDown') {
                this.main.open();
                this.highlightDown();
                e.preventDefault();
            }
            else if (e.key === 'Tab') {
                if (!this.main.data.contentOpen) {
                    setTimeout(() => { this.main.close(); }, this.main.config.timeoutDelay);
                }
                else {
                    this.main.close();
                }
            }
            else if (e.key === 'Enter') {
                e.preventDefault();
            }
        };
        input.onkeyup = (e) => {
            const target = e.target;
            if (e.key === 'Enter') {
                if (this.main.addable && e.ctrlKey) {
                    addable.click();
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                const highlighted = this.list.querySelector('.' + this.main.config.highlighted);
                if (highlighted) {
                    highlighted.click();
                }
            }
            else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') ;
            else if (e.key === 'Escape') {
                this.main.close();
            }
            else {
                if (this.main.config.showSearch && this.main.data.contentOpen) {
                    this.main.search(target.value);
                }
                else {
                    input.value = '';
                }
            }
            e.preventDefault();
            e.stopPropagation();
        };
        input.onfocus = () => { this.main.open(); };
        container.appendChild(input);
        if (this.main.addable) {
            addable.classList.add(this.main.config.addable);
            addable.innerHTML = '+';
            addable.onclick = (e) => {
                if (this.main.addable) {
                    e.preventDefault();
                    e.stopPropagation();
                    const inputValue = this.search.input.value;
                    if (inputValue.trim() === '') {
                        this.search.input.focus();
                        return;
                    }
                    const addableValue = this.main.addable(inputValue);
                    let addableValueStr = '';
                    if (!addableValue) {
                        return;
                    }
                    if (typeof addableValue === 'object') {
                        const validValue = validateOption(addableValue);
                        if (validValue) {
                            this.main.addData(addableValue);
                            addableValueStr = (addableValue.value ? addableValue.value : addableValue.text);
                        }
                    }
                    else {
                        this.main.addData(this.main.data.newOption({
                            text: addableValue,
                            value: addableValue
                        }));
                        addableValueStr = addableValue;
                    }
                    this.main.search('');
                    setTimeout(() => {
                        this.main.set(addableValueStr, 'value', false, false);
                    }, 100);
                    // Close it only if closeOnSelect = true
                    if (this.main.config.closeOnSelect) {
                        setTimeout(() => {
                            this.main.close();
                        }, 100);
                    }
                }
            };
            container.appendChild(addable);
            searchReturn.addable = addable;
        }
        return searchReturn;
    }
    highlightUp() {
        const highlighted = this.list.querySelector('.' + this.main.config.highlighted);
        let prev = null;
        if (highlighted) {
            prev = highlighted.previousSibling;
            while (prev !== null) {
                if (prev.classList.contains(this.main.config.disabled)) {
                    prev = prev.previousSibling;
                    continue;
                }
                else {
                    break;
                }
            }
        }
        else {
            const allOptions = this.list.querySelectorAll('.' + this.main.config.option + ':not(.' + this.main.config.disabled + ')');
            prev = allOptions[allOptions.length - 1];
        }
        // Do not select if optgroup label
        if (prev && prev.classList.contains(this.main.config.optgroupLabel)) {
            prev = null;
        }
        // Check if parent is optgroup
        if (prev === null) {
            const parent = highlighted.parentNode;
            if (parent.classList.contains(this.main.config.optgroup)) {
                if (parent.previousSibling) {
                    const prevNodes = parent.previousSibling.querySelectorAll('.' + this.main.config.option + ':not(.' + this.main.config.disabled + ')');
                    if (prevNodes.length) {
                        prev = prevNodes[prevNodes.length - 1];
                    }
                }
            }
        }
        // If previous element exists highlight it
        if (prev) {
            if (highlighted) {
                highlighted.classList.remove(this.main.config.highlighted);
            }
            prev.classList.add(this.main.config.highlighted);
            ensureElementInView(this.list, prev);
        }
    }
    highlightDown() {
        const highlighted = this.list.querySelector('.' + this.main.config.highlighted);
        let next = null;
        if (highlighted) {
            next = highlighted.nextSibling;
            while (next !== null) {
                if (next.classList.contains(this.main.config.disabled)) {
                    next = next.nextSibling;
                    continue;
                }
                else {
                    break;
                }
            }
        }
        else {
            next = this.list.querySelector('.' + this.main.config.option + ':not(.' + this.main.config.disabled + ')');
        }
        // Check if parent is optgroup
        if (next === null && highlighted !== null) {
            const parent = highlighted.parentNode;
            if (parent.classList.contains(this.main.config.optgroup)) {
                if (parent.nextSibling) {
                    const sibling = parent.nextSibling;
                    next = sibling.querySelector('.' + this.main.config.option + ':not(.' + this.main.config.disabled + ')');
                }
            }
        }
        // If previous element exists highlight it
        if (next) {
            if (highlighted) {
                highlighted.classList.remove(this.main.config.highlighted);
            }
            next.classList.add(this.main.config.highlighted);
            ensureElementInView(this.list, next);
        }
    }
    // Create main container that options will reside
    listDiv() {
        const list = document.createElement('div');
        list.classList.add(this.main.config.list);
        list.setAttribute('role', 'listbox');
        // @todo Link to?
        // list.setAttribute('aria-labelledby', '')
        return list;
    }
    // Loop through data || filtered data and build options and append to list container
    options(content = '') {
        const data = this.main.data.filtered || this.main.data.data;
        // Clear out innerHtml
        this.list.innerHTML = '';
        // If content is being passed just use that text
        if (content !== '') {
            const searching = document.createElement('div');
            searching.classList.add(this.main.config.option);
            searching.classList.add(this.main.config.disabled);
            searching.innerHTML = content;
            this.list.appendChild(searching);
            return;
        }
        // If ajax and isSearching
        if (this.main.config.isAjax && this.main.config.isSearching) {
            const searching = document.createElement('div');
            searching.classList.add(this.main.config.option);
            searching.classList.add(this.main.config.disabled);
            searching.innerHTML = this.main.config.searchingText;
            this.list.appendChild(searching);
            return;
        }
        // If no results show no results text
        if (data.length === 0) {
            const noResults = document.createElement('div');
            noResults.classList.add(this.main.config.option);
            noResults.classList.add(this.main.config.disabled);
            noResults.innerHTML = this.main.config.searchText;
            this.list.appendChild(noResults);
            return;
        }
        // Append individual options to div container
        for (const d of data) {
            // Create optgroup
            if (d.hasOwnProperty('label')) {
                const item = d;
                const optgroupEl = document.createElement('div');
                optgroupEl.classList.add(this.main.config.optgroup);
                // Create label
                const optgroupLabel = document.createElement('div');
                optgroupLabel.classList.add(this.main.config.optgroupLabel);
                if (this.main.config.selectByGroup && this.main.config.isMultiple) {
                    optgroupLabel.classList.add(this.main.config.optgroupLabelSelectable);
                }
                optgroupLabel.innerHTML = item.label;
                optgroupEl.appendChild(optgroupLabel);
                const options = item.options;
                if (options) {
                    for (const o of options) {
                        optgroupEl.appendChild(this.option(o));
                    }
                    // Selecting all values by clicking the group label
                    if (this.main.config.selectByGroup && this.main.config.isMultiple) {
                        const master = this;
                        optgroupLabel.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            for (const childEl of optgroupEl.children) {
                                if (childEl.className.indexOf(master.main.config.option) !== -1) {
                                    childEl.click();
                                }
                            }
                        });
                    }
                }
                this.list.appendChild(optgroupEl);
            }
            else {
                this.list.appendChild(this.option(d));
            }
        }
    }
    // Create single option
    option(data) {
        // Add hidden placeholder
        if (data.placeholder) {
            const placeholder = document.createElement('div');
            placeholder.classList.add(this.main.config.option);
            placeholder.classList.add(this.main.config.hide);
            return placeholder;
        }
        const optionEl = document.createElement('div');
        // Add class to div element
        optionEl.classList.add(this.main.config.option);
        // Add WCAG attribute
        optionEl.setAttribute('role', 'option');
        if (data.class) {
            data.class.split(' ').forEach((dataClass) => {
                optionEl.classList.add(dataClass);
            });
        }
        // Add style to div element
        if (data.style) {
            optionEl.style.cssText = data.style;
        }
        const selected = this.main.data.getSelected();
        optionEl.dataset.id = data.id;
        if (this.main.config.searchHighlight && this.main.slim && data.innerHTML && this.main.slim.search.input.value.trim() !== '') {
            optionEl.innerHTML = highlight(data.innerHTML, this.main.slim.search.input.value, this.main.config.searchHighlighter);
        }
        else if (data.innerHTML) {
            optionEl.innerHTML = data.innerHTML;
        }
        if (this.main.config.showOptionTooltips && optionEl.textContent) {
            optionEl.setAttribute('title', optionEl.textContent);
        }
        const master = this;
        optionEl.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const element = this;
            const elementID = element.dataset.id;
            if (data.selected === true && master.main.config.allowDeselectOption) {
                let shouldUpdate = false;
                // If no beforeOnChange is set automatically update at end
                if (!master.main.beforeOnChange || !master.main.config.isMultiple) {
                    shouldUpdate = true;
                }
                if (master.main.beforeOnChange && master.main.config.isMultiple) {
                    const selectedValues = master.main.data.getSelected();
                    const currentValues = JSON.parse(JSON.stringify(selectedValues));
                    // Remove from current selection
                    for (let i = 0; i < currentValues.length; i++) {
                        if (currentValues[i].id === elementID) {
                            currentValues.splice(i, 1);
                        }
                    }
                    const beforeOnchange = master.main.beforeOnChange(currentValues);
                    if (beforeOnchange !== false) {
                        shouldUpdate = true;
                    }
                }
                if (shouldUpdate) {
                    if (master.main.config.isMultiple) {
                        master.main.data.removeFromSelected(elementID, 'id');
                        master.main.render();
                        master.main.select.setValue();
                        master.main.data.onDataChange(); // Trigger on change callback
                    }
                    else {
                        master.main.set('');
                    }
                }
            }
            else {
                // Check if option is disabled or is already selected, do nothing
                if (data.disabled || data.selected) {
                    return;
                }
                // Check if hit limit
                if (master.main.config.limit && Array.isArray(selected) && master.main.config.limit <= selected.length) {
                    return;
                }
                if (master.main.beforeOnChange) {
                    let value;
                    const objectInfo = JSON.parse(JSON.stringify(master.main.data.getObjectFromData(elementID)));
                    objectInfo.selected = true;
                    if (master.main.config.isMultiple) {
                        value = JSON.parse(JSON.stringify(selected));
                        value.push(objectInfo);
                    }
                    else {
                        value = JSON.parse(JSON.stringify(objectInfo));
                    }
                    const beforeOnchange = master.main.beforeOnChange(value);
                    if (beforeOnchange !== false) {
                        master.main.set(elementID, 'id', master.main.config.closeOnSelect);
                    }
                }
                else {
                    master.main.set(elementID, 'id', master.main.config.closeOnSelect);
                }
            }
        });
        const isSelected = selected && isValueInArrayOfObjects(selected, 'id', data.id);
        if (data.disabled || isSelected) {
            optionEl.onclick = null;
            if (!master.main.config.allowDeselectOption) {
                optionEl.classList.add(this.main.config.disabled);
            }
            if (master.main.config.hideSelectedOption) {
                optionEl.classList.add(this.main.config.hide);
            }
        }
        if (isSelected) {
            optionEl.classList.add(this.main.config.optionSelected);
        }
        else {
            optionEl.classList.remove(this.main.config.optionSelected);
        }
        return optionEl;
    }
}

class ThinSelect {
    config;
    select;
    data;
    slim;
    ajax = null;
    addable = null;
    beforeOnChange = null;
    onChange = null;
    beforeOpen = null;
    afterOpen = null;
    beforeClose = null;
    afterClose = null;
    windowScroll = debounce((e) => {
        if (this.data.contentOpen) {
            if (putContent(this.slim.content, this.data.contentPosition, this.data.contentOpen) === 'above') {
                this.moveContentAbove();
            }
            else {
                this.moveContentBelow();
            }
        }
    });
    constructor(info) {
        const selectElement = this.validate(info);
        // If select already has a slim select id on it lets destroy it first
        if (selectElement.dataset.ssid) {
            this.destroy(selectElement.dataset.ssid);
        }
        // Set ajax function if passed in
        if (info.ajax) {
            this.ajax = info.ajax;
        }
        // Add addable if option is passed in
        if (info.addable) {
            this.addable = info.addable;
        }
        this.config = new Config({
            select: selectElement,
            isAjax: (info.ajax ? true : false),
            showSearch: info.showSearch,
            searchPlaceholder: info.searchPlaceholder,
            searchText: info.searchText,
            searchingText: info.searchingText,
            searchFocus: info.searchFocus,
            searchHighlight: info.searchHighlight,
            searchFilter: info.searchFilter,
            closeOnSelect: info.closeOnSelect,
            showContent: info.showContent,
            placeholderText: info.placeholder,
            allowDeselect: info.allowDeselect,
            allowDeselectOption: info.allowDeselectOption,
            hideSelectedOption: info.hideSelectedOption,
            deselectLabel: info.deselectLabel,
            isEnabled: info.isEnabled,
            valuesUseText: info.valuesUseText,
            showOptionTooltips: info.showOptionTooltips,
            selectByGroup: info.selectByGroup,
            limit: info.limit,
            timeoutDelay: info.timeoutDelay,
            addToBody: info.addToBody
        });
        this.select = new Select({
            select: selectElement,
            main: this
        });
        this.data = new Data({ main: this });
        this.slim = new Slim({ main: this });
        // Add after original select element
        if (this.select.element.parentNode) {
            this.select.element.parentNode.insertBefore(this.slim.container, this.select.element.nextSibling);
        }
        // If data is passed in lets set it
        // and thus will start the render
        if (info.data) {
            this.setData(info.data);
        }
        else {
            // Do an initial render on startup
            this.render();
        }
        // Add onclick listener to document to closeContent if clicked outside
        document.addEventListener('click', this.documentClick);
        // If the user wants to show the content forcibly on a specific side,
        // there is no need to listen for scroll events
        if (this.config.showContent === 'auto') {
            window.addEventListener('scroll', this.windowScroll, false);
        }
        // Add event callbacks after everthing has been created
        if (info.beforeOnChange) {
            this.beforeOnChange = info.beforeOnChange;
        }
        if (info.onChange) {
            this.onChange = info.onChange;
        }
        if (info.beforeOpen) {
            this.beforeOpen = info.beforeOpen;
        }
        if (info.afterOpen) {
            this.afterOpen = info.afterOpen;
        }
        if (info.beforeClose) {
            this.beforeClose = info.beforeClose;
        }
        if (info.afterClose) {
            this.afterClose = info.afterClose;
        }
        // If disabled lets call it
        if (!this.config.isEnabled) {
            this.disable();
        }
    }
    validate(info) {
        const select = (typeof info.select === 'string' ? document.querySelector(info.select) : info.select);
        if (!select) {
            throw new Error('Could not find select element');
        }
        if (select.tagName !== 'SELECT') {
            throw new Error('Element isnt of type select');
        }
        return select;
    }
    selected() {
        if (this.config.isMultiple) {
            const selected = this.data.getSelected();
            const outputSelected = [];
            for (const s of selected) {
                outputSelected.push(s.value);
            }
            return outputSelected;
        }
        else {
            const selected = this.data.getSelected();
            return (selected ? selected.value : '');
        }
    }
    // Sets value of the select, adds it to data and original select
    set(value, type = 'value', close = true, render = true) {
        if (this.config.isMultiple && !Array.isArray(value)) {
            this.data.addToSelected(value, type);
        }
        else {
            this.data.setSelected(value, type);
        }
        this.select.setValue();
        this.data.onDataChange(); // Trigger on change callback
        this.render();
        // Close when all options are selected and hidden
        if (this.config.hideSelectedOption && this.config.isMultiple && this.data.getSelected().length === this.data.data.length) {
            close = true;
        }
        if (close) {
            this.close();
        }
    }
    // setSelected is just mapped to the set method
    setSelected(value, type = 'value', close = true, render = true) {
        this.set(value, type, close, render);
    }
    setData(data) {
        // Validate data if passed in
        const isValid = validateData(data);
        if (!isValid) {
            console.error('Validation problem on: #' + this.select.element.id);
            return;
        } // If data passed in is not valid DO NOT parse, set and render
        const newData = JSON.parse(JSON.stringify(data));
        const selected = this.data.getSelected();
        // Check newData to make sure value is set
        // If not set from text
        for (let i = 0; i < newData.length; i++) {
            if (!newData[i].value && !newData[i].placeholder) {
                newData[i].value = newData[i].text;
            }
        }
        // If its an ajax type keep selected values
        if (this.config.isAjax && selected) {
            if (this.config.isMultiple) {
                const reverseSelected = selected.reverse();
                for (const r of reverseSelected) {
                    newData.unshift(r);
                }
            }
            else {
                newData.unshift(selected);
                // Look for duplicate selected if so remove it
                for (let i = 0; i < newData.length; i++) {
                    if (!newData[i].placeholder && newData[i].value === selected.value && newData[i].text === selected.text) {
                        newData.splice(i, 1);
                    }
                }
                // Add placeholder if it doesnt already have one
                let hasPlaceholder = false;
                for (let i = 0; i < newData.length; i++) {
                    if (newData[i].placeholder) {
                        hasPlaceholder = true;
                    }
                }
                if (!hasPlaceholder) {
                    newData.unshift({ text: '', placeholder: true });
                }
            }
        }
        this.select.create(newData);
        this.data.parseSelectData();
        this.data.setSelectedFromSelect();
    }
    // addData will append to the current data set
    addData(data) {
        // Validate data if passed in
        const isValid = validateData([data]);
        if (!isValid) {
            console.error('Validation problem on: #' + this.select.element.id);
            return;
        } // If data passed in is not valid DO NOT parse, set and render
        this.data.add(this.data.newOption(data));
        this.select.create(this.data.data);
        this.data.parseSelectData();
        this.data.setSelectedFromSelect();
        this.render();
    }
    // Open content section
    open() {
        // Dont open if disabled
        if (!this.config.isEnabled) {
            return;
        }
        // Dont do anything if the content is already open
        if (this.data.contentOpen) {
            return;
        }
        // Dont open when all options are selected and hidden
        if (this.config.hideSelectedOption && this.config.isMultiple && this.data.getSelected().length === this.data.data.length) {
            return;
        }
        // Run beforeOpen callback
        if (this.beforeOpen) {
            this.beforeOpen();
        }
        if (this.config.isMultiple && this.slim.multiSelected) {
            this.slim.multiSelected.plus.classList.add('ss-cross');
        }
        else if (this.slim.singleSelected) {
            this.slim.singleSelected.arrowIcon.arrow.classList.remove('arrow-down');
            this.slim.singleSelected.arrowIcon.arrow.classList.add('arrow-up');
        }
        this.slim[(this.config.isMultiple ? 'multiSelected' : 'singleSelected')].container.classList.add((this.data.contentPosition === 'above' ? this.config.openAbove : this.config.openBelow));
        if (this.config.addToBody) {
            // move the content in to the right location
            const containerRect = this.slim.container.getBoundingClientRect();
            this.slim.content.style.top = (containerRect.top + containerRect.height + window.scrollY) + 'px';
            this.slim.content.style.left = (containerRect.left + window.scrollX) + 'px';
            this.slim.content.style.width = containerRect.width + 'px';
        }
        this.slim.content.classList.add(this.config.open);
        // Check showContent to see if they want to specifically show in a certain direction
        if (this.config.showContent.toLowerCase() === 'up') {
            this.moveContentAbove();
        }
        else if (this.config.showContent.toLowerCase() === 'down') {
            this.moveContentBelow();
        }
        else {
            // Auto identify where to put it
            if (putContent(this.slim.content, this.data.contentPosition, this.data.contentOpen) === 'above') {
                this.moveContentAbove();
            }
            else {
                this.moveContentBelow();
            }
        }
        // Move to selected option for single option
        if (!this.config.isMultiple) {
            const selected = this.data.getSelected();
            if (selected) {
                const selectedId = selected.id;
                const selectedOption = this.slim.list.querySelector('[data-id="' + selectedId + '"]');
                if (selectedOption) {
                    ensureElementInView(this.slim.list, selectedOption);
                }
            }
        }
        // setTimeout is for animation completion
        setTimeout(() => {
            this.data.contentOpen = true;
            // Focus on input field
            if (this.config.searchFocus) {
                this.slim.search.input.focus();
            }
            // Run afterOpen callback
            if (this.afterOpen) {
                this.afterOpen();
            }
        }, this.config.timeoutDelay);
    }
    // Close content section
    close() {
        // Dont do anything if the content is already closed
        if (!this.data.contentOpen) {
            return;
        }
        // Run beforeClose calback
        if (this.beforeClose) {
            this.beforeClose();
        }
        // this.slim.search.input.blur() // Removed due to safari quirk
        if (this.config.isMultiple && this.slim.multiSelected) {
            this.slim.multiSelected.container.classList.remove(this.config.openAbove);
            this.slim.multiSelected.container.classList.remove(this.config.openBelow);
            this.slim.multiSelected.plus.classList.remove('ss-cross');
        }
        else if (this.slim.singleSelected) {
            this.slim.singleSelected.container.classList.remove(this.config.openAbove);
            this.slim.singleSelected.container.classList.remove(this.config.openBelow);
            this.slim.singleSelected.arrowIcon.arrow.classList.add('arrow-down');
            this.slim.singleSelected.arrowIcon.arrow.classList.remove('arrow-up');
        }
        this.slim.content.classList.remove(this.config.open);
        this.data.contentOpen = false;
        this.search(''); // Clear search
        // Reset the content below
        setTimeout(() => {
            this.slim.content.removeAttribute('style');
            this.data.contentPosition = 'below';
            if (this.config.isMultiple && this.slim.multiSelected) {
                this.slim.multiSelected.container.classList.remove(this.config.openAbove);
                this.slim.multiSelected.container.classList.remove(this.config.openBelow);
            }
            else if (this.slim.singleSelected) {
                this.slim.singleSelected.container.classList.remove(this.config.openAbove);
                this.slim.singleSelected.container.classList.remove(this.config.openBelow);
            }
            // After content is closed lets blur on the input field
            this.slim.search.input.blur();
            // Run afterClose callback
            if (this.afterClose) {
                this.afterClose();
            }
        }, this.config.timeoutDelay);
    }
    moveContentAbove() {
        let selectHeight = 0;
        if (this.config.isMultiple && this.slim.multiSelected) {
            selectHeight = this.slim.multiSelected.container.offsetHeight;
        }
        else if (this.slim.singleSelected) {
            selectHeight = this.slim.singleSelected.container.offsetHeight;
        }
        const contentHeight = this.slim.content.offsetHeight;
        const height = selectHeight + contentHeight - 1;
        this.slim.content.style.margin = '-' + height + 'px 0 0 0';
        this.slim.content.style.height = (height - selectHeight + 1) + 'px';
        this.slim.content.style.transformOrigin = 'center bottom';
        this.data.contentPosition = 'above';
        if (this.config.isMultiple && this.slim.multiSelected) {
            this.slim.multiSelected.container.classList.remove(this.config.openBelow);
            this.slim.multiSelected.container.classList.add(this.config.openAbove);
        }
        else if (this.slim.singleSelected) {
            this.slim.singleSelected.container.classList.remove(this.config.openBelow);
            this.slim.singleSelected.container.classList.add(this.config.openAbove);
        }
    }
    moveContentBelow() {
        this.data.contentPosition = 'below';
        if (this.config.isMultiple && this.slim.multiSelected) {
            this.slim.multiSelected.container.classList.remove(this.config.openAbove);
            this.slim.multiSelected.container.classList.add(this.config.openBelow);
        }
        else if (this.slim.singleSelected) {
            this.slim.singleSelected.container.classList.remove(this.config.openAbove);
            this.slim.singleSelected.container.classList.add(this.config.openBelow);
        }
    }
    // Set to enabled, remove disabled classes and removed disabled from original select
    enable() {
        this.config.isEnabled = true;
        if (this.config.isMultiple && this.slim.multiSelected) {
            this.slim.multiSelected.container.classList.remove(this.config.disabled);
        }
        else if (this.slim.singleSelected) {
            this.slim.singleSelected.container.classList.remove(this.config.disabled);
        }
        // Disable original select but dont trigger observer
        this.select.triggerMutationObserver = false;
        this.select.element.disabled = false;
        this.slim.search.input.disabled = false;
        this.select.triggerMutationObserver = true;
    }
    // Set to disabled, add disabled classes and add disabled to original select
    disable() {
        this.config.isEnabled = false;
        if (this.config.isMultiple && this.slim.multiSelected) {
            this.slim.multiSelected.container.classList.add(this.config.disabled);
        }
        else if (this.slim.singleSelected) {
            this.slim.singleSelected.container.classList.add(this.config.disabled);
        }
        // Enable original select but dont trigger observer
        this.select.triggerMutationObserver = false;
        this.select.element.disabled = true;
        this.slim.search.input.disabled = true;
        this.select.triggerMutationObserver = true;
    }
    // Take in string value and search current options
    search(value) {
        // Only filter data and rerender if value has changed
        if (this.data.searchValue === value) {
            return;
        }
        this.slim.search.input.value = value;
        if (this.config.isAjax) {
            const master = this;
            this.config.isSearching = true;
            this.render();
            // If ajax call it
            if (this.ajax) {
                this.ajax(value, (info) => {
                    // Only process if return callback is not false
                    master.config.isSearching = false;
                    if (Array.isArray(info)) {
                        info.unshift({ text: '', placeholder: true });
                        master.setData(info);
                        master.data.search(value);
                        master.render();
                    }
                    else if (typeof info === 'string') {
                        master.slim.options(info);
                    }
                    else {
                        master.render();
                    }
                });
            }
        }
        else {
            this.data.search(value);
            this.render();
        }
    }
    setSearchText(text) {
        this.config.searchText = text;
    }
    render() {
        if (this.config.isMultiple) {
            this.slim.values();
        }
        else {
            this.slim.placeholder();
            this.slim.deselect();
        }
        this.slim.options();
    }
    // Display original select again and remove slim
    destroy(id = null) {
        const slim = (id ? document.querySelector('.' + id + '.ss-main') : this.slim.container);
        const select = (id ? document.querySelector(`[data-ssid=${id}]`) : this.select.element);
        // If there is no slim dont do anything
        if (!slim || !select) {
            return;
        }
        document.removeEventListener('click', this.documentClick);
        if (this.config.showContent === 'auto') {
            window.removeEventListener('scroll', this.windowScroll, false);
        }
        // Show original select
        select.style.display = '';
        delete select.dataset.ssid;
        // Remove slim from original select dropdown
        const el = select;
        el.slim = null;
        // Remove slim select
        if (slim.parentElement) {
            slim.parentElement.removeChild(slim);
        }
        // remove the content if it was added to the document body
        if (this.config.addToBody) {
            const slimContent = (id ? document.querySelector('.' + id + '.ss-content') : this.slim.content);
            if (!slimContent) {
                return;
            }
            document.body.removeChild(slimContent);
        }
    }
    documentClick = (e) => {
        if (e.target && !hasClassInTree(e.target, this.config.id)) {
            this.close();
        }
    };
}

export { ThinSelect as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25maWcudHMiLCIuLi9zcmMvaGVscGVyLnRzIiwiLi4vc3JjL3NlbGVjdC50cyIsIi4uL3NyYy9kYXRhLnRzIiwiLi4vc3JjL3NsaW0udHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3B0aW9uIH0gZnJvbSAnLi9kYXRhJ1xuXG5pbnRlcmZhY2UgQ29uc3RydWN0b3Ige1xuICBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50XG4gIGlzQWpheDogYm9vbGVhblxuICBzaG93U2VhcmNoPzogYm9vbGVhblxuICBzZWFyY2hQbGFjZWhvbGRlcj86IHN0cmluZ1xuICBzZWFyY2hUZXh0Pzogc3RyaW5nXG4gIHNlYXJjaGluZ1RleHQ/OiBzdHJpbmdcbiAgc2VhcmNoRm9jdXM/OiBib29sZWFuXG4gIHNlYXJjaEhpZ2hsaWdodD86IGJvb2xlYW5cbiAgc2VhcmNoRmlsdGVyPzogKG9wdDogT3B0aW9uLCBzZWFyY2g6IHN0cmluZykgPT4gYm9vbGVhblxuICBjbG9zZU9uU2VsZWN0PzogYm9vbGVhblxuICBzaG93Q29udGVudD86IHN0cmluZ1xuICBwbGFjZWhvbGRlclRleHQ/OiBzdHJpbmdcbiAgYWxsb3dEZXNlbGVjdD86IGJvb2xlYW5cbiAgYWxsb3dEZXNlbGVjdE9wdGlvbj86IGJvb2xlYW5cbiAgaGlkZVNlbGVjdGVkT3B0aW9uPzogYm9vbGVhblxuICBkZXNlbGVjdExhYmVsPzogc3RyaW5nXG4gIGlzRW5hYmxlZD86IGJvb2xlYW5cbiAgdmFsdWVzVXNlVGV4dD86IGJvb2xlYW5cbiAgc2hvd09wdGlvblRvb2x0aXBzPzogYm9vbGVhblxuICBzZWxlY3RCeUdyb3VwPzogYm9vbGVhblxuICBsaW1pdD86IG51bWJlclxuICB0aW1lb3V0RGVsYXk/OiBudW1iZXJcbiAgYWRkVG9Cb2R5PzogYm9vbGVhblxufVxuXG5leHBvcnQgY2xhc3MgQ29uZmlnIHtcbiAgcHVibGljIGlkOiBzdHJpbmcgPSAnJ1xuICBwdWJsaWMgc3R5bGU6IHN0cmluZ1xuICBwdWJsaWMgY2xhc3M6IHN0cmluZ1tdXG4gIHB1YmxpYyBpc011bHRpcGxlOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGlzQWpheDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBpc1NlYXJjaGluZzogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBzaG93U2VhcmNoOiBib29sZWFuID0gdHJ1ZVxuICBwdWJsaWMgc2VhcmNoRm9jdXM6IGJvb2xlYW4gPSB0cnVlXG4gIHB1YmxpYyBzZWFyY2hIaWdobGlnaHQ6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgY2xvc2VPblNlbGVjdDogYm9vbGVhbiA9IHRydWVcbiAgcHVibGljIHNob3dDb250ZW50OiBzdHJpbmcgPSAnYXV0bycgLy8gb3B0aW9uczogYXV0bywgdXAsIGRvd25cbiAgcHVibGljIHNlYXJjaFBsYWNlaG9sZGVyOiBzdHJpbmcgPSAnU2VhcmNoJ1xuICBwdWJsaWMgc2VhcmNoVGV4dDogc3RyaW5nID0gJ05vIFJlc3VsdHMnXG4gIHB1YmxpYyBzZWFyY2hpbmdUZXh0OiBzdHJpbmcgPSAnU2VhcmNoaW5nLi4uJ1xuICBwdWJsaWMgcGxhY2Vob2xkZXJUZXh0OiBzdHJpbmcgPSAnU2VsZWN0IFZhbHVlJ1xuICBwdWJsaWMgYWxsb3dEZXNlbGVjdDogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBhbGxvd0Rlc2VsZWN0T3B0aW9uOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIGhpZGVTZWxlY3RlZE9wdGlvbjogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyBkZXNlbGVjdExhYmVsOiBzdHJpbmcgPSAneCdcbiAgcHVibGljIGlzRW5hYmxlZDogYm9vbGVhbiA9IHRydWVcbiAgcHVibGljIHZhbHVlc1VzZVRleHQ6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgc2hvd09wdGlvblRvb2x0aXBzOiBib29sZWFuID0gZmFsc2VcbiAgcHVibGljIHNlbGVjdEJ5R3JvdXA6IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgbGltaXQ6IG51bWJlciA9IDBcbiAgcHVibGljIHRpbWVvdXREZWxheTogbnVtYmVyID0gMjAwXG4gIHB1YmxpYyBhZGRUb0JvZHk6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8vIENsYXNzZXNcbiAgcHVibGljIHJlYWRvbmx5IG1haW46IHN0cmluZyA9ICdzcy1tYWluJ1xuICBwdWJsaWMgcmVhZG9ubHkgc2luZ2xlU2VsZWN0ZWQ6IHN0cmluZyA9ICdzcy1zaW5nbGUtc2VsZWN0ZWQnXG4gIHB1YmxpYyByZWFkb25seSBhcnJvdzogc3RyaW5nID0gJ3NzLWFycm93J1xuICBwdWJsaWMgcmVhZG9ubHkgbXVsdGlTZWxlY3RlZDogc3RyaW5nID0gJ3NzLW11bHRpLXNlbGVjdGVkJ1xuICBwdWJsaWMgcmVhZG9ubHkgYWRkOiBzdHJpbmcgPSAnc3MtYWRkJ1xuICBwdWJsaWMgcmVhZG9ubHkgcGx1czogc3RyaW5nID0gJ3NzLXBsdXMnXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZXM6IHN0cmluZyA9ICdzcy12YWx1ZXMnXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZTogc3RyaW5nID0gJ3NzLXZhbHVlJ1xuICBwdWJsaWMgcmVhZG9ubHkgdmFsdWVUZXh0OiBzdHJpbmcgPSAnc3MtdmFsdWUtdGV4dCdcbiAgcHVibGljIHJlYWRvbmx5IHZhbHVlRGVsZXRlOiBzdHJpbmcgPSAnc3MtdmFsdWUtZGVsZXRlJ1xuICBwdWJsaWMgcmVhZG9ubHkgY29udGVudDogc3RyaW5nID0gJ3NzLWNvbnRlbnQnXG4gIHB1YmxpYyByZWFkb25seSBvcGVuOiBzdHJpbmcgPSAnc3Mtb3BlbidcbiAgcHVibGljIHJlYWRvbmx5IG9wZW5BYm92ZTogc3RyaW5nID0gJ3NzLW9wZW4tYWJvdmUnXG4gIHB1YmxpYyByZWFkb25seSBvcGVuQmVsb3c6IHN0cmluZyA9ICdzcy1vcGVuLWJlbG93J1xuICBwdWJsaWMgcmVhZG9ubHkgc2VhcmNoOiBzdHJpbmcgPSAnc3Mtc2VhcmNoJ1xuICBwdWJsaWMgcmVhZG9ubHkgc2VhcmNoSGlnaGxpZ2h0ZXI6IHN0cmluZyA9ICdzcy1zZWFyY2gtaGlnaGxpZ2h0J1xuICBwdWJsaWMgcmVhZG9ubHkgYWRkYWJsZTogc3RyaW5nID0gJ3NzLWFkZGFibGUnXG4gIHB1YmxpYyByZWFkb25seSBsaXN0OiBzdHJpbmcgPSAnc3MtbGlzdCdcbiAgcHVibGljIHJlYWRvbmx5IG9wdGdyb3VwOiBzdHJpbmcgPSAnc3Mtb3B0Z3JvdXAnXG4gIHB1YmxpYyByZWFkb25seSBvcHRncm91cExhYmVsOiBzdHJpbmcgPSAnc3Mtb3B0Z3JvdXAtbGFiZWwnXG4gIHB1YmxpYyByZWFkb25seSBvcHRncm91cExhYmVsU2VsZWN0YWJsZTogc3RyaW5nID0gJ3NzLW9wdGdyb3VwLWxhYmVsLXNlbGVjdGFibGUnXG4gIHB1YmxpYyByZWFkb25seSBvcHRpb246IHN0cmluZyA9ICdzcy1vcHRpb24nXG4gIHB1YmxpYyByZWFkb25seSBvcHRpb25TZWxlY3RlZDogc3RyaW5nID0gJ3NzLW9wdGlvbi1zZWxlY3RlZCdcbiAgcHVibGljIHJlYWRvbmx5IGhpZ2hsaWdodGVkOiBzdHJpbmcgPSAnc3MtaGlnaGxpZ2h0ZWQnXG4gIHB1YmxpYyByZWFkb25seSBkaXNhYmxlZDogc3RyaW5nID0gJ3NzLWRpc2FibGVkJ1xuICBwdWJsaWMgcmVhZG9ubHkgaGlkZTogc3RyaW5nID0gJ3NzLWhpZGUnXG5cbiAgY29uc3RydWN0b3IoaW5mbzogQ29uc3RydWN0b3IpIHtcbiAgICB0aGlzLmlkID0gJ3NzLScgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDApXG4gICAgdGhpcy5zdHlsZSA9IGluZm8uc2VsZWN0LnN0eWxlLmNzc1RleHRcbiAgICB0aGlzLmNsYXNzID0gaW5mby5zZWxlY3QuY2xhc3NOYW1lLnNwbGl0KCcgJylcblxuICAgIHRoaXMuaXNNdWx0aXBsZSA9IGluZm8uc2VsZWN0Lm11bHRpcGxlXG4gICAgdGhpcy5pc0FqYXggPSBpbmZvLmlzQWpheFxuICAgIHRoaXMuc2hvd1NlYXJjaCA9IChpbmZvLnNob3dTZWFyY2ggPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlKVxuICAgIHRoaXMuc2VhcmNoRm9jdXMgPSAoaW5mby5zZWFyY2hGb2N1cyA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWUpXG4gICAgdGhpcy5zZWFyY2hIaWdobGlnaHQgPSAoaW5mby5zZWFyY2hIaWdobGlnaHQgPT09IHRydWUgPyB0cnVlIDogZmFsc2UpXG4gICAgdGhpcy5jbG9zZU9uU2VsZWN0ID0gKGluZm8uY2xvc2VPblNlbGVjdCA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWUpXG4gICAgaWYgKGluZm8uc2hvd0NvbnRlbnQpIHsgdGhpcy5zaG93Q29udGVudCA9IGluZm8uc2hvd0NvbnRlbnQgfVxuICAgIHRoaXMuaXNFbmFibGVkID0gKGluZm8uaXNFbmFibGVkID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZSlcbiAgICBpZiAoaW5mby5zZWFyY2hQbGFjZWhvbGRlcikgeyB0aGlzLnNlYXJjaFBsYWNlaG9sZGVyID0gaW5mby5zZWFyY2hQbGFjZWhvbGRlciB9XG4gICAgaWYgKGluZm8uc2VhcmNoVGV4dCkgeyB0aGlzLnNlYXJjaFRleHQgPSBpbmZvLnNlYXJjaFRleHQgfVxuICAgIGlmIChpbmZvLnNlYXJjaGluZ1RleHQpIHsgdGhpcy5zZWFyY2hpbmdUZXh0ID0gaW5mby5zZWFyY2hpbmdUZXh0IH1cbiAgICBpZiAoaW5mby5wbGFjZWhvbGRlclRleHQpIHsgdGhpcy5wbGFjZWhvbGRlclRleHQgPSBpbmZvLnBsYWNlaG9sZGVyVGV4dCB9XG4gICAgdGhpcy5hbGxvd0Rlc2VsZWN0ID0gKGluZm8uYWxsb3dEZXNlbGVjdCA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZSlcbiAgICB0aGlzLmFsbG93RGVzZWxlY3RPcHRpb24gPSAoaW5mby5hbGxvd0Rlc2VsZWN0T3B0aW9uID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlKVxuICAgIHRoaXMuaGlkZVNlbGVjdGVkT3B0aW9uID0gKGluZm8uaGlkZVNlbGVjdGVkT3B0aW9uID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlKVxuICAgIGlmIChpbmZvLmRlc2VsZWN0TGFiZWwpIHsgdGhpcy5kZXNlbGVjdExhYmVsID0gaW5mby5kZXNlbGVjdExhYmVsIH1cbiAgICBpZiAoaW5mby52YWx1ZXNVc2VUZXh0KSB7IHRoaXMudmFsdWVzVXNlVGV4dCA9IGluZm8udmFsdWVzVXNlVGV4dCB9XG4gICAgaWYgKGluZm8uc2hvd09wdGlvblRvb2x0aXBzKSB7IHRoaXMuc2hvd09wdGlvblRvb2x0aXBzID0gaW5mby5zaG93T3B0aW9uVG9vbHRpcHMgfVxuICAgIGlmIChpbmZvLnNlbGVjdEJ5R3JvdXApIHsgdGhpcy5zZWxlY3RCeUdyb3VwID0gaW5mby5zZWxlY3RCeUdyb3VwIH1cbiAgICBpZiAoaW5mby5saW1pdCkgeyB0aGlzLmxpbWl0ID0gaW5mby5saW1pdCB9XG4gICAgaWYgKGluZm8uc2VhcmNoRmlsdGVyKSB7IHRoaXMuc2VhcmNoRmlsdGVyID0gaW5mby5zZWFyY2hGaWx0ZXIgfVxuICAgIGlmIChpbmZvLnRpbWVvdXREZWxheSAhPSBudWxsKSB7IHRoaXMudGltZW91dERlbGF5ID0gaW5mby50aW1lb3V0RGVsYXkgfVxuICAgIHRoaXMuYWRkVG9Cb2R5ID0gKGluZm8uYWRkVG9Cb2R5ID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlKVxuICB9XG5cbiAgcHVibGljIHNlYXJjaEZpbHRlcihvcHQ6IE9wdGlvbiwgc2VhcmNoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gb3B0LnRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaC50b0xvd2VyQ2FzZSgpKSAhPT0gLTFcbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGhhc0NsYXNzSW5UcmVlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBjbGFzc05hbWU6IHN0cmluZykge1xuICBmdW5jdGlvbiBoYXNDbGFzcyhlOiBIVE1MRWxlbWVudCwgYzogc3RyaW5nKSB7XG4gICAgaWYgKCEoIWMgfHwgIWUgfHwgIWUuY2xhc3NMaXN0IHx8ICFlLmNsYXNzTGlzdC5jb250YWlucyhjKSkpIHsgcmV0dXJuIGUgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBmdW5jdGlvbiBwYXJlbnRCeUNsYXNzKGU6IGFueSwgYzogc3RyaW5nKTogYW55IHtcbiAgICBpZiAoIWUgfHwgZSA9PT0gZG9jdW1lbnQgYXMgYW55KSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH0gZWxzZSBpZiAoaGFzQ2xhc3MoZSwgYykpIHtcbiAgICAgIHJldHVybiBlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJlbnRCeUNsYXNzKGUucGFyZW50Tm9kZSwgYylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSB8fCBwYXJlbnRCeUNsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUVsZW1lbnRJblZpZXcoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgZWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgLy8gRGV0ZXJtaW5lIGNvbnRhaW5lciB0b3AgYW5kIGJvdHRvbVxuICBjb25zdCBjVG9wID0gY29udGFpbmVyLnNjcm9sbFRvcCArIGNvbnRhaW5lci5vZmZzZXRUb3AgLy8gTWFrZSBzdXJlIHRvIGhhdmUgb2Zmc2V0VG9wXG4gIGNvbnN0IGNCb3R0b20gPSBjVG9wICsgY29udGFpbmVyLmNsaWVudEhlaWdodFxuXG4gIC8vIERldGVybWluZSBlbGVtZW50IHRvcCBhbmQgYm90dG9tXG4gIGNvbnN0IGVUb3AgPSBlbGVtZW50Lm9mZnNldFRvcFxuICBjb25zdCBlQm90dG9tID0gZVRvcCArIGVsZW1lbnQuY2xpZW50SGVpZ2h0XG5cbiAgLy8gQ2hlY2sgaWYgb3V0IG9mIHZpZXdcbiAgaWYgKGVUb3AgPCBjVG9wKSB7XG4gICAgY29udGFpbmVyLnNjcm9sbFRvcCAtPSAoY1RvcCAtIGVUb3ApXG4gIH0gZWxzZSBpZiAoZUJvdHRvbSA+IGNCb3R0b20pIHtcbiAgICBjb250YWluZXIuc2Nyb2xsVG9wICs9IChlQm90dG9tIC0gY0JvdHRvbSlcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHV0Q29udGVudChlbDogSFRNTEVsZW1lbnQsIGN1cnJlbnRQb3NpdGlvbjogc3RyaW5nLCBpc09wZW46IGJvb2xlYW4pOiBzdHJpbmcge1xuICBjb25zdCBoZWlnaHQgPSBlbC5vZmZzZXRIZWlnaHRcbiAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIGNvbnN0IGVsZW1Ub3AgPSAoaXNPcGVuID8gcmVjdC50b3AgOiByZWN0LnRvcCAtIGhlaWdodClcbiAgY29uc3QgZWxlbUJvdHRvbSA9IChpc09wZW4gPyByZWN0LmJvdHRvbSA6IHJlY3QuYm90dG9tICsgaGVpZ2h0KVxuXG4gIGlmIChlbGVtVG9wIDw9IDApIHsgcmV0dXJuICdiZWxvdycgfVxuICBpZiAoZWxlbUJvdHRvbSA+PSB3aW5kb3cuaW5uZXJIZWlnaHQpIHsgcmV0dXJuICdhYm92ZScgfVxuICByZXR1cm4gKGlzT3BlbiA/IGN1cnJlbnRQb3NpdGlvbiA6ICdiZWxvdycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZShmdW5jOiAoLi4ucGFyYW1zOiBhbnlbXSkgPT4gdm9pZCwgd2FpdCA9IDEwMCwgaW1tZWRpYXRlID0gZmFsc2UpOiAoKSA9PiB2b2lkIHtcbiAgbGV0IHRpbWVvdXQ6IGFueVxuICByZXR1cm4gZnVuY3Rpb24odGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgIGNvbnN0IGNvbnRleHQgPSBzZWxmXG4gICAgY29uc3QgbGF0ZXIgPSAoKSA9PiB7XG4gICAgICB0aW1lb3V0ID0gbnVsbFxuICAgICAgaWYgKCFpbW1lZGlhdGUpIHsgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKSB9XG4gICAgfVxuICAgIGNvbnN0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXRcbiAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdClcbiAgICBpZiAoY2FsbE5vdykgeyBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWx1ZUluQXJyYXlPZk9iamVjdHMoc2VsZWN0ZWQ6IGFueSwga2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHNlbGVjdGVkKSkge1xuICAgIHJldHVybiBzZWxlY3RlZFtrZXldID09PSB2YWx1ZVxuICB9XG5cbiAgZm9yIChjb25zdCBzIG9mIHNlbGVjdGVkKSB7XG4gICAgaWYgKHMgJiYgc1trZXldICYmIHNba2V5XSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaWdobGlnaHQoc3RyOiBzdHJpbmcsIHNlYXJjaDogYW55LCBjbGFzc05hbWU6IHN0cmluZykge1xuICAvLyB0aGUgY29tcGxldGVkIHN0cmluZyB3aWxsIGJlIGl0c2VsZiBpZiBhbHJlYWR5IHNldCwgb3RoZXJ3aXNlLCB0aGUgc3RyaW5nIHRoYXQgd2FzIHBhc3NlZCBpblxuICBsZXQgY29tcGxldGVkU3RyaW5nOiBhbnkgPSBzdHJcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKCcoJyArIHNlYXJjaC50cmltKCkgKyAnKSg/IVtePF0qPltePD5dKjwvKScsICdpJylcblxuICAvLyBJZiB0aGUgcmVnZXggZG9lc24ndCBtYXRjaCB0aGUgc3RyaW5nIGp1c3QgZXhpdFxuICBpZiAoIXN0ci5tYXRjaChyZWdleCkpIHsgcmV0dXJuIHN0ciB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBnZXQgdG8gaGlnaGxpZ2h0aW5nXG4gIGNvbnN0IG1hdGNoU3RhcnRQb3NpdGlvbiA9IChzdHIubWF0Y2gocmVnZXgpIGFzIGFueSkuaW5kZXhcbiAgY29uc3QgbWF0Y2hFbmRQb3NpdGlvbiA9IG1hdGNoU3RhcnRQb3NpdGlvbiArIChzdHIubWF0Y2gocmVnZXgpIGFzIGFueSlbMF0udG9TdHJpbmcoKS5sZW5ndGhcbiAgY29uc3Qgb3JpZ2luYWxUZXh0Rm91bmRCeVJlZ2V4ID0gc3RyLnN1YnN0cmluZyhtYXRjaFN0YXJ0UG9zaXRpb24sIG1hdGNoRW5kUG9zaXRpb24pXG4gIGNvbXBsZXRlZFN0cmluZyA9IGNvbXBsZXRlZFN0cmluZy5yZXBsYWNlKHJlZ2V4LCBgPG1hcmsgY2xhc3M9XCIke2NsYXNzTmFtZX1cIj4ke29yaWdpbmFsVGV4dEZvdW5kQnlSZWdleH08L21hcms+YClcbiAgcmV0dXJuIGNvbXBsZXRlZFN0cmluZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24ga2ViYWJDYXNlKHN0cjogc3RyaW5nKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHN0ci5yZXBsYWNlKFxuICAgIC9bQS1aXFx1MDBDMC1cXHUwMEQ2XFx1MDBEOC1cXHUwMERFXS9nLFxuICAgIChtYXRjaCkgPT4gJy0nICsgbWF0Y2gudG9Mb3dlckNhc2UoKVxuICApXG4gIHJldHVybiAoc3RyWzBdID09PSBzdHJbMF0udG9VcHBlckNhc2UoKSlcbiAgICA/IHJlc3VsdC5zdWJzdHJpbmcoMSlcbiAgICA6IHJlc3VsdFxufVxuXG4vLyBDdXN0b20gZXZlbnRzXG4oKCkgPT4ge1xuICBjb25zdCB3ID0gKHdpbmRvdyBhcyBhbnkpXG4gIGlmICh0eXBlb2Ygdy5DdXN0b21FdmVudCA9PT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gfVxuXG4gIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50OiBhbnksIHBhcmFtczogYW55KSB7XG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHsgYnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlLCBkZXRhaWw6IHVuZGVmaW5lZCB9XG4gICAgY29uc3QgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50JylcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpXG4gICAgcmV0dXJuIGV2dFxuICB9XG5cbiAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gdy5FdmVudC5wcm90b3R5cGVcbiAgdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50XG59KSgpXG4iLCJpbXBvcnQgVGhpblNlbGVjdCBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHsgT3B0aW9uLCBPcHRncm91cCwgZGF0YUFycmF5IH0gZnJvbSAnLi9kYXRhJ1xuaW1wb3J0IHsga2ViYWJDYXNlIH0gZnJvbSAnLi9oZWxwZXInXG5cbmludGVyZmFjZSBDb25zdHJ1Y3RvciB7XG4gIHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnRcbiAgbWFpbjogVGhpblNlbGVjdFxufVxuXG5leHBvcnQgY2xhc3MgU2VsZWN0IHtcbiAgcHVibGljIGVsZW1lbnQ6IEhUTUxTZWxlY3RFbGVtZW50XG4gIHB1YmxpYyBtYWluOiBUaGluU2VsZWN0XG4gIHB1YmxpYyBtdXRhdGlvbk9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyIHwgbnVsbFxuICBwdWJsaWMgdHJpZ2dlck11dGF0aW9uT2JzZXJ2ZXI6IGJvb2xlYW4gPSB0cnVlXG4gIGNvbnN0cnVjdG9yKGluZm86IENvbnN0cnVjdG9yKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gaW5mby5zZWxlY3RcbiAgICB0aGlzLm1haW4gPSBpbmZvLm1haW5cblxuICAgIC8vIElmIG9yaWdpbmFsIHNlbGVjdCBpcyBzZXQgdG8gZGlzYWJsZWQgbGV0cyBtYWtlIHN1cmUgc2xpbSBpcyB0b29cbiAgICBpZiAodGhpcy5lbGVtZW50LmRpc2FibGVkKSB7IHRoaXMubWFpbi5jb25maWcuaXNFbmFibGVkID0gZmFsc2UgfVxuXG4gICAgdGhpcy5hZGRBdHRyaWJ1dGVzKClcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKClcbiAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXIgPSBudWxsXG4gICAgdGhpcy5hZGRNdXRhdGlvbk9ic2VydmVyKClcblxuICAgIC8vIEFkZCBzbGltIHRvIG9yaWdpbmFsIHNlbGVjdCBkcm9wZG93blxuICAgIGNvbnN0IGVsID0gdGhpcy5lbGVtZW50IGFzIGFueVxuICAgIGVsLnNsaW0gPSBpbmZvLm1haW5cbiAgfVxuXG4gIHB1YmxpYyBzZXRWYWx1ZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubWFpbi5kYXRhLmdldFNlbGVjdGVkKCkpIHsgcmV0dXJuIH1cblxuICAgIGlmICh0aGlzLm1haW4uY29uZmlnLmlzTXVsdGlwbGUpIHtcbiAgICAgIC8vIElmIG11bHRpcGxlIGxvb3AgdGhyb3VnaCBvcHRpb25zIGFuZCBzZXQgc2VsZWN0ZWRcbiAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5tYWluLmRhdGEuZ2V0U2VsZWN0ZWQoKSBhcyBPcHRpb25bXVxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuZWxlbWVudC5vcHRpb25zIGFzIGFueSBhcyBIVE1MT3B0aW9uRWxlbWVudFtdXG4gICAgICBmb3IgKGNvbnN0IG8gb2Ygb3B0aW9ucykge1xuICAgICAgICBvLnNlbGVjdGVkID0gZmFsc2VcbiAgICAgICAgZm9yIChjb25zdCBzIG9mIHNlbGVjdGVkKSB7XG4gICAgICAgICAgaWYgKHMudmFsdWUgPT09IG8udmFsdWUpIHtcbiAgICAgICAgICAgIG8uc2VsZWN0ZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHNpbmdsZSBzZWxlY3Qgc2ltcGx5IHNldCB2YWx1ZVxuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLm1haW4uZGF0YS5nZXRTZWxlY3RlZCgpIGFzIGFueVxuICAgICAgdGhpcy5lbGVtZW50LnZhbHVlID0gKHNlbGVjdGVkID8gc2VsZWN0ZWQudmFsdWUgOiAnJylcbiAgICB9XG5cbiAgICAvLyBEbyBub3QgdHJpZ2dlciBvbkNoYW5nZSBjYWxsYmFja3MgZm9yIHRoaXMgZXZlbnQgbGlzdGVuZXJcbiAgICB0aGlzLm1haW4uZGF0YS5pc09uQ2hhbmdlRW5hYmxlZCA9IGZhbHNlXG4gICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSkpXG4gICAgdGhpcy5tYWluLmRhdGEuaXNPbkNoYW5nZUVuYWJsZWQgPSB0cnVlXG4gIH1cblxuICBwdWJsaWMgYWRkQXR0cmlidXRlcygpIHtcbiAgICB0aGlzLmVsZW1lbnQudGFiSW5kZXggPSAtMVxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG5cbiAgICAvLyBBZGQgc2xpbSBzZWxlY3QgaWRcbiAgICB0aGlzLmVsZW1lbnQuZGF0YXNldC5zc2lkID0gdGhpcy5tYWluLmNvbmZpZy5pZFxuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxuICB9XG5cbiAgLy8gQWRkIG9uQ2hhbmdlIGxpc3RlbmVyIHRvIG9yaWdpbmFsIHNlbGVjdFxuICBwdWJsaWMgYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlOiBFdmVudCkgPT4ge1xuICAgICAgdGhpcy5tYWluLmRhdGEuc2V0U2VsZWN0ZWRGcm9tU2VsZWN0KClcbiAgICAgIHRoaXMubWFpbi5yZW5kZXIoKVxuICAgIH0pXG4gIH1cblxuICAvLyBBZGQgTXV0YXRpb25PYnNlcnZlciB0byBzZWxlY3RcbiAgcHVibGljIGFkZE11dGF0aW9uT2JzZXJ2ZXIoKTogdm9pZCB7XG4gICAgLy8gT25seSBhZGQgaWYgbm90IGluIGFqYXggbW9kZVxuICAgIGlmICh0aGlzLm1haW4uY29uZmlnLmlzQWpheCkgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5tdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgICAgaWYgKCF0aGlzLnRyaWdnZXJNdXRhdGlvbk9ic2VydmVyKSB7cmV0dXJufVxuXG4gICAgICB0aGlzLm1haW4uZGF0YS5wYXJzZVNlbGVjdERhdGEoKVxuICAgICAgdGhpcy5tYWluLmRhdGEuc2V0U2VsZWN0ZWRGcm9tU2VsZWN0KClcbiAgICAgIHRoaXMubWFpbi5yZW5kZXIoKVxuXG4gICAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgICAgaWYgKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgICB0aGlzLm1haW4uc2xpbS51cGRhdGVDb250YWluZXJEaXZDbGFzcyh0aGlzLm1haW4uc2xpbS5jb250YWluZXIpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMub2JzZXJ2ZU11dGF0aW9uT2JzZXJ2ZXIoKVxuICB9XG5cbiAgcHVibGljIG9ic2VydmVNdXRhdGlvbk9ic2VydmVyKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5tdXRhdGlvbk9ic2VydmVyKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlXG4gICAgfSlcbiAgfVxuXG4gIHB1YmxpYyBkaXNjb25uZWN0TXV0YXRpb25PYnNlcnZlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXIuZGlzY29ubmVjdCgpXG4gICAgfVxuICB9XG5cbiAgLy8gQ3JlYXRlIHNlbGVjdCBlbGVtZW50IGFuZCBvcHRncm91cC9vcHRpb25zXG4gIHB1YmxpYyBjcmVhdGUoZGF0YTogZGF0YUFycmF5KTogdm9pZCB7XG4gICAgLy8gQ2xlYXIgb3V0IHNlbGVjdFxuICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSAnJ1xuXG4gICAgZm9yIChjb25zdCBkIG9mIGRhdGEpIHtcbiAgICAgIGlmIChkLmhhc093blByb3BlcnR5KCdvcHRpb25zJykpIHtcbiAgICAgICAgY29uc3Qgb3B0Z3JvdXBPYmplY3QgPSBkIGFzIE9wdGdyb3VwXG4gICAgICAgIGNvbnN0IG9wdGdyb3VwRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRncm91cCcpIGFzIEhUTUxPcHRHcm91cEVsZW1lbnRcbiAgICAgICAgb3B0Z3JvdXBFbC5sYWJlbCA9IG9wdGdyb3VwT2JqZWN0LmxhYmVsXG4gICAgICAgIGlmIChvcHRncm91cE9iamVjdC5vcHRpb25zKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBvbyBvZiBvcHRncm91cE9iamVjdC5vcHRpb25zKSB7XG4gICAgICAgICAgICBvcHRncm91cEVsLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlT3B0aW9uKG9vKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG9wdGdyb3VwRWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVPcHRpb24oZCkpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGNyZWF0ZU9wdGlvbihpbmZvOiBhbnkpOiBIVE1MT3B0aW9uRWxlbWVudCB7XG4gICAgY29uc3Qgb3B0aW9uRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKVxuICAgIG9wdGlvbkVsLnZhbHVlID0gaW5mby52YWx1ZSAhPT0gJycgPyBpbmZvLnZhbHVlIDogaW5mby50ZXh0XG4gICAgb3B0aW9uRWwuaW5uZXJIVE1MID0gaW5mby5pbm5lckhUTUwgfHwgaW5mby50ZXh0XG4gICAgaWYgKGluZm8uc2VsZWN0ZWQpIHsgb3B0aW9uRWwuc2VsZWN0ZWQgPSBpbmZvLnNlbGVjdGVkIH1cbiAgICBpZiAoaW5mby5kaXNwbGF5ID09PSBmYWxzZSkge1xuICAgICAgb3B0aW9uRWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgIH1cbiAgICBpZiAoaW5mby5kaXNhYmxlZCkgeyBvcHRpb25FbC5kaXNhYmxlZCA9IHRydWUgfVxuICAgIGlmIChpbmZvLnBsYWNlaG9sZGVyKSB7IG9wdGlvbkVsLnNldEF0dHJpYnV0ZSgnZGF0YS1wbGFjZWhvbGRlcicsICd0cnVlJykgfVxuICAgIGlmIChpbmZvLm1hbmRhdG9yeSkgeyBvcHRpb25FbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbWFuZGF0b3J5JywgJ3RydWUnKSB9XG4gICAgaWYgKGluZm8uY2xhc3MpIHtcbiAgICAgIGluZm8uY2xhc3Muc3BsaXQoJyAnKS5mb3JFYWNoKChvcHRpb25DbGFzczogc3RyaW5nKSA9PiB7XG4gICAgICAgIG9wdGlvbkVsLmNsYXNzTGlzdC5hZGQob3B0aW9uQ2xhc3MpXG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAoaW5mby5kYXRhICYmIHR5cGVvZiBpbmZvLmRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICBPYmplY3Qua2V5cyhpbmZvLmRhdGEpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBvcHRpb25FbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtlYmFiQ2FzZShrZXkpLCBpbmZvLmRhdGFba2V5XSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbkVsXG4gIH1cbn1cbiIsImltcG9ydCBUaGluU2VsZWN0IGZyb20gJy4vaW5kZXgnXG5cbmludGVyZmFjZSBDb25zdHJ1Y3RvciB7IG1haW46IFRoaW5TZWxlY3QgfVxuXG5leHBvcnQgdHlwZSBkYXRhQXJyYXkgPSBkYXRhT2JqZWN0W11cbmV4cG9ydCB0eXBlIGRhdGFPYmplY3QgPSBPcHRncm91cCB8IE9wdGlvblxuZXhwb3J0IGludGVyZmFjZSBPcHRncm91cCB7XG4gIGxhYmVsOiBzdHJpbmdcbiAgb3B0aW9ucz86IE9wdGlvbltdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uIHtcbiAgaWQ/OiBzdHJpbmdcbiAgdmFsdWU/OiBzdHJpbmdcbiAgdGV4dDogc3RyaW5nXG4gIGlubmVySFRNTD86IHN0cmluZ1xuICBzZWxlY3RlZD86IGJvb2xlYW5cbiAgZGlzcGxheT86IGJvb2xlYW5cbiAgZGlzYWJsZWQ/OiBib29sZWFuXG4gIHBsYWNlaG9sZGVyPzogYm9vbGVhbnxzdHJpbmdcbiAgY2xhc3M/OiBzdHJpbmdcbiAgc3R5bGU/OiBzdHJpbmdcbiAgZGF0YT86IG9iamVjdFxuICBtYW5kYXRvcnk/OiBib29sZWFuXG59XG5cbi8vIENsYXNzIGlzIHJlc3BvbnNpYmxlIGZvciBtYW5hZ2luZyB0aGUgZGF0YVxuZXhwb3J0IGNsYXNzIERhdGEge1xuICBwdWJsaWMgbWFpbjogVGhpblNlbGVjdFxuICBwdWJsaWMgc2VhcmNoVmFsdWU6IHN0cmluZ1xuICBwdWJsaWMgZGF0YTogZGF0YU9iamVjdFtdXG4gIHB1YmxpYyBmaWx0ZXJlZDogZGF0YU9iamVjdFtdIHwgbnVsbFxuICBwdWJsaWMgY29udGVudE9wZW46IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgY29udGVudFBvc2l0aW9uOiBzdHJpbmcgPSAnYmVsb3cnXG4gIHB1YmxpYyBpc09uQ2hhbmdlRW5hYmxlZDogYm9vbGVhbiA9IHRydWVcbiAgY29uc3RydWN0b3IoaW5mbzogQ29uc3RydWN0b3IpIHtcbiAgICB0aGlzLm1haW4gPSBpbmZvLm1haW5cbiAgICB0aGlzLnNlYXJjaFZhbHVlID0gJydcbiAgICB0aGlzLmRhdGEgPSBbXVxuICAgIHRoaXMuZmlsdGVyZWQgPSBudWxsXG5cbiAgICB0aGlzLnBhcnNlU2VsZWN0RGF0YSgpXG4gICAgdGhpcy5zZXRTZWxlY3RlZEZyb21TZWxlY3QoKVxuICB9XG5cbiAgcHVibGljIG5ld09wdGlvbihpbmZvOiBhbnkpOiBPcHRpb24ge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogKGluZm8uaWQgPyBpbmZvLmlkIDogU3RyaW5nKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwMCkpKSxcbiAgICAgIHZhbHVlOiAoaW5mby52YWx1ZSA/IGluZm8udmFsdWUgOiAnJyksXG4gICAgICB0ZXh0OiAoaW5mby50ZXh0ID8gaW5mby50ZXh0IDogJycpLFxuICAgICAgaW5uZXJIVE1MOiAoaW5mby5pbm5lckhUTUwgPyBpbmZvLmlubmVySFRNTCA6ICcnKSxcbiAgICAgIHNlbGVjdGVkOiAoaW5mby5zZWxlY3RlZCA/IGluZm8uc2VsZWN0ZWQgOiBmYWxzZSksXG4gICAgICBkaXNwbGF5OiAoaW5mby5kaXNwbGF5ICE9PSB1bmRlZmluZWQgPyBpbmZvLmRpc3BsYXkgOiB0cnVlKSxcbiAgICAgIGRpc2FibGVkOiAoaW5mby5kaXNhYmxlZCA/IGluZm8uZGlzYWJsZWQgOiBmYWxzZSksXG4gICAgICBwbGFjZWhvbGRlcjogKGluZm8ucGxhY2Vob2xkZXIgPyBpbmZvLnBsYWNlaG9sZGVyIDogZmFsc2UpLFxuICAgICAgY2xhc3M6IChpbmZvLmNsYXNzID8gaW5mby5jbGFzcyA6IHVuZGVmaW5lZCksXG4gICAgICBkYXRhOiAoaW5mby5kYXRhID8gaW5mby5kYXRhIDoge30pLFxuICAgICAgbWFuZGF0b3J5OiAoaW5mby5tYW5kYXRvcnkgPyBpbmZvLm1hbmRhdG9yeSA6IGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIC8vIEFkZCB0byB0aGUgY3VycmVudCBkYXRhIGFycmF5XG4gIHB1YmxpYyBhZGQoZGF0YTogT3B0aW9uKSB7XG4gICAgdGhpcy5kYXRhLnB1c2goe1xuICAgICAgaWQ6IFN0cmluZyhNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMDApKSxcbiAgICAgIHZhbHVlOiBkYXRhLnZhbHVlLFxuICAgICAgdGV4dDogZGF0YS50ZXh0LFxuICAgICAgaW5uZXJIVE1MOiAnJyxcbiAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgIGRpc3BsYXk6IHRydWUsXG4gICAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgICBwbGFjZWhvbGRlcjogZmFsc2UsXG4gICAgICBjbGFzczogdW5kZWZpbmVkLFxuICAgICAgbWFuZGF0b3J5OiBkYXRhLm1hbmRhdG9yeSxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSlcbiAgfVxuXG4gIC8vIEZyb20gcGFzc2VkIGluIHNlbGVjdCBlbGVtZW50IHB1bGwgb3B0Z3JvdXAgYW5kIG9wdGlvbnMgaW50byBkYXRhXG4gIHB1YmxpYyBwYXJzZVNlbGVjdERhdGEoKSB7XG4gICAgdGhpcy5kYXRhID0gW11cbiAgICAvLyBMb29wIHRocm91Z2ggbm9kZXMgYW5kIGNyZWF0ZSBkYXRhXG4gICAgY29uc3Qgbm9kZXMgPSAodGhpcy5tYWluLnNlbGVjdC5lbGVtZW50IGFzIEhUTUxTZWxlY3RFbGVtZW50KS5jaGlsZE5vZGVzIGFzIGFueSBhcyBIVE1MT3B0R3JvdXBFbGVtZW50W10gfCBIVE1MT3B0aW9uRWxlbWVudFtdXG4gICAgZm9yIChjb25zdCBuIG9mIG5vZGVzKSB7XG4gICAgICBpZiAobi5ub2RlTmFtZSA9PT0gJ09QVEdST1VQJykge1xuICAgICAgICBjb25zdCBub2RlID0gbiBhcyBIVE1MT3B0R3JvdXBFbGVtZW50XG4gICAgICAgIGNvbnN0IG9wdGdyb3VwID0ge1xuICAgICAgICAgIGxhYmVsOiBub2RlLmxhYmVsLFxuICAgICAgICAgIG9wdGlvbnM6IFtdIGFzIE9wdGlvbltdXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IG4uY2hpbGROb2RlcyBhcyBhbnkgYXMgSFRNTE9wdGlvbkVsZW1lbnRbXVxuICAgICAgICBmb3IgKGNvbnN0IG8gb2Ygb3B0aW9ucykge1xuICAgICAgICAgIGlmIChvLm5vZGVOYW1lID09PSAnT1BUSU9OJykge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9uID0gdGhpcy5wdWxsT3B0aW9uRGF0YShvIGFzIEhUTUxPcHRpb25FbGVtZW50KVxuICAgICAgICAgICAgb3B0Z3JvdXAub3B0aW9ucy5wdXNoKG9wdGlvbilcblxuICAgICAgICAgICAgLy8gSWYgb3B0aW9uIGhhcyBwbGFjZWhvbGRlciBzZXQgdG8gdHJ1ZSBzZXQgcGxhY2Vob2xkZXIgdGV4dFxuICAgICAgICAgICAgaWYgKG9wdGlvbi5wbGFjZWhvbGRlciAmJiBvcHRpb24udGV4dC50cmltKCkgIT09ICcnKSB7XG4gICAgICAgICAgICAgIHRoaXMubWFpbi5jb25maWcucGxhY2Vob2xkZXJUZXh0ID0gb3B0aW9uLnRleHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhLnB1c2gob3B0Z3JvdXApXG4gICAgICB9IGVsc2UgaWYgKG4ubm9kZU5hbWUgPT09ICdPUFRJT04nKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IHRoaXMucHVsbE9wdGlvbkRhdGEobiBhcyBIVE1MT3B0aW9uRWxlbWVudClcbiAgICAgICAgdGhpcy5kYXRhLnB1c2gob3B0aW9uKVxuXG4gICAgICAgIC8vIElmIG9wdGlvbiBoYXMgcGxhY2Vob2xkZXIgc2V0IHRvIHRydWUgc2V0IHBsYWNlaG9sZGVyIHRleHRcbiAgICAgICAgaWYgKG9wdGlvbi5wbGFjZWhvbGRlciAmJiBvcHRpb24udGV4dC50cmltKCkgIT09ICcnKSB7XG4gICAgICAgICAgdGhpcy5tYWluLmNvbmZpZy5wbGFjZWhvbGRlclRleHQgPSBvcHRpb24udGV4dFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRnJvbSBwYXNzZWQgaW4gb3B0aW9uIHB1bGwgcGllY2VzIG9mIHVzYWJsZSBpbmZvcm1hdGlvblxuICBwdWJsaWMgcHVsbE9wdGlvbkRhdGEob3B0aW9uOiBIVE1MT3B0aW9uRWxlbWVudCk6IE9wdGlvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiAob3B0aW9uLmRhdGFzZXQgPyBvcHRpb24uZGF0YXNldC5pZCA6IGZhbHNlKSB8fCBTdHJpbmcoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMDAwKSksXG4gICAgICB2YWx1ZTogb3B0aW9uLnZhbHVlLFxuICAgICAgdGV4dDogb3B0aW9uLnRleHQsXG4gICAgICBpbm5lckhUTUw6IG9wdGlvbi5pbm5lckhUTUwsXG4gICAgICBzZWxlY3RlZDogb3B0aW9uLnNlbGVjdGVkLFxuICAgICAgZGlzYWJsZWQ6IG9wdGlvbi5kaXNhYmxlZCxcbiAgICAgIHBsYWNlaG9sZGVyOiBvcHRpb24uZGF0YXNldC5wbGFjZWhvbGRlciA9PT0gJ3RydWUnLFxuICAgICAgY2xhc3M6IG9wdGlvbi5jbGFzc05hbWUsXG4gICAgICBzdHlsZTogb3B0aW9uLnN0eWxlLmNzc1RleHQsXG4gICAgICBkYXRhOiBvcHRpb24uZGF0YXNldCxcbiAgICAgIG1hbmRhdG9yeTogKG9wdGlvbi5kYXRhc2V0ID8gb3B0aW9uLmRhdGFzZXQubWFuZGF0b3J5ID09PSAndHJ1ZScgOiBmYWxzZSlcbiAgICB9XG4gIH1cblxuICAvLyBGcm9tIHNlbGVjdCBlbGVtZW50IGdldCBjdXJyZW50IHNlbGVjdGVkIGFuZCBzZXQgc2VsZWN0ZWRcbiAgcHVibGljIHNldFNlbGVjdGVkRnJvbVNlbGVjdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tYWluLmNvbmZpZy5pc011bHRpcGxlKSB7XG4gICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5tYWluLnNlbGVjdC5lbGVtZW50Lm9wdGlvbnMgYXMgYW55IGFzIEhUTUxPcHRpb25FbGVtZW50W11cbiAgICAgIGNvbnN0IG5ld1NlbGVjdGVkOiBzdHJpbmdbXSA9IFtdXG4gICAgICBmb3IgKGNvbnN0IG8gb2Ygb3B0aW9ucykge1xuICAgICAgICBpZiAoby5zZWxlY3RlZCkge1xuICAgICAgICAgIGNvbnN0IG5ld09wdGlvbiA9IHRoaXMuZ2V0T2JqZWN0RnJvbURhdGEoby52YWx1ZSwgJ3ZhbHVlJylcbiAgICAgICAgICBpZiAobmV3T3B0aW9uICYmIG5ld09wdGlvbi5pZCkge1xuICAgICAgICAgICAgbmV3U2VsZWN0ZWQucHVzaChuZXdPcHRpb24uaWQpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnNldFNlbGVjdGVkKG5ld1NlbGVjdGVkLCAnaWQnKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5tYWluLnNlbGVjdC5lbGVtZW50XG5cbiAgICAgIC8vIFNpbmdsZSBzZWxlY3QgZWxlbWVudFxuICAgICAgaWYgKGVsZW1lbnQuc2VsZWN0ZWRJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gZWxlbWVudC5vcHRpb25zW2VsZW1lbnQuc2VsZWN0ZWRJbmRleF0gYXMgSFRNTE9wdGlvbkVsZW1lbnRcbiAgICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb24udmFsdWVcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZCh2YWx1ZSwgJ3ZhbHVlJylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBGcm9tIHZhbHVlIHNldCB0aGUgc2VsZWN0ZWQgdmFsdWVcbiAgcHVibGljIHNldFNlbGVjdGVkKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSwgdHlwZSA9ICdpZCcpOiB2b2lkIHtcbiAgICAvLyBMb29wIHRocm91Z2ggZGF0YSBhbmQgc2V0IHNlbGVjdGVkIHZhbHVlc1xuICAgIGZvciAoY29uc3QgZCBvZiB0aGlzLmRhdGEpIHtcbiAgICAgIC8vIERlYWwgd2l0aCBvcHRncm91cHNcbiAgICAgIGlmIChkLmhhc093blByb3BlcnR5KCdsYWJlbCcpKSB7XG4gICAgICAgIGlmIChkLmhhc093blByb3BlcnR5KCdvcHRpb25zJykpIHtcbiAgICAgICAgICBjb25zdCBvcHRpb25zID0gKGQgYXMgT3B0Z3JvdXApLm9wdGlvbnNcbiAgICAgICAgICBpZiAob3B0aW9ucykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBvIG9mIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgLy8gRG8gbm90IHNlbGVjdCBpZiBpdHMgYSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgICBpZiAoby5wbGFjZWhvbGRlcikge2NvbnRpbnVlfVxuXG4gICAgICAgICAgICAgIG8uc2VsZWN0ZWQgPSB0aGlzLnNob3VsZEJlU2VsZWN0ZWQobywgdmFsdWUsIHR5cGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAoZCBhcyBPcHRpb24pLnNlbGVjdGVkID0gdGhpcy5zaG91bGRCZVNlbGVjdGVkKChkIGFzIE9wdGlvbiksIHZhbHVlLCB0eXBlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIERldGVybWluZXMgd2hldGhlciBvciBub3QgcGFzc2VkIGluIG9wdGlvbiBzaG91bGQgYmUgc2VsZWN0ZWQgYmFzZWQgdXBvbiBwb3NzaWJsZSB2YWx1ZXNcbiAgcHVibGljIHNob3VsZEJlU2VsZWN0ZWQob3B0aW9uOiBPcHRpb24sIHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSwgdHlwZTogc3RyaW5nID0gJ2lkJyk6IGJvb2xlYW4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgZm9yIChjb25zdCB2IG9mIHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlIGluIG9wdGlvbiAmJiBTdHJpbmcoKG9wdGlvbiBhcyBhbnkpW3R5cGVdKSA9PT0gU3RyaW5nKHYpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZSBpbiBvcHRpb24gJiYgU3RyaW5nKChvcHRpb24gYXMgYW55KVt0eXBlXSkgPT09IFN0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIEZyb20gZGF0YSBnZXQgb3B0aW9uIHwgb3B0aW9uW10gb2Ygc2VsZWN0ZWQgdmFsdWVzXG4gIC8vIElmIHNpbmdsZSBzZWxlY3QgcmV0dXJuIGxhc3Qgc2VsZWN0ZWQgdmFsdWVcbiAgcHVibGljIGdldFNlbGVjdGVkKCk6IE9wdGlvbiB8IE9wdGlvbltdIHtcbiAgICBsZXQgdmFsdWU6IE9wdGlvbiA9IHsgdGV4dDogJycsIHBsYWNlaG9sZGVyOiB0aGlzLm1haW4uY29uZmlnLnBsYWNlaG9sZGVyVGV4dCB9IC8vIERvbnQgd29ycnkgYWJvdXQgc2V0dGluZyB0aGlzKG1ha2UgdHlwZXNjcmlwdCBoYXBweSkuIElmIHNpbmdsZSBhIHZhbHVlIHdpbGwgYmUgc2VsZWN0ZWRcbiAgICBjb25zdCB2YWx1ZXM6IE9wdGlvbltdID0gW11cbiAgICBmb3IgKGNvbnN0IGQgb2YgdGhpcy5kYXRhKSB7XG4gICAgICAvLyBEZWFsIHdpdGggb3B0Z3JvdXBzXG4gICAgICBpZiAoZC5oYXNPd25Qcm9wZXJ0eSgnbGFiZWwnKSkge1xuICAgICAgICBpZiAoZC5oYXNPd25Qcm9wZXJ0eSgnb3B0aW9ucycpKSB7XG4gICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IChkIGFzIE9wdGdyb3VwKS5vcHRpb25zXG4gICAgICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbyBvZiBvcHRpb25zKSB7XG4gICAgICAgICAgICAgIGlmIChvLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgc2luZ2xlIHJldHVybiBvcHRpb25cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMubWFpbi5jb25maWcuaXNNdWx0aXBsZSkge1xuICAgICAgICAgICAgICAgICAgdmFsdWUgPSBvXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vIFB1c2ggdG8gbXVsdGlwbGUgYXJyYXlcbiAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKG8pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBQdXNoIG9wdGlvbnMgdG8gYXJyYXlcbiAgICAgICAgaWYgKChkIGFzIE9wdGlvbikuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAvLyBJZiBzaW5nbGUgcmV0dXJuIG9wdGlvblxuICAgICAgICAgIGlmICghdGhpcy5tYWluLmNvbmZpZy5pc011bHRpcGxlKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGQgYXMgT3B0aW9uXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFB1c2ggdG8gbXVsdGlwbGUgYXJyYXlcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKGQgYXMgT3B0aW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEVpdGhlciByZXR1cm4gYXJyYXkgb3Igb2JqZWN0IG9yIG51bGxcbiAgICBpZiAodGhpcy5tYWluLmNvbmZpZy5pc011bHRpcGxlKSB7XG4gICAgICByZXR1cm4gdmFsdWVzXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgLy8gSWYgc2VsZWN0IHR5cGUgaXMgbXVsdGlwbGUgYXBwZW5kIHZhbHVlIGFuZCBzZXQgc2VsZWN0ZWRcbiAgcHVibGljIGFkZFRvU2VsZWN0ZWQodmFsdWU6IHN0cmluZywgdHlwZSA9ICdpZCcpIHtcbiAgICBpZiAodGhpcy5tYWluLmNvbmZpZy5pc011bHRpcGxlKSB7XG4gICAgICBjb25zdCB2YWx1ZXMgPSBbXVxuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmdldFNlbGVjdGVkKClcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNlbGVjdGVkKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHMgb2Ygc2VsZWN0ZWQpIHtcbiAgICAgICAgICB2YWx1ZXMucHVzaCgocyBhcyBhbnkpW3R5cGVdKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YWx1ZXMucHVzaCh2YWx1ZSlcblxuICAgICAgdGhpcy5zZXRTZWxlY3RlZCh2YWx1ZXMsIHR5cGUpXG4gICAgfVxuICB9XG5cbiAgLy8gUmVtb3ZlIG9iamVjdCBmcm9tIHNlbGVjdGVkXG4gIHB1YmxpYyByZW1vdmVGcm9tU2VsZWN0ZWQodmFsdWU6IHN0cmluZywgdHlwZSA9ICdpZCcpIHtcbiAgICBpZiAodGhpcy5tYWluLmNvbmZpZy5pc011bHRpcGxlKSB7XG4gICAgICBjb25zdCB2YWx1ZXMgPSBbXVxuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmdldFNlbGVjdGVkKCkgYXMgT3B0aW9uW11cbiAgICAgIGZvciAoY29uc3QgcyBvZiBzZWxlY3RlZCkge1xuICAgICAgICBpZiAoU3RyaW5nKChzIGFzIGFueSlbdHlwZV0pICE9PSBTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgICAgdmFsdWVzLnB1c2goKHMgYXMgYW55KVt0eXBlXSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFNlbGVjdGVkKHZhbHVlcywgdHlwZSlcbiAgICB9XG4gIH1cblxuICAvLyBUcmlnZ2VyIG9uQ2hhbmdlIGNhbGxiYWNrXG4gIHB1YmxpYyBvbkRhdGFDaGFuZ2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubWFpbi5vbkNoYW5nZSAmJiB0aGlzLmlzT25DaGFuZ2VFbmFibGVkKSB7XG4gICAgICB0aGlzLm1haW4ub25DaGFuZ2UoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmdldFNlbGVjdGVkKCkpKSlcbiAgICB9XG4gIH1cblxuICAvLyBUYWtlIGluIGEgdmFsdWUgbG9vcCB0aHJvdWdoIHRoZSBkYXRhIHRpbGwgeW91IGZpbmQgaXQgYW5kIHJldHVybiBpdFxuICBwdWJsaWMgZ2V0T2JqZWN0RnJvbURhdGEodmFsdWU6IHN0cmluZywgdHlwZSA9ICdpZCcpOiBPcHRpb24gfCBudWxsIHtcbiAgICBmb3IgKGNvbnN0IGQgb2YgdGhpcy5kYXRhKSB7XG4gICAgICAvLyBJZiBvcHRpb24gY2hlY2sgaWYgdmFsdWUgaXMgdGhlIHNhbWVcbiAgICAgIGlmICh0eXBlIGluIGQgJiYgU3RyaW5nKChkIGFzIGFueSlbdHlwZV0pID09PSBTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBkIGFzIE9wdGlvblxuICAgICAgfVxuICAgICAgLy8gSWYgb3B0Z3JvdXAgbG9vcCB0aHJvdWdoIG9wdGlvbnNcbiAgICAgIGlmIChkLmhhc093blByb3BlcnR5KCdvcHRpb25zJykpIHtcbiAgICAgICAgY29uc3Qgb3B0Z3JvdXBPYmplY3QgPSBkIGFzIE9wdGdyb3VwXG4gICAgICAgIGlmIChvcHRncm91cE9iamVjdC5vcHRpb25zKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBvbyBvZiBvcHRncm91cE9iamVjdC5vcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAoU3RyaW5nKChvbyBhcyBhbnkpW3R5cGVdKSA9PT0gU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gb29cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgLy8gVGFrZSBpbiBzZWFyY2ggc3RyaW5nIGFuZCByZXR1cm4gZmlsdGVyZWQgbGlzdCBvZiB2YWx1ZXNcbiAgcHVibGljIHNlYXJjaChzZWFyY2g6IHN0cmluZykge1xuICAgIHRoaXMuc2VhcmNoVmFsdWUgPSBzZWFyY2hcbiAgICBpZiAoc2VhcmNoLnRyaW0oKSA9PT0gJycpIHsgdGhpcy5maWx0ZXJlZCA9IG51bGw7IHJldHVybiB9XG5cbiAgICBjb25zdCBzZWFyY2hGaWx0ZXIgPSB0aGlzLm1haW4uY29uZmlnLnNlYXJjaEZpbHRlclxuICAgIGNvbnN0IHZhbHVlc0FycmF5ID0gdGhpcy5kYXRhLnNsaWNlKDApXG4gICAgc2VhcmNoID0gc2VhcmNoLnRyaW0oKVxuICAgIGNvbnN0IGZpbHRlcmVkID0gdmFsdWVzQXJyYXkubWFwKChvYmopID0+IHtcbiAgICAgIC8vIElmIG9wdGdyb3VwXG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KCdvcHRpb25zJykpIHtcbiAgICAgICAgY29uc3Qgb3B0Z3JvdXBPYmogPSBvYmogYXMgT3B0Z3JvdXBcbiAgICAgICAgbGV0IG9wdGlvbnM6IE9wdGlvbltdID0gW11cbiAgICAgICAgaWYgKG9wdGdyb3VwT2JqLm9wdGlvbnMpIHtcbiAgICAgICAgICBvcHRpb25zID0gb3B0Z3JvdXBPYmoub3B0aW9ucy5maWx0ZXIoKG9wdCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaEZpbHRlcihvcHQsIHNlYXJjaClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgIGNvbnN0IG9wdGdyb3VwID0gKE9iamVjdCBhcyBhbnkpLmFzc2lnbih7fSwgb3B0Z3JvdXBPYmopIC8vIEJyZWFrIHBvaW50ZXJcbiAgICAgICAgICBvcHRncm91cC5vcHRpb25zID0gb3B0aW9uc1xuICAgICAgICAgIHJldHVybiBvcHRncm91cFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHNpbmdsZSBvcHRpb25cbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoJ3RleHQnKSkge1xuICAgICAgICBjb25zdCBvcHRpb25PYmogPSBvYmogYXMgT3B0aW9uXG4gICAgICAgIGlmIChzZWFyY2hGaWx0ZXIob3B0aW9uT2JqLCBzZWFyY2gpKSB7IHJldHVybiBvYmogfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH0pXG5cbiAgICAvLyBGaWx0ZXIgb3V0IGZhbHNlIHZhbHVlc1xuICAgIHRoaXMuZmlsdGVyZWQgPSBmaWx0ZXJlZC5maWx0ZXIoKGluZm8pID0+IGluZm8pXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRGF0YShkYXRhOiBkYXRhQXJyYXkpOiBib29sZWFuIHtcbiAgaWYgKCFkYXRhKSB7IGNvbnNvbGUuZXJyb3IoJ0RhdGEgbXVzdCBiZSBhbiBhcnJheSBvZiBvYmplY3RzJyk7IHJldHVybiBmYWxzZSB9XG4gIGxldCBpc1ZhbGlkID0gZmFsc2VcbiAgbGV0IGVycm9yQ291bnQgPSAwXG5cbiAgZm9yIChjb25zdCBkIG9mIGRhdGEpIHtcbiAgICBpZiAoZC5oYXNPd25Qcm9wZXJ0eSgnbGFiZWwnKSkge1xuICAgICAgaWYgKGQuaGFzT3duUHJvcGVydHkoJ29wdGlvbnMnKSkge1xuICAgICAgICBjb25zdCBvcHRncm91cCA9IGQgYXMgT3B0Z3JvdXBcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IG9wdGdyb3VwLm9wdGlvbnNcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IG8gb2Ygb3B0aW9ucykge1xuICAgICAgICAgICAgaXNWYWxpZCA9IHZhbGlkYXRlT3B0aW9uKG8pXG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQpIHsgZXJyb3JDb3VudCsrIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb3B0aW9uID0gZCBhcyBPcHRpb25cbiAgICAgIGlzVmFsaWQgPSB2YWxpZGF0ZU9wdGlvbihvcHRpb24pXG4gICAgICBpZiAoIWlzVmFsaWQpIHsgZXJyb3JDb3VudCsrIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZXJyb3JDb3VudCA9PT0gMFxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVPcHRpb24ob3B0aW9uOiBPcHRpb24pOiBib29sZWFuIHtcbiAgaWYgKG9wdGlvbi50ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICBjb25zb2xlLmVycm9yKCdEYXRhIG9iamVjdCBvcHRpb24gbXVzdCBoYXZlIGF0IGxlYXN0IGhhdmUgYSB0ZXh0IHZhbHVlLiBDaGVjayBvYmplY3Q6ICcgKyBKU09OLnN0cmluZ2lmeShvcHRpb24pKVxuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiB0cnVlXG59XG4iLCJpbXBvcnQgVGhpblNlbGVjdCBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHsgZW5zdXJlRWxlbWVudEluVmlldywgaXNWYWx1ZUluQXJyYXlPZk9iamVjdHMsIGhpZ2hsaWdodCB9IGZyb20gJy4vaGVscGVyJ1xuaW1wb3J0IHsgT3B0aW9uLCBPcHRncm91cCwgdmFsaWRhdGVPcHRpb24gfSBmcm9tICcuL2RhdGEnXG5cbmludGVyZmFjZSBTaW5nbGVTZWxlY3RlZCB7XG4gIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnRcbiAgcGxhY2Vob2xkZXI6IEhUTUxTcGFuRWxlbWVudFxuICBkZXNlbGVjdDogSFRNTFNwYW5FbGVtZW50XG4gIGFycm93SWNvbjoge1xuICAgIGNvbnRhaW5lcjogSFRNTFNwYW5FbGVtZW50XG4gICAgYXJyb3c6IEhUTUxTcGFuRWxlbWVudFxuICB9XG59XG5cbmludGVyZmFjZSBNdWx0aVNlbGVjdGVkIHtcbiAgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudFxuICB2YWx1ZXM6IEhUTUxEaXZFbGVtZW50XG4gIGFkZDogSFRNTERpdkVsZW1lbnRcbiAgcGx1czogSFRNTFNwYW5FbGVtZW50XG59XG5cbmludGVyZmFjZSBTZWFyY2gge1xuICBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50XG4gIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50XG4gIGFkZGFibGU/OiBIVE1MRGl2RWxlbWVudFxufVxuXG4vLyBDbGFzcyBpcyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgYWxsIHRoZSBlbGVtZW50c1xuZXhwb3J0IGNsYXNzIFNsaW0ge1xuICBwdWJsaWMgbWFpbjogVGhpblNlbGVjdFxuICBwdWJsaWMgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudFxuICBwdWJsaWMgc2luZ2xlU2VsZWN0ZWQ6IFNpbmdsZVNlbGVjdGVkIHwgbnVsbFxuICBwdWJsaWMgbXVsdGlTZWxlY3RlZDogTXVsdGlTZWxlY3RlZCB8IG51bGxcbiAgcHVibGljIGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50XG4gIHB1YmxpYyBzZWFyY2g6IFNlYXJjaFxuICBwdWJsaWMgbGlzdDogSFRNTERpdkVsZW1lbnRcbiAgY29uc3RydWN0b3IoaW5mbzogeyBtYWluOiBUaGluU2VsZWN0IH0pIHtcbiAgICB0aGlzLm1haW4gPSBpbmZvLm1haW5cblxuICAgIC8vIENyZWF0ZSBlbGVtZW50cyBpbiBvcmRlciBvZiBhcHBlbmRpbmdcbiAgICB0aGlzLmNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyRGl2KClcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmNvbnRlbnREaXYoKVxuICAgIHRoaXMuc2VhcmNoID0gdGhpcy5zZWFyY2hEaXYoKVxuICAgIHRoaXMubGlzdCA9IHRoaXMubGlzdERpdigpXG4gICAgdGhpcy5vcHRpb25zKClcblxuICAgIHRoaXMuc2luZ2xlU2VsZWN0ZWQgPSBudWxsXG4gICAgdGhpcy5tdWx0aVNlbGVjdGVkID0gbnVsbFxuICAgIGlmICh0aGlzLm1haW4uY29uZmlnLmlzTXVsdGlwbGUpIHtcbiAgICAgIHRoaXMubXVsdGlTZWxlY3RlZCA9IHRoaXMubXVsdGlTZWxlY3RlZERpdigpXG4gICAgICBpZiAodGhpcy5tdWx0aVNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubXVsdGlTZWxlY3RlZC5jb250YWluZXIpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2luZ2xlU2VsZWN0ZWQgPSB0aGlzLnNpbmdsZVNlbGVjdGVkRGl2KClcbiAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuc2luZ2xlU2VsZWN0ZWQuY29udGFpbmVyKVxuICAgIH1cbiAgICBpZiAodGhpcy5tYWluLmNvbmZpZy5hZGRUb0JvZHkpIHtcbiAgICAgIC8vIGFkZCB0aGUgaWQgdG8gdGhlIGNvbnRlbnQgYXMgYSBjbGFzcyBhcyB3ZWxsXG4gICAgICAvLyB0aGlzIGlzIGltcG9ydGFudCBvbiB0b3VjaCBkZXZpY2VzIGFzIHRoZSBjbG9zZSBtZXRob2QgaXNcbiAgICAgIC8vIHRyaWdnZXJlZCB3aGVuIGNsaWNrcyBvbiB0aGUgZG9jdW1lbnQgYm9keSBvY2N1clxuICAgICAgdGhpcy5jb250ZW50LmNsYXNzTGlzdC5hZGQodGhpcy5tYWluLmNvbmZpZy5pZClcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnQpXG4gICAgfVxuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnNlYXJjaC5jb250YWluZXIpXG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHRoaXMubGlzdClcbiAgfVxuXG4gIC8vIENyZWF0ZSBtYWluIGNvbnRhaW5lclxuICBwdWJsaWMgY29udGFpbmVyRGl2KCk6IEhUTUxEaXZFbGVtZW50IHtcbiAgICAvLyBDcmVhdGUgbWFpbiBjb250YWluZXJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSBhcyBIVE1MRGl2RWxlbWVudFxuXG4gICAgLy8gQWRkIHN0eWxlIGFuZCBjbGFzc2VzXG4gICAgY29udGFpbmVyLnN0eWxlLmNzc1RleHQgPSB0aGlzLm1haW4uY29uZmlnLnN0eWxlXG5cbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lckRpdkNsYXNzKGNvbnRhaW5lcilcblxuICAgIHJldHVybiBjb250YWluZXJcbiAgfVxuXG4gIC8vIFdpbGwgbG9vayBhdCB0aGUgb3JpZ2luYWwgc2VsZWN0IGFuZCBwdWxsIGNsYXNzZXMgZnJvbSBpdFxuICBwdWJsaWMgdXBkYXRlQ29udGFpbmVyRGl2Q2xhc3MoY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCkge1xuICAgIC8vIFNldCBjb25maWcgY2xhc3NcbiAgICB0aGlzLm1haW4uY29uZmlnLmNsYXNzID0gdGhpcy5tYWluLnNlbGVjdC5lbGVtZW50LmNsYXNzTmFtZS5zcGxpdCgnICcpXG5cbiAgICAvLyBDbGVhciBvdXQgY2xhc3NsaXN0XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9ICcnXG5cbiAgICAvLyBMb29wIHRocm91Z2ggY29uZmlnIGNsYXNzIGFuZCBhZGRcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLm1haW4uY29uZmlnLmlkKVxuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMubWFpbi5jb25maWcubWFpbilcbiAgICBmb3IgKGNvbnN0IGMgb2YgdGhpcy5tYWluLmNvbmZpZy5jbGFzcykge1xuICAgICAgaWYgKGMudHJpbSgpICE9PSAnJykge1xuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChjKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzaW5nbGVTZWxlY3RlZERpdigpOiBTaW5nbGVTZWxlY3RlZCB7XG4gICAgY29uc3QgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5tYWluLmNvbmZpZy5zaW5nbGVTZWxlY3RlZClcblxuICAgIC8vIFBsYWNlaG9sZGVyIHRleHRcbiAgICBjb25zdCBwbGFjZWhvbGRlcjogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgcGxhY2Vob2xkZXIuY2xhc3NMaXN0LmFkZCgncGxhY2Vob2xkZXInKVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcilcblxuICAgIC8vIERlc2VsZWN0XG4gICAgY29uc3QgZGVzZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBkZXNlbGVjdC5pbm5lckhUTUwgPSB0aGlzLm1haW4uY29uZmlnLmRlc2VsZWN0TGFiZWxcbiAgICBkZXNlbGVjdC5jbGFzc0xpc3QuYWRkKCdzcy1kZXNlbGVjdCcpXG4gICAgZGVzZWxlY3Qub25jbGljayA9IChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICAgIC8vIERvbnQgZG8gYW55dGhpbmcgaWYgZGlzYWJsZWRcbiAgICAgIGlmICghdGhpcy5tYWluLmNvbmZpZy5pc0VuYWJsZWQpIHtyZXR1cm59XG5cbiAgICAgIHRoaXMubWFpbi5zZXQoJycpXG4gICAgfVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkZXNlbGVjdClcblxuICAgIC8vIEFycm93XG4gICAgY29uc3QgYXJyb3dDb250YWluZXI6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIGFycm93Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5tYWluLmNvbmZpZy5hcnJvdylcbiAgICBjb25zdCBhcnJvd0ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBhcnJvd0ljb24uY2xhc3NMaXN0LmFkZCgnYXJyb3ctZG93bicpXG4gICAgYXJyb3dDb250YWluZXIuYXBwZW5kQ2hpbGQoYXJyb3dJY29uKVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhcnJvd0NvbnRhaW5lcilcblxuICAgIC8vIEFkZCBvbmNsaWNrIGZvciBtYWluIHNlbGVjdG9yIGRpdlxuICAgIGNvbnRhaW5lci5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLm1haW4uY29uZmlnLmlzRW5hYmxlZCkgeyByZXR1cm4gfVxuXG4gICAgICB0aGlzLm1haW4uZGF0YS5jb250ZW50T3BlbiA/IHRoaXMubWFpbi5jbG9zZSgpIDogdGhpcy5tYWluLm9wZW4oKVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjb250YWluZXIsXG4gICAgICBwbGFjZWhvbGRlcixcbiAgICAgIGRlc2VsZWN0LFxuICAgICAgYXJyb3dJY29uOiB7XG4gICAgICAgIGNvbnRhaW5lcjogYXJyb3dDb250YWluZXIsXG4gICAgICAgIGFycm93OiBhcnJvd0ljb25cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBCYXNlZCB1cG9uIGN1cnJlbnQgc2VsZWN0aW9uIHNldCBwbGFjZWhvbGRlciB0ZXh0XG4gIHB1YmxpYyBwbGFjZWhvbGRlcigpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMubWFpbi5kYXRhLmdldFNlbGVjdGVkKCkgYXMgT3B0aW9uXG5cbiAgICAvLyBQbGFjZWhvbGRlciBkaXNwbGF5XG4gICAgaWYgKHNlbGVjdGVkID09PSBudWxsIHx8IChzZWxlY3RlZCAmJiBzZWxlY3RlZC5wbGFjZWhvbGRlcikpIHtcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICBwbGFjZWhvbGRlci5jbGFzc0xpc3QuYWRkKHRoaXMubWFpbi5jb25maWcuZGlzYWJsZWQpXG4gICAgICBwbGFjZWhvbGRlci5pbm5lckhUTUwgPSB0aGlzLm1haW4uY29uZmlnLnBsYWNlaG9sZGVyVGV4dFxuICAgICAgaWYgKHRoaXMuc2luZ2xlU2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5zaW5nbGVTZWxlY3RlZC5wbGFjZWhvbGRlci5pbm5lckhUTUwgPSBwbGFjZWhvbGRlci5vdXRlckhUTUxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHNlbGVjdGVkVmFsdWUgPSAnJ1xuICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgIHNlbGVjdGVkVmFsdWUgPSBzZWxlY3RlZC5pbm5lckhUTUwgJiYgdGhpcy5tYWluLmNvbmZpZy52YWx1ZXNVc2VUZXh0ICE9PSB0cnVlID8gc2VsZWN0ZWQuaW5uZXJIVE1MIDogc2VsZWN0ZWQudGV4dFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc2luZ2xlU2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5zaW5nbGVTZWxlY3RlZC5wbGFjZWhvbGRlci5pbm5lckhUTUwgPSAoc2VsZWN0ZWQgPyBzZWxlY3RlZFZhbHVlIDogJycpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQmFzZWQgdXBvbiBjdXJyZW50IHNlbGVjdGlvbi9zZXR0aW5ncyBoaWRlL3Nob3cgZGVzZWxlY3RcbiAgcHVibGljIGRlc2VsZWN0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNpbmdsZVNlbGVjdGVkKSB7XG4gICAgICAvLyBpZiBhbGxvd0Rlc2VsZWN0IGlzIGZhbHNlIGp1c3QgaGlkZSBpdFxuICAgICAgaWYgKCF0aGlzLm1haW4uY29uZmlnLmFsbG93RGVzZWxlY3QpIHtcbiAgICAgICAgdGhpcy5zaW5nbGVTZWxlY3RlZC5kZXNlbGVjdC5jbGFzc0xpc3QuYWRkKCdzcy1oaWRlJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm1haW4uc2VsZWN0ZWQoKSA9PT0gJycpIHtcbiAgICAgICAgdGhpcy5zaW5nbGVTZWxlY3RlZC5kZXNlbGVjdC5jbGFzc0xpc3QuYWRkKCdzcy1oaWRlJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2luZ2xlU2VsZWN0ZWQuZGVzZWxlY3QuY2xhc3NMaXN0LnJlbW92ZSgnc3MtaGlkZScpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG11bHRpU2VsZWN0ZWREaXYoKTogTXVsdGlTZWxlY3RlZCB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLm1haW4uY29uZmlnLm11bHRpU2VsZWN0ZWQpXG5cbiAgICBjb25zdCB2YWx1ZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHZhbHVlcy5jbGFzc0xpc3QuYWRkKHRoaXMubWFpbi5jb25maWcudmFsdWVzKVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh2YWx1ZXMpXG5cbiAgICBjb25zdCBhZGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGFkZC5jbGFzc0xpc3QuYWRkKHRoaXMubWFpbi5jb25maWcuYWRkKVxuICAgIGNvbnN0IHBsdXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBwbHVzLmNsYXNzTGlzdC5hZGQodGhpcy5tYWluLmNvbmZpZy5wbHVzKVxuICAgIHBsdXMub25jbGljayA9IChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5tYWluLmRhdGEuY29udGVudE9wZW4pIHtcbiAgICAgICAgdGhpcy5tYWluLmNsb3NlKClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgfVxuICAgIH1cbiAgICBhZGQuYXBwZW5kQ2hpbGQocGx1cylcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYWRkKVxuXG4gICAgY29udGFpbmVyLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLm1haW4uY29uZmlnLmlzRW5hYmxlZCkgeyByZXR1cm4gfVxuXG4gICAgICAvLyBPcGVuIG9ubHkgaWYgeW91IGFyZSBub3QgY2xpY2tpbmcgb24geCB0ZXh0XG4gICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBFbGVtZW50XG4gICAgICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5tYWluLmNvbmZpZy52YWx1ZURlbGV0ZSkpIHtcbiAgICAgICAgdGhpcy5tYWluLmRhdGEuY29udGVudE9wZW4gPyB0aGlzLm1haW4uY2xvc2UoKSA6IHRoaXMubWFpbi5vcGVuKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29udGFpbmVyLFxuICAgICAgdmFsdWVzLFxuICAgICAgYWRkLFxuICAgICAgcGx1c1xuICAgIH1cbiAgfVxuXG4gIC8vIEdldCBzZWxlY3RlZCB2YWx1ZXMgYW5kIGFwcGVuZCB0byBtdWx0aVNlbGVjdGVkIHZhbHVlcyBjb250YWluZXJcbiAgLy8gYW5kIHJlbW92ZSB0aG9zZSB3aG8gc2hvdWxkbnQgZXhpc3RcbiAgcHVibGljIHZhbHVlcygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubXVsdGlTZWxlY3RlZCkgeyByZXR1cm4gfVxuICAgIGxldCBjdXJyZW50Tm9kZXMgPSB0aGlzLm11bHRpU2VsZWN0ZWQudmFsdWVzLmNoaWxkTm9kZXMgYXMgYW55IGFzIEhUTUxEaXZFbGVtZW50W11cbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMubWFpbi5kYXRhLmdldFNlbGVjdGVkKCkgYXMgT3B0aW9uW11cblxuICAgIC8vIFJlbW92ZSBub2RlcyB0aGF0IHNob3VsZG50IGJlIHRoZXJlXG4gICAgbGV0IGV4aXN0c1xuICAgIGNvbnN0IG5vZGVzVG9SZW1vdmUgPSBbXVxuICAgIGZvciAoY29uc3QgYyBvZiBjdXJyZW50Tm9kZXMpIHtcbiAgICAgIGV4aXN0cyA9IHRydWVcbiAgICAgIGZvciAoY29uc3QgcyBvZiBzZWxlY3RlZCkge1xuICAgICAgICBpZiAoU3RyaW5nKHMuaWQpID09PSBTdHJpbmcoYy5kYXRhc2V0LmlkKSkge1xuICAgICAgICAgIGV4aXN0cyA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGV4aXN0cykgeyBub2Rlc1RvUmVtb3ZlLnB1c2goYykgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgbiBvZiBub2Rlc1RvUmVtb3ZlKSB7XG4gICAgICBuLmNsYXNzTGlzdC5hZGQoJ3NzLW91dCcpXG4gICAgICB0aGlzLm11bHRpU2VsZWN0ZWQudmFsdWVzLnJlbW92ZUNoaWxkKG4pXG4gICAgfVxuXG4gICAgLy8gQWRkIHZhbHVlcyB0aGF0IGRvbnQgY3VycmVudGx5IGV4aXN0XG4gICAgY3VycmVudE5vZGVzID0gdGhpcy5tdWx0aVNlbGVjdGVkLnZhbHVlcy5jaGlsZE5vZGVzIGFzIGFueSBhcyBIVE1MRGl2RWxlbWVudFtdXG4gICAgZm9yIChsZXQgcyA9IDA7IHMgPCBzZWxlY3RlZC5sZW5ndGg7IHMrKykge1xuICAgICAgZXhpc3RzID0gZmFsc2VcbiAgICAgIGZvciAoY29uc3QgYyBvZiBjdXJyZW50Tm9kZXMpIHtcbiAgICAgICAgaWYgKFN0cmluZyhzZWxlY3RlZFtzXS5pZCkgPT09IFN0cmluZyhjLmRhdGFzZXQuaWQpKSB7XG4gICAgICAgICAgZXhpc3RzID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZXhpc3RzKSB7XG4gICAgICAgIGlmIChjdXJyZW50Tm9kZXMubGVuZ3RoID09PSAwIHx8ICFIVE1MRWxlbWVudC5wcm90b3R5cGUuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KSB7XG4gICAgICAgICAgdGhpcy5tdWx0aVNlbGVjdGVkLnZhbHVlcy5hcHBlbmRDaGlsZCh0aGlzLnZhbHVlRGl2KHNlbGVjdGVkW3NdKSlcbiAgICAgICAgfSBlbHNlIGlmIChzID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5tdWx0aVNlbGVjdGVkLnZhbHVlcy5pbnNlcnRCZWZvcmUodGhpcy52YWx1ZURpdihzZWxlY3RlZFtzXSksIChjdXJyZW50Tm9kZXNbc10gYXMgYW55KSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAoY3VycmVudE5vZGVzW3MgLSAxXSBhcyBhbnkpLmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJlbmQnLCB0aGlzLnZhbHVlRGl2KHNlbGVjdGVkW3NdKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGFyZSBubyB2YWx1ZXMgc2V0IHBsYWNlaG9sZGVyXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgIHBsYWNlaG9sZGVyLmNsYXNzTGlzdC5hZGQodGhpcy5tYWluLmNvbmZpZy5kaXNhYmxlZClcbiAgICAgIHBsYWNlaG9sZGVyLmlubmVySFRNTCA9IHRoaXMubWFpbi5jb25maWcucGxhY2Vob2xkZXJUZXh0XG4gICAgICB0aGlzLm11bHRpU2VsZWN0ZWQudmFsdWVzLmlubmVySFRNTCA9IHBsYWNlaG9sZGVyLm91dGVySFRNTFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB2YWx1ZURpdihvcHRpb25PYmo6IE9wdGlvbik6IEhUTUxEaXZFbGVtZW50IHtcbiAgICBjb25zdCB2YWx1ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdmFsdWUuY2xhc3NMaXN0LmFkZCh0aGlzLm1haW4uY29uZmlnLnZhbHVlKVxuICAgIHZhbHVlLmRhdGFzZXQuaWQgPSBvcHRpb25PYmouaWRcblxuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICB0ZXh0LmNsYXNzTGlzdC5hZGQodGhpcy5tYWluLmNvbmZpZy52YWx1ZVRleHQpXG4gICAgdGV4dC5pbm5lckhUTUwgPSAob3B0aW9uT2JqLmlubmVySFRNTCAmJiB0aGlzLm1haW4uY29uZmlnLnZhbHVlc1VzZVRleHQgIT09IHRydWUgPyBvcHRpb25PYmouaW5uZXJIVE1MIDogb3B0aW9uT2JqLnRleHQpXG4gICAgdmFsdWUuYXBwZW5kQ2hpbGQodGV4dClcblxuICAgIGlmICghb3B0aW9uT2JqLm1hbmRhdG9yeSkge1xuICAgICAgY29uc3QgZGVsZXRlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgZGVsZXRlU3Bhbi5jbGFzc0xpc3QuYWRkKHRoaXMubWFpbi5jb25maWcudmFsdWVEZWxldGUpXG4gICAgICBkZWxldGVTcGFuLmlubmVySFRNTCA9IHRoaXMubWFpbi5jb25maWcuZGVzZWxlY3RMYWJlbFxuICAgICAgZGVsZXRlU3Bhbi5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgbGV0IHNob3VsZFVwZGF0ZSA9IGZhbHNlXG5cbiAgICAgICAgLy8gSWYgbm8gYmVmb3JlT25DaGFuZ2UgaXMgc2V0IGF1dG9tYXRpY2FsbHkgdXBkYXRlIGF0IGVuZFxuICAgICAgICBpZiAoIXRoaXMubWFpbi5iZWZvcmVPbkNoYW5nZSkge3Nob3VsZFVwZGF0ZSA9IHRydWV9XG5cbiAgICAgICAgaWYgKHRoaXMubWFpbi5iZWZvcmVPbkNoYW5nZSkge1xuICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5tYWluLmRhdGEuZ2V0U2VsZWN0ZWQoKSBhcyBPcHRpb25cbiAgICAgICAgICBjb25zdCBjdXJyZW50VmFsdWVzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzZWxlY3RlZCkpXG5cbiAgICAgICAgICAvLyBSZW1vdmUgZnJvbSBjdXJyZW50IHNlbGVjdGlvblxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudFZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRWYWx1ZXNbaV0uaWQgPT09IG9wdGlvbk9iai5pZCkge1xuICAgICAgICAgICAgICBjdXJyZW50VmFsdWVzLnNwbGljZShpLCAxKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGJlZm9yZU9uY2hhbmdlID0gdGhpcy5tYWluLmJlZm9yZU9uQ2hhbmdlKGN1cnJlbnRWYWx1ZXMpXG4gICAgICAgICAgaWYgKGJlZm9yZU9uY2hhbmdlICE9PSBmYWxzZSkgeyBzaG91bGRVcGRhdGUgPSB0cnVlIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG91bGRVcGRhdGUpIHtcbiAgICAgICAgICB0aGlzLm1haW4uZGF0YS5yZW1vdmVGcm9tU2VsZWN0ZWQoKG9wdGlvbk9iai5pZCBhcyBhbnkpLCAnaWQnKVxuICAgICAgICAgIHRoaXMubWFpbi5yZW5kZXIoKVxuICAgICAgICAgIHRoaXMubWFpbi5zZWxlY3Quc2V0VmFsdWUoKVxuICAgICAgICAgIHRoaXMubWFpbi5kYXRhLm9uRGF0YUNoYW5nZSgpIC8vIFRyaWdnZXIgb24gY2hhbmdlIGNhbGxiYWNrXG4gICAgICAgIH1cbiAgICAgIH1cblxuXG4gICAgICB2YWx1ZS5hcHBlbmRDaGlsZChkZWxldGVTcGFuKVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgLy8gQ3JlYXRlIGNvbnRlbnQgY29udGFpbmVyXG4gIHB1YmxpYyBjb250ZW50RGl2KCk6IEhUTUxEaXZFbGVtZW50IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMubWFpbi5jb25maWcuY29udGVudClcbiAgICByZXR1cm4gY29udGFpbmVyXG4gIH1cblxuICBwdWJsaWMgc2VhcmNoRGl2KCk6IFNlYXJjaCB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JylcbiAgICBjb25zdCBhZGRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLm1haW4uY29uZmlnLnNlYXJjaClcblxuICAgIC8vIFNldHVwIHNlYXJjaCByZXR1cm4gb2JqZWN0XG4gICAgY29uc3Qgc2VhcmNoUmV0dXJuOiBTZWFyY2ggPSB7XG4gICAgICBjb250YWluZXIsXG4gICAgICBpbnB1dFxuICAgIH1cblxuICAgIC8vIFdlIHN0aWxsIHdhbnQgdGhlIHNlYXJjaCB0byBiZSB0YWJhYmxlIGJ1dCBub3Qgc2hvd25cbiAgICBpZiAoIXRoaXMubWFpbi5jb25maWcuc2hvd1NlYXJjaCkge1xuICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5tYWluLmNvbmZpZy5oaWRlKVxuICAgICAgaW5wdXQucmVhZE9ubHkgPSB0cnVlXG4gICAgfVxuXG4gICAgaW5wdXQudHlwZSA9ICdzZWFyY2gnXG4gICAgaW5wdXQucGxhY2Vob2xkZXIgPSB0aGlzLm1haW4uY29uZmlnLnNlYXJjaFBsYWNlaG9sZGVyXG4gICAgaW5wdXQudGFiSW5kZXggPSAwXG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgdGhpcy5tYWluLmNvbmZpZy5zZWFyY2hQbGFjZWhvbGRlcilcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2F1dG9jYXBpdGFsaXplJywgJ29mZicpXG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhdXRvY29tcGxldGUnLCAnb2ZmJylcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2F1dG9jb3JyZWN0JywgJ29mZicpXG4gICAgaW5wdXQub25jbGljayA9IChlKSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudFxuICAgICAgICBpZiAodGFyZ2V0LnZhbHVlID09PSAnJykgeyB0aGlzLm1haW4uc2VhcmNoKCcnKSB9XG4gICAgICB9LCAxMClcbiAgICB9XG4gICAgaW5wdXQub25rZXlkb3duID0gKGUpID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0Fycm93VXAnKSB7XG4gICAgICAgIHRoaXMubWFpbi5vcGVuKClcbiAgICAgICAgdGhpcy5oaWdobGlnaHRVcCgpXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0Fycm93RG93bicpIHtcbiAgICAgICAgdGhpcy5tYWluLm9wZW4oKVxuICAgICAgICB0aGlzLmhpZ2hsaWdodERvd24oKVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09ICdUYWInKSB7XG4gICAgICAgIGlmICghdGhpcy5tYWluLmRhdGEuY29udGVudE9wZW4pIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5tYWluLmNsb3NlKCkgfSwgdGhpcy5tYWluLmNvbmZpZy50aW1lb3V0RGVsYXkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5tYWluLmNsb3NlKClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIH1cbiAgICB9XG4gICAgaW5wdXQub25rZXl1cCA9IChlKSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50XG4gICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgaWYgKHRoaXMubWFpbi5hZGRhYmxlICYmIGUuY3RybEtleSkge1xuICAgICAgICAgIGFkZGFibGUuY2xpY2soKVxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBoaWdobGlnaHRlZCA9IHRoaXMubGlzdC5xdWVyeVNlbGVjdG9yKCcuJyArIHRoaXMubWFpbi5jb25maWcuaGlnaGxpZ2h0ZWQpIGFzIEhUTUxEaXZFbGVtZW50XG4gICAgICAgIGlmIChoaWdobGlnaHRlZCkgeyBoaWdobGlnaHRlZC5jbGljaygpIH1cbiAgICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09ICdBcnJvd1VwJyB8fCBlLmtleSA9PT0gJ0Fycm93RG93bicpIHtcbiAgICAgICAgLy8gQ2FuY2VsIG91dCB0byBsZWF2ZSBmb3Igb25rZXlkb3duIHRvIGhhbmRsZVxuICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgICAgdGhpcy5tYWluLmNsb3NlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLm1haW4uY29uZmlnLnNob3dTZWFyY2ggJiYgdGhpcy5tYWluLmRhdGEuY29udGVudE9wZW4pIHtcbiAgICAgICAgICB0aGlzLm1haW4uc2VhcmNoKHRhcmdldC52YWx1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbnB1dC52YWx1ZSA9ICcnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH1cbiAgICBpbnB1dC5vbmZvY3VzID0gKCkgPT4geyB0aGlzLm1haW4ub3BlbigpIH1cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaW5wdXQpXG5cbiAgICBpZiAodGhpcy5tYWluLmFkZGFibGUpIHtcbiAgICAgIGFkZGFibGUuY2xhc3NMaXN0LmFkZCh0aGlzLm1haW4uY29uZmlnLmFkZGFibGUpXG4gICAgICBhZGRhYmxlLmlubmVySFRNTCA9ICcrJ1xuICAgICAgYWRkYWJsZS5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgaWYgKHRoaXMubWFpbi5hZGRhYmxlKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgICAgICAgY29uc3QgaW5wdXRWYWx1ZSA9IHRoaXMuc2VhcmNoLmlucHV0LnZhbHVlXG4gICAgICAgICAgaWYgKGlucHV0VmFsdWUudHJpbSgpID09PSAnJykgeyB0aGlzLnNlYXJjaC5pbnB1dC5mb2N1cygpOyByZXR1cm4gfVxuXG4gICAgICAgICAgY29uc3QgYWRkYWJsZVZhbHVlID0gdGhpcy5tYWluLmFkZGFibGUoaW5wdXRWYWx1ZSlcbiAgICAgICAgICBsZXQgYWRkYWJsZVZhbHVlU3RyID0gJydcbiAgICAgICAgICBpZiAoIWFkZGFibGVWYWx1ZSkgeyByZXR1cm4gfVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBhZGRhYmxlVmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCB2YWxpZFZhbHVlID0gdmFsaWRhdGVPcHRpb24oYWRkYWJsZVZhbHVlKVxuICAgICAgICAgICAgaWYgKHZhbGlkVmFsdWUpIHtcbiAgICAgICAgICAgICAgdGhpcy5tYWluLmFkZERhdGEoYWRkYWJsZVZhbHVlKVxuICAgICAgICAgICAgICBhZGRhYmxlVmFsdWVTdHIgPSAoYWRkYWJsZVZhbHVlLnZhbHVlID8gYWRkYWJsZVZhbHVlLnZhbHVlIDogYWRkYWJsZVZhbHVlLnRleHQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWFpbi5hZGREYXRhKHRoaXMubWFpbi5kYXRhLm5ld09wdGlvbih7XG4gICAgICAgICAgICAgIHRleHQ6IGFkZGFibGVWYWx1ZSxcbiAgICAgICAgICAgICAgdmFsdWU6IGFkZGFibGVWYWx1ZVxuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICBhZGRhYmxlVmFsdWVTdHIgPSBhZGRhYmxlVmFsdWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLm1haW4uc2VhcmNoKCcnKVxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyAvLyBUZW1wIGZpeCB0byBzb2x2ZSBtdWx0aSByZW5kZXIgaXNzdWVcbiAgICAgICAgICAgIHRoaXMubWFpbi5zZXQoYWRkYWJsZVZhbHVlU3RyLCAndmFsdWUnLCBmYWxzZSwgZmFsc2UpXG4gICAgICAgICAgfSwgMTAwKVxuXG4gICAgICAgICAgLy8gQ2xvc2UgaXQgb25seSBpZiBjbG9zZU9uU2VsZWN0ID0gdHJ1ZVxuICAgICAgICAgIGlmICh0aGlzLm1haW4uY29uZmlnLmNsb3NlT25TZWxlY3QpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyAvLyBHaXZlIGl0IGEgbGl0dGxlIHBhZGRpbmcgZm9yIGEgYmV0dGVyIGxvb2tpbmcgYW5pbWF0aW9uXG4gICAgICAgICAgICAgIHRoaXMubWFpbi5jbG9zZSgpXG4gICAgICAgICAgICB9LCAxMDApXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYWRkYWJsZSlcblxuICAgICAgc2VhcmNoUmV0dXJuLmFkZGFibGUgPSBhZGRhYmxlXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlYXJjaFJldHVyblxuICB9XG5cbiAgcHVibGljIGhpZ2hsaWdodFVwKCk6IHZvaWQge1xuICAgIGNvbnN0IGhpZ2hsaWdodGVkID0gdGhpcy5saXN0LnF1ZXJ5U2VsZWN0b3IoJy4nICsgdGhpcy5tYWluLmNvbmZpZy5oaWdobGlnaHRlZCkgYXMgSFRNTERpdkVsZW1lbnRcbiAgICBsZXQgcHJldjogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gbnVsbFxuICAgIGlmIChoaWdobGlnaHRlZCkge1xuICAgICAgcHJldiA9IGhpZ2hsaWdodGVkLnByZXZpb3VzU2libGluZyBhcyBIVE1MRGl2RWxlbWVudFxuICAgICAgd2hpbGUgKHByZXYgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKHByZXYuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMubWFpbi5jb25maWcuZGlzYWJsZWQpKSB7XG4gICAgICAgICAgcHJldiA9IHByZXYucHJldmlvdXNTaWJsaW5nIGFzIEhUTUxEaXZFbGVtZW50XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFsbE9wdGlvbnMgPSB0aGlzLmxpc3QucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLm1haW4uY29uZmlnLm9wdGlvbiArICc6bm90KC4nICsgdGhpcy5tYWluLmNvbmZpZy5kaXNhYmxlZCArICcpJylcbiAgICAgIHByZXYgPSBhbGxPcHRpb25zW2FsbE9wdGlvbnMubGVuZ3RoIC0gMV0gYXMgSFRNTERpdkVsZW1lbnRcbiAgICB9XG5cbiAgICAvLyBEbyBub3Qgc2VsZWN0IGlmIG9wdGdyb3VwIGxhYmVsXG4gICAgaWYgKHByZXYgJiYgcHJldi5jbGFzc0xpc3QuY29udGFpbnModGhpcy5tYWluLmNvbmZpZy5vcHRncm91cExhYmVsKSkgeyBwcmV2ID0gbnVsbCB9XG5cbiAgICAvLyBDaGVjayBpZiBwYXJlbnQgaXMgb3B0Z3JvdXBcbiAgICBpZiAocHJldiA9PT0gbnVsbCkge1xuICAgICAgY29uc3QgcGFyZW50ID0gaGlnaGxpZ2h0ZWQucGFyZW50Tm9kZSBhcyBIVE1MRGl2RWxlbWVudFxuICAgICAgaWYgKHBhcmVudC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5tYWluLmNvbmZpZy5vcHRncm91cCkpIHtcbiAgICAgICAgaWYgKHBhcmVudC5wcmV2aW91c1NpYmxpbmcpIHtcbiAgICAgICAgICBjb25zdCBwcmV2Tm9kZXMgPSAocGFyZW50LnByZXZpb3VzU2libGluZyBhcyBIVE1MRGl2RWxlbWVudCkucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLm1haW4uY29uZmlnLm9wdGlvbiArICc6bm90KC4nICsgdGhpcy5tYWluLmNvbmZpZy5kaXNhYmxlZCArICcpJylcbiAgICAgICAgICBpZiAocHJldk5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgcHJldiA9IHByZXZOb2Rlc1twcmV2Tm9kZXMubGVuZ3RoIC0gMV0gYXMgSFRNTERpdkVsZW1lbnRcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBwcmV2aW91cyBlbGVtZW50IGV4aXN0cyBoaWdobGlnaHQgaXRcbiAgICBpZiAocHJldikge1xuICAgICAgaWYgKGhpZ2hsaWdodGVkKSB7IGhpZ2hsaWdodGVkLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5tYWluLmNvbmZpZy5oaWdobGlnaHRlZCkgfVxuICAgICAgcHJldi5jbGFzc0xpc3QuYWRkKHRoaXMubWFpbi5jb25maWcuaGlnaGxpZ2h0ZWQpXG4gICAgICBlbnN1cmVFbGVtZW50SW5WaWV3KHRoaXMubGlzdCwgcHJldilcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaGlnaGxpZ2h0RG93bigpOiB2b2lkIHtcbiAgICBjb25zdCBoaWdobGlnaHRlZCA9IHRoaXMubGlzdC5xdWVyeVNlbGVjdG9yKCcuJyArIHRoaXMubWFpbi5jb25maWcuaGlnaGxpZ2h0ZWQpIGFzIEhUTUxEaXZFbGVtZW50XG4gICAgbGV0IG5leHQgPSBudWxsXG5cbiAgICBpZiAoaGlnaGxpZ2h0ZWQpIHtcbiAgICAgIG5leHQgPSBoaWdobGlnaHRlZC5uZXh0U2libGluZyBhcyBIVE1MRGl2RWxlbWVudFxuICAgICAgd2hpbGUgKG5leHQgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKG5leHQuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMubWFpbi5jb25maWcuZGlzYWJsZWQpKSB7XG4gICAgICAgICAgbmV4dCA9IG5leHQubmV4dFNpYmxpbmcgYXMgSFRNTERpdkVsZW1lbnRcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dCA9IHRoaXMubGlzdC5xdWVyeVNlbGVjdG9yKCcuJyArIHRoaXMubWFpbi5jb25maWcub3B0aW9uICsgJzpub3QoLicgKyB0aGlzLm1haW4uY29uZmlnLmRpc2FibGVkICsgJyknKSBhcyBIVE1MRGl2RWxlbWVudFxuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHBhcmVudCBpcyBvcHRncm91cFxuICAgIGlmIChuZXh0ID09PSBudWxsICYmIGhpZ2hsaWdodGVkICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSBoaWdobGlnaHRlZC5wYXJlbnROb2RlIGFzIEhUTUxEaXZFbGVtZW50XG4gICAgICBpZiAocGFyZW50LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLm1haW4uY29uZmlnLm9wdGdyb3VwKSkge1xuICAgICAgICBpZiAocGFyZW50Lm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgY29uc3Qgc2libGluZyA9IHBhcmVudC5uZXh0U2libGluZyBhcyBIVE1MRGl2RWxlbWVudFxuICAgICAgICAgIG5leHQgPSBzaWJsaW5nLnF1ZXJ5U2VsZWN0b3IoJy4nICsgdGhpcy5tYWluLmNvbmZpZy5vcHRpb24gKyAnOm5vdCguJyArIHRoaXMubWFpbi5jb25maWcuZGlzYWJsZWQgKyAnKScpIGFzIEhUTUxEaXZFbGVtZW50XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiBwcmV2aW91cyBlbGVtZW50IGV4aXN0cyBoaWdobGlnaHQgaXRcbiAgICBpZiAobmV4dCkge1xuICAgICAgaWYgKGhpZ2hsaWdodGVkKSB7IGhpZ2hsaWdodGVkLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5tYWluLmNvbmZpZy5oaWdobGlnaHRlZCkgfVxuICAgICAgbmV4dC5jbGFzc0xpc3QuYWRkKHRoaXMubWFpbi5jb25maWcuaGlnaGxpZ2h0ZWQpXG4gICAgICBlbnN1cmVFbGVtZW50SW5WaWV3KHRoaXMubGlzdCwgbmV4dClcbiAgICB9XG4gIH1cblxuICAvLyBDcmVhdGUgbWFpbiBjb250YWluZXIgdGhhdCBvcHRpb25zIHdpbGwgcmVzaWRlXG4gIHB1YmxpYyBsaXN0RGl2KCk6IEhUTUxEaXZFbGVtZW50IHtcbiAgICBjb25zdCBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBsaXN0LmNsYXNzTGlzdC5hZGQodGhpcy5tYWluLmNvbmZpZy5saXN0KVxuICAgIGxpc3Quc2V0QXR0cmlidXRlKCdyb2xlJywgJ2xpc3Rib3gnKVxuICAgIC8vIEB0b2RvIExpbmsgdG8/XG4gICAgLy8gbGlzdC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScsICcnKVxuICAgIHJldHVybiBsaXN0XG4gIH1cblxuICAvLyBMb29wIHRocm91Z2ggZGF0YSB8fCBmaWx0ZXJlZCBkYXRhIGFuZCBidWlsZCBvcHRpb25zIGFuZCBhcHBlbmQgdG8gbGlzdCBjb250YWluZXJcbiAgcHVibGljIG9wdGlvbnMoY29udGVudDogc3RyaW5nID0gJycpOiB2b2lkIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5tYWluLmRhdGEuZmlsdGVyZWQgfHwgdGhpcy5tYWluLmRhdGEuZGF0YVxuXG4gICAgLy8gQ2xlYXIgb3V0IGlubmVySHRtbFxuICAgIHRoaXMubGlzdC5pbm5lckhUTUwgPSAnJ1xuXG4gICAgLy8gSWYgY29udGVudCBpcyBiZWluZyBwYXNzZWQganVzdCB1c2UgdGhhdCB0ZXh0XG4gICAgaWYgKGNvbnRlbnQgIT09ICcnKSB7XG4gICAgICBjb25zdCBzZWFyY2hpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgc2VhcmNoaW5nLmNsYXNzTGlzdC5hZGQodGhpcy5tYWluLmNvbmZpZy5vcHRpb24pXG4gICAgICBzZWFyY2hpbmcuY2xhc3NMaXN0LmFkZCh0aGlzLm1haW4uY29uZmlnLmRpc2FibGVkKVxuICAgICAgc2VhcmNoaW5nLmlubmVySFRNTCA9IGNvbnRlbnRcbiAgICAgIHRoaXMubGlzdC5hcHBlbmRDaGlsZChzZWFyY2hpbmcpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBJZiBhamF4IGFuZCBpc1NlYXJjaGluZ1xuICAgIGlmICh0aGlzLm1haW4uY29uZmlnLmlzQWpheCAmJiB0aGlzLm1haW4uY29uZmlnLmlzU2VhcmNoaW5nKSB7XG4gICAgICBjb25zdCBzZWFyY2hpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgc2VhcmNoaW5nLmNsYXNzTGlzdC5hZGQodGhpcy5tYWluLmNvbmZpZy5vcHRpb24pXG4gICAgICBzZWFyY2hpbmcuY2xhc3NMaXN0LmFkZCh0aGlzLm1haW4uY29uZmlnLmRpc2FibGVkKVxuICAgICAgc2VhcmNoaW5nLmlubmVySFRNTCA9IHRoaXMubWFpbi5jb25maWcuc2VhcmNoaW5nVGV4dFxuICAgICAgdGhpcy5saXN0LmFwcGVuZENoaWxkKHNlYXJjaGluZylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIElmIG5vIHJlc3VsdHMgc2hvdyBubyByZXN1bHRzIHRleHRcbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IG5vUmVzdWx0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBub1Jlc3VsdHMuY2xhc3NMaXN0LmFkZCh0aGlzLm1haW4uY29uZmlnLm9wdGlvbilcbiAgICAgIG5vUmVzdWx0cy5jbGFzc0xpc3QuYWRkKHRoaXMubWFpbi5jb25maWcuZGlzYWJsZWQpXG4gICAgICBub1Jlc3VsdHMuaW5uZXJIVE1MID0gdGhpcy5tYWluLmNvbmZpZy5zZWFyY2hUZXh0XG4gICAgICB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQobm9SZXN1bHRzKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gQXBwZW5kIGluZGl2aWR1YWwgb3B0aW9ucyB0byBkaXYgY29udGFpbmVyXG4gICAgZm9yIChjb25zdCBkIG9mIGRhdGEpIHtcbiAgICAgIC8vIENyZWF0ZSBvcHRncm91cFxuICAgICAgaWYgKGQuaGFzT3duUHJvcGVydHkoJ2xhYmVsJykpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGQgYXMgT3B0Z3JvdXBcbiAgICAgICAgY29uc3Qgb3B0Z3JvdXBFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIG9wdGdyb3VwRWwuY2xhc3NMaXN0LmFkZCh0aGlzLm1haW4uY29uZmlnLm9wdGdyb3VwKVxuXG4gICAgICAgIC8vIENyZWF0ZSBsYWJlbFxuICAgICAgICBjb25zdCBvcHRncm91cExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgb3B0Z3JvdXBMYWJlbC5jbGFzc0xpc3QuYWRkKHRoaXMubWFpbi5jb25maWcub3B0Z3JvdXBMYWJlbClcbiAgICAgICAgaWYgKHRoaXMubWFpbi5jb25maWcuc2VsZWN0QnlHcm91cCAmJiB0aGlzLm1haW4uY29uZmlnLmlzTXVsdGlwbGUpIHtcbiAgICAgICAgICBvcHRncm91cExhYmVsLmNsYXNzTGlzdC5hZGQodGhpcy5tYWluLmNvbmZpZy5vcHRncm91cExhYmVsU2VsZWN0YWJsZSlcbiAgICAgICAgfVxuICAgICAgICBvcHRncm91cExhYmVsLmlubmVySFRNTCA9IGl0ZW0ubGFiZWxcbiAgICAgICAgb3B0Z3JvdXBFbC5hcHBlbmRDaGlsZChvcHRncm91cExhYmVsKVxuXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBpdGVtLm9wdGlvbnNcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IG8gb2Ygb3B0aW9ucykge1xuICAgICAgICAgICAgb3B0Z3JvdXBFbC5hcHBlbmRDaGlsZCh0aGlzLm9wdGlvbihvKSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBTZWxlY3RpbmcgYWxsIHZhbHVlcyBieSBjbGlja2luZyB0aGUgZ3JvdXAgbGFiZWxcbiAgICAgICAgICBpZiAodGhpcy5tYWluLmNvbmZpZy5zZWxlY3RCeUdyb3VwICYmIHRoaXMubWFpbi5jb25maWcuaXNNdWx0aXBsZSkge1xuICAgICAgICAgICAgY29uc3QgbWFzdGVyID0gdGhpc1xuICAgICAgICAgICAgb3B0Z3JvdXBMYWJlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZEVsIG9mIG9wdGdyb3VwRWwuY2hpbGRyZW4gYXMgYW55IGFzIEhUTUxEaXZFbGVtZW50W10pIHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRFbC5jbGFzc05hbWUuaW5kZXhPZihtYXN0ZXIubWFpbi5jb25maWcub3B0aW9uKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgIGNoaWxkRWwuY2xpY2soKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saXN0LmFwcGVuZENoaWxkKG9wdGdyb3VwRWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQodGhpcy5vcHRpb24oZCBhcyBPcHRpb24pKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENyZWF0ZSBzaW5nbGUgb3B0aW9uXG4gIHB1YmxpYyBvcHRpb24oZGF0YTogT3B0aW9uKTogSFRNTERpdkVsZW1lbnQge1xuICAgIC8vIEFkZCBoaWRkZW4gcGxhY2Vob2xkZXJcbiAgICBpZiAoZGF0YS5wbGFjZWhvbGRlcikge1xuICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgcGxhY2Vob2xkZXIuY2xhc3NMaXN0LmFkZCh0aGlzLm1haW4uY29uZmlnLm9wdGlvbilcbiAgICAgIHBsYWNlaG9sZGVyLmNsYXNzTGlzdC5hZGQodGhpcy5tYWluLmNvbmZpZy5oaWRlKVxuICAgICAgcmV0dXJuIHBsYWNlaG9sZGVyXG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9uRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgLy8gQWRkIGNsYXNzIHRvIGRpdiBlbGVtZW50XG4gICAgb3B0aW9uRWwuY2xhc3NMaXN0LmFkZCh0aGlzLm1haW4uY29uZmlnLm9wdGlvbilcbiAgICAvLyBBZGQgV0NBRyBhdHRyaWJ1dGVcbiAgICBvcHRpb25FbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnb3B0aW9uJylcbiAgICBpZiAoZGF0YS5jbGFzcykge1xuICAgICAgZGF0YS5jbGFzcy5zcGxpdCgnICcpLmZvckVhY2goKGRhdGFDbGFzczogc3RyaW5nKSA9PiB7XG4gICAgICAgIG9wdGlvbkVsLmNsYXNzTGlzdC5hZGQoZGF0YUNsYXNzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBBZGQgc3R5bGUgdG8gZGl2IGVsZW1lbnRcbiAgICBpZiAoZGF0YS5zdHlsZSkge1xuICAgICAgb3B0aW9uRWwuc3R5bGUuY3NzVGV4dCA9IGRhdGEuc3R5bGVcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMubWFpbi5kYXRhLmdldFNlbGVjdGVkKCkgYXMgT3B0aW9uXG5cbiAgICBvcHRpb25FbC5kYXRhc2V0LmlkID0gZGF0YS5pZFxuICAgIGlmICh0aGlzLm1haW4uY29uZmlnLnNlYXJjaEhpZ2hsaWdodCAmJiB0aGlzLm1haW4uc2xpbSAmJiBkYXRhLmlubmVySFRNTCAmJiB0aGlzLm1haW4uc2xpbS5zZWFyY2guaW5wdXQudmFsdWUudHJpbSgpICE9PSAnJykge1xuICAgICAgb3B0aW9uRWwuaW5uZXJIVE1MID0gaGlnaGxpZ2h0KGRhdGEuaW5uZXJIVE1MLCB0aGlzLm1haW4uc2xpbS5zZWFyY2guaW5wdXQudmFsdWUsIHRoaXMubWFpbi5jb25maWcuc2VhcmNoSGlnaGxpZ2h0ZXIpXG4gICAgfSBlbHNlIGlmIChkYXRhLmlubmVySFRNTCkge1xuICAgICAgb3B0aW9uRWwuaW5uZXJIVE1MID0gZGF0YS5pbm5lckhUTUxcbiAgICB9XG4gICAgaWYgKHRoaXMubWFpbi5jb25maWcuc2hvd09wdGlvblRvb2x0aXBzICYmIG9wdGlvbkVsLnRleHRDb250ZW50KSB7XG4gICAgICBvcHRpb25FbC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgb3B0aW9uRWwudGV4dENvbnRlbnQpXG4gICAgfVxuICAgIGNvbnN0IG1hc3RlciA9IHRoaXNcbiAgICBvcHRpb25FbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGU6IE1vdXNlRXZlbnQpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpc1xuICAgICAgY29uc3QgZWxlbWVudElEID0gZWxlbWVudC5kYXRhc2V0LmlkXG5cbiAgICAgIGlmIChkYXRhLnNlbGVjdGVkID09PSB0cnVlICYmIG1hc3Rlci5tYWluLmNvbmZpZy5hbGxvd0Rlc2VsZWN0T3B0aW9uKSB7XG4gICAgICAgIGxldCBzaG91bGRVcGRhdGUgPSBmYWxzZVxuXG4gICAgICAgIC8vIElmIG5vIGJlZm9yZU9uQ2hhbmdlIGlzIHNldCBhdXRvbWF0aWNhbGx5IHVwZGF0ZSBhdCBlbmRcbiAgICAgICAgaWYgKCFtYXN0ZXIubWFpbi5iZWZvcmVPbkNoYW5nZSB8fCAhbWFzdGVyLm1haW4uY29uZmlnLmlzTXVsdGlwbGUpIHtzaG91bGRVcGRhdGUgPSB0cnVlfVxuXG4gICAgICAgIGlmIChtYXN0ZXIubWFpbi5iZWZvcmVPbkNoYW5nZSAmJiBtYXN0ZXIubWFpbi5jb25maWcuaXNNdWx0aXBsZSkge1xuICAgICAgICAgIGNvbnN0IHNlbGVjdGVkVmFsdWVzID0gbWFzdGVyLm1haW4uZGF0YS5nZXRTZWxlY3RlZCgpIGFzIE9wdGlvblxuICAgICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHNlbGVjdGVkVmFsdWVzKSlcblxuICAgICAgICAgIC8vIFJlbW92ZSBmcm9tIGN1cnJlbnQgc2VsZWN0aW9uXG5cbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRWYWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50VmFsdWVzW2ldLmlkID09PSBlbGVtZW50SUQpIHtcbiAgICAgICAgICAgICAgY3VycmVudFZhbHVlcy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBiZWZvcmVPbmNoYW5nZSA9IG1hc3Rlci5tYWluLmJlZm9yZU9uQ2hhbmdlKGN1cnJlbnRWYWx1ZXMpXG4gICAgICAgICAgaWYgKGJlZm9yZU9uY2hhbmdlICE9PSBmYWxzZSkgeyBzaG91bGRVcGRhdGUgPSB0cnVlIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG91bGRVcGRhdGUpIHtcbiAgICAgICAgICBpZiAobWFzdGVyLm1haW4uY29uZmlnLmlzTXVsdGlwbGUpIHtcbiAgICAgICAgICAgIG1hc3Rlci5tYWluLmRhdGEucmVtb3ZlRnJvbVNlbGVjdGVkKChlbGVtZW50SUQgYXMgYW55KSwgJ2lkJylcbiAgICAgICAgICAgIG1hc3Rlci5tYWluLnJlbmRlcigpXG4gICAgICAgICAgICBtYXN0ZXIubWFpbi5zZWxlY3Quc2V0VmFsdWUoKVxuICAgICAgICAgICAgbWFzdGVyLm1haW4uZGF0YS5vbkRhdGFDaGFuZ2UoKSAvLyBUcmlnZ2VyIG9uIGNoYW5nZSBjYWxsYmFja1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXN0ZXIubWFpbi5zZXQoJycpXG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENoZWNrIGlmIG9wdGlvbiBpcyBkaXNhYmxlZCBvciBpcyBhbHJlYWR5IHNlbGVjdGVkLCBkbyBub3RoaW5nXG4gICAgICAgIGlmIChkYXRhLmRpc2FibGVkIHx8IGRhdGEuc2VsZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGlmIGhpdCBsaW1pdFxuICAgICAgICBpZiAobWFzdGVyLm1haW4uY29uZmlnLmxpbWl0ICYmIEFycmF5LmlzQXJyYXkoc2VsZWN0ZWQpICYmIG1hc3Rlci5tYWluLmNvbmZpZy5saW1pdCA8PSBzZWxlY3RlZC5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXN0ZXIubWFpbi5iZWZvcmVPbkNoYW5nZSkge1xuICAgICAgICAgIGxldCB2YWx1ZVxuICAgICAgICAgIGNvbnN0IG9iamVjdEluZm8gPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG1hc3Rlci5tYWluLmRhdGEuZ2V0T2JqZWN0RnJvbURhdGEoZWxlbWVudElEIGFzIHN0cmluZykpKVxuICAgICAgICAgIG9iamVjdEluZm8uc2VsZWN0ZWQgPSB0cnVlXG5cbiAgICAgICAgICBpZiAobWFzdGVyLm1haW4uY29uZmlnLmlzTXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzZWxlY3RlZCkpXG4gICAgICAgICAgICB2YWx1ZS5wdXNoKG9iamVjdEluZm8pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmplY3RJbmZvKSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBiZWZvcmVPbmNoYW5nZSA9IG1hc3Rlci5tYWluLmJlZm9yZU9uQ2hhbmdlKHZhbHVlKVxuICAgICAgICAgIGlmIChiZWZvcmVPbmNoYW5nZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG1hc3Rlci5tYWluLnNldCgoZWxlbWVudElEIGFzIHN0cmluZyksICdpZCcsIG1hc3Rlci5tYWluLmNvbmZpZy5jbG9zZU9uU2VsZWN0KVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXN0ZXIubWFpbi5zZXQoKGVsZW1lbnRJRCBhcyBzdHJpbmcpLCAnaWQnLCBtYXN0ZXIubWFpbi5jb25maWcuY2xvc2VPblNlbGVjdClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zdCBpc1NlbGVjdGVkID0gc2VsZWN0ZWQgJiYgaXNWYWx1ZUluQXJyYXlPZk9iamVjdHMoc2VsZWN0ZWQsICdpZCcsIChkYXRhLmlkIGFzIHN0cmluZykpXG4gICAgaWYgKGRhdGEuZGlzYWJsZWQgfHwgaXNTZWxlY3RlZCkge1xuICAgICAgb3B0aW9uRWwub25jbGljayA9IG51bGxcbiAgICAgIGlmICghbWFzdGVyLm1haW4uY29uZmlnLmFsbG93RGVzZWxlY3RPcHRpb24pIHtcbiAgICAgICAgb3B0aW9uRWwuY2xhc3NMaXN0LmFkZCh0aGlzLm1haW4uY29uZmlnLmRpc2FibGVkKVxuICAgICAgfVxuICAgICAgaWYgKG1hc3Rlci5tYWluLmNvbmZpZy5oaWRlU2VsZWN0ZWRPcHRpb24pIHtcbiAgICAgICAgb3B0aW9uRWwuY2xhc3NMaXN0LmFkZCh0aGlzLm1haW4uY29uZmlnLmhpZGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcbiAgICAgIG9wdGlvbkVsLmNsYXNzTGlzdC5hZGQodGhpcy5tYWluLmNvbmZpZy5vcHRpb25TZWxlY3RlZClcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uRWwuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLm1haW4uY29uZmlnLm9wdGlvblNlbGVjdGVkKVxuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25FbFxuICB9XG59XG4iLCJpbXBvcnQgeyBDb25maWcgfSBmcm9tICcuL2NvbmZpZydcbmltcG9ydCB7IFNlbGVjdCB9IGZyb20gJy4vc2VsZWN0J1xuaW1wb3J0IHsgU2xpbSB9IGZyb20gJy4vc2xpbSdcbmltcG9ydCB7IERhdGEsIGRhdGFBcnJheSwgT3B0aW9uLCB2YWxpZGF0ZURhdGEgfSBmcm9tICcuL2RhdGEnXG5pbXBvcnQgeyBoYXNDbGFzc0luVHJlZSwgcHV0Q29udGVudCwgZGVib3VuY2UsIGVuc3VyZUVsZW1lbnRJblZpZXcgfSBmcm9tICcuL2hlbHBlcidcblxuaW1wb3J0IFwiLi4vc3R5bGVzL3RoaW4tc2VsZWN0LnNjc3NcIlxuXG5pbnRlcmZhY2UgQ29uc3RydWN0b3Ige1xuICBzZWxlY3Q6IHN0cmluZyB8IEVsZW1lbnRcbiAgZGF0YT86IGRhdGFBcnJheVxuICBzaG93U2VhcmNoPzogYm9vbGVhblxuICBzZWFyY2hQbGFjZWhvbGRlcj86IHN0cmluZ1xuICBzZWFyY2hUZXh0Pzogc3RyaW5nXG4gIHNlYXJjaGluZ1RleHQ/OiBzdHJpbmdcbiAgc2VhcmNoRm9jdXM/OiBib29sZWFuXG4gIHNlYXJjaEhpZ2hsaWdodD86IGJvb2xlYW5cbiAgc2VhcmNoRmlsdGVyPzogKG9wdDogT3B0aW9uLCBzZWFyY2g6IHN0cmluZykgPT4gYm9vbGVhblxuICBjbG9zZU9uU2VsZWN0PzogYm9vbGVhblxuICBzaG93Q29udGVudD86IHN0cmluZ1xuICBwbGFjZWhvbGRlcj86IHN0cmluZ1xuICBhbGxvd0Rlc2VsZWN0PzogYm9vbGVhblxuICBhbGxvd0Rlc2VsZWN0T3B0aW9uPzogYm9vbGVhblxuICBoaWRlU2VsZWN0ZWRPcHRpb24/OiBib29sZWFuXG4gIGRlc2VsZWN0TGFiZWw/OiBzdHJpbmdcbiAgaXNFbmFibGVkPzogYm9vbGVhblxuICB2YWx1ZXNVc2VUZXh0PzogYm9vbGVhbiAvLyBVc2UgdGV4dCB2YWx1ZSB3aGVuIHNob3dpbmcgc2VsZWN0ZWQgdmFsdWVcbiAgc2hvd09wdGlvblRvb2x0aXBzPzogYm9vbGVhblxuICBzZWxlY3RCeUdyb3VwPzogYm9vbGVhblxuICBsaW1pdD86IG51bWJlclxuICB0aW1lb3V0RGVsYXk/OiBudW1iZXJcbiAgYWRkVG9Cb2R5PzogYm9vbGVhblxuICBcbiAgLy8gRXZlbnRzXG4gIGFqYXg/OiAodmFsdWU6IHN0cmluZywgZnVuYzogKGluZm86IGFueSkgPT4gdm9pZCkgPT4gdm9pZFxuICBhZGRhYmxlPzogKHZhbHVlOiBzdHJpbmcpID0+IE9wdGlvbiB8IHN0cmluZ1xuICBiZWZvcmVPbkNoYW5nZT86IChpbmZvOiBPcHRpb24gfCBPcHRpb25bXSkgPT4gdm9pZCB8IGJvb2xlYW5cbiAgb25DaGFuZ2U/OiAoaW5mbzogT3B0aW9uIHwgT3B0aW9uW10pID0+IHZvaWRcbiAgYmVmb3JlT3Blbj86ICgpID0+IHZvaWRcbiAgYWZ0ZXJPcGVuPzogKCkgPT4gdm9pZFxuICBiZWZvcmVDbG9zZT86ICgpID0+IHZvaWRcbiAgYWZ0ZXJDbG9zZT86ICgpID0+IHZvaWRcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGhpblNlbGVjdCB7XG4gIHB1YmxpYyBjb25maWc6IENvbmZpZ1xuICBwdWJsaWMgc2VsZWN0OiBTZWxlY3RcbiAgcHVibGljIGRhdGE6IERhdGFcbiAgcHVibGljIHNsaW06IFNsaW1cbiAgcHVibGljIGFqYXg6ICgodmFsdWU6IHN0cmluZywgZnVuYzogKGluZm86IGFueSkgPT4gdm9pZCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxuICBwdWJsaWMgYWRkYWJsZTogKCh2YWx1ZTogc3RyaW5nKSA9PiBPcHRpb24gfCBzdHJpbmcpIHwgbnVsbCA9IG51bGxcbiAgcHVibGljIGJlZm9yZU9uQ2hhbmdlOiAoKGluZm86IE9wdGlvbikgPT4gdm9pZCB8IGJvb2xlYW4pIHwgbnVsbCA9IG51bGxcbiAgcHVibGljIG9uQ2hhbmdlOiAoKGluZm86IE9wdGlvbikgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxuICBwdWJsaWMgYmVmb3JlT3BlbjogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGxcbiAgcHVibGljIGFmdGVyT3BlbjogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGxcbiAgcHVibGljIGJlZm9yZUNsb3NlOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxuICBwdWJsaWMgYWZ0ZXJDbG9zZTogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGxcbiAgXG4gIHByaXZhdGUgd2luZG93U2Nyb2xsOiAoZTogRXZlbnQpID0+IHZvaWQgPSBkZWJvdW5jZSgoZTogRXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5kYXRhLmNvbnRlbnRPcGVuKSB7XG4gICAgICBpZiAocHV0Q29udGVudCh0aGlzLnNsaW0uY29udGVudCwgdGhpcy5kYXRhLmNvbnRlbnRQb3NpdGlvbiwgdGhpcy5kYXRhLmNvbnRlbnRPcGVuKSA9PT0gJ2Fib3ZlJykge1xuICAgICAgICB0aGlzLm1vdmVDb250ZW50QWJvdmUoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tb3ZlQ29udGVudEJlbG93KClcbiAgICAgIH1cbiAgICB9XG4gIH0pXG4gIFxuICBjb25zdHJ1Y3RvcihpbmZvOiBDb25zdHJ1Y3Rvcikge1xuICAgIGNvbnN0IHNlbGVjdEVsZW1lbnQgPSB0aGlzLnZhbGlkYXRlKGluZm8pXG4gICAgXG4gICAgLy8gSWYgc2VsZWN0IGFscmVhZHkgaGFzIGEgc2xpbSBzZWxlY3QgaWQgb24gaXQgbGV0cyBkZXN0cm95IGl0IGZpcnN0XG4gICAgaWYgKHNlbGVjdEVsZW1lbnQuZGF0YXNldC5zc2lkKSB7IHRoaXMuZGVzdHJveShzZWxlY3RFbGVtZW50LmRhdGFzZXQuc3NpZCkgfVxuICAgIFxuICAgIC8vIFNldCBhamF4IGZ1bmN0aW9uIGlmIHBhc3NlZCBpblxuICAgIGlmIChpbmZvLmFqYXgpIHsgdGhpcy5hamF4ID0gaW5mby5hamF4IH1cbiAgICBcbiAgICAvLyBBZGQgYWRkYWJsZSBpZiBvcHRpb24gaXMgcGFzc2VkIGluXG4gICAgaWYgKGluZm8uYWRkYWJsZSkgeyB0aGlzLmFkZGFibGUgPSBpbmZvLmFkZGFibGUgfVxuICAgIFxuICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZyh7XG4gICAgICBzZWxlY3Q6IHNlbGVjdEVsZW1lbnQsXG4gICAgICBpc0FqYXg6IChpbmZvLmFqYXggPyB0cnVlIDogZmFsc2UpLFxuICAgICAgc2hvd1NlYXJjaDogaW5mby5zaG93U2VhcmNoLFxuICAgICAgc2VhcmNoUGxhY2Vob2xkZXI6IGluZm8uc2VhcmNoUGxhY2Vob2xkZXIsXG4gICAgICBzZWFyY2hUZXh0OiBpbmZvLnNlYXJjaFRleHQsXG4gICAgICBzZWFyY2hpbmdUZXh0OiBpbmZvLnNlYXJjaGluZ1RleHQsXG4gICAgICBzZWFyY2hGb2N1czogaW5mby5zZWFyY2hGb2N1cyxcbiAgICAgIHNlYXJjaEhpZ2hsaWdodDogaW5mby5zZWFyY2hIaWdobGlnaHQsXG4gICAgICBzZWFyY2hGaWx0ZXI6IGluZm8uc2VhcmNoRmlsdGVyLFxuICAgICAgY2xvc2VPblNlbGVjdDogaW5mby5jbG9zZU9uU2VsZWN0LFxuICAgICAgc2hvd0NvbnRlbnQ6IGluZm8uc2hvd0NvbnRlbnQsXG4gICAgICBwbGFjZWhvbGRlclRleHQ6IGluZm8ucGxhY2Vob2xkZXIsXG4gICAgICBhbGxvd0Rlc2VsZWN0OiBpbmZvLmFsbG93RGVzZWxlY3QsXG4gICAgICBhbGxvd0Rlc2VsZWN0T3B0aW9uOiBpbmZvLmFsbG93RGVzZWxlY3RPcHRpb24sXG4gICAgICBoaWRlU2VsZWN0ZWRPcHRpb246IGluZm8uaGlkZVNlbGVjdGVkT3B0aW9uLFxuICAgICAgZGVzZWxlY3RMYWJlbDogaW5mby5kZXNlbGVjdExhYmVsLFxuICAgICAgaXNFbmFibGVkOiBpbmZvLmlzRW5hYmxlZCxcbiAgICAgIHZhbHVlc1VzZVRleHQ6IGluZm8udmFsdWVzVXNlVGV4dCxcbiAgICAgIHNob3dPcHRpb25Ub29sdGlwczogaW5mby5zaG93T3B0aW9uVG9vbHRpcHMsXG4gICAgICBzZWxlY3RCeUdyb3VwOiBpbmZvLnNlbGVjdEJ5R3JvdXAsXG4gICAgICBsaW1pdDogaW5mby5saW1pdCxcbiAgICAgIHRpbWVvdXREZWxheTogaW5mby50aW1lb3V0RGVsYXksXG4gICAgICBhZGRUb0JvZHk6IGluZm8uYWRkVG9Cb2R5XG4gICAgfSlcbiAgICBcbiAgICB0aGlzLnNlbGVjdCA9IG5ldyBTZWxlY3Qoe1xuICAgICAgc2VsZWN0OiBzZWxlY3RFbGVtZW50LFxuICAgICAgbWFpbjogdGhpc1xuICAgIH0pXG4gICAgXG4gICAgdGhpcy5kYXRhID0gbmV3IERhdGEoeyBtYWluOiB0aGlzIH0pXG4gICAgdGhpcy5zbGltID0gbmV3IFNsaW0oeyBtYWluOiB0aGlzIH0pXG4gICAgXG4gICAgLy8gQWRkIGFmdGVyIG9yaWdpbmFsIHNlbGVjdCBlbGVtZW50XG4gICAgaWYgKHRoaXMuc2VsZWN0LmVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgdGhpcy5zZWxlY3QuZWxlbWVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLnNsaW0uY29udGFpbmVyLCB0aGlzLnNlbGVjdC5lbGVtZW50Lm5leHRTaWJsaW5nKVxuICAgIH1cbiAgICBcbiAgICAvLyBJZiBkYXRhIGlzIHBhc3NlZCBpbiBsZXRzIHNldCBpdFxuICAgIC8vIGFuZCB0aHVzIHdpbGwgc3RhcnQgdGhlIHJlbmRlclxuICAgIGlmIChpbmZvLmRhdGEpIHtcbiAgICAgIHRoaXMuc2V0RGF0YShpbmZvLmRhdGEpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERvIGFuIGluaXRpYWwgcmVuZGVyIG9uIHN0YXJ0dXBcbiAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9XG4gICAgXG4gICAgLy8gQWRkIG9uY2xpY2sgbGlzdGVuZXIgdG8gZG9jdW1lbnQgdG8gY2xvc2VDb250ZW50IGlmIGNsaWNrZWQgb3V0c2lkZVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5kb2N1bWVudENsaWNrKVxuICAgIFxuICAgIC8vIElmIHRoZSB1c2VyIHdhbnRzIHRvIHNob3cgdGhlIGNvbnRlbnQgZm9yY2libHkgb24gYSBzcGVjaWZpYyBzaWRlLFxuICAgIC8vIHRoZXJlIGlzIG5vIG5lZWQgdG8gbGlzdGVuIGZvciBzY3JvbGwgZXZlbnRzXG4gICAgaWYgKHRoaXMuY29uZmlnLnNob3dDb250ZW50ID09PSAnYXV0bycpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLndpbmRvd1Njcm9sbCwgZmFsc2UpXG4gICAgfVxuICAgIFxuICAgIC8vIEFkZCBldmVudCBjYWxsYmFja3MgYWZ0ZXIgZXZlcnRoaW5nIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICBpZiAoaW5mby5iZWZvcmVPbkNoYW5nZSkgeyB0aGlzLmJlZm9yZU9uQ2hhbmdlID0gaW5mby5iZWZvcmVPbkNoYW5nZSB9XG4gICAgaWYgKGluZm8ub25DaGFuZ2UpIHsgdGhpcy5vbkNoYW5nZSA9IGluZm8ub25DaGFuZ2UgfVxuICAgIGlmIChpbmZvLmJlZm9yZU9wZW4pIHsgdGhpcy5iZWZvcmVPcGVuID0gaW5mby5iZWZvcmVPcGVuIH1cbiAgICBpZiAoaW5mby5hZnRlck9wZW4pIHsgdGhpcy5hZnRlck9wZW4gPSBpbmZvLmFmdGVyT3BlbiB9XG4gICAgaWYgKGluZm8uYmVmb3JlQ2xvc2UpIHsgdGhpcy5iZWZvcmVDbG9zZSA9IGluZm8uYmVmb3JlQ2xvc2UgfVxuICAgIGlmIChpbmZvLmFmdGVyQ2xvc2UpIHsgdGhpcy5hZnRlckNsb3NlID0gaW5mby5hZnRlckNsb3NlIH1cbiAgICBcbiAgICAvLyBJZiBkaXNhYmxlZCBsZXRzIGNhbGwgaXRcbiAgICBpZiAoIXRoaXMuY29uZmlnLmlzRW5hYmxlZCkgeyB0aGlzLmRpc2FibGUoKSB9XG4gIH1cbiAgXG4gIHB1YmxpYyB2YWxpZGF0ZShpbmZvOiBDb25zdHJ1Y3Rvcikge1xuICAgIGNvbnN0IHNlbGVjdCA9ICh0eXBlb2YgaW5mby5zZWxlY3QgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpbmZvLnNlbGVjdCkgOiBpbmZvLnNlbGVjdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnRcbiAgICBpZiAoIXNlbGVjdCkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIHNlbGVjdCBlbGVtZW50JykgfVxuICAgIGlmIChzZWxlY3QudGFnTmFtZSAhPT0gJ1NFTEVDVCcpIHsgdGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGlzbnQgb2YgdHlwZSBzZWxlY3QnKSB9XG4gICAgcmV0dXJuIHNlbGVjdFxuICB9XG4gIFxuICBwdWJsaWMgc2VsZWN0ZWQoKTogc3RyaW5nIHwgc3RyaW5nW10ge1xuICAgIGlmICh0aGlzLmNvbmZpZy5pc011bHRpcGxlKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuZGF0YS5nZXRTZWxlY3RlZCgpIGFzIE9wdGlvbltdXG4gICAgICBjb25zdCBvdXRwdXRTZWxlY3RlZDogc3RyaW5nW10gPSBbXVxuICAgICAgZm9yIChjb25zdCBzIG9mIHNlbGVjdGVkKSB7XG4gICAgICAgIG91dHB1dFNlbGVjdGVkLnB1c2gocy52YWx1ZSBhcyBzdHJpbmcpXG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0U2VsZWN0ZWRcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmRhdGEuZ2V0U2VsZWN0ZWQoKSBhcyBPcHRpb25cbiAgICAgIHJldHVybiAoc2VsZWN0ZWQgPyBzZWxlY3RlZC52YWx1ZSBhcyBzdHJpbmcgOiAnJylcbiAgICB9XG4gIH1cbiAgXG4gIC8vIFNldHMgdmFsdWUgb2YgdGhlIHNlbGVjdCwgYWRkcyBpdCB0byBkYXRhIGFuZCBvcmlnaW5hbCBzZWxlY3RcbiAgcHVibGljIHNldCh2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10sIHR5cGU6IHN0cmluZyA9ICd2YWx1ZScsIGNsb3NlOiBib29sZWFuID0gdHJ1ZSwgcmVuZGVyOiBib29sZWFuID0gdHJ1ZSkge1xuICAgIGlmICh0aGlzLmNvbmZpZy5pc011bHRpcGxlICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhpcy5kYXRhLmFkZFRvU2VsZWN0ZWQodmFsdWUsIHR5cGUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YS5zZXRTZWxlY3RlZCh2YWx1ZSwgdHlwZSlcbiAgICB9XG4gICAgdGhpcy5zZWxlY3Quc2V0VmFsdWUoKVxuICAgIHRoaXMuZGF0YS5vbkRhdGFDaGFuZ2UoKSAvLyBUcmlnZ2VyIG9uIGNoYW5nZSBjYWxsYmFja1xuICAgIHRoaXMucmVuZGVyKClcbiAgICBcbiAgICAvLyBDbG9zZSB3aGVuIGFsbCBvcHRpb25zIGFyZSBzZWxlY3RlZCBhbmQgaGlkZGVuXG4gICAgaWYgKHRoaXMuY29uZmlnLmhpZGVTZWxlY3RlZE9wdGlvbiAmJiB0aGlzLmNvbmZpZy5pc011bHRpcGxlICYmICh0aGlzLmRhdGEuZ2V0U2VsZWN0ZWQoKSBhcyBPcHRpb25bXSkubGVuZ3RoID09PSB0aGlzLmRhdGEuZGF0YS5sZW5ndGgpIHtcbiAgICAgIGNsb3NlID0gdHJ1ZVxuICAgIH1cbiAgICBcbiAgICBpZiAoY2xvc2UpIHsgdGhpcy5jbG9zZSgpIH1cbiAgfVxuICBcbiAgLy8gc2V0U2VsZWN0ZWQgaXMganVzdCBtYXBwZWQgdG8gdGhlIHNldCBtZXRob2RcbiAgcHVibGljIHNldFNlbGVjdGVkKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSwgdHlwZTogc3RyaW5nID0gJ3ZhbHVlJywgY2xvc2U6IGJvb2xlYW4gPSB0cnVlLCByZW5kZXI6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgdGhpcy5zZXQodmFsdWUsIHR5cGUsIGNsb3NlLCByZW5kZXIpXG4gIH1cbiAgXG4gIHB1YmxpYyBzZXREYXRhKGRhdGE6IGRhdGFBcnJheSkge1xuICAgIC8vIFZhbGlkYXRlIGRhdGEgaWYgcGFzc2VkIGluXG4gICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRlRGF0YShkYXRhKVxuICAgIGlmICghaXNWYWxpZCkgeyBjb25zb2xlLmVycm9yKCdWYWxpZGF0aW9uIHByb2JsZW0gb246ICMnICsgdGhpcy5zZWxlY3QuZWxlbWVudC5pZCk7IHJldHVybiB9IC8vIElmIGRhdGEgcGFzc2VkIGluIGlzIG5vdCB2YWxpZCBETyBOT1QgcGFyc2UsIHNldCBhbmQgcmVuZGVyXG4gICAgXG4gICAgY29uc3QgbmV3RGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmRhdGEuZ2V0U2VsZWN0ZWQoKVxuICAgIFxuICAgIC8vIENoZWNrIG5ld0RhdGEgdG8gbWFrZSBzdXJlIHZhbHVlIGlzIHNldFxuICAgIC8vIElmIG5vdCBzZXQgZnJvbSB0ZXh0XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIW5ld0RhdGFbaV0udmFsdWUgJiYgIW5ld0RhdGFbaV0ucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgbmV3RGF0YVtpXS52YWx1ZSA9IG5ld0RhdGFbaV0udGV4dFxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBJZiBpdHMgYW4gYWpheCB0eXBlIGtlZXAgc2VsZWN0ZWQgdmFsdWVzXG4gICAgaWYgKHRoaXMuY29uZmlnLmlzQWpheCAmJiBzZWxlY3RlZCkge1xuICAgICAgaWYgKHRoaXMuY29uZmlnLmlzTXVsdGlwbGUpIHtcbiAgICAgICAgY29uc3QgcmV2ZXJzZVNlbGVjdGVkID0gKHNlbGVjdGVkIGFzIE9wdGlvbltdKS5yZXZlcnNlKClcbiAgICAgICAgZm9yIChjb25zdCByIG9mIHJldmVyc2VTZWxlY3RlZCkge1xuICAgICAgICAgIG5ld0RhdGEudW5zaGlmdChyKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdEYXRhLnVuc2hpZnQoc2VsZWN0ZWQpXG4gICAgICAgIFxuICAgICAgICAvLyBMb29rIGZvciBkdXBsaWNhdGUgc2VsZWN0ZWQgaWYgc28gcmVtb3ZlIGl0XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICghbmV3RGF0YVtpXS5wbGFjZWhvbGRlciAmJiBuZXdEYXRhW2ldLnZhbHVlID09PSAoc2VsZWN0ZWQgYXMgT3B0aW9uKS52YWx1ZSAmJiBuZXdEYXRhW2ldLnRleHQgPT09IChzZWxlY3RlZCBhcyBPcHRpb24pLnRleHQpIHtcbiAgICAgICAgICAgIG5ld0RhdGEuc3BsaWNlKGksIDEpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBBZGQgcGxhY2Vob2xkZXIgaWYgaXQgZG9lc250IGFscmVhZHkgaGF2ZSBvbmVcbiAgICAgICAgbGV0IGhhc1BsYWNlaG9sZGVyID0gZmFsc2VcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKG5ld0RhdGFbaV0ucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgIGhhc1BsYWNlaG9sZGVyID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhhc1BsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgbmV3RGF0YS51bnNoaWZ0KHsgdGV4dDogJycsIHBsYWNlaG9sZGVyOiB0cnVlIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdGhpcy5zZWxlY3QuY3JlYXRlKG5ld0RhdGEpXG4gICAgdGhpcy5kYXRhLnBhcnNlU2VsZWN0RGF0YSgpXG4gICAgdGhpcy5kYXRhLnNldFNlbGVjdGVkRnJvbVNlbGVjdCgpXG4gIH1cbiAgXG4gIC8vIGFkZERhdGEgd2lsbCBhcHBlbmQgdG8gdGhlIGN1cnJlbnQgZGF0YSBzZXRcbiAgcHVibGljIGFkZERhdGEoZGF0YTogT3B0aW9uKSB7XG4gICAgLy8gVmFsaWRhdGUgZGF0YSBpZiBwYXNzZWQgaW5cbiAgICBjb25zdCBpc1ZhbGlkID0gdmFsaWRhdGVEYXRhKFtkYXRhXSlcbiAgICBpZiAoIWlzVmFsaWQpIHsgY29uc29sZS5lcnJvcignVmFsaWRhdGlvbiBwcm9ibGVtIG9uOiAjJyArIHRoaXMuc2VsZWN0LmVsZW1lbnQuaWQpOyByZXR1cm4gfSAvLyBJZiBkYXRhIHBhc3NlZCBpbiBpcyBub3QgdmFsaWQgRE8gTk9UIHBhcnNlLCBzZXQgYW5kIHJlbmRlclxuICAgIFxuICAgIHRoaXMuZGF0YS5hZGQodGhpcy5kYXRhLm5ld09wdGlvbihkYXRhKSlcbiAgICB0aGlzLnNlbGVjdC5jcmVhdGUodGhpcy5kYXRhLmRhdGEpXG4gICAgdGhpcy5kYXRhLnBhcnNlU2VsZWN0RGF0YSgpXG4gICAgdGhpcy5kYXRhLnNldFNlbGVjdGVkRnJvbVNlbGVjdCgpXG4gICAgdGhpcy5yZW5kZXIoKVxuICB9XG4gIFxuICAvLyBPcGVuIGNvbnRlbnQgc2VjdGlvblxuICBwdWJsaWMgb3BlbigpOiB2b2lkIHtcbiAgICAvLyBEb250IG9wZW4gaWYgZGlzYWJsZWRcbiAgICBpZiAoIXRoaXMuY29uZmlnLmlzRW5hYmxlZCkgeyByZXR1cm4gfVxuICAgIFxuICAgIC8vIERvbnQgZG8gYW55dGhpbmcgaWYgdGhlIGNvbnRlbnQgaXMgYWxyZWFkeSBvcGVuXG4gICAgaWYgKHRoaXMuZGF0YS5jb250ZW50T3BlbikgeyByZXR1cm4gfVxuICAgIFxuICAgIC8vIERvbnQgb3BlbiB3aGVuIGFsbCBvcHRpb25zIGFyZSBzZWxlY3RlZCBhbmQgaGlkZGVuXG4gICAgaWYgKHRoaXMuY29uZmlnLmhpZGVTZWxlY3RlZE9wdGlvbiAmJiB0aGlzLmNvbmZpZy5pc011bHRpcGxlICYmICh0aGlzLmRhdGEuZ2V0U2VsZWN0ZWQoKSBhcyBPcHRpb25bXSkubGVuZ3RoID09PSB0aGlzLmRhdGEuZGF0YS5sZW5ndGgpIHsgcmV0dXJuIH1cbiAgICBcbiAgICAvLyBSdW4gYmVmb3JlT3BlbiBjYWxsYmFja1xuICAgIGlmICh0aGlzLmJlZm9yZU9wZW4pIHsgdGhpcy5iZWZvcmVPcGVuKCkgfVxuICAgIFxuICAgIGlmICh0aGlzLmNvbmZpZy5pc011bHRpcGxlICYmIHRoaXMuc2xpbS5tdWx0aVNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNsaW0ubXVsdGlTZWxlY3RlZC5wbHVzLmNsYXNzTGlzdC5hZGQoJ3NzLWNyb3NzJylcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2xpbS5zaW5nbGVTZWxlY3RlZCkge1xuICAgICAgdGhpcy5zbGltLnNpbmdsZVNlbGVjdGVkLmFycm93SWNvbi5hcnJvdy5jbGFzc0xpc3QucmVtb3ZlKCdhcnJvdy1kb3duJylcbiAgICAgIHRoaXMuc2xpbS5zaW5nbGVTZWxlY3RlZC5hcnJvd0ljb24uYXJyb3cuY2xhc3NMaXN0LmFkZCgnYXJyb3ctdXAnKVxuICAgIH1cbiAgICAodGhpcy5zbGltIGFzIGFueSlbKHRoaXMuY29uZmlnLmlzTXVsdGlwbGUgPyAnbXVsdGlTZWxlY3RlZCcgOiAnc2luZ2xlU2VsZWN0ZWQnKV0uY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoKHRoaXMuZGF0YS5jb250ZW50UG9zaXRpb24gPT09ICdhYm92ZScgPyB0aGlzLmNvbmZpZy5vcGVuQWJvdmUgOiB0aGlzLmNvbmZpZy5vcGVuQmVsb3cpKVxuICAgIFxuICAgIGlmICh0aGlzLmNvbmZpZy5hZGRUb0JvZHkpIHtcbiAgICAgIC8vIG1vdmUgdGhlIGNvbnRlbnQgaW4gdG8gdGhlIHJpZ2h0IGxvY2F0aW9uXG4gICAgICBjb25zdCBjb250YWluZXJSZWN0ID0gdGhpcy5zbGltLmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgdGhpcy5zbGltLmNvbnRlbnQuc3R5bGUudG9wID0gKGNvbnRhaW5lclJlY3QudG9wICsgY29udGFpbmVyUmVjdC5oZWlnaHQgKyB3aW5kb3cuc2Nyb2xsWSkgKyAncHgnXG4gICAgICB0aGlzLnNsaW0uY29udGVudC5zdHlsZS5sZWZ0ID0gKGNvbnRhaW5lclJlY3QubGVmdCArIHdpbmRvdy5zY3JvbGxYKSArICdweCdcbiAgICAgIHRoaXMuc2xpbS5jb250ZW50LnN0eWxlLndpZHRoID0gY29udGFpbmVyUmVjdC53aWR0aCArICdweCdcbiAgICB9XG4gICAgdGhpcy5zbGltLmNvbnRlbnQuY2xhc3NMaXN0LmFkZCh0aGlzLmNvbmZpZy5vcGVuKVxuICAgIFxuICAgIC8vIENoZWNrIHNob3dDb250ZW50IHRvIHNlZSBpZiB0aGV5IHdhbnQgdG8gc3BlY2lmaWNhbGx5IHNob3cgaW4gYSBjZXJ0YWluIGRpcmVjdGlvblxuICAgIGlmICh0aGlzLmNvbmZpZy5zaG93Q29udGVudC50b0xvd2VyQ2FzZSgpID09PSAndXAnKSB7XG4gICAgICB0aGlzLm1vdmVDb250ZW50QWJvdmUoKVxuICAgIH0gZWxzZSBpZiAodGhpcy5jb25maWcuc2hvd0NvbnRlbnQudG9Mb3dlckNhc2UoKSA9PT0gJ2Rvd24nKSB7XG4gICAgICB0aGlzLm1vdmVDb250ZW50QmVsb3coKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBdXRvIGlkZW50aWZ5IHdoZXJlIHRvIHB1dCBpdFxuICAgICAgaWYgKHB1dENvbnRlbnQodGhpcy5zbGltLmNvbnRlbnQsIHRoaXMuZGF0YS5jb250ZW50UG9zaXRpb24sIHRoaXMuZGF0YS5jb250ZW50T3BlbikgPT09ICdhYm92ZScpIHtcbiAgICAgICAgdGhpcy5tb3ZlQ29udGVudEFib3ZlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubW92ZUNvbnRlbnRCZWxvdygpXG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIE1vdmUgdG8gc2VsZWN0ZWQgb3B0aW9uIGZvciBzaW5nbGUgb3B0aW9uXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5pc011bHRpcGxlKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuZGF0YS5nZXRTZWxlY3RlZCgpIGFzIE9wdGlvblxuICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkSWQgPSBzZWxlY3RlZC5pZFxuICAgICAgICBjb25zdCBzZWxlY3RlZE9wdGlvbiA9IHRoaXMuc2xpbS5saXN0LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWlkPVwiJyArIHNlbGVjdGVkSWQgKyAnXCJdJykgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgaWYgKHNlbGVjdGVkT3B0aW9uKSB7XG4gICAgICAgICAgZW5zdXJlRWxlbWVudEluVmlldyh0aGlzLnNsaW0ubGlzdCwgc2VsZWN0ZWRPcHRpb24pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gc2V0VGltZW91dCBpcyBmb3IgYW5pbWF0aW9uIGNvbXBsZXRpb25cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuZGF0YS5jb250ZW50T3BlbiA9IHRydWVcbiAgICAgIFxuICAgICAgLy8gRm9jdXMgb24gaW5wdXQgZmllbGRcbiAgICAgIGlmICh0aGlzLmNvbmZpZy5zZWFyY2hGb2N1cykge1xuICAgICAgICB0aGlzLnNsaW0uc2VhcmNoLmlucHV0LmZvY3VzKClcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gUnVuIGFmdGVyT3BlbiBjYWxsYmFja1xuICAgICAgaWYgKHRoaXMuYWZ0ZXJPcGVuKSB7XG4gICAgICAgIHRoaXMuYWZ0ZXJPcGVuKClcbiAgICAgIH1cbiAgICB9LCB0aGlzLmNvbmZpZy50aW1lb3V0RGVsYXkpXG4gIH1cbiAgXG4gIC8vIENsb3NlIGNvbnRlbnQgc2VjdGlvblxuICBwdWJsaWMgY2xvc2UoKTogdm9pZCB7XG4gICAgLy8gRG9udCBkbyBhbnl0aGluZyBpZiB0aGUgY29udGVudCBpcyBhbHJlYWR5IGNsb3NlZFxuICAgIGlmICghdGhpcy5kYXRhLmNvbnRlbnRPcGVuKSB7IHJldHVybiB9XG4gICAgXG4gICAgLy8gUnVuIGJlZm9yZUNsb3NlIGNhbGJhY2tcbiAgICBpZiAodGhpcy5iZWZvcmVDbG9zZSkgeyB0aGlzLmJlZm9yZUNsb3NlKCkgfVxuICAgIFxuICAgIC8vIHRoaXMuc2xpbS5zZWFyY2guaW5wdXQuYmx1cigpIC8vIFJlbW92ZWQgZHVlIHRvIHNhZmFyaSBxdWlya1xuICAgIGlmICh0aGlzLmNvbmZpZy5pc011bHRpcGxlICYmIHRoaXMuc2xpbS5tdWx0aVNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNsaW0ubXVsdGlTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNvbmZpZy5vcGVuQWJvdmUpXG4gICAgICB0aGlzLnNsaW0ubXVsdGlTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNvbmZpZy5vcGVuQmVsb3cpXG4gICAgICB0aGlzLnNsaW0ubXVsdGlTZWxlY3RlZC5wbHVzLmNsYXNzTGlzdC5yZW1vdmUoJ3NzLWNyb3NzJylcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2xpbS5zaW5nbGVTZWxlY3RlZCkge1xuICAgICAgdGhpcy5zbGltLnNpbmdsZVNlbGVjdGVkLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY29uZmlnLm9wZW5BYm92ZSlcbiAgICAgIHRoaXMuc2xpbS5zaW5nbGVTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNvbmZpZy5vcGVuQmVsb3cpXG4gICAgICB0aGlzLnNsaW0uc2luZ2xlU2VsZWN0ZWQuYXJyb3dJY29uLmFycm93LmNsYXNzTGlzdC5hZGQoJ2Fycm93LWRvd24nKVxuICAgICAgdGhpcy5zbGltLnNpbmdsZVNlbGVjdGVkLmFycm93SWNvbi5hcnJvdy5jbGFzc0xpc3QucmVtb3ZlKCdhcnJvdy11cCcpXG4gICAgfVxuICAgIHRoaXMuc2xpbS5jb250ZW50LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jb25maWcub3BlbilcbiAgICB0aGlzLmRhdGEuY29udGVudE9wZW4gPSBmYWxzZVxuICAgIFxuICAgIHRoaXMuc2VhcmNoKCcnKSAvLyBDbGVhciBzZWFyY2hcbiAgICBcbiAgICAvLyBSZXNldCB0aGUgY29udGVudCBiZWxvd1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zbGltLmNvbnRlbnQucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpXG4gICAgICB0aGlzLmRhdGEuY29udGVudFBvc2l0aW9uID0gJ2JlbG93J1xuICAgICAgXG4gICAgICBpZiAodGhpcy5jb25maWcuaXNNdWx0aXBsZSAmJiB0aGlzLnNsaW0ubXVsdGlTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnNsaW0ubXVsdGlTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNvbmZpZy5vcGVuQWJvdmUpXG4gICAgICAgIHRoaXMuc2xpbS5tdWx0aVNlbGVjdGVkLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY29uZmlnLm9wZW5CZWxvdylcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zbGltLnNpbmdsZVNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMuc2xpbS5zaW5nbGVTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNvbmZpZy5vcGVuQWJvdmUpXG4gICAgICAgIHRoaXMuc2xpbS5zaW5nbGVTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNvbmZpZy5vcGVuQmVsb3cpXG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIEFmdGVyIGNvbnRlbnQgaXMgY2xvc2VkIGxldHMgYmx1ciBvbiB0aGUgaW5wdXQgZmllbGRcbiAgICAgIHRoaXMuc2xpbS5zZWFyY2guaW5wdXQuYmx1cigpXG4gICAgICBcbiAgICAgIC8vIFJ1biBhZnRlckNsb3NlIGNhbGxiYWNrXG4gICAgICBpZiAodGhpcy5hZnRlckNsb3NlKSB7IHRoaXMuYWZ0ZXJDbG9zZSgpIH1cbiAgICB9LCB0aGlzLmNvbmZpZy50aW1lb3V0RGVsYXkpXG4gIH1cbiAgXG4gIHB1YmxpYyBtb3ZlQ29udGVudEFib3ZlKCk6IHZvaWQge1xuICAgIGxldCBzZWxlY3RIZWlnaHQ6IG51bWJlciA9IDBcbiAgICBpZiAodGhpcy5jb25maWcuaXNNdWx0aXBsZSAmJiB0aGlzLnNsaW0ubXVsdGlTZWxlY3RlZCkge1xuICAgICAgc2VsZWN0SGVpZ2h0ID0gdGhpcy5zbGltLm11bHRpU2VsZWN0ZWQuY29udGFpbmVyLm9mZnNldEhlaWdodFxuICAgIH0gZWxzZSBpZiAodGhpcy5zbGltLnNpbmdsZVNlbGVjdGVkKSB7XG4gICAgICBzZWxlY3RIZWlnaHQgPSB0aGlzLnNsaW0uc2luZ2xlU2VsZWN0ZWQuY29udGFpbmVyLm9mZnNldEhlaWdodFxuICAgIH1cbiAgICBjb25zdCBjb250ZW50SGVpZ2h0ID0gdGhpcy5zbGltLmNvbnRlbnQub2Zmc2V0SGVpZ2h0XG4gICAgY29uc3QgaGVpZ2h0ID0gc2VsZWN0SGVpZ2h0ICsgY29udGVudEhlaWdodCAtIDFcbiAgICB0aGlzLnNsaW0uY29udGVudC5zdHlsZS5tYXJnaW4gPSAnLScgKyBoZWlnaHQgKyAncHggMCAwIDAnXG4gICAgdGhpcy5zbGltLmNvbnRlbnQuc3R5bGUuaGVpZ2h0ID0gKGhlaWdodCAtIHNlbGVjdEhlaWdodCArIDEpICsgJ3B4J1xuICAgIHRoaXMuc2xpbS5jb250ZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICdjZW50ZXIgYm90dG9tJ1xuICAgIHRoaXMuZGF0YS5jb250ZW50UG9zaXRpb24gPSAnYWJvdmUnXG4gICAgXG4gICAgaWYgKHRoaXMuY29uZmlnLmlzTXVsdGlwbGUgJiYgdGhpcy5zbGltLm11bHRpU2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuc2xpbS5tdWx0aVNlbGVjdGVkLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY29uZmlnLm9wZW5CZWxvdylcbiAgICAgIHRoaXMuc2xpbS5tdWx0aVNlbGVjdGVkLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuY29uZmlnLm9wZW5BYm92ZSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2xpbS5zaW5nbGVTZWxlY3RlZCkge1xuICAgICAgdGhpcy5zbGltLnNpbmdsZVNlbGVjdGVkLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY29uZmlnLm9wZW5CZWxvdylcbiAgICAgIHRoaXMuc2xpbS5zaW5nbGVTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLmNvbmZpZy5vcGVuQWJvdmUpXG4gICAgfVxuICB9XG4gIFxuICBwdWJsaWMgbW92ZUNvbnRlbnRCZWxvdygpOiB2b2lkIHtcbiAgICB0aGlzLmRhdGEuY29udGVudFBvc2l0aW9uID0gJ2JlbG93J1xuICAgIFxuICAgIGlmICh0aGlzLmNvbmZpZy5pc011bHRpcGxlICYmIHRoaXMuc2xpbS5tdWx0aVNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNsaW0ubXVsdGlTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNvbmZpZy5vcGVuQWJvdmUpXG4gICAgICB0aGlzLnNsaW0ubXVsdGlTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LmFkZCh0aGlzLmNvbmZpZy5vcGVuQmVsb3cpXG4gICAgfSBlbHNlIGlmICh0aGlzLnNsaW0uc2luZ2xlU2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuc2xpbS5zaW5nbGVTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNvbmZpZy5vcGVuQWJvdmUpXG4gICAgICB0aGlzLnNsaW0uc2luZ2xlU2VsZWN0ZWQuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5jb25maWcub3BlbkJlbG93KVxuICAgIH1cbiAgfVxuICBcbiAgLy8gU2V0IHRvIGVuYWJsZWQsIHJlbW92ZSBkaXNhYmxlZCBjbGFzc2VzIGFuZCByZW1vdmVkIGRpc2FibGVkIGZyb20gb3JpZ2luYWwgc2VsZWN0XG4gIHB1YmxpYyBlbmFibGUoKTogdm9pZCB7XG4gICAgdGhpcy5jb25maWcuaXNFbmFibGVkID0gdHJ1ZVxuICAgIGlmICh0aGlzLmNvbmZpZy5pc011bHRpcGxlICYmIHRoaXMuc2xpbS5tdWx0aVNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNsaW0ubXVsdGlTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNvbmZpZy5kaXNhYmxlZClcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2xpbS5zaW5nbGVTZWxlY3RlZCkge1xuICAgICAgdGhpcy5zbGltLnNpbmdsZVNlbGVjdGVkLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY29uZmlnLmRpc2FibGVkKVxuICAgIH1cbiAgICBcbiAgICAvLyBEaXNhYmxlIG9yaWdpbmFsIHNlbGVjdCBidXQgZG9udCB0cmlnZ2VyIG9ic2VydmVyXG4gICAgdGhpcy5zZWxlY3QudHJpZ2dlck11dGF0aW9uT2JzZXJ2ZXIgPSBmYWxzZVxuICAgIHRoaXMuc2VsZWN0LmVsZW1lbnQuZGlzYWJsZWQgPSBmYWxzZVxuICAgIHRoaXMuc2xpbS5zZWFyY2guaW5wdXQuZGlzYWJsZWQgPSBmYWxzZVxuICAgIHRoaXMuc2VsZWN0LnRyaWdnZXJNdXRhdGlvbk9ic2VydmVyID0gdHJ1ZVxuICB9XG4gIFxuICAvLyBTZXQgdG8gZGlzYWJsZWQsIGFkZCBkaXNhYmxlZCBjbGFzc2VzIGFuZCBhZGQgZGlzYWJsZWQgdG8gb3JpZ2luYWwgc2VsZWN0XG4gIHB1YmxpYyBkaXNhYmxlKCk6IHZvaWQge1xuICAgIHRoaXMuY29uZmlnLmlzRW5hYmxlZCA9IGZhbHNlXG4gICAgaWYgKHRoaXMuY29uZmlnLmlzTXVsdGlwbGUgJiYgdGhpcy5zbGltLm11bHRpU2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuc2xpbS5tdWx0aVNlbGVjdGVkLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHRoaXMuY29uZmlnLmRpc2FibGVkKVxuICAgIH0gZWxzZSBpZiAodGhpcy5zbGltLnNpbmdsZVNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNsaW0uc2luZ2xlU2VsZWN0ZWQuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQodGhpcy5jb25maWcuZGlzYWJsZWQpXG4gICAgfVxuICAgIFxuICAgIC8vIEVuYWJsZSBvcmlnaW5hbCBzZWxlY3QgYnV0IGRvbnQgdHJpZ2dlciBvYnNlcnZlclxuICAgIHRoaXMuc2VsZWN0LnRyaWdnZXJNdXRhdGlvbk9ic2VydmVyID0gZmFsc2VcbiAgICB0aGlzLnNlbGVjdC5lbGVtZW50LmRpc2FibGVkID0gdHJ1ZVxuICAgIHRoaXMuc2xpbS5zZWFyY2guaW5wdXQuZGlzYWJsZWQgPSB0cnVlXG4gICAgdGhpcy5zZWxlY3QudHJpZ2dlck11dGF0aW9uT2JzZXJ2ZXIgPSB0cnVlXG4gIH1cbiAgXG4gIC8vIFRha2UgaW4gc3RyaW5nIHZhbHVlIGFuZCBzZWFyY2ggY3VycmVudCBvcHRpb25zXG4gIHB1YmxpYyBzZWFyY2godmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIE9ubHkgZmlsdGVyIGRhdGEgYW5kIHJlcmVuZGVyIGlmIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgaWYgKHRoaXMuZGF0YS5zZWFyY2hWYWx1ZSA9PT0gdmFsdWUpIHsgcmV0dXJuIH1cbiAgICBcbiAgICB0aGlzLnNsaW0uc2VhcmNoLmlucHV0LnZhbHVlID0gdmFsdWVcbiAgICBpZiAodGhpcy5jb25maWcuaXNBamF4KSB7XG4gICAgICBjb25zdCBtYXN0ZXIgPSB0aGlzXG4gICAgICB0aGlzLmNvbmZpZy5pc1NlYXJjaGluZyA9IHRydWVcbiAgICAgIHRoaXMucmVuZGVyKClcbiAgICAgIFxuICAgICAgLy8gSWYgYWpheCBjYWxsIGl0XG4gICAgICBpZiAodGhpcy5hamF4KSB7XG4gICAgICAgIHRoaXMuYWpheCh2YWx1ZSwgKGluZm86IGFueSkgPT4ge1xuICAgICAgICAgIC8vIE9ubHkgcHJvY2VzcyBpZiByZXR1cm4gY2FsbGJhY2sgaXMgbm90IGZhbHNlXG4gICAgICAgICAgbWFzdGVyLmNvbmZpZy5pc1NlYXJjaGluZyA9IGZhbHNlXG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW5mbykpIHtcbiAgICAgICAgICAgIGluZm8udW5zaGlmdCh7IHRleHQ6ICcnLCBwbGFjZWhvbGRlcjogdHJ1ZSB9KVxuICAgICAgICAgICAgbWFzdGVyLnNldERhdGEoaW5mbylcbiAgICAgICAgICAgIG1hc3Rlci5kYXRhLnNlYXJjaCh2YWx1ZSlcbiAgICAgICAgICAgIG1hc3Rlci5yZW5kZXIoKVxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGluZm8gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBtYXN0ZXIuc2xpbS5vcHRpb25zKGluZm8pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hc3Rlci5yZW5kZXIoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kYXRhLnNlYXJjaCh2YWx1ZSlcbiAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9XG4gIH1cbiAgXG4gIHB1YmxpYyBzZXRTZWFyY2hUZXh0KHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuY29uZmlnLnNlYXJjaFRleHQgPSB0ZXh0XG4gIH1cbiAgXG4gIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29uZmlnLmlzTXVsdGlwbGUpIHtcbiAgICAgIHRoaXMuc2xpbS52YWx1ZXMoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNsaW0ucGxhY2Vob2xkZXIoKVxuICAgICAgdGhpcy5zbGltLmRlc2VsZWN0KClcbiAgICB9XG4gICAgdGhpcy5zbGltLm9wdGlvbnMoKVxuICB9XG4gIFxuICAvLyBEaXNwbGF5IG9yaWdpbmFsIHNlbGVjdCBhZ2FpbiBhbmQgcmVtb3ZlIHNsaW1cbiAgcHVibGljIGRlc3Ryb3koaWQ6IHN0cmluZyB8IG51bGwgPSBudWxsKTogdm9pZCB7XG4gICAgY29uc3Qgc2xpbSA9IChpZCA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgaWQgKyAnLnNzLW1haW4nKSA6IHRoaXMuc2xpbS5jb250YWluZXIpXG4gICAgY29uc3Qgc2VsZWN0ID0gKGlkID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc3NpZD0ke2lkfV1gKSBhcyBIVE1MU2VsZWN0RWxlbWVudCA6IHRoaXMuc2VsZWN0LmVsZW1lbnQpXG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gc2xpbSBkb250IGRvIGFueXRoaW5nXG4gICAgaWYgKCFzbGltIHx8ICFzZWxlY3QpIHsgcmV0dXJuIH1cbiAgICBcbiAgICBcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZG9jdW1lbnRDbGljaylcbiAgICBcbiAgICBpZiAodGhpcy5jb25maWcuc2hvd0NvbnRlbnQgPT09ICdhdXRvJykge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMud2luZG93U2Nyb2xsLCBmYWxzZSlcbiAgICB9XG4gICAgXG4gICAgLy8gU2hvdyBvcmlnaW5hbCBzZWxlY3RcbiAgICBzZWxlY3Quc3R5bGUuZGlzcGxheSA9ICcnXG4gICAgZGVsZXRlIHNlbGVjdC5kYXRhc2V0LnNzaWRcbiAgICBcbiAgICAvLyBSZW1vdmUgc2xpbSBmcm9tIG9yaWdpbmFsIHNlbGVjdCBkcm9wZG93blxuICAgIGNvbnN0IGVsID0gc2VsZWN0IGFzIGFueVxuICAgIGVsLnNsaW0gPSBudWxsXG4gICAgXG4gICAgLy8gUmVtb3ZlIHNsaW0gc2VsZWN0XG4gICAgaWYgKHNsaW0ucGFyZW50RWxlbWVudCkge1xuICAgICAgc2xpbS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHNsaW0pXG4gICAgfVxuICAgIFxuICAgIC8vIHJlbW92ZSB0aGUgY29udGVudCBpZiBpdCB3YXMgYWRkZWQgdG8gdGhlIGRvY3VtZW50IGJvZHlcbiAgICBpZiAodGhpcy5jb25maWcuYWRkVG9Cb2R5KSB7XG4gICAgICBjb25zdCBzbGltQ29udGVudCA9IChpZCA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgaWQgKyAnLnNzLWNvbnRlbnQnKSA6IHRoaXMuc2xpbS5jb250ZW50KVxuICAgICAgaWYgKCFzbGltQ29udGVudCkgeyByZXR1cm4gfVxuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzbGltQ29udGVudClcbiAgICB9XG4gIH1cbiAgXG4gIHByaXZhdGUgZG9jdW1lbnRDbGljazogKGU6IEV2ZW50KSA9PiB2b2lkID0gKGU6IEV2ZW50KSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0ICYmICFoYXNDbGFzc0luVHJlZShlLnRhcmdldCBhcyBIVE1MRWxlbWVudCwgdGhpcy5jb25maWcuaWQpKSB7XG4gICAgICB0aGlzLmNsb3NlKClcbiAgICB9XG4gIH1cbiAgXG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik1BNEJhLE1BQU0sQ0FBQTtJQUNWLEVBQUUsR0FBVyxFQUFFLENBQUE7QUFDZixJQUFBLEtBQUssQ0FBUTtBQUNiLElBQUEsS0FBSyxDQUFVO0lBQ2YsVUFBVSxHQUFZLEtBQUssQ0FBQTtJQUMzQixNQUFNLEdBQVksS0FBSyxDQUFBO0lBQ3ZCLFdBQVcsR0FBWSxLQUFLLENBQUE7SUFDNUIsVUFBVSxHQUFZLElBQUksQ0FBQTtJQUMxQixXQUFXLEdBQVksSUFBSSxDQUFBO0lBQzNCLGVBQWUsR0FBWSxLQUFLLENBQUE7SUFDaEMsYUFBYSxHQUFZLElBQUksQ0FBQTtBQUM3QixJQUFBLFdBQVcsR0FBVyxNQUFNLENBQUE7SUFDNUIsaUJBQWlCLEdBQVcsUUFBUSxDQUFBO0lBQ3BDLFVBQVUsR0FBVyxZQUFZLENBQUE7SUFDakMsYUFBYSxHQUFXLGNBQWMsQ0FBQTtJQUN0QyxlQUFlLEdBQVcsY0FBYyxDQUFBO0lBQ3hDLGFBQWEsR0FBWSxLQUFLLENBQUE7SUFDOUIsbUJBQW1CLEdBQVksS0FBSyxDQUFBO0lBQ3BDLGtCQUFrQixHQUFZLEtBQUssQ0FBQTtJQUNuQyxhQUFhLEdBQVcsR0FBRyxDQUFBO0lBQzNCLFNBQVMsR0FBWSxJQUFJLENBQUE7SUFDekIsYUFBYSxHQUFZLEtBQUssQ0FBQTtJQUM5QixrQkFBa0IsR0FBWSxLQUFLLENBQUE7SUFDbkMsYUFBYSxHQUFZLEtBQUssQ0FBQTtJQUM5QixLQUFLLEdBQVcsQ0FBQyxDQUFBO0lBQ2pCLFlBQVksR0FBVyxHQUFHLENBQUE7SUFDMUIsU0FBUyxHQUFZLEtBQUssQ0FBQTs7SUFHakIsSUFBSSxHQUFXLFNBQVMsQ0FBQTtJQUN4QixjQUFjLEdBQVcsb0JBQW9CLENBQUE7SUFDN0MsS0FBSyxHQUFXLFVBQVUsQ0FBQTtJQUMxQixhQUFhLEdBQVcsbUJBQW1CLENBQUE7SUFDM0MsR0FBRyxHQUFXLFFBQVEsQ0FBQTtJQUN0QixJQUFJLEdBQVcsU0FBUyxDQUFBO0lBQ3hCLE1BQU0sR0FBVyxXQUFXLENBQUE7SUFDNUIsS0FBSyxHQUFXLFVBQVUsQ0FBQTtJQUMxQixTQUFTLEdBQVcsZUFBZSxDQUFBO0lBQ25DLFdBQVcsR0FBVyxpQkFBaUIsQ0FBQTtJQUN2QyxPQUFPLEdBQVcsWUFBWSxDQUFBO0lBQzlCLElBQUksR0FBVyxTQUFTLENBQUE7SUFDeEIsU0FBUyxHQUFXLGVBQWUsQ0FBQTtJQUNuQyxTQUFTLEdBQVcsZUFBZSxDQUFBO0lBQ25DLE1BQU0sR0FBVyxXQUFXLENBQUE7SUFDNUIsaUJBQWlCLEdBQVcscUJBQXFCLENBQUE7SUFDakQsT0FBTyxHQUFXLFlBQVksQ0FBQTtJQUM5QixJQUFJLEdBQVcsU0FBUyxDQUFBO0lBQ3hCLFFBQVEsR0FBVyxhQUFhLENBQUE7SUFDaEMsYUFBYSxHQUFXLG1CQUFtQixDQUFBO0lBQzNDLHVCQUF1QixHQUFXLDhCQUE4QixDQUFBO0lBQ2hFLE1BQU0sR0FBVyxXQUFXLENBQUE7SUFDNUIsY0FBYyxHQUFXLG9CQUFvQixDQUFBO0lBQzdDLFdBQVcsR0FBVyxnQkFBZ0IsQ0FBQTtJQUN0QyxRQUFRLEdBQVcsYUFBYSxDQUFBO0lBQ2hDLElBQUksR0FBVyxTQUFTLENBQUE7QUFFeEMsSUFBQSxXQUFBLENBQVksSUFBaUIsRUFBQTtBQUMzQixRQUFBLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFBO1FBQ3BELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFBO0FBQ3RDLFFBQUEsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFN0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQTtBQUN0QyxRQUFBLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtBQUN6QixRQUFBLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFBO0FBQzVELFFBQUEsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLEtBQUssR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUE7QUFDOUQsUUFBQSxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssSUFBSSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQTtBQUNyRSxRQUFBLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFBO1FBQ2xFLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUFFLFlBQUEsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO0FBQUUsU0FBQTtBQUM3RCxRQUFBLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFBO1FBQzFELElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO0FBQUUsWUFBQSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFBO0FBQUUs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
