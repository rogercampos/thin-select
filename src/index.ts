import "../styles/thin-select.scss"
import View from "./view";
import SelectParser from "./select_parser";
import {Option} from "./models"

interface ThinSelectParams {
  select: string | HTMLSelectElement;
  ajax?: (inputText: string, callback: (data: Option[]) => void) => void;
}

export default class ThinSelect {
  public view: View;
  public displayedOptionsList: Option[];
  public isSearching: boolean;
  public ajax: ((inputText: string, callback: (data: Option[]) => void) => void) | undefined;
  
  constructor(params: ThinSelectParams) {
    const el: HTMLSelectElement = typeof (params.select) === "string" ? (document.querySelector(params.select) as HTMLSelectElement) : params.select;
    
    const initialSelectInfo = (new SelectParser(el)).analyze();
    
    this.isSearching = false;
    
    this.view = new View(
        el,
        initialSelectInfo.isMultiple,
        this.onSearch,
        this.onOptionSelect,
        this.closePanel,
        this.openPanel,
    );
    this.displayedOptionsList = initialSelectInfo.options;
    this.view.setDisplayList(this.displayedOptionsList);
    this.view.setSelected(initialSelectInfo.defaultOption);
    
    this.ajax = params.ajax;
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
    this.displayedOptionsList.forEach((x) => {
      if (x.value === option.value) {
        x.selected = true;
      } else {
        x.selected = false;
      }
    })
    this.view.setSelected(option);
    this.closePanel();
  }
  
  searchFilter = (optionText: string, inputText: string) : boolean => {
    return optionText.toLowerCase().indexOf(inputText.toLowerCase()) !== -1;
  }
  
}
