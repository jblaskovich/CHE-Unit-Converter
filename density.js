

// Global Variables

const btnArray_4 = document.querySelectorAll("button");
const densityBtn = document.querySelector(".densityBtn");
const addDensityConvList = document.querySelector(".add-density-unit-list");
const densityUnitList = document.querySelector(".densityConversions");

//default initially displayed densityUnits
const initiallyDisplayedDensityUnits = ["kg\u2215m3", "lb\u2215ft3", "g\u2215cm3", "lb\u2215gal"];
let baseDensityUnit;
let baseDensityUnitAmount;

const densityUnits = [
    {
        name: "kilogram per meter cubed",
        abbreviation: "kg\u2215m3",
        rate: 1000.0000
    },
    {
        name: "pound per foot cubed",
        abbreviation: "lb\u2215ft3",
        rate: 62.42796
      },
      {
        name: "gram per centimeter cubed",
        abbreviation: "g\u2215cm3",
        rate: 1.00000
      },
      {
        name: "pound per gallon",
        abbreviation: "lb\u2215gal",
        rate: 8.34540
      }
    
];




// Event Listeners

densityBtn.addEventListener("click", densityBtnClick);

function densityBtnClick(event) {
  btnArray_4.forEach(function (element) {
    element.classList.remove("open");
});
  densityBtn.classList.toggle("open");
}




function setNewBaseDensityUnit(newBaseDensityUnitLI) {
    newBaseDensityUnitLI.classList.add("base-density-unit");
    baseDensityUnit = newBaseDensityUnitLI.id;
    const baseDensityUnitRate = densityUnits.find(densityUnit => densityUnit.abbreviation===baseDensityUnit).rate;
    densityUnitList.querySelectorAll(".density-unit").forEach(densityUnitLI => {
      const densityUnitRate = densityUnits.find(densityUnit => densityUnit.abbreviation===densityUnitLI.id).rate;
      const exchangeRate = densityUnitLI.id===baseDensityUnit ? 1 : (densityUnitRate/baseDensityUnitRate).toPrecision(6);
  //    densityUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseDensityUnit} = ${exchangeRate} ${densityUnitLI.id}`;
    });
  }
  
  densityUnitList.addEventListener("input", densityUnitListInputChange);
  
  function densityUnitListInputChange(event) {
    const isNewBaseDensityUnit = event.target.closest("li").id!==baseDensityUnit;
    if(isNewBaseDensityUnit) {
      densityUnitList.querySelector(`#${baseDensityUnit}`).classList.remove("base-density-unit");
      setNewBaseDensityUnit(event.target.closest("li"));
    }
    const newBaseDensityUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseDensityUnitAmount!==newBaseDensityUnitAmount || isNewBaseDensityUnit) {
      baseDensityUnitAmount = newBaseDensityUnitAmount;
      const baseDensityUnitRate = densityUnits.find(densityUnit => densityUnit.abbreviation===baseDensityUnit).rate;
      densityUnitList.querySelectorAll(".density-unit").forEach(densityUnitLI => {
        if(densityUnitLI.id!==baseDensityUnit) {
        const densityUnitRate = densityUnits.find(densityUnit => densityUnit.abbreviation===densityUnitLI.id).rate;
        const exchangeRate = densityUnitLI.id===baseDensityUnit ? 1 : (densityUnitRate/baseDensityUnitRate).toPrecision(6);
        densityUnitLI.querySelector(".input input").value = exchangeRate*baseDensityUnitAmount!==0 ? (exchangeRate*baseDensityUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  densityUnitList.addEventListener("focusout", densityUnitsListFocusOut);
  
  function densityUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  densityUnitList.addEventListener("keydown", densityUnitsListKeyDown);
  
  function densityUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateDensityUnitList() {
      for(let i=0; i<initiallyDisplayedDensityUnits.length; i++) {
          const densityUnit = densityUnits.find(c => c.abbreviation===initiallyDisplayedDensityUnits[i]);
          if(densityUnit) newDensityUnitListItem(densityUnit);
      }
  }
  
  function newDensityUnitListItem(densityUnit) {
      if(densityUnitList.childElementCount===0) {
          baseDensityUnit = densityUnit.abbreviation;
          baseDensityUnitAmount = 0;
      }
  
      const baseDensityUnitRate = densityUnits.find(c => c.abbreviation===baseDensityUnit).rate;
      const exchangeRate = densityUnit.abbreviation===baseDensityUnit ? 1 : (densityUnit.rate/baseDensityUnitRate).toPrecision(6);
      const inputValue = baseDensityUnitAmount ? (baseDensityUnitAmount*exchangeRate).toPrecision(6) : "";
  
      densityUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="density-unit ${densityUnit.abbreviation===baseDensityUnit ? "density-unit" : ""}" id=${densityUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="density-unit-symbol">${densityUnit.abbreviation}</span></p>
                  <p class="density-unit-name"><!--${densityUnit.abbreviation} - ${densityUnit.name}--></p>
                  <p class="base-density-unit-rate"><!--${baseDensityUnit} = ${exchangeRate} ${densityUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateDensityUnitList();