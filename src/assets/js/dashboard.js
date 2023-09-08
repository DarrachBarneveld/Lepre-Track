import ApexCharts from "apexcharts";
import { DashboardRadialBarChartOptions } from "../classes/Charts";
import { firebaseAuth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import { checkAuthState, getAllUserDocuments, getUserData } from "./auth";
import { User } from "../classes/User";

const logoutBtn = document.getElementById("logout");

let activeUser;
let userClass;

async function init() {
  activeUser = await checkAuthState();

  if (!activeUser) return (window.location.href = "/");
  const userData = await getUserData(activeUser);
  userClass = new User(userData);

  transportChart.updateSeries([userClass.travel.flight.score]);
  const users = await getAllUserDocuments();

  const leaderboard = document.getElementById("leaderboard");

  users.forEach((user, i) => {
    const newUser = new User(user);

    const html = `<tr class="leaderboard-item fade-in-right"   style="animation-delay: ${
      i / 2
    }s">
    <td>
      <span class="text-warning">🥇</span>
    </td>
    <td>
      <a
        class="d-flex justify-content-center"
        href="profile.html"
      >
        <span class="d-block text-center">${newUser.name}</span>
      </a>
    </td>
    <td>${newUser.travel.flight.score}</td>
    <td>${newUser.food}</td>
    <td>${newUser.food}</td>
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

async function logOutUser() {
  const result = await Swal.fire({
    title: "Are you sure you want to log out?",
    text: "You will be logged out from your account.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, log me out",
  });

  if (result.isConfirmed) {
    await signOut(firebaseAuth);

    window.location.href = "/";
  }
}

logoutBtn.addEventListener("click", logOutUser);

const transportChart = new ApexCharts(
  document.querySelector("#transportChart"),
  new DashboardRadialBarChartOptions([0])
);
transportChart.render();

const foodChart = new ApexCharts(
  document.querySelector("#foodChart"),
  new DashboardRadialBarChartOptions([20])
);
foodChart.render();

const energyChart = new ApexCharts(
  document.querySelector("#energyChart"),
  new DashboardRadialBarChartOptions([100])
);
energyChart.render();

const communityChart = new ApexCharts(
  document.querySelector("#communityChart"),
  new DashboardRadialBarChartOptions([33])
);
communityChart.render();

var options = {
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

var pieChart = new ApexCharts(document.querySelector("#pieChart"), options);
pieChart.render();
