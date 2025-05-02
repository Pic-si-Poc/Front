import React from 'react';
import '../styles/dashboard.css';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import { UserRound, ChartPie, BookOpen, Flag } from 'lucide-react';

import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const navigate = useNavigate();
  return (
    <div className="dashboard-gradient">
      <LogoUSV />
      <Header />
      <h1 className="dashboard-title absolute top-20">POLITEST</h1>
      <div className="dashboard-buttons">
        <button onClick={() => navigate('/persoane')} className="dash-btn"><UserRound />PERSOANE</button>
        <button onClick={() => navigate('/rezultate')} className="dash-btn"><BookOpen />REZULTATE</button>
        <button onClick={() => navigate('/statistici')} className="dash-btn"><ChartPie />STATISTICI</button>
        <button onClick={() => navigate('/start-testare')} className="dash-btn"><Flag />START TESTARE</button>
      </div>
    </div>
  );
};

export default Dashboard;
