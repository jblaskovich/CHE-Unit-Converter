

// Global Variables

const btnArray_17 = document.querySelectorAll("button");
const pressureBtn = document.querySelector(".pressureBtn");
const addPressureConvList = document.querySelector(".add-pressure-unit-list");
const pressureUnitList = document.querySelector(".pressureConversions");

//default initially displayed pressureUnits
const initiallyDisplayedPressureUnits = ["Pa", "psi", "kPa", "atm", "bars", "torr", "inHg_0\u2103", "inH2O_4\u2103", "ftH2O_4\u2103"];
let basePressureUnit;
let basePressureUnitAmount;

const pressureUnits = [
    {
        name: "Pascal",
        abbreviation: "Pa",
        rate: 100000.00
    },
    {
        name: "pound per square inch",
        abbreviation: "psi",
        rate: 14.50377
      },
      {
        name: "kilopascals",
        abbreviation: "kPa",
        rate: 100.00000
      },
      {
        name: "atmosphere",
        abbreviation: "atm",
        rate: 0.98692
      },
      {
        name: "bars",
        abbreviation: "bars",
        rate: 1.00000
      },
      {
        name: "torr",
        abbreviation: "torr",
        rate: 750.0617
      },
      {
        name: "inHg_0C",
        abbreviation: "inHg_0\u2103",
        rate: 29.53003
      },
      {
        name: "inH2O_4C",
        abbreviation: "inH2O_4\u2103",
        rate: 401.4745
      },
      {
        name: "ftH2O_4C",
        abbreviation: "ftH2O_4\u2103",
        rate: 33.45621
      }
    
];




// Event Listeners

pressureBtn.addEventListener("click", pressureBtnClick);

function pressureBtnClick(event) {
  btnArray_17.forEach(function (element) {
    element.classList.remove("open");
});
  pressureBtn.classList.toggle("open");
}




function setNewBasePressureUnit(newBasePressureUnitLI) {
    newBasePressureUnitLI.classList.add("base-pressure-unit");
    basePressureUnit = newBasePressureUnitLI.id;
    const basePressureUnitRate = pressureUnits.find(pressureUnit => pressureUnit.abbreviation===basePressureUnit).rate;
    pressureUnitList.querySelectorAll(".pressure-unit").forEach(pressureUnitLI => {
      const pressureUnitRate = pressureUnits.find(pressureUnit => pressureUnit.abbreviation===pressureUnitLI.id).rate;
      const exchangeRate = pressureUnitLI.id===basePressureUnit ? 1 : (pressureUnitRate/basePressureUnitRate).toPrecision(6);
  //    pressureUnitLI.querySelector(".base-mass-unit-rate").textContent = `${basePressureUnit} = ${exchangeRate} ${pressureUnitLI.id}`;
    });
  }
  
  pressureUnitList.addEventListener("input", pressureUnitListInputChange);
  
  function pressureUnitListInputChange(event) {
    const isNewBasePressureUnit = event.target.closest("li").id!==basePressureUnit;
    if(isNewBasePressureUnit) {
      pressureUnitList.querySelector(`#${basePressureUnit}`).classList.remove("base-pressure-unit");
      setNewBasePressureUnit(event.target.closest("li"));
    }
    const newBasePressureUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(basePressureUnitAmount!==newBasePressureUnitAmount || isNewBasePressureUnit) {
      basePressureUnitAmount = newBasePressureUnitAmount;
      const basePressureUnitRate = pressureUnits.find(pressureUnit => pressureUnit.abbreviation===basePressureUnit).rate;
      pressureUnitList.querySelectorAll(".pressure-unit").forEach(pressureUnitLI => {
        if(pressureUnitLI.id!==basePressureUnit) {
        const pressureUnitRate = pressureUnits.find(pressureUnit => pressureUnit.abbreviation===pressureUnitLI.id).rate;
        const exchangeRate = pressureUnitLI.id===basePressureUnit ? 1 : (pressureUnitRate/basePressureUnitRate).toPrecision(6);
        pressureUnitLI.querySelector(".input input").value = exchangeRate*basePressureUnitAmount!==0 ? (exchangeRate*basePressureUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  pressureUnitList.addEventListener("focusout", pressureUnitsListFocusOut);
  
  function pressureUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  pressureUnitList.addEventListener("keydown", pressureUnitsListKeyDown);
  
  function pressureUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populatePressureUnitList() {
      for(let i=0; i<initiallyDisplayedPressureUnits.length; i++) {
          const pressureUnit = pressureUnits.find(c => c.abbreviation===initiallyDisplayedPressureUnits[i]);
          if(pressureUnit) newPressureUnitListItem(pressureUnit);
      }
  }
  
  function newPressureUnitListItem(pressureUnit) {
      if(pressureUnitList.childElementCount===0) {
          basePressureUnit = pressureUnit.abbreviation;
          basePressureUnitAmount = 0;
      }
  
      const basePressureUnitRate = pressureUnits.find(c => c.abbreviation===basePressureUnit).rate;
      const exchangeRate = pressureUnit.abbreviation===basePressureUnit ? 1 : (pressureUnit.rate/basePressureUnitRate).toPrecision(6);
      const inputValue = basePressureUnitAmount ? (basePressureUnitAmount*exchangeRate).toPrecision(6) : "";
  
      pressureUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="pressure-unit ${pressureUnit.abbreviation===basePressureUnit ? "pressure-unit" : ""}" id=${pressureUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="pressure-unit-symbol">${pressureUnit.abbreviation}</span></p>
                  <p class="pressure-unit-name"><!--${pressureUnit.abbreviation} - ${pressureUnit.name}--></p>
                  <p class="base-pressure-unit-rate"><!--${basePressureUnit} = ${exchangeRate} ${pressureUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populatePressureUnitList();