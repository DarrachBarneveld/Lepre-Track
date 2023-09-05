export const defaultBarChartOptions = {
  series: [
    {
      name: "You",
      data: [
        {
          x: "Car",
          y: 10,
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
  chart: {
    height: 350,
    type: "bar",
  },

  colors: ["#00E396"],
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    customLegendItems: ["You", "Average"],
    markers: {
      fillColors: ["#00E396", "#775DD0"],
    },
  },
};

export const defaultRadialOptions = {
  series: [10, 50],
  chart: {
    height: 350,
    type: "radialBar",
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: "22px",
        },
        value: {
          fontSize: "16px",
          formatter: function (val, t) {
            console.log(t);
            const intVal = +val * 2;
            return intVal.toFixed(2) + "%";
          },
        },
        total: {
          show: true,
          label: "Average Km",
          formatter: function (item) {
            return 367; // Average amount of km per week Ireland
          },
        },
      },
    },
  },
  labels: ["You", "Average"],
  colors: ["#569ef9", "#58e5a4"],
};
