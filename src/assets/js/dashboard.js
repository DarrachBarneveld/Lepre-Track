import ApexCharts from "apexcharts";
import { DashboardRadialBarChartOptions, graphColor } from "../classes/Charts";
import {
  checkAuthState,
  getAllUserDocuments,
  getUserData,
  logOutUser,
  removeLoader,
} from "./auth";
import { User } from "../classes/User";

const logoutBtn = document.getElementById("logout");
const userBadge = document.getElementById("badgeImage");

let activeUser;
let userClass;

async function init() {
  activeUser = await checkAuthState();
  removeLoader();

  if (!activeUser) return (window.location.href = "/");
  const userData = await getUserData(activeUser);
  userClass = new User(userData);

  const users = await getAllUserDocuments();

  const userTransportScore = userClass.calcTransportScore();
  const userRecyclingScore = userClass.calcRecyclingScore();
  const userEnergyScore = userClass.calcEnergyScore();
  const userFoodScore = userClass.calcFoodScore();

  const transColor = graphColor(userTransportScore);
  const foodColor = graphColor(userFoodScore);
  const energyColor = graphColor(userEnergyScore);
  const recycleColor = graphColor(userFoodScore);

  locateImageSrc(userClass.overAllScore());

  transportChart.updateOptions({
    colors: transColor,
  });
  foodChart.updateOptions({
    colors: foodColor,
  });
  energyChart.updateOptions({
    colors: energyColor,
  });
  communityChart.updateOptions({
    colors: recycleColor,
  });

  transportChart.updateSeries([userTransportScore]);
  foodChart.updateSeries([userFoodScore]);
  energyChart.updateSeries([userEnergyScore]);
  communityChart.updateSeries([userRecyclingScore]);

  const { totalScore } = userClass.overAllScore();

  locateImageSrc(totalScore);

  pieChart.updateSeries([
    userTransportScore,
    userFoodScore,
    userEnergyScore,
    userRecyclingScore,
  ]);

  totalChart.updateSeries([
    {
      name: "Actual",
      data: [
        {
          x: userClass.name,
          y: totalScore,
          goals: [
            {
              name: "Earth's Guardian",
              value: 200,
              strokeHeight: 5,
              strokeColor: "#FFD700",
            },
            {
              name: "Green Fingers",
              value: 150,
              strokeHeight: 5,
              strokeColor: "#4b7bff",
            },
            {
              name: "Balance Footprint",
              value: 100,
              strokeHeight: 5,
              strokeColor: "#775DD0",
            },
            {
              name: "Terra's Tormentor",
              value: 50,
              strokeHeight: 5,
              strokeColor: "#FF0000",
            },
          ],
        },
      ],
    },
  ]);

  function locateImageSrc(num) {
    console.log(num);
    if (num <= 300) {
      userBadge.src = "src/assets/images/terra-tormentor.png";
    }
    if (num <= 100) {
      userBadge.src = "./src/assets/images/balanced-foodprint.png";
    }
    if (num <= 150) {
      userBadge.src = "./src/assets/images/green-finger.png";
    }
    if (num >= 200) {
      userBadge.src = "./src/assets/images/earth-guardian.png";
    }
  }

  const leaderboard = document.getElementById("leaderboard");

  users.forEach((user, i) => {
    const newUser = new User(user);

    const html = `<tr class="leaderboard-item fade-in-right"   style="animation-delay: ${
      i / 2
    }s">
    <td>
      <span class="h4 text-warning">🥇</span>
    </td>
    <td>
      <a
        class="d-flex justify-content-center"
        href="profile.html"
      >
        <span class="d-block text-center">${newUser.name}</span>
      </a>
    </td>
    <td>${newUser.calcTransportScore()}</td>
    <td>${newUser.calcFoodScore()}</td>
    <td>${newUser.calcEnergyScore()}</td>
    <td>${newUser.calcRecyclingScore()}</td>
    <td>
      <span class="text-success p-1">
      <i class="fa-solid fa-star text-warning"></i> ${newUser.starRating()}
      </span>
    </td>
    </tr>`;
    leaderboard.insertAdjacentHTML("beforeend", html);
  });

  const profileIcon = document.getElementById("profile");
  profileIcon.innerHTML = `<i class="fa-solid fa-user"></i> ${userData.name}`;
}

init();

logoutBtn.addEventListener("click", logOutUser);

const transportChart = new ApexCharts(
  document.querySelector("#transportChart"),
  new DashboardRadialBarChartOptions([0])
);
transportChart.render();

const foodChart = new ApexCharts(
  document.querySelector("#foodChart"),
  new DashboardRadialBarChartOptions([0])
);
foodChart.render();

const energyChart = new ApexCharts(
  document.querySelector("#energyChart"),
  new DashboardRadialBarChartOptions([0])
);
energyChart.render();

const communityChart = new ApexCharts(
  document.querySelector("#communityChart"),
  new DashboardRadialBarChartOptions([0])
);
communityChart.render();

const pieOptions = {
  series: [44, 15, 29, 12],
  chart: {
    width: "100%",
    type: "pie",
  },
  labels: ["Travel", "Diet", "Energy", "Community"],
  // responsive: [
  //   {
  //     breakpoint: 480,
  //     options: {
  //       chart: {
  //         width: 200,
  //       },
  //       legend: {
  //         position: "bottom",
  //       },
  //     },
  //   },
  // ],
};

var pieChart = new ApexCharts(document.querySelector("#pieChart"), pieOptions);
pieChart.render();

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
              name: "Earth's Guardian",
              value: 200,
              strokeHeight: 5,
              strokeColor: "#FFD700",
            },
            {
              name: "Green Fingers",
              value: 150,
              strokeHeight: 5,
              strokeColor: "#4b7bff",
            },
            {
              name: "Balance Footprint",
              value: 100,
              strokeHeight: 5,
              strokeColor: "#775DD0",
            },
            {
              name: "Terra's Tormentor",
              value: 50,
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
      "User",
      "Terra's Tormentor",
      "Balance Footprint",
      "Green Fingers",
      "Earth's Guardian",
    ],
    markers: {
      fillColors: ["#00E396", "#FF0000", "#775DD0", "#4b7bff", "#FFD700"],
    },
  },
};

const totalChart = new ApexCharts(
  document.querySelector("#totalChart"),
  options
);
totalChart.render();
