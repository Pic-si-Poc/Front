import React, { useState } from 'react';
import '../styles/login.css';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [eroare, setEroare] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEroare('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        parola
      }, { withCredentials: true });

      console.log('Login reușit:', response.data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Eroare login:', err.response?.data || err.message);
      setEroare('Email sau parolă incorectă');
    }
  };

  return (
    <div className="login-gradient">
      <LogoUSV />
      <h1 className="login-title text-neon absolute top-20">PoliTest</h1>
      <h2 className="login-text absolute top-40 right-10">Proiect realizat de: Andronic Delia-Dumitrița   </h2>
      <h2 className="login-text absolute top-48 right-16">Enache Ilinca-Maria    </h2>
      <h2 className="login-text absolute top-60 right-10">Profesor îndrumător: ș.l. dr. inf. Laura-Bianca Bilius</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Utilizator (Email)"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative w-full">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Parolă"
            className="login-input pr-10"
            value={parola}
            onChange={(e) => setParola(e.target.value)}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {eroare && <p className="text-red-400 text-sm mt-2 text-center">{eroare}</p>}

        <button type="submit" className="login-button">Autentificare</button>
      </form>

      <p className="create-account-link">
        Nu ai cont? <span onClick={() => navigate('/register')}>Creează unul</span>
      </p>
    </div>
  );
};

export default Login;
