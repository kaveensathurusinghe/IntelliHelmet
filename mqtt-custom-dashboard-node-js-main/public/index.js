// Import MQTT service
import { MQTTService } from "./mqttService.js";

// Target specific HTML items
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

// Holds the background color of all chart
var chartBGColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-background"
);
var chartFontColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-font-color"
);
var chartAxisColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-axis-color"
);

/*
  Event listeners for any HTML click
*/
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");
  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");

  // Update Chart background
  chartBGColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-background"
  );
  chartFontColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-font-color"
  );
  chartAxisColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-axis-color"
  );
  updateChartsBackground();
});

/*
  Plotly.js graph and chart setup code
*/
var b_temperatureHistoryDiv = document.getElementById("b_temperature-history");
var e_temperatureHistoryDiv = document.getElementById("e_temperature-history");
var pressureHistoryDiv = document.getElementById("pressure-history");
var altitudeHistoryDiv = document.getElementById("altitude-history");
var bpmHistoryDiv = document.getElementById("bpm-history");
var airqualityHistoryDiv = document.getElementById("airquality-history");
var spo2HistoryDiv = document.getElementById("spo2-history");

var b_temperatureGaugeDiv = document.getElementById("b_temperature-gauge");
var e_temperatureGaugeDiv = document.getElementById("e_temperature-gauge");
var pressureGaugeDiv = document.getElementById("pressure-gauge");
var altitudeGaugeDiv = document.getElementById("altitude-gauge");
var bpmGaugeDiv = document.getElementById("bpm-gauge");
var airqualityGaugeDiv = document.getElementById("airquality-gauge");
var spo2GaugeDiv = document.getElementById("spo2-gauge");

const historyCharts = [
  b_temperatureHistoryDiv,
  e_temperatureHistoryDiv,
  pressureHistoryDiv,
  altitudeHistoryDiv,
  bpmHistoryDiv,
  airqualityHistoryDiv,
  spo2HistoryDiv
];

const gaugeCharts = [
  b_temperatureGaugeDiv,
  e_temperatureGaugeDiv,
  pressureGaugeDiv,
  altitudeGaugeDiv,
  bpmGaugeDiv,
  airqualityGaugeDiv,
  spo2GaugeDiv
];

// History Data
var b_temperatureTrace = {
  x: [],
  y: [],
  name: "Body Temperature",
  mode: "lines+markers",
  type: "line",
};
var e_temperatureTrace = {
  x: [],
  y: [],
  name: "Enviroment Temperature",
  mode: "lines+markers",
  type: "line",
};
var pressureTrace = {
  x: [],
  y: [],
  name: "Pressure",
  mode: "lines+markers",
  type: "line",
};
var altitudeTrace = {
  x: [],
  y: [],
  name: "Altitude",
  mode: "lines+markers",
  type: "line",
};

var bpmTrace = {
  x: [],
  y: [],
  name: "Heart Rate(BPM)",
  mode: "lines+markers",
  type: "line",
};

var airqualityTrace = {
  x: [],
  y: [],
  name: "Air Quality",
  mode: "lines+markers",
  type: "line",
};

var spo2Trace = {
  x: [],
  y: [],
  name: "Blood Oxygen(spO2)",
  mode: "lines+markers",
  type: "line",
};

var b_temperatureLayout = {
  autosize: true,
  title: {
    text: "Body Temperature",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 10 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
};
var e_temperatureLayout = {
  autosize: true,
  title: {
    text: "Environment Temperture",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var pressureLayout = {
  autosize: true,
  title: {
    text: "Pressure",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var altitudeLayout = {
  autosize: true,
  title: {
    text: "Altitude",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};

var bpmLayout = {
  autosize: true,
  title: {
    text: "Heart Rate(BPM)",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};

var airqualityLayout = {
  autosize: true,
  title: {
    text: "Air Quality",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};

var spo2Layout = {
  autosize: true,
  title: {
    text: "Blood Oxygen(spO2)",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};

var config = { responsive: true, displayModeBar: false };

// Event listener when page is loaded
window.addEventListener("load", (event) => {
  Plotly.newPlot(
    b_temperatureHistoryDiv,
    [b_temperatureTrace],
    b_temperatureLayout,
    config
  );
  Plotly.newPlot(e_temperatureHistoryDiv, [e_temperatureTrace], e_temperatureLayout, config);
  Plotly.newPlot(pressureHistoryDiv, [pressureTrace], pressureLayout, config);
  Plotly.newPlot(altitudeHistoryDiv, [altitudeTrace], altitudeLayout, config);
  Plotly.newPlot(bpmHistoryDiv, [bpmTrace], bpmLayout, config);
  Plotly.newPlot(airqualityHistoryDiv, [airqualityTrace], airqualityLayout, config);
  Plotly.newPlot(spo2HistoryDiv, [spo2Trace], spo2Layout, config);

  // Get MQTT Connection
  fetchMQTTConnection();

  // Run it initially
  handleDeviceChange(mediaQuery);
});

// Gauge Data
var b_temperatureData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Body Temperature" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 30 },
    gauge: {
      axis: { range: [null, 50] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var e_temperatureData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Environment Temperature" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 25 },
    gauge: {
      axis: { range: [null, 50] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var pressureData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Pressure" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 1000 },
    gauge: {
      axis: { range: [null, 1100] },
      steps: [
        { range: [0, 300], color: "lightgray" },
        { range: [300, 700], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var altitudeData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Altitude" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 10 },
    gauge: {
      axis: { range: [null, 30] },
      steps: [
        { range: [0, 10], color: "lightgray" },
        { range: [8, 15], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var bpmData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Heart Rate(BPM)" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 78 },
    gauge: {
      axis: { range: [null, 160] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var airqualityData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Air Quality" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 400 },
    gauge: {
      axis: { range: [null, 1200] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var spo2Data = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Blood Oxygen(spO2)" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 94 },
    gauge: {
      axis: { range: [null, 100] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var layout = { width: 300, height: 250, margin: { t: 0, b: 0, l: 0, r: 0 } };

Plotly.newPlot(b_temperatureGaugeDiv, b_temperatureData, layout);
Plotly.newPlot(e_temperatureGaugeDiv, e_temperatureData, layout);
Plotly.newPlot(pressureGaugeDiv, pressureData, layout);
Plotly.newPlot(altitudeGaugeDiv, altitudeData, layout);
Plotly.newPlot(bpmGaugeDiv, bpmData, layout);
Plotly.newPlot(airqualityGaugeDiv, airqualityData, layout);
Plotly.newPlot(spo2GaugeDiv, spo2Data, layout);

// Will hold the arrays we receive from our BME280 sensor
// Temperature
let newBTempXArray = [];
let newBTempYArray = [];
let newETempXArray = [];
let newETempYArray = [];
// Pressure
let newPressureXArray = [];
let newPressureYArray = [];
// Altitude
let newAltitudeXArray = [];
let newAltitudeYArray = [];
// BPM
let newbpmXArray = [];
let newbpmYArray = [];
// Air Quality
let newAirQXArray = [];
let newAirQYArray = [];
//spo2
let newspo2XArray = [];
let newspo2YArray = [];

// The maximum number of data points displayed on our scatter/line graph
let MAX_GRAPH_POINTS = 36;
let ctr = 0;

// Callback function that will retrieve our latest sensor readings and redraw our Gauge with the latest readings
function updateSensorReadings(jsonResponse) {
  console.log(typeof jsonResponse);
  console.log(jsonResponse);

  let b_temperature = Number(jsonResponse.b_temperature).toFixed(2);
  let e_temperature = Number(jsonResponse.e_temperature).toFixed(2);
  let pressure = Number(jsonResponse.pressure).toFixed(2);
  let altitude = Number(jsonResponse.altitude).toFixed(2);
  let bpm = Number(jsonResponse.bpm).toFixed(2);
  let airquality = Number(jsonResponse.airquality).toFixed(2);
  let spo2 = Number(jsonResponse.spo2).toFixed(2);

  //boxes
  updateBoxes(b_temperature, e_temperature, pressure, altitude, bpm, airquality, spo2);

  updateGauge(b_temperature, e_temperature, pressure, altitude, bpm, airquality, spo2);

  // Update Temperature Line Chart
  updateCharts(
    b_temperatureHistoryDiv,
    newBTempXArray,
    newBTempYArray,
    b_temperature
  );
  updateCharts(
    e_temperatureHistoryDiv,
    newETempXArray,
    newETempYArray,
    e_temperature
  );
  // Update Pressure Line Chart
  updateCharts(
    pressureHistoryDiv,
    newPressureXArray,
    newPressureYArray,
    pressure
  );

  // Update Altitude Line Chart
  updateCharts(
    altitudeHistoryDiv,
    newAltitudeXArray,
    newAltitudeYArray,
    altitude
  );

  // Update BPM Line Chart
  updateCharts(
    bpmHistoryDiv,
    newbpmXArray,
    newbpmYArray,
    bpm
  );

  // Update Air Quality Line Chart
  updateCharts(
    airqualityHistoryDiv,
    newAirQXArray,
    newAirQYArray,
    airquality
  );

  //update spo2 line chart
  updateCharts(
    spo2HistoryDiv,
    newspo2XArray,
    newspo2YArray,
    spo2
  );
}

function updateBoxes(b_temperature, e_temperature, pressure, altitude, bpm, airquality, spo2) {
  let b_temperatureDiv = document.getElementById("b_temperature");
  let e_temperatureDiv = document.getElementById("e_temperature");
  let pressureDiv = document.getElementById("pressure");
  let altitudeDiv = document.getElementById("altitude");
  let bpmDiv = document.getElementById("bpm");
  let airqualityDiv = document.getElementById("airquality");
  let spo2Div = document.getElementById("spo2");

  b_temperatureDiv.innerHTML = b_temperature + " C";
  e_temperatureDiv.innerHTML = e_temperature + " C";
  pressureDiv.innerHTML = pressure + " hPa";
  altitudeDiv.innerHTML = altitude + " m";
  bpmDiv.innerHTML = bpm + " BPM";
  airqualityDiv.innerHTML = airquality + " ppm";
  spo2Div.innerHTML = spo2 + " %";
}

function updateGauge(b_temperature, e_temperature, pressure, altitude, bpm, airquality, spo2) {
  var b_temperature_update = {
    value: b_temperature,
  };
  var e_temperature_update = {
    value: e_temperature,
  };
  var pressure_update = {
    value: pressure,
  };
  var altitude_update = {
    value: altitude,
  };
  var bpm_update = {
    value: bpm,
  };
  var airquality_update = {
    value: airquality,
  };
  var spo2_update = {
    value: spo2,
  };
  Plotly.update(b_temperatureGaugeDiv, b_temperature_update);
  Plotly.update(e_temperatureGaugeDiv, e_temperature_update);
  Plotly.update(pressureGaugeDiv, pressure_update);
  Plotly.update(altitudeGaugeDiv, altitude_update);
  Plotly.update(bpmGaugeDiv, bpm_update);
  Plotly.update(airqualityGaugeDiv, airquality_update);
  Plotly.update(spo2GaugeDiv, spo2_update);
}

function updateCharts(lineChartDiv, xArray, yArray, sensorRead) {
  if (xArray.length >= MAX_GRAPH_POINTS) {
    xArray.shift();
  }
  if (yArray.length >= MAX_GRAPH_POINTS) {
    yArray.shift();
  }
  xArray.push(ctr++);
  yArray.push(sensorRead);

  var data_update = {
    x: [xArray],
    y: [yArray],
  };

  Plotly.update(lineChartDiv, data_update);
}

function updateChartsBackground() {
  // updates the background color of historical charts
  var updateHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));

  // updates the background color of gauge charts
  var gaugeHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  gaugeCharts.forEach((chart) => Plotly.relayout(chart, gaugeHistory));
}

const mediaQuery = window.matchMedia("(max-width: 600px)");

mediaQuery.addEventListener("change", function (e) {
  handleDeviceChange(e);
});

function handleDeviceChange(e) {
  if (e.matches) {
    console.log("Inside Mobile");
    var updateHistory = {
      width: 323,
      height: 250,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  } else {
    var updateHistory = {
      width: 550,
      height: 260,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  }
}

/*
  MQTT Message Handling Code
*/
const mqttStatus = document.querySelector(".status");

function onConnect(message) {
  mqttStatus.textContent = "Connected";
}
function onMessage(topic, message) {
  var stringResponse = message.toString();
  var messageResponse = JSON.parse(stringResponse);
  updateSensorReadings(messageResponse);
}

function onError(error) {
  console.log(`Error encountered :: ${error}`);
  mqttStatus.textContent = "Error";
}

function onClose() {
  console.log(`MQTT connection closed!`);
  mqttStatus.textContent = "Closed";
}

function fetchMQTTConnection() {
  fetch("/mqttConnDetails", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      initializeMQTTConnection(data.mqttServer, data.mqttTopic);
    })
    .catch((error) => console.error("Error getting MQTT Connection :", error));
}
function initializeMQTTConnection(mqttServer, mqttTopic) {
  console.log(
    `Initializing connection to :: ${mqttServer}, topic :: ${mqttTopic}`
  );
  var fnCallbacks = { onConnect, onMessage, onError, onClose };

  var mqttService = new MQTTService(mqttServer, fnCallbacks);
  mqttService.connect();

  mqttService.subscribe(mqttTopic);
}
