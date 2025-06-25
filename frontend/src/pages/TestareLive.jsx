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
          navigate('/');
        }
      });
  }, []);

  const [labels, setLabels] = useState([]);
  const [emgData, setEmgData] = useState([]);
  const [ecgData, setEcgData] = useState([]);
  const [umiditateData, setUmiditateData] = useState([]);
  const [temperatura, setTemperatura] = useState(36);
  const [marcaje, setMarcaje] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [aiPrediction, setAiPrediction] = useState(null);

  const bufferRef = useRef({ labels: [], emg: [], ecg: [], umiditate: [] });
  const aiBufferRef = useRef({ ecg: [], emg: [], temp: [], humidity: [], start_time: null });
  const windowSize = 100;
  const timeRef = useRef(0);
  const startTimestampRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get("http://localhost:5000/api/live-data").then((res) => {
        const { ecg, emg, humidity, temperature } = res.data;

        if (ecg == null || emg == null || humidity == null || temperature == null) return;

        timeRef.current += 0.1;

        bufferRef.current.labels.push(timeRef.current.toFixed(1));
        bufferRef.current.emg.push(parseInt(emg));
        bufferRef.current.ecg.push(parseInt(ecg));
        bufferRef.current.umiditate.push(parseFloat(humidity));
        setTemperatura(parseFloat(temperature).toFixed(2));

        if (bufferRef.current.labels.length > windowSize) {
          bufferRef.current.labels.shift();
          bufferRef.current.emg.shift();
          bufferRef.current.ecg.shift();
          bufferRef.current.umiditate.shift();
        }

        if (isCapturing) {
          aiBufferRef.current.ecg.push(parseInt(ecg));
          aiBufferRef.current.emg.push(parseInt(emg));
          aiBufferRef.current.temp.push(parseFloat(temperature));
          aiBufferRef.current.humidity.push(parseFloat(humidity));
        }
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isCapturing]);

  useEffect(() => {
    const intervalRender = setInterval(() => {
      setLabels([...bufferRef.current.labels]);
      setEmgData([...bufferRef.current.emg]);
      setEcgData([...bufferRef.current.ecg]);
      setUmiditateData([...bufferRef.current.umiditate]);
    }, 100);
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
      });
    }, 100);
    return () => clearInterval(intervalSend);
  }, [id_exam]);

  const handleStartCapture = () => {
    setIsCapturing(true);
    aiBufferRef.current = {
      ecg: [],
      emg: [],
      temp: [],
      humidity: [],
      start_time: new Date().toISOString()
    };

    setTimeout(async () => {
      const sample = {
        ecg_data: aiBufferRef.current.ecg,
        emg_data: aiBufferRef.current.emg,
        temp_data: aiBufferRef.current.temp,
        humidity_data: aiBufferRef.current.humidity
      };

      try {
        const res = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sample)
        });
        const data = await res.json();
        setAiPrediction(data.predictie);
        setTimeout(() => setAiPrediction(null), 4000);
      } catch (err) {
        console.error("Eroare la trimiterea către AI:", err);
      }
    }, 4000);
  };

  const handleMarcaj = async (tip) => {
    const timestamp = new Date().toISOString();
    const elapsed = Date.now() - startTimestampRef.current;
    const afisajTimp = new Date(elapsed).toISOString().substr(11, 8);

    setMarcaje((prev) => [...prev, { timestamp: afisajTimp, tip }]);

    await fetch('http://localhost:5000/api/marcaje', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_exam, timestamp, tip })
    });

    if (isCapturing) {
      const aiSample = {
        id_exam,
        start_time: aiBufferRef.current.start_time,
        end_time: new Date().toISOString(),
        label: tip.toLowerCase(),
        ecg_data: aiBufferRef.current.ecg,
        emg_data: aiBufferRef.current.emg,
        temp_data: aiBufferRef.current.temp,
        humidity_data: aiBufferRef.current.humidity
      };

      await fetch('http://localhost:5000/api/ai-sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiSample)
      });

      setIsCapturing(false);
    }
  };

  const commonX = {
    type: 'linear',
    title: { display: true, text: 'Timp (secunde)' },
    min: Math.max(0, timeRef.current - 10),
    max: timeRef.current,
  };

  return (
    <div className="testare-gradient">
      <LogoUSV />
      <Header />
      <h1 className="testare-title">Testare Live</h1>

      <div className="charts-grid">
        <div className="graph-container">
          <Line
            data={{ labels, datasets: [{ data: emgData, borderColor: '#00f5ff' }] }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: commonX,
                y: { min: 0, max: 250 }
              }
            }}
          />
          <p className="graph-label">EMG</p>
        </div>

        <div className="graph-container">
          <Line
            data={{ labels, datasets: [{ data: ecgData, borderColor: '#ff6384' }] }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: commonX,
                y: { min: 300, max: 800 }
              }
            }}
          />
          <p className="graph-label">ECG</p>
        </div>

        <div className="graph-container">
          <Line
            data={{ labels, datasets: [{ data: umiditateData, borderColor: '#36a2eb' }] }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: commonX,
                y: { min: 70, max: 100 }
              }
            }}
          />
          <p className="graph-label">Umiditate</p>
        </div>
      </div>

      <div className="temperature-box">
        <p className="temperature-label">Temperatură:</p>
        <p className="temperature-value">{temperatura} °C</p>
      </div>

      <div className="marcaje-buttons">
        <button className="btn-start" onClick={handleStartCapture}>Începe răspuns</button>
        <button className="btn-sincer" onClick={() => handleMarcaj('Sincer')}>Răspuns Sincer</button>
        <button className="btn-nesincer" onClick={() => handleMarcaj('Nesincer')}>Răspuns Nesincer</button>
        <button className="btn-control" onClick={() => handleMarcaj('Control')}>Întrebare Control</button>
      </div>

      {aiPrediction && (
        <div className="ai-predict-box">
          <p><strong>AI:</strong> Răspuns <em>{aiPrediction}</em></p>
        </div>
      )}

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
 