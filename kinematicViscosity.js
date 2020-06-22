

// Global Variables

const btnArray_12 = document.querySelectorAll("button");
const kinematicViscosityBtn = document.querySelector(".kinematicViscosityBtn");
const addKinematicViscosityConvList = document.querySelector(".add-kinematicViscosity-unit-list");
const kinematicViscosityUnitList = document.querySelector(".kinematicViscosityConversions");

//default initially displayed kinematicViscosityUnits
const initiallyDisplayedKinematicViscosityUnits = ["m2\u2215s", "ft2\u2215s", "stokes", "cS", "ft2\u2215hr", "in2\u2215s"];
let baseKinematicViscosityUnit;
let baseKinematicViscosityUnitAmount;

const kinematicViscosityUnits = [
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

kinematicViscosityBtn.addEventListener("click", kinematicViscosityBtnClick);

function kinematicViscosityBtnClick(event) {
  btnArray_12.forEach(function (element) {
    element.classList.remove("open");
});
  kinematicViscosityBtn.classList.toggle("open");
}




function setNewBaseKinematicViscosityUnit(newBaseKinematicViscosityUnitLI) {
    newBaseKinematicViscosityUnitLI.classList.add("base-kinematicViscosity-unit");
    baseKinematicViscosityUnit = newBaseKinematicViscosityUnitLI.id;
    const baseKinematicViscosityUnitRate = kinematicViscosityUnits.find(kinematicViscosityUnit => kinematicViscosityUnit.abbreviation===baseKinematicViscosityUnit).rate;
    kinematicViscosityUnitList.querySelectorAll(".kinematicViscosity-unit").forEach(kinematicViscosityUnitLI => {
      const kinematicViscosityUnitRate = kinematicViscosityUnits.find(kinematicViscosityUnit => kinematicViscosityUnit.abbreviation===kinematicViscosityUnitLI.id).rate;
      const exchangeRate = kinematicViscosityUnitLI.id===baseKinematicViscosityUnit ? 1 : (kinematicViscosityUnitRate/baseKinematicViscosityUnitRate).toPrecision(6);
  //    kinematicViscosityUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseKinematicViscosityUnit} = ${exchangeRate} ${kinematicViscosityUnitLI.id}`;
    });
  }
  
  kinematicViscosityUnitList.addEventListener("input", kinematicViscosityUnitListInputChange);
  
  function kinematicViscosityUnitListInputChange(event) {
    const isNewBaseKinematicViscosityUnit = event.target.closest("li").id!==baseKinematicViscosityUnit;
    if(isNewBaseKinematicViscosityUnit) {
      kinematicViscosityUnitList.querySelector(`#${baseKinematicViscosityUnit}`).classList.remove("base-kinematicViscosity-unit");
      setNewBaseKinematicViscosityUnit(event.target.closest("li"));
    }
    const newBaseKinematicViscosityUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if(baseKinematicViscosityUnitAmount!==newBaseKinematicViscosityUnitAmount || isNewBaseKinematicViscosityUnit) {
      baseKinematicViscosityUnitAmount = newBaseKinematicViscosityUnitAmount;
      const baseKinematicViscosityUnitRate = kinematicViscosityUnits.find(kinematicViscosityUnit => kinematicViscosityUnit.abbreviation===baseKinematicViscosityUnit).rate;
      kinematicViscosityUnitList.querySelectorAll(".kinematicViscosity-unit").forEach(kinematicViscosityUnitLI => {
        if(kinematicViscosityUnitLI.id!==baseKinematicViscosityUnit) {
        const kinematicViscosityUnitRate = kinematicViscosityUnits.find(kinematicViscosityUnit => kinematicViscosityUnit.abbreviation===kinematicViscosityUnitLI.id).rate;
        const exchangeRate = kinematicViscosityUnitLI.id===baseKinematicViscosityUnit ? 1 : (kinematicViscosityUnitRate/baseKinematicViscosityUnitRate).toPrecision(6);
        kinematicViscosityUnitLI.querySelector(".input input").value = exchangeRate*baseKinematicViscosityUnitAmount!==0 ? (exchangeRate*baseKinematicViscosityUnitAmount).toPrecision(6) : "";
        }
      });
  
    }
  }
  
  kinematicViscosityUnitList.addEventListener("focusout", kinematicViscosityUnitsListFocusOut);
  
  function kinematicViscosityUnitsListFocusOut(event) {
    const inputValue = event.target.value;
    if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
    else event.target.value = Number(inputValue).toPrecision(6);
  }
  
  kinematicViscosityUnitList.addEventListener("keydown", kinematicViscosityUnitsListKeyDown);
  
  function kinematicViscosityUnitsListKeyDown(event) {
    if(event.key==="Enter") event.target.blur();
  }
  
  // Auxilary Functions
  
  function populateKinematicViscosityUnitList() {
      for(let i=0; i<initiallyDisplayedKinematicViscosityUnits.length; i++) {
          const kinematicViscosityUnit = kinematicViscosityUnits.find(c => c.abbreviation===initiallyDisplayedKinematicViscosityUnits[i]);
          if(kinematicViscosityUnit) newKinematicViscosityUnitListItem(kinematicViscosityUnit);
      }
  }
  
  function newKinematicViscosityUnitListItem(kinematicViscosityUnit) {
      if(kinematicViscosityUnitList.childElementCount===0) {
          baseKinematicViscosityUnit = kinematicViscosityUnit.abbreviation;
          baseKinematicViscosityUnitAmount = 0;
      }
  
      const baseKinematicViscosityUnitRate = kinematicViscosityUnits.find(c => c.abbreviation===baseKinematicViscosityUnit).rate;
      const exchangeRate = kinematicViscosityUnit.abbreviation===baseKinematicViscosityUnit ? 1 : (kinematicViscosityUnit.rate/baseKinematicViscosityUnitRate).toPrecision(6);
      const inputValue = baseKinematicViscosityUnitAmount ? (baseKinematicViscosityUnitAmount*exchangeRate).toPrecision(6) : "";
  
      kinematicViscosityUnitList.insertAdjacentHTML(
          "beforeend",
          `<li class="kinematicViscosity-unit ${kinematicViscosityUnit.abbreviation===baseKinematicViscosityUnit ? "kinematicViscosity-unit" : ""}" id=${kinematicViscosityUnit.abbreviation}>
              <div class="info">
                  <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="kinematicViscosity-unit-symbol">${kinematicViscosityUnit.abbreviation}</span></p>
                  <p class="kinematicViscosity-unit-name"><!--${kinematicViscosityUnit.abbreviation} - ${kinematicViscosityUnit.name}--></p>
                  <p class="base-kinematicViscosity-unit-rate"><!--${baseKinematicViscosityUnit} = ${exchangeRate} ${kinematicViscosityUnit.abbreviation}--></p>
              </div>
          </li>`
      );
  }
  
  
  
  
  populateKinematicViscosityUnitList();