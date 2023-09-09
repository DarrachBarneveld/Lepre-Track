import ApexCharts from "apexcharts";
import { CategoryRadialChartOptions } from "../classes/Charts";
import { calculateInvertedPercentage } from "../../helpers/math";
import { checkAuthState, getUserData, removeLoader } from "./auth";
import { User } from "../classes/User";
import { doc, updateDoc } from "@firebase/firestore";
import { firebaseDB } from "../../config/firebase";

const dietForm = document.getElementById("diet-form");
const farmingForm = document.getElementById("farming-form");
const diningForm = document.getElementById("dining-form");

const diet = document.getElementById("diet");
const calories = document.getElementById("calories");

const shopLocal = document.getElementById("local");
const produce = document.getElementById("produce");
const organic = document.getElementById("organic");
const seasonal = document.getElementById("seasonal");
const crop = document.getElementById("crop");

const diningOut = document.getElementById("dineout");
const wasteFood = document.getElementById("waste");

const dietResultLabel = document.getElementById("diet-result");
const farmingResultLabel = document.getElementById("farming-result");
const diningResultLabel = document.getElementById("dining-result");

let activeUser;
let userClass;

async function init() {
  activeUser = await checkAuthState();
  if (!activeUser) return (window.location.href = "/");
  removeLoader();

  const userData = await getUserData(activeUser);

  userClass = new User(userData);

  renderStoredData();
  const profileIcon = document.getElementById("profile");
  profileIcon.innerHTML = `<i class="fa-solid fa-user"></i> ${userData.name}`;
}

function renderStoredData() {
  // DIET
  diet.value = userClass.food.diet.type;
  calories.value = userClass.food.diet.calories;
  dietResultLabel.innerText = `${userClass.food.diet.score.toFixed(2)}%`;

  const dietScore =
    userClass.food.diet.score > 100 ? 100 : userClass.food.diet.score;
  dietChart.updateSeries([dietScore]);

  // FARMING
  shopLocal.checked = userClass.food.farm.local;
  produce.value = userClass.food.farm.produce;
  organic.value = userClass.food.farm.organic;
  seasonal.checked = userClass.food.farm.seasonal;
  crop.checked = userClass.food.farm.crop;
  farmingResultLabel.innerText = `${userClass.food.farm.score.toFixed(2)}%`;

  const foodScore =
    userClass.food.diet.score > 100 ? 100 : userClass.food.diet.score;
  farmingChart.updateSeries([foodScore]);

  // DINING
  diningOut.checked = userClass.food.dining.out;
  wasteFood.checked = userClass.food.dining.waste;
  diningResultLabel.innerText = `${userClass.food.dining.score.toFixed(2)}%`;

  const diningScore =
    userClass.food.dining.score > 100 ? 100 : userClass.food.dining.score;
  diningChart.updateSeries([diningScore]);
}
init();

async function updateFireBase(data, category, prop) {
  const userRef = doc(firebaseDB, "users", activeUser.uid);

  const userData = await getUserData(activeUser);

  userData[category][prop] = data;
  updateDoc(userRef, userData);
}

function planetImpactScore(diet, calories) {
  // Object for raw scores
  let scores = {
    carnivore: 100,
    omnivore: 80.5,
    pescatarian: 62.5,
    vegetarian: 52.7,
    vegan: 40.2,
  };

  const irishNationalAverage = 2307;
  const score = (calories / irishNationalAverage) * scores[diet];

  return score;
}

async function calcDietImpact(e) {
  e.preventDefault();
  // Get user inputs
  let dietValue = diet.value;
  let caloriesValue = calories.value;

  // Calculate the score
  let score = planetImpactScore(dietValue, caloriesValue);
  const trueScore = score;

  score > 100 ? (score = 100) : score;

  // Display the result using .toFixed() method to round the score to two decimal places.
  dietResultLabel.innerText = `${trueScore.toFixed(2)}%`;

  const data = {
    type: dietValue,
    calories: caloriesValue,
    score: trueScore,
  };

  updateFireBase(data, "food", "diet");

  dietChart.updateSeries([score]);
}

