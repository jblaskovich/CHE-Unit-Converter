

// Global Variables

const btnArray_10 = document.querySelectorAll("button");
const heatCapacityBtn = document.querySelector(".heatCapacityBtn");
const addHeatCapacityConvList = document.querySelector(".add-heatCapacity-unit-list");
const heatCapacityUnitList = document.querySelector(".heatCapacityConversions");

//default initially displayed heatCapacityUnits
const initiallyDisplayedHeatCapacityUnits = ["J\u2215g-K", "btu\u2215lb-F", "kJ\u2215kg-K", "cal\u2215g-K"];
let baseHeatCapacityUnit;
let baseHeatCapacityUnitAmount;

const heatCapacityUnits = [
    {
        name: "joule per gram kelvin",
        abbreviation: "J\u2215g-K",
        rate: 1.00000
    },
    {
        name: "british thermal unit per pound fahreinheit",
        abbreviation: "btu\u2215lb-F",
        rate: 0.23901
      },
      {
        name: "kilojoule per kilogram kelvin",
        abbreviation: "kJ\u2215kg-K",
        rate: 1.00000
      },
      {
        name: "calorie per gram kelvin",
        abbreviation: "cal\u2215g-K",
        rate: 0.23901
      }
    
];




// Event Listeners

heatCapacityBtn.addEventListener("click", heatCapacityBtnClick);

function heatCapacityBtnClick(event) {
  btnArray_10.forEach(function (element) {
    element.classList.remove("open");
});
  heatCapacityBtn.classList.toggle("open");
}




function setNewBaseHeatCapacityUnit(newBaseHeatCapacityUnitLI) {
    newBaseHeatCapacityUnitLI.classList.add("base-heatCapacity-unit");
    baseHeatCapacityUnit = newBaseHeatCapacityUnitLI.id;
    const baseHeatCapacityUnitRate = heatCapacityUnits.find(heatCapacityUnit => heatCapacityUnit.abbreviation===baseHeatCapacityUnit).rate;
    heatCapacityUnitList.querySelectorAll(".heatCapacity-unit").forEach(heatCapacityUnitLI => {
      const heatCapacityUnitRate = heatCapacityUnits.find(heatCapacityUnit => heatCapacityUnit.abbreviation===heatCapacityUnitLI.id).rate;
      const exchangeRate = heatCapacityUnitLI.id===baseHeatCapacityUnit ? 1 : (heatCapacityUnitRate/baseHeatCapacityUnitRate).toPrecision(6);
  //    heatCapacityUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseHeatCapacityUnit} = ${exchangeRate} ${heatCapacityUnitLI.id}`;
    });
  }
  
  heatCapacityUnitList.addEventListener("input", heatCapacityUnitListInputChange);
  
  function heatCapacityUnitListInputChange(event) {
    const isNewBaseHeatCapacityUnit = event.target.closest("li").id!==baseHeatCapacityUnit;
    if(isNewBaseHeatCapacityUnit) {
      heatCapacityUnitList.querySelector(`#${baseHeatCapacityUnit}`).classList.remove("base-heatCapacity-unit");
      setNewBaseHeatCapacityUnit(event.target.closest("li"));
    }
    const newBaseHeatCapacityUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseHeatCapacityUnitAmount!==newBaseHeatCapacityUnitAmount || isNewBaseHeatCapacityUnit) {
      baseHeatCapacityUnitAmount = newBaseHeatCapacityUnitAmount;
      const baseHeatCapacityUnitRate = heatCapacityUnits.find(heatCapacityUnit => heatCapacityUnit.abbreviation===baseHeatCapacityUnit).rate;
      heatCapacityUnitList.querySelectorAll(".heatCapacity-unit").forEach(heatCapacityUnitLI => {
        if(heatCapacityUnitLI.id!==baseHeatCapacityUnit) {
        const heatCapacityUnitRate = heatCapacityUnits.find(heatCapacityUnit => heatCapacityUnit.abbreviation===heatCapacityUnitLI.id).rate;
        const exchangeRate = heatCapacityUnitLI.id===baseHeatCapacityUnit ? 1 : (heatCapacityUnitRate/baseHeatCapacityUnitRate).toPrecision(6);
        heatCapacityUnitLI.querySelector(".input input").value = exchangeRate*baseHeatCapacityUnitAmount!==0 ? (exchangeRate*baseHeatCapacityUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  heatCapacityUnitList.addEventListener("focusout", heatCapacityUnitsListFocusOut);
  
  function heatCapacityUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  heatCapacityUnitList.addEventListener("keydown", heatCapacityUnitsListKeyDown);
  
  function heatCapacityUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateHeatCapacityUnitList() {
      for(let i=0; i<initiallyDisplayedHeatCapacityUnits.length; i++) {
          const heatCapacityUnit = heatCapacityUnits.find(c => c.abbreviation===initiallyDisplayedHeatCapacityUnits[i]);
          if(heatCapacityUnit) newHeatCapacityUnitListItem(heatCapacityUnit);
      }
  }
  
  function newHeatCapacityUnitListItem(heatCapacityUnit) {
      if(heatCapacityUnitList.childElementCount===0) {
          baseHeatCapacityUnit = heatCapacityUnit.abbreviation;
          baseHeatCapacityUnitAmount = 0;
      }
  
      const baseHeatCapacityUnitRate = heatCapacityUnits.find(c => c.abbreviation===baseHeatCapacityUnit).rate;
      const exchangeRate = heatCapacityUnit.abbreviation===baseHeatCapacityUnit ? 1 : (heatCapacityUnit.rate/baseHeatCapacityUnitRate).toPrecision(6);
      const inputValue = baseHeatCapacityUnitAmount ? (baseHeatCapacityUnitAmount*exchangeRate).toPrecision(6) : "";
  
      heatCapacityUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="heatCapacity-unit ${heatCapacityUnit.abbreviation===baseHeatCapacityUnit ? "heatCapacity-unit" : ""}" id=${heatCapacityUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="heatCapacity-unit-symbol">${heatCapacityUnit.abbreviation}</span></p>
                  <p class="heatCapacity-unit-name"><!--${heatCapacityUnit.abbreviation} - ${heatCapacityUnit.name}--></p>
                  <p class="base-heatCapacity-unit-rate"><!--${baseHeatCapacityUnit} = ${exchangeRate} ${heatCapacityUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateHeatCapacityUnitList();