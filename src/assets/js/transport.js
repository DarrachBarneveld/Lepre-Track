// USE THIS AS A BASE MODULE FOR OTHER INPUT CALCULATIONS

import { getPercentInRelationToAverage } from "../../helpers/math";

const transportForm = document.getElementById("transportForm");
const kilometers = document.getElementById("kilometers");

const DUMMY_DATA = {
  // this is the average carbon per week of a car
  averageKM: 327,
};

function logData(e) {
  e.preventDefault();

  const totalKilometers = kilometers.value;

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
