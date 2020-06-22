
// Global Variables

const btnArray_14 = document.querySelectorAll("button");
const massBtn = document.querySelector(".massBtn");
const addMassConvList = document.querySelector(".add-mass-unit-list");
const massUnitList = document.querySelector(".massConversions");



//default initially displayed massUnits
const initiallyDisplayedMassUnits = ["kg", "lb", "g", "tonne", "ounce", "ton","slug"];
let baseMassUnit;
let baseMassUnitAmount;

const massUnits = [
    {
        name: "kilogram",
        abbreviation: "kg",
        rate: 1
    },
    {
        name: "pound",
        abbreviation: "lb",
        rate: 2.20462
      },
      {
        name: "gram",
        abbreviation: "g",
        rate: 1000.0000
      },
      {
        name: "tonne",
        abbreviation: "tonne",
        rate: 1.00000e-03
      },
      {
        name: "ounce",
        abbreviation: "ounce",
        rate: 35.27396
      },
      {
        name: "ton",
        abbreviation: "ton",
        rate: 1.10231e-03
      },
      {
        name: "slug",
        abbreviation: "slug",
        rate: 6.85218e-02
      },
    
];


// Event Listeners

massBtn.addEventListener("click", massBtnClick);

function massBtnClick(event) {
  btnArray_14.forEach(function (element) {
    element.classList.remove("open");
});
  massBtn.classList.toggle("open")
};
  
function setNewBaseMassUnit(newBaseMassUnitLI) {
  newBaseMassUnitLI.classList.add("base-mass-unit");
  baseMassUnit = newBaseMassUnitLI.id;
  const baseMassUnitRate = massUnits.find(massUnit => massUnit.abbreviation===baseMassUnit).rate;
  massUnitList.querySelectorAll(".mass-unit").forEach(massUnitLI => {
    const massUnitRate = massUnits.find(massUnit => massUnit.abbreviation===massUnitLI.id).rate;
    const exchangeRate = massUnitLI.id===baseMassUnit ? 1 : (massUnitRate/baseMassUnitRate).toPrecision(6);
//    massUnitLI.querySelector(".base-mass-unit-rate").textContent = `${baseMassUnit} = ${exchangeRate} ${massUnitLI.id}`;
  });
}

massUnitList.addEventListener("input", massUnitListInputChange);

function massUnitListInputChange(event) {
  const isNewBaseMassUnit = event.target.closest("li").id!==baseMassUnit;
  if(isNewBaseMassUnit) {
    massUnitList.querySelector(`#${baseMassUnit}`).classList.remove("base-mass-unit");
    setNewBaseMassUnit(event.target.closest("li"));
  }
  const newBaseMassUnitAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
  if(baseMassUnitAmount!==newBaseMassUnitAmount || isNewBaseMassUnit) {
    baseMassUnitAmount = newBaseMassUnitAmount;
    const baseMassUnitRate = massUnits.find(massUnit => massUnit.abbreviation===baseMassUnit).rate;
    massUnitList.querySelectorAll(".mass-unit").forEach(massUnitLI => {
      if(massUnitLI.id!==baseMassUnit) {
      const massUnitRate = massUnits.find(massUnit => massUnit.abbreviation===massUnitLI.id).rate;
      const exchangeRate = massUnitLI.id===baseMassUnit ? 1 : (massUnitRate/baseMassUnitRate).toPrecision(6);
      massUnitLI.querySelector(".input input").value = exchangeRate*baseMassUnitAmount!==0 ? (exchangeRate*baseMassUnitAmount).toPrecision(6) : "";
      }
    });

  }
}

massUnitList.addEventListener("focusout", massUnitsListFocusOut);

function massUnitsListFocusOut(event) {
  const inputValue = event.target.value;
  if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
  else event.target.value = Number(inputValue).toPrecision(6);
}

massUnitList.addEventListener("keydown", massUnitsListKeyDown);

function massUnitsListKeyDown(event) {
  if(event.key==="Enter") event.target.blur();
}

// Auxilary Functions

function populateMassUnitList() {
    for(let i=0; i<initiallyDisplayedMassUnits.length; i++) {
        const massUnit = massUnits.find(c => c.abbreviation===initiallyDisplayedMassUnits[i]);
        if(massUnit) newMassUnitListItem(massUnit);
    }
}

function newMassUnitListItem(massUnit) {
    if(massUnitList.childElementCount===0) {
        baseMassUnit = massUnit.abbreviation;
        baseMassUnitAmount = 0;
    }

    const baseMassUnitRate = massUnits.find(c => c.abbreviation===baseMassUnit).rate;
    const exchangeRate = massUnit.abbreviation===baseMassUnit ? 1 : (massUnit.rate/baseMassUnitRate).toPrecision(6);
    const inputValue = baseMassUnitAmount ? (baseMassUnitAmount*exchangeRate).toPrecision(6) : "";

    massUnitList.insertAdjacentHTML(
        "beforeend",
        `<li class="mass-unit ${massUnit.abbreviation===baseMassUnit ? "base-mass-unit" : ""}" id=${massUnit.abbreviation}>
            <div class="info">
                <p class="input"><input placeholder="0.0000" value=${inputValue}><span class="mass-unit-symbol">${massUnit.abbreviation}</span></p>
                <p class="mass-unit-name"><!--${massUnit.abbreviation} - ${massUnit.name}--></p>
                <p class="base-mass-unit-rate"><!--${baseMassUnit} = ${exchangeRate} ${massUnit.abbreviation}--></p>
            </div>
        </li>`
    );
}




populateMassUnitList();