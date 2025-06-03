import React from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/statistici.css';
import { Users, CheckCircle, XCircle, ClipboardList } from 'lucide-react';

const Statistici = () => {
  return (
    <div className="statistici-gradient">
      <LogoUSV />
      <Header />
      <h1 className="statistici-title">Statistici generale</h1>

      <div className="statistici-grid">
        <div className="stat-card">
          <Users size={40} />
          <h2>Total Persoane</h2>
          <p>24</p>
        </div>

        <div className="stat-card">
          <ClipboardList size={40} />
          <h2>Total Teste</h2>
          <p>35</p>
        </div>

        <div className="stat-card">
          <CheckCircle size={40} />
          <h2>Rezultate Negative</h2>
          <p>28</p>
        </div>

        <div className="stat-card">
          <XCircle size={40} />
          <h2>Rezultate Pozitive</h2>
          <p>7</p>
        </div>
      </div>
    </div>
  );
};

export default Statistici;
