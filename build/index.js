const buildContainer = () => {
    const container = document.createElement('div');
    container.classList.add('ss-main');
    return container;
};
const buildContent = () => {
    const content = document.createElement('div');
    content.classList.add('ss-content');
    return content;
};
const buildSearch = (onSearch) => {
    const container = document.createElement('div');
    container.classList.add('ss-search');
    const input = document.createElement('input');
    const searchReturn = {
        container,
        input
    };
    input.type = 'search';
    input.tabIndex = 0;
    input.setAttribute('aria-label', "Search...");
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.addEventListener('input', () => {
        onSearch(input.value);
    });
    container.appendChild(input);
    return searchReturn;
};
const buildResultsList = () => {
    const list = document.createElement('div');
    list.classList.add('ss-list');
    list.setAttribute('role', 'listbox');
    return list;
};
const buildSingleSelect = (onClick) => {
    const container = document.createElement('div');
    container.classList.add('ss-single-selected');
    // Title text
    const title = document.createElement('span');
    title.classList.add('placeholder');
    container.appendChild(title);
    // Arrow
    const arrowContainer = document.createElement('span');
    arrowContainer.classList.add('ss-arrow');
    const arrowIcon = document.createElement('span');
    arrowIcon.classList.add('arrow-down');
    arrowContainer.appendChild(arrowIcon);
    container.appendChild(arrowContainer);
    container.onclick = onClick;
    return {
        container,
        title,
        arrowIcon: {
            container: arrowContainer,
            arrow: arrowIcon
        }
    };
};
const buildMultiSelect = (onClick) => {
    const container = document.createElement('div');
    container.classList.add('ss-multi-selected');
    // values
    const values = document.createElement('div');
    values.classList.add('ss-values');
    container.appendChild(values);
    // Arrow
    const arrowContainer = document.createElement('span');
    arrowContainer.classList.add('ss-arrow');
    const arrowIcon = document.createElement('span');
    arrowIcon.classList.add('arrow-down');
    arrowContainer.appendChild(arrowIcon);
    container.appendChild(arrowContainer);
    container.onclick = onClick;
    return {
        container,
        values,
        arrowIcon: {
            container: arrowContainer,
            arrow: arrowIcon
        }
    };
};
const generateOption = (option, onOptionSelect) => {
    const optionEl = document.createElement('div');
    optionEl.classList.add('ss-option');
    optionEl.setAttribute('role', 'option');
    optionEl.dataset.ssValue = option.value;
    optionEl.addEventListener('click', () => {
        onOptionSelect(option);
    });
    if (option.selected) {
        optionEl.classList.add('ss-option-selected');
    }
    if (option.innerHtml) {
        optionEl.innerHTML = option.innerHtml;
    }
    else {
        optionEl.innerText = option.text || '\xa0';
    }
    return optionEl;
};
const buildMultiTitleBadge = (option, onRemoveMultiOption) => {
    const badge = document.createElement('div');
    badge.classList.add('ss-value');
    badge.dataset.value = option.value;
    const span = document.createElement('span');
    span.innerText = option.text || '\xa0';
    span.classList.add('ss-value-text');
    const del = document.createElement('span');
    del.innerText = '⨯';
    del.classList.add('ss-value-delete');
    del.onclick = (e) => {
        e.stopPropagation();
        onRemoveMultiOption(option);
    };
    badge.appendChild(span);
    badge.appendChild(del);
    return badge;
};

class View {
    container;
    content;
    search;
    list;
    singleSelected;
    onSearch;
    onClose;
    onOpen;
    onOptionSelect;
    isOpened;
    element;
    originalElementDisplay;
    onDocumentClick = (e) => {
        if (this.isOpened &&
            e.target !== this.singleSelected.title &&
            e.target !== this.singleSelected.arrowIcon.container &&
            e.target !== this.singleSelected.arrowIcon.arrow &&
            e.target !== this.singleSelected.container) {
            this.onClose();
        }
    };
    constructor(el, onSearch, onOptionSelect, onClose, onOpen) {
        this.element = el;
        this.originalElementDisplay = el.style.display;
        this.onSearch = onSearch;
        this.onOptionSelect = onOptionSelect;
        this.onClose = onClose;
        this.onOpen = onOpen;
        this.isOpened = false;
        this.container = buildContainer();
        this.content = buildContent();
        this.search = buildSearch(this.onSearch);
        this.list = buildResultsList();
        const onClick = () => {
            this.isOpened ? this.onClose() : this.onOpen();
        };
        this.singleSelected = buildSingleSelect(onClick);
        this.container.appendChild(this.singleSelected.container);
        this.container.appendChild(this.content);
        this.content.appendChild(this.search.container);
        this.content.appendChild(this.list);
        el.style.display = 'none';
        if (el.parentNode) {
            el.parentNode.insertBefore(this.container, el.nextSibling);
        }
        else {
            throw new Error('thin-select: The given select element must have a parent node');
        }
        document.addEventListener('click', this.onDocumentClick);
    }
    destroy = () => {
        this.element.style.display = this.originalElementDisplay;
        document.removeEventListener('click', this.onDocumentClick);
        if (this.element.parentElement) {
            this.element.parentElement.removeChild(this.container);
        }
    };
    openPanel = () => {
        this.isOpened = true;
        this.singleSelected.arrowIcon.arrow.classList.remove('arrow-down');
        this.singleSelected.arrowIcon.arrow.classList.add('arrow-up');
        this.singleSelected.container.classList.add('ss-open-below');
        this.content.classList.add('ss-open');
        // setTimeout is for animation completion
        setTimeout(() => {
            this.search.input.focus();
        }, 100);
    };
    closePanel = () => {
        this.isOpened = false;
        this.search.input.value = '';
        this.singleSelected.container.classList.remove('ss-open-above');
        this.singleSelected.container.classList.remove('ss-open-below');
        this.singleSelected.arrowIcon.arrow.classList.add('arrow-down');
        this.singleSelected.arrowIcon.arrow.classList.remove('arrow-up');
        this.content.classList.remove('ss-open');
    };
    setSelected = (option) => {
        this.singleSelected.title.innerText = option.text;
        Array.from(this.element.options).forEach((o) => {
            if (o.value === option.value) {
                o.selected = true;
            }
            else {
                o.selected = false;
            }
        });
    };
    setDisplayList = (options) => {
        this.list.innerHTML = '';
        options.forEach((option) => this.list.appendChild(generateOption(option, this.onOptionSelect)));
    };
    setElementOptions = (options) => {
        this.element.innerHTML = '';
        options.forEach((option) => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.innerText = option.text;
            opt.selected = option.selected;
            this.element.appendChild(opt);
        });
    };
}

