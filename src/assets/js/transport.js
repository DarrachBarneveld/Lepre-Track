// USE THIS AS A BASE MODULE FOR OTHER INPUT CALCULATIONS
import ApexCharts from "apexcharts";
import Swal from "sweetalert2";
import {
  calculateInvertedPercentage,
  getPercentInRelationToAverage,
} from "../../helpers/math";
import { checkAuthState, getUserData, removeLoader } from "./auth";
import { User } from "../classes/User";
import { doc, updateDoc } from "@firebase/firestore";
import { firebaseDB } from "../../config/firebase";

const carForm = document.getElementById("carForm");
const flightForm = document.getElementById("flightForm");
const transportForm = document.getElementById("transportForm");
const kilometers = document.getElementById("kilometers");
const flightKM = document.getElementById("flightKm");
const numFlights = document.getElementById("numFlights");
const driveValue = document.getElementById("driveInput");
const carpoolValue = document.getElementById("carpoolInput");
const walkValue = document.getElementById("walkInput");
const cycleValue = document.getElementById("cycleInput");
const trainValue = document.getElementById("trainInput");
const busValue = document.getElementById("busInput");

const carResultLabel = document.getElementById("car-result");
const flightResultLabel = document.getElementById("flight-result");
const transportResultLabel = document.getElementById("transport-result");

function IrishAverageTravelMethodTotal() {
  const { averageTravelMethod } = DUMMY_DATA;

  const averageCarbonSum =
    averageTravelMethod.car * 1 +
    averageTravelMethod.carpool * 0.5 +
    averageTravelMethod.walkCycle * 0 +
    averageTravelMethod.train * 0.2 +
    averageTravelMethod.bus * 0.6;

  return averageCarbonSum;
}

let activeUser;
let userClass;

async function init() {
  activeUser = await checkAuthState();
  if (!activeUser) return (window.location.href = "/");
  removeLoader();

  const userData = await getUserData(activeUser);

  userClass = new User(userData);

  const profileIcon = document.getElementById("profile");
  profileIcon.innerHTML = `<i class="fa-solid fa-user"></i> ${userData.name}`;
  renderStoredData();
}

function renderStoredData() {
  document.getElementById(userClass.travel.flight.class).checked = true;
  flightKM.value = userClass.travel.flight.yearlyKM;
  numFlights.value = userClass.travel.flight.numFlights;

  kilometers.value = userClass.travel.car.weeklyKm;
  document.getElementById(userClass.travel.car.type).checked = true;
  document.getElementById("before").checked = true;

  const flightScore =
    userClass.travel.flight.score > 100 ? 100 : userClass.travel.flight.score;

  flightChart.updateSeries([flightScore]);

  const carScore =
    userClass.travel.car.score > 100 ? 100 : userClass.travel.car.score;
  carChart.updateSeries([carScore]);
  carResultLabel.innerText = `${userClass.travel.car.score}%`;

  driveValue.value = userClass.travel.transport.drive;

  carpoolValue.value = userClass.travel.transport.carpool;
  walkValue.value = userClass.travel.transport.walk;
  cycleValue.value = userClass.travel.transport.cycle;
  trainValue.value = userClass.travel.transport.train;
  busValue.value = userClass.travel.transport.bus;

  const transportScore =
    userClass.travel.transport.score > 100
      ? 100
      : userClass.travel.transport.score;

  transportChart.updateSeries([transportScore]);
  transportResultLabel.innerText = `${userClass.travel.transport.score}%`;

  flightResultLabel.dataset.to = userClass.travel.flight.score;

  const userTotalChart = [
    (DUMMY_DATA.flightKperWeek * userClass.travel.flight.score).toFixed(0) /
      100,
    (DUMMY_DATA.carKperWeek * userClass.travel.car.score).toFixed(0) / 100,
    (DUMMY_DATA.communterKperWeek * userClass.travel.transport.score).toFixed(
      0
    ) / 100,
  ];

  totalChart.updateOptions({
    series: [
      {
        name: userClass.name,
        type: "column",
        data: userTotalChart,
      },
      {
        name: "Irish Average",
        type: "line",
        data: [
          DUMMY_DATA.flightKperWeek,
          DUMMY_DATA.carKperWeek,
          DUMMY_DATA.communterKperWeek,
        ],
      },
    ],
  });

  flightResultLabel.innerText = `${userClass.travel.flight.score}%`;
}

