// USE THIS AS A BASE MODULE FOR OTHER INPUT CALCULATIONS

import { getPercentInRelationToAverage } from "../../helpers/math";

const transportForm = document.getElementById("transportForm");
const kilometers = document.getElementById("kilometers");

const DUMMY_DATA = {
  // this is the average carbon per week of a car
  averageKM: 327,
};

// Electric Car - 60% emissions "Source: EDF Energy"
// Hybrid Car - 40% emissions "Source: EDF Energy"

async function logData(e) {
  e.preventDefault();

  const selectedCarType = document.querySelector(
    'input[name="carType"]:checked'
  );

  let totalKilometers = +kilometers.value;

  if (selectedCarType) {
    const carTypeValue = selectedCarType.value;

    if (carTypeValue === "electric") {
      // Reduce by 60% for Electric cars
      totalKilometers *= 0.4;
    }
    if (carTypeValue === "hybrid") {
      // Reduce by 40% for Hybrid cars
      totalKilometers *= 0.6;
    }
  }

  const percentOfCarKM = getPercentInRelationToAverage(
    totalKilometers,
    DUMMY_DATA.averageKM
  );

  console.log(percentOfCarKM);

  const data = {
    totalKilometers,
  };

  console.log(data);
}

transportForm.addEventListener("submit", logData);
