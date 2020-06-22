

// Global Variables

const btnArray_7 = document.querySelectorAll("button");
const energyFluxBtn = document.querySelector(".energyFluxBtn");
const addEnergyFluxConvList = document.querySelector(".add-energyFlux-unit-list");
const energyFluxUnitList = document.querySelector(".energyFluxConversions");

//default initially displayed energyFluxUnits
const initiallyDisplayedEnergyFluxUnits = ["J\u2215m2-s", "ft-lbf\u2215ft2-s", "kJ\u2215m2-h", "cal\u2215cm2-h", "btu\u2215ft2-h"];
let baseEnergyFluxUnit;
let baseEnergyFluxUnitAmount;

const energyFluxUnits = [
    {
        name: "joule per meter squared second",
        abbreviation: "J\u2215m2-s",
        rate: 1
    },
    {
        name: "foot pound forces per foot squared second",
        abbreviation: "ft-lbf\u2215ft2-s",
        rate: 6.85218e-02
      },
      {
        name: "kilojoule per meter squared hour",
        abbreviation: "kJ\u2215m2-h",
        rate: 3.60000
      },
      {
        name: "calorie per centimeter squared hour",
        abbreviation: "cal\u2215cm2-h",
        rate: 8.60421e-02
      },
      {
        name: "british thermal unit per foot squared hour",
        abbreviation: "btu\u2215ft2-h",
        rate: 0.31721
      },    
];




// Event Listeners

energyFluxBtn.addEventListener("click", energyFluxBtnClick);

function energyFluxBtnClick(event) {
  btnArray_7.forEach(function (element) {
    element.classList.remove("open");
});
  energyFluxBtn.classList.toggle("open");
}




function setNewBaseEnergyFluxUnit(newBaseEnergyFluxUnitLI) {
    newBaseEnergyFluxUnitLI.classList.add("base-energyFlux-unit");
    baseEnergyFluxUnit = newBaseEnergyFluxUnitLI.id;
    const baseEnergyFluxUnitRate = energyFluxUnits.find(energyFluxUnit => energyFluxUnit.abbreviation===baseEnergyFluxUnit).rate;
    energyFluxUnitList.querySelectorAll(".energyFlux-unit").forEach(energyFluxUnitLI => {
      const energyFluxUnitRate = energyFluxUnits.find(energyFluxUnit => energyFluxUnit.abbreviation===energyFluxUnitLI.id).rate;
      const exchangeRate = energyFluxUnitLI.id===baseEnergyFluxUnit ? 1 : (energyFluxUnitRate/baseEnergyFluxUnitRate).toPrecision(6);
  //    energyFluxUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseEnergyFluxUnit} = ${exchangeRate} ${energyFluxUnitLI.id}`;
    });
  }
  
  energyFluxUnitList.addEventListener("input", energyFluxUnitListInputChange);
  
  function energyFluxUnitListInputChange(event) {
    const isNewBaseEnergyFluxUnit = event.target.closest("li").id!==baseEnergyFluxUnit;
    if(isNewBaseEnergyFluxUnit) {
      energyFluxUnitList.querySelector(`#${baseEnergyFluxUnit}`).classList.remove("base-energyFlux-unit");
      setNewBaseEnergyFluxUnit(event.target.closest("li"));
    }
    const newBaseEnergyFluxUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseEnergyFluxUnitAmount!==newBaseEnergyFluxUnitAmount || isNewBaseEnergyFluxUnit) {
      baseEnergyFluxUnitAmount = newBaseEnergyFluxUnitAmount;
      const baseEnergyFluxUnitRate = energyFluxUnits.find(energyFluxUnit => energyFluxUnit.abbreviation===baseEnergyFluxUnit).rate;
      energyFluxUnitList.querySelectorAll(".energyFlux-unit").forEach(energyFluxUnitLI => {
        if(energyFluxUnitLI.id!==baseEnergyFluxUnit) {
        const energyFluxUnitRate = energyFluxUnits.find(energyFluxUnit => energyFluxUnit.abbreviation===energyFluxUnitLI.id).rate;
        const exchangeRate = energyFluxUnitLI.id===baseEnergyFluxUnit ? 1 : (energyFluxUnitRate/baseEnergyFluxUnitRate).toPrecision(6);
        energyFluxUnitLI.querySelector(".input input").value = exchangeRate*baseEnergyFluxUnitAmount!==0 ? (exchangeRate*baseEnergyFluxUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  energyFluxUnitList.addEventListener("focusout", energyFluxUnitsListFocusOut);
  
  function energyFluxUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  energyFluxUnitList.addEventListener("keydown", energyFluxUnitsListKeyDown);
  
  function energyFluxUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateEnergyFluxUnitList() {
      for(let i=0; i<initiallyDisplayedEnergyFluxUnits.length; i++) {
          const energyFluxUnit = energyFluxUnits.find(c => c.abbreviation===initiallyDisplayedEnergyFluxUnits[i]);
          if(energyFluxUnit) newEnergyFluxUnitListItem(energyFluxUnit);
      }
  }
  
  function newEnergyFluxUnitListItem(energyFluxUnit) {
      if(energyFluxUnitList.childElementCount===0) {
          baseEnergyFluxUnit = energyFluxUnit.abbreviation;
          baseEnergyFluxUnitAmount = 0;
      }
  
      const baseEnergyFluxUnitRate = energyFluxUnits.find(c => c.abbreviation===baseEnergyFluxUnit).rate;
      const exchangeRate = energyFluxUnit.abbreviation===baseEnergyFluxUnit ? 1 : (energyFluxUnit.rate/baseEnergyFluxUnitRate).toPrecision(6);
      const inputValue = baseEnergyFluxUnitAmount ? (baseEnergyFluxUnitAmount*exchangeRate).toPrecision(6) : "";
  
      energyFluxUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="energyFlux-unit ${energyFluxUnit.abbreviation===baseEnergyFluxUnit ? "energyFlux-unit" : ""}" id=${energyFluxUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="energyFlux-unit-symbol">${energyFluxUnit.abbreviation}</span></p>
                  <p class="energyFlux-unit-name"><!--${energyFluxUnit.abbreviation} - ${energyFluxUnit.name}--></p>
                  <p class="base-energyFlux-unit-rate"><!--${baseEnergyFluxUnit} = ${exchangeRate} ${energyFluxUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateEnergyFluxUnitList();