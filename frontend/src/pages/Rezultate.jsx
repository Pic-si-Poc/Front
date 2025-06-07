import React, { useState } from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/rezultate.css';
import { useNavigate } from 'react-router-dom';

const Rezultate = () => {
  const navigate = useNavigate();

  const initialResults = [
    { id: 1, nume: 'Popescu', prenume: 'Ion', beneficiar: 'SC Test Beneficiar 1', dataTestare: '2025-06-01' },
    { id: 2, nume: 'Ionescu', prenume: 'Maria', beneficiar: 'Firma X', dataTestare: '2025-06-02' },
    { id: 3, nume: 'Vasilescu', prenume: 'Andrei', beneficiar: 'Poliția Y', dataTestare: '2025-06-03' },
    { id: 4, nume: 'Georgescu', prenume: 'Elena', beneficiar: 'SC Test Beneficiar 2', dataTestare: '2025-06-04' },
    { id: 5, nume: 'Stan', prenume: 'Radu', beneficiar: 'Firma X', dataTestare: '2025-06-05' },
    { id: 6, nume: 'Dumitrescu', prenume: 'Ana', beneficiar: 'Firma Z', dataTestare: '2025-06-06' },
  ];

  const [rezultate, setRezultate] = useState(initialResults);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleDetalii = (id) => {
    navigate(`/rezultate/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filtered = rezultate
    .filter(r => r.nume.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.nume.localeCompare(b.nume));

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
            <tr key={r.id}>
              <td>{r.nume}</td>
              <td>{r.prenume}</td>
              <td>{r.beneficiar}</td>
              <td>{r.dataTestare}</td>
              <td>
                <button className="btn-detalii" onClick={() => handleDetalii(r.id)}>
                  Vezi Detalii
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
    </div>
  );
};

export default Rezultate;
