import ApexCharts from "apexcharts";
import { CategoryRadialChartOptions } from "../classes/Charts";

const dietForm = document.getElementById("diet-form");
const farmingForm = document.getElementById("farming-form");

function planetImpactScore(diet, calories) {
  // Object for raw scores
  let scores = {
    "Meat-heavy": 100,
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
  document.getElementById("diet-result").innerText = `${score.toFixed(2)}%`;

  dietChart.updateSeries([score]);
}

async function calcFarmingImpact() {
  const shopLocal = document.getElementById("local").checked;
}

dietForm.addEventListener("submit", calcDietImpact);
farmingForm.addEventListener("submit", calcFarmingImpact);

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
