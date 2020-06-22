

// Global Variabl es

const btnArray_5 = document.querySelectorAll("button");
const diffusivityBtn = document.querySelector(".diffusivityBtn");
const addDiffusivityConvList = document.querySelector(".add-diffusivity-unit-list");
const diffusivityUnitList = document.querySelector(".diffusivityConversions");

//default initially displayed diffusivityUnits
const initiallyDisplayedDiffusivityUnits = ["m2\u2215s", "ft2\u2215s", "stokes", "cS", "ft2\u2215hr", "in2\u2215s"];
let baseDiffusivityUnit;
let baseDiffusivityUnitAmount;

const diffusivityUnits = [
  {
    name: "meters squared per second",
    abbreviation: "m2\u2215s",
    rate: 1.00000e-04
},
{
    name: "feets squared per second",
    abbreviation: "ft2\u2215s",
    rate: 1.07639e-03
  },
  {
    name: "stokes",
    abbreviation: "stokes",
    rate: 1.00000
  },
  {
    name: "centistokes",
    abbreviation: "cS",
    rate: 100.00000
  },
  {
    name: "feet squared per hour",
    abbreviation: "ft2\u2215hr",
    rate: 3.87501
  },
  {
    name: "inch squared per second",
    abbreviation: "in2\u2215s",
    rate: 0.15500
  }
    
];




// Event Listeners

diffusivityBtn.addEventListener("click", diffusivityBtnClick);

function diffusivityBtnClick(event) {
  btnArray_5.forEach(function (element) {
    element.classList.remove("open");
});
  diffusivityBtn.classList.toggle("open");
}




function setNewBaseDiffusivityUnit(newBaseDiffusivityUnitLI) {
    newBaseDiffusivityUnitLI.classList.add("base-diffusivity-unit");
    baseDiffusivityUnit = newBaseDiffusivityUnitLI.id;
    const baseDiffusivityUnitRate = diffusivityUnits.find(diffusivityUnit => diffusivityUnit.abbreviation===baseDiffusivityUnit).rate;
    diffusivityUnitList.querySelectorAll(".diffusivity-unit").forEach(diffusivityUnitLI => {
      const diffusivityUnitRate = diffusivityUnits.find(diffusivityUnit => diffusivityUnit.abbreviation===diffusivityUnitLI.id).rate;
      const exchangeRate = diffusivityUnitLI.id===baseDiffusivityUnit ? 1 : (diffusivityUnitRate/baseDiffusivityUnitRate).toPrecision(6);
  //    diffusivityUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseDiffusivityUnit} = ${exchangeRate} ${diffusivityUnitLI.id}`;
    });
  }
  
  diffusivityUnitList.addEventListener("input", diffusivityUnitListInputChange);
  
  function diffusivityUnitListInputChange(event) {
    const isNewBaseDiffusivityUnit = event.target.closest("li").id!==baseDiffusivityUnit;
    if(isNewBaseDiffusivityUnit) {
      diffusivityUnitList.querySelector(`#${baseDiffusivityUnit}`).classList.remove("base-diffusivity-unit");
      setNewBaseDiffusivityUnit(event.target.closest("li"));
    }
    const newBaseDiffusivityUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseDiffusivityUnitAmount!==newBaseDiffusivityUnitAmount || isNewBaseDiffusivityUnit) {
      baseDiffusivityUnitAmount = newBaseDiffusivityUnitAmount;
      const baseDiffusivityUnitRate = diffusivityUnits.find(diffusivityUnit => diffusivityUnit.abbreviation===baseDiffusivityUnit).rate;
      diffusivityUnitList.querySelectorAll(".diffusivity-unit").forEach(diffusivityUnitLI => {
        if(diffusivityUnitLI.id!==baseDiffusivityUnit) {
        const diffusivityUnitRate = diffusivityUnits.find(diffusivityUnit => diffusivityUnit.abbreviation===diffusivityUnitLI.id).rate;
        const exchangeRate = diffusivityUnitLI.id===baseDiffusivityUnit ? 1 : (diffusivityUnitRate/baseDiffusivityUnitRate).toPrecision(6);
        diffusivityUnitLI.querySelector(".input input").value = exchangeRate*baseDiffusivityUnitAmount!==0 ? (exchangeRate*baseDiffusivityUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  diffusivityUnitList.addEventListener("focusout", diffusivityUnitsListFocusOut);
  
  function diffusivityUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  diffusivityUnitList.addEventListener("keydown", diffusivityUnitsListKeyDown);
  
  function diffusivityUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateDiffusivityUnitList() {
      for(let i=0; i<initiallyDisplayedDiffusivityUnits.length; i++) {
          const diffusivityUnit = diffusivityUnits.find(c => c.abbreviation===initiallyDisplayedDiffusivityUnits[i]);
          if(diffusivityUnit) newDiffusivityUnitListItem(diffusivityUnit);
      }
  }
  
  function newDiffusivityUnitListItem(diffusivityUnit) {
      if(diffusivityUnitList.childElementCount===0) {
          baseDiffusivityUnit = diffusivityUnit.abbreviation;
          baseDiffusivityUnitAmount = 0;
      }
  
      const baseDiffusivityUnitRate = diffusivityUnits.find(c => c.abbreviation===baseDiffusivityUnit).rate;
      const exchangeRate = diffusivityUnit.abbreviation===baseDiffusivityUnit ? 1 : (diffusivityUnit.rate/baseDiffusivityUnitRate).toPrecision(6);
      const inputValue = baseDiffusivityUnitAmount ? (baseDiffusivityUnitAmount*exchangeRate).toPrecision(6) : "";
  
      diffusivityUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="diffusivity-unit ${diffusivityUnit.abbreviation===baseDiffusivityUnit ? "diffusivity-unit" : ""}" id=${diffusivityUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="diffusivity-unit-symbol">${diffusivityUnit.abbreviation}</span></p>
                  <p class="diffusivity-unit-name"><!--${diffusivityUnit.abbreviation} - ${diffusivityUnit.name}--></p>
                  <p class="base-diffusivity-unit-rate"><!--${baseDiffusivityUnit} = ${exchangeRate} ${diffusivityUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateDiffusivityUnitList();