import React, { useState, useEffect, useRef } from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/testare_live.css';
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
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

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
  const location = useLocation();
  const { id_exam } = location.state || {};

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/check', { withCredentials: true })
      .then(res => {
        if (!res.data.loggedIn) {
          navigate('/'); // redirecționează spre login dacă nu e logat
        }
      });
  }, []);

  useEffect(() => {
    if (!id_exam) {
      console.warn("ID-ul examinării lipsește!");
    } else {
      console.log("ID-ul examinării primit:", id_exam);
    }
  }, [id_exam]);

  const [labels, setLabels] = useState([]);
  const [emgData, setEmgData] = useState([]);
  const [ecgData, setEcgData] = useState([]);
  const [umiditateData, setUmiditateData] = useState([]);
  const [temperatura, setTemperatura] = useState(36);
  const [marcaje, setMarcaje] = useState([]);

  const bufferRef = useRef({ labels: [], emg: [], ecg: [], umiditate: [] });
  const windowSize = 100;
  const timeRef = useRef(0);
  const startTimestampRef = useRef(Date.now());

  useEffect(() => {
    const intervalData = setInterval(() => {
      timeRef.current += 1;
      bufferRef.current.labels.push(timeRef.current);
      bufferRef.current.emg.push(Math.floor(Math.random() * 100));
      bufferRef.current.ecg.push(50 + Math.floor(Math.random() * 50));
      bufferRef.current.umiditate.push(20 + Math.floor(Math.random() * 30));
      if (bufferRef.current.labels.length > windowSize) {
        bufferRef.current.labels.shift();
        bufferRef.current.emg.shift();
        bufferRef.current.ecg.shift();
        bufferRef.current.umiditate.shift();
      }
    }, 100);
    return () => clearInterval(intervalData);
  }, []);

  useEffect(() => {
    const intervalRender = setInterval(() => {
      setLabels([...bufferRef.current.labels]);
      setEmgData([...bufferRef.current.emg]);
      setEcgData([...bufferRef.current.ecg]);
      setUmiditateData([...bufferRef.current.umiditate]);
      setTemperatura((36 + Math.random() * 2).toFixed(2));
    }, 500);
    return () => clearInterval(intervalRender);
  }, []);

  useEffect(() => {
    const intervalSend = setInterval(() => {
      if (!id_exam) return;

      const timestamp = new Date().toISOString();
      const valoare_emg = bufferRef.current.emg.slice(-1)[0];
      const valoare_ecg = bufferRef.current.ecg.slice(-1)[0];
      const valoare_umiditate = bufferRef.current.umiditate.slice(-1)[0];

      fetch('http://localhost:5000/api/date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_exam, timestamp, valoare_emg, valoare_ecg, valoare_umiditate })
      })
        .then(res => res.json())
        .then(data => console.log('Date salvate:', data))
        .catch(err => console.error('Eroare la salvarea datelor:', err));
    }, 1000);

    return () => clearInterval(intervalSend);
  }, [id_exam]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleMarcaj = (tip) => {
    const timestamp = new Date().toISOString();
    const elapsed = Date.now() - startTimestampRef.current;
    const afisajTimp = formatTime(elapsed);

    setMarcaje((prev) => [...prev, { timestamp: afisajTimp, tip }]);

    fetch('http://localhost:5000/api/marcaje', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_exam, timestamp, tip }) 
    })
      .then(res => res.json())
      .then(data => console.log('Marcaj salvat:', data))
      .catch(err => console.error('Eroare marcaj:', err));
  };


  const commonOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { min: 0, max: 100 } },
  };

  return (
    <div className="testare-gradient">
      <LogoUSV />
      <Header />
      <h1 className="testare-title">Testare Live</h1>

      <div className="charts-grid">
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

      <div className="marcaje-buttons">
        <button className="btn-sincer" onClick={() => handleMarcaj('Sincer')}>Răspuns Sincer</button>
        <button className="btn-nesincer" onClick={() => handleMarcaj('Nesincer')}>Răspuns Nesincer</button>
        <button className="btn-control" onClick={() => handleMarcaj('Control')}>Întrebare Control</button>
      </div>

      <div className="marcaje-list">
        <h3>Marcaje înregistrate:</h3>
        <ul>
          {marcaje.map((m, index) => (
            <li key={index}>
              {m.tip} — Timp: {m.timestamp}
            </li>
          ))}
        </ul>
      </div>

      <div className="status-section">
        <button className="btn-stop" onClick={() => navigate('/dashboard')}>Oprește Testarea</button>
      </div>
    </div>
  );
};

export default TestareLive;
