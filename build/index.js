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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9kb21fZmFjdG9yeS50cyIsIi4uL3NyYy92aWV3LnRzIiwiLi4vc3JjL3NpbmdsZV92aWV3LnRzIiwiLi4vc3JjL211bHRpcGxlX3ZpZXcudHMiLCIuLi9zcmMvc2VsZWN0X3BhcnNlci50cyIsIi4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge29uUmVtb3ZlTXVsdGlPcHRpb25UeXBlLCBvblNlYXJjaFR5cGUsIE9wdGlvbiwgU2VhcmNoLCBTaW5nbGVTZWxlY3RlZCwgTXVsdGlTZWxlY3RlZCB9IGZyb20gXCIuL21vZGVsc1wiXG5cbmNvbnN0IGJ1aWxkQ29udGFpbmVyID0gKCkgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NzLW1haW4nKTtcbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuY29uc3QgYnVpbGRDb250ZW50ID0gKCkgPT4ge1xuICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc3MtY29udGVudCcpO1xuICByZXR1cm4gY29udGVudDtcbn1cblxuY29uc3QgYnVpbGRTZWFyY2ggPSAob25TZWFyY2g6IG9uU2VhcmNoVHlwZSkgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3Mtc2VhcmNoJyk7XG4gIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKVxuICBcbiAgY29uc3Qgc2VhcmNoUmV0dXJuOiBTZWFyY2ggPSB7XG4gICAgY29udGFpbmVyLFxuICAgIGlucHV0XG4gIH1cbiAgXG4gIGlucHV0LnR5cGUgPSAnc2VhcmNoJ1xuICBpbnB1dC50YWJJbmRleCA9IDBcbiAgaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgXCJTZWFyY2guLi5cIilcbiAgaW5wdXQuc2V0QXR0cmlidXRlKCdhdXRvY2FwaXRhbGl6ZScsICdvZmYnKVxuICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2F1dG9jb21wbGV0ZScsICdvZmYnKVxuICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2F1dG9jb3JyZWN0JywgJ29mZicpXG4gIFxuICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcbiAgICBvblNlYXJjaChpbnB1dC52YWx1ZSk7XG4gIH0pXG4gIFxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaW5wdXQpXG4gIFxuICByZXR1cm4gc2VhcmNoUmV0dXJuO1xufVxuXG5cbmNvbnN0IGJ1aWxkUmVzdWx0c0xpc3QgPSAoKSA9PiB7XG4gIGNvbnN0IGxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBsaXN0LmNsYXNzTGlzdC5hZGQoJ3NzLWxpc3QnKVxuICBsaXN0LnNldEF0dHJpYnV0ZSgncm9sZScsICdsaXN0Ym94JylcbiAgcmV0dXJuIGxpc3Q7XG59XG5cblxuY29uc3QgYnVpbGRTaW5nbGVTZWxlY3QgPSAob25DbGljazogKCkgPT4gdm9pZCk6IFNpbmdsZVNlbGVjdGVkID0+IHtcbiAgY29uc3QgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1zaW5nbGUtc2VsZWN0ZWQnKVxuICBcbiAgLy8gVGl0bGUgdGV4dFxuICBjb25zdCB0aXRsZTogSFRNTFNwYW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3BsYWNlaG9sZGVyJylcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKVxuICBcbiAgLy8gQXJyb3dcbiAgY29uc3QgYXJyb3dDb250YWluZXI6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICBhcnJvd0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1hcnJvdycpXG4gIFxuICBjb25zdCBhcnJvd0ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgYXJyb3dJY29uLmNsYXNzTGlzdC5hZGQoJ2Fycm93LWRvd24nKVxuICBhcnJvd0NvbnRhaW5lci5hcHBlbmRDaGlsZChhcnJvd0ljb24pXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhcnJvd0NvbnRhaW5lcilcbiAgXG4gIGNvbnRhaW5lci5vbmNsaWNrID0gb25DbGljaztcbiAgXG4gIHJldHVybiB7XG4gICAgdHlwZTogJ3NpbmdsZScsXG4gICAgY29udGFpbmVyLFxuICAgIHRpdGxlLFxuICAgIGFycm93SWNvbjoge1xuICAgICAgY29udGFpbmVyOiBhcnJvd0NvbnRhaW5lcixcbiAgICAgIGFycm93OiBhcnJvd0ljb25cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgYnVpbGRNdWx0aVNlbGVjdCA9IChvbkNsaWNrOiAoKSA9PiB2b2lkKTogTXVsdGlTZWxlY3RlZCA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3MtbXVsdGktc2VsZWN0ZWQnKVxuICBcbiAgLy8gdmFsdWVzXG4gIGNvbnN0IHZhbHVlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIHZhbHVlcy5jbGFzc0xpc3QuYWRkKCdzcy12YWx1ZXMnKVxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodmFsdWVzKVxuICBcbiAgLy8gQXJyb3dcbiAgY29uc3QgYXJyb3dDb250YWluZXI6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICBhcnJvd0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcy1hcnJvdycpXG4gIFxuICBjb25zdCBhcnJvd0ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgYXJyb3dJY29uLmNsYXNzTGlzdC5hZGQoJ2Fycm93LWRvd24nKVxuICBhcnJvd0NvbnRhaW5lci5hcHBlbmRDaGlsZChhcnJvd0ljb24pXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhcnJvd0NvbnRhaW5lcilcbiAgXG4gIGNvbnRhaW5lci5vbmNsaWNrID0gb25DbGljaztcbiAgXG4gIHJldHVybiB7XG4gICAgdHlwZTogJ211bHRpJyxcbiAgICBjb250YWluZXIsXG4gICAgdmFsdWVzLFxuICAgIGFycm93SWNvbjoge1xuICAgICAgY29udGFpbmVyOiBhcnJvd0NvbnRhaW5lcixcbiAgICAgIGFycm93OiBhcnJvd0ljb25cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgYnVpbGRPcHRpb24gPSAob3B0aW9uOiBPcHRpb24sIG9uT3B0aW9uU2VsZWN0OiAoYTogT3B0aW9uKSA9PiB2b2lkKSA9PiB7XG4gIGNvbnN0IG9wdGlvbkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgb3B0aW9uRWwuY2xhc3NMaXN0LmFkZCgnc3Mtb3B0aW9uJylcbiAgb3B0aW9uRWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ29wdGlvbicpXG4gIG9wdGlvbkVsLmRhdGFzZXQuc3NWYWx1ZSA9IG9wdGlvbi52YWx1ZTtcbiAgXG4gIG9wdGlvbkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIG9uT3B0aW9uU2VsZWN0KG9wdGlvbik7XG4gIH0pXG4gIFxuICBpZiAob3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgb3B0aW9uRWwuY2xhc3NMaXN0LmFkZCgnc3Mtb3B0aW9uLXNlbGVjdGVkJyk7XG4gIH1cbiAgXG4gIGlmIChvcHRpb24uaW5uZXJIdG1sKSB7XG4gICAgb3B0aW9uRWwuaW5uZXJIVE1MID0gb3B0aW9uLmlubmVySHRtbDtcbiAgfSBlbHNlIHtcbiAgICBvcHRpb25FbC5pbm5lclRleHQgPSBvcHRpb24udGV4dCB8fCAnXFx4YTAnO1xuICB9XG4gIFxuICByZXR1cm4gb3B0aW9uRWw7XG59XG5cbmNvbnN0IGJ1aWxkTXVsdGlUaXRsZUJhZGdlID0gKG9wdGlvbjogT3B0aW9uLCBvblJlbW92ZU11bHRpT3B0aW9uOiBvblJlbW92ZU11bHRpT3B0aW9uVHlwZSkgPT4ge1xuICBjb25zdCBiYWRnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGJhZGdlLmNsYXNzTGlzdC5hZGQoJ3NzLXZhbHVlJyk7XG4gIGJhZGdlLmRhdGFzZXQudmFsdWUgPSBvcHRpb24udmFsdWU7XG4gIFxuICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gIHNwYW4uaW5uZXJUZXh0ID0gb3B0aW9uLnRleHQgfHwgJ1xceGEwJztcbiAgc3Bhbi5jbGFzc0xpc3QuYWRkKCdzcy12YWx1ZS10ZXh0Jyk7XG4gIFxuICBjb25zdCBkZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGRlbC5pbm5lclRleHQgPSAn4qivJztcbiAgZGVsLmNsYXNzTGlzdC5hZGQoJ3NzLXZhbHVlLWRlbGV0ZScpO1xuICBkZWwub25jbGljayA9IChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBvblJlbW92ZU11bHRpT3B0aW9uKG9wdGlvbik7XG4gIH1cbiAgXG4gIGJhZGdlLmFwcGVuZENoaWxkKHNwYW4pO1xuICBiYWRnZS5hcHBlbmRDaGlsZChkZWwpO1xuICBcbiAgcmV0dXJuIGJhZGdlO1xufVxuICBcblxuZXhwb3J0IHsgYnVpbGRDb250YWluZXIsIGJ1aWxkQ29udGVudCwgYnVpbGRTZWFyY2gsIGJ1aWxkUmVzdWx0c0xpc3QsIGJ1aWxkU2luZ2xlU2VsZWN0LCBidWlsZE11bHRpU2VsZWN0LCBidWlsZE9wdGlvbiwgYnVpbGRNdWx0aVRpdGxlQmFkZ2UgfTsiLCJpbXBvcnQge29uQ2xvc2VUeXBlLCBvbk9wZW5UeXBlLCBvbk9wdGlvblNlbGVjdFR5cGUsIG9uU2VhcmNoVHlwZSwgT3B0aW9uLCBTZWFyY2gsIFNpbmdsZVNlbGVjdGVkLCBNdWx0aVNlbGVjdGVkIH0gZnJvbSBcIi4vbW9kZWxzXCI7XG5pbXBvcnQge1xuICBidWlsZENvbnRhaW5lcixcbiAgYnVpbGRPcHRpb25cbn0gZnJvbSBcIi4vZG9tX2ZhY3RvcnlcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyB7XG4gIHB1YmxpYyBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50XG4gIHB1YmxpYyBjb250ZW50ITogSFRNTERpdkVsZW1lbnRcbiAgcHVibGljIHNlYXJjaCE6IFNlYXJjaFxuICBwdWJsaWMgbGlzdCE6IEhUTUxEaXZFbGVtZW50XG4gIHB1YmxpYyB0aXRsZUJhciE6IFNpbmdsZVNlbGVjdGVkIHwgTXVsdGlTZWxlY3RlZFxuICBcbiAgcHVibGljIG9uU2VhcmNoOiBvblNlYXJjaFR5cGVcbiAgcHVibGljIG9uQ2xvc2U6IG9uQ2xvc2VUeXBlXG4gIHB1YmxpYyBvbk9wZW46IG9uT3BlblR5cGVcbiAgcHVibGljIG9uT3B0aW9uU2VsZWN0OiBvbk9wdGlvblNlbGVjdFR5cGVcbiAgcHVibGljIGlzT3BlbmVkOiBib29sZWFuXG4gIFxuICBwdWJsaWMgZWxlbWVudDogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gIFxuICBwdWJsaWMgb3JpZ2luYWxFbGVtZW50RGlzcGxheTogc3RyaW5nO1xuICBcbiAgdGFyZ2V0QmVsb25nc1RvQ29udGFpbmVyID0gKHRhcmdldDogSFRNTEVsZW1lbnQpOiBib29sZWFuID0+IHtcbiAgICBpZiAodGFyZ2V0ID09PSB0aGlzLmNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICh0YXJnZXQucGFyZW50Tm9kZSkge1xuICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0QmVsb25nc1RvQ29udGFpbmVyKHRhcmdldC5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBcbiAgb25Eb2N1bWVudENsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAodGhpcy5pc09wZW5lZCAmJiBlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmICF0aGlzLnRhcmdldEJlbG9uZ3NUb0NvbnRhaW5lcihlLnRhcmdldCkpIHtcbiAgICAgIHRoaXMub25DbG9zZSgpO1xuICAgIH1cbiAgfVxuICBcbiAgb25DbGlja092ZXJUaXRsZSA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLmlzT3BlbmVkID8gdGhpcy5vbkNsb3NlKCkgOiB0aGlzLm9uT3BlbigpO1xuICB9XG4gIFxuICBjb25zdHJ1Y3RvcihcbiAgICAgIGVsOiBIVE1MU2VsZWN0RWxlbWVudCxcbiAgICAgIG9uU2VhcmNoOiBvblNlYXJjaFR5cGUsXG4gICAgICBvbk9wdGlvblNlbGVjdDogb25PcHRpb25TZWxlY3RUeXBlLFxuICAgICAgb25DbG9zZTogb25DbG9zZVR5cGUsXG4gICAgICBvbk9wZW46IG9uT3BlblR5cGUsXG4gICkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsO1xuICAgIHRoaXMub3JpZ2luYWxFbGVtZW50RGlzcGxheSA9IGVsLnN0eWxlLmRpc3BsYXk7XG4gICAgXG4gICAgdGhpcy5vblNlYXJjaCA9IG9uU2VhcmNoO1xuICAgIHRoaXMub25PcHRpb25TZWxlY3QgPSBvbk9wdGlvblNlbGVjdDtcbiAgICB0aGlzLm9uQ2xvc2UgPSBvbkNsb3NlO1xuICAgIHRoaXMub25PcGVuID0gb25PcGVuO1xuICAgIFxuICAgIHRoaXMuaXNPcGVuZWQgPSBmYWxzZTtcbiAgICBcbiAgICB0aGlzLmNvbnRhaW5lciA9IGJ1aWxkQ29udGFpbmVyKCk7XG4gICAgXG4gICAgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBcbiAgICBpZiAoZWwucGFyZW50Tm9kZSkge1xuICAgICAgZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5jb250YWluZXIsIGVsLm5leHRTaWJsaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoaW4tc2VsZWN0OiBUaGUgZ2l2ZW4gc2VsZWN0IGVsZW1lbnQgbXVzdCBoYXZlIGEgcGFyZW50IG5vZGUnKTtcbiAgICB9XG4gICAgXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uRG9jdW1lbnRDbGljayk7XG4gIH1cbiAgXG4gIGRlc3Ryb3kgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSB0aGlzLm9yaWdpbmFsRWxlbWVudERpc3BsYXk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uRG9jdW1lbnRDbGljayk7XG4gICAgXG4gICAgaWYgKHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmNvbnRhaW5lcilcbiAgICB9XG4gIH1cbiAgXG4gIG9wZW5QYW5lbCA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLmlzT3BlbmVkID0gdHJ1ZTtcbiAgICBcbiAgICB0aGlzLnRpdGxlQmFyLmFycm93SWNvbi5hcnJvdy5jbGFzc0xpc3QucmVtb3ZlKCdhcnJvdy1kb3duJylcbiAgICB0aGlzLnRpdGxlQmFyLmFycm93SWNvbi5hcnJvdy5jbGFzc0xpc3QuYWRkKCdhcnJvdy11cCcpXG4gICAgXG4gICAgdGhpcy50aXRsZUJhci5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3Mtb3Blbi1iZWxvdycpXG4gICAgXG4gICAgdGhpcy5jb250ZW50LmNsYXNzTGlzdC5hZGQoJ3NzLW9wZW4nKVxuICAgIFxuICAgIC8vIHNldFRpbWVvdXQgaXMgZm9yIGFuaW1hdGlvbiBjb21wbGV0aW9uXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNlYXJjaC5pbnB1dC5mb2N1cygpXG4gICAgfSwgMTAwKVxuICB9XG4gIFxuICBjbG9zZVBhbmVsID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuaXNPcGVuZWQgPSBmYWxzZTtcbiAgICB0aGlzLnNlYXJjaC5pbnB1dC52YWx1ZSA9ICcnO1xuICAgIFxuICAgIHRoaXMudGl0bGVCYXIuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3NzLW9wZW4tYWJvdmUnKVxuICAgIHRoaXMudGl0bGVCYXIuY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3NzLW9wZW4tYmVsb3cnKVxuICAgIHRoaXMudGl0bGVCYXIuYXJyb3dJY29uLmFycm93LmNsYXNzTGlzdC5hZGQoJ2Fycm93LWRvd24nKVxuICAgIHRoaXMudGl0bGVCYXIuYXJyb3dJY29uLmFycm93LmNsYXNzTGlzdC5yZW1vdmUoJ2Fycm93LXVwJylcbiAgICBcbiAgICB0aGlzLmNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnc3Mtb3BlbicpXG4gIH1cbiAgXG4gIFxuICBzZXREaXNwbGF5TGlzdCA9IChvcHRpb25zOiBPcHRpb25bXSk6IHZvaWQgPT4ge1xuICAgIHRoaXMubGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICBvcHRpb25zLmZvckVhY2goKG9wdGlvbikgPT4gdGhpcy5saXN0LmFwcGVuZENoaWxkKGJ1aWxkT3B0aW9uKG9wdGlvbiwgdGhpcy5vbk9wdGlvblNlbGVjdCkpKVxuICB9O1xuICBcbiAgc2V0RWxlbWVudE9wdGlvbnMgPSAob3B0aW9uczogT3B0aW9uW10pOiB2b2lkID0+IHtcbiAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgXG4gICAgb3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgIGNvbnN0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0LnZhbHVlID0gb3B0aW9uLnZhbHVlO1xuICAgICAgb3B0LmlubmVyVGV4dCA9IG9wdGlvbi50ZXh0O1xuICAgICAgb3B0LnNlbGVjdGVkID0gb3B0aW9uLnNlbGVjdGVkO1xuICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG9wdCk7XG4gICAgfSlcbiAgfVxuICBcbn0iLCJpbXBvcnQge29uQ2xvc2VUeXBlLCBvbk9wZW5UeXBlLCBvbk9wdGlvblNlbGVjdFR5cGUsIG9uU2VhcmNoVHlwZSwgT3B0aW9ufSBmcm9tIFwiLi9tb2RlbHNcIjtcbmltcG9ydCB7XG4gIGJ1aWxkQ29udGVudCxcbiAgYnVpbGRSZXN1bHRzTGlzdCxcbiAgYnVpbGRTZWFyY2gsXG4gIGJ1aWxkU2luZ2xlU2VsZWN0LFxufSBmcm9tIFwiLi9kb21fZmFjdG9yeVwiO1xuaW1wb3J0IFZpZXcgZnJvbSBcIi4vdmlld1wiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbmdsZVZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBlbDogSFRNTFNlbGVjdEVsZW1lbnQsXG4gICAgICBvblNlYXJjaDogb25TZWFyY2hUeXBlLFxuICAgICAgb25PcHRpb25TZWxlY3Q6IG9uT3B0aW9uU2VsZWN0VHlwZSxcbiAgICAgIG9uQ2xvc2U6IG9uQ2xvc2VUeXBlLFxuICAgICAgb25PcGVuOiBvbk9wZW5UeXBlLFxuICApIHtcbiAgICBzdXBlcihlbCwgb25TZWFyY2gsIG9uT3B0aW9uU2VsZWN0LCBvbkNsb3NlLCBvbk9wZW4pO1xuICAgIFxuICAgIHRoaXMuY29udGVudCA9IGJ1aWxkQ29udGVudCgpO1xuICAgIHRoaXMuc2VhcmNoID0gYnVpbGRTZWFyY2godGhpcy5vblNlYXJjaCk7XG4gICAgdGhpcy5saXN0ID0gYnVpbGRSZXN1bHRzTGlzdCgpO1xuICAgIFxuICAgIHRoaXMudGl0bGVCYXIgPSBidWlsZFNpbmdsZVNlbGVjdCh0aGlzLm9uQ2xpY2tPdmVyVGl0bGUpO1xuICAgIFxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMudGl0bGVCYXIuY29udGFpbmVyKVxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udGVudClcbiAgICBcbiAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5zZWFyY2guY29udGFpbmVyKVxuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLmxpc3QpXG4gIH1cbiAgXG4gIHNldFNlbGVjdGVkID0gKG9wdGlvbjogT3B0aW9uKTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMudGl0bGVCYXIudHlwZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgIHRoaXMudGl0bGVCYXIudGl0bGUuaW5uZXJUZXh0ID0gb3B0aW9uLnRleHQ7XG4gICAgfVxuICAgIFxuICAgIEFycmF5LmZyb20odGhpcy5lbGVtZW50Lm9wdGlvbnMpLmZvckVhY2goKG8pID0+IHtcbiAgICAgIGlmIChvLnZhbHVlID09PSBvcHRpb24udmFsdWUpIHtcbiAgICAgICAgby5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBcbn0iLCJpbXBvcnQge1xuICBvbkNsb3NlVHlwZSxcbiAgb25PcGVuVHlwZSxcbiAgb25PcHRpb25TZWxlY3RUeXBlLFxuICBvblJlbW92ZU11bHRpT3B0aW9uVHlwZSxcbiAgb25TZWFyY2hUeXBlLFxuICBPcHRpb25cbn0gZnJvbSBcIi4vbW9kZWxzXCI7XG5pbXBvcnQge1xuICBidWlsZENvbnRlbnQsXG4gIGJ1aWxkUmVzdWx0c0xpc3QsXG4gIGJ1aWxkU2VhcmNoLFxuICBidWlsZE11bHRpU2VsZWN0LFxuICBidWlsZE11bHRpVGl0bGVCYWRnZVxufSBmcm9tIFwiLi9kb21fZmFjdG9yeVwiO1xuaW1wb3J0IFZpZXcgZnJvbSBcIi4vdmlld1wiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpVmlldyBleHRlbmRzIFZpZXcge1xuICBwdWJsaWMgb25SZW1vdmVNdWx0aU9wdGlvbjogb25SZW1vdmVNdWx0aU9wdGlvblR5cGVcbiAgXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZWw6IEhUTUxTZWxlY3RFbGVtZW50LFxuICAgICAgb25TZWFyY2g6IG9uU2VhcmNoVHlwZSxcbiAgICAgIG9uT3B0aW9uU2VsZWN0OiBvbk9wdGlvblNlbGVjdFR5cGUsXG4gICAgICBvbkNsb3NlOiBvbkNsb3NlVHlwZSxcbiAgICAgIG9uT3Blbjogb25PcGVuVHlwZSxcbiAgICAgIG9uUmVtb3ZlTXVsdGlPcHRpb246IG9uUmVtb3ZlTXVsdGlPcHRpb25UeXBlXG4gICkge1xuICAgIHN1cGVyKGVsLCBvblNlYXJjaCwgb25PcHRpb25TZWxlY3QsIG9uQ2xvc2UsIG9uT3Blbik7XG4gICAgdGhpcy5vblJlbW92ZU11bHRpT3B0aW9uID0gb25SZW1vdmVNdWx0aU9wdGlvbjtcbiAgICBcbiAgICB0aGlzLmNvbnRlbnQgPSBidWlsZENvbnRlbnQoKTtcbiAgICB0aGlzLnNlYXJjaCA9IGJ1aWxkU2VhcmNoKHRoaXMub25TZWFyY2gpO1xuICAgIHRoaXMubGlzdCA9IGJ1aWxkUmVzdWx0c0xpc3QoKTtcbiAgICBcbiAgICB0aGlzLnRpdGxlQmFyID0gYnVpbGRNdWx0aVNlbGVjdCh0aGlzLm9uQ2xpY2tPdmVyVGl0bGUpO1xuICAgIFxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMudGl0bGVCYXIuY29udGFpbmVyKVxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udGVudClcbiAgICBcbiAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5zZWFyY2guY29udGFpbmVyKVxuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLmxpc3QpXG4gIH1cbiAgXG4gIFxuICBzZXRTZWxlY3RlZCA9IChvcHRpb25zOiBPcHRpb25bXSk6IHZvaWQgPT4ge1xuICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICBjb25zdCBiYWRnZSA9IGJ1aWxkTXVsdGlUaXRsZUJhZGdlKG9wdGlvbiwgdGhpcy5vblJlbW92ZU11bHRpT3B0aW9uKTtcbiAgICAgIGlmICh0aGlzLnRpdGxlQmFyLnR5cGUgPT09ICdtdWx0aScpIHtcbiAgICAgICAgdGhpcy50aXRsZUJhci52YWx1ZXMuYXBwZW5kQ2hpbGQoYmFkZ2UpO1xuICAgICAgfVxuICAgIH0pXG4gICAgXG4gICAgQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnQub3B0aW9ucykuZm9yRWFjaCgobykgPT4ge1xuICAgICAgaWYgKG9wdGlvbnMuZmluZCgoeCkgPT4geC5zZWxlY3RlZCAmJiB4LnZhbHVlID09PSBvLnZhbHVlKSkge1xuICAgICAgICBvLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG8uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIFxuICBhcHBlbmRTZWxlY3RlZCA9IChvcHRpb246IE9wdGlvbik6IHZvaWQgPT4ge1xuICAgIGlmICh0aGlzLnRpdGxlQmFyLnR5cGUgPT09ICdtdWx0aScpIHtcbiAgICAgIFxuICAgICAgY29uc3QgYmFkZ2UgPSBidWlsZE11bHRpVGl0bGVCYWRnZShvcHRpb24sIHRoaXMub25SZW1vdmVNdWx0aU9wdGlvbik7XG4gICAgICB0aGlzLnRpdGxlQmFyLnZhbHVlcy5hcHBlbmRDaGlsZChiYWRnZSk7XG4gICAgICBcbiAgICAgIEFycmF5LmZyb20odGhpcy5saXN0LmNoaWxkcmVuKS5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgIGlmICh4IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgeC5kYXRhc2V0LnNzVmFsdWUgPT09IG9wdGlvbi52YWx1ZSkge1xuICAgICAgICAgIHguY2xhc3NMaXN0LmFkZCgnc3Mtb3B0aW9uLXNlbGVjdGVkJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBcbiAgICAgIGNvbnN0IGRvbU9wdGlvbiA9IEFycmF5LmZyb20odGhpcy5lbGVtZW50Lm9wdGlvbnMpLmZpbmQoKG8pID0+IG8udmFsdWUgPT09IG9wdGlvbi52YWx1ZSlcbiAgICAgIGlmIChkb21PcHRpb24pIHtcbiAgICAgICAgZG9tT3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIHJlbW92ZVNlbGVjdGVkID0gKG9wdGlvbjogT3B0aW9uKTogdm9pZCA9PiB7XG4gICAgaWYgKHRoaXMudGl0bGVCYXIudHlwZSA9PT0gJ211bHRpJykge1xuICAgICAgXG4gICAgICBjb25zdCBkb21CYWRnZSA9IEFycmF5LmZyb20odGhpcy50aXRsZUJhci52YWx1ZXMuY2hpbGRyZW4pLmZpbmQoKHgpID0+IHtcbiAgICAgICAgcmV0dXJuICh4IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpICYmIHguZGF0YXNldC52YWx1ZSA9PT0gb3B0aW9uLnZhbHVlO1xuICAgICAgfSlcbiAgICAgIFxuICAgICAgaWYgKGRvbUJhZGdlKSB7XG4gICAgICAgIGRvbUJhZGdlLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBBcnJheS5mcm9tKHRoaXMubGlzdC5jaGlsZHJlbikuZm9yRWFjaCgoeCkgPT4ge1xuICAgICAgICBpZiAoeCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIHguZGF0YXNldC5zc1ZhbHVlID09PSBvcHRpb24udmFsdWUpIHtcbiAgICAgICAgICB4LmNsYXNzTGlzdC5yZW1vdmUoJ3NzLW9wdGlvbi1zZWxlY3RlZCcpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgXG4gICAgICBjb25zdCBkb21PcHRpb24gPSBBcnJheS5mcm9tKHRoaXMuZWxlbWVudC5vcHRpb25zKS5maW5kKChvKSA9PiBvLnZhbHVlID09PSBvcHRpb24udmFsdWUpXG4gICAgICBpZiAoZG9tT3B0aW9uKSB7XG4gICAgICAgIGRvbU9wdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbn0iLCJpbXBvcnQge09wdGlvbn0gZnJvbSBcIi4vbW9kZWxzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdFBhcnNlciB7XG4gIHB1YmxpYyBlbDogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gIFxuICBjb25zdHJ1Y3RvcihlbDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAoIShlbCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGluLXNlbGVjdDogXCJzZWxlY3RcIiBkb20gZWxlbWVudCBtdXN0IGJlIGFuIEhUTUxTZWxlY3RFbGVtZW50Jyk7XG4gICAgfVxuICAgIHRoaXMuZWwgPSBlbDtcbiAgfVxuICBcbiAgYW5hbHl6ZSgpIHtcbiAgICBjb25zdCBpc011bHRpcGxlID0gdGhpcy5lbC5tdWx0aXBsZTtcbiAgICBjb25zdCBvcHRpb25zOiBPcHRpb25bXSA9IFtdO1xuICAgIFxuICAgIEFycmF5LmZyb20odGhpcy5lbC5vcHRpb25zKS5mb3JFYWNoKChvcHRpb246IEhUTUxPcHRpb25FbGVtZW50KSA9PiB7XG4gICAgICBvcHRpb25zLnB1c2goe3ZhbHVlOiBvcHRpb24udmFsdWUsIHRleHQ6IG9wdGlvbi50ZXh0LCBzZWxlY3RlZDogb3B0aW9uLnNlbGVjdGVkfSk7XG4gICAgfSk7XG4gICAgXG4gICAgLy8gRm9sbG93cyBkZWZhdWx0IGJyb3dzZXIgYmVoYXZpb3Igb24gY2hvb3Npbmcgd2hhdCBvcHRpb24gdG8gZGlzcGxheSBpbml0aWFsbHk6XG4gICAgLy8gTGFzdCBvZiB0aGUgc2VsZWN0ZWQgb3IgdGhlIGZpcnN0IG9uZSAob25seSBmb3Igc2luZ2xlIHNlbGVjdHMpLlxuICAgIGxldCBkZWZhdWx0U2luZ2xlT3B0aW9uO1xuICAgIFxuICAgIG9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgaWYgKG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICBkZWZhdWx0U2luZ2xlT3B0aW9uID0gb3B0aW9uO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIGRlZmF1bHRTaW5nbGVPcHRpb24gPSBkZWZhdWx0U2luZ2xlT3B0aW9uIHx8IG9wdGlvbnNbMF07XG4gICAgXG4gICAgcmV0dXJuICh7XG4gICAgICBpc011bHRpcGxlLFxuICAgICAgb3B0aW9ucyxcbiAgICAgIGRlZmF1bHRTaW5nbGVPcHRpb25cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IFwiLi4vc3R5bGVzL3RoaW4tc2VsZWN0LnNjc3NcIlxuaW1wb3J0IFNpbmdsZVZpZXcgZnJvbSBcIi4vc2luZ2xlX3ZpZXdcIjtcbmltcG9ydCBNdWx0aVZpZXcgZnJvbSBcIi4vbXVsdGlwbGVfdmlld1wiO1xuaW1wb3J0IFNlbGVjdFBhcnNlciBmcm9tIFwiLi9zZWxlY3RfcGFyc2VyXCI7XG5pbXBvcnQge2FqYXhDYWxsYmFja1R5cGUsIE9wdGlvbn0gZnJvbSBcIi4vbW9kZWxzXCJcblxuaW50ZXJmYWNlIFRoaW5TZWxlY3RQYXJhbXMge1xuICBzZWxlY3Q6IHN0cmluZyB8IEhUTUxTZWxlY3RFbGVtZW50O1xuICBhamF4PzogYWpheENhbGxiYWNrVHlwZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGhpblNlbGVjdCB7XG4gIHB1YmxpYyB2aWV3OiBTaW5nbGVWaWV3IHwgTXVsdGlWaWV3O1xuICBwdWJsaWMgZGlzcGxheWVkT3B0aW9uc0xpc3Q6IE9wdGlvbltdO1xuICBwdWJsaWMgaXNTZWFyY2hpbmc6IGJvb2xlYW47XG4gIHB1YmxpYyBhamF4OiBhamF4Q2FsbGJhY2tUeXBlIHwgdW5kZWZpbmVkO1xuICBcbiAgY29uc3RydWN0b3IocGFyYW1zOiBUaGluU2VsZWN0UGFyYW1zKSB7XG4gICAgY29uc3QgZWw6IEhUTUxTZWxlY3RFbGVtZW50ID0gdHlwZW9mIChwYXJhbXMuc2VsZWN0KSA9PT0gXCJzdHJpbmdcIiA/IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhcmFtcy5zZWxlY3QpIGFzIEhUTUxTZWxlY3RFbGVtZW50KSA6IHBhcmFtcy5zZWxlY3Q7XG4gICAgXG4gICAgY29uc3QgaW5pdGlhbFNlbGVjdEluZm8gPSAobmV3IFNlbGVjdFBhcnNlcihlbCkpLmFuYWx5emUoKTtcbiAgICBcbiAgICB0aGlzLmlzU2VhcmNoaW5nID0gZmFsc2U7XG4gICAgXG4gICAgaWYgKGluaXRpYWxTZWxlY3RJbmZvLmlzTXVsdGlwbGUpIHtcbiAgICAgIHRoaXMudmlldyA9IG5ldyBNdWx0aVZpZXcoXG4gICAgICAgICAgZWwsXG4gICAgICAgICAgdGhpcy5vblNlYXJjaCxcbiAgICAgICAgICB0aGlzLm9uT3B0aW9uU2VsZWN0LFxuICAgICAgICAgIHRoaXMuY2xvc2VQYW5lbCxcbiAgICAgICAgICB0aGlzLm9wZW5QYW5lbCxcbiAgICAgICAgICB0aGlzLm9uUmVtb3ZlTXVsdGlPcHRpb25cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldyA9IG5ldyBTaW5nbGVWaWV3KFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIHRoaXMub25TZWFyY2gsXG4gICAgICAgICAgdGhpcy5vbk9wdGlvblNlbGVjdCxcbiAgICAgICAgICB0aGlzLmNsb3NlUGFuZWwsXG4gICAgICAgICAgdGhpcy5vcGVuUGFuZWwsXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0ID0gaW5pdGlhbFNlbGVjdEluZm8ub3B0aW9ucztcbiAgICBcbiAgICBpZiAoIXBhcmFtcy5hamF4KSB7XG4gICAgICB0aGlzLnZpZXcuc2V0RGlzcGxheUxpc3QodGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdCk7XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnZpZXcgaW5zdGFuY2VvZiBNdWx0aVZpZXcpIHtcbiAgICAgIHRoaXMudmlldy5zZXRTZWxlY3RlZChpbml0aWFsU2VsZWN0SW5mby5vcHRpb25zLmZpbHRlcihvcHRpb24gPT4gb3B0aW9uLnNlbGVjdGVkKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldy5zZXRTZWxlY3RlZChpbml0aWFsU2VsZWN0SW5mby5kZWZhdWx0U2luZ2xlT3B0aW9uKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5hamF4ID0gcGFyYW1zLmFqYXg7XG4gIH1cbiAgXG4gIGRlc3Ryb3kgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy52aWV3LmRlc3Ryb3koKTtcbiAgfVxuICBcbiAgb25TZWFyY2ggPSAodGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgdGhpcy5pc1NlYXJjaGluZyA9IHRydWU7XG4gICAgXG4gICAgaWYgKHRoaXMuYWpheCkge1xuICAgICAgdGhpcy5hamF4KHRleHQsIChkYXRhOiBPcHRpb25bXSkgPT4ge1xuICAgICAgICBkYXRhLmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdC5maW5kKChxKSA9PiBxLnNlbGVjdGVkICYmIHEudmFsdWUgPT09IHgudmFsdWUpKSB7XG4gICAgICAgICAgICB4LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QgPSBkYXRhO1xuICAgICAgICB0aGlzLnZpZXcuc2V0RWxlbWVudE9wdGlvbnMoZGF0YSk7XG4gICAgICAgIHRoaXMudmlldy5zZXREaXNwbGF5TGlzdChkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtYXRjaGVkT3B0aW9ucyA9IHRoaXMuZGlzcGxheWVkT3B0aW9uc0xpc3QuZmlsdGVyKG9wdGlvbiA9PiB0aGlzLnNlYXJjaEZpbHRlcihvcHRpb24udGV4dCwgdGV4dCkpO1xuICAgICAgdGhpcy52aWV3LnNldERpc3BsYXlMaXN0KG1hdGNoZWRPcHRpb25zKTtcbiAgICB9XG4gIH1cbiAgXG4gIGNsb3NlUGFuZWwgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy52aWV3LmNsb3NlUGFuZWwoKTtcbiAgICBcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudmlldy5zZXREaXNwbGF5TGlzdCh0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0KTtcbiAgICB9LCAxMDApO1xuICAgIHRoaXMuaXNTZWFyY2hpbmcgPSBmYWxzZTtcbiAgfVxuICBcbiAgb3BlblBhbmVsID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMudmlldy5vcGVuUGFuZWwoKTtcbiAgfVxuICBcbiAgb25PcHRpb25TZWxlY3QgPSAob3B0aW9uOiBPcHRpb24pOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy52aWV3IGluc3RhbmNlb2YgTXVsdGlWaWV3KSB7XG4gICAgICBpZiAob3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnZpZXcucmVtb3ZlU2VsZWN0ZWQob3B0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMudmlldy5hcHBlbmRTZWxlY3RlZChvcHRpb24pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXcuc2V0U2VsZWN0ZWQob3B0aW9uKTtcbiAgICAgIFxuICAgICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zTGlzdC5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICAgIGlmICh4LnZhbHVlID09PSBvcHRpb24udmFsdWUpIHtcbiAgICAgICAgICB4LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB4LnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLmNsb3NlUGFuZWwoKTtcbiAgICB9XG4gIH1cbiAgXG4gIG9uUmVtb3ZlTXVsdGlPcHRpb24gPSAob3B0aW9uOiBPcHRpb24pOiB2b2lkID0+IHtcbiAgICBpZiAodGhpcy52aWV3IGluc3RhbmNlb2YgTXVsdGlWaWV3KSB7XG4gICAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0LmZvckVhY2goKHgpID0+IHtcbiAgICAgICAgaWYgKHgudmFsdWUgPT09IG9wdGlvbi52YWx1ZSkge1xuICAgICAgICAgIHguc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgXG4gICAgICB0aGlzLnZpZXcucmVtb3ZlU2VsZWN0ZWQob3B0aW9uKTtcbiAgICAgIHRoaXMudmlldy5zZXREaXNwbGF5TGlzdCh0aGlzLmRpc3BsYXllZE9wdGlvbnNMaXN0KTtcbiAgICB9XG4gIH1cbiAgXG4gIHNlYXJjaEZpbHRlciA9IChvcHRpb25UZXh0OiBzdHJpbmcsIGlucHV0VGV4dDogc3RyaW5nKSA6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiBvcHRpb25UZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihpbnB1dFRleHQudG9Mb3dlckNhc2UoKSkgIT09IC0xO1xuICB9XG4gIFxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sY0FBYyxHQUFHLE1BQUs7SUFDMUIsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxJQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25DLElBQUEsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyxDQUFBO0FBRUQsTUFBTSxZQUFZLEdBQUcsTUFBSztJQUN4QixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlDLElBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDcEMsSUFBQSxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDLENBQUE7QUFFRCxNQUFNLFdBQVcsR0FBRyxDQUFDLFFBQXNCLEtBQUk7SUFDN0MsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMvQyxJQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUE7QUFFN0MsSUFBQSxNQUFNLFlBQVksR0FBVztRQUMzQixTQUFTO1FBQ1QsS0FBSztLQUNOLENBQUE7QUFFRCxJQUFBLEtBQUssQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFBO0FBQ3JCLElBQUEsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUE7QUFDbEIsSUFBQSxLQUFLLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUM3QyxJQUFBLEtBQUssQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDM0MsSUFBQSxLQUFLLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUN6QyxJQUFBLEtBQUssQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBRXhDLElBQUEsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFLO0FBQ25DLFFBQUEsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QixLQUFDLENBQUMsQ0FBQTtBQUVGLElBQUEsU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUU1QixJQUFBLE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUMsQ0FBQTtBQUdELE1BQU0sZ0JBQWdCLEdBQUcsTUFBSztJQUM1QixNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzFDLElBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDN0IsSUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQTtBQUNwQyxJQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFBO0FBR0QsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLE9BQW1CLEtBQW9CO0lBQ2hFLE1BQU0sU0FBUyxHQUFtQixRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQy9ELElBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQTs7SUFHN0MsTUFBTSxLQUFLLEdBQW9CLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDN0QsSUFBQSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNsQyxJQUFBLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7O0lBRzVCLE1BQU0sY0FBYyxHQUFvQixRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3RFLElBQUEsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7SUFFeEMsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNoRCxJQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3JDLElBQUEsY0FBYyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNyQyxJQUFBLFNBQVMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7QUFFckMsSUFBQSxTQUFTLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUU1QixPQUFPO0FBQ0wsUUFBQSxJQUFJLEVBQUUsUUFBUTtRQUNkLFNBQVM7UUFDVCxLQUFLO0FBQ0wsUUFBQSxTQUFTLEVBQUU7QUFDVCxZQUFBLFNBQVMsRUFBRSxjQUFjO0FBQ3pCLFlBQUEsS0FBSyxFQUFFLFNBQVM7QUFDakIsU0FBQTtLQUNGLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLGdCQUFnQixHQUFHLENBQUMsT0FBbUIsS0FBbUI7SUFDOUQsTUFBTSxTQUFTLEdBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDL0QsSUFBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBOztJQUc1QyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVDLElBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDakMsSUFBQSxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBOztJQUc3QixNQUFNLGNBQWMsR0FBb0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN0RSxJQUFBLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBRXhDLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDaEQsSUFBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNyQyxJQUFBLGNBQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDckMsSUFBQSxTQUFTLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBRXJDLElBQUEsU0FBUyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFFNUIsT0FBTztBQUNMLFFBQUEsSUFBSSxFQUFFLE9BQU87UUFDYixTQUFTO1FBQ1QsTUFBTTtBQUNOLFFBQUEsU0FBUyxFQUFFO0FBQ1QsWUFBQSxTQUFTLEVBQUUsY0FBYztBQUN6QixZQUFBLEtBQUssRUFBRSxTQUFTO0FBQ2pCLFNBQUE7S0FDRixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxNQUFjLEVBQUUsY0FBbUMsS0FBSTtJQUMxRSxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzlDLElBQUEsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDbkMsSUFBQSxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUN2QyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBRXhDLElBQUEsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFLO1FBQ3RDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QixLQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtBQUNuQixRQUFBLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDOUMsS0FBQTtJQUVELElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtBQUNwQixRQUFBLFFBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUN2QyxLQUFBO0FBQU0sU0FBQTtRQUNMLFFBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUM7QUFDNUMsS0FBQTtBQUVELElBQUEsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQyxDQUFBO0FBRUQsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLE1BQWMsRUFBRSxtQkFBNEMsS0FBSTtJQUM1RixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzNDLElBQUEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDaEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUVuQyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzNDLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUM7QUFDdkMsSUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUVwQyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLElBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDcEIsSUFBQSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3JDLElBQUEsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsS0FBSTtRQUNsQixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDcEIsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsS0FBQyxDQUFBO0FBRUQsSUFBQSxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hCLElBQUEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV2QixJQUFBLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQzs7QUNySmEsTUFBTyxJQUFJLENBQUE7QUFDaEIsSUFBQSxTQUFTLENBQWdCO0FBQ3pCLElBQUEsT0FBTyxDQUFpQjtBQUN4QixJQUFBLE1BQU0sQ0FBUztBQUNmLElBQUEsSUFBSSxDQUFpQjtBQUNyQixJQUFBLFFBQVEsQ0FBaUM7QUFFekMsSUFBQSxRQUFRLENBQWM7QUFDdEIsSUFBQSxPQUFPLENBQWE7QUFDcEIsSUFBQSxNQUFNLENBQVk7QUFDbEIsSUFBQSxjQUFjLENBQW9CO0FBQ2xDLElBQUEsUUFBUSxDQUFTO0FBRWpCLElBQUEsT0FBTyxDQUFvQjtBQUUzQixJQUFBLHNCQUFzQixDQUFTO0FBRXRDLElBQUEsd0JBQXdCLEdBQUcsQ0FBQyxNQUFtQixLQUFhO0FBQzFELFFBQUEsSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUM3QixZQUFBLE9BQU8sSUFBSSxDQUFDO0FBQ2IsU0FBQTthQUFNLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUM1QixPQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsVUFBeUIsQ0FBQyxDQUFDO0FBQ3hFLFNBQUE7QUFBTSxhQUFBO0FBQ0wsWUFBQSxPQUFPLEtBQUssQ0FBQztBQUNkLFNBQUE7QUFDSCxLQUFDLENBQUE7QUFFRCxJQUFBLGVBQWUsR0FBRyxDQUFDLENBQWEsS0FBSTtBQUNsQyxRQUFBLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDaEcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2hCLFNBQUE7QUFDSCxLQUFDLENBQUE7SUFFRCxnQkFBZ0IsR0FBRyxNQUFXO0FBQzVCLFFBQUEsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2pELEtBQUMsQ0FBQTtJQUVELFdBQ0ksQ0FBQSxFQUFxQixFQUNyQixRQUFzQixFQUN0QixjQUFrQyxFQUNsQyxPQUFvQixFQUNwQixNQUFrQixFQUFBO0FBRXBCLFFBQUEsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBRS9DLFFBQUEsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsUUFBQSxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztBQUNyQyxRQUFBLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUEsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFFckIsUUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUV0QixRQUFBLElBQUksQ0FBQyxTQUFTLEdBQUcsY0FBYyxFQUFFLENBQUM7QUFFbEMsUUFBQSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFFMUIsSUFBSSxFQUFFLENBQUMsVUFBVSxFQUFFO0FBQ2pCLFlBQUEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDM0QsU0FBQTtBQUFNLGFBQUE7QUFDTCxZQUFBLE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztBQUNsRixTQUFBO1FBRUQsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDMUQ7SUFFRCxPQUFPLEdBQUcsTUFBVztRQUNuQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDO1FBQ3pELFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTVELFFBQUEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRTtZQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3ZELFNBQUE7QUFDSCxLQUFDLENBQUE7SUFFRCxTQUFTLEdBQUcsTUFBVztBQUNyQixRQUFBLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBRXJCLFFBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDNUQsUUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUV2RCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFBO1FBRXRELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTs7UUFHckMsVUFBVSxDQUFDLE1BQUs7QUFDZCxZQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFBO1NBQzFCLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDVCxLQUFDLENBQUE7SUFFRCxVQUFVLEdBQUcsTUFBVztBQUN0QixRQUFBLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFFN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQTtRQUN6RCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQ3pELFFBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDekQsUUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUUxRCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDMUMsS0FBQyxDQUFBO0FBR0QsSUFBQSxjQUFjLEdBQUcsQ0FBQyxPQUFpQixLQUFVO0FBQzNDLFFBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlGLEtBQUMsQ0FBQztBQUVGLElBQUEsaUJBQWlCLEdBQUcsQ0FBQyxPQUFpQixLQUFVO0FBQzlDLFFBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBRTVCLFFBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sS0FBSTtZQUN6QixNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdDLFlBQUEsR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3pCLFlBQUEsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQzVCLFlBQUEsR0FBRyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQy9CLFlBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsU0FBQyxDQUFDLENBQUE7QUFDSixLQUFDLENBQUE7QUFFRjs7QUN0SG9CLE1BQUEsVUFBVyxTQUFRLElBQUksQ0FBQTtJQUMxQyxXQUNJLENBQUEsRUFBcUIsRUFDckIsUUFBc0IsRUFDdEIsY0FBa0MsRUFDbEMsT0FBb0IsRUFDcEIsTUFBa0IsRUFBQTtRQUVwQixLQUFLLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBRXJELFFBQUEsSUFBSSxDQUFDLE9BQU8sR0FBRyxZQUFZLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekMsUUFBQSxJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFnQixFQUFFLENBQUM7UUFFL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUV6RCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUV4QyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNwQztBQUVELElBQUEsV0FBVyxHQUFHLENBQUMsTUFBYyxLQUFVO0FBQ3JDLFFBQUEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDN0MsU0FBQTtBQUVELFFBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSTtBQUM3QyxZQUFBLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQzVCLGdCQUFBLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ25CLGFBQUE7QUFBTSxpQkFBQTtBQUNMLGdCQUFBLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLGFBQUE7QUFDSCxTQUFDLENBQUMsQ0FBQTtBQUNKLEtBQUMsQ0FBQTtBQUVGOztBQzdCb0IsTUFBQSxTQUFVLFNBQVEsSUFBSSxDQUFBO0FBQ2xDLElBQUEsbUJBQW1CLENBQXlCO0lBRW5ELFdBQ0ksQ0FBQSxFQUFxQixFQUNyQixRQUFzQixFQUN0QixjQUFrQyxFQUNsQyxPQUFvQixFQUNwQixNQUFrQixFQUNsQixtQkFBNEMsRUFBQTtRQUU5QyxLQUFLLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3JELFFBQUEsSUFBSSxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO0FBRS9DLFFBQUEsSUFBSSxDQUFDLE9BQU8sR0FBRyxZQUFZLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekMsUUFBQSxJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFnQixFQUFFLENBQUM7UUFFL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUV4RCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUV4QyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNwQztBQUdELElBQUEsV0FBVyxHQUFHLENBQUMsT0FBaUIsS0FBVTtBQUN4QyxRQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUk7WUFDekIsTUFBTSxLQUFLLEdBQUcsb0JBQW9CLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3JFLFlBQUEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QyxhQUFBO0FBQ0gsU0FBQyxDQUFDLENBQUE7QUFFRixRQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUk7WUFDN0MsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDMUQsZ0JBQUEsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDbkIsYUFBQTtBQUFNLGlCQUFBO0FBQ0wsZ0JBQUEsQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDcEIsYUFBQTtBQUNILFNBQUMsQ0FBQyxDQUFBO0FBQ0osS0FBQyxDQUFBO0FBRUQsSUFBQSxjQUFjLEdBQUcsQ0FBQyxNQUFjLEtBQVU7QUFDeEMsUUFBQSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtZQUVsQyxNQUFNLEtBQUssR0FBRyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXhDLFlBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSTtBQUMzQyxnQkFBQSxJQUFJLENBQUMsWUFBWSxXQUFXLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDLEtBQUssRUFBRTtBQUNsRSxvQkFBQSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3ZDLGlCQUFBO0FBQ0gsYUFBQyxDQUFDLENBQUE7QUFFRixZQUFBLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDeEYsWUFBQSxJQUFJLFNBQVMsRUFBRTtBQUNiLGdCQUFBLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQzNCLGFBQUE7QUFDRixTQUFBO0FBQ0gsS0FBQyxDQUFBO0FBRUQsSUFBQSxjQUFjLEdBQUcsQ0FBQyxNQUFjLEtBQVU7QUFDeEMsUUFBQSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtZQUVsQyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSTtBQUNwRSxnQkFBQSxPQUFPLENBQUMsQ0FBQyxZQUFZLFdBQVcsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3hFLGFBQUMsQ0FBQyxDQUFBO0FBRUYsWUFBQSxJQUFJLFFBQVEsRUFBRTtnQkFDWixRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbkIsYUFBQTtBQUVELFlBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSTtBQUMzQyxnQkFBQSxJQUFJLENBQUMsWUFBWSxXQUFXLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDLEtBQUssRUFBRTtBQUNsRSxvQkFBQSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzFDLGlCQUFBO0FBQ0gsYUFBQyxDQUFDLENBQUE7QUFFRixZQUFBLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDeEYsWUFBQSxJQUFJLFNBQVMsRUFBRTtBQUNiLGdCQUFBLFNBQVMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQzVCLGFBQUE7QUFDRixTQUFBO0FBQ0gsS0FBQyxDQUFBO0FBRUY7O0FDeEdhLE1BQU8sWUFBWSxDQUFBO0FBQ3hCLElBQUEsRUFBRSxDQUFvQjtBQUU3QixJQUFBLFdBQUEsQ0FBWSxFQUFlLEVBQUE7QUFDekIsUUFBQSxJQUFJLEVBQUUsRUFBRSxZQUFZLGlCQUFpQixDQUFDLEVBQUU7QUFDdEMsWUFBQSxNQUFNLElBQUksS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUM7QUFDbkYsU0FBQTtBQUNELFFBQUEsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7S0FDZDtJQUVELE9BQU8sR0FBQTtBQUNMLFFBQUEsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUM7UUFDcEMsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO0FBRTdCLFFBQUEsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQXlCLEtBQUk7WUFDaEUsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQztBQUNwRixTQUFDLENBQUMsQ0FBQzs7O0FBSUgsUUFBQSxJQUFJLG1CQUFtQixDQUFDO0FBRXhCLFFBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUc7WUFDdkIsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO2dCQUNuQixtQkFBbUIsR0FBRyxNQUFNLENBQUM7QUFDOUIsYUFBQTtBQUNILFNBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBQSxtQkFBbUIsR0FBRyxtQkFBbUIsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFeEQsUUFBQSxRQUFRO1lBQ04sVUFBVTtZQUNWLE9BQU87WUFDUCxtQkFBbUI7QUFDcEIsU0FBQSxFQUFFO0tBQ0o7QUFDRjs7QUMzQmEsTUFBTyxVQUFVLENBQUE7QUFDdEIsSUFBQSxJQUFJLENBQXlCO0FBQzdCLElBQUEsb0JBQW9CLENBQVc7QUFDL0IsSUFBQSxXQUFXLENBQVU7QUFDckIsSUFBQSxJQUFJLENBQStCO0FBRTFDLElBQUEsV0FBQSxDQUFZLE1BQXdCLEVBQUE7UUFDbEMsTUFBTSxFQUFFLEdBQXNCLFFBQVEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsR0FBSSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQXVCLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUVqSixRQUFBLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQztBQUUzRCxRQUFBLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBRXpCLElBQUksaUJBQWlCLENBQUMsVUFBVSxFQUFFO0FBQ2hDLFlBQUEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FDckIsRUFBRSxFQUNGLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLGNBQWMsRUFDbkIsSUFBSSxDQUFDLFVBQVUsRUFDZixJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxtQkFBbUIsQ0FDM0IsQ0FBQztBQUNILFNBQUE7QUFBTSxhQUFBO1lBQ0wsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FDdEIsRUFBRSxFQUNGLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLGNBQWMsRUFDbkIsSUFBSSxDQUFDLFVBQVUsRUFDZixJQUFJLENBQUMsU0FBUyxDQUNqQixDQUFDO0FBQ0gsU0FBQTtBQUNELFFBQUEsSUFBSSxDQUFDLG9CQUFvQixHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQztBQUV0RCxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3JELFNBQUE7QUFFRCxRQUFBLElBQUksSUFBSSxDQUFDLElBQUksWUFBWSxTQUFTLEVBQUU7WUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDcEYsU0FBQTtBQUFNLGFBQUE7WUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzlELFNBQUE7QUFFRCxRQUFBLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztLQUN6QjtJQUVELE9BQU8sR0FBRyxNQUFXO0FBQ25CLFFBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN0QixLQUFDLENBQUE7QUFFRCxJQUFBLFFBQVEsR0FBRyxDQUFDLElBQVksS0FBVTtBQUNoQyxRQUFBLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBRXhCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBYyxLQUFJO0FBQ2pDLGdCQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUk7b0JBQ2pCLElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzVFLHdCQUFBLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ25CLHFCQUFBO0FBQ0gsaUJBQUMsQ0FBQyxDQUFBO0FBQ0YsZ0JBQUEsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztBQUNqQyxnQkFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLGdCQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDLGFBQUMsQ0FBQyxDQUFDO0FBQ0osU0FBQTtBQUFNLGFBQUE7WUFDTCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN4RyxZQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzFDLFNBQUE7QUFDSCxLQUFDLENBQUE7SUFFRCxVQUFVLEdBQUcsTUFBVztBQUN0QixRQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFdkIsVUFBVSxDQUFDLE1BQUs7WUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUNyRCxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1IsUUFBQSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUMzQixLQUFDLENBQUE7SUFFRCxTQUFTLEdBQUcsTUFBVztBQUNyQixRQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDeEIsS0FBQyxDQUFBO0FBRUQsSUFBQSxjQUFjLEdBQUcsQ0FBQyxNQUFjLEtBQVU7QUFDeEMsUUFBQSxJQUFJLElBQUksQ0FBQyxJQUFJLFlBQVksU0FBUyxFQUFFO1lBQ2xDLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtBQUNuQixnQkFBQSxNQUFNLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUN4QixnQkFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsQyxhQUFBO0FBQU0saUJBQUE7QUFDTCxnQkFBQSxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUN2QixnQkFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsQyxhQUFBO0FBQ0YsU0FBQTtBQUFNLGFBQUE7QUFDTCxZQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTlCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUk7QUFDdEMsZ0JBQUEsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDNUIsb0JBQUEsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDbkIsaUJBQUE7QUFBTSxxQkFBQTtBQUNMLG9CQUFBLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLGlCQUFBO0FBQ0gsYUFBQyxDQUFDLENBQUE7WUFDRixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbkIsU0FBQTtBQUNILEtBQUMsQ0FBQTtBQUVELElBQUEsbUJBQW1CLEdBQUcsQ0FBQyxNQUFjLEtBQVU7QUFDN0MsUUFBQSxJQUFJLElBQUksQ0FBQyxJQUFJLFlBQVksU0FBUyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUk7QUFDdEMsZ0JBQUEsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDNUIsb0JBQUEsQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDcEIsaUJBQUE7QUFDSCxhQUFDLENBQUMsQ0FBQTtBQUVGLFlBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDckQsU0FBQTtBQUNILEtBQUMsQ0FBQTtBQUVELElBQUEsWUFBWSxHQUFHLENBQUMsVUFBa0IsRUFBRSxTQUFpQixLQUFjO0FBQ2pFLFFBQUEsT0FBTyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzFFLEtBQUMsQ0FBQTtBQUVGOzs7OyJ9
