import React, { useEffect, useState } from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/testare_live.css';
import { useNavigate } from 'react-router-dom';
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

const TestareLive = () => {
  const navigate = useNavigate();

  const [emgData, setEmgData] = useState([]);
  const [ecgData, setEcgData] = useState([]);
  const [umiditateData, setUmiditateData] = useState([]);
  const [temperatura, setTemperatura] = useState(36.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmgData(prev => [...prev.slice(-19), Math.floor(Math.random() * 100)]);
      setEcgData(prev => [...prev.slice(-19), 50 + Math.floor(Math.random() * 50)]);
      setUmiditateData(prev => [...prev.slice(-19), 20 + Math.floor(Math.random() * 30)]);
      setTemperatura(36 + (Math.random() * 2).toFixed(2));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleStopTest = () => {
    navigate('/dashboard');
  };

  const commonOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { min: 0, max: 100 } },
  };

  const labels = Array.from({ length: emgData.length }, (_, i) => i + 1);

  return (
    <div className="testare-gradient">
      <LogoUSV />
      <Header />
      <h1 className="testare-title">Testare Live</h1>

      <div className="testare-section">
        <div className="graph-container">
          <Line data={{ labels, datasets: [{ data: emgData, borderColor: '#00f5ff' }] }} options={commonOptions} />
          <p className="graph-label">EMG</p>
        </div>

        <div className="graph-container">
          <Line data={{ labels, datasets: [{ data: ecgData, borderColor: '#ff6384' }] }} options={commonOptions} />
          <p className="graph-label">ECG</p>
        </div>

        <div className="graph-container">
          <Line data={{ labels, datasets: [{ data: umiditateData, borderColor: '#36a2eb' }] }} options={commonOptions} />
          <p className="graph-label">Umiditate</p>
        </div>
      </div>

      <div className="temperature-box">
        <p className="temperature-label">Temperatură:</p>
        <p className="temperature-value">{temperatura} °C</p>
      </div>

      <div className="status-section">
        <p className="status-text">Test în desfășurare...</p>
        <button className="btn-stop" onClick={handleStopTest}>Oprește testarea</button>
      </div>
    </div>
  );
};

export default TestareLive;
