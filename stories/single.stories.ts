import ThinSelect from "../build/index"
import {Meta, StoryFn} from '@storybook/html';
import "../build/thin-select.css"

export default {
  title: 'Single'
} as Meta;

const HTMLTemplate = (args) => {
  setTimeout(() => {
    new ThinSelect({
      select: '#select',
    })
  }, 200);
  
  return `
  <div style="width: 30%;" >
    <select id="select">
      <option value=""></option>
      <option value="1" selected>First option</option>
      <option value="2">Second option</option>
    </select>
  </div>
  `;
};
const AjaxTemplate = (args) => {
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
    <select id="select">
      <option value="2" selected>Second option</option>
    </select>
  </div>
  `;
};

export const HTML = HTMLTemplate.bind({});
export const Ajax = AjaxTemplate.bind({});
