import ThinSelect from "../build/index"
import { Meta, StoryFn } from '@storybook/html';
import "../build/thin-select.css"

export default {
  title: 'Example'
} as Meta;

const Template = (args) => {
  let thinSelect;
  
  setTimeout(() => {
    thinSelect = new ThinSelect({
      select: '#select',
      // ajax: (search, callback) => {
      //   setTimeout(() => {
      //     callback([{text: "", value: ""}, {text: "First option", value: "1"}, {text: "Second option", value: "2"}])
      //   }, 400);
      // }
    })
  }, 200);
  
  // setTimeout(() => {
  //   thinSelect.destroy();
  // }, 2000);

  return `
  <div style="width: 30%;" >
    <select id="select" multiple>
<!--      <option value=""></option>-->
      <option value="1">First option</option>
      <option value="2" selected>Second option</option>
      <option value="3" selected>dddddd option</option>
      <option value="4" >arstar option</option>
      <option value="5" >ddaa option</option>
      <option value="6" >2222 option</option>
    </select>
  </div>
  `;
};

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};