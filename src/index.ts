import "../styles/thin-select.scss"
import View from "./view";
import MultiView from "./multiple_view";
import SelectParser from "./select_parser";
import {Option} from "./models"

interface ThinSelectParams {
  select: string | HTMLSelectElement;
  ajax?: (inputText: string, callback: (data: Option[]) => void) => void;
}

export default class ThinSelect {
  public view: View | MultiView;
  public displayedOptionsList: Option[];
  public isSearching: boolean;
  public ajax: ((inputText: string, callback: (data: Option[]) => void) => void) | undefined;
  
  constructor(params: ThinSelectParams) {
    const el: HTMLSelectElement = typeof (params.select) === "string" ? (document.querySelector(params.select) as HTMLSelectElement) : params.select;
    
    const initialSelectInfo = (new SelectParser(el)).analyze();
    
    this.isSearching = false;
    
    if (initialSelectInfo.isMultiple) {
      this.view = new MultiView(
          el,
          this.onSearch,
          this.onOptionSelect,
          this.closePanel,
          this.openPanel,
          this.onRemoveMultiOption
      );
    } else {
      this.view = new View(
          el,
          this.onSearch,
          this.onOptionSelect,
          this.closePanel,
          this.openPanel,
      );
    }
    this.displayedOptionsList = initialSelectInfo.options;
    this.view.setDisplayList(this.displayedOptionsList);
    
    if (this.view instanceof MultiView) {
      this.view.setSelected(initialSelectInfo.options.filter(option => option.selected));
    } else {
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
        this.displayedOptionsList = data;
        this.view.setElementOptions(data);
        this.view.setDisplayList(data);
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
        if (x.value === option.value) {
          x.selected = true;
        } else {
          x.selected = false;
        }
      })
    }
    
    this.closePanel();
  }
  
  onRemoveMultiOption = (option: Option): void => {
    if (this.view instanceof MultiView) {
      option.selected = false;
      this.view.removeSelected(option);
      this.view.setDisplayList(this.displayedOptionsList);
    }
  }
  
  searchFilter = (optionText: string, inputText: string) : boolean => {
    return optionText.toLowerCase().indexOf(inputText.toLowerCase()) !== -1;
  }
  
}
