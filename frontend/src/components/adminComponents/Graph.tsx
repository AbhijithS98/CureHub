import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Graph: React.FC = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [12000, 15000, 17000, 14000, 18000, 20000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Appointments',
        data: [100, 120, 150, 130, 170, 200],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, // Use 'as const' to make it a literal type
      },
      title: {
        display: true,
        text: 'Revenue and Appointments Trends',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default Graph;