function calcFarmingPercent({
  shopLocalValue,
  produceValue,
  organicValue,
  seasonalValue,
  cropValue,
}) {
  let value = 0;

  shopLocalValue ? (value += 20) : value;
  seasonalValue ? (value += 20) : value;
  cropValue ? (value += 20) : value;
  produceValue ? (value += (20 / 100) * produceValue) : value;
  organicValue ? (value += (20 / 100) * organicValue) : value;

  return value;
}

async function calcFarmingImpact(e) {
  e.preventDefault();
  const shopLocalValue = shopLocal.checked;
  const produceValue = parseInt(produce.value);
  const organicValue = parseInt(organic.value);
  const seasonalValue = seasonal.checked;
  const cropValue = crop.checked;

  const dataValues = {
    shopLocalValue,
    produceValue,
    organicValue,
    seasonalValue,
    cropValue,
  };

  const percent = calcFarmingPercent(dataValues);
  farmingResultLabel.innerHTML = `${percent.toFixed(2)}%`;
  farmingChart.updateSeries([percent]);

  const data = {
    local: shopLocalValue,
    produce: produceValue,
    organic: organicValue,
    seasonal: seasonalValue,
    crop: cropValue,
    score: calculateInvertedPercentage(percent),
  };

  updateFireBase(data, "food", "farm");
}

async function calcDiningImpact(e) {
  e.preventDefault();
  const foodWasteValue = wasteFood.checked;
  const dineOutValue = diningOut.checked;

  let value = 0;

  foodWasteValue ? (value += 50) : value;
  dineOutValue ? (value += 50) : value;

  diningResultLabel.innerHTML = `${value.toFixed(2)}%`;
  diningChart.updateSeries([value]);

  const data = {
    out: dineOutValue,
    waste: foodWasteValue,
    score: value,
  };

  updateFireBase(data, "food", "dining");

  return value;
}

dietForm.addEventListener("submit", calcDietImpact);
farmingForm.addEventListener("submit", calcFarmingImpact);
diningForm.addEventListener("submit", calcDiningImpact);

const dietChartOptions = new CategoryRadialChartOptions(
  [0],
  ["#FFBE3D", "#F06543"]
);

const dietChart = new ApexCharts(
  document.getElementById("dietChart"),
  dietChartOptions
);
dietChart.render();

const farmingChartOptions = new CategoryRadialChartOptions(
  [0],

  ["#63D471", "#378B29"]
);

const farmingChart = new ApexCharts(
  document.getElementById("farmingChart"),
  farmingChartOptions
);
farmingChart.render();

const diningChartOptions = new CategoryRadialChartOptions(
  [0],

  ["#A594F9", "#6247AA"]
);

const diningChart = new ApexCharts(
  document.getElementById("diningChart"),
  diningChartOptions
);
diningChart.render();

var options = {
  series: [
    {
      name: "Actual",
      data: [
        {
          x: "Tom",
          y: 126,
          goals: [
            {
              name: "Protector of Gaia",
              value: 200,
              strokeHeight: 5,
              strokeColor: "#FFD700",
            },
            {
              name: "GreenFingers",
              value: 150,
              strokeHeight: 5,
              strokeColor: "#4b7bff",
            },
            {
              name: "Average",
              value: 100,
              strokeHeight: 5,
              strokeColor: "#775DD0",
            },
            {
              name: "Destroyer Of Worlds",
              value: 25,
              strokeHeight: 5,
              strokeColor: "#FF0000",
            },
          ],
        },
      ],
    },
  ],
  chart: {
    height: 400,
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "60%",
    },
  },
  colors: ["#00E396"],
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    customLegendItems: [
      "Tom",
      "Destroyer Of Worlds",
      "Average",
      "GreenFingers",
      "Protector of Gaia",
    ],
    markers: {
      fillColors: ["#00E396", "#FF0000", "#775DD0", "#4b7bff", "#FFD700"],
    },
  },
};

var chart = new ApexCharts(document.querySelector("#totalChart"), options);
chart.render();
