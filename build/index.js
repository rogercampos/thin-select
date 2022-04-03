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
    del.innerText = 'x';
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
    onDocumentClick = (e) => {
        if (this.isOpened &&
            e.target !== this.multiSelected.values &&
            e.target !== this.multiSelected.arrowIcon.container &&
            e.target !== this.multiSelected.arrowIcon.arrow &&
            e.target !== this.multiSelected.container &&
            (e.target instanceof HTMLElement && !e.target.classList.contains('ss-value-text') && !e.target.classList.contains('ss-value'))) {
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
        }
        this.closePanel();
    };
    onRemoveMultiOption = (option) => {
        if (this.view instanceof MultiView) {
            option.selected = false;
            this.view.removeSelected(option);
            this.view.setDisplayList(this.displayedOptionsList);
        }
    };
    searchFilter = (optionText, inputText) => {
        return optionText.toLowerCase().indexOf(inputText.toLowerCase()) !== -1;
    };
}

export { ThinSelect as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9kb21fZmFjdG9yeS50cyIsIi4uL3NyYy92aWV3LnRzIiwiLi4vc3JjL211bHRpcGxlX3ZpZXcudHMiLCIuLi9zcmMvc2VsZWN0X3BhcnNlci50cyIsIi4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge09wdGlvbn0gZnJvbSBcIi4vbW9kZWxzXCJcbmltcG9ydCB7IFNlYXJjaCwgU2luZ2xlU2VsZWN0ZWQgfSBmcm9tIFwiLi92aWV3XCI7XG5pbXBvcnQgeyBNdWx0aVNlbGVjdGVkIH0gZnJvbSBcIi4vbXVsdGlwbGVfdmlld1wiO1xuXG5jb25zdCBidWlsZENvbnRhaW5lciA9ICgpID0+IHtcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1tYWluJyk7XG4gIHJldHVybiBjb250YWluZXI7XG59XG5cbmNvbnN0IGJ1aWxkQ29udGVudCA9ICgpID0+IHtcbiAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NzLWNvbnRlbnQnKTtcbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbmNvbnN0IGJ1aWxkU2VhcmNoID0gKG9uU2VhcmNoOiAodGV4dDogc3RyaW5nKSA9PiB2b2lkKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1zZWFyY2gnKTtcbiAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpXG4gIFxuICBjb25zdCBzZWFyY2hSZXR1cm46IFNlYXJjaCA9IHtcbiAgICBjb250YWluZXIsXG4gICAgaW5wdXRcbiAgfVxuICBcbiAgaW5wdXQudHlwZSA9ICdzZWFyY2gnXG4gIGlucHV0LnRhYkluZGV4ID0gMFxuICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBcIlNlYXJjaC4uLlwiKVxuICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2F1dG9jYXBpdGFsaXplJywgJ29mZicpXG4gIGlucHV0LnNldEF0dHJpYnV0ZSgnYXV0b2NvbXBsZXRlJywgJ29mZicpXG4gIGlucHV0LnNldEF0dHJpYnV0ZSgnYXV0b2NvcnJlY3QnLCAnb2ZmJylcbiAgXG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgIG9uU2VhcmNoKGlucHV0LnZhbHVlKTtcbiAgfSlcbiAgXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpbnB1dClcbiAgXG4gIHJldHVybiBzZWFyY2hSZXR1cm47XG59XG5cblxuY29uc3QgYnVpbGRSZXN1bHRzTGlzdCA9ICgpID0+IHtcbiAgY29uc3QgbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGxpc3QuY2xhc3NMaXN0LmFkZCgnc3MtbGlzdCcpXG4gIGxpc3Quc2V0QXR0cmlidXRlKCdyb2xlJywgJ2xpc3Rib3gnKVxuICByZXR1cm4gbGlzdDtcbn1cblxuXG5jb25zdCBidWlsZFNpbmdsZVNlbGVjdCA9IChvbkNsaWNrOiAoKSA9PiB2b2lkKTogU2luZ2xlU2VsZWN0ZWQgPT4ge1xuICBjb25zdCBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLXNpbmdsZS1zZWxlY3RlZCcpXG4gIFxuICAvLyBUaXRsZSB0ZXh0XG4gIGNvbnN0IHRpdGxlOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgdGl0bGUuY2xhc3NMaXN0LmFkZCgncGxhY2Vob2xkZXInKVxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpXG4gIFxuICAvLyBBcnJvd1xuICBjb25zdCBhcnJvd0NvbnRhaW5lcjogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gIGFycm93Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLWFycm93JylcbiAgXG4gIGNvbnN0IGFycm93SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICBhcnJvd0ljb24uY2xhc3NMaXN0LmFkZCgnYXJyb3ctZG93bicpXG4gIGFycm93Q29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93SWNvbilcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93Q29udGFpbmVyKVxuICBcbiAgY29udGFpbmVyLm9uY2xpY2sgPSBvbkNsaWNrO1xuICBcbiAgcmV0dXJuIHtcbiAgICBjb250YWluZXIsXG4gICAgdGl0bGUsXG4gICAgYXJyb3dJY29uOiB7XG4gICAgICBjb250YWluZXI6IGFycm93Q29udGFpbmVyLFxuICAgICAgYXJyb3c6IGFycm93SWNvblxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBidWlsZE11bHRpU2VsZWN0ID0gKG9uQ2xpY2s6ICgpID0+IHZvaWQpOiBNdWx0aVNlbGVjdGVkID0+IHtcbiAgY29uc3QgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1tdWx0aS1zZWxlY3RlZCcpXG4gIFxuICAvLyB2YWx1ZXNcbiAgY29uc3QgdmFsdWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgdmFsdWVzLmNsYXNzTGlzdC5hZGQoJ3NzLXZhbHVlcycpXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh2YWx1ZXMpXG4gIFxuICAvLyBBcnJvd1xuICBjb25zdCBhcnJvd0NvbnRhaW5lcjogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gIGFycm93Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLWFycm93JylcbiAgXG4gIGNvbnN0IGFycm93SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICBhcnJvd0ljb24uY2xhc3NMaXN0LmFkZCgnYXJyb3ctZG93bicpXG4gIGFycm93Q29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93SWNvbilcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93Q29udGFpbmVyKVxuICBcbiAgY29udGFpbmVyLm9uY2xpY2sgPSBvbkNsaWNrO1xuICBcbiAgcmV0dXJuIHtcbiAgICBjb250YWluZXIsXG4gICAgdmFsdWVzLFxuICAgIGFycm93SWNvbjoge1xuICAgICAgY29udGFpbmVyOiBhcnJvd0NvbnRhaW5lcixcbiAgICAgIGFycm93OiBhcnJvd0ljb25cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZ2VuZXJhdGVPcHRpb24gPSAob3B0aW9uOiBPcHRpb24sIG9uT3B0aW9uU2VsZWN0OiAoYTogT3B0aW9uKSA9PiB2b2lkKSA9PiB7XG4gIGNvbnN0IG9wdGlvbkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgb3B0aW9uRWwuY2xhc3NMaXN0LmFkZCgnc3Mtb3B0aW9uJylcbiAgb3B0aW9uRWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ29wdGlvbicpXG4gIFxuICBvcHRpb25FbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBvbk9wdGlvblNlbGVjdChvcHRpb24pO1xuICB9KVxuICBcbiAgaWYgKG9wdGlvbi5zZWxlY3RlZCkge1xuICAgIG9wdGlvbkVsLmNsYXNzTGlzdC5hZGQoJ3NzLW9wdGlvbi1zZWxlY3RlZCcpO1xuICB9XG4gIFxuICBpZiAob3B0aW9uLmlubmVySHRtbCkge1xuICAgIG9wdGlvbkVsLmlubmVySFRNTCA9IG9wdGlvbi5pbm5lckh0bWw7XG4gIH0gZWxzZSB7XG4gICAgb3B0aW9uRWwuaW5uZXJUZXh0ID0gb3B0aW9uLnRleHQgfHwgJ1xceGEwJztcbiAgfVxuICBcbiAgcmV0dXJuIG9wdGlvbkVsO1xufVxuXG5jb25zdCBidWlsZE11bHRpVGl0bGVCYWRnZSA9IChvcHRpb246IE9wdGlvbiwgb25SZW1vdmVNdWx0aU9wdGlvbjogYW55KSA9PiB7XG4gIGNvbnN0IGJhZGdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgYmFkZ2UuY2xhc3NMaXN0LmFkZCgnc3MtdmFsdWUnKTtcbiAgYmFkZ2UuZGF0YXNldC52YWx1ZSA9IG9wdGlvbi52YWx1ZTtcbiAgXG4gIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgc3Bhbi5pbm5lclRleHQgPSBvcHRpb24udGV4dCB8fCAnXFx4YTAnO1xuICBzcGFuLmNsYXNzTGlzdC5hZGQoJ3NzLXZhbHVlLXRleHQnKTtcbiAgXG4gIGNvbnN0IGRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgZGVsLmlubmVyVGV4dCA9ICd4JztcbiAgZGVsLmNsYXNzTGlzdC5hZGQoJ3NzLXZhbHVlLWRlbGV0ZScpO1xuICBkZWwub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBvblJlbW92ZU11bHRpT3B0aW9uKG9wdGlvbik7XG4gIH1cbiAgXG4gIGJhZGdlLmFwcGVuZENoaWxkKHNwYW4pO1xuICBiYWRnZS5hcHBlbmRDaGlsZChkZWwpO1xuICBcbiAgcmV0dXJuIGJhZGdlO1xufVxuICBcblxuZXhwb3J0IHsgYnVpbGRDb250YWluZXIsIGJ1aWxkQ29udGVudCwgYnVpbGRTZWFyY2gsIGJ1aWxkUmVzdWx0c0xpc3QsIGJ1aWxkU2luZ2xlU2VsZWN0LCBidWlsZE11bHRpU2VsZWN0LCBnZW5lcmF0ZU9wdGlvbiwgYnVpbGRNdWx0aVRpdGxlQmFkZ2UgfTsiLCJpbXBvcnQge09wdGlvbn0gZnJvbSBcIi4vbW9kZWxzXCI7XG5pbXBvcnQge1xuICBidWlsZENvbnRhaW5lcixcbiAgYnVpbGRDb250ZW50LFxuICBidWlsZFJlc3VsdHNMaXN0LFxuICBidWlsZFNlYXJjaCxcbiAgYnVpbGRTaW5nbGVTZWxlY3QsXG4gIGdlbmVyYXRlT3B0aW9uXG59IGZyb20gXCIuL2RvbV9mYWN0b3J5XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2luZ2xlU2VsZWN0ZWQge1xuICBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50XG4gIHRpdGxlOiBIVE1MU3BhbkVsZW1lbnRcbiAgYXJyb3dJY29uOiB7XG4gICAgY29udGFpbmVyOiBIVE1MU3BhbkVsZW1lbnRcbiAgICBhcnJvdzogSFRNTFNwYW5FbGVtZW50XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZWFyY2gge1xuICBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50XG4gIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50XG4gIGFkZGFibGU/OiBIVE1MRGl2RWxlbWVudFxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcge1xuICBwdWJsaWMgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudFxuICBwdWJsaWMgY29udGVudDogSFRNTERpdkVsZW1lbnRcbiAgcHVibGljIHNlYXJjaDogU2VhcmNoXG4gIHB1YmxpYyBsaXN0OiBIVE1MRGl2RWxlbWVudFxuICBwdWJsaWMgc2luZ2xlU2VsZWN0ZWQ6IFNpbmdsZVNlbGVjdGVkXG4gIFxuICBwdWJsaWMgb25TZWFyY2g6IGFueVxuICBwdWJsaWMgb25DbG9zZTogYW55XG4gIHB1YmxpYyBvbk9wZW46IGFueVxuICBwdWJsaWMgb25PcHRpb25TZWxlY3Q6IGFueVxuICBwdWJsaWMgaXNPcGVuZWQ6IGJvb2xlYW5cbiAgXG4gIHB1YmxpYyBlbGVtZW50OiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgXG4gIHB1YmxpYyBvcmlnaW5hbEVsZW1lbnREaXNwbGF5OiBzdHJpbmc7XG4gIFxuICBvbkRvY3VtZW50Q2xpY2sgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGlmIChcbiAgICAgICAgdGhpcy5pc09wZW5lZCAmJlxuICAgICAgICBlLnRhcmdldCAhPT0gdGhpcy5zaW5nbGVTZWxlY3RlZC50aXRsZSAmJlxuICAgICAgICBlLnRhcmdldCAhPT0gdGhpcy5zaW5nbGVTZWxlY3RlZC5hcnJvd0ljb24uY29udGFpbmVyICYmXG4gICAgICAgIGUudGFyZ2V0ICE9PSB0aGlzLnNpbmdsZVNlbGVjdGVkLmFycm93SWNvbi5hcnJvdyAmJlxuICAgICAgICBlLnRhcmdldCAhPT0gdGhpcy5zaW5nbGVTZWxlY3RlZC5jb250YWluZXJcbiAgICApIHtcbiAgICAgIHRoaXMub25DbG9zZSgpO1xuICAgIH1cbiAgfVxuICBcbiAgY29uc3RydWN0b3IoXG4gICAgICBlbDogSFRNTFNlbGVjdEVsZW1lbnQsXG4gICAgICBvblNlYXJjaDogYW55LFxuICAgICAgb25PcHRpb25TZWxlY3Q6IGFueSxcbiAgICAgIG9uQ2xvc2U6IGFueSxcbiAgICAgIG9uT3BlbjogYW55LFxuICApIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbDtcbiAgICB0aGlzLm9yaWdpbmFsRWxlbWVudERpc3BsYXkgPSBlbC5zdHlsZS5kaXNwbGF5O1xuICAgIFxuICAgIHRoaXMub25TZWFyY2ggPSBvblNlYXJjaDtcbiAgICB0aGlzLm9uT3B0aW9uU2VsZWN0ID0gb25PcHRpb25TZWxlY3Q7XG4gICAgdGhpcy5vbkNsb3NlID0gb25DbG9zZTtcbiAgICB0aGlzLm9uT3BlbiA9IG9uT3BlbjtcbiAgICBcbiAgICB0aGlzLmlzT3BlbmVkID0gZmFsc2U7XG4gICAgXG4gICAgdGhpcy5jb250YWluZXIgPSBidWlsZENvbnRhaW5lcigpO1xuICAgIFxuICAgIHRoaXMuY29udGVudCA9IGJ1aWxkQ29udGVudCgpO1xuICAgIHRoaXMuc2VhcmNoID0gYnVpbGRTZWFyY2godGhpcy5vblNlYXJjaCk7XG4gICAgdGhpcy5saXN0ID0gYnVpbGRSZXN1bHRzTGlzdCgpO1xuICAgIFxuICAgIGNvbnN0IG9uQ2xpY2sgPSAoKTogdm9pZCA9PiB7XG4gICAgICB0aGlzLmlzT3BlbmVkID8gdGhpcy5vbkNsb3NlKCkgOiB0aGlzLm9uT3BlbigpO1xuICAgIH1cbiAgICB0aGlzLnNpbmdsZVNlbGVjdGVkID0gYnVpbGRTaW5nbGVTZWxlY3Qob25DbGljayk7XG4gICAgXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5zaW5nbGVTZWxlY3RlZC5jb250YWluZXIpXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50KVxuICAgIFxuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnNlYXJjaC5jb250YWluZXIpXG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHRoaXMubGlzdClcbiAgICBcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIFxuICAgIGlmIChlbC5wYXJlbnROb2RlKSB7XG4gICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmNvbnRhaW5lciwgZWwubmV4dFNpYmxpbmcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndGhpbi1zZWxlY3Q6IFRoZSBnaXZlbiBzZWxlY3QgZWxlbWVudCBtdXN0IGhhdmUgYSBwYXJlbnQgbm9kZScpO1xuICAgIH1cbiAgICBcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25Eb2N1bWVudENsaWNrKTtcbiAgfVxuXG4gIGRlc3Ryb3kgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSB0aGlzLm9yaWdpbmFsRWxlbWVudERpc3BsYXk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uRG9jdW1lbnRDbGljayk7XG4gICAgXG4gICAgaWYgKHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmNvbnRhaW5lcilcbiAgICB9XG4gIH1cbiAgXG4gIG9wZW5QYW5lbCA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLmlzT3BlbmVkID0gdHJ1ZTtcbiAgICBcbiAgICB0aGlzLnNpbmdsZVNlbGVjdGVkLmFycm93SWNvbi5hcnJvdy5jbGFzc0xpc3QucmVtb3ZlKCdhcnJvdy1kb3duJylcbiAgICB0aGlzLnNpbmdsZVNlbGVjdGVkLmFycm93SWNvbi5hcnJvdy5jbGFzc0xpc3QuYWRkKCdhcnJvdy11cCcpXG4gICAgICBcbiAgICB0aGlzLnNpbmdsZVNlbGVjdGVkLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1vcGVuLWJlbG93JylcbiAgICBcbiAgICB0aGlzLmNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc3Mtb3BlbicpXG4gICAgXG4gICAgLy8gc2V0VGltZW91dCBpcyBmb3IgYW5pbWF0aW9uIGNvbXBsZXRpb25cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2VhcmNoLmlucHV0LmZvY3VzKClcbiAgICB9LCAxMDApXG4gIH1cbiAgXG4gIGNsb3NlUGFuZWwgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5pc09wZW5lZCA9IGZhbHNlO1xuICAgIHRoaXMuc2VhcmNoLmlucHV0LnZhbHVlID0gJyc7XG4gICAgXG4gICAgdGhpcy5zaW5nbGVTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc3Mtb3Blbi1hYm92ZScpXG4gICAgdGhpcy5zaW5nbGVTZWxlY3RlZC5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc3Mtb3Blbi1iZWxvdycpXG4gICAgdGhpcy5zaW5nbGVTZWxlY3RlZC5hcnJvd0ljb24uYXJyb3cuY2xhc3NMaXN0LmFkZCgnYXJyb3ctZG93bicpXG4gICAgdGhpcy5zaW5nbGVTZWxlY3RlZC5hcnJvd0ljb24uYXJyb3cuY2xhc3NMaXN0LnJlbW92ZSgnYXJyb3ctdXAnKVxuICAgIFxuICAgIHRoaXMuY29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdzcy1vcGVuJylcbiAgfVxuICBcbiAgXG4gIHNldFNlbGVjdGVkID0gKG9wdGlvbjogT3B0aW9uKTogdm9pZCA9PiB7XG4gICAgdGhpcy5zaW5nbGVTZWxlY3RlZC50aXRsZS5pbm5lclRleHQgPSBvcHRpb24udGV4dDtcbiAgICBcbiAgICBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5vcHRpb25zKS5mb3JFYWNoKChvKSA9PiB7XG4gICAgICBpZiAoby52YWx1ZSA9PT0gb3B0aW9uLnZhbHVlKSB7XG4gICAgICAgIG8uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgby5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgXG4gIHNldERpc3BsYXlMaXN0ID0gKG9wdGlvbnM6IE9wdGlvbltdKTogdm9pZCA9PiB7XG4gICAgdGhpcy5saXN0LmlubmVySFRNTCA9ICcnO1xuICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQoZ2VuZXJhdGVPcHRpb24ob3B0aW9uLCB0aGlzLm9uT3B0aW9uU2VsZWN0KSkpXG4gIH07XG4gIFxuICBzZXRFbGVtZW50T3B0aW9ucyA9IChvcHRpb25zOiBPcHRpb25bXSk6IHZvaWQgPT4ge1xuICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgXG4gICAgb3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgIGNvbnN0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0LnZhbHVlID0gb3B0aW9uLnZhbHVlO1xuICAgICAgb3B0LmlubmVyVGV4dCA9IG9wdGlvbi50ZXh0O1xuICAgICAgb3B0LnNlbGVjdGVkID0gb3B0aW9uLnNlbGVjdGVkO1xuICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG9wdCk7XG4gICAgfSlcbiAgfVxuICBcbn0iLCJpbXBvcnQge09wdGlvbn0gZnJvbSBcIi4vbW9kZWxzXCI7XG5pbXBvcnQge1xuICBidWlsZENvbnRhaW5lcixcbiAgYnVpbGRDb250ZW50LFxuICBidWlsZFJlc3VsdHNMaXN0LFxuICBidWlsZFNlYXJjaCxcbiAgYnVpbGRNdWx0aVNlbGVjdCxcbiAgZ2VuZXJhdGVPcHRpb24sXG4gIGJ1aWxkTXVsdGlUaXRsZUJhZGdlXG59IGZyb20gXCIuL2RvbV9mYWN0b3J5XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTXVsdGlTZWxlY3RlZCB7XG4gIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnRcbiAgdmFsdWVzOiBIVE1MRGl2RWxlbWVudFxuICBhcnJvd0ljb246IHtcbiAgICBjb250YWluZXI6IEhUTUxTcGFuRWxlbWVudFxuICAgIGFycm93OiBIVE1MU3BhbkVsZW1lbnRcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlYXJjaCB7XG4gIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnRcbiAgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnRcbiAgYWRkYWJsZT86IEhUTUxEaXZFbGVtZW50XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGlWaWV3IHtcbiAgcHVibGljIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnRcbiAgcHVibGljIGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50XG4gIHB1YmxpYyBzZWFyY2g6IFNlYXJjaFxuICBwdWJsaWMgbGlzdDogSFRNTERpdkVsZW1lbnRcbiAgcHVibGljIG11bHRpU2VsZWN0ZWQ6IE11bHRpU2VsZWN0ZWRcbiAgXG4gIHB1YmxpYyBvblNlYXJjaDogYW55XG4gIHB1YmxpYyBvbkNsb3NlOiBhbnlcbiAgcHVibGljIG9uT3BlbjogYW55XG4gIHB1YmxpYyBvbk9wdGlvblNlbGVjdDogYW55XG4gIHB1YmxpYyBvblJlbW92ZU11bHRpT3B0aW9uOiBhbnlcbiAgcHVibGljIGlzT3BlbmVkOiBib29sZWFuXG4gIFxuICBwdWJsaWMgZWxlbWVudDogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gIFxuICBwdWJsaWMgb3JpZ2luYWxFbGVtZW50RGlzcGxheTogc3RyaW5nO1xuICBcbiAgb25Eb2N1bWVudENsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoXG4gICAgICAgIHRoaXMuaXNPcGVuZWQgJiZcbiAgICAgICAgZS50YXJnZXQgIT09IHRoaXMubXVsdGlTZWxlY3RlZC52YWx1ZXMgJiZcbiAgICAgICAgZS50YXJnZXQgIT09IHRoaXMubXVsdGlTZWxlY3RlZC5hcnJvd0ljb24uY29udGFpbmVyICYmXG4gICAgICAgIGUudGFyZ2V0ICE9PSB0aGlzLm11bHRpU2VsZWN0ZWQuYXJyb3dJY29uLmFycm93ICYmXG4gICAgICAgIGUudGFyZ2V0ICE9PSB0aGlzLm11bHRpU2VsZWN0ZWQuY29udGFpbmVyICYmXG4gICAgICAgIChlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmICFlLnRhcmdldCEuY2xhc3NMaXN0LmNvbnRhaW5zKCdzcy12YWx1ZS10ZXh0JykgJiYgIWUudGFyZ2V0IS5jbGFzc0xpc3QuY29udGFpbnMoJ3NzLXZhbHVlJykgKVxuICAgICkge1xuICAgICAgdGhpcy5vbkNsb3NlKCk7XG4gICAgfVxuICB9XG4gIFxuICBjb25zdHJ1Y3RvcihcbiAgICAgIGVsOiBIVE1MU2VsZWN0RWxlbWVudCxcbiAgICAgIG9uU2VhcmNoOiBhbnksXG4gICAgICBvbk9wdGlvblNlbGVjdDogYW55LFxuICAgICAgb25DbG9zZTogYW55LFxuICAgICAgb25PcGVuOiBhbnksXG4gICAgICBvblJlbW92ZU11bHRpT3B0aW9uOiBhbnlcbiAgKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWw7XG4gICAgdGhpcy5vcmlnaW5hbEVsZW1lbnREaXNwbGF5ID0gZWwuc3R5bGUuZGlzcGxheTtcbiAgICBcbiAgICB0aGlzLm9uU2VhcmNoID0gb25TZWFyY2g7XG4gICAgdGhpcy5vbk9wdGlvblNlbGVjdCA9IG9uT3B0aW9uU2VsZWN0O1xuICAgIHRoaXMub25SZW1vdmVNdWx0aU9wdGlvbiA9IG9uUmVtb3ZlTXVsdGlPcHRpb247XG4gICAgdGhpcy5vbkNsb3NlID0gb25DbG9zZTtcbiAgICB0aGlzLm9uT3BlbiA9IG9uT3BlbjtcbiAgICBcbiAgICB0aGlzLmlzT3BlbmVkID0gZmFsc2U7XG4gICAgXG4gICAgdGhpcy5jb250YWluZXIgPSBidWlsZENvbnRhaW5lcigpO1xuICAgIFxuICAgIHRoaXMuY29udGVudCA9IGJ1aWxkQ29udGVudCgpO1xuICAgIHRoaXMuc2VhcmNoID0gYnVpbGRTZWFyY2godGhpcy5vblNlYXJjaCk7XG4gICAgdGhpcy5saXN0ID0gYnVpbGRSZXN1bHRzTGlzdCgpO1xuICAgIFxuICAgIGNvbnN0IG9uQ2xpY2sgPSAoKTogdm9pZCA9PiB7XG4gICAgICB0aGlzLmlzT3BlbmVkID8gdGhpcy5vbkNsb3NlKCkgOiB0aGlzLm9uT3BlbigpO1xuICAgIH1cbiAgICB0aGlzLm11bHRpU2VsZWN0ZWQgPSBidWlsZE11bHRpU2VsZWN0KG9uQ2xpY2spO1xuICAgIFxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubXVsdGlTZWxlY3RlZC5jb250YWluZXIpXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50KVxuICAgIFxuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnNlYXJjaC5jb250YWluZXIpXG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHRoaXMubGlzdClcbiAgICBcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIFxuICAgIGlmIChlbC5wYXJlbnROb2RlKSB7XG4gICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmNvbnRhaW5lciwgZWwubmV4dFNpYmxpbmcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndGhpbi1zZWxlY3Q6IFRoZSBnaXZlbiBzZWxlY3QgZWxlbWVudCBtdXN0IGhhdmUgYSBwYXJlbnQgbm9kZScpO1xuICAgIH1cbiAgICBcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25Eb2N1bWVudENsaWNrKTtcbiAgfVxuXG4gIGRlc3Ryb3kgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSB0aGlzLm9yaWdpbmFsRWxlbWVudERpc3BsYXk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uRG9jdW1lbnRDbGljayk7XG4gICAgXG4gICAgaWYgKHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmNvbnRhaW5lcilcbiAgICB9XG4gIH1cbiAgXG4gIG9wZW5QYW5lbCA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLmlzT3BlbmVkID0gdHJ1ZTtcbiAgICBcbiAgICB0aGlzLm11bHRpU2VsZWN0ZWQuYXJyb3dJY29uLmFycm93LmNsYXNzTGlzdC5yZW1vdmUoJ2Fycm93LWRvd24nKVxuICAgIHRoaXMubXVsdGlTZWxlY3RlZC5hcnJvd0ljb24uYXJyb3cuY2xhc3NMaXN0LmFkZCgnYXJyb3ctdXAnKVxuICAgICAgXG4gICAgdGhpcy5tdWx0aVNlbGVjdGVkLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1vcGVuLWJlbG93JylcbiAgICBcbiAgICB0aGlzLmNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc3Mtb3BlbicpXG4gICAgXG4gICAgLy8gc2V0VGltZW91dCBpcyBmb3IgYW5pbWF0aW9uIGNvbXBsZXRpb25cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2VhcmNoLmlucHV0LmZvY3VzKClcbiAgICB9LCAxMDApXG4gIH1cbiAgXG4gIGNsb3NlUGFuZWwgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5pc09wZW5lZCA9IGZhbHNlO1xuICAgIHRoaXMuc2VhcmNoLmlucHV0LnZhbHVlID0gJyc7XG4gICAgXG4gICAgdGhpcy5tdWx0aVNlbGVjdGVkLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzcy1vcGVuLWFib3ZlJylcbiAgICB0aGlzLm11bHRpU2VsZWN0ZWQuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3NzLW9wZW4tYmVsb3cnKVxuICAgIHRoaXMubXVsdGlTZWxlY3RlZC5hcnJvd0ljb24uYXJyb3cuY2xhc3NMaXN0LmFkZCgnYXJyb3ctZG93bicpXG4gICAgdGhpcy5tdWx0aVNlbGVjdGVkLmFycm93SWNvbi5hcnJvdy5jbGFzc0xpc3QucmVtb3ZlKCdhcnJvdy11cCcpXG4gICAgXG4gICAgdGhpcy5jb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3NzLW9wZW4nKVxuICB9XG4gIFxuICBcbiAgc2V0U2VsZWN0ZWQgPSAob3B0aW9uczogT3B0aW9uW10pOiB2b2lkID0+IHtcbiAgICBvcHRpb25zLmZvckVhY2goKG9wdGlvbikgPT4ge1xuICAgICAgY29uc3QgYmFkZ2UgPSBidWlsZE11bHRpVGl0bGVCYWRnZShvcHRpb24sIHRoaXMub25SZW1vdmVNdWx0aU9wdGlvbik7XG4gICAgICB0aGlzLm11bHRpU2VsZWN0ZWQudmFsdWVzLmFwcGVuZENoaWxkKGJhZGdlKTtcbiAgICB9KVxuICAgIFxuICAgIEFycmF5LmZyb20odGhpcy5lbGVtZW50Lm9wdGlvbnMpLmZvckVhY2goKG8pID0+IHtcbiAgICAgIGlmIChvcHRpb25zLmZpbmQoKHgpID0+IHguc2VsZWN0ZWQgJiYgeC52YWx1ZSA9PT0gby52YWx1ZSkpIHtcbiAgICAgICAgby5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBcbiAgYXBwZW5kU2VsZWN0ZWQgPSAob3B0aW9uOiBPcHRpb24pOiB2b2lkID0+IHtcbiAgICBjb25zdCBiYWRnZSA9IGJ1aWxkTXVsdGlUaXRsZUJhZGdlKG9wdGlvbiwgdGhpcy5vblJlbW92ZU11bHRpT3B0aW9uKTtcbiAgICB0aGlzLm11bHRpU2VsZWN0ZWQudmFsdWVzLmFwcGVuZENoaWxkKGJhZGdlKTtcbiAgXG4gICAgY29uc3QgZG9tT3B0aW9uID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQub3B0aW9ucykuZmluZCgobykgPT4gby52YWx1ZSA9PT0gb3B0aW9uLnZhbHVlKVxuICAgIGlmIChkb21PcHRpb24pIHtcbiAgICAgIGRvbU9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIFxuICByZW1vdmVTZWxlY3RlZCA9IChvcHRpb246IE9wdGlvbik6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGRvbUJhZGdlID0gQXJyYXkuZnJvbSh0aGlzLm11bHRpU2VsZWN0ZWQudmFsdWVzLmNoaWxkcmVuKS5maW5kKCh4KSA9PiB7XG4gICAgICByZXR1cm4gKHggaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgJiYgeC5kYXRhc2V0LnZhbHVlID09PSBvcHRpb24udmFsdWU7XG4gICAgfSlcbiAgICBcbiAgICBpZiAoZG9tQmFkZ2UpIHtcbiAgICAgIGRvbUJhZGdlLnJlbW92ZSgpO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBkb21PcHRpb24gPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5vcHRpb25zKS5maW5kKChvKSA9PiBvLnZhbHVlID09PSBvcHRpb24udmFsdWUpXG4gICAgaWYgKGRvbU9wdGlvbikge1xuICAgICAgZG9tT3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIFxuICBzZXREaXNwbGF5TGlzdCA9IChvcHRpb25zOiBPcHRpb25bXSk6IHZvaWQgPT4ge1xuICAgIHRoaXMubGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICBvcHRpb25zLmZvckVhY2goKG9wdGlvbikgPT4gdGhpcy5saXN0LmFwcGVuZENoaWxkKGdlbmVyYXRlT3B0aW9uKG9wdGlvbiwgdGhpcy5vbk9wdGlvblNlbGVjdCkpKVxuICB9O1xuICBcbiAgc2V0RWxlbWVudE9wdGlvbnMgPSAob3B0aW9uczogT3B0aW9uW10pOiB2b2lkID0+IHtcbiAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gIFxuICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICBjb25zdCBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIG9wdC52YWx1ZSA9IG9wdGlvbi52YWx1ZTtcbiAgICAgIG9wdC5pbm5lclRleHQgPSBvcHRpb24udGV4dDtcbiAgICAgIG9wdC5zZWxlY3RlZCA9IG9wdGlvbi5zZWxlY3RlZDtcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChvcHQpO1xuICAgIH0pXG4gIH1cbiAgXG59IiwiaW1wb3J0IHtPcHRpb259IGZyb20gXCIuL21vZGVsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3RQYXJzZXIge1xuICBwdWJsaWMgZWw6IEhUTUxTZWxlY3RFbGVtZW50O1xuICBcbiAgY29uc3RydWN0b3IoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKCEoZWwgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndGhpbi1zZWxlY3Q6IFwic2VsZWN0XCIgZG9tIGVsZW1lbnQgbXVzdCBiZSBhbiBIVE1MU2VsZWN0RWxlbWVudCcpO1xuICAgIH1cbiAgICB0aGlzLmVsID0gZWw7XG4gIH1cbiAgXG4gIGFuYWx5emUoKSB7XG4gICAgY29uc3QgaXNNdWx0aXBsZSA9IHRoaXMuZWwubXVsdGlwbGU7XG4gICAgY29uc3Qgb3B0aW9uczogT3B0aW9uW10gPSBbXTtcbiAgICBcbiAgICBBcnJheS5mcm9tKHRoaXMuZWwub3B0aW9ucykuZm9yRWFjaCgob3B0aW9uOiBIVE1MT3B0aW9uRWxlbWVudCkgPT4ge1xuICAgICAgb3B0aW9ucy5wdXNoKHt2YWx1ZTogb3B0aW9uLnZhbHVlLCB0ZXh0OiBvcHRpb24udGV4dCwgc2VsZWN0ZWQ6IG9wdGlvbi5zZWxlY3RlZH0pO1xuICAgIH0pO1xuICAgIFxuICAgIC8vIEZvbGxvd3MgZGVmYXVsdCBicm93c2VyIGJlaGF2aW9yIG9uIGNob29zaW5nIHdoYXQgb3B0aW9uIHRvIGRpc3BsYXkgaW5pdGlhbGx5OlxuICAgIC8vIExhc3Qgb2YgdGhlIHNlbGVjdGVkIG9yIHRoZSBmaXJzdCBvbmUgKG9ubHkgZm9yIHNpbmdsZSBzZWxlY3RzKS5cbiAgICBsZXQgZGVmYXVsdFNpbmdsZU9wdGlvbjtcbiAgICBcbiAgICBvcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgIGlmIChvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgZGVmYXVsdFNpbmdsZU9wdGlvbiA9IG9wdGlvbjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICBkZWZhdWx0U2luZ2xlT3B0aW9uID0gZGVmYXVsdFNpbmdsZU9wdGlvbiB8fCBvcHRpb25zWzBdO1xuICAgIFxuICAgIHJldHVybiAoe1xuICAgICAgaXNNdWx0aXBsZSxcbiAgICAgIG9wdGlvbnMsXG4gICAgICBkZWZhdWx0U2luZ2xlT3B0aW9uXG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBcIi4uL3N0eWxlcy90aGluLXNlbGVjdC5zY3NzXCJcbmltcG9ydCBWaWV3IGZyb20gXCIuL3ZpZXdcIjtcbmltcG9ydCBNdWx0aVZpZXcgZnJvbSBcIi4vbXVsdGlwbGVfdmlld1wiO1xuaW1wb3J0IFNlbGVjdFBhcnNlciBmcm9tIFwiLi9zZWxlY3RfcGFyc2VyXCI7XG5pbXBvcnQge09wdGlvbn0gZnJvbSBcIi4vbW9kZWxzXCJcblxuaW50ZXJmYWNlIFRoaW5TZWxlY3RQYXJhbXMge1xuICBzZWxlY3Q6IHN0cmluZyB8IEhUTUxTZWxlY3RFbGVtZW50O1xuICBhamF4PzogKGlucHV0VGV4dDogc3RyaW5nLCBjYWxsYmFjazogKGRhdGE6IE9wdGlvbltdKSA9PiB2b2lkKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaGluU2VsZWN0IHtcbiAgcHVibGljIHZpZXc6IFZpZXcgfCBNdWx0aVZpZXc7XG4gIHB1YmxpYyBkaXNwbGF5ZWRPcHRpb25zTGlzdDogT3B0aW9uW107XG4gIHB1YmxpYyBpc1NlYXJjaGluZzogYm9vbGVhbjtcbiAgcHVibGljIGFqYXg6ICgoaW5wdXRUZXh0OiBzdHJpbmcsIGNhbGxiYWNrOiAoZGF0YTogT3B0aW9uW10pID0+IHZvaWQpID0+IHZvaWQpIHwgdW5kZWZpbmVkO1xuICBcbiAgY29uc3RydWN0b3IocGFyYW1zOiBUaGluU2VsZWN0UGFyYW1zKSB7XG4gICAgY29uc3QgZWw6IEhUTUxTZWxlY3RFbGVtZW50ID0gdHlwZW9mIChwYXJhbXMuc2VsZWN0KSA9PT0gXCJzdHJpbmdcIiA/IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhcmFtcy5zZWxlY3QpIGFzIEhUTUxTZWxlY3RFbGVtZW50KSA6IHBhcmFtcy5zZWxlY3Q7XG4gICAgXG4gICAgY29uc3QgaW5pdGlhbFNlbGVjdEluZm8gPSAobmV3IFNlbGVjdFBhcnNlcihlbCkpLmFuYWx5emUoKTtcbiAgICBcbiAgICB0aGlzLmlzU2VhcmNoaW5nID0gZmFsc2U7XG4gICAgXG4gICAgaWYgKGluaXRpYWxTZWxlY3RJbmZvLmlzTXVsdGlwbGUpIHtcbiAgICAgIHRoaXMudmlldyA9IG5ldyBNdWx0aVZpZXcoXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgdGhpcy5vblNlYXJjaCxcbiAgICAgICAgICB0aGlzLm9uT3B0aW9uU2VsZWN0LFxuICAgICAgICAgIHRoaXMuY2xvc2VQYW5lbCxcbiAgICAgICAgICB0aGlzLm9wZW5QYW5lbCxcbiAgICAgICAgICB0aGlzLm9uUmVtb3ZlTXVsdGlPcHRpb25cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldyA9IG5ldyBWaWV3KFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIHRoaXMub25TZWFyY2gsXG4gICAgICAgICAgdGhpcy5vbk9wdGlvblNlbGVjdCxcbiAgICAgICAgICB0aGlzLmNsb3NlUGFuZWwsXG4gICAgICAgICAgdGhpcy5vcGVuUGFuZWwsXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0ID0gaW5pdGlhbFNlbGVjdEluZm8ub3B0aW9ucztcbiAgICBcbiAgICBpZiAoIXBhcmFtcy5hamF4KSB7XG4gICAgICB0aGlzLnZpZXcuc2V0RGlzcGxheUxpc3QodGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdCk7XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnZpZXcgaW5zdGFuY2VvZiBNdWx0aVZpZXcpIHtcbiAgICAgIHRoaXMudmlldy5zZXRTZWxlY3RlZChpbml0aWFsU2VsZWN0SW5mby5vcHRpb25zLmZpbHRlcihvcHRpb24gPT4gb3B0aW9uLnNlbGVjdGVkKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldy5zZXRTZWxlY3RlZChpbml0aWFsU2VsZWN0SW5mby5kZWZhdWx0U2luZ2xlT3B0aW9uKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5hamF4ID0gcGFyYW1zLmFqYXg7XG4gIH1cbiAgXG4gIGRlc3Ryb3kgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy52aWV3LmRlc3Ryb3koKTtcbiAgfVxuICBcbiAgb25TZWFyY2ggPSAodGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgdGhpcy5pc1NlYXJjaGluZyA9IHRydWU7XG4gICAgXG4gICAgaWYgKHRoaXMuYWpheCkge1xuICAgICAgdGhpcy5hamF4KHRleHQsIChkYXRhOiBPcHRpb25bXSkgPT4ge1xuICAgICAgICBkYXRhLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdC5maW5kKChxKSA9PiBxLnNlbGVjdGVkICYmIHEudmFsdWUgPT09IHgudmFsdWUpKSB7XG4gICAgICAgICAgICB4LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QgPSBkYXRhO1xuICAgICAgICB0aGlzLnZpZXcuc2V0RWxlbWVudE9wdGlvbnMoZGF0YSk7XG4gICAgICAgIHRoaXMudmlldy5zZXREaXNwbGF5TGlzdChkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtYXRjaGVkT3B0aW9ucyA9IHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QuZmlsdGVyKG9wdGlvbiA9PiB0aGlzLnNlYXJjaEZpbHRlcihvcHRpb24udGV4dCwgdGV4dCkpO1xuICAgICAgdGhpcy52aWV3LnNldERpc3BsYXlMaXN0KG1hdGNoZWRPcHRpb25zKTtcbiAgICB9XG4gIH1cbiAgXG4gIGNsb3NlUGFuZWwgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy52aWV3LmNsb3NlUGFuZWwoKTtcbiAgICBcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudmlldy5zZXREaXNwbGF5TGlzdCh0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0KTtcbiAgICB9LCAxMDApO1xuICAgIHRoaXMuaXNTZWFyY2hpbmcgPSBmYWxzZTtcbiAgfVxuICBcbiAgb3BlblBhbmVsID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMudmlldy5vcGVuUGFuZWwoKTtcbiAgfVxuICBcbiAgb25PcHRpb25TZWxlY3QgPSAob3B0aW9uOiBPcHRpb24pOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy52aWV3IGluc3RhbmNlb2YgTXVsdGlWaWV3KSB7XG4gICAgICBpZiAob3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnZpZXcucmVtb3ZlU2VsZWN0ZWQob3B0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMudmlldy5hcHBlbmRTZWxlY3RlZChvcHRpb24pO1xuICAgICAgfVxuICAgIFxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXcuc2V0U2VsZWN0ZWQob3B0aW9uKTtcbiAgICAgIFxuICAgICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdC5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgIGlmICh4LnZhbHVlID09PSBvcHRpb24udmFsdWUpIHtcbiAgICAgICAgICB4LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB4LnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIFxuICAgIHRoaXMuY2xvc2VQYW5lbCgpO1xuICB9XG4gIFxuICBvblJlbW92ZU11bHRpT3B0aW9uID0gKG9wdGlvbjogT3B0aW9uKTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMudmlldyBpbnN0YW5jZW9mIE11bHRpVmlldykge1xuICAgICAgb3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnZpZXcucmVtb3ZlU2VsZWN0ZWQob3B0aW9uKTtcbiAgICAgIHRoaXMudmlldy5zZXREaXNwbGF5TGlzdCh0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0KTtcbiAgICB9XG4gIH1cbiAgXG4gIHNlYXJjaEZpbHRlciA9IChvcHRpb25UZXh0OiBzdHJpbmcsIGlucHV0VGV4dDogc3RyaW5nKSA6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiBvcHRpb25UZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihpbnB1dFRleHQudG9Mb3dlckNhc2UoKSkgIT09IC0xO1xuICB9XG4gIFxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE1BQU0sY0FBYyxHQUFHLE1BQUs7SUFDMUIsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxJQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25DLElBQUEsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyxDQUFBO0FBRUQsTUFBTSxZQUFZLEdBQUcsTUFBSztJQUN4QixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMs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