init();

const DUMMY_DATA = {
  // this is the average milage/carbon per week of a car
  averageKM: 327,
  averageFlights: 6.5,
  averageFlightKM: 6850,
  tonnesPerKM: 0.0002582,
  flightKperWeek: 34,
  carKperWeek: 36,
  communterKperWeek: 29,
  averageTravelMethod: {
    car: 65,
    carpool: 8,
    walkCycle: 15,
    bus: 6,
    train: 6,
  },
};

async function flightCarbonCalc(e) {
  e.preventDefault(); // Prevent form submission

  // Get the values from the form
  const totalFlights = parseInt(numFlights.value);
  const estimatedDistance = parseInt(flightKM.value);
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

  const averageFlightCarbon =
    DUMMY_DATA.averageFlightKM * DUMMY_DATA.tonnesPerKM;

  let percentOfFlightKM = getPercentInRelationToAverage(
    tonnesPerDistance,
    averageFlightCarbon
  );

  const truePercent = percentOfFlightKM;

  const inversePercent = calculateInvertedPercentage(truePercent);

  flightResultLabel.innerText = `${inversePercent.toFixed(2)}%`;

  const totalChartValue = tonnesPerDistance * 100;
  // avoid strange css behaviour of over 100% on chart
  percentOfFlightKM > 100 ? (percentOfFlightKM = 100) : percentOfFlightKM;

  flightChart.updateOptions({
    series: [inversePercent.toFixed(2)],
  });

  const currentArray = totalChart.w.globals.series[0];

  totalChart.updateOptions({
    series: [
      {
        name: userClass.name,
        type: "column",
        data: [
          DUMMY_DATA.flightKperWeek * (totalChartValue / 100).toFixed(0),
          currentArray[1],
          currentArray[2],
        ],
      },
      {
        name: "Irish Average",
        type: "line",
        data: [
          DUMMY_DATA.flightKperWeek,
          DUMMY_DATA.carKperWeek,
          DUMMY_DATA.communterKperWeek,
        ],
      },
    ],
  });

  const data = {
    yearlyKM: estimatedDistance,
    numFlights: totalFlights,
    class: selectedFlightClass.value,
    score: inversePercent.toFixed(2),
  };
  updateFireBase(data, "flight");
}
async function updateFireBase(data, prop) {
  const userRef = doc(firebaseDB, "users", activeUser.uid);

  const userData = await getUserData(activeUser);

  userData.travel[prop] = data;
  updateDoc(userRef, userData);
}

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
  const trueTotalKM = totalKilometers;

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

  const trueScorePercent = percentOfCarKM;
  carResultLabel.innerText = `${percentOfCarKM.toFixed(2)}%`;
  let color;
  //   percentOfCarKM > 100 ? (color = "#FF0000") : (color = "#569ef9");

  // change color if over 100
  percentOfCarKM > 100 ? (color = "#FF0000") : (color = "#00E396");

  // avoid strange css behaviour of over 100% on chart
  percentOfCarKM > 100 ? (percentOfCarKM = 100) : percentOfCarKM;

  carChart.updateOptions({
    series: [percentOfCarKM.toFixed(2)],
  });

  const currentArray = totalChart.w.globals.series[0];

  totalChart.updateOptions({
    series: [
      {
        name: userClass.name,
        type: "column",
        data: [
          currentArray[0],
          DUMMY_DATA.carKperWeek * (trueScorePercent / 100).toFixed(0),
          currentArray[2],
        ],
      },
      {
        name: "Irish Average",
        type: "line",
        data: [
          DUMMY_DATA.flightKperWeek,
          DUMMY_DATA.carKperWeek,
          DUMMY_DATA.communterKperWeek,
        ],
      },
    ],
  });

  const data = {
    weeklyKm: trueTotalKM,
    type: selectedCarType.value,
    year2000: selectedCarYear.value,
    score: trueScorePercent.toFixed(2),
  };

  updateFireBase(data, "car");
}

