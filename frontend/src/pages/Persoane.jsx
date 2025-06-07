import React, { useState } from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/persoane.css';

const Persoane = () => {
  const [persoane, setPersoane] = useState([
    { id: 1, nume: 'Popescu', prenume: 'Ion', cnp: '1234567890123' },
    { id: 2, nume: 'Ionescu', prenume: 'Maria', cnp: '9876543210987' },
    { id: 3, nume: 'Vasilescu', prenume: 'Andrei', cnp: '1111111111111' },
    { id: 4, nume: 'Stan', prenume: 'Laura', cnp: '2222222222222' },
    { id: 5, nume: 'Georgescu', prenume: 'Mihai', cnp: '3333333333333' },
    { id: 6, nume: 'Radu', prenume: 'Ana', cnp: '4444444444444' },
  ]);

  const [formData, setFormData] = useState({ nume: '', prenume: '', cnp: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [editPerson, setEditPerson] = useState(null);
  const [deletePerson, setDeletePerson] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.nume || !formData.prenume || !formData.cnp) return;
    const newPers = { ...formData, id: Date.now() };
    setPersoane([...persoane, newPers]);
    setFormData({ nume: '', prenume: '', cnp: '' });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSaveEdit = () => {
    setPersoane(persoane.map(p => p.id === editPerson.id ? editPerson : p));
    setEditPerson(null);
  };

  const handleConfirmDelete = () => {
    setPersoane(persoane.filter(p => p.id !== deletePerson.id));
    setDeletePerson(null);
  };

  const filtered = persoane
    .filter(p => p.nume.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.nume.localeCompare(b.nume));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexStart = (currentPage - 1) * itemsPerPage;
  const displayed = filtered.slice(indexStart, indexStart + itemsPerPage);

  return (
    <div className="persoane-gradient">
      <LogoUSV />
      <Header />
      <h1 className="persoane-title">Persoane înregistrate</h1>

      <div className="form-section">
        <form className="adauga-form" onSubmit={handleAdd}>
          <input type="text" name="nume" placeholder="Nume" value={formData.nume} onChange={handleChange} className="adauga-input" />
          <input type="text" name="prenume" placeholder="Prenume" value={formData.prenume} onChange={handleChange} className="adauga-input" />
          <input type="text" name="cnp" placeholder="CNP" value={formData.cnp} onChange={handleChange} className="adauga-input" />
          <button type="submit" className="adauga-btn">Adaugă Persoană</button>
        </form>

        <div className="search-container">
          <input
            type="text"
            placeholder="Caută după nume..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      <table className="persoane-table">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>CNP</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map(p => (
            <tr key={p.id}>
              <td>{p.nume}</td>
              <td>{p.prenume}</td>
              <td>{p.cnp}</td>
              <td>
                <button className="btn-edit" onClick={() => setEditPerson({ ...p })}>Editează</button>
                <button className="btn-delete" onClick={() => setDeletePerson(p)}>Șterge</button>
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

      {/* Modal Editare */}
      {editPerson && (
        <div className="modal">
          <div className="modal-content_edit">
            <h2 className='text-white'>Editare Persoană</h2>
            <input type="text" name="nume" value={editPerson.nume} onChange={(e) => setEditPerson({...editPerson, nume: e.target.value})} />
            <input type="text" name="prenume" value={editPerson.prenume} onChange={(e) => setEditPerson({...editPerson, prenume: e.target.value})} />
            <input type="text" name="cnp" value={editPerson.cnp} onChange={(e) => setEditPerson({...editPerson, cnp: e.target.value})} />
            <button onClick={handleSaveEdit} className="adauga-btn">Salvează</button>
            <button onClick={() => setEditPerson(null)} className="btn-delete">Anulează</button>
          </div>
        </div>
      )}

      {/* Modal Ștergere */}
      {deletePerson && (
        <div className="modal">
          <div className="modal-content_delete">
            <h2>Confirmare Ștergere</h2>
            <p>Sigur dorești să ștergi {deletePerson.nume} {deletePerson.prenume}?</p>
            <button onClick={handleConfirmDelete} className="btn-delete">Șterge</button>
            <button onClick={() => setDeletePerson(null)} className="adauga-btn">Anulează</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Persoane;
