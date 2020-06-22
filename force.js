

// Global Variables

const btnArray_9 = document.querySelectorAll("button");
const forceBtn = document.querySelector(".forceBtn");
const addForceConvList = document.querySelector(".add-force-unit-list");
const forceUnitList = document.querySelector(".forceConversions");

//default initially displayed forceUnits
const initiallyDisplayedForceUnits = ["N", "lbf", "dyne"];
let baseForceUnit;
let baseForceUnitAmount;

const forceUnits = [
    {
        name: "Newton",
        abbreviation: "N",
        rate: 1
    },
    {
        name: "pound force",
        abbreviation: "lbf",
        rate: 0.22481
      },
      {
        name: "dyne",
        abbreviation: "dyne",
        rate: 100000.00
      },  
];




// Event Listeners

forceBtn.addEventListener("click", forceBtnClick);

function forceBtnClick(event) {
  btnArray_9.forEach(function (element) {
    element.classList.remove("open");
});
  forceBtn.classList.toggle("open");
}




function setNewBaseForceUnit(newBaseForceUnitLI) {
    newBaseForceUnitLI.classList.add("base-force-unit");
    baseForceUnit = newBaseForceUnitLI.id;
    const baseForceUnitRate = forceUnits.find(forceUnit => forceUnit.abbreviation===baseForceUnit).rate;
    forceUnitList.querySelectorAll(".force-unit").forEach(forceUnitLI => {
      const forceUnitRate = forceUnits.find(forceUnit => forceUnit.abbreviation===forceUnitLI.id).rate;
      const exchangeRate = forceUnitLI.id===baseForceUnit ? 1 : (forceUnitRate/baseForceUnitRate).toPrecision(6);
  //    forceUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseForceUnit} = ${exchangeRate} ${forceUnitLI.id}`;
    });
  }
  
  forceUnitList.addEventListener("input", forceUnitListInputChange);
  
  function forceUnitListInputChange(event) {
    const isNewBaseForceUnit = event.target.closest("li").id!==baseForceUnit;
    if(isNewBaseForceUnit) {
      forceUnitList.querySelector(`#${baseForceUnit}`).classList.remove("base-force-unit");
      setNewBaseForceUnit(event.target.closest("li"));
    }
    const newBaseForceUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseForceUnitAmount!==newBaseForceUnitAmount || isNewBaseForceUnit) {
      baseForceUnitAmount = newBaseForceUnitAmount;
      const baseForceUnitRate = forceUnits.find(forceUnit => forceUnit.abbreviation===baseForceUnit).rate;
      forceUnitList.querySelectorAll(".force-unit").forEach(forceUnitLI => {
        if(forceUnitLI.id!==baseForceUnit) {
        const forceUnitRate = forceUnits.find(forceUnit => forceUnit.abbreviation===forceUnitLI.id).rate;
        const exchangeRate = forceUnitLI.id===baseForceUnit ? 1 : (forceUnitRate/baseForceUnitRate).toPrecision(6);
        forceUnitLI.querySelector(".input input").value = exchangeRate*baseForceUnitAmount!==0 ? (exchangeRate*baseForceUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  forceUnitList.addEventListener("focusout", forceUnitsListFocusOut);
  
  function forceUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  forceUnitList.addEventListener("keydown", forceUnitsListKeyDown);
  
  function forceUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateForceUnitList() {
      for(let i=0; i<initiallyDisplayedForceUnits.length; i++) {
          const forceUnit = forceUnits.find(c => c.abbreviation===initiallyDisplayedForceUnits[i]);
          if(forceUnit) newForceUnitListItem(forceUnit);
      }
  }
  
  function newForceUnitListItem(forceUnit) {
      if(forceUnitList.childElementCount===0) {
          baseForceUnit = forceUnit.abbreviation;
          baseForceUnitAmount = 0;
      }
  
      const baseForceUnitRate = forceUnits.find(c => c.abbreviation===baseForceUnit).rate;
      const exchangeRate = forceUnit.abbreviation===baseForceUnit ? 1 : (forceUnit.rate/baseForceUnitRate).toPrecision(6);
      const inputValue = baseForceUnitAmount ? (baseForceUnitAmount*exchangeRate).toPrecision(6) : "";
  
      forceUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="force-unit ${forceUnit.abbreviation===baseForceUnit ? "force-unit" : ""}" id=${forceUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="force-unit-symbol">${forceUnit.abbreviation}</span></p>
                  <p class="force-unit-name"><!--${forceUnit.abbreviation} - ${forceUnit.name}--></p>
                  <p class="base-force-unit-rate"><!--${baseForceUnit} = ${exchangeRate} ${forceUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  populateForceUnitList();