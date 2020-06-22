

// Global Variables

const btnArray_6 = document.querySelectorAll("button");
const energyBtn = document.querySelector(".energyBtn");
const addEnergyConvList = document.querySelector(".add-energy-unit-list");
const energyUnitList = document.querySelector(".energyConversions");


//default initially displayed energyUnits
const initiallyDisplayedEnergyUnits = ["J", "ft-lbf", "dyne-cm", "kw-h", "cal", "btu"];
let baseEnergyUnit;
let baseEnergyUnitAmount;

const energyUnits = [
    {
        name: "joule",
        abbreviation: "J",
        rate: 1
    },
    {
        name: "foot pound force",
        abbreviation: "ft-lbf",
        rate: 0.73756
      },
      {
        name: "dyne centimeter",
        abbreviation: "dyne-cm",
        rate: 10000000
      },
      {
        name: "kilowatt hour",
        abbreviation: "kw-h",
        rate: 2.77778e-07
      },
      {
        name: "calorie",
        abbreviation: "cal",
        rate: 0.23901
      },
      {
        name: "british thermal unit",
        abbreviation: "btu",
        rate: 9.48452e-04
      },    
];




// Event Listeners

energyBtn.addEventListener("click", energyBtnClick);

function energyBtnClick(event) {
  btnArray_6.forEach(function (element) {
    element.classList.remove("open");
});
  energyBtn.classList.toggle("open");
}




function setNewBaseEnergyUnit(newBaseEnergyUnitLI) {
    newBaseEnergyUnitLI.classList.add("base-energy-unit");
    baseEnergyUnit = newBaseEnergyUnitLI.id;
    const baseEnergyUnitRate = energyUnits.find(energyUnit => energyUnit.abbreviation===baseEnergyUnit).rate;
    energyUnitList.querySelectorAll(".energy-unit").forEach(energyUnitLI => {
      const energyUnitRate = energyUnits.find(energyUnit => energyUnit.abbreviation===energyUnitLI.id).rate;
      const exchangeRate = energyUnitLI.id===baseEnergyUnit ? 1 : (energyUnitRate/baseEnergyUnitRate).toPrecision(6);
  //    energyUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseEnergyUnit} = ${exchangeRate} ${energyUnitLI.id}`;
    });
  }
  
  energyUnitList.addEventListener("input", energyUnitListInputChange);
  
  function energyUnitListInputChange(event) {
    const isNewBaseEnergyUnit = event.target.closest("li").id!==baseEnergyUnit;
    if(isNewBaseEnergyUnit) {
      energyUnitList.querySelector(`#${baseEnergyUnit}`).classList.remove("base-energy-unit");
      setNewBaseEnergyUnit(event.target.closest("li"));
    }
    const newBaseEnergyUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseEnergyUnitAmount!==newBaseEnergyUnitAmount || isNewBaseEnergyUnit) {
      baseEnergyUnitAmount = newBaseEnergyUnitAmount;
      const baseEnergyUnitRate = energyUnits.find(energyUnit => energyUnit.abbreviation===baseEnergyUnit).rate;
      energyUnitList.querySelectorAll(".energy-unit").forEach(energyUnitLI => {
        if(energyUnitLI.id!==baseEnergyUnit) {
        const energyUnitRate = energyUnits.find(energyUnit => energyUnit.abbreviation===energyUnitLI.id).rate;
        const exchangeRate = energyUnitLI.id===baseEnergyUnit ? 1 : (energyUnitRate/baseEnergyUnitRate).toPrecision(6);
        energyUnitLI.querySelector(".input input").value = exchangeRate*baseEnergyUnitAmount!==0 ? (exchangeRate*baseEnergyUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  energyUnitList.addEventListener("focusout", energyUnitsListFocusOut);
  
  function energyUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  energyUnitList.addEventListener("keydown", energyUnitsListKeyDown);
  
  function energyUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateEnergyUnitList() {
      for(let i=0; i<initiallyDisplayedEnergyUnits.length; i++) {
          const energyUnit = energyUnits.find(c => c.abbreviation===initiallyDisplayedEnergyUnits[i]);
          if(energyUnit) newEnergyUnitListItem(energyUnit);
      }
  }
  
  function newEnergyUnitListItem(energyUnit) {
      if(energyUnitList.childElementCount===0) {
          baseEnergyUnit = energyUnit.abbreviation;
          baseEnergyUnitAmount = 0;
      }
  
      const baseEnergyUnitRate = energyUnits.find(c => c.abbreviation===baseEnergyUnit).rate;
      const exchangeRate = energyUnit.abbreviation===baseEnergyUnit ? 1 : (energyUnit.rate/baseEnergyUnitRate).toPrecision(6);
      const inputValue = baseEnergyUnitAmount ? (baseEnergyUnitAmount*exchangeRate).toPrecision(6) : "";
  
      energyUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="energy-unit ${energyUnit.abbreviation===baseEnergyUnit ? "energy-unit" : ""}" id=${energyUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="energy-unit-symbol">${energyUnit.abbreviation}</span></p>
                  <p class="energy-unit-name"><!--${energyUnit.abbreviation} - ${energyUnit.name}--></p>
                  <p class="base-energy-unit-rate"><!--${baseEnergyUnit} = ${exchangeRate} ${energyUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateEnergyUnitList();