import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/detalii.css';
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

const DetaliiRezultat = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simulăm datele reale:
  const labels = Array.from({ length: 20 }, (_, i) => i + 1);
  const emgData = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
  const ecgData = Array.from({ length: 20 }, () => 50 + Math.floor(Math.random() * 50));
  const umiditateData = Array.from({ length: 20 }, () => 20 + Math.floor(Math.random() * 30));
  const temperatura = (36 + Math.random() * 2).toFixed(2);

  const dataExport = {
    idTest: id,
    nume: 'Popescu',
    prenume: 'Ion',
    beneficiar: 'Firma X',
    dataTestare: new Date().toLocaleDateString(),
    rezultate: {
      emg: emgData,
      ecg: ecgData,
      umiditate: umiditateData,
      temperatura: temperatura
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(dataExport, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `RezultatTest_${id}.json`;
    document.body.appendChild(element);
    element.click();
  };

  const commonOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { min: 0, max: 100 } },
  };

  return (
    <div className="detalii-gradient">
      <LogoUSV />
      <Header />
      <h1 className="detalii-title">Detalii Test #{id}</h1>

      <div className="info-box">
        <p><strong>Nume:</strong> {dataExport.nume}</p>
        <p><strong>Prenume:</strong> {dataExport.prenume}</p>
        <p><strong>Beneficiar:</strong> {dataExport.beneficiar}</p>
        <p><strong>Data Testare:</strong> {dataExport.dataTestare}</p>
      </div>

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
        <button className="btn-download" onClick={handleDownload}>Descarcă Rezultatul</button>
        <button className="btn-stop" onClick={() => navigate('/rezultate')}>Înapoi la Rezultate</button>
      </div>
    </div>
  );
};

export default DetaliiRezultat;
