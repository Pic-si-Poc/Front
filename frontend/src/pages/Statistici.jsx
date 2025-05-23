import React from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/statistici.css';

const Statistici = () => {
  return (
    <div className="statistici-gradient">
      <LogoUSV />
      <Header />
      <h1 className="statistici-title">Statistici</h1>
      
    </div>
  );
};

export default Statistici;
