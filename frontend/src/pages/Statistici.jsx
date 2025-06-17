import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/statistici.css';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Statistici = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/check', { withCredentials: true })
      .then(res => {
        if (!res.data.loggedIn) {
          navigate('/');
        }
      });
  }, []);

  const [allResults, setAllResults] = useState([]);

  // Funcție de formatare sigură
  const formatResults = (rows = []) =>
    rows.map(r => ({
      id: r.id_exam,
      nume: r.nume || 'Necunoscut',
      beneficiar: r.beneficiar || 'Necunoscut',
      data: r.data || '',
      raspunsuri: {
        sincer: r.sincer ?? 0,
        nesincer: r.nesincer ?? 0,
        control: r.control ?? 0
      }
    }));

  useEffect(() => {
    axios.get('http://localhost:5000/api/examinare/statistici', { withCredentials: true })
      .then(res => {
        console.log('📊 Date statistici primite:', res.data);
        setAllResults(formatResults(res.data.statistici));
      })
      .catch(err => console.error('Eroare la încărcarea statisticilor:', err));
  }, []);

  const [filters, setFilters] = useState({ nume: '', beneficiar: '', data: '' });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredResults = allResults.filter(r =>
    (filters.nume === '' || r.nume === filters.nume) &&
    (filters.beneficiar === '' || r.beneficiar === filters.beneficiar) &&
    (filters.data === '' || r.data === filters.data)
  );

  const total = filteredResults.reduce((acc, r) => {
    const rasp = r.raspunsuri || { sincer: 0, nesincer: 0 };
    return {
      sincer: acc.sincer + rasp.sincer,
      nesincer: acc.nesincer + rasp.nesincer
    };
  }, { sincer: 0, nesincer: 0 });

  const data = {
    labels: ['Sincer', 'Nesincer'],
    datasets: [
      {
        data: [total.sincer, total.nesincer],
        backgroundColor: ['#8ace00', '#800020'],
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        bodyColor: 'white',
        titleColor: 'white',
      },
    },
  };

  return (
    <div className="statistici-gradient">
      <LogoUSV />
      <Header />
      <h1 className="statistici-title">Statistici Rezultate</h1>

      <div className="filters">
        <select name="nume" value={filters.nume} onChange={handleChange} className="filter-select">
          <option value="">Toate persoanele</option>
          {[...new Set(allResults.map(r => r.nume))].map(nume => (
            <option key={nume} value={nume}>{nume}</option>
          ))}
        </select>

        <select name="beneficiar" value={filters.beneficiar} onChange={handleChange} className="filter-select">
          <option value="">Toți beneficiarii</option>
          {[...new Set(allResults.map(r => r.beneficiar))].map(beneficiar => (
            <option key={beneficiar} value={beneficiar}>{beneficiar}</option>
          ))}
        </select>

        <select name="data" value={filters.data} onChange={handleChange} className="filter-select">
          <option value="">Toate datele</option>
          {[...new Set(allResults.map(r => r.data))].map(data => (
            <option key={data} value={data}>{data}</option>
          ))}
        </select>
      </div>

      <div className="chart-box">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default Statistici;
