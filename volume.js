

// Global Variables

const btnArray_20 = document.querySelectorAll("button");
const volumeBtn = document.querySelector(".volumeBtn");
const addVolumeConvList = document.querySelector(".add-volume-unit-list");
const volumeUnitList = document.querySelector(".volumeConversions");

//default initially displayed volumeUnits
const initiallyDisplayedVolumeUnits = ["m3", "ft3", "cm3", "L", "gal", "impgal", "oil_barrel", "US_qt", "US_floz"];
let baseVolumeUnit;
let baseVolumeUnitAmount;

const volumeUnits = [
    {
        name: "meter cubed",
        abbreviation: "m3",
        rate: 1
    },
    {
        name: "feet cubed",
        abbreviation: "ft3",
        rate: 35.31467
      },
      {
        name: "centimeter cubed",
        abbreviation: "cm3",
        rate: 1000000.0
      },
      {
        name: "liter",
        abbreviation: "L",
        rate: 1000.0000
      },
      {
        name: "gallon",
        abbreviation: "gal",
        rate: 264.1721
      },
      {
        name: "imperial gallon",
        abbreviation: "impgal",
        rate: 219.9692
      },
      {
        name: "oil barrel",
        abbreviation: "oil_barrel",
        rate: 6.28981
      },
      {
        name: "US quart",
        abbreviation: "US_qt",
        rate: 1056.688
      },
      {
        name: "fluid ounces",
        abbreviation: "US_floz",
        rate: 33814.02
      }
    
];





// Event Listeners

volumeBtn.addEventListener("click", volumeBtnClick);

function volumeBtnClick(event) {
  btnArray_20.forEach(function (element) {
    element.classList.remove("open");
});
  volumeBtn.classList.toggle("open");
}




function setNewBaseVolumeUnit(newBaseVolumeUnitLI) {
    newBaseVolumeUnitLI.classList.add("base-volume-unit");
    baseVolumeUnit = newBaseVolumeUnitLI.id;
    const baseVolumeUnitRate = volumeUnits.find(volumeUnit => volumeUnit.abbreviation===baseVolumeUnit).rate;
    volumeUnitList.querySelectorAll(".volume-unit").forEach(volumeUnitLI => {
      const volumeUnitRate = volumeUnits.find(volumeUnit => volumeUnit.abbreviation===volumeUnitLI.id).rate;
      const exchangeRate = volumeUnitLI.id===baseVolumeUnit ? 1 : (volumeUnitRate/baseVolumeUnitRate).toPrecision(6);
  //    volumeUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseVolumeUnit} = ${exchangeRate} ${volumeUnitLI.id}`;
    });
  }
  
  volumeUnitList.addEventListener("input", volumeUnitListInputChange);
  
  function volumeUnitListInputChange(event) {
    const isNewBaseVolumeUnit = event.target.closest("li").id!==baseVolumeUnit;
    if(isNewBaseVolumeUnit) {
      volumeUnitList.querySelector(`#${baseVolumeUnit}`).classList.remove("base-volume-unit");
      setNewBaseVolumeUnit(event.target.closest("li"));
    }
    const newBaseVolumeUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseVolumeUnitAmount!==newBaseVolumeUnitAmount || isNewBaseVolumeUnit) {
      baseVolumeUnitAmount = newBaseVolumeUnitAmount;
      const baseVolumeUnitRate = volumeUnits.find(volumeUnit => volumeUnit.abbreviation===baseVolumeUnit).rate;
      volumeUnitList.querySelectorAll(".volume-unit").forEach(volumeUnitLI => {
        if(volumeUnitLI.id!==baseVolumeUnit) {
        const volumeUnitRate = volumeUnits.find(volumeUnit => volumeUnit.abbreviation===volumeUnitLI.id).rate;
        const exchangeRate = volumeUnitLI.id===baseVolumeUnit ? 1 : (volumeUnitRate/baseVolumeUnitRate).toPrecision(6);
        volumeUnitLI.querySelector(".input input").value = exchangeRate*baseVolumeUnitAmount!==0 ? (exchangeRate*baseVolumeUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  volumeUnitList.addEventListener("focusout", volumeUnitsListFocusOut);
  
  function volumeUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  volumeUnitList.addEventListener("keydown", volumeUnitsListKeyDown);
  
  function volumeUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateVolumeUnitList() {
      for(let i=0; i<initiallyDisplayedVolumeUnits.length; i++) {
          const volumeUnit = volumeUnits.find(c => c.abbreviation===initiallyDisplayedVolumeUnits[i]);
          if(volumeUnit) newVolumeUnitListItem(volumeUnit);
      }
  }
  
  function newVolumeUnitListItem(volumeUnit) {
      if(volumeUnitList.childElementCount===0) {
          baseVolumeUnit = volumeUnit.abbreviation;
          baseVolumeUnitAmount = 0;
      }
  
      const baseVolumeUnitRate = volumeUnits.find(c => c.abbreviation===baseVolumeUnit).rate;
      const exchangeRate = volumeUnit.abbreviation===baseVolumeUnit ? 1 : (volumeUnit.rate/baseVolumeUnitRate).toPrecision(6);
      const inputValue = baseVolumeUnitAmount ? (baseVolumeUnitAmount*exchangeRate).toPrecision(6) : "";
  
      volumeUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="volume-unit ${volumeUnit.abbreviation===baseVolumeUnit ? "volume-unit" : ""}" id=${volumeUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="volume-unit-symbol">${volumeUnit.abbreviation}</span></p>
                  <p class="volume-unit-name"><!--${volumeUnit.abbreviation} - ${volumeUnit.name}--></p>
                  <p class="base-volume-unit-rate"><!--${baseVolumeUnit} = ${exchangeRate} ${volumeUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateVolumeUnitList();