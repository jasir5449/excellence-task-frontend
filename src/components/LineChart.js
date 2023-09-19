// ClassScheduleChart.js
import React from 'react';
import { Chart as Chartjs } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const LineChart = ({ data }) => {
    
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Number of Scheduled Classes',
        data: data.values,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };


  return (
    <div className="chart">
      <Line data={chartData}/>
    </div>
  );
};

export default LineChart;
