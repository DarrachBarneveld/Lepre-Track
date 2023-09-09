// USE THIS AS A BASE MODULE FOR OTHER INPUT CALCULATIONS
import ApexCharts from "apexcharts";
import { checkAuthState, getUserData } from "./auth";
import { User } from "../classes/User";
import { doc, updateDoc } from "@firebase/firestore";
import { firebaseDB } from "../../config/firebase";

const metalCheck = document.getElementById("metalCheck");
const paperCheck = document.getElementById("paperCheck");
const plasticCheck = document.getElementById("plasticCheck");
const glassCheck = document.getElementById("glassCheck");
const foodCheck = document.getElementById("foodCheck");

const flightResultLabel = document.getElementById("flight-result");

let activeUser;
let userClass;

async function init() {
  activeUser = await checkAuthState();

  const userData = await getUserData(activeUser);

  userClass = new User(userData);

  console.log(userClass);

  renderStoredData();
}

function renderStoredData() {}

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
  // average packaging & food waste per month, in kg.
  // Only 10 percent of plastic waste is recyclable, so we times the amount of by 0.1 to get recyclable amount
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

async function flightCarbonCalc(e) {
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

  flightChart.updateOptions({
    series: [((DUMMY_DATA.averageTotalCo2 - co2Savings) / 1.089).toFixed(2)],
  });
}

async function updateFireBase(data, prop) {
  const userRef = doc(firebaseDB, "users", activeUser.uid);

  const userData = await getUserData(activeUser);

  userData.travel[prop] = data;
  updateDoc(userRef, userData);
}

flightForm.addEventListener("submit", flightCarbonCalc);

const flightOptions = {
  series: [100],
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

const flightChart = new ApexCharts(
  document.getElementById("flightChart"),
  flightOptions
);
flightChart.render();
