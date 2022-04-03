import ThinSelect from "../build/index"
import {Meta} from '@storybook/html';
import "../build/thin-select.css"

export default {
  title: 'Multi Select'
} as Meta;

const RawTemplate = (args) => {
  setTimeout(() => {
    new ThinSelect({
      select: '#select',
    })
  }, 200);
  
  return `
  <div style="width: 30%;" >
    <select id="select" multiple style="display: none">
      <option value="1">First option</option>
      <option value="2" selected>Second option</option>
      <option value="3" selected>3 option</option>
      <option value="4" >4 option</option>
      <option value="5" >5 option</option>
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
    <select id="select" multiple style="display: none">
      <option value="2" selected>Second option</option>
      <option value="3" selected>3 option</option>
    </select>
  </div>
  `;
};


const AjaxWithCustomHTMLTemplate = (args) => {
  setTimeout(() => {
    new ThinSelect({
      select: '#select',
      ajax: (search, callback) => {
        setTimeout(() => {
          callback([
            {text: "First option", value: "1", innerHtml: `<div style='display: flex; flex: 1 1 100%; gap: 1rem; align-items: center;'><img src='https://picsum.photos/seed/${Math.random(412)}/70'/><span>First option</span></div>`},
            {text: "Second option", value: "2", innerHtml: `<div style='display: flex; flex: 1 1 100%; gap: 1rem; align-items: center;'><img src='https://picsum.photos/seed/${Math.random(412)}/70'/><span>Second option</span></div>`},
            {text: "3 option", value: "3", innerHtml: `<div style='display: flex; flex: 1 1 100%; gap: 1rem; align-items: center;'><img src='https://picsum.photos/seed/${Math.random(412)}/70'/><span>3 option</span></div>`},
            {text: "4 option", value: "4", innerHtml: `<div style='display: flex; flex: 1 1 100%; gap: 1rem; align-items: center;'><img src='https://picsum.photos/seed/${Math.random(412)}/70'/><span>4 option</span></div>`},
            {text: "5 option", value: "5", innerHtml: `<div style='display: flex; flex: 1 1 100%; gap: 1rem; align-items: center;'><img src='https://picsum.photos/seed/${Math.random(412)}/70'/><span>5 option</span></div>`}
          ])
        }, 400);
      }
    })
  }, 200);
  
  return `
  <div style="width: 30%;" >
    <select id="select" multiple style="display: none">
      <option value="2" selected>Second option</option>
      <option value="3" selected>3 option</option>
    </select>
  </div>
  `;
};


export const Raw = RawTemplate.bind({});
export const Ajax = AjaxTemplate.bind({});
export const CustomHtml = AjaxWithCustomHTMLTemplate.bind({});
