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
  const userFoodScore = userClass.calcFoodScore();

  const transColor = graphColor(userTransportScore);
  const foodColor = graphColor(userFoodScore);

  transportChart.updateOptions({
    colors: transColor,
  });
  foodChart.updateOptions({
    colors: foodColor,
  });

  transportChart.updateSeries([userTransportScore]);
  foodChart.updateSeries([userFoodScore]);

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
