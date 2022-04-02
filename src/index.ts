import "../styles/thin-select.scss"
import View from "./view";
import SelectParser from "./select_parser";
import {Option} from "./models"

interface ThinSelectParams {
  select: string | HTMLSelectElement;
}

export default class ThinSelect {
  public view: View;
  public id: string;
  public displayedOptionsList: Option[];
  public isSearching: boolean;
  
  constructor(params: ThinSelectParams) {
    const el: HTMLSelectElement = typeof (params.select) === "string" ? (document.querySelector(params.select) as HTMLSelectElement) : params.select;
    
    const initialSelectInfo = (new SelectParser(el)).analyze();
    
    this.id = 'ts-' + Math.floor(Math.random() * 100000);
    this.isSearching = false;
    
    this.view = new View(
        el,
        this.id,
        initialSelectInfo.isMultiple,
        this.onSearch,
        this.onOptionSelect,
        this.onDeselect,
        this.closePanel,
        this.openPanel,
    );
    this.displayedOptionsList = initialSelectInfo.options;
    this.view.setDisplayList(this.displayedOptionsList);
  }
  
  onSearch = (text: string): void => {
    this.isSearching = true;
    const matchedOptions = this.displayedOptionsList.filter(option => this.searchFilter(option.text, text));
    this.view.setDisplayList(matchedOptions);
  }
  
  onDeselect = (): void => {
    console.log(`onDeselect`)
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
