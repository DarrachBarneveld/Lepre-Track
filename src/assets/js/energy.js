import ApexCharts from "apexcharts";
import { checkAuthState, getUserData, removeLoader } from "./auth";
import { CategoryRadialChartOptions } from "../classes/Charts";

import { User } from "../classes/User";
import { doc, updateDoc } from "@firebase/firestore";
import { firebaseDB } from "../../config/firebase";

let average_house = 4;

let activeUser;
let userClass;

const energyResult = document.getElementById("energy-result");

async function init() {
  activeUser = await checkAuthState();

  console.log(activeUser);
  if (!activeUser) return (window.location.href = "/");
  removeLoader();

  const userData = await getUserData(activeUser);

  userClass = new User(userData);
  const profileIcon = document.getElementById("profile");
  profileIcon.innerHTML = `<i class="fa-solid fa-user"></i> ${userData.name}`;

  renderStoredData();
}

init();

function renderStoredData() {
  // DIET

  const energyScore =
    userClass.energy.energy.score > 100 ? 100 : userClass.energy.energy.score;

  energyResult.innerHTML = `${userClass.energy.energy.score}%`;

  energyChart.updateSeries([energyScore]);
}

const energyForm = document.getElementById("energyForm");

energyForm.addEventListener("submit", data);

let inputs = document.querySelectorAll("input");

function data(e) {
  e.preventDefault();

  inputs.forEach((element) => {
    if (element.length === 0) {
      element.value = 0;
    }
  });
  let factor = +energyForm.factor.value;
  let electricity_input = +energyForm.elec.value;
  let gas_input = +energyForm.gas.value;
  let oil_input = +energyForm.oil.value;
  let coal_input = +energyForm.coal.value;
  let lpg_input = +energyForm.lpg.value;
  let propane_input = +energyForm.propane.value;
  let wood_input = +energyForm.wood.value;
  let array = [];
  array.push(kgToTonnes(electricity_input * factor));
  array.push(kgToTonnes(gas_input * 0.183));
  array.push(kgToTonnes(oil_input * 2.54047619047619));
  array.push(coal_input * 2.883259523809524);
  array.push(kgToTonnes(lpg_input * 1.557142857142857));
  array.push(kgToTonnes(propane_input * 1.542857142857143));
  array.push(wood_input * 0.0505547619047619);
  let a = addNumbers(array);

  const data = {
    electric: electricity_input,
    gas: gas_input,
    oil: oil_input,
    coal: coal_input,
    lpg: lpg_input,
    propane: propane_input,
    wood: wood_input,
    factor,
    score: a,
  };

  updateFireBase(data, "energy", "energy");

  a > 100 ? 100 : a;

  energyChart.updateSeries([a]);

  return a;
}
function kgToTonnes(number) {
  number = +number;
  let tonnes = number / 1000;
  tonnes = Number.parseFloat(tonnes).toFixed(2);
  return +tonnes;
}

function addNumbers(numbers) {
  let sum = numbers.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  return +sum.toFixed(2);
}

const energyChartOptions = new CategoryRadialChartOptions(
  [100],

  ["#F07654", "#F5DF2E"]
);

const energyChart = new ApexCharts(
  document.getElementById("energyChart"),
  energyChartOptions
);
energyChart.render();

async function updateFireBase(data, category, prop) {
  const userRef = doc(firebaseDB, "users", activeUser.uid);

  const userData = await getUserData(activeUser);

  userData[category][prop] = data;
  updateDoc(userRef, userData);
}
