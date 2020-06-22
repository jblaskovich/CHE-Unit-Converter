

// Global Variables

const btnArray_11 = document.querySelectorAll("button");
const heatTransferCoefficientBtn = document.querySelector(".heatTransferCoefficientBtn");
const addHeatTransferCoefficientConvList = document.querySelector(".add-heatTransferCoefficient-unit-list");
const heatTransferCoefficientUnitList = document.querySelector(".heatTransferCoefficientConversions");

//default initially displayed heatTransferCoefficientUnits
const initiallyDisplayedHeatTransferCoefficientUnits = ["W\u2215m2-K", "btu\u2215hr-ft2-F", "kW\u2215m2-K"];
let baseHeatTransferCoefficientUnit;
let baseHeatTransferCoefficientUnitAmount;

const heatTransferCoefficientUnits = [
    {
        name: "watt per meter squared kelvin",
        abbreviation: "W\u2215m2-K",
        rate: 1.00000
    },
    {
        name: "british thermal units per hour foot squared fahreinheit",
        abbreviation: "btu\u2215hr-ft2-F",
        rate: 0.17623
      },
      {
        name: "kilowatt per meter squared kelvin",
        abbreviation: "kW\u2215m2-K",
        rate: 1.00000e-03
      }
    
];




// Event Listeners

heatTransferCoefficientBtn.addEventListener("click", heatTransferCoefficientBtnClick);

function heatTransferCoefficientBtnClick(event) {
  btnArray_11.forEach(function (element) {
    element.classList.remove("open");
});
  heatTransferCoefficientBtn.classList.toggle("open");
}




function setNewBaseHeatTransferCoefficientUnit(newBaseHeatTransferCoefficientUnitLI) {
    newBaseHeatTransferCoefficientUnitLI.classList.add("base-heatTransferCoefficient-unit");
    baseHeatTransferCoefficientUnit = newBaseHeatTransferCoefficientUnitLI.id;
    const baseHeatTransferCoefficientUnitRate = heatTransferCoefficientUnits.find(heatTransferCoefficientUnit => heatTransferCoefficientUnit.abbreviation===baseHeatTransferCoefficientUnit).rate;
    heatTransferCoefficientUnitList.querySelectorAll(".heatTransferCoefficient-unit").forEach(heatTransferCoefficientUnitLI => {
      const heatTransferCoefficientUnitRate = heatTransferCoefficientUnits.find(heatTransferCoefficientUnit => heatTransferCoefficientUnit.abbreviation===heatTransferCoefficientUnitLI.id).rate;
      const exchangeRate = heatTransferCoefficientUnitLI.id===baseHeatTransferCoefficientUnit ? 1 : (heatTransferCoefficientUnitRate/baseHeatTransferCoefficientUnitRate).toPrecision(6);
  //    heatTransferCoefficientUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseHeatTransferCoefficientUnit} = ${exchangeRate} ${heatTransferCoefficientUnitLI.id}`;
    });
  }
  
  heatTransferCoefficientUnitList.addEventListener("input", heatTransferCoefficientUnitListInputChange);
  
  function heatTransferCoefficientUnitListInputChange(event) {
    const isNewBaseHeatTransferCoefficientUnit = event.target.closest("li").id!==baseHeatTransferCoefficientUnit;
    if(isNewBaseHeatTransferCoefficientUnit) {
      heatTransferCoefficientUnitList.querySelector(`#${baseHeatTransferCoefficientUnit}`).classList.remove("base-heatTransferCoefficient-unit");
      setNewBaseHeatTransferCoefficientUnit(event.target.closest("li"));
    }
    const newBaseHeatTransferCoefficientUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseHeatTransferCoefficientUnitAmount!==newBaseHeatTransferCoefficientUnitAmount || isNewBaseHeatTransferCoefficientUnit) {
      baseHeatTransferCoefficientUnitAmount = newBaseHeatTransferCoefficientUnitAmount;
      const baseHeatTransferCoefficientUnitRate = heatTransferCoefficientUnits.find(heatTransferCoefficientUnit => heatTransferCoefficientUnit.abbreviation===baseHeatTransferCoefficientUnit).rate;
      heatTransferCoefficientUnitList.querySelectorAll(".heatTransferCoefficient-unit").forEach(heatTransferCoefficientUnitLI => {
        if(heatTransferCoefficientUnitLI.id!==baseHeatTransferCoefficientUnit) {
        const heatTransferCoefficientUnitRate = heatTransferCoefficientUnits.find(heatTransferCoefficientUnit => heatTransferCoefficientUnit.abbreviation===heatTransferCoefficientUnitLI.id).rate;
        const exchangeRate = heatTransferCoefficientUnitLI.id===baseHeatTransferCoefficientUnit ? 1 : (heatTransferCoefficientUnitRate/baseHeatTransferCoefficientUnitRate).toPrecision(6);
        heatTransferCoefficientUnitLI.querySelector(".input input").value = exchangeRate*baseHeatTransferCoefficientUnitAmount!==0 ? (exchangeRate*baseHeatTransferCoefficientUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  heatTransferCoefficientUnitList.addEventListener("focusout", heatTransferCoefficientUnitsListFocusOut);
  
  function heatTransferCoefficientUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  heatTransferCoefficientUnitList.addEventListener("keydown", heatTransferCoefficientUnitsListKeyDown);
  
  function heatTransferCoefficientUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateHeatTransferCoefficientUnitList() {
      for(let i=0; i<initiallyDisplayedHeatTransferCoefficientUnits.length; i++) {
          const heatTransferCoefficientUnit = heatTransferCoefficientUnits.find(c => c.abbreviation===initiallyDisplayedHeatTransferCoefficientUnits[i]);
          if(heatTransferCoefficientUnit) newHeatTransferCoefficientUnitListItem(heatTransferCoefficientUnit);
      }
  }
  
  function newHeatTransferCoefficientUnitListItem(heatTransferCoefficientUnit) {
      if(heatTransferCoefficientUnitList.childElementCount===0) {
          baseHeatTransferCoefficientUnit = heatTransferCoefficientUnit.abbreviation;
          baseHeatTransferCoefficientUnitAmount = 0;
      }
  
      const baseHeatTransferCoefficientUnitRate = heatTransferCoefficientUnits.find(c => c.abbreviation===baseHeatTransferCoefficientUnit).rate;
      const exchangeRate = heatTransferCoefficientUnit.abbreviation===baseHeatTransferCoefficientUnit ? 1 : (heatTransferCoefficientUnit.rate/baseHeatTransferCoefficientUnitRate).toPrecision(6);
      const inputValue = baseHeatTransferCoefficientUnitAmount ? (baseHeatTransferCoefficientUnitAmount*exchangeRate).toPrecision(6) : "";
  
      heatTransferCoefficientUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="heatTransferCoefficient-unit ${heatTransferCoefficientUnit.abbreviation===baseHeatTransferCoefficientUnit ? "heatTransferCoefficient-unit" : ""}" id=${heatTransferCoefficientUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="heatTransferCoefficient-unit-symbol">${heatTransferCoefficientUnit.abbreviation}</span></p>
                  <p class="heatTransferCoefficient-unit-name"><!--${heatTransferCoefficientUnit.abbreviation} - ${heatTransferCoefficientUnit.name}--></p>
                  <p class="base-heatTransferCoefficient-unit-rate"><!--${baseHeatTransferCoefficientUnit} = ${exchangeRate} ${heatTransferCoefficientUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateHeatTransferCoefficientUnitList();