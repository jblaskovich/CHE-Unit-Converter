

// Global Variables

const btnArray_13 = document.querySelectorAll("button");
const lengthBtn = document.querySelector(".lengthBtn");
const addlengthConvList = document.querySelector(".add-length-unit-list");
const lengthUnitList = document.querySelector(".lengthConversions");


//default initially displayed lengthUnits
const initiallyDisplayedLengthUnits = ["m", "ft", "cm", "mm", "angstrom", "in", "yd", "rod"];
let baseLengthUnit;
let baseLengthUnitAmount;

const lengthUnits = [
    {
        name: "meter",
        abbreviation: "m",
        rate: 1
    },
    {
        name: "feet",
        abbreviation: "ft",
        rate: 3.28084
      },
      {
        name: "centimeter",
        abbreviation: "cm",
        rate: 100.00000
      },
      {
        name: "millimeter",
        abbreviation: "mm",
        rate: 1000.0000
      },
      {
        name: "angstrom",
        abbreviation: "angstrom",
        rate: 1.00000e+10
      },
      {
        name: "inches",
        abbreviation: "in",
        rate: 39.37008
      },
      {
        name: "yard",
        abbreviation: "yd",
        rate: 1.09361
      },
      {
        name: "rod",
        abbreviation: "rod",
        rate: 0.19884
      }
    
];




// Event Listeners

lengthBtn.addEventListener("click", lengthBtnClick);

function lengthBtnClick(event) {
  btnArray_13.forEach(function (element) {
    element.classList.remove("open");
});
  lengthBtn.classList.toggle("open");
}




function setNewBaseLengthUnit(newBaseLengthUnitLI) {
    newBaseLengthUnitLI.classList.add("base-length-unit");
    baseLengthUnit = newBaseLengthUnitLI.id;
    const baseLengthUnitRate = lengthUnits.find(lengthUnit => lengthUnit.abbreviation===baseLengthUnit).rate;
    lengthUnitList.querySelectorAll(".length-unit").forEach(lengthUnitLI => {
      const lengthUnitRate = lengthUnits.find(lengthUnit => lengthUnit.abbreviation===lengthUnitLI.id).rate;
      const exchangeRate = lengthUnitLI.id===baseLengthUnit ? 1 : (lengthUnitRate/baseLengthUnitRate).toPrecision(6);
  //    lengthUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseLengthUnit} = ${exchangeRate} ${lengthUnitLI.id}`;
    });
  }
  
  lengthUnitList.addEventListener("input", lengthUnitListInputChange);
  
  function lengthUnitListInputChange(event) {
    const isNewBaseLengthUnit = event.target.closest("li").id!==baseLengthUnit;
    if(isNewBaseLengthUnit) {
      lengthUnitList.querySelector(`#${baseLengthUnit}`).classList.remove("base-length-unit");
      setNewBaseLengthUnit(event.target.closest("li"));
    }
    const newBaseLengthUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseLengthUnitAmount!==newBaseLengthUnitAmount || isNewBaseLengthUnit) {
      baseLengthUnitAmount = newBaseLengthUnitAmount;
      const baseLengthUnitRate = lengthUnits.find(lengthUnit => lengthUnit.abbreviation===baseLengthUnit).rate;
      lengthUnitList.querySelectorAll(".length-unit").forEach(lengthUnitLI => {
        if(lengthUnitLI.id!==baseLengthUnit) {
        const lengthUnitRate = lengthUnits.find(lengthUnit => lengthUnit.abbreviation===lengthUnitLI.id).rate;
        const exchangeRate = lengthUnitLI.id===baseLengthUnit ? 1 : (lengthUnitRate/baseLengthUnitRate).toPrecision(6);
        lengthUnitLI.querySelector(".input input").value = exchangeRate*baseLengthUnitAmount!==0 ? (exchangeRate*baseLengthUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  lengthUnitList.addEventListener("focusout", lengthUnitsListFocusOut);
  
  function lengthUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  lengthUnitList.addEventListener("keydown", lengthUnitsListKeyDown);
  
  function lengthUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateLengthUnitList() {
      for(let i=0; i<initiallyDisplayedLengthUnits.length; i++) {
          const lengthUnit = lengthUnits.find(c => c.abbreviation===initiallyDisplayedLengthUnits[i]);
          if(lengthUnit) newLengthUnitListItem(lengthUnit);
      }
  }
  
  function newLengthUnitListItem(lengthUnit) {
      if(lengthUnitList.childElementCount===0) {
          baseLengthUnit = lengthUnit.abbreviation;
          baseLengthUnitAmount = 0;
      }
  
      const baseLengthUnitRate = lengthUnits.find(c => c.abbreviation===baseLengthUnit).rate;
      const exchangeRate = lengthUnit.abbreviation===baseLengthUnit ? 1 : (lengthUnit.rate/baseLengthUnitRate).toPrecision(6);
      const inputValue = baseLengthUnitAmount ? (baseLengthUnitAmount*exchangeRate).toPrecision(6) : "";
  
      lengthUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="length-unit ${lengthUnit.abbreviation===baseLengthUnit ? "length-unit" : ""}" id=${lengthUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="length-unit-symbol">${lengthUnit.abbreviation}</span></p>
                  <p class="length-unit-name"><!--${lengthUnit.abbreviation} - ${lengthUnit.name}--></p>
                  <p class="base-length-unit-rate"><!--${baseLengthUnit} = ${exchangeRate} ${lengthUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateLengthUnitList();