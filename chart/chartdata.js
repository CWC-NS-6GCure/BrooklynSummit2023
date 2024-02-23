const updateSecs = 100;
const waitSecs = 5000;

var colorList = [
  "#004c6d",
  "#255e7e",
  "#3d708f",
  "#5383a1",
  "#6996b3",
  "#7faac6",
  "#94bed9",
  "#abd2ec",
  "#c1e7ff",
]
const poisonedColor =   "#e60049";
const accColor =  "#00bfa0";

const totalPeerVals = ["100", "250"];
const poisonerVals = ["30", "40", "50"];
const poisonedClass = '2';
const totalClasses = '6'

colorList.splice(parseInt(poisonedClass), 0, poisonedColor);
colorList.splice(parseInt(totalClasses), 0, accColor);

const iteration_size = 299;

function rand() {
  // return Math.random();
  return (Math.random() * (0.99 - 0.01) + 0.01).toFixed(4);
}

function call_data() {
  var json_idx_key =  "" + cnt + "_" + selectTotal + "_" + selectPoisoners; 
  return indexedData[json_idx_key];
}

function get_label(kvalue) {
  if (kvalue === "All") { return kvalue; }
  else { return "Class " + kvalue; }
}

function get_linestyle(kvalue, ctype){
  if (String(kvalue) === poisonedClass) {
    if (ctype === "P") { return 'dot'};
    if (ctype === "R") { return 'dashdot'};
  }
  return 'solid';
}

function get_chart_traces(jsonChartData, ctype) {
  var traces = [];
  var colorIdx = 0;
  var lineStyle = 'solid';
  for (var key in jsonChartData) {
    traces.push({
      // x: [cnt],
      y: [jsonChartData[key]],
      mode: 'lines',
      name: get_label(key),
      line: { 
        color: colorList[colorIdx],
        dash: get_linestyle(key, ctype)
       }
    });
    colorIdx++;
  };
  return traces;
}

function get_chart_trace_extend(jsonRoundData) {
  var yV = [];
  var xV = [];
  var xIdx = 0;
  for (var key in jsonRoundData) {
    yV.push( [ jsonRoundData[key] ] );
    xV.push(xIdx);
    xIdx++;
  };
  return [yV, xV];
}

function resetData() {
  cnt = 0;
  dataB = null;
  dataP = null;
  dataR = null;

  jsonData = call_data();
  dataB = get_chart_traces(jsonData.B, "B");
  dataP = get_chart_traces(jsonData.P, "P");
  dataR = get_chart_traces(jsonData.R, "R");

}

function printCSVList() {
  totalPeerVals.forEach(function (curVal) {
    poisonerVals.forEach(function (curVal2) {
      console.log("table_data_" + curVal + "_" + curVal2 + ".csv");
    });
  });
}

function resetPlots() {
  Plotly.newPlot('beneignPlot', dataB, layoutB, { displayModeBar: false });
  Plotly.newPlot("poisonedPlot", dataP, layoutP, { displayModeBar: false });
  Plotly.newPlot("recoveredPlot", dataR, layoutR, { displayModeBar: false });
}

function setOptions() {
  var selectTotalOps = document.getElementById('totalPeers');
  var selectPoisonersOps = document.getElementById('poisoners');

  totalPeerVals.forEach(function (curVal) {
    var option = document.createElement("option");
    option.text = curVal;
    option.value = curVal;
    selectTotalOps.add(option);
  });
  poisonerVals.forEach(function (curVal) {
    var option = document.createElement("option");
    option.text = curVal + "%";
    option.value = curVal;
    selectPoisonersOps.add(option);
  });
}

function changeSource() {
  selectTotal = document.getElementById('totalPeers').value;
  selectPoisoners = document.getElementById('poisoners').value;
  resetData();
  resetPlots();
}

function extendPlot(){
    var extendData = call_data();
    var extendB = get_chart_trace_extend(extendData.B);
    var extendP = get_chart_trace_extend(extendData.P);
    var extendR = get_chart_trace_extend(extendData.R);
  
    Plotly.extendTraces('beneignPlot', {
      y: extendB[0]
    }, extendB[1]);
  
    Plotly.extendTraces('poisonedPlot', {
      y: extendP[0]
    }, extendP[1])
  
    Plotly.extendTraces('recoveredPlot', {
      y: extendR[0]
    }, extendR[1])
  
    if (cnt++ === iteration_size) {
      var start = Date.now(),
      now = start;
      while (now - start < waitSecs) { now = Date.now(); }
      // clearInterval(interval);
      resetData();
      resetPlots();
    }
}



const layout = {
  xaxis: {
    autorange: false,
    range: [0, iteration_size],
    type: 'linear'
  },
  yaxis: {
    autorange: false,
    range: [0, 1],
    type: 'linear'
  },
  margin: {
    l: 25,
    r: 20,
    b: 20,
    t: 20,
    pad: 5
  },
  showlegend: true,
  legend: {
    // x: 1,
    // y: 0.5,
    // yanchor: 'bottom',
    "orientation": "h"
  }
  // plot_bgcolor: "#000",
  // paper_bgcolor: "#000"
};

var layoutB = null;
var layoutP = null;
var layoutR = null;
layoutB = Object.assign({}, layout);
layoutP = Object.assign({}, layout);
layoutR = Object.assign({}, layout);

var dataB = null;
var dataP = null;
var dataR = null;
var cnt = 0;
var selectTotal = totalPeerVals[0];
var selectPoisoners = poisonerVals[0];

setOptions();
changeSource();
resetData();
resetPlots();
// printCSVList(); //TODO Remove this


cnt++;
var interval = setInterval(extendPlot, updateSecs);


