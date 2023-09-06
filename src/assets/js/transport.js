// USE THIS AS A BASE MODULE FOR OTHER INPUT CALCULATIONS
import ApexCharts from "apexcharts";
import { getPercentInRelationToAverage } from "../../helpers/math";
import {
  defaultBarChartOptions,
  defaultRadialOptions,
} from "../classes/Charts";

const transportForm = document.getElementById("transportForm");
const kilometers = document.getElementById("kilometers");
const flightForm = document.getElementById("flightForm");
const transportResultLabel = document.getElementById("transport-result");
const flightResultLabel = document.getElementById("flight-result");

function flightCarbonCalc(e) {
  e.preventDefault(); // Prevent form submission

  // Get the values from the form
  const totalFlights = parseInt(document.getElementById("numFlights").value);
  const estimatedDistance = parseInt(document.getElementById("flightKm").value);
  const selectedFlightClass = document.querySelector(
    'input[name="flightClass"]:checked'
  );

  let tonnesPerDistance = estimatedDistance * DUMMY_DATA.tonnesPerKM;

  if (selectedFlightClass) {
    const flightClass = selectedFlightClass.value;

    if (flightClass === "business") {
      // Multiple by 3 for Business Class
      tonnesPerDistance *= 3;
    }
    if (flightClass === "first") {
      // Multiple by 4 for First Class
      tonnesPerDistance *= 4;
    }
  }

  const totalFlightCalc = 1 + totalFlights / 5;

  tonnesPerDistance *= totalFlightCalc;
  console.log("result in tonnes", tonnesPerDistance.toFixed(2));

  const averageFlightCarbon =
    DUMMY_DATA.averageFlightKM * DUMMY_DATA.tonnesPerKM;

  let percentOfFlightKM = getPercentInRelationToAverage(
    tonnesPerDistance,
    averageFlightCarbon
  );

  flightResultLabel.innerText = `${percentOfFlightKM.toFixed(2)}%`;

  // avoid strange css behaviour of over 100% on chart
  percentOfFlightKM > 100 ? (percentOfFlightKM = 100) : percentOfFlightKM;

  flightChart.updateOptions({
    series: [percentOfFlightKM.toFixed(2)],
  });
}

flightForm.addEventListener("submit", flightCarbonCalc);

const DUMMY_DATA = {
  // this is the average milage/carbon per week of a car
  averageKM: 327,
  averageFlights: 6.5,
  averageFlightKM: 6850,
  tonnesPerKM: 0.0002582,
};

// Electric Car - 60% emissions "Source: EDF Energy"
// Hybrid Car - 40% emissions "Source: EDF Energy"

async function carCarbonCalc(e) {
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

    if (carYearValue === "before") {
      // Double carbon for older cars
      totalKilometers *= 2;
    }
  }

  let percentOfCarKM = getPercentInRelationToAverage(
    totalKilometers,
    DUMMY_DATA.averageKM
  );

  transportResultLabel.innerText = `${percentOfCarKM.toFixed(2)}%`;
  let color;
  //   percentOfCarKM > 100 ? (color = "#FF0000") : (color = "#569ef9");

  // change color if over 100
  percentOfCarKM > 100 ? (color = "#FF0000") : (color = "#00E396");

  // avoid strange css behaviour of over 100% on chart
  percentOfCarKM > 100 ? (percentOfCarKM = 100) : percentOfCarKM;

  carChart.updateOptions({
    series: [percentOfCarKM.toFixed(2)],
  });

  const data = {
    totalKilometers,
  };

  console.log(data);
}

transportForm.addEventListener("submit", carCarbonCalc);

const carOptions = {
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

const flightOption = {
  series: [0],
  colors: ["#63D471"],
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
      gradientToColors: ["#378B29"],
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

const carChart = new ApexCharts(document.querySelector("#chart"), carOptions);
carChart.render();

const flightChart = new ApexCharts(
  document.querySelector("#flightChart"),
  flightOption
);
flightChart.render();

// const chart2 = new ApexCharts(
//   document.querySelector("#chart2"),
//   defaultRadialOptions
// );
// chart2.render();
