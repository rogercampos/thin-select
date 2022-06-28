const buildContainer = (className) => {
    const container = document.createElement('div');
    container.classList.add('ss-main');
    if (className) {
        container.classList.add(className);
    }
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
    constructor(el, className, onSearch, onOptionSelect, onClose, onOpen) {
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
    constructor(el, className, onSearch, onOptionSelect, onClose, onOpen) {
        super(el, className, onSearch, onOptionSelect, onClose, onOpen);
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
    constructor(el, className, onSearch, onOptionSelect, onClose, onOpen, onRemoveMultiOption) {
        super(el, className, onSearch, onOptionSelect, onClose, onOpen);
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
            this.view = new MultiView(el, params.class, this.onSearch, this.onOptionSelect, this.closePanel, this.openPanel, this.onRemoveMultiOption);
        }
        else {
            this.view = new SingleView(el, params.class, this.onSearch, this.onOptionSelect, this.closePanel, this.openPanel);
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
                    const parsedData = data.map((x) => {
                        return {
                            value: x.value.toString(),
                            text: x.text.toString(),
                            // setting selected in a backend search makes no sense. Default selected options
                            // must be set on the original html.
                            selected: false,
                            innerHtml: x.innerHtml ? x.innerHtml.toString() : undefined,
                        };
                    });
                    parsedData.forEach((x) => {
                        if (this.displayedOptionsList.find((q) => q.selected && q.value === x.value)) {
                            x.selected = true;
                        }
                    });
                    // We need to preserve existing selected options that do not appear on the result form the
                    // backend.
                    const pendingOptionsToInclude = this.displayedOptionsList.filter((q) => {
                        return q.selected && !parsedData.find((x) => x.value === q.value);
                    });
                    const newOptions = parsedData.concat(pendingOptionsToInclude);
                    this.displayedOptionsList = newOptions;
                    this.view.setElementOptions(newOptions);
                    this.view.setDisplayList(parsedData);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9kb21fZmFjdG9yeS50cyIsIi4uL3NyYy92aWV3LnRzIiwiLi4vc3JjL3NpbmdsZV92aWV3LnRzIiwiLi4vc3JjL211bHRpcGxlX3ZpZXcudHMiLCIuLi9zcmMvc2VsZWN0X3BhcnNlci50cyIsIi4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge29uUmVtb3ZlTXVsdGlPcHRpb25UeXBlLCBvblNlYXJjaFR5cGUsIE9wdGlvbiwgU2VhcmNoLCBTaW5nbGVTZWxlY3RlZCwgTXVsdGlTZWxlY3RlZCB9IGZyb20gXCIuL21vZGVsc1wiXG5cbmNvbnN0IGJ1aWxkQ29udGFpbmVyID0gKGNsYXNzTmFtZT86IHN0cmluZykgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLW1haW4nKTtcbiAgaWYgKGNsYXNzTmFtZSkge1xuICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gIH1cbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuY29uc3QgYnVpbGRDb250ZW50ID0gKCkgPT4ge1xuICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc3MtY29udGVudCcpO1xuICByZXR1cm4gY29udGVudDtcbn1cblxuY29uc3QgYnVpbGRTZWFyY2ggPSAob25TZWFyY2g6IG9uU2VhcmNoVHlwZSkgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3Mtc2VhcmNoJyk7XG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKVxuICBcbiAgY29uc3Qgc2VhcmNoUmV0dXJuOiBTZWFyY2ggPSB7XG4gICAgY29udGFpbmVyLFxuICAgIGlucHV0XG4gIH1cbiAgXG4gIGlucHV0LnR5cGUgPSAnc2VhcmNoJ1xuICBpbnB1dC50YWJJbmRleCA9IDBcbiAgaW5wdXQucGxhY2Vob2xkZXIgPSAnU2VhcmNoJ1xuICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBcIlNlYXJjaC4uLlwiKVxuICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2F1dG9jYXBpdGFsaXplJywgJ29mZicpXG4gIGlucHV0LnNldEF0dHJpYnV0ZSgnYXV0b2NvbXBsZXRlJywgJ29mZicpXG4gIGlucHV0LnNldEF0dHJpYnV0ZSgnYXV0b2NvcnJlY3QnLCAnb2ZmJylcbiAgXG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgIG9uU2VhcmNoKGlucHV0LnZhbHVlKTtcbiAgfSlcbiAgXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpbnB1dClcbiAgXG4gIHJldHVybiBzZWFyY2hSZXR1cm47XG59XG5cblxuY29uc3QgYnVpbGRSZXN1bHRzTGlzdCA9ICgpID0+IHtcbiAgY29uc3QgbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGxpc3QuY2xhc3NMaXN0LmFkZCgnc3MtbGlzdCcpXG4gIGxpc3Quc2V0QXR0cmlidXRlKCdyb2xlJywgJ2xpc3Rib3gnKVxuICByZXR1cm4gbGlzdDtcbn1cblxuXG5jb25zdCBidWlsZFNpbmdsZVNlbGVjdCA9IChvbkNsaWNrOiAoKSA9PiB2b2lkKTogU2luZ2xlU2VsZWN0ZWQgPT4ge1xuICBjb25zdCBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLXNpbmdsZS1zZWxlY3RlZCcpXG4gIFxuICAvLyBUaXRsZSB0ZXh0XG4gIGNvbnN0IHRpdGxlOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgdGl0bGUuY2xhc3NMaXN0LmFkZCgncGxhY2Vob2xkZXInKVxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpXG4gIFxuICAvLyBBcnJvd1xuICBjb25zdCBhcnJvd0NvbnRhaW5lcjogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gIGFycm93Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLWFycm93JylcbiAgXG4gIGNvbnN0IGFycm93SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICBhcnJvd0ljb24uY2xhc3NMaXN0LmFkZCgnYXJyb3ctZG93bicpXG4gIGFycm93Q29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93SWNvbilcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93Q29udGFpbmVyKVxuICBcbiAgY29udGFpbmVyLm9uY2xpY2sgPSBvbkNsaWNrO1xuICBcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnc2luZ2xlJyxcbiAgICBjb250YWluZXIsXG4gICAgdGl0bGUsXG4gICAgYXJyb3dJY29uOiB7XG4gICAgICBjb250YWluZXI6IGFycm93Q29udGFpbmVyLFxuICAgICAgYXJyb3c6IGFycm93SWNvblxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBidWlsZE11bHRpU2VsZWN0ID0gKG9uQ2xpY2s6ICgpID0+IHZvaWQpOiBNdWx0aVNlbGVjdGVkID0+IHtcbiAgY29uc3QgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1tdWx0aS1zZWxlY3RlZCcpXG4gIFxuICAvLyB2YWx1ZXNcbiAgY29uc3QgdmFsdWVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgdmFsdWVzLmNsYXNzTGlzdC5hZGQoJ3NzLXZhbHVlcycpXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh2YWx1ZXMpXG4gIFxuICAvLyBBcnJvd1xuICBjb25zdCBhcnJvd0NvbnRhaW5lcjogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gIGFycm93Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLWFycm93JylcbiAgXG4gIGNvbnN0IGFycm93SWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICBhcnJvd0ljb24uY2xhc3NMaXN0LmFkZCgnYXJyb3ctZG93bicpXG4gIGFycm93Q29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93SWNvbilcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFycm93Q29udGFpbmVyKVxuICBcbiAgY29udGFpbmVyLm9uY2xpY2sgPSBvbkNsaWNrO1xuICBcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnbXVsdGknLFxuICAgIGNvbnRhaW5lcixcbiAgICB2YWx1ZXMsXG4gICAgYXJyb3dJY29uOiB7XG4gICAgICBjb250YWluZXI6IGFycm93Q29udGFpbmVyLFxuICAgICAgYXJyb3c6IGFycm93SWNvblxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBidWlsZE9wdGlvbiA9IChvcHRpb246IE9wdGlvbiwgb25PcHRpb25TZWxlY3Q6IChhOiBPcHRpb24pID0+IHZvaWQpID0+IHtcbiAgY29uc3Qgb3B0aW9uRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBvcHRpb25FbC5jbGFzc0xpc3QuYWRkKCdzcy1vcHRpb24nKVxuICBpZiAob3B0aW9uLmlubmVySHRtbCkge1xuICAgIG9wdGlvbkVsLmNsYXNzTGlzdC5hZGQoJ3NzLWN1c3RvbS1odG1sJylcbiAgfVxuICBvcHRpb25FbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnb3B0aW9uJylcbiAgb3B0aW9uRWwuZGF0YXNldC5zc1ZhbHVlID0gb3B0aW9uLnZhbHVlO1xuICBcbiAgb3B0aW9uRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgb25PcHRpb25TZWxlY3Qob3B0aW9uKTtcbiAgfSlcbiAgXG4gIGlmIChvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICBvcHRpb25FbC5jbGFzc0xpc3QuYWRkKCdzcy1vcHRpb24tc2VsZWN0ZWQnKTtcbiAgfVxuICBcbiAgaWYgKG9wdGlvbi5pbm5lckh0bWwpIHtcbiAgICBvcHRpb25FbC5pbm5lckhUTUwgPSBvcHRpb24uaW5uZXJIdG1sO1xuICB9IGVsc2Uge1xuICAgIG9wdGlvbkVsLmlubmVyVGV4dCA9IG9wdGlvbi50ZXh0IHx8ICdcXHhhMCc7XG4gIH1cbiAgXG4gIHJldHVybiBvcHRpb25FbDtcbn1cblxuY29uc3QgYnVpbGRNdWx0aVRpdGxlQmFkZ2UgPSAob3B0aW9uOiBPcHRpb24sIG9uUmVtb3ZlTXVsdGlPcHRpb246IG9uUmVtb3ZlTXVsdGlPcHRpb25UeXBlKSA9PiB7XG4gIGNvbnN0IGJhZGdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgYmFkZ2UuY2xhc3NMaXN0LmFkZCgnc3MtdmFsdWUnKTtcbiAgYmFkZ2UuZGF0YXNldC52YWx1ZSA9IG9wdGlvbi52YWx1ZTtcbiAgXG4gIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgc3Bhbi5pbm5lclRleHQgPSBvcHRpb24udGV4dCB8fCAnXFx4YTAnO1xuICBzcGFuLmNsYXNzTGlzdC5hZGQoJ3NzLXZhbHVlLXRleHQnKTtcbiAgXG4gIGNvbnN0IGRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgZGVsLmlubmVyVGV4dCA9ICfiqK8nO1xuICBkZWwuY2xhc3NMaXN0LmFkZCgnc3MtdmFsdWUtZGVsZXRlJyk7XG4gIGRlbC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIG9uUmVtb3ZlTXVsdGlPcHRpb24ob3B0aW9uKTtcbiAgfVxuICBcbiAgYmFkZ2UuYXBwZW5kQ2hpbGQoc3Bhbik7XG4gIGJhZGdlLmFwcGVuZENoaWxkKGRlbCk7XG4gIFxuICByZXR1cm4gYmFkZ2U7XG59XG4gIFxuXG5leHBvcnQgeyBidWlsZENvbnRhaW5lciwgYnVpbGRDb250ZW50LCBidWlsZFNlYXJjaCwgYnVpbGRSZXN1bHRzTGlzdCwgYnVpbGRTaW5nbGVTZWxlY3QsIGJ1aWxkTXVsdGlTZWxlY3QsIGJ1aWxkT3B0aW9uLCBidWlsZE11bHRpVGl0bGVCYWRnZSB9OyIsImltcG9ydCB7b25DbG9zZVR5cGUsIG9uT3BlblR5cGUsIG9uT3B0aW9uU2VsZWN0VHlwZSwgb25TZWFyY2hUeXBlLCBPcHRpb24sIFNlYXJjaCwgU2luZ2xlU2VsZWN0ZWQsIE11bHRpU2VsZWN0ZWQgfSBmcm9tIFwiLi9tb2RlbHNcIjtcbmltcG9ydCB7XG4gIGJ1aWxkQ29udGFpbmVyLFxuICBidWlsZE9wdGlvblxufSBmcm9tIFwiLi9kb21fZmFjdG9yeVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgcHVibGljIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnRcbiAgcHVibGljIGNvbnRlbnQhOiBIVE1MRGl2RWxlbWVudFxuICBwdWJsaWMgc2VhcmNoITogU2VhcmNoXG4gIHB1YmxpYyBsaXN0ITogSFRNTERpdkVsZW1lbnRcbiAgcHVibGljIHRpdGxlQmFyITogU2luZ2xlU2VsZWN0ZWQgfCBNdWx0aVNlbGVjdGVkXG4gIFxuICBwdWJsaWMgb25TZWFyY2g6IG9uU2VhcmNoVHlwZVxuICBwdWJsaWMgb25DbG9zZTogb25DbG9zZVR5cGVcbiAgcHVibGljIG9uT3Blbjogb25PcGVuVHlwZVxuICBwdWJsaWMgb25PcHRpb25TZWxlY3Q6IG9uT3B0aW9uU2VsZWN0VHlwZVxuICBwdWJsaWMgaXNPcGVuZWQ6IGJvb2xlYW5cbiAgXG4gIHB1YmxpYyBlbGVtZW50OiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgXG4gIHB1YmxpYyBvcmlnaW5hbEVsZW1lbnREaXNwbGF5OiBzdHJpbmc7XG4gIFxuICB0YXJnZXRCZWxvbmdzVG9Db250YWluZXIgPSAodGFyZ2V0OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICh0YXJnZXQgPT09IHRoaXMuY29udGFpbmVyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRhcmdldC5wYXJlbnROb2RlKSB7XG4gICAgICByZXR1cm4gdGhpcy50YXJnZXRCZWxvbmdzVG9Db250YWluZXIodGFyZ2V0LnBhcmVudE5vZGUgYXMgSFRNTEVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIFxuICBvbkRvY3VtZW50Q2xpY2sgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGlmICh0aGlzLmlzT3BlbmVkICYmIGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgIXRoaXMudGFyZ2V0QmVsb25nc1RvQ29udGFpbmVyKGUudGFyZ2V0KSkge1xuICAgICAgdGhpcy5vbkNsb3NlKCk7XG4gICAgfVxuICB9XG4gIFxuICBvbkNsaWNrT3ZlclRpdGxlID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuaXNPcGVuZWQgPyB0aGlzLm9uQ2xvc2UoKSA6IHRoaXMub25PcGVuKCk7XG4gIH1cbiAgXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZWw6IEhUTUxTZWxlY3RFbGVtZW50LFxuICAgICAgY2xhc3NOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgICBvblNlYXJjaDogb25TZWFyY2hUeXBlLFxuICAgICAgb25PcHRpb25TZWxlY3Q6IG9uT3B0aW9uU2VsZWN0VHlwZSxcbiAgICAgIG9uQ2xvc2U6IG9uQ2xvc2VUeXBlLFxuICAgICAgb25PcGVuOiBvbk9wZW5UeXBlLFxuICApIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbDtcbiAgICB0aGlzLm9yaWdpbmFsRWxlbWVudERpc3BsYXkgPSBlbC5zdHlsZS5kaXNwbGF5O1xuICAgIFxuICAgIHRoaXMub25TZWFyY2ggPSBvblNlYXJjaDtcbiAgICB0aGlzLm9uT3B0aW9uU2VsZWN0ID0gb25PcHRpb25TZWxlY3Q7XG4gICAgdGhpcy5vbkNsb3NlID0gb25DbG9zZTtcbiAgICB0aGlzLm9uT3BlbiA9IG9uT3BlbjtcbiAgICBcbiAgICB0aGlzLmlzT3BlbmVkID0gZmFsc2U7XG4gICAgXG4gICAgdGhpcy5jb250YWluZXIgPSBidWlsZENvbnRhaW5lcihjbGFzc05hbWUpO1xuICAgIFxuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgXG4gICAgaWYgKGVsLnBhcmVudE5vZGUpIHtcbiAgICAgIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMuY29udGFpbmVyLCBlbC5uZXh0U2libGluZylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGluLXNlbGVjdDogVGhlIGdpdmVuIHNlbGVjdCBlbGVtZW50IG11c3QgaGF2ZSBhIHBhcmVudCBub2RlJyk7XG4gICAgfVxuICAgIFxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkRvY3VtZW50Q2xpY2spO1xuICB9XG4gIFxuICBkZXN0cm95ID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gdGhpcy5vcmlnaW5hbEVsZW1lbnREaXNwbGF5O1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkRvY3VtZW50Q2xpY2spO1xuICAgIFxuICAgIGlmICh0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5jb250YWluZXIpXG4gICAgfVxuICB9XG4gIFxuICBvcGVuUGFuZWwgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5pc09wZW5lZCA9IHRydWU7XG4gICAgXG4gICAgdGhpcy50aXRsZUJhci5hcnJvd0ljb24uYXJyb3cuY2xhc3NMaXN0LnJlbW92ZSgnYXJyb3ctZG93bicpXG4gICAgdGhpcy50aXRsZUJhci5hcnJvd0ljb24uYXJyb3cuY2xhc3NMaXN0LmFkZCgnYXJyb3ctdXAnKVxuICAgIFxuICAgIHRoaXMudGl0bGVCYXIuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLW9wZW4tYmVsb3cnKVxuICAgIFxuICAgIHRoaXMuY29udGVudC5jbGFzc0xpc3QuYWRkKCdzcy1vcGVuJylcbiAgICBcbiAgICAvLyBzZXRUaW1lb3V0IGlzIGZvciBhbmltYXRpb24gY29tcGxldGlvblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zZWFyY2guaW5wdXQuZm9jdXMoKVxuICAgIH0sIDEwMClcbiAgfVxuICBcbiAgY2xvc2VQYW5lbCA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLmlzT3BlbmVkID0gZmFsc2U7XG4gICAgdGhpcy5zZWFyY2guaW5wdXQudmFsdWUgPSAnJztcbiAgICBcbiAgICB0aGlzLnRpdGxlQmFyLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzcy1vcGVuLWFib3ZlJylcbiAgICB0aGlzLnRpdGxlQmFyLmNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdzcy1vcGVuLWJlbG93JylcbiAgICB0aGlzLnRpdGxlQmFyLmFycm93SWNvbi5hcnJvdy5jbGFzc0xpc3QuYWRkKCdhcnJvdy1kb3duJylcbiAgICB0aGlzLnRpdGxlQmFyLmFycm93SWNvbi5hcnJvdy5jbGFzc0xpc3QucmVtb3ZlKCdhcnJvdy11cCcpXG4gICAgXG4gICAgdGhpcy5jb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3NzLW9wZW4nKVxuICB9XG4gIFxuICBcbiAgc2V0RGlzcGxheUxpc3QgPSAob3B0aW9uczogT3B0aW9uW10pOiB2b2lkID0+IHtcbiAgICB0aGlzLmxpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgb3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHRoaXMubGlzdC5hcHBlbmRDaGlsZChidWlsZE9wdGlvbihvcHRpb24sIHRoaXMub25PcHRpb25TZWxlY3QpKSlcbiAgfTtcbiAgXG4gIHNldEVsZW1lbnRPcHRpb25zID0gKG9wdGlvbnM6IE9wdGlvbltdKTogdm9pZCA9PiB7XG4gICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgIFxuICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICBjb25zdCBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIG9wdC52YWx1ZSA9IG9wdGlvbi52YWx1ZTtcbiAgICAgIG9wdC5pbm5lclRleHQgPSBvcHRpb24udGV4dDtcbiAgICAgIG9wdC5zZWxlY3RlZCA9IG9wdGlvbi5zZWxlY3RlZDtcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChvcHQpO1xuICAgIH0pXG4gIH1cbiAgXG59IiwiaW1wb3J0IHtvbkNsb3NlVHlwZSwgb25PcGVuVHlwZSwgb25PcHRpb25TZWxlY3RUeXBlLCBvblNlYXJjaFR5cGUsIE9wdGlvbn0gZnJvbSBcIi4vbW9kZWxzXCI7XG5pbXBvcnQge1xuICBidWlsZENvbnRlbnQsXG4gIGJ1aWxkUmVzdWx0c0xpc3QsXG4gIGJ1aWxkU2VhcmNoLFxuICBidWlsZFNpbmdsZVNlbGVjdCxcbn0gZnJvbSBcIi4vZG9tX2ZhY3RvcnlcIjtcbmltcG9ydCBWaWV3IGZyb20gXCIuL3ZpZXdcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW5nbGVWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZWw6IEhUTUxTZWxlY3RFbGVtZW50LFxuICAgICAgY2xhc3NOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgICBvblNlYXJjaDogb25TZWFyY2hUeXBlLFxuICAgICAgb25PcHRpb25TZWxlY3Q6IG9uT3B0aW9uU2VsZWN0VHlwZSxcbiAgICAgIG9uQ2xvc2U6IG9uQ2xvc2VUeXBlLFxuICAgICAgb25PcGVuOiBvbk9wZW5UeXBlLFxuICApIHtcbiAgICBzdXBlcihlbCwgY2xhc3NOYW1lLCBvblNlYXJjaCwgb25PcHRpb25TZWxlY3QsIG9uQ2xvc2UsIG9uT3Blbik7XG4gICAgXG4gICAgdGhpcy5jb250ZW50ID0gYnVpbGRDb250ZW50KCk7XG4gICAgdGhpcy5zZWFyY2ggPSBidWlsZFNlYXJjaCh0aGlzLm9uU2VhcmNoKTtcbiAgICB0aGlzLmxpc3QgPSBidWlsZFJlc3VsdHNMaXN0KCk7XG4gICAgXG4gICAgdGhpcy50aXRsZUJhciA9IGJ1aWxkU2luZ2xlU2VsZWN0KHRoaXMub25DbGlja092ZXJUaXRsZSk7XG4gICAgXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy50aXRsZUJhci5jb250YWluZXIpXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50KVxuICAgIFxuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnNlYXJjaC5jb250YWluZXIpXG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHRoaXMubGlzdClcbiAgfVxuICBcbiAgc2V0U2VsZWN0ZWQgPSAob3B0aW9uOiBPcHRpb24pOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy50aXRsZUJhci50eXBlID09PSAnc2luZ2xlJykge1xuICAgICAgdGhpcy50aXRsZUJhci50aXRsZS5pbm5lclRleHQgPSBvcHRpb24udGV4dDtcbiAgICB9XG4gICAgXG4gICAgQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQub3B0aW9ucykuZm9yRWFjaCgobykgPT4ge1xuICAgICAgaWYgKG8udmFsdWUgPT09IG9wdGlvbi52YWx1ZSkge1xuICAgICAgICBvLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG8uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIFxuICAgIHRoaXMuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pKVxuICB9XG4gIFxufSIsImltcG9ydCB7XG4gIG9uQ2xvc2VUeXBlLFxuICBvbk9wZW5UeXBlLFxuICBvbk9wdGlvblNlbGVjdFR5cGUsXG4gIG9uUmVtb3ZlTXVsdGlPcHRpb25UeXBlLFxuICBvblNlYXJjaFR5cGUsXG4gIE9wdGlvblxufSBmcm9tIFwiLi9tb2RlbHNcIjtcbmltcG9ydCB7XG4gIGJ1aWxkQ29udGVudCxcbiAgYnVpbGRSZXN1bHRzTGlzdCxcbiAgYnVpbGRTZWFyY2gsXG4gIGJ1aWxkTXVsdGlTZWxlY3QsXG4gIGJ1aWxkTXVsdGlUaXRsZUJhZGdlXG59IGZyb20gXCIuL2RvbV9mYWN0b3J5XCI7XG5pbXBvcnQgVmlldyBmcm9tIFwiLi92aWV3XCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGlWaWV3IGV4dGVuZHMgVmlldyB7XG4gIHB1YmxpYyBvblJlbW92ZU11bHRpT3B0aW9uOiBvblJlbW92ZU11bHRpT3B0aW9uVHlwZVxuICBcbiAgY29uc3RydWN0b3IoXG4gICAgICBlbDogSFRNTFNlbGVjdEVsZW1lbnQsXG4gICAgICBjbGFzc05hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICAgIG9uU2VhcmNoOiBvblNlYXJjaFR5cGUsXG4gICAgICBvbk9wdGlvblNlbGVjdDogb25PcHRpb25TZWxlY3RUeXBlLFxuICAgICAgb25DbG9zZTogb25DbG9zZVR5cGUsXG4gICAgICBvbk9wZW46IG9uT3BlblR5cGUsXG4gICAgICBvblJlbW92ZU11bHRpT3B0aW9uOiBvblJlbW92ZU11bHRpT3B0aW9uVHlwZVxuICApIHtcbiAgICBzdXBlcihlbCwgY2xhc3NOYW1lLCBvblNlYXJjaCwgb25PcHRpb25TZWxlY3QsIG9uQ2xvc2UsIG9uT3Blbik7XG4gICAgdGhpcy5vblJlbW92ZU11bHRpT3B0aW9uID0gb25SZW1vdmVNdWx0aU9wdGlvbjtcbiAgICBcbiAgICB0aGlzLmNvbnRlbnQgPSBidWlsZENvbnRlbnQoKTtcbiAgICB0aGlzLnNlYXJjaCA9IGJ1aWxkU2VhcmNoKHRoaXMub25TZWFyY2gpO1xuICAgIHRoaXMubGlzdCA9IGJ1aWxkUmVzdWx0c0xpc3QoKTtcbiAgICBcbiAgICB0aGlzLnRpdGxlQmFyID0gYnVpbGRNdWx0aVNlbGVjdCh0aGlzLm9uQ2xpY2tPdmVyVGl0bGUpO1xuICAgIFxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMudGl0bGVCYXIuY29udGFpbmVyKVxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udGVudClcbiAgICBcbiAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5zZWFyY2guY29udGFpbmVyKVxuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLmxpc3QpXG4gIH1cbiAgXG4gIFxuICBzZXRTZWxlY3RlZCA9IChvcHRpb25zOiBPcHRpb25bXSk6IHZvaWQgPT4ge1xuICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICBjb25zdCBiYWRnZSA9IGJ1aWxkTXVsdGlUaXRsZUJhZGdlKG9wdGlvbiwgdGhpcy5vblJlbW92ZU11bHRpT3B0aW9uKTtcbiAgICAgIGlmICh0aGlzLnRpdGxlQmFyLnR5cGUgPT09ICdtdWx0aScpIHtcbiAgICAgICAgdGhpcy50aXRsZUJhci52YWx1ZXMuYXBwZW5kQ2hpbGQoYmFkZ2UpO1xuICAgICAgfVxuICAgIH0pXG4gICAgXG4gICAgQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQub3B0aW9ucykuZm9yRWFjaCgobykgPT4ge1xuICAgICAgaWYgKG9wdGlvbnMuZmluZCgoeCkgPT4geC5zZWxlY3RlZCAmJiB4LnZhbHVlID09PSBvLnZhbHVlKSkge1xuICAgICAgICBvLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG8uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICBcbiAgICB0aGlzLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSlcbiAgfVxuICBcbiAgYXBwZW5kU2VsZWN0ZWQgPSAob3B0aW9uOiBPcHRpb24pOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy50aXRsZUJhci50eXBlID09PSAnbXVsdGknKSB7XG4gICAgICBcbiAgICAgIGNvbnN0IGJhZGdlID0gYnVpbGRNdWx0aVRpdGxlQmFkZ2Uob3B0aW9uLCB0aGlzLm9uUmVtb3ZlTXVsdGlPcHRpb24pO1xuICAgICAgdGhpcy50aXRsZUJhci52YWx1ZXMuYXBwZW5kQ2hpbGQoYmFkZ2UpO1xuICAgICAgXG4gICAgICBBcnJheS5mcm9tKHRoaXMubGlzdC5jaGlsZHJlbikuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICBpZiAoeCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIHguZGF0YXNldC5zc1ZhbHVlID09PSBvcHRpb24udmFsdWUpIHtcbiAgICAgICAgICB4LmNsYXNzTGlzdC5hZGQoJ3NzLW9wdGlvbi1zZWxlY3RlZCcpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgXG4gICAgICBjb25zdCBkb21PcHRpb24gPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5vcHRpb25zKS5maW5kKChvKSA9PiBvLnZhbHVlID09PSBvcHRpb24udmFsdWUpXG4gICAgICBpZiAoZG9tT3B0aW9uKSB7XG4gICAgICAgIGRvbU9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBuZXdPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgbmV3T3B0aW9uLnZhbHVlID0gb3B0aW9uLnZhbHVlO1xuICAgICAgICBuZXdPcHRpb24uaW5uZXJUZXh0ID0gb3B0aW9uLnRleHQ7XG4gICAgICAgIG5ld09wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChuZXdPcHRpb24pO1xuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSlcbiAgICB9XG4gIH1cbiAgXG4gIHJlbW92ZVNlbGVjdGVkID0gKG9wdGlvbjogT3B0aW9uKTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMudGl0bGVCYXIudHlwZSA9PT0gJ211bHRpJykge1xuICAgICAgY29uc3QgZG9tQmFkZ2UgPSBBcnJheS5mcm9tKHRoaXMudGl0bGVCYXIudmFsdWVzLmNoaWxkcmVuKS5maW5kKCh4KSA9PiB7XG4gICAgICAgIHJldHVybiAoeCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSAmJiB4LmRhdGFzZXQudmFsdWUgPT09IG9wdGlvbi52YWx1ZTtcbiAgICAgIH0pXG4gIFxuICAgICAgaWYgKGRvbUJhZGdlKSB7XG4gICAgICAgIGRvbUJhZGdlLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBBcnJheS5mcm9tKHRoaXMubGlzdC5jaGlsZHJlbikuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICBpZiAoeCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIHguZGF0YXNldC5zc1ZhbHVlID09PSBvcHRpb24udmFsdWUpIHtcbiAgICAgICAgICB4LmNsYXNzTGlzdC5yZW1vdmUoJ3NzLW9wdGlvbi1zZWxlY3RlZCcpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgXG4gICAgICBjb25zdCBkb21PcHRpb24gPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5vcHRpb25zKS5maW5kKChvKSA9PiBvLnZhbHVlID09PSBvcHRpb24udmFsdWUpXG4gICAgICBpZiAoZG9tT3B0aW9uKSB7XG4gICAgICAgIGRvbU9wdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfVxuICBcbiAgICAgIHRoaXMuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pKVxuICAgIH1cbiAgfVxuICBcbn0iLCJpbXBvcnQge09wdGlvbn0gZnJvbSBcIi4vbW9kZWxzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdFBhcnNlciB7XG4gIHB1YmxpYyBlbDogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gIFxuICBjb25zdHJ1Y3RvcihlbDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAoIShlbCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGluLXNlbGVjdDogXCJzZWxlY3RcIiBkb20gZWxlbWVudCBtdXN0IGJlIGFuIEhUTUxTZWxlY3RFbGVtZW50Jyk7XG4gICAgfVxuICAgIHRoaXMuZWwgPSBlbDtcbiAgfVxuICBcbiAgYW5hbHl6ZSgpIHtcbiAgICBjb25zdCBpc011bHRpcGxlID0gdGhpcy5lbC5tdWx0aXBsZTtcbiAgICBjb25zdCBvcHRpb25zOiBPcHRpb25bXSA9IFtdO1xuICAgIFxuICAgIEFycmF5LmZyb20odGhpcy5lbC5vcHRpb25zKS5mb3JFYWNoKChvcHRpb246IEhUTUxPcHRpb25FbGVtZW50KSA9PiB7XG4gICAgICBvcHRpb25zLnB1c2goe3ZhbHVlOiBvcHRpb24udmFsdWUsIHRleHQ6IG9wdGlvbi50ZXh0LCBzZWxlY3RlZDogb3B0aW9uLnNlbGVjdGVkfSk7XG4gICAgfSk7XG4gICAgXG4gICAgLy8gRm9sbG93cyBkZWZhdWx0IGJyb3dzZXIgYmVoYXZpb3Igb24gY2hvb3Npbmcgd2hhdCBvcHRpb24gdG8gZGlzcGxheSBpbml0aWFsbHk6XG4gICAgLy8gTGFzdCBvZiB0aGUgc2VsZWN0ZWQgb3IgdGhlIGZpcnN0IG9uZSAob25seSBmb3Igc2luZ2xlIHNlbGVjdHMpLlxuICAgIGxldCBkZWZhdWx0U2luZ2xlT3B0aW9uO1xuICAgIFxuICAgIG9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgaWYgKG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICBkZWZhdWx0U2luZ2xlT3B0aW9uID0gb3B0aW9uO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIGRlZmF1bHRTaW5nbGVPcHRpb24gPSBkZWZhdWx0U2luZ2xlT3B0aW9uIHx8IG9wdGlvbnNbMF07XG4gICAgXG4gICAgcmV0dXJuICh7XG4gICAgICBpc011bHRpcGxlLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIGRlZmF1bHRTaW5nbGVPcHRpb25cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IFwiLi4vc3R5bGVzL3RoaW4tc2VsZWN0LnNjc3NcIlxuaW1wb3J0IFNpbmdsZVZpZXcgZnJvbSBcIi4vc2luZ2xlX3ZpZXdcIjtcbmltcG9ydCBNdWx0aVZpZXcgZnJvbSBcIi4vbXVsdGlwbGVfdmlld1wiO1xuaW1wb3J0IFNlbGVjdFBhcnNlciBmcm9tIFwiLi9zZWxlY3RfcGFyc2VyXCI7XG5pbXBvcnQge2FqYXhDYWxsYmFja1R5cGUsIE9wdGlvbn0gZnJvbSBcIi4vbW9kZWxzXCJcblxuaW50ZXJmYWNlIFRoaW5TZWxlY3RQYXJhbXMge1xuICBzZWxlY3Q6IHN0cmluZyB8IEhUTUxTZWxlY3RFbGVtZW50O1xuICBhamF4PzogYWpheENhbGxiYWNrVHlwZTtcbiAgY2xhc3M/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRoaW5TZWxlY3Qge1xuICBwdWJsaWMgdmlldzogU2luZ2xlVmlldyB8IE11bHRpVmlldztcbiAgcHVibGljIGRpc3BsYXllZE9wdGlvbnNMaXN0OiBPcHRpb25bXTtcbiAgcHVibGljIGlzU2VhcmNoaW5nOiBib29sZWFuO1xuICBwdWJsaWMgYWpheDogYWpheENhbGxiYWNrVHlwZSB8IHVuZGVmaW5lZDtcbiAgXG4gIGNvbnN0cnVjdG9yKHBhcmFtczogVGhpblNlbGVjdFBhcmFtcykge1xuICAgIGNvbnN0IGVsOiBIVE1MU2VsZWN0RWxlbWVudCA9IHR5cGVvZiAocGFyYW1zLnNlbGVjdCkgPT09IFwic3RyaW5nXCIgPyAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJhbXMuc2VsZWN0KSBhcyBIVE1MU2VsZWN0RWxlbWVudCkgOiBwYXJhbXMuc2VsZWN0O1xuICAgIFxuICAgIGNvbnN0IGluaXRpYWxTZWxlY3RJbmZvID0gKG5ldyBTZWxlY3RQYXJzZXIoZWwpKS5hbmFseXplKCk7XG4gICAgXG4gICAgdGhpcy5pc1NlYXJjaGluZyA9IGZhbHNlO1xuICAgIFxuICAgIGlmIChpbml0aWFsU2VsZWN0SW5mby5pc011bHRpcGxlKSB7XG4gICAgICB0aGlzLnZpZXcgPSBuZXcgTXVsdGlWaWV3KFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIHBhcmFtcy5jbGFzcyxcbiAgICAgICAgICB0aGlzLm9uU2VhcmNoLFxuICAgICAgICAgIHRoaXMub25PcHRpb25TZWxlY3QsXG4gICAgICAgICAgdGhpcy5jbG9zZVBhbmVsLFxuICAgICAgICAgIHRoaXMub3BlblBhbmVsLFxuICAgICAgICAgIHRoaXMub25SZW1vdmVNdWx0aU9wdGlvblxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3ID0gbmV3IFNpbmdsZVZpZXcoXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgcGFyYW1zLmNsYXNzLFxuICAgICAgICAgIHRoaXMub25TZWFyY2gsXG4gICAgICAgICAgdGhpcy5vbk9wdGlvblNlbGVjdCxcbiAgICAgICAgICB0aGlzLmNsb3NlUGFuZWwsXG4gICAgICAgICAgdGhpcy5vcGVuUGFuZWwsXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0ID0gaW5pdGlhbFNlbGVjdEluZm8ub3B0aW9ucztcbiAgICBcbiAgICBpZiAoIXBhcmFtcy5hamF4KSB7XG4gICAgICB0aGlzLnZpZXcuc2V0RGlzcGxheUxpc3QodGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdCk7XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnZpZXcgaW5zdGFuY2VvZiBNdWx0aVZpZXcpIHtcbiAgICAgIHRoaXMudmlldy5zZXRTZWxlY3RlZChpbml0aWFsU2VsZWN0SW5mby5vcHRpb25zLmZpbHRlcihvcHRpb24gPT4gb3B0aW9uLnNlbGVjdGVkKSk7XG4gICAgfSBlbHNlIGlmIChpbml0aWFsU2VsZWN0SW5mby5kZWZhdWx0U2luZ2xlT3B0aW9uKSB7XG4gICAgICB0aGlzLnZpZXcuc2V0U2VsZWN0ZWQoaW5pdGlhbFNlbGVjdEluZm8uZGVmYXVsdFNpbmdsZU9wdGlvbik7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuYWpheCA9IHBhcmFtcy5hamF4O1xuICB9XG4gIFxuICBkZXN0cm95ID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMudmlldy5kZXN0cm95KCk7XG4gIH1cbiAgXG4gIG9uU2VhcmNoID0gKHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHRoaXMuaXNTZWFyY2hpbmcgPSB0cnVlO1xuICAgIFxuICAgIGlmICh0aGlzLmFqYXgpIHtcbiAgICAgIHRoaXMuYWpheCh0ZXh0LCAoZGF0YTogT3B0aW9uW10pID0+IHtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICBjb25zdCBwYXJzZWREYXRhOiBPcHRpb25bXSA9IGRhdGEubWFwKCh4KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB2YWx1ZTogeC52YWx1ZS50b1N0cmluZygpLFxuICAgICAgICAgICAgICB0ZXh0OiB4LnRleHQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgLy8gc2V0dGluZyBzZWxlY3RlZCBpbiBhIGJhY2tlbmQgc2VhcmNoIG1ha2VzIG5vIHNlbnNlLiBEZWZhdWx0IHNlbGVjdGVkIG9wdGlvbnNcbiAgICAgICAgICAgICAgLy8gbXVzdCBiZSBzZXQgb24gdGhlIG9yaWdpbmFsIGh0bWwuXG4gICAgICAgICAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgaW5uZXJIdG1sOiB4LmlubmVySHRtbCA/IHguaW5uZXJIdG1sLnRvU3RyaW5nKCkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pXG4gICAgICAgICAgcGFyc2VkRGF0YS5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdC5maW5kKChxKSA9PiBxLnNlbGVjdGVkICYmIHEudmFsdWUgPT09IHgudmFsdWUpKSB7XG4gICAgICAgICAgICAgIHguc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgXG4gICAgICAgICAgLy8gV2UgbmVlZCB0byBwcmVzZXJ2ZSBleGlzdGluZyBzZWxlY3RlZCBvcHRpb25zIHRoYXQgZG8gbm90IGFwcGVhciBvbiB0aGUgcmVzdWx0IGZvcm0gdGhlXG4gICAgICAgICAgLy8gYmFja2VuZC5cbiAgICAgICAgICBjb25zdCBwZW5kaW5nT3B0aW9uc1RvSW5jbHVkZSA9IHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QuZmlsdGVyKChxKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcS5zZWxlY3RlZCAmJiAhcGFyc2VkRGF0YS5maW5kKCh4KSA9PiB4LnZhbHVlID09PSBxLnZhbHVlKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIFxuICAgICAgICAgIGNvbnN0IG5ld09wdGlvbnMgPSBwYXJzZWREYXRhLmNvbmNhdChwZW5kaW5nT3B0aW9uc1RvSW5jbHVkZSlcbiAgICAgICAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0ID0gbmV3T3B0aW9ucztcbiAgICAgICAgICBcbiAgICAgICAgICB0aGlzLnZpZXcuc2V0RWxlbWVudE9wdGlvbnMobmV3T3B0aW9ucyk7XG4gICAgICAgICAgdGhpcy52aWV3LnNldERpc3BsYXlMaXN0KHBhcnNlZERhdGEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbWF0Y2hlZE9wdGlvbnMgPSB0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0LmZpbHRlcihvcHRpb24gPT4gdGhpcy5zZWFyY2hGaWx0ZXIob3B0aW9uLnRleHQsIHRleHQpKTtcbiAgICAgIHRoaXMudmlldy5zZXREaXNwbGF5TGlzdChtYXRjaGVkT3B0aW9ucyk7XG4gICAgfVxuICB9XG4gIFxuICBjbG9zZVBhbmVsID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMudmlldy5jbG9zZVBhbmVsKCk7XG4gICAgXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnZpZXcuc2V0RGlzcGxheUxpc3QodGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdCk7XG4gICAgfSwgMTAwKTtcbiAgICB0aGlzLmlzU2VhcmNoaW5nID0gZmFsc2U7XG4gIH1cbiAgXG4gIG9wZW5QYW5lbCA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLnZpZXcub3BlblBhbmVsKCk7XG4gIH1cbiAgXG4gIG9uT3B0aW9uU2VsZWN0ID0gKG9wdGlvbjogT3B0aW9uKTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMudmlldyBpbnN0YW5jZW9mIE11bHRpVmlldykge1xuICAgICAgaWYgKG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy52aWV3LnJlbW92ZVNlbGVjdGVkKG9wdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnZpZXcuYXBwZW5kU2VsZWN0ZWQob3B0aW9uKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3LnNldFNlbGVjdGVkKG9wdGlvbik7XG4gICAgICBcbiAgICAgIHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICB4LnNlbGVjdGVkID0gKHgudmFsdWUgPT09IG9wdGlvbi52YWx1ZSk7XG4gICAgICB9KVxuICAgICAgdGhpcy5jbG9zZVBhbmVsKCk7XG4gICAgfVxuICB9XG4gIFxuICBvblJlbW92ZU11bHRpT3B0aW9uID0gKG9wdGlvbjogT3B0aW9uKTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMudmlldyBpbnN0YW5jZW9mIE11bHRpVmlldykge1xuICAgICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdC5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgIGlmICh4LnZhbHVlID09PSBvcHRpb24udmFsdWUpIHtcbiAgICAgICAgICB4LnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gIFxuICAgICAgdGhpcy52aWV3LnJlbW92ZVNlbGVjdGVkKG9wdGlvbik7XG4gICAgICB0aGlzLnZpZXcuc2V0RGlzcGxheUxpc3QodGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdCk7XG4gICAgfVxuICB9XG4gIFxuICBzZWFyY2hGaWx0ZXIgPSAob3B0aW9uVGV4dDogc3RyaW5nLCBpbnB1dFRleHQ6IHN0cmluZykgOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gb3B0aW9uVGV4dC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoaW5wdXRUZXh0LnRvTG93ZXJDYXNlKCkpICE9PSAtMTtcbiAgfVxuICBcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLGNBQWMsR0FBRyxDQUFDLFNBQWtCLEtBQUk7SUFDNUMsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxJQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25DLElBQUEsSUFBSSxTQUFTLEVBQUU7QUFDYixRQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLEtBQUE7QUFDRCxJQUFBLE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMsQ0FBQTtBQUVELE1BQU0sWUFBWSxHQUFHLE1BQUs7SUFDeEIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QyxJQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLElBQUEsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyxDQUFBO0FBRUQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxRQUFzQixLQUFJO0lBQzdDLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDL0MsSUFBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyQyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBRTdDLElBQUEsTUFBTSxZQUFZLEdBQVc7UUFDM0IsU0FBUztRQUNULEtBQUs7S0FDTixDQUFBO0FBRUQsSUFBQSxLQUFLLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQTtBQUNyQixJQUFBLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFBO0FBQ2xCLElBQUEsS0FBSyxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUE7QUFDNUIsSUFBQSxLQUFLLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUM3QyxJQUFBLEtBQUssQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDM0MsSUFBQSxLQUFLLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUN6QyxJQUFBLEtBQUssQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBRXhDLElBQUEsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFLO0FBQ25DLFFBQUEsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QixLQUFDLENBQUMsQ0FBQTtBQUVGLElBQUEsU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUU1QixJQUFBLE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUMsQ0FBQTtBQUdELE1BQU0sZ0JBQWdCLEdBQUcsTUFBSztJQUM1QixNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzFDLElBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDN0IsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQTtBQUNwQyxJQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFBO0FBR0QsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLE9BQW1CLEtBQW9CO0lBQ2hFLE1BQU0sU0FBUyxHQUFtQixRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQy9ELElBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQTs7SUFHN0MsTUFBTSxLQUFLLEdBQW9CLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDN0QsSUFBQSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNsQyxJQUFBLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7O0lBRzVCLE1BQU0sY0FBYyxHQUFvQixRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3RFLElBQUEsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7SUFFeEMsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNoRCxJQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3JDLElBQUEsY0FBYyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNyQyxJQUFBLFNBQVMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7QUFFckMsSUFBQSxTQUFTLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUU1QixPQUFPO0FBQ0wsUUFBQSxJQUFJLEVBQUUsUUFBUTtRQUNkLFNBQVM7UUFDVCxLQUFLO0FBQ0wsUUFBQSxTQUFTLEVBQUU7QUFDVCxZQUFBLFNBQVMsRUFBRSxjQUFjO0FBQ3pCLFlBQUEsS0FBSyxFQUFFLFNBQVM7QUFDakIsU0FBQTtLQUNGLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLGdCQUFnQixHQUFHLENBQUMsT0FBbUIsS0FBbUI7SUFDOUQsTUFBTSxTQUFTLEdBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDL0QsSUFBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBOztJQUc1QyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVDLElBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDakMsSUFBQSxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBOztJQUc3QixNQUFNLGNBQWMsR0FBb0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN0RSxJQUFBLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBRXhDLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDaEQsSUFBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNyQyxJQUFBLGNBQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDckMsSUFBQSxTQUFTLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBRXJDLElBQUEsU0FBUyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFFNUIsT0FBTztBQUNMLFFBQUEsSUFBSSxFQUFFLE9BQU87UUFDYixTQUFTO1FBQ1QsTUFBTTtBQUNOLFFBQUEsU0FBUyxFQUFFO0FBQ1QsWUFBQSxTQUFTLEVBQUUsY0FBYztBQUN6QixZQUFBLEtBQUssRUFBRSxTQUFTO0FBQ2pCLFNBQUE7S0FDRixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxNQUFjLEVBQUUsY0FBbUMsS0FBSTtJQUMxRSxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzlDLElBQUEsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDbkMsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQ3BCLFFBQUEsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUN6QyxLQUFBO0FBQ0QsSUFBQSxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUN2QyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBRXhDLElBQUEsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFLO1FBQ3RDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QixLQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtBQUNuQixRQUFBLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDOUMsS0FBQTtJQUVELElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtBQUNwQixRQUFBLFFBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUN2QyxLQUFBO0FBQU0sU0FBQTtRQUNMLFFBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUM7QUFDNUMsS0FBQTtBQUVELElBQUEsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQyxDQUFBO0FBRUQsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLE1BQWMsRUFBRSxtQkFBNEMsS0FBSTtJQUM1RixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzNDLElBQUEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDaEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUVuQyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzNDLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUM7QUFDdkMsSUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUVwQyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLElBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDcEIsSUFBQSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3JDLElBQUEsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsS0FBSTtRQUNsQixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDcEIsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsS0FBQyxDQUFBO0FBRUQsSUFBQSxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hCLElBQUEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV2QixJQUFBLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQzs7QUM1SmEsTUFBTyxJQUFJLENBQUE7QUFDaEIsSUFBQSxTQUFTLENBQWdCO0FBQ3pCLElBQUEsT0FBTyxDQUFpQjtBQUN4QixJQUFBLE1BQU0sQ0FBUztBQUNmLElBQUEsSUFBSSxDQUFpQjtBQUNyQixJQUFBLFFBQVEsQ0FBaUM7QUFFekMsSUFBQSxRQUFRLENBQWM7QUFDdEIsSUFBQSxPQUFPLENBQWE7QUFDcEIsSUFBQSxNQUFNLENBQVk7QUFDbEIsSUFBQSxjQUFjLENBQW9CO0FBQ2xDLElBQUEsUUFBUSxDQUFTO0FBRWpCLElBQUEsT0FBTyxDQUFvQjtBQUUzQixJQUFBLHNCQUFzQixDQUFTO0FBRXRDLElBQUEsd0JBQXdCLEdBQUcsQ0FBQyxNQUFtQixLQUFhO0FBQzFELFFBQUEsSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUM3QixZQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2IsU0FBQTthQUFNLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsVUFBeUIsQ0FBQyxDQUFDO0FBQ3hFLFNBQUE7QUFBTSxhQUFBO0FBQ0wsWUFBQSxPQUFPLEtBQUssQ0FBQztBQUNkLFNBQUE7QUFDSCxLQUFDLENBQUE7QUFFRCxJQUFBLGVBQWUsR0FBRyxDQUFDLENBQWEsS0FBSTtBQUNsQyxRQUFBLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDaEcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2hCLFNBQUE7QUFDSCxLQUFDLENBQUE7SUFFRCxnQkFBZ0IsR0FBRyxNQUFXO0FBQzVCLFFBQUEsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2pELEtBQUMsQ0FBQTtJQUVELFdBQ0ksQ0FBQSxFQUFxQixFQUNyQixTQUE2QixFQUM3QixRQUFzQixFQUN0QixjQUFrQyxFQUNsQyxPQUFvQixFQUNwQixNQUFrQixFQUFBO0FBRXBCLFFBQUEsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBRS9DLFFBQUEsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsUUFBQSxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztBQUNyQyxRQUFBLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFFckIsUUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUV0QixRQUFBLElBQUksQ0FBQyxTQUFTLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRTNDLFFBQUEsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRTFCLElBQUksRUFBRSxDQUFDLFVBQVUsRUFBRTtBQUNqQixZQUFBLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQzNELFNBQUE7QUFBTSxhQUFBO0FBQ0wsWUFBQSxNQUFNLElBQUksS0FBSyxDQUFDLCtEQUErRCxDQUFDLENBQUM7QUFDbEYsU0FBQTtRQUVELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQzFEO0lBRUQsT0FBTyxHQUFHLE1BQVc7UUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztRQUN6RCxRQUFRLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUU1RCxRQUFBLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUN2RCxTQUFBO0FBQ0gsS0FBQyxDQUFBO0lBRUQsU0FBUyxHQUFHLE1BQVc7QUFDckIsUUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUVyQixRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQzVELFFBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7UUFFdkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQTtRQUV0RCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7O1FBR3JDLFVBQVUsQ0FBQyxNQUFLO0FBQ2QsWUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQTtTQUMxQixFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ1QsS0FBQyxDQUFBO0lBRUQsVUFBVSxHQUFHLE1BQVc7QUFDdEIsUUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRTdCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUE7UUFDekQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUN6RCxRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3pELFFBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7UUFFMUQsSUFBSSxDQUFD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
