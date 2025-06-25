import React, { useEffect, useState } from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/rezultate.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Rezultate = () => {
  const navigate = useNavigate();
  const [rezultate, setRezultate] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/check', { withCredentials: true })
      .then(res => {
        if (!res.data.loggedIn) {
          navigate('/');
        }
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/examinare/rezultate')
      .then(res => {
        setRezultate(res.data.rezultate || []);
      })
      .catch(err => {
        console.error('Eroare la încărcarea rezultatelor:', err);
      });
  }, []);

  const handleDetalii = (id_exam) => {
    navigate(`/rezultate/${id_exam}`);
  };

  const handleSterge = (id_exam) => {
  setSelectedExamId(id_exam);
  setShowModal(true);
};

  const confirmStergere = async () => {
  try {
    await axios.delete(`http://localhost:5000/api/examinare/${selectedExamId}`);
    setRezultate(prev => prev.filter(r => r.id_exam !== selectedExamId));
  } catch (err) {
    console.error("Eroare la ștergere:", err);
  } finally {
    setShowModal(false);
    setSelectedExamId(null);
  }
};

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filtered = rezultate
    .filter(r => r.nume.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.data_start) - new Date(a.data_start));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexStart = (currentPage - 1) * itemsPerPage;
  const displayed = filtered.slice(indexStart, indexStart + itemsPerPage);

  return (
    <div className="rezultate-gradient">
      <LogoUSV />
      <Header />
      <h1 className="rezultate-title">Rezultate Teste</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Caută după nume..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <table className="rezultate-table">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Beneficiar</th>
            <th>Data Testării</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((r) => (
            <tr key={r.id_exam}>
              <td>{r.nume}</td>
              <td>{r.prenume}</td>
              <td>{r.nume_beneficiar}</td>
              <td>{new Date(r.dataTestare).toLocaleDateString()}</td>
              <td>
                <button className="btn-detalii" onClick={() => handleDetalii(r.id_exam)}>
                  Vezi Detalii
                </button>
                <button className="btn-sterge" onClick={() => handleSterge(r.id_exam)}>
                  Șterge
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
        <span>Pagina {currentPage} din {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmare Ștergere</h3>
            <p>Ești sigur că vrei să ștergi această examinare?</p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={confirmStergere}>Da, șterge</button>
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Anulează</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rezultate;
