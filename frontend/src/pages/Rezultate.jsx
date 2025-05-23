import React from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/rezultate.css';

const Rezultate = () => {
  return (
    <div className="rezultate-gradient">
      <LogoUSV />
      <Header />
      <h1 className="persoane-title">Rezultate</h1>
      
    </div>
  );
};

export default Rezultate;