class MultiView {
    container;
    content;
    search;
    list;
    multiSelected;
    onSearch;
    onClose;
    onOpen;
    onOptionSelect;
    onRemoveMultiOption;
    isOpened;
    element;
    originalElementDisplay;
    targetBelongsToContainer = (target) => {
        if (target === this.container) {
            return true;
        }
        else if (target.parentNode) {
            return this.targetBelongsToContainer(target.parentNode);
        }
        else {
            return false;
        }
    };
    onDocumentClick = (e) => {
        if (this.isOpened && e.target instanceof HTMLElement && !this.targetBelongsToContainer(e.target)) {
            this.onClose();
        }
    };
    constructor(el, onSearch, onOptionSelect, onClose, onOpen, onRemoveMultiOption) {
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
        const onClick = () => {
            this.isOpened ? this.onClose() : this.onOpen();
        };
        this.multiSelected = buildMultiSelect(onClick);
        this.container.appendChild(this.multiSelected.container);
        this.container.appendChild(this.content);
        this.content.appendChild(this.search.container);
        this.content.appendChild(this.list);
        el.style.display = 'none';
        if (el.parentNode) {
            el.parentNode.insertBefore(this.container, el.nextSibling);
        }
        else {
            throw new Error('thin-select: The given select element must have a parent node');
        }
        document.addEventListener('click', this.onDocumentClick);
    }
    destroy = () => {
        this.element.style.display = this.originalElementDisplay;
        document.removeEventListener('click', this.onDocumentClick);
        if (this.element.parentElement) {
            this.element.parentElement.removeChild(this.container);
        }
    };
    openPanel = () => {
        this.isOpened = true;
        this.multiSelected.arrowIcon.arrow.classList.remove('arrow-down');
        this.multiSelected.arrowIcon.arrow.classList.add('arrow-up');
        this.multiSelected.container.classList.add('ss-open-below');
        this.content.classList.add('ss-open');
        // setTimeout is for animation completion
        setTimeout(() => {
            this.search.input.focus();
        }, 100);
    };
    closePanel = () => {
        this.isOpened = false;
        this.search.input.value = '';
        this.multiSelected.container.classList.remove('ss-open-above');
        this.multiSelected.container.classList.remove('ss-open-below');
        this.multiSelected.arrowIcon.arrow.classList.add('arrow-down');
        this.multiSelected.arrowIcon.arrow.classList.remove('arrow-up');
        this.content.classList.remove('ss-open');
    };
    setSelected = (options) => {
        options.forEach((option) => {
            const badge = buildMultiTitleBadge(option, this.onRemoveMultiOption);
            this.multiSelected.values.appendChild(badge);
        });
        Array.from(this.element.options).forEach((o) => {
            if (options.find((x) => x.selected && x.value === o.value)) {
                o.selected = true;
            }
            else {
                o.selected = false;
            }
        });
    };
    appendSelected = (option) => {
        const badge = buildMultiTitleBadge(option, this.onRemoveMultiOption);
        this.multiSelected.values.appendChild(badge);
        Array.from(this.list.children).forEach((x) => {
            if (x instanceof HTMLElement && x.dataset.ssValue === option.value) {
                x.classList.add('ss-option-selected');
            }
        });
        const domOption = Array.from(this.element.options).find((o) => o.value === option.value);
        if (domOption) {
            domOption.selected = true;
        }
    };
    removeSelected = (option) => {
        const domBadge = Array.from(this.multiSelected.values.children).find((x) => {
            return (x instanceof HTMLElement) && x.dataset.value === option.value;
        });
        if (domBadge) {
            domBadge.remove();
        }
        Array.from(this.list.children).forEach((x) => {
            if (x instanceof HTMLElement && x.dataset.ssValue === option.value) {
                x.classList.remove('ss-option-selected');
            }
        });
        const domOption = Array.from(this.element.options).find((o) => o.value === option.value);
        if (domOption) {
            domOption.selected = false;
        }
    };
    setDisplayList = (options) => {
        this.list.innerHTML = '';
        options.forEach((option) => this.list.appendChild(generateOption(option, this.onOptionSelect)));
    };
    setElementOptions = (options) => {
        this.element.innerHTML = '';
        options.forEach((option) => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.innerText = option.text;
            opt.selected = option.selected;
            this.element.appendChild(opt);
        });
    };
}

