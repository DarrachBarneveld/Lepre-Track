import ApexCharts from "apexcharts";
import { DashboardRadialBarChartOptions } from "../classes/Charts";

const transportChart = new ApexCharts(
  document.querySelector("#transportChart"),
  new DashboardRadialBarChartOptions([67])
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
