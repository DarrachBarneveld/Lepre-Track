// USE THIS AS A BASE MODULE FOR OTHER INPUT CALCULATIONS
import ApexCharts from "apexcharts";
import { checkAuthState, getUserData, removeLoader } from "./auth";
import { User } from "../classes/User";
import { doc, updateDoc } from "@firebase/firestore";
import { firebaseDB } from "../../config/firebase";
import { CategoryRadialChartOptions } from "../classes/Charts";

const recyclingForm = document.getElementById("recyclingForm");
const metalCheck = document.getElementById("metalCheck");
const paperCheck = document.getElementById("paperCheck");
const plasticCheck = document.getElementById("plasticCheck");
const glassCheck = document.getElementById("glassCheck");
const foodCheck = document.getElementById("foodCheck");

const flightResultLabel = document.getElementById("flight-result");

let activeUser;
let userClass;

// async function init() {
//   activeUser = await checkAuthState();
//   removeLoader();

//   const userData = await getUserData(activeUser);

//   userClass = new User(userData);

//   const profileIcon = document.getElementById("profile");
//   profileIcon.innerHTML = `<i class="fa-solid fa-user"></i> ${userData.name}`;
//   renderStoredData();
// }

function renderStoredData() {}

// init();

const DUMMY_DATA = {
  averageMetalWaste: 6.3,
  averagePaperWaste: 19.4,
  averagePlasticWaste: 9 * 0.1,
  averageGlassWaste: 3.2,
  averageFoodWaste: 4.3,

  // below are the co2 saving per kg of material recycled
  recycledMetal: 8.1,
  recycledPaper: 0.4,
  recycledPlastic: 1.1,
  recycledGlass: 0.3,
  recycledFood: 0.2,

  // average total co2 emission from packaging & food waste
  averageTotalCo2: 108.9,
};

async function recyclingCarbonCalc(e) {
  e.preventDefault(); // Prevent form submission

  let co2Savings = 0;

  if (metalCheck.checked) {
    co2Savings += DUMMY_DATA.recycledMetal * DUMMY_DATA.averageMetalWaste;
  }
  if (paperCheck.checked) {
    co2Savings += DUMMY_DATA.recycledPaper * DUMMY_DATA.averagePaperWaste;
  }
  if (plasticCheck.checked) {
    co2Savings += DUMMY_DATA.recycledPlastic * DUMMY_DATA.averagePlasticWaste;
  }
  if (glassCheck.checked) {
    co2Savings += DUMMY_DATA.recycledGlass * DUMMY_DATA.averageGlassWaste;
  }
  if (foodCheck.checked) {
    co2Savings += DUMMY_DATA.recycledFood * DUMMY_DATA.averageFoodWaste;
  }

  if (co2Savings == 0) {
    flightResultLabel.innerHTML =
      '108.9 kg <span class="text-muted">(No Recycling)</span>';
  } else {
    flightResultLabel.innerText = `${(
      DUMMY_DATA.averageTotalCo2 - co2Savings
    ).toFixed(2)} kg`;
  }

  console.log(co2Savings);

  recyclingChart.updateOptions({
    series: [((DUMMY_DATA.averageTotalCo2 - co2Savings) / 1.089).toFixed(2)],
  });
}

async function updateFireBase(data, prop) {
  const userRef = doc(firebaseDB, "users", activeUser.uid);

  const userData = await getUserData(activeUser);

  userData.travel[prop] = data;
  updateDoc(userRef, userData);
}

recyclingForm.addEventListener("submit", recyclingCarbonCalc);

const recyclingChartOptions = new CategoryRadialChartOptions(
  [0],

  ["#63D471", "#378B29"]
);

const recyclingChart = new ApexCharts(
  document.getElementById("recyclingChart"),
  recyclingChartOptions
);
recyclingChart.render();
