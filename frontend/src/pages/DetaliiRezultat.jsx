import React, { useEffect, useState } from 'react';
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
  const { id } = useParams(); // id_exam
  const navigate = useNavigate();
  const [examinare, setExaminare] = useState(null);
  const [date, setDate] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExaminare = async () => {
      try {
        const res1 = await fetch(`http://localhost:5000/api/examinare`);
        const all = await res1.json();
        const exam = all.examinari.find((e) => e.id_exam === id);
        setExaminare(exam);
      } catch (err) {
        console.error('Eroare la preluare examinare:', err);
      }
    };

    const fetchDate = async () => {
      try {
        const res2 = await fetch(`http://localhost:5000/api/date`);
        const allDate = await res2.json();
        const dateFiltrate = allDate.date.filter((d) => d.id_exam === id);
        setDate(dateFiltrate);
      } catch (err) {
        console.error('Eroare la preluare date:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExaminare();
    fetchDate();
  }, [id]);

  const labels = date.map((_, idx) => idx + 1);
  const emgData = date.map((d) => d.valoare_emg);
  const ecgData = date.map((d) => d.valoare_ecg);
  const umiditateData = date.map((d) => d.valoare_umiditate);
  const temperatura = (36 + Math.random() * 2).toFixed(2);

  const handleDownload = () => {
    const exportData = {
      idTest: id,
      ...examinare,
      rezultate: { emgData, ecgData, umiditateData, temperatura },
    };
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
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

  if (loading) return <p style={{ color: 'white' }}>Se încarcă datele...</p>;

  return (
    <div className="detalii-gradient">
      <LogoUSV />
      <Header />
      <h1 className="detalii-title">Detalii Test #{id}</h1>

      {examinare && (
        <div className="info-box">
          <p><strong>ID Examinat:</strong> {examinare.id_examinat}</p>
          <p><strong>Beneficiar:</strong> {examinare.nume_beneficiar}</p>
          <p><strong>Data Start:</strong> {new Date(examinare.data_start).toLocaleString()}</p>
          <p><strong>Data Final:</strong> {new Date(examinare.data_end).toLocaleString()}</p>
        </div>
      )}

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
