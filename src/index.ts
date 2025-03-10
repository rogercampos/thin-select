import "../styles/thin-select.scss"
import SingleView from "./single_view";
import MultiView from "./multiple_view";
import SelectParser from "./select_parser";
import {ajaxCallbackType, Option} from "./models"

interface ThinSelectParams {
  select: string | HTMLSelectElement;
  ajax?: ajaxCallbackType;
  class?: string;
}

export default class ThinSelect {
  public view: SingleView | MultiView;
  public displayedOptionsList: Option[];
  public isSearching: boolean;
  public ajax: ajaxCallbackType | undefined;
  
  constructor(params: ThinSelectParams) {
    const el: HTMLSelectElement = typeof (params.select) === "string" ? (document.querySelector(params.select) as HTMLSelectElement) : params.select;
    
    const initialSelectInfo = (new SelectParser(el)).analyze();
    
    this.isSearching = false;
    
    if (initialSelectInfo.isMultiple) {
      this.view = new MultiView(
          el,
          params.class,
          this.onSearch,
          this.onOptionSelect,
          this.closePanel,
          this.openPanel,
          this.onRemoveMultiOption
      );
    } else {
      this.view = new SingleView(
          el,
          params.class,
          this.onSearch,
          this.onOptionSelect,
          this.closePanel,
          this.openPanel,
      );
    }
    this.displayedOptionsList = initialSelectInfo.options;
    
    if (!params.ajax) {
      this.view.setDisplayList(this.displayedOptionsList);
    }
    
    if (this.view instanceof MultiView) {
      this.view.setSelected(initialSelectInfo.options.filter(option => option.selected));
    } else if (initialSelectInfo.defaultSingleOption) {
      this.view.setSelected(initialSelectInfo.defaultSingleOption);
    }
    
    this.ajax = params.ajax;
  }
  
  destroy = (): void => {
    this.view.destroy();
  }
  
  onSearch = (text: string): void => {
    this.isSearching = true;
    
    if (this.ajax) {
      this.ajax(text, (data: Option[]) => {
        if (data) {
          const parsedData: Option[] = data.map((x) => {
            return {
              value: x.value.toString(),
              text: x.text.toString(),
              // setting selected in a backend search makes no sense. Default selected options
              // must be set on the original html.
              selected: false,
              innerHtml: x.innerHtml ? x.innerHtml.toString() : undefined,
            };
          })
          parsedData.forEach((x) => {
            if (this.displayedOptionsList.find((q) => q.selected && q.value === x.value)) {
              x.selected = true;
            }
          })
          
          // We need to preserve existing selected options that do not appear on the result form the
          // backend.
          const pendingOptionsToInclude = this.displayedOptionsList.filter((q) => {
            return q.selected && !parsedData.find((x) => x.value === q.value);
          })
          
          const newOptions = parsedData.concat(pendingOptionsToInclude)
          this.displayedOptionsList = newOptions;
          
          this.view.setElementOptions(newOptions);
          this.view.setDisplayList(parsedData);
        }
      });
    } else {
      const matchedOptions = this.displayedOptionsList.filter(option => this.searchFilter(option.text, text));
      this.view.setDisplayList(matchedOptions);
    }
  }
  
  closePanel = (): void => {
    this.view.closePanel();
    
    setTimeout(() => {
      this.view.setDisplayList(this.displayedOptionsList);
    }, 100);
    this.isSearching = false;
  }
  
  openPanel = (): void => {
    this.view.openPanel();
  }
  
  onOptionSelect = (option: Option): void => {
    if (this.view instanceof MultiView) {
      if (option.selected) {
        option.selected = false;
        this.view.removeSelected(option);
      } else {
        option.selected = true;
        this.view.appendSelected(option);
      }
    } else {
      this.view.setSelected(option);
      
      this.displayedOptionsList.forEach((x) => {
        x.selected = (x.value === option.value);
      })
      this.closePanel();
    }
  }
  
  onRemoveMultiOption = (option: Option): void => {
    if (this.view instanceof MultiView) {
      this.displayedOptionsList.forEach((x) => {
        if (x.value === option.value) {
          x.selected = false;
        }
      })
  
      this.view.removeSelected(option);
      this.view.setDisplayList(this.displayedOptionsList);
    }
  }
  
  searchFilter = (optionText: string, inputText: string) : boolean => {
    return optionText.toLowerCase().indexOf(inputText.toLowerCase()) !== -1;
  }
  
}
