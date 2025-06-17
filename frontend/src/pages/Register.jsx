import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import { Eye, EyeOff } from 'lucide-react';


const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error] = useState('');

  const handleRegister = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert('Parolele nu se potrivesc');
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      email: email,
      parola: password
    });

    console.log('Cont creat:', response.data);
    navigate('/'); // redirecționează spre login
  } catch (err) {
    console.error('Eroare la creare cont:', err.response?.data || err.message);
    alert('Eroare la înregistrare');
  }
};


  return (
    <div className="login-gradient">
      <LogoUSV />
      <Header />
      <div className="login-container">
        <h2 className="login-title">Creare Cont</h2>
        <form className="login-form" onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            className='login-input'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Parolă"
              className='login-input'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              className='login-input'
              placeholder="Confirmă Parola"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">Creează cont</button>
        </form>
        <p className="create-account-link">
          Ai deja un cont? <span onClick={() => navigate('/login')}>Autentifică-te</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
