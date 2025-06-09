import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TemperatureData {
  value: number;
  timestamp: string;
}

const TemperatureChart: React.FC = () => {
  const [temperatures, setTemperatures] = useState<TemperatureData[]>([]);

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/temperature/current");
        const data: TemperatureData = await response.json();
        setTemperatures(prev => [...prev.slice(-10), data]);
      } catch (error) {
        console.error('Failed to fetch temperature:', error);
      }
    };

    const interval = setInterval(fetchTemperature, 1000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: temperatures.map(t => new Date(t.timestamp).toLocaleTimeString()),
    datasets: [{
      label: '🌡️ Temperature (°C)',
      data: temperatures.map(t => t.value),
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      tension: 0.3,
      fill: true,
    }],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 20,
        max: 35,
        ticks: { stepSize: 1 },
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: '#333',
          font: { size: 14 },
        }
      },
      x: {
        ticks: {
          maxTicksLimit: 10,
        },
        title: {
          display: true,
          text: 'Time',
          color: '#333',
          font: { size: 14 },
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
  };

  return (
    <section
      style={{
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '1.5rem',
        backgroundColor: '#f7f9fc',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#333' }}>
        📈 Real-Time Temperature Chart
      </h2>
      <Line data={chartData} options={chartOptions} />
    </section>
  );
};

export default TemperatureChart;
