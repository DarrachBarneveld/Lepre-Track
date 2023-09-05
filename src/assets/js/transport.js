// USE THIS AS A BASE MODULE FOR OTHER INPUT CALCULATIONS
import ApexCharts from "apexcharts";
import { getPercentInRelationToAverage } from "../../helpers/math";
import {
  defaultBarChartOptions,
  defaultRadialOptions,
} from "../classes/Charts";

const transportForm = document.getElementById("transportForm");
const kilometers = document.getElementById("kilometers");

const DUMMY_DATA = {
  // this is the average milage/carbon per week of a car
  averageKM: 327,
};

// Electric Car - 60% emissions "Source: EDF Energy"
// Hybrid Car - 40% emissions "Source: EDF Energy"

async function logData(e) {
  e.preventDefault();

  const selectedCarType = document.querySelector(
    'input[name="carType"]:checked'
  );

  const selectedCarYear = document.querySelector(
    'input[name="carYear"]:checked'
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

  if (selectedCarYear) {
    const carYearValue = selectedCarYear.value;
    console.log(carYearValue);

    if (carYearValue === "before") {
      // Double carbon for older cars
      totalKilometers *= 2;
    }
  }

  const percentOfCarKM = getPercentInRelationToAverage(
    totalKilometers,
    DUMMY_DATA.averageKM
  );

  let color;
  //   percentOfCarKM > 100 ? (color = "#FF0000") : (color = "#569ef9");

  percentOfCarKM > 100 ? (color = "#FF0000") : (color = "#00E396");

  //   chart.updateOptions({
  //     series: [percentOfCarKM / 2, options.series[1]],
  //     colors: [color, options.colors[1]],
  //   });

  chart.updateOptions({
    series: [
      {
        name: "You",
        data: [
          {
            x: "Car",
            y: totalKilometers.toFixed(2),
            goals: [
              {
                name: "Average",
                value: 367,
                strokeHeight: 5,
                strokeColor: "#775DD0",
              },
            ],
          },
        ],
      },
    ],
    colors: [color, defaultBarChartOptions.colors[1]],
  });

  const data = {
    totalKilometers,
  };

  console.log(data);
}

transportForm.addEventListener("submit", logData);

// const radialChart = new ApexCharts(
//   document.querySelector("#chart"),
//   radialOptions
// );
// radialChart.render();

const chart = new ApexCharts(
  document.querySelector("#chart"),
  defaultBarChartOptions
);
chart.render();
