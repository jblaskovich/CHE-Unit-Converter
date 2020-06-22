// Global Variables

const btnArray_18 = document.querySelectorAll("button");
const temperatureBtn = document.querySelector(".temperatureBtn");

const kelvinInput = document.querySelector("#kelvin > input");
const celsiusInput = document.querySelector("#celsius > input");
const rankineInput = document.querySelector("#rankine > input");
const fahreinheitInput = document.querySelector("#fahreinheit > input");

// Event Listeners

kelvinInput.addEventListener('input', kelvinToCelsiusAndRankineAndFahreinheit);

function kelvinToCelsiusAndRankineAndFahreinheit () {
  const kTemp = parseFloat(kelvinInput.value);
  const cTemp = kTemp - 273.15;
  const rTemp = 1.8 * kTemp;
  const fTemp = (9/5) *(kTemp-273.15) +32;
  celsiusInput.value = cTemp.toPrecision(6);
  rankineInput.value = rTemp.toPrecision(6);
  fahreinheitInput.value = fTemp.toPrecision(6);
};

celsiusInput.addEventListener('input', celsiusToKelvinAndRankineAndFahreinheit);

function celsiusToKelvinAndRankineAndFahreinheit () {
  const cTemp = parseFloat(celsiusInput.value);
  const kTemp = cTemp + 273.15;
  const rTemp = (cTemp + 273.15) *(9/5);
  const fTemp = (cTemp * (9/5)) + 32;
  kelvinInput.value = kTemp.toPrecision(6);
  rankineInput.value = rTemp.toPrecision(6);
  fahreinheitInput.value = fTemp.toPrecision(6);
};

rankineInput.addEventListener('input', rankineToKelvinAndCelsiusAndFahreinheit);

function rankineToKelvinAndCelsiusAndFahreinheit () {
  const rTemp = parseFloat(rankineInput.value);
  const kTemp = rTemp * (5/9)
  const cTemp = (rTemp - 491.67) * (5/9);
  const fTemp = rTemp - 459.67;
  kelvinInput.value = kTemp.toPrecision(6);
  celsiusInput.value = cTemp.toPrecision(6);
  fahreinheitInput.value = fTemp.toPrecision(6);
};

fahreinheitInput.addEventListener('input', fahreinheitToKelvinAndCelsiusAndRankine);

function fahreinheitToKelvinAndCelsiusAndRankine () {
  const fTemp = parseFloat(fahreinheitInput.value);
  const kTemp = (fTemp + 459.67) *(5/9);
  const cTemp = (fTemp - 32) *(5/9);
  const rTemp = fTemp + 459.67;
  kelvinInput.value = kTemp.toPrecision(6);
  celsiusInput.value = cTemp.toPrecision(6);
  rankineInput.value = rTemp.toPrecision(6);
};

temperatureBtn.addEventListener("click", temperatureBtnClick);

function temperatureBtnClick(event) {
  btnArray_18.forEach(function (element) {
    element.classList.remove("open");
});
  
  temperatureBtn.classList.toggle("open");
}

kelvinInput.addEventListener("focusout", absoluteTemperatureUnitsListFocusOut);
celsiusInput.addEventListener("focusout", absoluteTemperatureUnitsListFocusOut);
rankineInput.addEventListener("focusout", absoluteTemperatureUnitsListFocusOut);
fahreinheitInput.addEventListener("focusout", absoluteTemperatureUnitsListFocusOut);

function absoluteTemperatureUnitsListFocusOut(event) {
  const inputValue = event.target.value;
  if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
  else event.target.value = Number(inputValue).toPrecision(6);
}

kelvinInput.addEventListener("keydown", absoluteTemperatureUnitsListKeyDown);
celsiusInput.addEventListener("keydown", absoluteTemperatureUnitsListKeyDown);
rankineInput.addEventListener("keydown", absoluteTemperatureUnitsListKeyDown);
fahreinheitInput.addEventListener("keydown", absoluteTemperatureUnitsListKeyDown);

function absoluteTemperatureUnitsListKeyDown(event) {
  if(event.key==="Enter") event.target.blur();
}

  // Auxilary Functions

