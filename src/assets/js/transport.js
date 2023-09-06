// USE THIS AS A BASE MODULE FOR OTHER INPUT CALCULATIONS
import ApexCharts from "apexcharts";
import { getPercentInRelationToAverage } from "../../helpers/math";
import {
  defaultBarChartOptions,
  defaultRadialOptions,
} from "../classes/Charts";

const transportForm = document.getElementById("transportForm");
const kilometers = document.getElementById("kilometers");
// const flightDataForm = document.getElementById("flightDataForm");
const transportResultLabel = document.getElementById("transport-result");

function logFLight(e) {
  e.preventDefault(); // Prevent form submission

  // Get the values from the form
  const totalFlights = parseInt(document.getElementById("totalFlights").value);
  const estimatedDistance = parseInt(
    document.getElementById("estimatedDistance").value
  );

  const result = estimatedDistance * (totalFlights / 4);

  console.log("result in tonnes", result);
}

// flightDataForm.addEventListener("submit", logFLight);

const DUMMY_DATA = {
  // this is the average milage/carbon per week of a car
  averageKM: 327,
  averageFlights: 6.5,
  averageFlightKM: 14500,
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

  let percentOfCarKM = getPercentInRelationToAverage(
    totalKilometers,
    DUMMY_DATA.averageKM
  );

  let color;
  //   percentOfCarKM > 100 ? (color = "#FF0000") : (color = "#569ef9");

  // change color if over 100
  percentOfCarKM > 100 ? (color = "#FF0000") : (color = "#00E396");

  // avoid strange css behaviour of over 100% on chart
  percentOfCarKM > 100 ? (percentOfCarKM = 100) : percentOfCarKM;

  chart.updateOptions({
    series: [percentOfCarKM.toFixed(2)],
  });

  transportResultLabel.innerText = `${percentOfCarKM.toFixed(2)}%`;

  const data = {
    totalKilometers,
  };

  console.log(data);

  console.log(totalKilometers);
}

transportForm.addEventListener("submit", logData);

// const radialChart = new ApexCharts(
//   document.querySelector("#chart"),
//   radialOptions
// );
// radialChart.render();

var options = {
  series: [0],
  colors: ["#009FFD"],
  chart: {
    height: 250,
    type: "radialBar",
    // toolbar: {
    //   show: true,
    // },
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 225,
      hollow: {
        margin: 0,
        size: "70%",
        background: "#fff",
        image: undefined,
        imageOffsetX: 0,
        imageOffsetY: 0,
        position: "front",
        dropShadow: {
          enabled: true,
          top: 3,
          left: 0,
          blur: 4,
          opacity: 0.24,
        },
      },
      track: {
        background: "#fff",
        strokeWidth: "67%",
        margin: 0,
        dropShadow: {
          enabled: true,
          top: -3,
          left: 0,
          blur: 4,
          opacity: 0.35,
        },
      },

      dataLabels: {
        show: true,
        name: {
          // offsetY: -10,
          show: false,
          // color: "#888",
          // fontSize: "17px",
        },
        value: {
          formatter: function (val, i) {
            return parseInt(val) + "%";
          },
          color: "#111",
          fontSize: "36px",
          show: false,
        },
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "horizontal",
      shadeIntensity: 0.5,
      gradientToColors: ["#5200AE"],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
  stroke: {
    lineCap: "round",
  },
  labels: ["Percent"],
};

const chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

// const chart2 = new ApexCharts(
//   document.querySelector("#chart2"),
//   defaultRadialOptions
// );
// chart2.render();
