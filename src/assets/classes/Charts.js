function graphColor(num) {
  if (num < 25) {
    return ["#FF0000"];
  } else if (num < 35) {
    return ["#ff8c00"];
  } else if (num < 70) {
    return ["#FFBF00"];
  }
  return ["#008000"];
}

export class DashboardRadialBarChartOptions {
  constructor(series) {
    this.series = series;
    this.colors = graphColor(series[0]);
    this.chart = {
      height: 200,
      type: "radialBar",
      offsetY: -10,
    };
    this.plotOptions = {
      radialBar: {
        track: {
          show: true,
          background: "#fff",
          strokeWidth: "100%",
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 1,
            opacity: 1,
          },
        },
        startAngle: -140,
        endAngle: 140,
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 10,
            fontSize: "22px",
            color: undefined,
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    };
    this.stroke = {
      dashArray: 0,
    };
  }
}

// var options = {
//   series: [100],
//   colors: ["#008000"],
//   chart: {
//     height: 200,
//     type: "radialBar",
//     offsetY: -10,
//   },
//   plotOptions: {
//     radialBar: {
//       track: {
//         show: true,
//         background: "#fff",
//         strokeWidth: "100%",
//         dropShadow: {
//           enabled: true,
//           top: 0,
//           left: 0,
//           blur: 1,
//           opacity: 1,
//         },
//       },
//       startAngle: -140,
//       endAngle: 140,
//       dataLabels: {
//         name: {
//           show: false,
//         },
//         value: {
//           offsetY: 10,
//           fontSize: "22px",
//           color: undefined,
//           formatter: function (val) {
//             return val + "%";
//           },
//         },
//       },
//     },
//   },

//   stroke: {
//     dashArray: 1,
//   },
// };