async function transportCarbonCalc(e) {
  e.preventDefault();

  const drivePercentage = parseInt(driveValue.value);
  const carpoolPercentage = parseInt(carpoolValue.value);
  const walkPercentage = parseInt(walkValue.value);
  const cyclePercentage = parseInt(cycleValue.value);
  const trainPercentage = parseInt(trainValue.value);
  const busPercentage = parseInt(busValue.value);

  const totalPercentage =
    drivePercentage +
    carpoolPercentage +
    walkPercentage +
    cyclePercentage +
    trainPercentage +
    busPercentage;

  if (totalPercentage !== 100) {
    await Swal.fire({
      title: "Error!",
      text: `Inputs must equal 100%`,
      icon: "error",
      confirmButtonText: "Try Again",
    });
    return;
  }

  const weightedSum =
    drivePercentage * 1 +
    carpoolPercentage * 0.5 +
    walkPercentage * 0 +
    cyclePercentage * 0 +
    trainPercentage * 0.2 +
    busPercentage * 0.6;

  const averageCarbonSum = IrishAverageTravelMethodTotal();

  let percentMode = getPercentInRelationToAverage(
    weightedSum,
    averageCarbonSum
  );

  const truePercent = percentMode;

  const inverseScore = calculateInvertedPercentage(truePercent);
  transportResultLabel.innerText = `${inverseScore.toFixed(2)}%`;

  percentMode > 100 ? (percentMode = 100) : percentMode;

  transportChart.updateOptions({
    series: [inverseScore.toFixed(2)],
  });

  const currentArray = totalChart.w.globals.series[0];

  totalChart.updateOptions({
    series: [
      {
        name: userClass.name,
        type: "column",
        data: [
          currentArray[0],
          currentArray[1],
          DUMMY_DATA.communterKperWeek * (truePercent / 100).toFixed(0),
        ],
      },
      {
        name: "Irish Average",
        type: "line",
        data: [
          DUMMY_DATA.flightKperWeek,
          DUMMY_DATA.carKperWeek,
          DUMMY_DATA.communterKperWeek,
        ],
      },
    ],
  });

  const data = {
    drive: drivePercentage,
    carpool: carpoolPercentage,
    walk: walkPercentage,
    cycle: cyclePercentage,
    train: trainPercentage,
    bus: busPercentage,
    score: inverseScore.toFixed(2),
  };

  updateFireBase(data, "transport");
}

carForm.addEventListener("submit", carCarbonCalc);
flightForm.addEventListener("submit", flightCarbonCalc);
transportForm.addEventListener("submit", transportCarbonCalc);

const carOptions = {
  series: [0],
  colors: ["#009FFD"],
  chart: {
    height: 225,
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

const flightOptions = {
  series: [0],
  colors: ["#DA2D2D"],
  chart: {
    height: 225,
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
      gradientToColors: ["#7C0000"],
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

const transportOptions = {
  series: [0],
  colors: ["#63D471"],
  chart: {
    height: 225,
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
};

const totalOptions = {
  series: [
    {
      name: "",
      type: "column",
      data: [0, 0, 0],
    },
    {
      name: "Irish Average",
      type: "line",
      data: [
        DUMMY_DATA.flightKperWeek,
        DUMMY_DATA.carKperWeek,
        DUMMY_DATA.communterKperWeek,
      ],
    },
  ],
  colors: ["#4b7bff", "#DA2D2D"],

  plotOptions: {
    bar: {
      borderRadius: 10,
    },
  },
  chart: {
    height: 350,
    type: "line",
    toolbar: {
      show: false,
    },
  },

  stroke: {
    width: [0, 4],
  },
  title: {
    text: "Kilos Carbon Per Week",
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1],
  },
  labels: ["Flights", "Car", "Transport"],
};

const carChart = new ApexCharts(
  document.getElementById("carChart"),
  carOptions
);
carChart.render();

const flightChart = new ApexCharts(
  document.getElementById("flightChart"),
  flightOptions
);
flightChart.render();

const transportChart = new ApexCharts(
  document.getElementById("transportChart"),
  transportOptions
);
transportChart.render();

const totalChart = new ApexCharts(
  document.querySelector("#chart"),
  totalOptions
);
totalChart.render();
