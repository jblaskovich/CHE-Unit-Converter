

// Global Variables

const btnArray_21 = document.querySelectorAll("button");
const volumeFlowrateBtn = document.querySelector(".volumeFlowrateBtn");
const addVolumeFlowrateConvList = document.querySelector(".add-volumeFlowrate-unit-list");
const volumeFlowrateUnitList = document.querySelector(".volumeFlowrateConversions");

//default initially displayed volumeFlowrateUnits
const initiallyDisplayedVolumeFlowrateUnits = ["m3\u2215s", "ft3\u2215s", "m3\u2215min", "m3\u2215hr", "L\u2215s", "L\u2215min", "L\u2215hr", "ft3\u2215min","ft3\u2215hr", "gal\u2215s", "gal\u2215min","gal\u2215hr", "barrels\u2215min", "barrels\u2215hr", "barrels\u2215day" ];
let baseVolumeFlowrateUnit;
let baseVolumeFlowrateUnitAmount;

const volumeFlowrateUnits = [
    {
        name: "meters cubed per second",
        abbreviation: "m3\u2215s",
        rate: 1
    },
    {
        name: "feet cubed per second",
        abbreviation: "ft3\u2215s",
        rate: 35.31467
      },
      {
        name: "meters cubed per minute",
        abbreviation: "m3\u2215min",
        rate: 60.00000
      },
      {
        name: "meters cubed per hour",
        abbreviation: "m3\u2215hr",
        rate: 3600.000
      },
      {
        name: "liters per second",
        abbreviation: "L\u2215s",
        rate: 1000.0000
      },
      {
        name: "liters per minute",
        abbreviation: "L\u2215min",
        rate: 60000.00
      },
      {
        name: "liters per hour",
        abbreviation: "L\u2215hr",
        rate: 3600000.
      },
      {
        name: "feet cubed per min",
        abbreviation: "ft3\u2215min",
        rate: 2118.880
      },
      {
        name: "feet cubed per hour",
        abbreviation: "ft3\u2215hr",
        rate: 127132.8
      },
      {
        name: "gallon per second",
        abbreviation: "gal\u2215s",
        rate: 264.1721
      },
      {
        name: "gallon per minute",
        abbreviation: "gal\u2215min",
        rate: 15850.32
      },
      {
        name: "gallon per hour",
        abbreviation: "gal\u2215hr",
        rate: 951019.4
      },
      {
        name: "oil barrels per minute",
        abbreviation: "barrels\u2215min",
        rate: 377.389
      },
      {
        name: "oil barrels per hour",
        abbreviation: "barrels\u2215hr",
        rate: 22643.3
      },
      {
        name: "oil barrels per day",
        abbreviation: "barrels\u2215day",
        rate: 543440
      }
    
];




// Event Listeners

volumeFlowrateBtn.addEventListener("click", volumeFlowrateBtnClick);

function volumeFlowrateBtnClick(event) {
  btnArray_21.forEach(function (element) {
    element.classList.remove("open");
});
  volumeFlowrateBtn.classList.toggle("open");
}




