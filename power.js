

// Global Variables

const btnArray_16 = document.querySelectorAll("button");
const powerBtn = document.querySelector(".powerBtn");
const addPowerConvList = document.querySelector(".add-power-unit-list");
const powerUnitList = document.querySelector(".powerConversions");

//default initially displayed powerUnits
const initiallyDisplayedPowerUnits = ["W", "ft-lbf\u2215s", "kW", "cal\u2215s", "btu\u2215s", "btu\u2215hr", "HP"];
let basePowerUnit;
let basePowerUnitAmount;

const powerUnits = [
    {
        name: "Watt",
        abbreviation: "W",
        rate: 1
    },
    {
        name: "foot pound force per second",
        abbreviation: "ft-lbf\u2215s",
        rate: 0.73756
      },
      {
        name: "kilowatt",
        abbreviation: "kW",
        rate: 1.00000e-03
      },
      {
        name: "calorie per second",
        abbreviation: "cal\u2215s",
        rate: 0.23901
      },
      {
        name: "british thermal unit per second",
        abbreviation: "btu\u2215s",
        rate: 9.48517e-04
      },
      {
        name: "british thermal unit per hour",
        abbreviation: "btu\u2215hr",
        rate: 3.41443
      },
      {
        name: "horsepower",
        abbreviation: "HP",
        rate: 1.34102e-03
      }    
];




// Event Listeners

powerBtn.addEventListener("click", powerBtnClick);

function powerBtnClick(event) {
  btnArray_16.forEach(function (element) {
    element.classList.remove("open");
});
  powerBtn.classList.toggle("open");
}




function setNewBasePowerUnit(newBasePowerUnitLI) {
    newBasePowerUnitLI.classList.add("base-power-unit");
    basePowerUnit = newBasePowerUnitLI.id;
    const basePowerUnitRate = powerUnits.find(powerUnit => powerUnit.abbreviation===basePowerUnit).rate;
    powerUnitList.querySelectorAll(".power-unit").forEach(powerUnitLI => {
      const powerUnitRate = powerUnits.find(powerUnit => powerUnit.abbreviation===powerUnitLI.id).rate;
      const exchangeRate = powerUnitLI.id===basePowerUnit ? 1 : (powerUnitRate/basePowerUnitRate).toPrecision(6);
  //    powerUnitLI.querySelector(".base-mass-unit-rate").textContent = `${basePowerUnit} = ${exchangeRate} ${powerUnitLI.id}`;
    });
  }
  
  powerUnitList.addEventListener("input", powerUnitListInputChange);
  
  function powerUnitListInputChange(event) {
    const isNewBasePowerUnit = event.target.closest("li").id!==basePowerUnit;
    if(isNewBasePowerUnit) {
      powerUnitList.querySelector(`#${basePowerUnit}`).classList.remove("base-power-unit");
      setNewBasePowerUnit(event.target.closest("li"));
    }
    const newBasePowerUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(basePowerUnitAmount!==newBasePowerUnitAmount || isNewBasePowerUnit) {
      basePowerUnitAmount = newBasePowerUnitAmount;
      const basePowerUnitRate = powerUnits.find(powerUnit => powerUnit.abbreviation===basePowerUnit).rate;
      powerUnitList.querySelectorAll(".power-unit").forEach(powerUnitLI => {
        if(powerUnitLI.id!==basePowerUnit) {
        const powerUnitRate = powerUnits.find(powerUnit => powerUnit.abbreviation===powerUnitLI.id).rate;
        const exchangeRate = powerUnitLI.id===basePowerUnit ? 1 : (powerUnitRate/basePowerUnitRate).toPrecision(6);
        powerUnitLI.querySelector(".input input").value = exchangeRate*basePowerUnitAmount!==0 ? (exchangeRate*basePowerUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  powerUnitList.addEventListener("focusout", powerUnitsListFocusOut);
  
  function powerUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  powerUnitList.addEventListener("keydown", powerUnitsListKeyDown);
  
  function powerUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populatePowerUnitList() {
      for(let i=0; i<initiallyDisplayedPowerUnits.length; i++) {
          const powerUnit = powerUnits.find(c => c.abbreviation===initiallyDisplayedPowerUnits[i]);
          if(powerUnit) newPowerUnitListItem(powerUnit);
      }
  }
  
  function newPowerUnitListItem(powerUnit) {
      if(powerUnitList.childElementCount===0) {
          basePowerUnit = powerUnit.abbreviation;
          basePowerUnitAmount = 0;
      }
  
      const basePowerUnitRate = powerUnits.find(c => c.abbreviation===basePowerUnit).rate;
      const exchangeRate = powerUnit.abbreviation===basePowerUnit ? 1 : (powerUnit.rate/basePowerUnitRate).toPrecision(6);
      const inputValue = basePowerUnitAmount ? (basePowerUnitAmount*exchangeRate).toPrecision(6) : "";
  
      powerUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="power-unit ${powerUnit.abbreviation===basePowerUnit ? "power-unit" : ""}" id=${powerUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="power-unit-symbol">${powerUnit.abbreviation}</span></p>
                  <p class="power-unit-name"><!--${powerUnit.abbreviation} - ${powerUnit.name}--></p>
                  <p class="base-power-unit-rate"><!--${basePowerUnit} = ${exchangeRate} ${powerUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populatePowerUnitList();