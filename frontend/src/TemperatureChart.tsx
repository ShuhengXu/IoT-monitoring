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

// 注册 ChartJS 组件
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
        const response = await fetch('/api/temperature/current');
        const data: TemperatureData = await response.json();
        setTemperatures(prev => [...prev.slice(-10), data]); // 保留最近10条数据
      } catch (error) {
        console.error('Failed to fetch temperature:', error);
      }
    };

    const interval = setInterval(fetchTemperature, 1000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: temperatures.map(t => t.timestamp),
    datasets: [{
      label: 'Temperature (°C)',
      data: temperatures.map(t => t.value),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    }],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 20,
        max: 35,
      },
    },
  };

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default TemperatureChart;
