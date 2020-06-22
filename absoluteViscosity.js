

// Global Variables

const btnArray_2 = document.querySelectorAll("button");
const absoluteViscosityBtn = document.querySelector(".absoluteViscosityBtn");
const addAbsoluteViscosityConvList = document.querySelector(".add-absoluteViscosity-unit-list");
const absoluteViscosityUnitList = document.querySelector(".absoluteViscosityConversions");


//default initially displayed absoluteViscosityUnits
const initiallyDisplayedAbsoluteViscosityUnits = ["Pa-s", "lb\u2215ft-s", "cP", "poise", "lb\u2215ft-hr"];
let baseAbsoluteViscosityUnit;
let baseAbsoluteViscosityUnitAmount;

const absoluteViscosityUnits = [
    {
        name: "pascal second",
        abbreviation: "Pa-s",
        rate: 1.00000e-03
    },
    {
        name: "pound per foot second",
        abbreviation: "lb\u2215ft-s",
        rate: 6.71969e-04
      },
      {
        name: "centipoise",
        abbreviation: "cP",
        rate: 1.00000
      },
      {
        name: "poise",
        abbreviation: "poise",
        rate: 1.00000e-02
      },
      {
        name: "pound per foot hour",
        abbreviation: "lb\u2215ft-hr",
        rate: 2.41909
      }
    
];




// Event Listeners

absoluteViscosityBtn.addEventListener("click", absoluteViscosityBtnClick);

function absoluteViscosityBtnClick(event) {
  btnArray_2.forEach(function (element) {
    element.classList.remove("open");
});
  absoluteViscosityBtn.classList.toggle("open");
}




function setNewBaseAbsoluteViscosityUnit(newBaseAbsoluteViscosityUnitLI) {
    newBaseAbsoluteViscosityUnitLI.classList.add("base-absoluteViscosity-unit");
    baseAbsoluteViscosityUnit = newBaseAbsoluteViscosityUnitLI.id;
    const baseAbsoluteViscosityUnitRate = absoluteViscosityUnits.find(absoluteViscosityUnit => absoluteViscosityUnit.abbreviation===baseAbsoluteViscosityUnit).rate;
    absoluteViscosityUnitList.querySelectorAll(".absoluteViscosity-unit").forEach(absoluteViscosityUnitLI => {
      const absoluteViscosityUnitRate = absoluteViscosityUnits.find(absoluteViscosityUnit => absoluteViscosityUnit.abbreviation===absoluteViscosityUnitLI.id).rate;
      const exchangeRate = absoluteViscosityUnitLI.id===baseAbsoluteViscosityUnit ? 1 : (absoluteViscosityUnitRate/baseAbsoluteViscosityUnitRate).toPrecision(6);
  //    absoluteViscosityUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseAbsoluteViscosityUnit} = ${exchangeRate} ${absoluteViscosityUnitLI.id}`;
    });
  }
  
  absoluteViscosityUnitList.addEventListener("input", absoluteViscosityUnitListInputChange);
  
  function absoluteViscosityUnitListInputChange(event) {
    const isNewBaseAbsoluteViscosityUnit = event.target.closest("li").id!==baseAbsoluteViscosityUnit;
    if(isNewBaseAbsoluteViscosityUnit) {
      absoluteViscosityUnitList.querySelector(`#${baseAbsoluteViscosityUnit}`).classList.remove("base-absoluteViscosity-unit");
      setNewBaseAbsoluteViscosityUnit(event.target.closest("li"));
    }
    const newBaseAbsoluteViscosityUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseAbsoluteViscosityUnitAmount!==newBaseAbsoluteViscosityUnitAmount || isNewBaseAbsoluteViscosityUnit) {
      baseAbsoluteViscosityUnitAmount = newBaseAbsoluteViscosityUnitAmount;
      const baseAbsoluteViscosityUnitRate = absoluteViscosityUnits.find(absoluteViscosityUnit => absoluteViscosityUnit.abbreviation===baseAbsoluteViscosityUnit).rate;
      absoluteViscosityUnitList.querySelectorAll(".absoluteViscosity-unit").forEach(absoluteViscosityUnitLI => {
        if(absoluteViscosityUnitLI.id!==baseAbsoluteViscosityUnit) {
        const absoluteViscosityUnitRate = absoluteViscosityUnits.find(absoluteViscosityUnit => absoluteViscosityUnit.abbreviation===absoluteViscosityUnitLI.id).rate;
        const exchangeRate = absoluteViscosityUnitLI.id===baseAbsoluteViscosityUnit ? 1 : (absoluteViscosityUnitRate/baseAbsoluteViscosityUnitRate).toPrecision(6);
        absoluteViscosityUnitLI.querySelector(".input input").value = exchangeRate*baseAbsoluteViscosityUnitAmount!==0 ? (exchangeRate*baseAbsoluteViscosityUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  absoluteViscosityUnitList.addEventListener("focusout", absoluteViscosityUnitsListFocusOut);
  
  function absoluteViscosityUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  absoluteViscosityUnitList.addEventListener("keydown", absoluteViscosityUnitsListKeyDown);
  
  function absoluteViscosityUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateAbsoluteViscosityUnitList() {
      for(let i=0; i<initiallyDisplayedAbsoluteViscosityUnits.length; i++) {
          const absoluteViscosityUnit = absoluteViscosityUnits.find(c => c.abbreviation===initiallyDisplayedAbsoluteViscosityUnits[i]);
          if(absoluteViscosityUnit) newAbsoluteViscosityUnitListItem(absoluteViscosityUnit);
      }
  }
  
  function newAbsoluteViscosityUnitListItem(absoluteViscosityUnit) {
      if(absoluteViscosityUnitList.childElementCount===0) {
          baseAbsoluteViscosityUnit = absoluteViscosityUnit.abbreviation;
          baseAbsoluteViscosityUnitAmount = 0;
      }
  
      const baseAbsoluteViscosityUnitRate = absoluteViscosityUnits.find(c => c.abbreviation===baseAbsoluteViscosityUnit).rate;
      const exchangeRate = absoluteViscosityUnit.abbreviation===baseAbsoluteViscosityUnit ? 1 : (absoluteViscosityUnit.rate/baseAbsoluteViscosityUnitRate).toPrecision(6);
      const inputValue = baseAbsoluteViscosityUnitAmount ? (baseAbsoluteViscosityUnitAmount*exchangeRate).toPrecision(6) : "";
  
      absoluteViscosityUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="absoluteViscosity-unit ${absoluteViscosityUnit.abbreviation===baseAbsoluteViscosityUnit ? "absoluteViscosity-unit" : ""}" id=${absoluteViscosityUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="absoluteViscosity-unit-symbol">${absoluteViscosityUnit.abbreviation}</span></p>
                  <p class="absoluteViscosity-unit-name"><!--${absoluteViscosityUnit.abbreviation} - ${absoluteViscosityUnit.name}--></p>
                  <p class="base-absoluteViscosity-unit-rate"><!--${baseAbsoluteViscosityUnit} = ${exchangeRate} ${absoluteViscosityUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateAbsoluteViscosityUnitList();