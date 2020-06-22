

// Global Variables

const btnArray_3 = document.querySelectorAll("button");
const areaBtn = document.querySelector(".areaBtn");
const addAreaConvList = document.querySelector(".add-area-unit-list");
const areaUnitList = document.querySelector(".areaConversions");


//default initially displayed areaUnits
const initiallyDisplayedAreaUnits = ["m2", "ft2", "cm2", "mm2", "in2", "are", "hectare", "acre"];
let baseAreaUnit;
let baseAreaUnitAmount;

const areaUnits = [
    {
        name: "meters squared",
        abbreviation: "m2",
        rate: 1
    },
    {
        name: "feets squared",
        abbreviation: "ft2",
        rate: 10.76391
      },
      {
        name: "centimeters squared",
        abbreviation: "cm2",
        rate: 10000.000
      },
      {
        name: "millimeters squared",
        abbreviation: "mm2",
        rate: 1000000.0
      },
      {
        name: "inches squared",
        abbreviation: "in2",
        rate: 1550.003
      },
      {
        name: "are",
        abbreviation: "are",
        rate: 1.00000e-02
      },
      {
        name: "hectare",
        abbreviation: "hectare",
        rate: 1.00000e-04
      },
      {
        name: "acre",
        abbreviation: "acre",
        rate: 2.47105e-04
      }
    
];




// Event Listeners

areaBtn.addEventListener("click", areaBtnClick);

function areaBtnClick(event) {
  btnArray_3.forEach(function (element) {
    element.classList.remove("open");
});
  areaBtn.classList.toggle("open");
}




function setNewBaseAreaUnit(newBaseAreaUnitLI) {
    newBaseAreaUnitLI.classList.add("base-area-unit");
    baseAreaUnit = newBaseAreaUnitLI.id;
    const baseAreaUnitRate = areaUnits.find(areaUnit => areaUnit.abbreviation===baseAreaUnit).rate;
    areaUnitList.querySelectorAll(".area-unit").forEach(areaUnitLI => {
      const areaUnitRate = areaUnits.find(areaUnit => areaUnit.abbreviation===areaUnitLI.id).rate;
      const exchangeRate = areaUnitLI.id===baseAreaUnit ? 1 : (areaUnitRate/baseAreaUnitRate).toPrecision(6);
  //    areaUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseAreaUnit} = ${exchangeRate} ${areaUnitLI.id}`;
    });
  }
  
  areaUnitList.addEventListener("input", areaUnitListInputChange);
  
  function areaUnitListInputChange(event) {
    const isNewBaseAreaUnit = event.target.closest("li").id!==baseAreaUnit;
    if(isNewBaseAreaUnit) {
      areaUnitList.querySelector(`#${baseAreaUnit}`).classList.remove("base-area-unit");
      setNewBaseAreaUnit(event.target.closest("li"));
    }
    const newBaseAreaUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseAreaUnitAmount!==newBaseAreaUnitAmount || isNewBaseAreaUnit) {
      baseAreaUnitAmount = newBaseAreaUnitAmount;
      const baseAreaUnitRate = areaUnits.find(areaUnit => areaUnit.abbreviation===baseAreaUnit).rate;
      areaUnitList.querySelectorAll(".area-unit").forEach(areaUnitLI => {
        if(areaUnitLI.id!==baseAreaUnit) {
        const areaUnitRate = areaUnits.find(areaUnit => areaUnit.abbreviation===areaUnitLI.id).rate;
        const exchangeRate = areaUnitLI.id===baseAreaUnit ? 1 : (areaUnitRate/baseAreaUnitRate).toPrecision(6);
        areaUnitLI.querySelector(".input input").value = exchangeRate*baseAreaUnitAmount!==0 ? (exchangeRate*baseAreaUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  areaUnitList.addEventListener("focusout", areaUnitsListFocusOut);
  
  function areaUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  areaUnitList.addEventListener("keydown", areaUnitsListKeyDown);
  
  function areaUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateAreaUnitList() {
      for(let i=0; i<initiallyDisplayedAreaUnits.length; i++) {
          const areaUnit = areaUnits.find(c => c.abbreviation===initiallyDisplayedAreaUnits[i]);
          if(areaUnit) newAreaUnitListItem(areaUnit);
      }
  }
  
  function newAreaUnitListItem(areaUnit) {
      if(areaUnitList.childElementCount===0) {
          baseAreaUnit = areaUnit.abbreviation;
          baseAreaUnitAmount = 0;
      }
  
      const baseAreaUnitRate = areaUnits.find(c => c.abbreviation===baseAreaUnit).rate;
      const exchangeRate = areaUnit.abbreviation===baseAreaUnit ? 1 : (areaUnit.rate/baseAreaUnitRate).toPrecision(6);
      const inputValue = baseAreaUnitAmount ? (baseAreaUnitAmount*exchangeRate).toPrecision(6) : "";
  
      areaUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="area-unit ${areaUnit.abbreviation===baseAreaUnit ? "area-unit" : ""}" id=${areaUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="area-unit-symbol">${areaUnit.abbreviation}</span></p>
                  <p class="area-unit-name"><!--${areaUnit.abbreviation} - ${areaUnit.name}--></p>
                  <p class="base-area-unit-rate"><!--${baseAreaUnit} = ${exchangeRate} ${areaUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateAreaUnitList();