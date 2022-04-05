import ThinSelect from "../build/index"
import "../build/thin-select.css"

export default {
  title: 'Special cases'
};

const NoOptionsSingleTemplate = (args) => {
  setTimeout(() => {
    new ThinSelect({
      select: '#select',
      ajax: (search, callback) => {
        setTimeout(() => {
          callback([
            {text: "", value: ""},
            {text: "First option", value: "1"},
            {text: "Second option", value: "2"},
            {text: "3 option", value: "3"},
            {text: "4 option", value: "4"},
            {text: "5 option", value: "5"}
          ])
        }, 400);
      }
    })
  }, 200);

  return `
  <div style="width: 30%;" >
    <select id="select" style="display: none">
    </select>
  </div>
  `;
};

const NoOptionsMultiTemplate = (args) => {
  setTimeout(() => {
    new ThinSelect({
      select: '#select',
      ajax: (search, callback) => {
        setTimeout(() => {
          callback([
            {text: "First option", value: "1"},
            {text: "Second option", value: "2"},
            {text: "3 option", value: "3"},
            {text: "4 option", value: "4"},
            {text: "5 option", value: "5"}
          ])
        }, 400);
      }
    })
  }, 200);

  return `
  <div style="width: 30%;" >
    <select id="select" style="display: none" multiple>
    </select>
  </div>
  `;
};

const CustomClassAddedTemplate = (args) => {
  setTimeout(() => {
    new ThinSelect({
      select: '#select',
      class: 'special'
    })
  }, 200);

  return `
  <div style="width: 30%;" >
    <select id="select" style="display: none">
      <option value=""></option>
      <option value="1" selected>First option</option>
      <option value="2">Second option</option>
    </select>
  </div>
  `;
};


export const NoOptionsSingle = NoOptionsSingleTemplate.bind({});
export const NoOptionsMulti = NoOptionsMultiTemplate.bind({});
export const CustomClassAdded = CustomClassAddedTemplate.bind({});
