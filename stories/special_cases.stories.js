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



const WorksFineWithNumbersAsValuesTemplate = (args) => {
  setTimeout(() => {
    new ThinSelect({
      select: '#select',
      ajax: (search, callback) => {
        setTimeout(() => {
          callback([{"value":11,"text":"bags (web)"},{"value":412,"text":"health (web)"},{"value":334,"text":"magnets (web)"},{"value":203,"text":"markers (web)"},{"value":573,"text":"ppc_bags (web)"},{"value":612,"text":"ppc_caps (web)"},{"value":20,"text":"lanyards (web)"},{"value":251,"text":"kids_all (web)"},{"value":219,"text":"coasters (web)"},{"value":213,"text":"mousepads (web)"},{"value":224,"text":"test_bags (web)"},{"value":73,"text":"drinkware (web)"},{"value":427,"text":"name tags (web)"},{"value":16,"text":"keychains (web)"},{"value":209,"text":"orange_nl (web)"},{"value":428,"text":"packaging (web)"},{"value":341,"text":"umbrellas (web)"},{"value":503,"text":"bagPOD (web)"},{"value":613,"text":"ppc_aprons (web)"},{"value":576,"text":"ppc_badges (web)"},{"value":561,"text":"ppc_straws (web)"},{"value":86,"text":"ba NWF (web)"},{"value":21,"text":"wristbands (web)"},{"value":490,"text":"best-value (web)"},{"value":528,"text":"BagPOD (web)"},{"value":227,"text":"promo_gafas (web)"},{"value":585,"text":"ppc_gadgets (web)"},{"value":84,"text":"bagsyute (web)"},{"value":223,"text":"promo_fanoc (web)"},{"value":592,"text":"ppc_markers (web)"}])
        }, 400);
      }
    })

    const select = document.getElementById('select');
    select.addEventListener("change", (e) => {
      const values = e.target.selectedOptions;
      const report = Array.from(values).map(option => `${option.text}`).join(', ');
      console.log(report);
    });
  }, 200);

      return `
  <div style="width: 30%;" >
        <select id="select" style="display: none" multiple>
          <option value="11" selected>bags (web)</option>
              </select>
  </div>
  `;
};

export const NoOptionsSingle = NoOptionsSingleTemplate.bind({});
export const NoOptionsMulti = NoOptionsMultiTemplate.bind({});
export const WorksFineWithNumbersAsValues = WorksFineWithNumbersAsValuesTemplate.bind({});
export const CustomClassAdded = CustomClassAddedTemplate.bind({});
