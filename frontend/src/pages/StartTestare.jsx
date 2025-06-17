import React, { useState, useEffect } from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/start_testare.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StartTestare = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/check', { withCredentials: true })
      .then(res => {
        if (!res.data.loggedIn) {
          navigate('/'); // redirecționează spre login dacă nu e logat
        }
      });
  }, []);
  const [persoane, setPersoane] = useState([]);
  const [persoana, setPersoana] = useState('');
  const [data, setData] = useState('');
  const [beneficiar, setBeneficiar] = useState('');

  // Fetch automat persoane din backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/persoane')
      .then((res) => {
        setPersoane(res.data.persoane || []);
      })
      .catch((err) => {
        console.error('Eroare la încărcarea persoanelor:', err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!persoana || !beneficiar) {
      alert('Te rugăm să completezi toate câmpurile.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/examinare/start', {
        id_examinat: persoana,
        nume_beneficiar: beneficiar,
        data_exam: data
      });

      const id_exam = response.data.id_exam;
      navigate('/testare-live', { state: { id_exam } });

    } catch (err) {
      console.error('Eroare la start testare:', err);
    }
  };

  return (
    <div className="start-gradient">
      <LogoUSV />
      <Header />
      <h1 className="start-title">Start Testare</h1>

      <form className="start-form" onSubmit={handleSubmit}>
        <label>
          Selectează persoana:
          <select
            className="start-input"
            value={persoana}
            onChange={(e) => setPersoana(e.target.value)}
            required
          >
            <option value="">-- Selectează --</option>
            {persoane.map((p) => (
              <option key={p.id_pers} value={p.id_pers}>
                {p.nume} {p.prenume}
              </option>
            ))}
          </select>
        </label>

        <label>
          Data Testării:
          <input
            type="date"
            className="start-input"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </label>

        <label>
          Beneficiar:
          <input
            type="text"
            className="start-input"
            value={beneficiar}
            onChange={(e) => setBeneficiar(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="start-btn">
          Începe Testarea
        </button>
      </form>
    </div>
  );
};

export default StartTestare;
