const { ipcRenderer } = require('electron');
const React = require('react');
const ReactDOM = require('react-dom');
const BarGraph = require('./graphs/Bargraph.js');
const PieGraph=require("./graphs/piechart.js");
const BubbleGraph=require("./graphs/BubbleGraph.js");  
const Statustable=require("./statustable/statustable.js")
ipcRenderer.on('updateChartData', (event, chartData) => {
  ReactDOM.render( <>
    <BarGraph data={chartData} />
    <PieGraph data={chartData} />
    <BubbleGraph data={chartData} /> 
    <Statustable data={chartData} />
  </>
  );
});
