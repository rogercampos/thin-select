import "../styles/thin-select.scss"
import DomBuilder from "./dom_builder";
import SelectParser from "./select_parser";
import {Option} from "./models"

interface ThinSelectParams {
  select: string | HTMLSelectElement;
}

export default class ThinSelect {
  public builder: DomBuilder;
  public id: string;
  public displayedOptionsList: Option[];
  public isSearching: boolean;
  
  constructor(params: ThinSelectParams) {
    const el: HTMLSelectElement = typeof (params.select) === "string" ? (document.querySelector(params.select) as HTMLSelectElement) : params.select;
    
    const initialSelectInfo = (new SelectParser(el)).analyze();
    
    this.id = 'ts-' + Math.floor(Math.random() * 100000);
    this.isSearching = false;
    
    this.builder = new DomBuilder(
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
    this.builder.setDisplayList(this.displayedOptionsList);
  }
  
  onSearch = (text: string) => {
    this.isSearching = true;
    const matchedOptions = this.displayedOptionsList.filter(option => this.searchFilter(option.text, text));
    this.builder.setDisplayList(matchedOptions);
  }
  
  onDeselect = () => {
    console.log(`onDeselect`)
  }
  
  closePanel = () => {
    this.builder.closePanel();
    
    setTimeout(() => {
      this.builder.setDisplayList(this.displayedOptionsList);
    }, 100);
    this.isSearching = false;
  }
  
  openPanel = () => {
    this.builder.openPanel();
  }
  
  onOptionSelect = (option: Option) => {
    this.displayedOptionsList.forEach((x) => {
      if (x.value === option.value) {
        x.selected = true;
      } else {
        x.selected = false;
      }
    })
    this.builder.setSelected(option);
    this.closePanel();
  }
  
  searchFilter = (optionText: string, inputText: string) => {
    return optionText.toLowerCase().indexOf(inputText.toLowerCase()) !== -1;
  }
  
}
