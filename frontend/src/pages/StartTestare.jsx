import React from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/start_testare.css';
import { useNavigate } from 'react-router-dom';

const StartTestare = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/testare-live');
  };

  return (
    <div className="start-gradient">
      <LogoUSV />
      <Header />
      <h1 className="start-title">Start Testare</h1>

      <form className="start-form" onSubmit={handleSubmit}>
        <label>
          Selectează persoana:
          <select className="start-input">
            <option>Popescu Ion</option>
            <option>Ionescu Maria</option>
            <option>...</option>
          </select>
        </label>

        <label>
          Beneficiar:
          <input type="text" className="start-input" />
        </label>
        
        <label>
          Data Testării:
          <input type="date" className="start-input" />
        </label>

        <button type="submit" className="start-btn">Începe Testarea</button>
      </form>
    </div>
  );
};

export default StartTestare;
