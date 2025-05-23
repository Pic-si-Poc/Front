import React from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/start_testare.css';

const StartTestare = () => {
  return (
    <div className="start_testare-gradient">
      <LogoUSV />
      <Header />
      <h1 className="persoane-title">Testare Nouă</h1>
      
    </div>
  );
};

export default StartTestare;
