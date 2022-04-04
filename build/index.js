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
    input.placeholder = 'Search';
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
        type: 'single',
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
        type: 'multi',
        container,
        values,
        arrowIcon: {
            container: arrowContainer,
            arrow: arrowIcon
        }
    };
};
const buildOption = (option, onOptionSelect) => {
    const optionEl = document.createElement('div');
    optionEl.classList.add('ss-option');
    if (option.innerHtml) {
        optionEl.classList.add('ss-custom-html');
    }
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
    titleBar;
    onSearch;
    onClose;
    onOpen;
    onOptionSelect;
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
    onClickOverTitle = () => {
        this.isOpened ? this.onClose() : this.onOpen();
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
        this.titleBar.arrowIcon.arrow.classList.remove('arrow-down');
        this.titleBar.arrowIcon.arrow.classList.add('arrow-up');
        this.titleBar.container.classList.add('ss-open-below');
        this.content.classList.add('ss-open');
        // setTimeout is for animation completion
        setTimeout(() => {
            this.search.input.focus();
        }, 100);
    };
    closePanel = () => {
        this.isOpened = false;
        this.search.input.value = '';
        this.titleBar.container.classList.remove('ss-open-above');
        this.titleBar.container.classList.remove('ss-open-below');
        this.titleBar.arrowIcon.arrow.classList.add('arrow-down');
        this.titleBar.arrowIcon.arrow.classList.remove('arrow-up');
        this.content.classList.remove('ss-open');
    };
    setDisplayList = (options) => {
        this.list.innerHTML = '';
        options.forEach((option) => this.list.appendChild(buildOption(option, this.onOptionSelect)));
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

class SingleView extends View {
    constructor(el, onSearch, onOptionSelect, onClose, onOpen) {
        super(el, onSearch, onOptionSelect, onClose, onOpen);
        this.content = buildContent();
        this.search = buildSearch(this.onSearch);
        this.list = buildResultsList();
        this.titleBar = buildSingleSelect(this.onClickOverTitle);
        this.container.appendChild(this.titleBar.container);
        this.container.appendChild(this.content);
        this.content.appendChild(this.search.container);
        this.content.appendChild(this.list);
    }
    setSelected = (option) => {
        if (this.titleBar.type === 'single') {
            this.titleBar.title.innerText = option.text;
        }
        Array.from(this.element.options).forEach((o) => {
            if (o.value === option.value) {
                o.selected = true;
            }
            else {
                o.selected = false;
            }
        });
        this.element.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    };
}

class MultiView extends View {
    onRemoveMultiOption;
    constructor(el, onSearch, onOptionSelect, onClose, onOpen, onRemoveMultiOption) {
        super(el, onSearch, onOptionSelect, onClose, onOpen);
        this.onRemoveMultiOption = onRemoveMultiOption;
        this.content = buildContent();
        this.search = buildSearch(this.onSearch);
        this.list = buildResultsList();
        this.titleBar = buildMultiSelect(this.onClickOverTitle);
        this.container.appendChild(this.titleBar.container);
        this.container.appendChild(this.content);
        this.content.appendChild(this.search.container);
        this.content.appendChild(this.list);
    }
    setSelected = (options) => {
        options.forEach((option) => {
            const badge = buildMultiTitleBadge(option, this.onRemoveMultiOption);
            if (this.titleBar.type === 'multi') {
                this.titleBar.values.appendChild(badge);
            }
        });
        Array.from(this.element.options).forEach((o) => {
            if (options.find((x) => x.selected && x.value === o.value)) {
                o.selected = true;
            }
            else {
                o.selected = false;
            }
        });
        this.element.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    };
    appendSelected = (option) => {
        if (this.titleBar.type === 'multi') {
            const badge = buildMultiTitleBadge(option, this.onRemoveMultiOption);
            this.titleBar.values.appendChild(badge);
            Array.from(this.list.children).forEach((x) => {
                if (x instanceof HTMLElement && x.dataset.ssValue === option.value) {
                    x.classList.add('ss-option-selected');
                }
            });
            const domOption = Array.from(this.element.options).find((o) => o.value === option.value);
            if (domOption) {
                domOption.selected = true;
            }
            else {
                const newOption = document.createElement('option');
                newOption.value = option.value;
                newOption.innerText = option.text;
                newOption.selected = true;
                this.element.appendChild(newOption);
            }
            this.element.dispatchEvent(new CustomEvent('change', { bubbles: true }));
        }
    };
    removeSelected = (option) => {
        if (this.titleBar.type === 'multi') {
            const domBadge = Array.from(this.titleBar.values.children).find((x) => {
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
            this.element.dispatchEvent(new CustomEvent('change', { bubbles: true }));
        }
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
            this.view = new SingleView(el, this.onSearch, this.onOptionSelect, this.closePanel, this.openPanel);
        }
        this.displayedOptionsList = initialSelectInfo.options;
        if (!params.ajax) {
            this.view.setDisplayList(this.displayedOptionsList);
        }
        if (this.view instanceof MultiView) {
            this.view.setSelected(initialSelectInfo.options.filter(option => option.selected));
        }
        else if (initialSelectInfo.defaultSingleOption) {
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
                if (data) {
                    data.forEach((x) => {
                        if (this.displayedOptionsList.find((q) => q.selected && q.value === x.value)) {
                            x.selected = true;
                        }
                    });
                    this.displayedOptionsList = data;
                    this.view.setElementOptions(data);
                    this.view.setDisplayList(data);
                }
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
                x.selected = (x.value === option.value);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9kb21fZmFjdG9yeS50cyIsIi4uL3NyYy92aWV3LnRzIiwiLi4vc3JjL3NpbmdsZV92aWV3LnRzIiwiLi4vc3JjL211bHRpcGxlX3ZpZXcudHMiLCIuLi9zcmMvc2VsZWN0X3BhcnNlci50cyIsIi4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge29uUmVtb3ZlTXVsdGlPcHRpb25UeXBlLCBvblNlYXJjaFR5cGUsIE9wdGlvbiwgU2VhcmNoLCBTaW5nbGVTZWxlY3RlZCwgTXVsdGlTZWxlY3RlZCB9IGZyb20gXCIuL21vZGVsc1wiXG5cbmNvbnN0IGJ1aWxkQ29udGFpbmVyID0gKCkgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLW1haW4nKTtcbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuY29uc3QgYnVpbGRDb250ZW50ID0gKCkgPT4ge1xuICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc3MtY29udGVudCcpO1xuICByZXR1cm4gY29udGVudDtcbn1cblxuY29uc3QgYnVpbGRTZWFyY2ggPSAob25TZWFyY2g6IG9uU2VhcmNoVHlwZSkgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3Mtc2VhcmNoJyk7XG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKVxuICBcbiAgY29uc3Qgc2VhcmNoUmV0dXJuOiBTZWFyY2ggPSB7XG4gICAgY29udGFpbmVyLFxuICAgIGlucHV0XG4gIH1cbiAgXG4gIGlucHV0LnR5cGUgPSAnc2VhcmNoJ1xuICBpbnB1dC50YWJJbmRleCA9IDBcbiAgaW5wdXQucGxhY2Vob2xkZXIgPSAnU2VhcmNoJ1xuICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBcIlNlYXJjaC4uLlwiKVxuICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2F1dG9jYXBpdGFsaXplJywgJ29mZicpXG4gIGlucHV0LnNldEF0dHJpYnV0ZSgnYXV0b2NvbXBsZXRlJywgJ29mZicpXG4gIGlucHV0LnNldEF0dHJpYnV0ZSgnYXV0b2NvcnJlY3QnLCAnb2ZmJylcbiAgXG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgIG9uU2VhcmNoKGlucHV0LnZhbHVlKTtcbiAgfSlcbiAgXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpbnB1dClcbiAgXG4gIHJldHVybiBzZWFyY2hSZXR1cm47XG59XG5cblxuY29uc3QgYnVpbGRSZXN1bHRzTGlzdCA9ICgpID0+IHtcbiAgY29uc3QgbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGxpc3QuY2xhc3NMaXN0LmFkZCgnc3MtbGlzdCcpXG4gIGxpc3Quc2V0QXR0cmlidXRlKCdyb2xlJywgJ2xpc3Rib3gnKVxuICByZXR1cm4gbGlzdDtcbn1cblxuXG5jb25zdCBidWlsZFNpbmdsZVNlbGVjdCA9IChvbkNsaWNrOiAoKSA9PiB2b2lkKTogU2luZ2xlU2VsZWN0ZWQgPT4ge1xuICBjb25zdCBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLXNpbmdsZS1zZWxlY3RlZCcpXG4gIFxuICAvLyBUaXRsZSB0ZXh0XG4gIGNvbnN0IHRpdGxlOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgdGl0bGUuY2xhc3NMaXN0LmFkZCgncGxhY2Vob2xkZXInKVxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpXG4gIFxuICAvLyBBcnJvd1xuICBjb25zdCBhcnJvd0NvbnRhaW5lcjogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gIGFycm93Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLWFycm93JylcbiAgXG4gIGNvbnN0IGFycm93SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICBhcnJvd0ljb24uY2xhc3NMaXN0LmFkZCgnYXJyb3ctZG93bicpXG4gIGFycm93Q29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93SWNvbilcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93Q29udGFpbmVyKVxuICBcbiAgY29udGFpbmVyLm9uY2xpY2sgPSBvbkNsaWNrO1xuICBcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnc2luZ2xlJyxcbiAgICBjb250YWluZXIsXG4gICAgdGl0bGUsXG4gICAgYXJyb3dJY29uOiB7XG4gICAgICBjb250YWluZXI6IGFycm93Q29udGFpbmVyLFxuICAgICAgYXJyb3c6IGFycm93SWNvblxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBidWlsZE11bHRpU2VsZWN0ID0gKG9uQ2xpY2s6ICgpID0+IHZvaWQpOiBNdWx0aVNlbGVjdGVkID0+IHtcbiAgY29uc3QgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1tdWx0aS1zZWxlY3RlZCcpXG4gIFxuICAvLyB2YWx1ZXNcbiAgY29uc3QgdmFsdWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgdmFsdWVzLmNsYXNzTGlzdC5hZGQoJ3NzLXZhbHVlcycpXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh2YWx1ZXMpXG4gIFxuICAvLyBBcnJvd1xuICBjb25zdCBhcnJvd0NvbnRhaW5lcjogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gIGFycm93Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLWFycm93JylcbiAgXG4gIGNvbnN0IGFycm93SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICBhcnJvd0ljb24uY2xhc3NMaXN0LmFkZCgnYXJyb3ctZG93bicpXG4gIGFycm93Q29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93SWNvbilcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93Q29udGFpbmVyKVxuICBcbiAgY29udGFpbmVyLm9uY2xpY2sgPSBvbkNsaWNrO1xuICBcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnbXVsdGknLFxuICAgIGNvbnRhaW5lcixcbiAgICB2YWx1ZXMsXG4gICAgYXJyb3dJY29uOiB7XG4gICAgICBjb250YWluZXI6IGFycm93Q29udGFpbmVyLFxuICAgICAgYXJyb3c6IGFycm93SWNvblxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBidWlsZE9wdGlvbiA9IChvcHRpb246IE9wdGlvbiwgb25PcHRpb25TZWxlY3Q6IChhOiBPcHRpb24pID0+IHZvaWQpID0+IHtcbiAgY29uc3Qgb3B0aW9uRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBvcHRpb25FbC5jbGFzc0xpc3QuYWRkKCdzcy1vcHRpb24nKVxuICBpZiAob3B0aW9uLmlubmVySHRtbCkge1xuICAgIG9wdGlvbkVsLmNsYXNzTGlzdC5hZGQoJ3NzLWN1c3RvbS1odG1sJylcbiAgfVxuICBvcHRpb25FbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnb3B0aW9uJylcbiAgb3B0aW9uRWwuZGF0YXNldC5zc1ZhbHVlID0gb3B0aW9uLnZhbHVlO1xuICBcbiAgb3B0aW9uRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgb25PcHRpb25TZWxlY3Qob3B0aW9uKTtcbiAgfSlcbiAgXG4gIGlmIChvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICBvcHRpb25FbC5jbGFzc0xpc3QuYWRkKCdzcy1vcHRpb24tc2VsZWN0ZWQnKTtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbi5pbm5lckh0bWwpIHtcbiAgICBvcHRpb25FbC5pbm5lckhUTUwgPSBvcHRpb24uaW5uZXJIdG1sO1xuICB9IGVsc2Uge1xuICAgIG9wdGlvbkVsLmlubmVyVGV4dCA9IG9wdGlvbi50ZXh0IHx8ICdcXHhhMCc7XG4gIH1cbiAgXG4gIHJldHVybiBvcHRpb25FbDtcbn1cblxuY29uc3QgYnVpbGRNdWx0aVRpdGxlQmFkZ2UgPSAob3B0aW9uOiBPcHRpb24sIG9uUmVtb3ZlTXVsdGlPcHRpb246IG9uUmVtb3ZlTXVsdGlPcHRpb25UeXBlKSA9PiB7XG4gIGNvbnN0IGJhZGdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgYmFkZ2UuY2xhc3NMaXN0LmFkZCgnc3MtdmFsdWUnKTtcbiAgYmFkZ2UuZGF0YXNldC52YWx1ZSA9IG9wdGlvbi52YWx1ZTtcbiAgXG4gIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgc3Bhbi5pbm5lclRleHQgPSBvcHRpb24udGV4dCB8fCAnXFx4YTAnO1xuICBzcGFuLmNsYXNzTGlzdC5hZGQoJ3NzLXZhbHVlLXRleHQnKTtcbiAgXG4gIGNvbnN0IGRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgZGVsLmlubmVyVGV4dCA9ICfiqK8nO1xuICBkZWwuY2xhc3NMaXN0LmFkZCgnc3MtdmFsdWUtZGVsZXRlJyk7XG4gIGRlbC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIG9uUmVtb3ZlTXVsdGlPcHRpb24ob3B0aW9uKTtcbiAgfVxuICBcbiAgYmFkZ2UuYXBwZW5kQ2hpbGQoc3Bhbik7XG4gIGJhZGdlLmFwcGVuZENoaWxkKGRlbCk7XG4gIFxuICByZXR1cm4gYmFkZ2U7XG59XG4gIFxuXG5leHBvcnQgeyBidWlsZENvbnRhaW5lciwgYnVpbGRDb250ZW50LCBidWlsZFNlYXJjaCwgYnVpbGRSZXN1bHRzTGlzdCwgYnVpbGRTaW5nbGVTZWxlY3QsIGJ1aWxkTXVsdGlTZWxlY3QsIGJ1aWxkT3B0aW9uLCBidWlsZE11bHRpVGl0bGVCYWRnZSB9OyIsImltcG9ydCB7b25DbG9zZVR5cGUsIG9uT3BlblR5cGUsIG9uT3B0aW9uU2VsZWN0VHlwZSwgb25TZWFyY2hUeXBlLCBPcHRpb24sIFNlYXJjaCwgU2luZ2xlU2VsZWN0ZWQsIE11bHRpU2VsZWN0ZWQgfSBmcm9tIFwiLi9tb2RlbHNcIjtcbmltcG9ydCB7XG4gIGJ1aWxkQ29udGFpbmVyLFxuICBidWlsZE9wdGlvblxufSBmcm9tIFwiLi9kb21fZmFjdG9yeVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgcHVibGljIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnRcbiAgcHVibGljIGNvbnRlbnQhOiBIVE1MRGl2RWxlbWVudFxuICBwdWJsaWMgc2VhcmNoITogU2VhcmNoXG4gIHB1YmxpYyBsaXN0ITogSFRNTERpdkVsZW1lbnRcbiAgcHVibGljIHRpdGxlQmFyITogU2luZ2xlU2VsZWN0ZWQgfCBNdWx0aVNlbGVjdGVkXG4gIFxuICBwdWJsaWMgb25TZWFyY2g6IG9uU2VhcmNoVHlwZVxuICBwdWJsaWMgb25DbG9zZTogb25DbG9zZVR5cGVcbiAgcHVibGljIG9uT3Blbjogb25PcGVuVHlwZVxuICBwdWJsaWMgb25PcHRpb25TZWxlY3Q6IG9uT3B0aW9uU2VsZWN0VHlwZVxuICBwdWJsaWMgaXNPcGVuZWQ6IGJvb2xlYW5cbiAgXG4gIHB1YmxpYyBlbGVtZW50OiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgXG4gIHB1YmxpYyBvcmlnaW5hbEVsZW1lbnREaXNwbGF5OiBzdHJpbmc7XG4gIFxuICB0YXJnZXRCZWxvbmdzVG9Db250YWluZXIgPSAodGFyZ2V0OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICh0YXJnZXQgPT09IHRoaXMuY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgICByZXR1cm4gdGhpcy50YXJnZXRCZWxvbmdzVG9Db250YWluZXIodGFyZ2V0LnBhcmVudE5vZGUgYXMgSFRNTEVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIFxuICBvbkRvY3VtZW50Q2xpY2sgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLmlzT3BlbmVkICYmIGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgIXRoaXMudGFyZ2V0QmVsb25nc1RvQ29udGFpbmVyKGUudGFyZ2V0KSkge1xuICAgICAgdGhpcy5vbkNsb3NlKCk7XG4gICAgfVxuICB9XG4gIFxuICBvbkNsaWNrT3ZlclRpdGxlID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuaXNPcGVuZWQgPyB0aGlzLm9uQ2xvc2UoKSA6IHRoaXMub25PcGVuKCk7XG4gIH1cbiAgXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZWw6IEhUTUxTZWxlY3RFbGVtZW50LFxuICAgICAgb25TZWFyY2g6IG9uU2VhcmNoVHlwZSxcbiAgICAgIG9uT3B0aW9uU2VsZWN0OiBvbk9wdGlvblNlbGVjdFR5cGUsXG4gICAgICBvbkNsb3NlOiBvbkNsb3NlVHlwZSxcbiAgICAgIG9uT3Blbjogb25PcGVuVHlwZSxcbiAgKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWw7XG4gICAgdGhpcy5vcmlnaW5hbEVsZW1lbnREaXNwbGF5ID0gZWwuc3R5bGUuZGlzcGxheTtcbiAgICBcbiAgICB0aGlzLm9uU2VhcmNoID0gb25TZWFyY2g7XG4gICAgdGhpcy5vbk9wdGlvblNlbGVjdCA9IG9uT3B0aW9uU2VsZWN0O1xuICAgIHRoaXMub25DbG9zZSA9IG9uQ2xvc2U7XG4gICAgdGhpcy5vbk9wZW4gPSBvbk9wZW47XG4gICAgXG4gICAgdGhpcy5pc09wZW5lZCA9IGZhbHNlO1xuICAgIFxuICAgIHRoaXMuY29udGFpbmVyID0gYnVpbGRDb250YWluZXIoKTtcbiAgICBcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIFxuICAgIGlmIChlbC5wYXJlbnROb2RlKSB7XG4gICAgICBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmNvbnRhaW5lciwgZWwubmV4dFNpYmxpbmcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndGhpbi1zZWxlY3Q6IFRoZSBnaXZlbiBzZWxlY3QgZWxlbWVudCBtdXN0IGhhdmUgYSBwYXJlbnQgbm9kZScpO1xuICAgIH1cbiAgICBcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25Eb2N1bWVudENsaWNrKTtcbiAgfVxuICBcbiAgZGVzdHJveSA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IHRoaXMub3JpZ2luYWxFbGVtZW50RGlzcGxheTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25Eb2N1bWVudENsaWNrKTtcbiAgICBcbiAgICBpZiAodGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuY29udGFpbmVyKVxuICAgIH1cbiAgfVxuICBcbiAgb3BlblBhbmVsID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuaXNPcGVuZWQgPSB0cnVlO1xuICAgIFxuICAgIHRoaXMudGl0bGVCYXIuYXJyb3dJY29uLmFycm93LmNsYXNzTGlzdC5yZW1vdmUoJ2Fycm93LWRvd24nKVxuICAgIHRoaXMudGl0bGVCYXIuYXJyb3dJY29uLmFycm93LmNsYXNzTGlzdC5hZGQoJ2Fycm93LXVwJylcbiAgICBcbiAgICB0aGlzLnRpdGxlQmFyLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1vcGVuLWJlbG93JylcbiAgICBcbiAgICB0aGlzLmNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc3Mtb3BlbicpXG4gICAgXG4gICAgLy8gc2V0VGltZW91dCBpcyBmb3IgYW5pbWF0aW9uIGNvbXBsZXRpb25cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2VhcmNoLmlucHV0LmZvY3VzKClcbiAgICB9LCAxMDApXG4gIH1cbiAgXG4gIGNsb3NlUGFuZWwgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5pc09wZW5lZCA9IGZhbHNlO1xuICAgIHRoaXMuc2VhcmNoLmlucHV0LnZhbHVlID0gJyc7XG4gICAgXG4gICAgdGhpcy50aXRsZUJhci5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc3Mtb3Blbi1hYm92ZScpXG4gICAgdGhpcy50aXRsZUJhci5jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnc3Mtb3Blbi1iZWxvdycpXG4gICAgdGhpcy50aXRsZUJhci5hcnJvd0ljb24uYXJyb3cuY2xhc3NMaXN0LmFkZCgnYXJyb3ctZG93bicpXG4gICAgdGhpcy50aXRsZUJhci5hcnJvd0ljb24uYXJyb3cuY2xhc3NMaXN0LnJlbW92ZSgnYXJyb3ctdXAnKVxuICAgIFxuICAgIHRoaXMuY29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdzcy1vcGVuJylcbiAgfVxuICBcbiAgXG4gIHNldERpc3BsYXlMaXN0ID0gKG9wdGlvbnM6IE9wdGlvbltdKTogdm9pZCA9PiB7XG4gICAgdGhpcy5saXN0LmlubmVySFRNTCA9ICcnO1xuICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQoYnVpbGRPcHRpb24ob3B0aW9uLCB0aGlzLm9uT3B0aW9uU2VsZWN0KSkpXG4gIH07XG4gIFxuICBzZXRFbGVtZW50T3B0aW9ucyA9IChvcHRpb25zOiBPcHRpb25bXSk6IHZvaWQgPT4ge1xuICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICBcbiAgICBvcHRpb25zLmZvckVhY2goKG9wdGlvbikgPT4ge1xuICAgICAgY29uc3Qgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHQudmFsdWUgPSBvcHRpb24udmFsdWU7XG4gICAgICBvcHQuaW5uZXJUZXh0ID0gb3B0aW9uLnRleHQ7XG4gICAgICBvcHQuc2VsZWN0ZWQgPSBvcHRpb24uc2VsZWN0ZWQ7XG4gICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQob3B0KTtcbiAgICB9KVxuICB9XG4gIFxufSIsImltcG9ydCB7b25DbG9zZVR5cGUsIG9uT3BlblR5cGUsIG9uT3B0aW9uU2VsZWN0VHlwZSwgb25TZWFyY2hUeXBlLCBPcHRpb259IGZyb20gXCIuL21vZGVsc1wiO1xuaW1wb3J0IHtcbiAgYnVpbGRDb250ZW50LFxuICBidWlsZFJlc3VsdHNMaXN0LFxuICBidWlsZFNlYXJjaCxcbiAgYnVpbGRTaW5nbGVTZWxlY3QsXG59IGZyb20gXCIuL2RvbV9mYWN0b3J5XCI7XG5pbXBvcnQgVmlldyBmcm9tIFwiLi92aWV3XCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2luZ2xlVmlldyBleHRlbmRzIFZpZXcge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIGVsOiBIVE1MU2VsZWN0RWxlbWVudCxcbiAgICAgIG9uU2VhcmNoOiBvblNlYXJjaFR5cGUsXG4gICAgICBvbk9wdGlvblNlbGVjdDogb25PcHRpb25TZWxlY3RUeXBlLFxuICAgICAgb25DbG9zZTogb25DbG9zZVR5cGUsXG4gICAgICBvbk9wZW46IG9uT3BlblR5cGUsXG4gICkge1xuICAgIHN1cGVyKGVsLCBvblNlYXJjaCwgb25PcHRpb25TZWxlY3QsIG9uQ2xvc2UsIG9uT3Blbik7XG4gICAgXG4gICAgdGhpcy5jb250ZW50ID0gYnVpbGRDb250ZW50KCk7XG4gICAgdGhpcy5zZWFyY2ggPSBidWlsZFNlYXJjaCh0aGlzLm9uU2VhcmNoKTtcbiAgICB0aGlzLmxpc3QgPSBidWlsZFJlc3VsdHNMaXN0KCk7XG4gICAgXG4gICAgdGhpcy50aXRsZUJhciA9IGJ1aWxkU2luZ2xlU2VsZWN0KHRoaXMub25DbGlja092ZXJUaXRsZSk7XG4gICAgXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy50aXRsZUJhci5jb250YWluZXIpXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50KVxuICAgIFxuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnNlYXJjaC5jb250YWluZXIpXG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHRoaXMubGlzdClcbiAgfVxuICBcbiAgc2V0U2VsZWN0ZWQgPSAob3B0aW9uOiBPcHRpb24pOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy50aXRsZUJhci50eXBlID09PSAnc2luZ2xlJykge1xuICAgICAgdGhpcy50aXRsZUJhci50aXRsZS5pbm5lclRleHQgPSBvcHRpb24udGV4dDtcbiAgICB9XG4gICAgXG4gICAgQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQub3B0aW9ucykuZm9yRWFjaCgobykgPT4ge1xuICAgICAgaWYgKG8udmFsdWUgPT09IG9wdGlvbi52YWx1ZSkge1xuICAgICAgICBvLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG8uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIFxuICAgIHRoaXMuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pKVxuICB9XG4gIFxufSIsImltcG9ydCB7XG4gIG9uQ2xvc2VUeXBlLFxuICBvbk9wZW5UeXBlLFxuICBvbk9wdGlvblNlbGVjdFR5cGUsXG4gIG9uUmVtb3ZlTXVsdGlPcHRpb25UeXBlLFxuICBvblNlYXJjaFR5cGUsXG4gIE9wdGlvblxufSBmcm9tIFwiLi9tb2RlbHNcIjtcbmltcG9ydCB7XG4gIGJ1aWxkQ29udGVudCxcbiAgYnVpbGRSZXN1bHRzTGlzdCxcbiAgYnVpbGRTZWFyY2gsXG4gIGJ1aWxkTXVsdGlTZWxlY3QsXG4gIGJ1aWxkTXVsdGlUaXRsZUJhZGdlXG59IGZyb20gXCIuL2RvbV9mYWN0b3J5XCI7XG5pbXBvcnQgVmlldyBmcm9tIFwiLi92aWV3XCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGlWaWV3IGV4dGVuZHMgVmlldyB7XG4gIHB1YmxpYyBvblJlbW92ZU11bHRpT3B0aW9uOiBvblJlbW92ZU11bHRpT3B0aW9uVHlwZVxuICBcbiAgY29uc3RydWN0b3IoXG4gICAgICBlbDogSFRNTFNlbGVjdEVsZW1lbnQsXG4gICAgICBvblNlYXJjaDogb25TZWFyY2hUeXBlLFxuICAgICAgb25PcHRpb25TZWxlY3Q6IG9uT3B0aW9uU2VsZWN0VHlwZSxcbiAgICAgIG9uQ2xvc2U6IG9uQ2xvc2VUeXBlLFxuICAgICAgb25PcGVuOiBvbk9wZW5UeXBlLFxuICAgICAgb25SZW1vdmVNdWx0aU9wdGlvbjogb25SZW1vdmVNdWx0aU9wdGlvblR5cGVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIG9uU2VhcmNoLCBvbk9wdGlvblNlbGVjdCwgb25DbG9zZSwgb25PcGVuKTtcbiAgICB0aGlzLm9uUmVtb3ZlTXVsdGlPcHRpb24gPSBvblJlbW92ZU11bHRpT3B0aW9uO1xuICAgIFxuICAgIHRoaXMuY29udGVudCA9IGJ1aWxkQ29udGVudCgpO1xuICAgIHRoaXMuc2VhcmNoID0gYnVpbGRTZWFyY2godGhpcy5vblNlYXJjaCk7XG4gICAgdGhpcy5saXN0ID0gYnVpbGRSZXN1bHRzTGlzdCgpO1xuICAgIFxuICAgIHRoaXMudGl0bGVCYXIgPSBidWlsZE11bHRpU2VsZWN0KHRoaXMub25DbGlja092ZXJUaXRsZSk7XG4gICAgXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy50aXRsZUJhci5jb250YWluZXIpXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50KVxuICAgIFxuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnNlYXJjaC5jb250YWluZXIpXG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHRoaXMubGlzdClcbiAgfVxuICBcbiAgXG4gIHNldFNlbGVjdGVkID0gKG9wdGlvbnM6IE9wdGlvbltdKTogdm9pZCA9PiB7XG4gICAgb3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgIGNvbnN0IGJhZGdlID0gYnVpbGRNdWx0aVRpdGxlQmFkZ2Uob3B0aW9uLCB0aGlzLm9uUmVtb3ZlTXVsdGlPcHRpb24pO1xuICAgICAgaWYgKHRoaXMudGl0bGVCYXIudHlwZSA9PT0gJ211bHRpJykge1xuICAgICAgICB0aGlzLnRpdGxlQmFyLnZhbHVlcy5hcHBlbmRDaGlsZChiYWRnZSk7XG4gICAgICB9XG4gICAgfSlcbiAgICBcbiAgICBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5vcHRpb25zKS5mb3JFYWNoKChvKSA9PiB7XG4gICAgICBpZiAob3B0aW9ucy5maW5kKCh4KSA9PiB4LnNlbGVjdGVkICYmIHgudmFsdWUgPT09IG8udmFsdWUpKSB7XG4gICAgICAgIG8uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgby5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pXG4gIFxuICAgIHRoaXMuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pKVxuICB9XG4gIFxuICBhcHBlbmRTZWxlY3RlZCA9IChvcHRpb246IE9wdGlvbik6IHZvaWQgPT4ge1xuICAgIGlmICh0aGlzLnRpdGxlQmFyLnR5cGUgPT09ICdtdWx0aScpIHtcbiAgICAgIFxuICAgICAgY29uc3QgYmFkZ2UgPSBidWlsZE11bHRpVGl0bGVCYWRnZShvcHRpb24sIHRoaXMub25SZW1vdmVNdWx0aU9wdGlvbik7XG4gICAgICB0aGlzLnRpdGxlQmFyLnZhbHVlcy5hcHBlbmRDaGlsZChiYWRnZSk7XG4gICAgICBcbiAgICAgIEFycmF5LmZyb20odGhpcy5saXN0LmNoaWxkcmVuKS5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgIGlmICh4IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgeC5kYXRhc2V0LnNzVmFsdWUgPT09IG9wdGlvbi52YWx1ZSkge1xuICAgICAgICAgIHguY2xhc3NMaXN0LmFkZCgnc3Mtb3B0aW9uLXNlbGVjdGVkJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBcbiAgICAgIGNvbnN0IGRvbU9wdGlvbiA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50Lm9wdGlvbnMpLmZpbmQoKG8pID0+IG8udmFsdWUgPT09IG9wdGlvbi52YWx1ZSlcbiAgICAgIGlmIChkb21PcHRpb24pIHtcbiAgICAgICAgZG9tT3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG5ld09wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBuZXdPcHRpb24udmFsdWUgPSBvcHRpb24udmFsdWU7XG4gICAgICAgIG5ld09wdGlvbi5pbm5lclRleHQgPSBvcHRpb24udGV4dDtcbiAgICAgICAgbmV3T3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG5ld09wdGlvbik7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pKVxuICAgIH1cbiAgfVxuICBcbiAgcmVtb3ZlU2VsZWN0ZWQgPSAob3B0aW9uOiBPcHRpb24pOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy50aXRsZUJhci50eXBlID09PSAnbXVsdGknKSB7XG4gICAgICBcbiAgICAgIGNvbnN0IGRvbUJhZGdlID0gQXJyYXkuZnJvbSh0aGlzLnRpdGxlQmFyLnZhbHVlcy5jaGlsZHJlbikuZmluZCgoeCkgPT4ge1xuICAgICAgICByZXR1cm4gKHggaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgJiYgeC5kYXRhc2V0LnZhbHVlID09PSBvcHRpb24udmFsdWU7XG4gICAgICB9KVxuICAgICAgXG4gICAgICBpZiAoZG9tQmFkZ2UpIHtcbiAgICAgICAgZG9tQmFkZ2UucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIEFycmF5LmZyb20odGhpcy5saXN0LmNoaWxkcmVuKS5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgIGlmICh4IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgeC5kYXRhc2V0LnNzVmFsdWUgPT09IG9wdGlvbi52YWx1ZSkge1xuICAgICAgICAgIHguY2xhc3NMaXN0LnJlbW92ZSgnc3Mtb3B0aW9uLXNlbGVjdGVkJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBcbiAgICAgIGNvbnN0IGRvbU9wdGlvbiA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50Lm9wdGlvbnMpLmZpbmQoKG8pID0+IG8udmFsdWUgPT09IG9wdGlvbi52YWx1ZSlcbiAgICAgIGlmIChkb21PcHRpb24pIHtcbiAgICAgICAgZG9tT3B0aW9uLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9XG4gIFxuICAgICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUgfSkpXG4gICAgfVxuICB9XG4gIFxufSIsImltcG9ydCB7T3B0aW9ufSBmcm9tIFwiLi9tb2RlbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0UGFyc2VyIHtcbiAgcHVibGljIGVsOiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgXG4gIGNvbnN0cnVjdG9yKGVsOiBIVE1MRWxlbWVudCkge1xuICAgIGlmICghKGVsIGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoaW4tc2VsZWN0OiBcInNlbGVjdFwiIGRvbSBlbGVtZW50IG11c3QgYmUgYW4gSFRNTFNlbGVjdEVsZW1lbnQnKTtcbiAgICB9XG4gICAgdGhpcy5lbCA9IGVsO1xuICB9XG4gIFxuICBhbmFseXplKCkge1xuICAgIGNvbnN0IGlzTXVsdGlwbGUgPSB0aGlzLmVsLm11bHRpcGxlO1xuICAgIGNvbnN0IG9wdGlvbnM6IE9wdGlvbltdID0gW107XG4gICAgXG4gICAgQXJyYXkuZnJvbSh0aGlzLmVsLm9wdGlvbnMpLmZvckVhY2goKG9wdGlvbjogSFRNTE9wdGlvbkVsZW1lbnQpID0+IHtcbiAgICAgIG9wdGlvbnMucHVzaCh7dmFsdWU6IG9wdGlvbi52YWx1ZSwgdGV4dDogb3B0aW9uLnRleHQsIHNlbGVjdGVkOiBvcHRpb24uc2VsZWN0ZWR9KTtcbiAgICB9KTtcbiAgICBcbiAgICAvLyBGb2xsb3dzIGRlZmF1bHQgYnJvd3NlciBiZWhhdmlvciBvbiBjaG9vc2luZyB3aGF0IG9wdGlvbiB0byBkaXNwbGF5IGluaXRpYWxseTpcbiAgICAvLyBMYXN0IG9mIHRoZSBzZWxlY3RlZCBvciB0aGUgZmlyc3Qgb25lIChvbmx5IGZvciBzaW5nbGUgc2VsZWN0cykuXG4gICAgbGV0IGRlZmF1bHRTaW5nbGVPcHRpb247XG4gICAgXG4gICAgb3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICBpZiAob3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgIGRlZmF1bHRTaW5nbGVPcHRpb24gPSBvcHRpb247XG4gICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgZGVmYXVsdFNpbmdsZU9wdGlvbiA9IGRlZmF1bHRTaW5nbGVPcHRpb24gfHwgb3B0aW9uc1swXTtcbiAgICBcbiAgICByZXR1cm4gKHtcbiAgICAgIGlzTXVsdGlwbGUsXG4gICAgICBvcHRpb25zLFxuICAgICAgZGVmYXVsdFNpbmdsZU9wdGlvblxuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgXCIuLi9zdHlsZXMvdGhpbi1zZWxlY3Quc2Nzc1wiXG5pbXBvcnQgU2luZ2xlVmlldyBmcm9tIFwiLi9zaW5nbGVfdmlld1wiO1xuaW1wb3J0IE11bHRpVmlldyBmcm9tIFwiLi9tdWx0aXBsZV92aWV3XCI7XG5pbXBvcnQgU2VsZWN0UGFyc2VyIGZyb20gXCIuL3NlbGVjdF9wYXJzZXJcIjtcbmltcG9ydCB7YWpheENhbGxiYWNrVHlwZSwgT3B0aW9ufSBmcm9tIFwiLi9tb2RlbHNcIlxuXG5pbnRlcmZhY2UgVGhpblNlbGVjdFBhcmFtcyB7XG4gIHNlbGVjdDogc3RyaW5nIHwgSFRNTFNlbGVjdEVsZW1lbnQ7XG4gIGFqYXg/OiBhamF4Q2FsbGJhY2tUeXBlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaGluU2VsZWN0IHtcbiAgcHVibGljIHZpZXc6IFNpbmdsZVZpZXcgfCBNdWx0aVZpZXc7XG4gIHB1YmxpYyBkaXNwbGF5ZWRPcHRpb25zTGlzdDogT3B0aW9uW107XG4gIHB1YmxpYyBpc1NlYXJjaGluZzogYm9vbGVhbjtcbiAgcHVibGljIGFqYXg6IGFqYXhDYWxsYmFja1R5cGUgfCB1bmRlZmluZWQ7XG4gIFxuICBjb25zdHJ1Y3RvcihwYXJhbXM6IFRoaW5TZWxlY3RQYXJhbXMpIHtcbiAgICBjb25zdCBlbDogSFRNTFNlbGVjdEVsZW1lbnQgPSB0eXBlb2YgKHBhcmFtcy5zZWxlY3QpID09PSBcInN0cmluZ1wiID8gKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGFyYW1zLnNlbGVjdCkgYXMgSFRNTFNlbGVjdEVsZW1lbnQpIDogcGFyYW1zLnNlbGVjdDtcbiAgICBcbiAgICBjb25zdCBpbml0aWFsU2VsZWN0SW5mbyA9IChuZXcgU2VsZWN0UGFyc2VyKGVsKSkuYW5hbHl6ZSgpO1xuICAgIFxuICAgIHRoaXMuaXNTZWFyY2hpbmcgPSBmYWxzZTtcbiAgICBcbiAgICBpZiAoaW5pdGlhbFNlbGVjdEluZm8uaXNNdWx0aXBsZSkge1xuICAgICAgdGhpcy52aWV3ID0gbmV3IE11bHRpVmlldyhcbiAgICAgICAgICBlbCxcbiAgICAgICAgICB0aGlzLm9uU2VhcmNoLFxuICAgICAgICAgIHRoaXMub25PcHRpb25TZWxlY3QsXG4gICAgICAgICAgdGhpcy5jbG9zZVBhbmVsLFxuICAgICAgICAgIHRoaXMub3BlblBhbmVsLFxuICAgICAgICAgIHRoaXMub25SZW1vdmVNdWx0aU9wdGlvblxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3ID0gbmV3IFNpbmdsZVZpZXcoXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgdGhpcy5vblNlYXJjaCxcbiAgICAgICAgICB0aGlzLm9uT3B0aW9uU2VsZWN0LFxuICAgICAgICAgIHRoaXMuY2xvc2VQYW5lbCxcbiAgICAgICAgICB0aGlzLm9wZW5QYW5lbCxcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QgPSBpbml0aWFsU2VsZWN0SW5mby5vcHRpb25zO1xuICAgIFxuICAgIGlmICghcGFyYW1zLmFqYXgpIHtcbiAgICAgIHRoaXMudmlldy5zZXREaXNwbGF5TGlzdCh0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0KTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMudmlldyBpbnN0YW5jZW9mIE11bHRpVmlldykge1xuICAgICAgdGhpcy52aWV3LnNldFNlbGVjdGVkKGluaXRpYWxTZWxlY3RJbmZvLm9wdGlvbnMuZmlsdGVyKG9wdGlvbiA9PiBvcHRpb24uc2VsZWN0ZWQpKTtcbiAgICB9IGVsc2UgaWYgKGluaXRpYWxTZWxlY3RJbmZvLmRlZmF1bHRTaW5nbGVPcHRpb24pIHtcbiAgICAgIHRoaXMudmlldy5zZXRTZWxlY3RlZChpbml0aWFsU2VsZWN0SW5mby5kZWZhdWx0U2luZ2xlT3B0aW9uKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5hamF4ID0gcGFyYW1zLmFqYXg7XG4gIH1cbiAgXG4gIGRlc3Ryb3kgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy52aWV3LmRlc3Ryb3koKTtcbiAgfVxuICBcbiAgb25TZWFyY2ggPSAodGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgdGhpcy5pc1NlYXJjaGluZyA9IHRydWU7XG4gICAgXG4gICAgaWYgKHRoaXMuYWpheCkge1xuICAgICAgdGhpcy5hamF4KHRleHQsIChkYXRhOiBPcHRpb25bXSkgPT4ge1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIGRhdGEuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QuZmluZCgocSkgPT4gcS5zZWxlY3RlZCAmJiBxLnZhbHVlID09PSB4LnZhbHVlKSkge1xuICAgICAgICAgICAgICB4LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QgPSBkYXRhO1xuICAgICAgICAgIHRoaXMudmlldy5zZXRFbGVtZW50T3B0aW9ucyhkYXRhKTtcbiAgICAgICAgICB0aGlzLnZpZXcuc2V0RGlzcGxheUxpc3QoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtYXRjaGVkT3B0aW9ucyA9IHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QuZmlsdGVyKG9wdGlvbiA9PiB0aGlzLnNlYXJjaEZpbHRlcihvcHRpb24udGV4dCwgdGV4dCkpO1xuICAgICAgdGhpcy52aWV3LnNldERpc3BsYXlMaXN0KG1hdGNoZWRPcHRpb25zKTtcbiAgICB9XG4gIH1cbiAgXG4gIGNsb3NlUGFuZWwgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy52aWV3LmNsb3NlUGFuZWwoKTtcbiAgICBcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudmlldy5zZXREaXNwbGF5TGlzdCh0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0KTtcbiAgICB9LCAxMDApO1xuICAgIHRoaXMuaXNTZWFyY2hpbmcgPSBmYWxzZTtcbiAgfVxuICBcbiAgb3BlblBhbmVsID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMudmlldy5vcGVuUGFuZWwoKTtcbiAgfVxuICBcbiAgb25PcHRpb25TZWxlY3QgPSAob3B0aW9uOiBPcHRpb24pOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy52aWV3IGluc3RhbmNlb2YgTXVsdGlWaWV3KSB7XG4gICAgICBpZiAob3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnZpZXcucmVtb3ZlU2VsZWN0ZWQob3B0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMudmlldy5hcHBlbmRTZWxlY3RlZChvcHRpb24pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXcuc2V0U2VsZWN0ZWQob3B0aW9uKTtcbiAgICAgIFxuICAgICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdC5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgIHguc2VsZWN0ZWQgPSAoeC52YWx1ZSA9PT0gb3B0aW9uLnZhbHVlKTtcbiAgICAgIH0pXG4gICAgICB0aGlzLmNsb3NlUGFuZWwoKTtcbiAgICB9XG4gIH1cbiAgXG4gIG9uUmVtb3ZlTXVsdGlPcHRpb24gPSAob3B0aW9uOiBPcHRpb24pOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy52aWV3IGluc3RhbmNlb2YgTXVsdGlWaWV3KSB7XG4gICAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0LmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgaWYgKHgudmFsdWUgPT09IG9wdGlvbi52YWx1ZSkge1xuICAgICAgICAgIHguc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlU2VsZWN0ZWQob3B0aW9uKTtcbiAgICAgIHRoaXMudmlldy5zZXREaXNwbGF5TGlzdCh0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0KTtcbiAgICB9XG4gIH1cbiAgXG4gIHNlYXJjaEZpbHRlciA9IChvcHRpb25UZXh0OiBzdHJpbmcsIGlucHV0VGV4dDogc3RyaW5nKSA6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiBvcHRpb25UZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihpbnB1dFRleHQudG9Mb3dlckNhc2UoKSkgIT09IC0xO1xuICB9XG4gIFxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sY0FBYyxHQUFHLE1BQUs7SUFDMUIsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxJQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25DLElBQUEsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyxDQUFBO0FBRUQsTUFBTSxZQUFZLEdBQUcsTUFBSztJQUN4QixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlDLElBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDcEMsSUFBQSxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDLENBQUE7QUFFRCxNQUFNLFdBQVcsR0FBRyxDQUFDLFFBQXNCLEtBQUk7SUFDN0MsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMvQyxJQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUE7QUFFN0MsSUFBQSxNQUFNLFlBQVksR0FBVztRQUMzQixTQUFTO1FBQ1QsS0FBSztLQUNOLENBQUE7QUFFRCxJQUFBLEtBQUssQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFBO0FBQ3JCLElBQUEsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFD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
