import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
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
            // Add more colors as needed
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(75,192,192,1)',
            'rgba(255,205,86,1)',
            // Add more colors as needed
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [data]);

  return (
    <Pie
      data={chartData}
      options={{
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
         // Set to false to allow adjusting width and height independently
        width: 200, // Set the width of the chart
        height: 200, // Set the height of the chart
      }}
    />
  );
  
};

export default PieChart;
