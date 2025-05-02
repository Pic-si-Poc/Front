import React from 'react';
import logo from '../assets/Sigla-USV.png'; // Asigură-te că ai redenumit imaginea corect

const LogoUSV = () => (
  <div className="absolute top-10 left-10">
    <img src={logo} alt="Sigla USV" className="h-28 w-auto" />
  </div>
);

export default LogoUSV;