function setNewBaseVolumeFlowrateUnit(newBaseVolumeFlowrateUnitLI) {
    newBaseVolumeFlowrateUnitLI.classList.add("base-volumeFlowrate-unit");
    baseVolumeFlowrateUnit = newBaseVolumeFlowrateUnitLI.id;
    const baseVolumeFlowrateUnitRate = volumeFlowrateUnits.find(volumeFlowrateUnit => volumeFlowrateUnit.abbreviation===baseVolumeFlowrateUnit).rate;
    volumeFlowrateUnitList.querySelectorAll(".volumeFlowrate-unit").forEach(volumeFlowrateUnitLI => {
      const volumeFlowrateUnitRate = volumeFlowrateUnits.find(volumeFlowrateUnit => volumeFlowrateUnit.abbreviation===volumeFlowrateUnitLI.id).rate;
      const exchangeRate = volumeFlowrateUnitLI.id===baseVolumeFlowrateUnit ? 1 : (volumeFlowrateUnitRate/baseVolumeFlowrateUnitRate).toPrecision(6);
  //    volumeFlowrateUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseVolumeFlowrateUnit} = ${exchangeRate} ${volumeFlowrateUnitLI.id}`;
    });
  }
  
  volumeFlowrateUnitList.addEventListener("input", volumeFlowrateUnitListInputChange);
  
  function volumeFlowrateUnitListInputChange(event) {
    const isNewBaseVolumeFlowrateUnit = event.target.closest("li").id!==baseVolumeFlowrateUnit;
    if(isNewBaseVolumeFlowrateUnit) {
      volumeFlowrateUnitList.querySelector(`#${baseVolumeFlowrateUnit}`).classList.remove("base-volumeFlowrate-unit");
      setNewBaseVolumeFlowrateUnit(event.target.closest("li"));
    }
    const newBaseVolumeFlowrateUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseVolumeFlowrateUnitAmount!==newBaseVolumeFlowrateUnitAmount || isNewBaseVolumeFlowrateUnit) {
      baseVolumeFlowrateUnitAmount = newBaseVolumeFlowrateUnitAmount;
      const baseVolumeFlowrateUnitRate = volumeFlowrateUnits.find(volumeFlowrateUnit => volumeFlowrateUnit.abbreviation===baseVolumeFlowrateUnit).rate;
      volumeFlowrateUnitList.querySelectorAll(".volumeFlowrate-unit").forEach(volumeFlowrateUnitLI => {
        if(volumeFlowrateUnitLI.id!==baseVolumeFlowrateUnit) {
        const volumeFlowrateUnitRate = volumeFlowrateUnits.find(volumeFlowrateUnit => volumeFlowrateUnit.abbreviation===volumeFlowrateUnitLI.id).rate;
        const exchangeRate = volumeFlowrateUnitLI.id===baseVolumeFlowrateUnit ? 1 : (volumeFlowrateUnitRate/baseVolumeFlowrateUnitRate).toPrecision(6);
        volumeFlowrateUnitLI.querySelector(".input input").value = exchangeRate*baseVolumeFlowrateUnitAmount!==0 ? (exchangeRate*baseVolumeFlowrateUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  volumeFlowrateUnitList.addEventListener("focusout", volumeFlowrateUnitsListFocusOut);
  
  function volumeFlowrateUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  volumeFlowrateUnitList.addEventListener("keydown", volumeFlowrateUnitsListKeyDown);
  
  function volumeFlowrateUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateVolumeFlowrateUnitList() {
      for(let i=0; i<initiallyDisplayedVolumeFlowrateUnits.length; i++) {
          const volumeFlowrateUnit = volumeFlowrateUnits.find(c => c.abbreviation===initiallyDisplayedVolumeFlowrateUnits[i]);
          if(volumeFlowrateUnit) newVolumeFlowrateUnitListItem(volumeFlowrateUnit);
      }
  }
  
  function newVolumeFlowrateUnitListItem(volumeFlowrateUnit) {
      if(volumeFlowrateUnitList.childElementCount===0) {
          baseVolumeFlowrateUnit = volumeFlowrateUnit.abbreviation;
          baseVolumeFlowrateUnitAmount = 0;
      }
  
      const baseVolumeFlowrateUnitRate = volumeFlowrateUnits.find(c => c.abbreviation===baseVolumeFlowrateUnit).rate;
      const exchangeRate = volumeFlowrateUnit.abbreviation===baseVolumeFlowrateUnit ? 1 : (volumeFlowrateUnit.rate/baseVolumeFlowrateUnitRate).toPrecision(6);
      const inputValue = baseVolumeFlowrateUnitAmount ? (baseVolumeFlowrateUnitAmount*exchangeRate).toPrecision(6) : "";
  
      volumeFlowrateUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="volumeFlowrate-unit ${volumeFlowrateUnit.abbreviation===baseVolumeFlowrateUnit ? "volumeFlowrate-unit" : ""}" id=${volumeFlowrateUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="volumeFlowrate-unit-symbol">${volumeFlowrateUnit.abbreviation}</span></p>
                  <p class="volumeFlowrate-unit-name"><!--${volumeFlowrateUnit.abbreviation} - ${volumeFlowrateUnit.name}--></p>
                  <p class="base-volumeFlowrate-unit-rate"><!--${baseVolumeFlowrateUnit} = ${exchangeRate} ${volumeFlowrateUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateVolumeFlowrateUnitList();