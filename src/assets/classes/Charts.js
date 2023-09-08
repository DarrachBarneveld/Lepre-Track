export function graphColor(num) {
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

export class CategoryRadialChartOptions {
  constructor(series, color) {
    this.series = series;
    this.colors = [color[0]];
    this.chart = {
      height: 225,
      type: "radialBar",
      // toolbar: {
      //   show: true,
      // },
    };
    this.plotOptions = {
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
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: [color[2]],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    };

    this.stroke = {
      lineCap: "round",
    };
  }
}
