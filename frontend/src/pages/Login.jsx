import React from 'react';
import '../styles/login.css';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';

import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="login-gradient">
      <LogoUSV />
      <h1 className="login-title text-neon absolute top-20">PoliTest</h1>
      <h2 className="login-text absolute top-40 right-10">Proiect realizat de: Andronic Delia-Dumitrița   </h2>
      <h2 className="login-text absolute top-48 right-16">Enache Ilinca-Maria    </h2>
      <h2 className="login-text absolute top-60 right-10">Profesor îndrumător: ș.l. dr. inf. Laura-Bianca Bilius</h2>
      <form className="login-form">
        <input type="text" placeholder="Utilizator" className="login-input" />
        <input type="password" placeholder="Parolă" className="login-input" />
        <button onClick={() => navigate('/dashboard')} type="submit" className="login-button">Autentificare</button>
      </form>
    </div>
  );
};

export default Login;
