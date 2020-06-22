

// Global Variables

const btnArray_19 = document.querySelectorAll("button");
const thermalConductivityBtn = document.querySelector(".thermalConductivityBtn");
const addThermalConductivityConvList = document.querySelector(".add-thermalConductivity-unit-list");
const thermalConductivityUnitList = document.querySelector(".thermalConductivityConversions");

//default initially displayed thermalConductivityUnits
const initiallyDisplayedThermalConductivityUnits = ["W\u2215m-K", "btu\u2215hr-ft-F", "kW\u2215m-K"];
let baseThermalConductivityUnit;
let baseThermalConductivityUnitAmount;

const thermalConductivityUnits = [
    {
        name: "watt per meter kelvin",
        abbreviation: "W\u2215m-K",
        rate: 1.00000
    },
    {
        name: "british thermal unit per hour foot fahreinheit",
        abbreviation: "btu\u2215hr-ft-F",
        rate: 0.57818
      },
      {
        name: "kilowatt per meter kelvin",
        abbreviation: "kW\u2215m-K",
        rate: 1.00000e-03
      }
];




// Event Listeners

thermalConductivityBtn.addEventListener("click", thermalConductivityBtnClick);

function thermalConductivityBtnClick(event) {
  btnArray_19.forEach(function (element) {
    element.classList.remove("open");
});
  thermalConductivityBtn.classList.toggle("open");
}




function setNewBaseThermalConductivityUnit(newBaseThermalConductivityUnitLI) {
    newBaseThermalConductivityUnitLI.classList.add("base-thermalConductivity-unit");
    baseThermalConductivityUnit = newBaseThermalConductivityUnitLI.id;
    const baseThermalConductivityUnitRate = thermalConductivityUnits.find(thermalConductivityUnit => thermalConductivityUnit.abbreviation===baseThermalConductivityUnit).rate;
    thermalConductivityUnitList.querySelectorAll(".thermalConductivity-unit").forEach(thermalConductivityUnitLI => {
      const thermalConductivityUnitRate = thermalConductivityUnits.find(thermalConductivityUnit => thermalConductivityUnit.abbreviation===thermalConductivityUnitLI.id).rate;
      const exchangeRate = thermalConductivityUnitLI.id===baseThermalConductivityUnit ? 1 : (thermalConductivityUnitRate/baseThermalConductivityUnitRate).toPrecision(6);
  //    thermalConductivityUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseThermalConductivityUnit} = ${exchangeRate} ${thermalConductivityUnitLI.id}`;
    });
  }
  
  thermalConductivityUnitList.addEventListener("input", thermalConductivityUnitListInputChange);
  
  function thermalConductivityUnitListInputChange(event) {
    const isNewBaseThermalConductivityUnit = event.target.closest("li").id!==baseThermalConductivityUnit;
    if(isNewBaseThermalConductivityUnit) {
      thermalConductivityUnitList.querySelector(`#${baseThermalConductivityUnit}`).classList.remove("base-thermalConductivity-unit");
      setNewBaseThermalConductivityUnit(event.target.closest("li"));
    }
    const newBaseThermalConductivityUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseThermalConductivityUnitAmount!==newBaseThermalConductivityUnitAmount || isNewBaseThermalConductivityUnit) {
      baseThermalConductivityUnitAmount = newBaseThermalConductivityUnitAmount;
      const baseThermalConductivityUnitRate = thermalConductivityUnits.find(thermalConductivityUnit => thermalConductivityUnit.abbreviation===baseThermalConductivityUnit).rate;
      thermalConductivityUnitList.querySelectorAll(".thermalConductivity-unit").forEach(thermalConductivityUnitLI => {
        if(thermalConductivityUnitLI.id!==baseThermalConductivityUnit) {
        const thermalConductivityUnitRate = thermalConductivityUnits.find(thermalConductivityUnit => thermalConductivityUnit.abbreviation===thermalConductivityUnitLI.id).rate;
        const exchangeRate = thermalConductivityUnitLI.id===baseThermalConductivityUnit ? 1 : (thermalConductivityUnitRate/baseThermalConductivityUnitRate).toPrecision(6);
        thermalConductivityUnitLI.querySelector(".input input").value = exchangeRate*baseThermalConductivityUnitAmount!==0 ? (exchangeRate*baseThermalConductivityUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  thermalConductivityUnitList.addEventListener("focusout", thermalConductivityUnitsListFocusOut);
  
  function thermalConductivityUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  thermalConductivityUnitList.addEventListener("keydown", thermalConductivityUnitsListKeyDown);
  
  function thermalConductivityUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateThermalConductivityUnitList() {
      for(let i=0; i<initiallyDisplayedThermalConductivityUnits.length; i++) {
          const thermalConductivityUnit = thermalConductivityUnits.find(c => c.abbreviation===initiallyDisplayedThermalConductivityUnits[i]);
          if(thermalConductivityUnit) newThermalConductivityUnitListItem(thermalConductivityUnit);
      }
  }
  
  function newThermalConductivityUnitListItem(thermalConductivityUnit) {
      if(thermalConductivityUnitList.childElementCount===0) {
          baseThermalConductivityUnit = thermalConductivityUnit.abbreviation;
          baseThermalConductivityUnitAmount = 0;
      }
  
      const baseThermalConductivityUnitRate = thermalConductivityUnits.find(c => c.abbreviation===baseThermalConductivityUnit).rate;
      const exchangeRate = thermalConductivityUnit.abbreviation===baseThermalConductivityUnit ? 1 : (thermalConductivityUnit.rate/baseThermalConductivityUnitRate).toPrecision(6);
      const inputValue = baseThermalConductivityUnitAmount ? (baseThermalConductivityUnitAmount*exchangeRate).toPrecision(6) : "";
  
      thermalConductivityUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="thermalConductivity-unit ${thermalConductivityUnit.abbreviation===baseThermalConductivityUnit ? "thermalConductivity-unit" : ""}" id=${thermalConductivityUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="thermalConductivity-unit-symbol">${thermalConductivityUnit.abbreviation}</span></p>
                  <p class="thermalConductivity-unit-name"><!--${thermalConductivityUnit.abbreviation} - ${thermalConductivityUnit.name}--></p>
                  <p class="base-thermalConductivity-unit-rate"><!--${baseThermalConductivityUnit} = ${exchangeRate} ${thermalConductivityUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateThermalConductivityUnitList();