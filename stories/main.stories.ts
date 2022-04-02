import ThinSelect from "../build/index"
import { Meta, StoryFn } from '@storybook/html';
import "../build/thin-select.css"

export default {
  title: 'Example'
} as Meta;

const Template = (args) => {
  setTimeout(() => {
    new ThinSelect({
      select: '#select',
      ajax: (search, callback) => {
        setTimeout(() => {
          callback([{text: "", value: ""}, {text: "First option", value: "1"}, {text: "Second option", value: "2"}])
        }, 400);
      }
    })
  }, 200);

  return `
  <div style="width: 30%">
    <select id="select">
<!--      <option value=""></option>-->
      <option value="1">First option</option>
<!--      <option value="2">Second option</option>-->
    </select>
  </div>
  `;
};

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};