

// Global Variables

const btnArray_15 = document.querySelectorAll("button");
const massFlowrateBtn = document.querySelector(".massFlowrateBtn");
const addMassFlowrateConvList = document.querySelector(".add-mass-flowrate-unit-list");
const massFlowrateUnitList = document.querySelector(".massFlowrateConversions");

//default initially displayed massFlowrateUnits
const initiallyDisplayedMassFlowrateUnits = ["kg\u2215h", "lb\u2215h", "kg\u2215min", "kg\u2215s", "tonne\u2215h", "tonne\u2215d","lb\u2215min","lb\u2215s","ton\u2215h","ton\u2215d"];
let baseMassFlowrateUnit;
let baseMassFlowrateUnitAmount;

const massFlowrateUnits = [
    {
        name: "kilogram per hour",
        abbreviation: "kg\u2215h",
        rate: 1
    },
    {
        name: "pound per hour",
        abbreviation: "lb\u2215h",
        rate: 2.20462
      },
      {
        name: "kilogram per minute",
        abbreviation: "kg\u2215min",
        rate: 1.66667e-02
      },
      {
        name: "kilogram per second",
        abbreviation: "kg\u2215s",
        rate: 2.77778e-04
      },
      {
        name: "tonne per hour",
        abbreviation: "tonne\u2215h",
        rate: 1.00000e-03
      },
      {
        name: "tonne per day",
        abbreviation: "tonne\u2215d",
        rate: 2.40000e-02
      },
      {
        name: "pound per minute",
        abbreviation: "lb\u2215min",
        rate: 3.67437e-02
      },
      {
        name: "pound per second",
        abbreviation: "lb\u2215s",
        rate: 6.12395e-04
      },
      {
        name: "ton per hour",
        abbreviation: "ton\u2215h",
        rate: 1.10231e-03
      },
      {
        name: "ton per day",
        abbreviation: "ton\u2215d",
        rate: 2.64555e-02
      },
    
];




// Event Listeners

massFlowrateBtn.addEventListener("click", massFlowrateBtnClick);

function massFlowrateBtnClick(event) {
  btnArray_15.forEach(function (element) {
    element.classList.remove("open");
});
  massFlowrateBtn.classList.toggle("open");
}




function setNewBaseMassFlowrateUnit(newBaseMassFlowrateUnitLI) {
    newBaseMassFlowrateUnitLI.classList.add("base-mass-flowrate-unit");
    baseMassFlowrateUnit = newBaseMassFlowrateUnitLI.id;
    const baseMassFlowrateUnitRate = massFlowrateUnits.find(massFlowrateUnit => massFlowrateUnit.abbreviation===baseMassFlowrateUnit).rate;
    massFlowrateUnitList.querySelectorAll(".mass-flowrate-unit").forEach(massFlowrateUnitLI => {
      const massFlowrateUnitRate = massFlowrateUnits.find(massFlowrateUnit => massFlowrateUnit.abbreviation===massFlowrateUnitLI.id).rate;
      const exchangeRate = massFlowrateUnitLI.id===baseMassFlowrateUnit ? 1 : (massFlowrateUnitRate/baseMassFlowrateUnitRate).toPrecision(6);
  //    massFlowrateUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseMassFlowrateUnit} = ${exchangeRate} ${massFlowrateUnitLI.id}`;
    });
  }
  
  massFlowrateUnitList.addEventListener("input", massFlowrateUnitListInputChange);
  
  function massFlowrateUnitListInputChange(event) {
    const isNewBaseMassFlowrateUnit = event.target.closest("li").id!==baseMassFlowrateUnit;
    if(isNewBaseMassFlowrateUnit) {
      massFlowrateUnitList.querySelector(`#${baseMassFlowrateUnit}`).classList.remove("base-mass-flowrate-unit");
      setNewBaseMassFlowrateUnit(event.target.closest("li"));
    }
    const newBaseMassFlowrateUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseMassFlowrateUnitAmount!==newBaseMassFlowrateUnitAmount || isNewBaseMassFlowrateUnit) {
      baseMassFlowrateUnitAmount = newBaseMassFlowrateUnitAmount;
      const baseMassFlowrateUnitRate = massFlowrateUnits.find(massFlowrateUnit => massFlowrateUnit.abbreviation===baseMassFlowrateUnit).rate;
      massFlowrateUnitList.querySelectorAll(".mass-flowrate-unit").forEach(massFlowrateUnitLI => {
        if(massFlowrateUnitLI.id!==baseMassFlowrateUnit) {
        const massFlowrateUnitRate = massFlowrateUnits.find(massFlowrateUnit => massFlowrateUnit.abbreviation===massFlowrateUnitLI.id).rate;
        const exchangeRate = massFlowrateUnitLI.id===baseMassFlowrateUnit ? 1 : (massFlowrateUnitRate/baseMassFlowrateUnitRate).toPrecision(6);
        massFlowrateUnitLI.querySelector(".input input").value = exchangeRate*baseMassFlowrateUnitAmount!==0 ? (exchangeRate*baseMassFlowrateUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  massFlowrateUnitList.addEventListener("focusout", massFlowrateUnitsListFocusOut);
  
  function massFlowrateUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  massFlowrateUnitList.addEventListener("keydown", massFlowrateUnitsListKeyDown);
  
  function massFlowrateUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateMassFlowrateUnitList() {
      for(let i=0; i<initiallyDisplayedMassFlowrateUnits.length; i++) {
          const massFlowrateUnit = massFlowrateUnits.find(c => c.abbreviation===initiallyDisplayedMassFlowrateUnits[i]);
          if(massFlowrateUnit) newMassFlowrateUnitListItem(massFlowrateUnit);
      }
  }
  
  function newMassFlowrateUnitListItem(massFlowrateUnit) {
      if(massFlowrateUnitList.childElementCount===0) {
          baseMassFlowrateUnit = massFlowrateUnit.abbreviation;
          baseMassFlowrateUnitAmount = 0;
      }
  
      const baseMassFlowrateUnitRate = massFlowrateUnits.find(c => c.abbreviation===baseMassFlowrateUnit).rate;
      const exchangeRate = massFlowrateUnit.abbreviation===baseMassFlowrateUnit ? 1 : (massFlowrateUnit.rate/baseMassFlowrateUnitRate).toPrecision(6);
      const inputValue = baseMassFlowrateUnitAmount ? (baseMassFlowrateUnitAmount*exchangeRate).toPrecision(6) : "";
  
      massFlowrateUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="mass-flowrate-unit ${massFlowrateUnit.abbreviation===baseMassFlowrateUnit ? "base-mass-flowrate-unit" : ""}" id=${massFlowrateUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="mass-flowrate-unit-symbol">${massFlowrateUnit.abbreviation}</span></p>
                  <p class="mass-flowrate-unit-name"><!--${massFlowrateUnit.abbreviation} - ${massFlowrateUnit.name}--></p>
                  <p class="base-mass-flowrate-unit-rate"><!--${baseMassFlowrateUnit} = ${exchangeRate} ${massFlowrateUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateMassFlowrateUnitList();