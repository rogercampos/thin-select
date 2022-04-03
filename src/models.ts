type Option = {
  value: string
  innerHtml?: string
  text: string
  selected: boolean
}

type ajaxCallbackType = (inputText: string, callback: (data: Option[]) => void) => void;
type onSearchType = (text: string) => void;
type onOptionSelectType = (option: Option) => void;
type onRemoveMultiOptionType = (option: Option) => void;
type onCloseType = () => void;
type onOpenType = () => void;

interface Search {
  container: HTMLDivElement
  input: HTMLInputElement
  addable?: HTMLDivElement
}

interface MultiSelected {
  type: "multi"
  container: HTMLDivElement
  values: HTMLDivElement
  arrowIcon: {
    container: HTMLSpanElement
    arrow: HTMLSpanElement
  }
}

interface SingleSelected {
  type: "single"
  container: HTMLDivElement
  title: HTMLSpanElement
  arrowIcon: {
    container: HTMLSpanElement
    arrow: HTMLSpanElement
  }
}

export { Option, ajaxCallbackType, onSearchType, onOptionSelectType, onRemoveMultiOptionType, onCloseType, onOpenType, Search, MultiSelected, SingleSelected }