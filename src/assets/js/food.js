import ApexCharts from "apexcharts";
import { CategoryRadialChartOptions } from "../classes/Charts";
import { calculateInvertedPercentage } from "../../helpers/math";

const dietForm = document.getElementById("diet-form");
const farmingForm = document.getElementById("farming-form");
const diningForm = document.getElementById("dining-form");

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

function planetImpactScore(diet, calories) {
  // Object for raw scores
  let scores = {
    Carnivore: 100,
    Omnivore: 80.5,
    Pescatarian: 62.5,
    Vegetarian: 52.7,
    Vegan: 40.2,
  };

  const irishNationalAverage = 2307;
  const score = (calories / irishNationalAverage) * scores[diet];

  return score;
}

async function calcDietImpact(e) {
  e.preventDefault();
  // Get user inputs
  let diet = document.getElementById("diet").value;
  let calories = document.getElementById("calories").value;

  // Calculate the score
  let score = planetImpactScore(diet, calories);
  const trueScore = score;

  score > 100 ? (score = 100) : score;

  // Display the result using .toFixed() method to round the score to two decimal places.
  dietResultLabel.innerText = `${trueScore.toFixed(2)}%`;

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

  return calculateInvertedPercentage(value);
}

async function calcFarmingImpact(e) {
  e.preventDefault();
  const shopLocalValue = shopLocal.checked;
  const produceValue = parseInt(produce.value);
  const organicValue = parseInt(organic.value);
  const seasonalValue = seasonal.checked;
  const cropValue = crop.checked;

  const data = {
    shopLocalValue,
    produceValue,
    organicValue,
    seasonalValue,
    cropValue,
  };

  const invertPercent = calcFarmingPercent(data);
  farmingResultLabel.innerHTML = `${invertPercent.toFixed(2)}%`;
  farmingChart.updateSeries([invertPercent]);
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

  ["#5F72BE", "#9921E8"]
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
