

// Global Variables

const btnArray_8 = document.querySelectorAll("button");
const energyPerMassBtn = document.querySelector(".energyPerMassBtn");
const addEnergyPerMassConvList = document.querySelector(".add-energyPerMass-unit-list");
const energyPerMassUnitList = document.querySelector(".energyPerMassConversions");


//default initially displayed energyPerMassUnits
const initiallyDisplayedEnergyPerMassUnits = ["J\u2215kg", "ft-lbf\u2215lb", "kJ\u2215kg", "cal\u2215g", "btu\u2215lb"];
let baseEnergyPerMassUnit;
let baseEnergyPerMassUnitAmount;

const energyPerMassUnits = [
    {
        name: "joule per kilogram",
        abbreviation: "J\u2215kg",
        rate: 1
    },
    {
        name: "foot pound force per pound mass",
        abbreviation: "ft-lbf\u2215lb",
        rate: 0.33455
      },
      {
        name: "kilojoules per kilogram",
        abbreviation: "kJ\u2215kg",
        rate: 1.00000e-03
      },
      {
        name: "calories per gram",
        abbreviation: "cal\u2215g",
        rate: 2.39006e-04
      },
      {
        name: "british thermal unit per pound",
        abbreviation: "btu\u2215lb",
        rate: 4.30210e-04
      }    
];




// Event Listeners

energyPerMassBtn.addEventListener("click", energyPerMassBtnClick);

function energyPerMassBtnClick(event) {
  btnArray_8.forEach(function (element) {
    element.classList.remove("open");
});
  energyPerMassBtn.classList.toggle("open");
}




function setNewBaseEnergyPerMassUnit(newBaseEnergyPerMassUnitLI) {
    newBaseEnergyPerMassUnitLI.classList.add("base-energyPerMass-unit");
    baseEnergyPerMassUnit = newBaseEnergyPerMassUnitLI.id;
    const baseEnergyPerMassUnitRate = energyPerMassUnits.find(energyPerMassUnit => energyPerMassUnit.abbreviation===baseEnergyPerMassUnit).rate;
    energyPerMassUnitList.querySelectorAll(".energyPerMass-unit").forEach(energyPerMassUnitLI => {
      const energyPerMassUnitRate = energyPerMassUnits.find(energyPerMassUnit => energyPerMassUnit.abbreviation===energyPerMassUnitLI.id).rate;
      const exchangeRate = energyPerMassUnitLI.id===baseEnergyPerMassUnit ? 1 : (energyPerMassUnitRate/baseEnergyPerMassUnitRate).toPrecision(6);
  //    energyPerMassUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseEnergyPerMassUnit} = ${exchangeRate} ${energyPerMassUnitLI.id}`;
    });
  }
  
  energyPerMassUnitList.addEventListener("input", energyPerMassUnitListInputChange);
  
  function energyPerMassUnitListInputChange(event) {
    const isNewBaseEnergyPerMassUnit = event.target.closest("li").id!==baseEnergyPerMassUnit;
    if(isNewBaseEnergyPerMassUnit) {
      energyPerMassUnitList.querySelector(`#${baseEnergyPerMassUnit}`).classList.remove("base-energyPerMass-unit");
      setNewBaseEnergyPerMassUnit(event.target.closest("li"));
    }
    const newBaseEnergyPerMassUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseEnergyPerMassUnitAmount!==newBaseEnergyPerMassUnitAmount || isNewBaseEnergyPerMassUnit) {
      baseEnergyPerMassUnitAmount = newBaseEnergyPerMassUnitAmount;
      const baseEnergyPerMassUnitRate = energyPerMassUnits.find(energyPerMassUnit => energyPerMassUnit.abbreviation===baseEnergyPerMassUnit).rate;
      energyPerMassUnitList.querySelectorAll(".energyPerMass-unit").forEach(energyPerMassUnitLI => {
        if(energyPerMassUnitLI.id!==baseEnergyPerMassUnit) {
        const energyPerMassUnitRate = energyPerMassUnits.find(energyPerMassUnit => energyPerMassUnit.abbreviation===energyPerMassUnitLI.id).rate;
        const exchangeRate = energyPerMassUnitLI.id===baseEnergyPerMassUnit ? 1 : (energyPerMassUnitRate/baseEnergyPerMassUnitRate).toPrecision(6);
        energyPerMassUnitLI.querySelector(".input input").value = exchangeRate*baseEnergyPerMassUnitAmount!==0 ? (exchangeRate*baseEnergyPerMassUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  energyPerMassUnitList.addEventListener("focusout", energyPerMassUnitsListFocusOut);
  
  function energyPerMassUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  energyPerMassUnitList.addEventListener("keydown", energyPerMassUnitsListKeyDown);
  
  function energyPerMassUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateEnergyPerMassUnitList() {
      for(let i=0; i<initiallyDisplayedEnergyPerMassUnits.length; i++) {
          const energyPerMassUnit = energyPerMassUnits.find(c => c.abbreviation===initiallyDisplayedEnergyPerMassUnits[i]);
          if(energyPerMassUnit) newEnergyPerMassUnitListItem(energyPerMassUnit);
      }
  }
  
  function newEnergyPerMassUnitListItem(energyPerMassUnit) {
      if(energyPerMassUnitList.childElementCount===0) {
          baseEnergyPerMassUnit = energyPerMassUnit.abbreviation;
          baseEnergyPerMassUnitAmount = 0;
      }
  
      const baseEnergyPerMassUnitRate = energyPerMassUnits.find(c => c.abbreviation===baseEnergyPerMassUnit).rate;
      const exchangeRate = energyPerMassUnit.abbreviation===baseEnergyPerMassUnit ? 1 : (energyPerMassUnit.rate/baseEnergyPerMassUnitRate).toPrecision(6);
      const inputValue = baseEnergyPerMassUnitAmount ? (baseEnergyPerMassUnitAmount*exchangeRate).toPrecision(6) : "";
  
      energyPerMassUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="energyPerMass-unit ${energyPerMassUnit.abbreviation===baseEnergyPerMassUnit ? "energyPerMass-unit" : ""}" id=${energyPerMassUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="energyPerMass-unit-symbol">${energyPerMassUnit.abbreviation}</span></p>
                  <p class="energyPerMass-unit-name"><!--${energyPerMassUnit.abbreviation} - ${energyPerMassUnit.name}--></p>
                  <p class="base-energyPerMass-unit-rate"><!--${baseEnergyPerMassUnit} = ${exchangeRate} ${energyPerMassUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateEnergyPerMassUnitList();