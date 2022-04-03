import ThinSelect from "../build/index"
import "../build/thin-select.css"

export default {
  title: 'Destroying'
};

const SingleTemplate = (args) => {
  let thinSelect;
  
  setTimeout(() => {
    thinSelect = new ThinSelect({
      select: '#select'
    })
  }, 200);
  
  setTimeout(() => {
    thinSelect.destroy();
  }, 2000);
  
  return `
<p>Here, thin-select should be removed from the select after 2 seconds, leaving a functional native select</p>
  <div style="width: 30%;" >
    <select id="select">
      <option value=""></option>
      <option value="1">First option</option>
      <option value="2" selected>Second option</option>
      <option value="3">dddddd option</option>
      <option value="4" >arstar option</option>
      <option value="5" >ddaa option</option>
      <option value="6" >2222 option</option>
    </select>
  </div>
  `;
};
const MultiTemplate = (args) => {
  let thinSelect;
  
  setTimeout(() => {
    thinSelect = new ThinSelect({
      select: '#select2'
    })
  }, 200);
  
  setTimeout(() => {
    thinSelect.destroy();
  }, 2000);
  
  return `
<p>Here, thin-select should be removed from the select after 2 seconds, leaving a functional native select</p>
  <div style="width: 30%;" >
    <select id="select2" multiple>
      <option value=""></option>
      <option value="1">First option</option>
      <option value="2" selected>Second option</option>
      <option value="3" selected>dddddd option</option>
      <option value="4" selected>arstar option</option>
      <option value="5" >ddaa option</option>
      <option value="6" >2222 option</option>
    </select>
  </div>
  `;
};

export const Single = SingleTemplate.bind({});
export const Multi = MultiTemplate.bind({});