class SelectParser {
    el;
    constructor(el) {
        if (!(el instanceof HTMLSelectElement)) {
            throw new Error('thin-select: "select" dom element must be an HTMLSelectElement');
        }
        this.el = el;
    }
    analyze() {
        const isMultiple = this.el.multiple;
        const options = [];
        Array.from(this.el.options).forEach((option) => {
            options.push({ value: option.value, text: option.text, selected: option.selected });
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

class ThinSelect {
    view;
    displayedOptionsList;
    isSearching;
    ajax;
    constructor(params) {
        const el = typeof (params.select) === "string" ? document.querySelector(params.select) : params.select;
        const initialSelectInfo = (new SelectParser(el)).analyze();
        this.isSearching = false;
        if (initialSelectInfo.isMultiple) {
            this.view = new MultiView(el, this.onSearch, this.onOptionSelect, this.closePanel, this.openPanel, this.onRemoveMultiOption);
        }
        else {
            this.view = new View(el, this.onSearch, this.onOptionSelect, this.closePanel, this.openPanel);
        }
        this.displayedOptionsList = initialSelectInfo.options;
        if (!params.ajax) {
            this.view.setDisplayList(this.displayedOptionsList);
        }
        if (this.view instanceof MultiView) {
            this.view.setSelected(initialSelectInfo.options.filter(option => option.selected));
        }
        else {
            this.view.setSelected(initialSelectInfo.defaultSingleOption);
        }
        this.ajax = params.ajax;
    }
    destroy = () => {
        this.view.destroy();
    };
    onSearch = (text) => {
        this.isSearching = true;
        if (this.ajax) {
            this.ajax(text, (data) => {
                data.forEach((x) => {
                    if (this.displayedOptionsList.find((q) => q.selected && q.value === x.value)) {
                        x.selected = true;
                    }
                });
                this.displayedOptionsList = data;
                this.view.setElementOptions(data);
                this.view.setDisplayList(data);
            });
        }
        else {
            const matchedOptions = this.displayedOptionsList.filter(option => this.searchFilter(option.text, text));
            this.view.setDisplayList(matchedOptions);
        }
    };
    closePanel = () => {
        this.view.closePanel();
        setTimeout(() => {
            this.view.setDisplayList(this.displayedOptionsList);
        }, 100);
        this.isSearching = false;
    };
    openPanel = () => {
        this.view.openPanel();
    };
    onOptionSelect = (option) => {
        if (this.view instanceof MultiView) {
            if (option.selected) {
                option.selected = false;
                this.view.removeSelected(option);
            }
            else {
                option.selected = true;
                this.view.appendSelected(option);
            }
        }
        else {
            this.view.setSelected(option);
            this.displayedOptionsList.forEach((x) => {
                if (x.value === option.value) {
                    x.selected = true;
                }
                else {
                    x.selected = false;
                }
            });
            this.closePanel();
        }
    };
    onRemoveMultiOption = (option) => {
        if (this.view instanceof MultiView) {
            this.displayedOptionsList.forEach((x) => {
                if (x.value === option.value) {
                    x.selected = false;
                }
            });
            this.view.removeSelected(option);
            this.view.setDisplayList(this.displayedOptionsList);
        }
    };
    searchFilter = (optionText, inputText) => {
        return optionText.toLowerCase().indexOf(inputText.toLowerCase()) !== -1;
    };
}

export { ThinSelect as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9kb21fZmFjdG9yeS50cyIsIi4uL3NyYy92aWV3LnRzIiwiLi4vc3JjL211bHRpcGxlX3ZpZXcudHMiLCIuLi9zcmMvc2VsZWN0X3BhcnNlci50cyIsIi4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge09wdGlvbn0gZnJvbSBcIi4vbW9kZWxzXCJcbmltcG9ydCB7IFNlYXJjaCwgU2luZ2xlU2VsZWN0ZWQgfSBmcm9tIFwiLi92aWV3XCI7XG5pbXBvcnQgeyBNdWx0aVNlbGVjdGVkIH0gZnJvbSBcIi4vbXVsdGlwbGVfdmlld1wiO1xuXG5jb25zdCBidWlsZENvbnRhaW5lciA9ICgpID0+IHtcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1tYWluJyk7XG4gIHJldHVybiBjb250YWluZXI7XG59XG5cbmNvbnN0IGJ1aWxkQ29udGVudCA9ICgpID0+IHtcbiAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NzLWNvbnRlbnQnKTtcbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbmNvbnN0IGJ1aWxkU2VhcmNoID0gKG9uU2VhcmNoOiAodGV4dDogc3RyaW5nKSA9PiB2b2lkKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1zZWFyY2gnKTtcbiAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpXG4gIFxuICBjb25zdCBzZWFyY2hSZXR1cm46IFNlYXJjaCA9IHtcbiAgICBjb250YWluZXIsXG4gICAgaW5wdXRcbiAgfVxuICBcbiAgaW5wdXQudHlwZSA9ICdzZWFyY2gnXG4gIGlucHV0LnRhYkluZGV4ID0gMFxuICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBcIlNlYXJjaC4uLlwiKVxuICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2F1dG9jYXBpdGFsaXplJywgJ29mZicpXG4gIGlucHV0LnNldEF0dHJpYnV0ZSgnYXV0b2NvbXBsZXRlJywgJ29mZicpXG4gIGlucHV0LnNldEF0dHJpYnV0ZSgnYXV0b2NvcnJlY3QnLCAnb2ZmJylcbiAgXG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgIG9uU2VhcmNoKGlucHV0LnZhbHVlKTtcbiAgfSlcbiAgXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpbnB1dClcbiAgXG4gIHJldHVybiBzZWFyY2hSZXR1cm47XG59XG5cblxuY29uc3QgYnVpbGRSZXN1bHRzTGlzdCA9ICgpID0+IHtcbiAgY29uc3QgbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGxpc3QuY2xhc3NMaXN0LmFkZCgnc3MtbGlzdCcpXG4gIGxpc3Quc2V0QXR0cmlidXRlKCdyb2xlJywgJ2xpc3Rib3gnKVxuICByZXR1cm4gbGlzdDtcbn1cblxuXG5jb25zdCBidWlsZFNpbmdsZVNlbGVjdCA9IChvbkNsaWNrOiAoKSA9PiB2b2lkKTogU2luZ2xlU2VsZWN0ZWQgPT4ge1xuICBjb25zdCBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLXNpbmdsZS1zZWxlY3RlZCcpXG4gIFxuICAvLyBUaXRsZSB0ZXh0XG4gIGNvbnN0IHRpdGxlOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgdGl0bGUuY2xhc3NMaXN0LmFkZCgncGxhY2Vob2xkZXInKVxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpXG4gIFxuICAvLyBBcnJvd1xuICBjb25zdCBhcnJvd0NvbnRhaW5lcjogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gIGFycm93Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLWFycm93JylcbiAgXG4gIGNvbnN0IGFycm93SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICBhcnJvd0ljb24uY2xhc3NMaXN0LmFkZCgnYXJyb3ctZG93bicpXG4gIGFycm93Q29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93SWNvbilcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93Q29udGFpbmVyKVxuICBcbiAgY29udGFpbmVyLm9uY2xpY2sgPSBvbkNsaWNrO1xuICBcbiAgcmV0dXJuIHtcbiAgICBjb250YWluZXIsXG4gICAgdGl0bGUsXG4gICAgYXJyb3dJY29uOiB7XG4gICAgICBjb250YWluZXI6IGFycm93Q29udGFpbmVyLFxuICAgICAgYXJyb3c6IGFycm93SWNvblxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBidWlsZE11bHRpU2VsZWN0ID0gKG9uQ2xpY2s6ICgpID0+IHZvaWQpOiBNdWx0aVNlbGVjdGVkID0+IHtcbiAgY29uc3QgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1tdWx0aS1zZWxlY3RlZCcpXG4gIFxuICAvLyB2YWx1ZXNcbiAgY29uc3QgdmFsdWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgdmFsdWVzLmNsYXNzTGlzdC5hZGQoJ3NzLXZhbHVlcycpXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh2YWx1ZXMpXG4gIFxuICAvLyBBcnJvd1xuICBjb25zdCBhcnJvd0NvbnRhaW5lcjogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gIGFycm93Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLWFycm93JylcbiAgXG4gIGNvbnN0IGFycm93SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICBhcnJvd0ljb24uY2xhc3NMaXN0LmFkZCgnYXJyb3ctZG93bicpXG4gIGFycm93Q29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93SWNvbilcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93Q29udGFpbmVyKVxuICBcbiAgY29udGFpbmVyLm9uY2xpY2sgPSBvbkNsaWNrO1xuICBcbiAgcmV0dXJuIHtcbiAgICBjb250YWluZXIsXG4gICAgdmFsdWVzLFxuICAgIGFycm93SWNvbjoge1xuICAgICAgY29udGFpbmVyOiBhcnJvd0NvbnRhaW5lcixcbiAgICAgIGFycm93OiBhcnJvd0ljb25cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZ2VuZXJhdGVPcHRpb24gPSAob3B0aW9uOiBPcHRpb24sIG9uT3B0aW9uU2VsZWN0OiAoYTogT3B0aW9uKSA9PiB2b2lkKSA9PiB7XG4gIGNvbnN0IG9wdGlvbkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgb3B0aW9uRWwuY2xhc3NMaXN0LmFkZCgnc3Mtb3B0aW9uJylcbiAgb3B0aW9uRWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ29wdGlvbicpXG4gIG9wdGlvbkVsLmRhdGFzZXQuc3NWYWx1ZSA9IG9wdGlvbi52YWx1ZTtcbiAgXG4gIG9wdGlvbkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIG9uT3B0aW9uU2VsZWN0KG9wdGlvbik7XG4gIH0pXG4gIFxuICBpZiAob3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgb3B0aW9uRWwuY2xhc3NMaXN0LmFkZCgnc3Mtb3B0aW9uLXNlbGVjdGVkJyk7XG4gIH1cbiAgXG4gIGlmIChvcHRpb24uaW5uZXJIdG1sKSB7XG4gICAgb3B0aW9uRWwuaW5uZXJIVE1MID0gb3B0aW9uLmlubmVySHRtbDtcbiAgfSBlbHNlIHtcbiAgICBvcHRpb25FbC5pbm5lclRleHQgPSBvcHRpb24udGV4dCB8fCAnXFx4YTAnO1xuICB9XG4gIFxuICByZXR1cm4gb3B0aW9uRWw7XG59XG5cbmNvbnN0IGJ1aWxkTXVsdGlUaXRsZUJhZGdlID0gKG9wdGlvbjogT3B0aW9uLCBvblJlbW92ZU11bHRpT3B0aW9uOiBhbnkpID0+IHtcbiAgY29uc3QgYmFkZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBiYWRnZS5jbGFzc0xpc3QuYWRkKCdzcy12YWx1ZScpO1xuICBiYWRnZS5kYXRhc2V0LnZhbHVlID0gb3B0aW9uLnZhbHVlO1xuICBcbiAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICBzcGFuLmlubmVyVGV4dCA9IG9wdGlvbi50ZXh0IHx8ICdcXHhhMCc7XG4gIHNwYW4uY2xhc3NMaXN0LmFkZCgnc3MtdmFsdWUtdGV4dCcpO1xuICBcbiAgY29uc3QgZGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBkZWwuaW5uZXJUZXh0ID0gJ+Koryc7XG4gIGRlbC5jbGFzc0xpc3QuYWRkKCdzcy12YWx1ZS1kZWxldGUnKTtcbiAgZGVsLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgb25SZW1vdmVNdWx0aU9wdGlvbihvcHRpb24pO1xuICB9XG4gIFxuICBiYWRnZS5hcHBlbmRDaGlsZChzcGFuKTtcbiAgYmFkZ2UuYXBwZW5kQ2hpbGQoZGVsKTtcbiAgXG4gIHJldHVybiBiYWRnZTtcbn1cbiAgXG5cbmV4cG9ydCB7IGJ1aWxkQ29udGFpbmVyLCBidWlsZENvbnRlbnQsIGJ1aWxkU2VhcmNoLCBidWlsZFJlc3VsdHNMaXN0LCBidWlsZFNpbmdsZVNlbGVjdCwgYnVpbGRNdWx0aVNlbGVjdCwgZ2VuZXJhdGVPcHRpb24sIGJ1aWxkTXVsdGlUaXRsZUJhZGdlIH07IiwiaW1wb3J0IHtPcHRpb259IGZyb20gXCIuL21vZGVsc1wiO1xuaW1wb3J0IHtcbiAgYnVpbGRDb250YWluZXIsXG4gIGJ1aWxkQ29udGVudCxcbiAgYnVpbGRSZXN1bHRzTGlzdCxcbiAgYnVpbGRTZWFyY2gsXG4gIGJ1aWxkU2luZ2xlU2VsZWN0LFxuICBnZW5lcmF0ZU9wdGlvblxufSBmcm9tIFwiLi9kb21fZmFjdG9yeVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNpbmdsZVNlbGVjdGVkIHtcbiAgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudFxuICB0aXRsZTogSFRNTFNwYW5FbGVtZW50XG4gIGFycm93SWNvbjoge1xuICAgIGNvbnRhaW5lcjogSFRNTFNwYW5FbGVtZW50XG4gICAgYXJyb3c6IEhUTUxTcGFuRWxlbWVudFxuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VhcmNoIHtcbiAgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudFxuICBpbnB1dDogSFRNTElucHV0RWxlbWVudFxuICBhZGRhYmxlPzogSFRNTERpdkVsZW1lbnRcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgcHVibGljIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnRcbiAgcHVibGljIGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50XG4gIHB1YmxpYyBzZWFyY2g6IFNlYXJjaFxuICBwdWJsaWMgbGlzdDogSFRNTERpdkVsZW1lbnRcbiAgcHVibGljIHNpbmdsZVNlbGVjdGVkOiBTaW5nbGVTZWxlY3RlZFxuICBcbiAgcHVibGljIG9uU2VhcmNoOiBhbnlcbiAgcHVibGljIG9uQ2xvc2U6IGFueVxuICBwdWJsaWMgb25PcGVuOiBhbnlcbiAgcHVibGljIG9uT3B0aW9uU2VsZWN0OiBhbnlcbiAgcHVibGljIGlzT3BlbmVkOiBib29sZWFuXG4gIFxuICBwdWJsaWMgZWxlbWVudDogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gIFxuICBwdWJsaWMgb3JpZ2luYWxFbGVtZW50RGlzcGxheTogc3RyaW5nO1xuICBcbiAgb25Eb2N1bWVudENsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoXG4gICAgICAgIHRoaXMuaXNPcGVuZWQgJiZcbiAgICAgICAgZS50YXJnZXQgIT09IHRoaXMuc2luZ2xlU2VsZWN0ZWQudGl0bGUgJiZcbiAgICAgICAgZS50YXJnZXQgIT09IHRoaXMuc2luZ2xlU2VsZWN0ZWQuYXJyb3dJY29uLmNvbnRhaW5lciAmJlxuICAgICAgICBlLnRhcmdldCAhPT0gdGhpcy5zaW5nbGVTZWxlY3RlZC5hcnJvd0ljb24uYXJyb3cgJiZcbiAgICAgICAgZS50YXJnZXQgIT09IHRoaXMuc2luZ2xlU2VsZWN0ZWQuY29udGFpbmVyXG4gICAgKSB7XG4gICAgICB0aGlzLm9uQ2xvc2UoKTtcbiAgICB9XG4gIH1cbiAgXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZWw6IEhUTUxTZWxlY3RFbGVtZW50LFxuICAgICAgb25TZWFyY2g6IGFueSxcbiAgICAgIG9uT3B0aW9uU2VsZWN0OiBhbnksXG4gICAgICBvbkNsb3NlOiBhbnksXG4gICAgICBvbk9wZW46IGFueSxcbiAgKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWw7XG4gICAgdGhpcy5vcmlnaW5hbEVsZW1lbnREaXNwbGF5ID0gZWwuc3R5bGUuZGlzcGxheTtcbiAgICBcbiAgICB0aGlzLm9uU2VhcmNoID0gb25TZWFyY2g7XG4gICAgdGhpcy5vbk9wdGlvblNlbGVjdCA9IG9uT3B0aW9uU2VsZWN0O1xuICAgIHRoaXMub25DbG9zZSA9IG9uQ2xvc2U7XG4gICAgdGhpcy5vbk9wZW4gPSBvbk9wZW47XG4gICAgXG4gICAgdGhpcy5pc09wZW5lZCA9IGZhbHNlO1xuICAgIFxuICAgIHRoaXMuY29udGFpbmVyID0gYnVpbGRDb250YWluZXIoKTtcbiAgICBcbiAgICB0aGlzLmNvbnRlbnQgPSBidWlsZENvbnRlbnQoKTtcbiAgICB0aGlzLnNlYXJjaCA9IGJ1aWxkU2VhcmNoKHRoaXMub25TZWFyY2gpO1xuICAgIHRoaXMubGlzdCA9IGJ1aWxkUmVzdWx0c0xpc3QoKTtcbiAgICBcbiAgICBjb25zdCBvbkNsaWNrID0gKCk6IHZvaWQgPT4ge1xuICAgICAgdGhpcy5pc09wZW5lZCA/IHRoaXMub25DbG9zZSgpIDogdGhpcy5vbk9wZW4oKTtcbiAgICB9XG4gICAgdGhpcy5zaW5nbGVTZWxlY3RlZCA9IGJ1aWxkU2luZ2xlU2VsZWN0KG9uQ2xpY2spO1xuICAgIFxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuc2luZ2xlU2VsZWN0ZWQuY29udGFpbmVyKVxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udGVudClcbiAgICBcbiAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5zZWFyY2guY29udGFpbmVyKVxuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLmxpc3QpXG4gICAgXG4gICAgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBcbiAgICBpZiAoZWwucGFyZW50Tm9kZSkge1xuICAgICAgZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5jb250YWluZXIsIGVsLm5leHRTaWJsaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoaW4tc2VsZWN0OiBUaGUgZ2l2ZW4gc2VsZWN0IGVsZW1lbnQgbXVzdCBoYXZlIGEgcGFyZW50IG5vZGUnKTtcbiAgICB9XG4gICAgXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uRG9jdW1lbnRDbGljayk7XG4gIH1cblxuICBkZXN0cm95ID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gdGhpcy5vcmlnaW5hbEVsZW1lbnREaXNwbGF5O1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkRvY3VtZW50Q2xpY2spO1xuICAgIFxuICAgIGlmICh0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5jb250YWluZXIpXG4gICAgfVxuICB9XG4gIFxuICBvcGVuUGFuZWwgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5pc09wZW5lZCA9IHRydWU7XG4gICAgXG4gICAgdGhpcy5zaW5nbGVTZWxlY3RlZC5hcnJvd0ljb24uYXJyb3cuY2xhc3NMaXN0LnJlbW92ZSgnYXJyb3ctZG93bicpXG4gICAgdGhpcy5zaW5nbGVTZWxlY3RlZC5hcnJvd0ljb24uYXJyb3cuY2xhc3NMaXN0LmFkZCgnYXJyb3ctdXAnKVxuICAgICAgXG4gICAgdGhpcy5zaW5nbGVTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3Mtb3Blbi1iZWxvdycpXG4gICAgXG4gICAgdGhpcy5jb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NzLW9wZW4nKVxuICAgIFxuICAgIC8vIHNldFRpbWVvdXQgaXMgZm9yIGFuaW1hdGlvbiBjb21wbGV0aW9uXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNlYXJjaC5pbnB1dC5mb2N1cygpXG4gICAgfSwgMTAwKVxuICB9XG4gIFxuICBjbG9zZVBhbmVsID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuaXNPcGVuZWQgPSBmYWxzZTtcbiAgICB0aGlzLnNlYXJjaC5pbnB1dC52YWx1ZSA9ICcnO1xuICAgIFxuICAgIHRoaXMuc2luZ2xlU2VsZWN0ZWQuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3NzLW9wZW4tYWJvdmUnKVxuICAgIHRoaXMuc2luZ2xlU2VsZWN0ZWQuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3NzLW9wZW4tYmVsb3cnKVxuICAgIHRoaXMuc2luZ2xlU2VsZWN0ZWQuYXJyb3dJY29uLmFycm93LmNsYXNzTGlzdC5hZGQoJ2Fycm93LWRvd24nKVxuICAgIHRoaXMuc2luZ2xlU2VsZWN0ZWQuYXJyb3dJY29uLmFycm93LmNsYXNzTGlzdC5yZW1vdmUoJ2Fycm93LXVwJylcbiAgICBcbiAgICB0aGlzLmNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnc3Mtb3BlbicpXG4gIH1cbiAgXG4gIFxuICBzZXRTZWxlY3RlZCA9IChvcHRpb246IE9wdGlvbik6IHZvaWQgPT4ge1xuICAgIHRoaXMuc2luZ2xlU2VsZWN0ZWQudGl0bGUuaW5uZXJUZXh0ID0gb3B0aW9uLnRleHQ7XG4gICAgXG4gICAgQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQub3B0aW9ucykuZm9yRWFjaCgobykgPT4ge1xuICAgICAgaWYgKG8udmFsdWUgPT09IG9wdGlvbi52YWx1ZSkge1xuICAgICAgICBvLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG8uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIFxuICBzZXREaXNwbGF5TGlzdCA9IChvcHRpb25zOiBPcHRpb25bXSk6IHZvaWQgPT4ge1xuICAgIHRoaXMubGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICBvcHRpb25zLmZvckVhY2goKG9wdGlvbikgPT4gdGhpcy5saXN0LmFwcGVuZENoaWxkKGdlbmVyYXRlT3B0aW9uKG9wdGlvbiwgdGhpcy5vbk9wdGlvblNlbGVjdCkpKVxuICB9O1xuICBcbiAgc2V0RWxlbWVudE9wdGlvbnMgPSAob3B0aW9uczogT3B0aW9uW10pOiB2b2lkID0+IHtcbiAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gIFxuICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICBjb25zdCBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIG9wdC52YWx1ZSA9IG9wdGlvbi52YWx1ZTtcbiAgICAgIG9wdC5pbm5lclRleHQgPSBvcHRpb24udGV4dDtcbiAgICAgIG9wdC5zZWxlY3RlZCA9IG9wdGlvbi5zZWxlY3RlZDtcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChvcHQpO1xuICAgIH0pXG4gIH1cbiAgXG59IiwiaW1wb3J0IHtPcHRpb259IGZyb20gXCIuL21vZGVsc1wiO1xuaW1wb3J0IHtcbiAgYnVpbGRDb250YWluZXIsXG4gIGJ1aWxkQ29udGVudCxcbiAgYnVpbGRSZXN1bHRzTGlzdCxcbiAgYnVpbGRTZWFyY2gsXG4gIGJ1aWxkTXVsdGlTZWxlY3QsXG4gIGdlbmVyYXRlT3B0aW9uLFxuICBidWlsZE11bHRpVGl0bGVCYWRnZVxufSBmcm9tIFwiLi9kb21fZmFjdG9yeVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIE11bHRpU2VsZWN0ZWQge1xuICBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50XG4gIHZhbHVlczogSFRNTERpdkVsZW1lbnRcbiAgYXJyb3dJY29uOiB7XG4gICAgY29udGFpbmVyOiBIVE1MU3BhbkVsZW1lbnRcbiAgICBhcnJvdzogSFRNTFNwYW5FbGVtZW50XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZWFyY2gge1xuICBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50XG4gIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50XG4gIGFkZGFibGU/OiBIVE1MRGl2RWxlbWVudFxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpVmlldyB7XG4gIHB1YmxpYyBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50XG4gIHB1YmxpYyBjb250ZW50OiBIVE1MRGl2RWxlbWVudFxuICBwdWJsaWMgc2VhcmNoOiBTZWFyY2hcbiAgcHVibGljIGxpc3Q6IEhUTUxEaXZFbGVtZW50XG4gIHB1YmxpYyBtdWx0aVNlbGVjdGVkOiBNdWx0aVNlbGVjdGVkXG4gIFxuICBwdWJsaWMgb25TZWFyY2g6IGFueVxuICBwdWJsaWMgb25DbG9zZTogYW55XG4gIHB1YmxpYyBvbk9wZW46IGFueVxuICBwdWJsaWMgb25PcHRpb25TZWxlY3Q6IGFueVxuICBwdWJsaWMgb25SZW1vdmVNdWx0aU9wdGlvbjogYW55XG4gIHB1YmxpYyBpc09wZW5lZDogYm9vbGVhblxuICBcbiAgcHVibGljIGVsZW1lbnQ6IEhUTUxTZWxlY3RFbGVtZW50O1xuICBcbiAgcHVibGljIG9yaWdpbmFsRWxlbWVudERpc3BsYXk6IHN0cmluZztcbiAgXG4gIHRhcmdldEJlbG9uZ3NUb0NvbnRhaW5lciA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKHRhcmdldCA9PT0gdGhpcy5jb250YWluZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGFyZ2V0LnBhcmVudE5vZGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcmdldEJlbG9uZ3NUb0NvbnRhaW5lcih0YXJnZXQucGFyZW50Tm9kZSBhcyBIVE1MRWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgXG4gIG9uRG9jdW1lbnRDbGljayA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKHRoaXMuaXNPcGVuZWQgJiYgZS50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiAhdGhpcy50YXJnZXRCZWxvbmdzVG9Db250YWluZXIoZS50YXJnZXQpKSB7XG4gICAgICB0aGlzLm9uQ2xvc2UoKTtcbiAgICB9XG4gIH1cbiAgXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZWw6IEhUTUxTZWxlY3RFbGVtZW50LFxuICAgICAgb25TZWFyY2g6IGFueSxcbiAgICAgIG9uT3B0aW9uU2VsZWN0OiBhbnksXG4gICAgICBvbkNsb3NlOiBhbnksXG4gICAgICBvbk9wZW46IGFueSxcbiAgICAgIG9uUmVtb3ZlTXVsdGlPcHRpb246IGFueVxuICApIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbDtcbiAgICB0aGlzLm9yaWdpbmFsRWxlbWVudERpc3BsYXkgPSBlbC5zdHlsZS5kaXNwbGF5O1xuICAgIFxuICAgIHRoaXMub25TZWFyY2ggPSBvblNlYXJjaDtcbiAgICB0aGlzLm9uT3B0aW9uU2VsZWN0ID0gb25PcHRpb25TZWxlY3Q7XG4gICAgdGhpcy5vblJlbW92ZU11bHRpT3B0aW9uID0gb25SZW1vdmVNdWx0aU9wdGlvbjtcbiAgICB0aGlzLm9uQ2xvc2UgPSBvbkNsb3NlO1xuICAgIHRoaXMub25PcGVuID0gb25PcGVuO1xuICAgIFxuICAgIHRoaXMuaXNPcGVuZWQgPSBmYWxzZTtcbiAgICBcbiAgICB0aGlzLmNvbnRhaW5lciA9IGJ1aWxkQ29udGFpbmVyKCk7XG4gICAgXG4gICAgdGhpcy5jb250ZW50ID0gYnVpbGRDb250ZW50KCk7XG4gICAgdGhpcy5zZWFyY2ggPSBidWlsZFNlYXJjaCh0aGlzLm9uU2VhcmNoKTtcbiAgICB0aGlzLmxpc3QgPSBidWlsZFJlc3VsdHNMaXN0KCk7XG4gICAgXG4gICAgY29uc3Qgb25DbGljayA9ICgpOiB2b2lkID0+IHtcbiAgICAgIHRoaXMuaXNPcGVuZWQgPyB0aGlzLm9uQ2xvc2UoKSA6IHRoaXMub25PcGVuKCk7XG4gICAgfVxuICAgIHRoaXMubXVsdGlTZWxlY3RlZCA9IGJ1aWxkTXVsdGlTZWxlY3Qob25DbGljayk7XG4gICAgXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5tdWx0aVNlbGVjdGVkLmNvbnRhaW5lcilcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnQpXG4gICAgXG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHRoaXMuc2VhcmNoLmNvbnRhaW5lcilcbiAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5saXN0KVxuICAgIFxuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgXG4gICAgaWYgKGVsLnBhcmVudE5vZGUpIHtcbiAgICAgIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuY29udGFpbmVyLCBlbC5uZXh0U2libGluZylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGluLXNlbGVjdDogVGhlIGdpdmVuIHNlbGVjdCBlbGVtZW50IG11c3QgaGF2ZSBhIHBhcmVudCBub2RlJyk7XG4gICAgfVxuICAgIFxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkRvY3VtZW50Q2xpY2spO1xuICB9XG5cbiAgZGVzdHJveSA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IHRoaXMub3JpZ2luYWxFbGVtZW50RGlzcGxheTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25Eb2N1bWVudENsaWNrKTtcbiAgICBcbiAgICBpZiAodGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuY29udGFpbmVyKVxuICAgIH1cbiAgfVxuICBcbiAgb3BlblBhbmVsID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuaXNPcGVuZWQgPSB0cnVlO1xuICAgIFxuICAgIHRoaXMubXVsdGlTZWxlY3RlZC5hcnJvd0ljb24uYXJyb3cuY2xhc3NMaXN0LnJlbW92ZSgnYXJyb3ctZG93bicpXG4gICAgdGhpcy5tdWx0aVNlbGVjdGVkLmFycm93SWNvbi5hcnJvdy5jbGFzc0xpc3QuYWRkKCdhcnJvdy11cCcpXG4gICAgICBcbiAgICB0aGlzLm11bHRpU2VsZWN0ZWQuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLW9wZW4tYmVsb3cnKVxuICAgIFxuICAgIHRoaXMuY29udGVudC5jbGFzc0xpc3QuYWRkKCdzcy1vcGVuJylcbiAgICBcbiAgICAvLyBzZXRUaW1lb3V0IGlzIGZvciBhbmltYXRpb24gY29tcGxldGlvblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zZWFyY2guaW5wdXQuZm9jdXMoKVxuICAgIH0sIDEwMClcbiAgfVxuICBcbiAgY2xvc2VQYW5lbCA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLmlzT3BlbmVkID0gZmFsc2U7XG4gICAgdGhpcy5zZWFyY2guaW5wdXQudmFsdWUgPSAnJztcbiAgICBcbiAgICB0aGlzLm11bHRpU2VsZWN0ZWQuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3NzLW9wZW4tYWJvdmUnKVxuICAgIHRoaXMubXVsdGlTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc3Mtb3Blbi1iZWxvdycpXG4gICAgdGhpcy5tdWx0aVNlbGVjdGVkLmFycm93SWNvbi5hcnJvdy5jbGFzc0xpc3QuYWRkKCdhcnJvdy1kb3duJylcbiAgICB0aGlzLm11bHRpU2VsZWN0ZWQuYXJyb3dJY29uLmFycm93LmNsYXNzTGlzdC5yZW1vdmUoJ2Fycm93LXVwJylcbiAgICBcbiAgICB0aGlzLmNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnc3Mtb3BlbicpXG4gIH1cbiAgXG4gIFxuICBzZXRTZWxlY3RlZCA9IChvcHRpb25zOiBPcHRpb25bXSk6IHZvaWQgPT4ge1xuICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICBjb25zdCBiYWRnZSA9IGJ1aWxkTXVsdGlUaXRsZUJhZGdlKG9wdGlvbiwgdGhpcy5vblJlbW92ZU11bHRpT3B0aW9uKTtcbiAgICAgIHRoaXMubXVsdGlTZWxlY3RlZC52YWx1ZXMuYXBwZW5kQ2hpbGQoYmFkZ2UpO1xuICAgIH0pXG4gICAgXG4gICAgQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQub3B0aW9ucykuZm9yRWFjaCgobykgPT4ge1xuICAgICAgaWYgKG9wdGlvbnMuZmluZCgoeCkgPT4geC5zZWxlY3RlZCAmJiB4LnZhbHVlID09PSBvLnZhbHVlKSkge1xuICAgICAgICBvLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG8uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIFxuICBhcHBlbmRTZWxlY3RlZCA9IChvcHRpb246IE9wdGlvbik6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGJhZGdlID0gYnVpbGRNdWx0aVRpdGxlQmFkZ2Uob3B0aW9uLCB0aGlzLm9uUmVtb3ZlTXVsdGlPcHRpb24pO1xuICAgIHRoaXMubXVsdGlTZWxlY3RlZC52YWx1ZXMuYXBwZW5kQ2hpbGQoYmFkZ2UpO1xuICBcbiAgICBBcnJheS5mcm9tKHRoaXMubGlzdC5jaGlsZHJlbikuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgaWYgKHggaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiB4LmRhdGFzZXQuc3NWYWx1ZSA9PT0gb3B0aW9uLnZhbHVlKSB7XG4gICAgICAgIHguY2xhc3NMaXN0LmFkZCgnc3Mtb3B0aW9uLXNlbGVjdGVkJyk7XG4gICAgICB9XG4gICAgfSlcbiAgICBcbiAgICBjb25zdCBkb21PcHRpb24gPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5vcHRpb25zKS5maW5kKChvKSA9PiBvLnZhbHVlID09PSBvcHRpb24udmFsdWUpXG4gICAgaWYgKGRvbU9wdGlvbikge1xuICAgICAgZG9tT3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgXG4gIHJlbW92ZVNlbGVjdGVkID0gKG9wdGlvbjogT3B0aW9uKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZG9tQmFkZ2UgPSBBcnJheS5mcm9tKHRoaXMubXVsdGlTZWxlY3RlZC52YWx1ZXMuY2hpbGRyZW4pLmZpbmQoKHgpID0+IHtcbiAgICAgIHJldHVybiAoeCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSAmJiB4LmRhdGFzZXQudmFsdWUgPT09IG9wdGlvbi52YWx1ZTtcbiAgICB9KVxuICAgIFxuICAgIGlmIChkb21CYWRnZSkge1xuICAgICAgZG9tQmFkZ2UucmVtb3ZlKCk7XG4gICAgfVxuICAgIFxuICAgIEFycmF5LmZyb20odGhpcy5saXN0LmNoaWxkcmVuKS5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICBpZiAoeCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIHguZGF0YXNldC5zc1ZhbHVlID09PSBvcHRpb24udmFsdWUpIHtcbiAgICAgICAgeC5jbGFzc0xpc3QucmVtb3ZlKCdzcy1vcHRpb24tc2VsZWN0ZWQnKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIFxuICAgIGNvbnN0IGRvbU9wdGlvbiA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50Lm9wdGlvbnMpLmZpbmQoKG8pID0+IG8udmFsdWUgPT09IG9wdGlvbi52YWx1ZSlcbiAgICBpZiAoZG9tT3B0aW9uKSB7XG4gICAgICBkb21PcHRpb24uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgXG4gIHNldERpc3BsYXlMaXN0ID0gKG9wdGlvbnM6IE9wdGlvbltdKTogdm9pZCA9PiB7XG4gICAgdGhpcy5saXN0LmlubmVySFRNTCA9ICcnO1xuICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQoZ2VuZXJhdGVPcHRpb24ob3B0aW9uLCB0aGlzLm9uT3B0aW9uU2VsZWN0KSkpXG4gIH07XG4gIFxuICBzZXRFbGVtZW50T3B0aW9ucyA9IChvcHRpb25zOiBPcHRpb25bXSk6IHZvaWQgPT4ge1xuICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgXG4gICAgb3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgIGNvbnN0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0LnZhbHVlID0gb3B0aW9uLnZhbHVlO1xuICAgICAgb3B0LmlubmVyVGV4dCA9IG9wdGlvbi50ZXh0O1xuICAgICAgb3B0LnNlbGVjdGVkID0gb3B0aW9uLnNlbGVjdGVkO1xuICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG9wdCk7XG4gICAgfSlcbiAgfVxuICBcbn0iLCJpbXBvcnQge09wdGlvbn0gZnJvbSBcIi4vbW9kZWxzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdFBhcnNlciB7XG4gIHB1YmxpYyBlbDogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gIFxuICBjb25zdHJ1Y3RvcihlbDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAoIShlbCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGluLXNlbGVjdDogXCJzZWxlY3RcIiBkb20gZWxlbWVudCBtdXN0IGJlIGFuIEhUTUxTZWxlY3RFbGVtZW50Jyk7XG4gICAgfVxuICAgIHRoaXMuZWwgPSBlbDtcbiAgfVxuICBcbiAgYW5hbHl6ZSgpIHtcbiAgICBjb25zdCBpc011bHRpcGxlID0gdGhpcy5lbC5tdWx0aXBsZTtcbiAgICBjb25zdCBvcHRpb25zOiBPcHRpb25bXSA9IFtdO1xuICAgIFxuICAgIEFycmF5LmZyb20odGhpcy5lbC5vcHRpb25zKS5mb3JFYWNoKChvcHRpb246IEhUTUxPcHRpb25FbGVtZW50KSA9PiB7XG4gICAgICBvcHRpb25zLnB1c2goe3ZhbHVlOiBvcHRpb24udmFsdWUsIHRleHQ6IG9wdGlvbi50ZXh0LCBzZWxlY3RlZDogb3B0aW9uLnNlbGVjdGVkfSk7XG4gICAgfSk7XG4gICAgXG4gICAgLy8gRm9sbG93cyBkZWZhdWx0IGJyb3dzZXIgYmVoYXZpb3Igb24gY2hvb3Npbmcgd2hhdCBvcHRpb24gdG8gZGlzcGxheSBpbml0aWFsbHk6XG4gICAgLy8gTGFzdCBvZiB0aGUgc2VsZWN0ZWQgb3IgdGhlIGZpcnN0IG9uZSAob25seSBmb3Igc2luZ2xlIHNlbGVjdHMpLlxuICAgIGxldCBkZWZhdWx0U2luZ2xlT3B0aW9uO1xuICAgIFxuICAgIG9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgaWYgKG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICBkZWZhdWx0U2luZ2xlT3B0aW9uID0gb3B0aW9uO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIGRlZmF1bHRTaW5nbGVPcHRpb24gPSBkZWZhdWx0U2luZ2xlT3B0aW9uIHx8IG9wdGlvbnNbMF07XG4gICAgXG4gICAgcmV0dXJuICh7XG4gICAgICBpc011bHRpcGxlLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIGRlZmF1bHRTaW5nbGVPcHRpb25cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IFwiLi4vc3R5bGVzL3RoaW4tc2VsZWN0LnNjc3NcIlxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vdmlld1wiO1xuaW1wb3J0IE11bHRpVmlldyBmcm9tIFwiLi9tdWx0aXBsZV92aWV3XCI7XG5pbXBvcnQgU2VsZWN0UGFyc2VyIGZyb20gXCIuL3NlbGVjdF9wYXJzZXJcIjtcbmltcG9ydCB7T3B0aW9ufSBmcm9tIFwiLi9tb2RlbHNcIlxuXG5pbnRlcmZhY2UgVGhpblNlbGVjdFBhcmFtcyB7XG4gIHNlbGVjdDogc3RyaW5nIHwgSFRNTFNlbGVjdEVsZW1lbnQ7XG4gIGFqYXg/OiAoaW5wdXRUZXh0OiBzdHJpbmcsIGNhbGxiYWNrOiAoZGF0YTogT3B0aW9uW10pID0+IHZvaWQpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRoaW5TZWxlY3Qge1xuICBwdWJsaWMgdmlldzogVmlldyB8IE11bHRpVmlldztcbiAgcHVibGljIGRpc3BsYXllZE9wdGlvbnNMaXN0OiBPcHRpb25bXTtcbiAgcHVibGljIGlzU2VhcmNoaW5nOiBib29sZWFuO1xuICBwdWJsaWMgYWpheDogKChpbnB1dFRleHQ6IHN0cmluZywgY2FsbGJhY2s6IChkYXRhOiBPcHRpb25bXSkgPT4gdm9pZCkgPT4gdm9pZCkgfCB1bmRlZmluZWQ7XG4gIFxuICBjb25zdHJ1Y3RvcihwYXJhbXM6IFRoaW5TZWxlY3RQYXJhbXMpIHtcbiAgICBjb25zdCBlbDogSFRNTFNlbGVjdEVsZW1lbnQgPSB0eXBlb2YgKHBhcmFtcy5zZWxlY3QpID09PSBcInN0cmluZ1wiID8gKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGFyYW1zLnNlbGVjdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQpIDogcGFyYW1zLnNlbGVjdDtcbiAgICBcbiAgICBjb25zdCBpbml0aWFsU2VsZWN0SW5mbyA9IChuZXcgU2VsZWN0UGFyc2VyKGVsKSkuYW5hbHl6ZSgpO1xuICAgIFxuICAgIHRoaXMuaXNTZWFyY2hpbmcgPSBmYWxzZTtcbiAgICBcbiAgICBpZiAoaW5pdGlhbFNlbGVjdEluZm8uaXNNdWx0aXBsZSkge1xuICAgICAgdGhpcy52aWV3ID0gbmV3IE11bHRpVmlldyhcbiAgICAgICAgICBlbCxcbiAgICAgICAgICB0aGlzLm9uU2VhcmNoLFxuICAgICAgICAgIHRoaXMub25PcHRpb25TZWxlY3QsXG4gICAgICAgICAgdGhpcy5jbG9zZVBhbmVsLFxuICAgICAgICAgIHRoaXMub3BlblBhbmVsLFxuICAgICAgICAgIHRoaXMub25SZW1vdmVNdWx0aU9wdGlvblxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3ID0gbmV3IFZpZXcoXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgdGhpcy5vblNlYXJjaCxcbiAgICAgICAgICB0aGlzLm9uT3B0aW9uU2VsZWN0LFxuICAgICAgICAgIHRoaXMuY2xvc2VQYW5lbCxcbiAgICAgICAgICB0aGlzLm9wZW5QYW5lbCxcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QgPSBpbml0aWFsU2VsZWN0SW5mby5vcHRpb25zO1xuICAgIFxuICAgIGlmICghcGFyYW1zLmFqYXgpIHtcbiAgICAgIHRoaXMudmlldy5zZXREaXNwbGF5TGlzdCh0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0KTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMudmlldyBpbnN0YW5jZW9mIE11bHRpVmlldykge1xuICAgICAgdGhpcy52aWV3LnNldFNlbGVjdGVkKGluaXRpYWxTZWxlY3RJbmZvLm9wdGlvbnMuZmlsdGVyKG9wdGlvbiA9PiBvcHRpb24uc2VsZWN0ZWQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3LnNldFNlbGVjdGVkKGluaXRpYWxTZWxlY3RJbmZvLmRlZmF1bHRTaW5nbGVPcHRpb24pO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmFqYXggPSBwYXJhbXMuYWpheDtcbiAgfVxuICBcbiAgZGVzdHJveSA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLnZpZXcuZGVzdHJveSgpO1xuICB9XG4gIFxuICBvblNlYXJjaCA9ICh0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICB0aGlzLmlzU2VhcmNoaW5nID0gdHJ1ZTtcbiAgICBcbiAgICBpZiAodGhpcy5hamF4KSB7XG4gICAgICB0aGlzLmFqYXgodGV4dCwgKGRhdGE6IE9wdGlvbltdKSA9PiB7XG4gICAgICAgIGRhdGEuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0LmZpbmQoKHEpID0+IHEuc2VsZWN0ZWQgJiYgcS52YWx1ZSA9PT0geC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHguc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdCA9IGRhdGE7XG4gICAgICAgIHRoaXMudmlldy5zZXRFbGVtZW50T3B0aW9ucyhkYXRhKTtcbiAgICAgICAgdGhpcy52aWV3LnNldERpc3BsYXlMaXN0KGRhdGEpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1hdGNoZWRPcHRpb25zID0gdGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdC5maWx0ZXIob3B0aW9uID0+IHRoaXMuc2VhcmNoRmlsdGVyKG9wdGlvbi50ZXh0LCB0ZXh0KSk7XG4gICAgICB0aGlzLnZpZXcuc2V0RGlzcGxheUxpc3QobWF0Y2hlZE9wdGlvbnMpO1xuICAgIH1cbiAgfVxuICBcbiAgY2xvc2VQYW5lbCA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLnZpZXcuY2xvc2VQYW5lbCgpO1xuICAgIFxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy52aWV3LnNldERpc3BsYXlMaXN0KHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QpO1xuICAgIH0sIDEwMCk7XG4gICAgdGhpcy5pc1NlYXJjaGluZyA9IGZhbHNlO1xuICB9XG4gIFxuICBvcGVuUGFuZWwgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy52aWV3Lm9wZW5QYW5lbCgpO1xuICB9XG4gIFxuICBvbk9wdGlvblNlbGVjdCA9IChvcHRpb246IE9wdGlvbik6IHZvaWQgPT4ge1xuICAgIGlmICh0aGlzLnZpZXcgaW5zdGFuY2VvZiBNdWx0aVZpZXcpIHtcbiAgICAgIGlmIChvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudmlldy5yZW1vdmVTZWxlY3RlZChvcHRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy52aWV3LmFwcGVuZFNlbGVjdGVkKG9wdGlvbik7XG4gICAgICB9XG4gICAgXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldy5zZXRTZWxlY3RlZChvcHRpb24pO1xuICAgICAgXG4gICAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0LmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgaWYgKHgudmFsdWUgPT09IG9wdGlvbi52YWx1ZSkge1xuICAgICAgICAgIHguc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHguc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuY2xvc2VQYW5lbCgpO1xuICAgIH1cbiAgfVxuICBcbiAgb25SZW1vdmVNdWx0aU9wdGlvbiA9IChvcHRpb246IE9wdGlvbik6IHZvaWQgPT4ge1xuICAgIGlmICh0aGlzLnZpZXcgaW5zdGFuY2VvZiBNdWx0aVZpZXcpIHtcbiAgICAgIHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICBpZiAoeC52YWx1ZSA9PT0gb3B0aW9uLnZhbHVlKSB7XG4gICAgICAgICAgeC5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KVxuICBcbiAgICAgIHRoaXMudmlldy5yZW1vdmVTZWxlY3RlZChvcHRpb24pO1xuICAgICAgdGhpcy52aWV3LnNldERpc3BsYXlMaXN0KHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QpO1xuICAgIH1cbiAgfVxuICBcbiAgc2VhcmNoRmlsdGVyID0gKG9wdGlvblRleHQ6IHN0cmluZywgaW5wdXRUZXh0OiBzdHJpbmcpIDogYm9vbGVhbiA9PiB7XG4gICAgcmV0dXJuIG9wdGlvblRleHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKGlucHV0VGV4dC50b0xvd2VyQ2FzZSgpKSAhPT0gLTE7XG4gIH1cbiAgXG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsTUFBTSxjQUFjLEdBQUcsTUFBSztJQUMxQixNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hELElBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkMsSUFBQSxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDLENBQUE7QUFFRCxNQUFNLFlBQVksR0FBRyxNQUFLO0lBQ3hCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUMsSUFBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNwQyxJQUFBLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMsQ0FBQTtBQUVELE1BQU0sV0FBVyxHQUFHLENBQUMsUUFBZ0MsS0FBSTtJQUN2RCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQy9DLElBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUU3QyxJQUFBLE1BQU0sWUFBWSxHQUFXO1FB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
