// USE THIS AS A BASE MODULE FOR OTHER INPUT CALCULATIONS
import ApexCharts from "apexcharts";
import { checkAuthState, getUserData, removeLoader } from "./auth";
import { User } from "../classes/User";
import { doc, updateDoc } from "@firebase/firestore";
import { firebaseDB } from "../../config/firebase";
import { CategoryRadialChartOptions } from "../classes/Charts";

const recyclingForm = document.getElementById("recyclingForm");
const volunteerForm = document.getElementById("volunteerForm");

// Recycling
const metalCheck = document.getElementById("metalCheck");
const paperCheck = document.getElementById("paperCheck");
const plasticCheck = document.getElementById("plasticCheck");
const glassCheck = document.getElementById("glassCheck");
const foodCheck = document.getElementById("foodCheck");
const recyclingResult = document.getElementById("recycling-result");

// Volunteering
const trees = document.getElementById("trees");
const gardens = document.getElementById("gardens");
const wildlife = document.getElementById("wildlife");
const ocean = document.getElementById("ocean");
const other = document.getElementById("other");
const donation = document.getElementById("donation");
const volunteerResult = document.getElementById("volunteer-result");

let activeUser;
let userClass;

async function init() {
  activeUser = await checkAuthState();
  if (!activeUser) return (window.location.href = "/");
  removeLoader();

  const userData = await getUserData(activeUser);

  userClass = new User(userData);

  console.log(userClass);

  const profileIcon = document.getElementById("profile");
  profileIcon.innerHTML = `<i class="fa-solid fa-user"></i> ${userData.name}`;
  renderStoredData();
}

function renderStoredData() {
  // RECYCLING
  metalCheck.checked = userClass.community.recycle.metal;
  paperCheck.checked = userClass.community.recycle.paper;
  plasticCheck.checked = userClass.community.recycle.plastic;
  glassCheck.checked = userClass.community.recycle.glass;
  foodCheck.checked = userClass.community.recycle.food;

  recyclingResult.innerText = `${userClass.community.recycle.score}%`;

  const recycleScore = userClass.community.recycle.score;

  const recyclePercent = recycleScore > 100 ? 100 : recycleScore;

  recyclingChart.updateSeries([recyclePercent]);

  // VOLUNTEERING
  trees.checked = userClass.community.volunteer.tree;
  gardens.checked = userClass.community.volunteer.gardens;
  wildlife.checked = userClass.community.volunteer.wildlife;
  ocean.checked = userClass.community.volunteer.ocean;
  other.checked = userClass.community.volunteer.other;
  donation.value = userClass.community.volunteer.donation;

  const volunteerScore = userClass.community.volunteer.score;

  const volunteerPercent = volunteerScore > 100 ? 100 : volunteerScore;

  volunteerChart.updateSeries([volunteerPercent]);

  volunteerResult.innerText = `${volunteerScore}%`;
}

init();

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
    recyclingResult.innerHTML =
      '108.9 kg <span class="text-muted">(No Recycling)</span>';
  } else {
    recyclingResult.innerText = `${(
      DUMMY_DATA.averageTotalCo2 - co2Savings
    ).toFixed(2)} kg`;
  }

  recyclingChart.updateOptions({
    series: [((DUMMY_DATA.averageTotalCo2 - co2Savings) / 1.089).toFixed(2)],
  });

  const data = {
    metal: metalCheck.checked,
    paper: paperCheck.checked,
    plastic: plasticCheck.checked,
    glass: glassCheck.checked,
    food: foodCheck.checked,
    score: ((DUMMY_DATA.averageTotalCo2 - co2Savings) / 1.089).toFixed(2),
  };

  updateFireBase(data, "community", "recycle");
}

function calcVolunteerPercent({
  treeValue,
  gardensValue,
  wildlifeValue,
  oceanValue,
  otherValue,
  donationValue,
}) {
  let value = 0;

  treeValue ? (value += 20) : value;
  gardensValue ? (value += 20) : value;
  wildlifeValue ? (value += 20) : value;
  oceanValue ? (value += 20) : value;
  otherValue ? (value += 20) : value;

  const donationPercent = donationValue > 100 ? 100 : donationValue;

  return value + +donationPercent;
}

async function volunteerCarbonCalc(e) {
  e.preventDefault(); // Prevent form submission

  const treeValue = trees.checked;
  const gardensValue = gardens.checked;
  const wildlifeValue = wildlife.checked;
  const oceanValue = ocean.checked;
  const otherValue = other.checked;
  const donationValue = donation.value;

  const dataValues = {
    treeValue,
    gardensValue,
    wildlifeValue,
    oceanValue,
    otherValue,
    donationValue,
  };

  const truePercent = calcVolunteerPercent(dataValues);

  let percent = truePercent > 100 ? 100 : truePercent;

  volunteerChart.updateOptions({
    series: [percent.toFixed(2)],
  });
  volunteerResult.innerText = `${truePercent}%`;

  const data = {
    tree: treeValue,
    gardens: gardensValue,
    wildlife: wildlifeValue,
    ocean: oceanValue,
    other: otherValue,
    donation: donationValue,
    score: truePercent,
  };
  updateFireBase(data, "community", "volunteer");
}

async function updateFireBase(data, category, prop) {
  const userRef = doc(firebaseDB, "users", activeUser.uid);

  const userData = await getUserData(activeUser);

  userData[category][prop] = data;
  updateDoc(userRef, userData);
}

recyclingForm.addEventListener("submit", recyclingCarbonCalc);
volunteerForm.addEventListener("submit", volunteerCarbonCalc);

const recyclingChartOptions = new CategoryRadialChartOptions(
  [0],

  ["#63D471", "#378B29"]
);

const recyclingChart = new ApexCharts(
  document.getElementById("recyclingChart"),
  recyclingChartOptions
);
recyclingChart.render();

const volunteerChartOptions = new CategoryRadialChartOptions(
  [0],

  ["#009FFD", "#5200AE"]
);

const volunteerChart = new ApexCharts(
  document.getElementById("volunteerChart"),
  volunteerChartOptions
);
volunteerChart.render();
