import React, { useState } from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/statistici.css';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Statistici = () => {
  const allResults = [
    { id: 1, nume: 'Popescu', beneficiar: 'Firma X', data: '2025-06-03', raspunsuri: { sincer: 15, nesincer: 3, control: 2 } },
    { id: 2, nume: 'Ionescu', beneficiar: 'Politia', data: '2025-06-03', raspunsuri: { sincer: 10, nesincer: 5, control: 1 } },
    { id: 3, nume: 'Popescu', beneficiar: 'Firma X', data: '2025-06-01', raspunsuri: { sincer: 12, nesincer: 2, control: 1 } },
    { id: 4, nume: 'Stan', beneficiar: 'Firma Y', data: '2025-05-30', raspunsuri: { sincer: 9, nesincer: 1, control: 0 } },
  ];

  const [filters, setFilters] = useState({ nume: '', beneficiar: '', data: '' });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredResults = allResults.filter(r =>
    (filters.nume === '' || r.nume === filters.nume) &&
    (filters.beneficiar === '' || r.beneficiar === filters.beneficiar) &&
    (filters.data === '' || r.data === filters.data)
  );

  const total = filteredResults.reduce((acc, r) => ({
    sincer: acc.sincer + r.raspunsuri.sincer,
    nesincer: acc.nesincer + r.raspunsuri.nesincer,
  }), { sincer: 0, nesincer: 0 });

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
