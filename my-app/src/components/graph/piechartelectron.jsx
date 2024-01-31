import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
const { ipcRenderer } = require('electron');


const PieChartElectron = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const labels = data.map((item) => item.topic);
    const totalCount = data.reduce((acc, item) => acc + item.count, 0);
    const percentages = data.map((item) => ((item.count / totalCount) * 100).toFixed(2));

    setChartData({
      labels: labels,
      datasets: [
        {
          data: percentages,
          backgroundColor: [
            'rgba(255,99,132,0.2)',
            'rgba(75,192,192,0.2)',
            'rgba(255,205,86,0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(75,192,192,1)',
            'rgba(255,205,86,1)',
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [data]);

  useEffect(() => {
    ipcRenderer.send('pie-chart-data', chartData);
  }, [data, chartData]);

  return (
    <Pie
      data={chartData}
      options={{
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
        width: 200,
        height: 200,
      }}
    />
  );
};

export default PieChartElectron;
