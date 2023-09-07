import ApexCharts from "apexcharts";

let electricity = 0;
let gas = 0;
let oil = 0;
let coal = 0;
let lpg = 0;
let propane = 0;
let wood = 0;
let average_house = 4;

let input_form = document.querySelector(".energy_form");
let btn = document.querySelector(".submit-btn");
let inputs = document.querySelectorAll("input");

function data() {
  inputs.forEach((element) => {
    if (element.length === 0) {
      element.value = 0;
    }
  });
  let factor = +input_form.factor.value;
  let electricity_input = +input_form.electricity.value;
  let gas_input = +input_form.gas.value;
  let oil_input = +input_form.oil.value;
  let coal_input = +input_form.coal.value;
  let lpg_input = +input_form.lpg.value;
  let propane_input = +input_form.propane.value;
  let wood_input = +input_form.wood.value;
  let array = [];
  array.push(kgToTonnes(electricity_input * factor));
  array.push(kgToTonnes(gas_input * 0.183));
  array.push(kgToTonnes(oil_input * 2.54047619047619));
  array.push(coal_input * 2.883259523809524);
  array.push(kgToTonnes(lpg_input * 1.557142857142857));
  array.push(kgToTonnes(propane_input * 1.542857142857143));
  array.push(wood_input * 0.0505547619047619);
  let a = addNumbers(array);
  return a;
}
function kgToTonnes(number) {
  number = +number;
  let tonnes = number / 1000;
  tonnes = Number.parseFloat(tonnes).toFixed(2);
  return +tonnes;
}

function addNumbers(numbers) {
  let sum = numbers.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  return +sum.toFixed(2);
}

function calculateAverage(array) {
  var total = 0;
  var count = 0;

  array.forEach(function (item, index) {
    total += item;
    count++;
  });

  return total / count;
}

inputs.forEach((element) => {
  element.addEventListener("input", console.log(data()));
});
btn.addEventListener("click", (e) => {
  e.preventDefault();
  let charting = document.querySelector(".energy-chart");

  let comparedToAverage = (data() / average_house) * 100;

  var options = {
    series: [comparedToAverage.toFixed(2)],
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%",
        },
      },
    },
    labels: ["Testing"],
  };

  var chart = new ApexCharts(document.querySelector(".energy-chart"), options);
  chart.render();
});
