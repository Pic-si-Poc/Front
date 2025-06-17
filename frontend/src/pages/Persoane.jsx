import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/persoane.css';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const Persoane = () => {
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
  const [formData, setFormData] = useState({
    nume: '', prenume: '', email: '', nr_tel: '', cnp: '', data_nastere: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [editPerson, setEditPerson] = useState(null);
  const [deletePerson, setDeletePerson] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/persoane')
      .then(res => setPersoane(res.data.persoane))
      .catch(err => console.error('Eroare la fetch persoane:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const nouaPers = { id_pers: uuidv4(), ...formData };
    try {
      await axios.post('http://localhost:5000/api/persoane', nouaPers);
      setPersoane([...persoane, nouaPers]);
      setFormData({ nume: '', prenume: '', email: '', nr_tel: '', cnp: '', data_nastere: '' });
    } catch (err) {
      console.error('Eroare la adăugare persoană:', err);
    }
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/persoane/${editPerson.id_pers}`, editPerson);
      setPersoane(persoane.map(p => p.id_pers === editPerson.id_pers ? editPerson : p));
      setEditPerson(null);
    } catch (err) {
      console.error('Eroare la salvare editare:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/persoane/${deletePerson.id_pers}`);
      setPersoane(persoane.filter(p => p.id_pers !== deletePerson.id_pers));
      setDeletePerson(null);
    } catch (err) {
      console.error('Eroare la ștergere:', err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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
      <div className='persoane-continut'>
        <div className="form-section">
          <form className="adauga-form" onSubmit={handleAdd}>
            <input className='adauga-input' name="nume" placeholder="Nume" value={formData.nume} onChange={handleChange} required />
            <input className='adauga-input' name="prenume" placeholder="Prenume" value={formData.prenume} onChange={handleChange} required />
            <input className='adauga-input' name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input className='adauga-input' name="nr_tel" placeholder="Telefon" value={formData.nr_tel} onChange={handleChange} required />
            <input className='adauga-input' name="cnp" placeholder="CNP" value={formData.cnp} onChange={handleChange} required />
            <input className='adauga-input' name="data_nastere" type="date" value={formData.data_nastere} onChange={handleChange} required />
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
              <th>Email</th>
              <th>Telefon</th>
              <th>CNP</th>
              <th>Data Naștere</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map(p => (
              <tr key={p.id_pers}>
                <td>{p.nume}</td>
                <td>{p.prenume}</td>
                <td>{p.email}</td>
                <td>{p.nr_tel}</td>
                <td>{p.cnp}</td>
                <td>{p.data_nastere}</td>
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
      </div>
      {editPerson && (
        <div className="modal">
          <div className="modal-content_edit">
            <h2>Editare Persoană</h2>
            <input name="nume" value={editPerson.nume} onChange={e => setEditPerson({ ...editPerson, nume: e.target.value })} />
            <input name="prenume" value={editPerson.prenume} onChange={e => setEditPerson({ ...editPerson, prenume: e.target.value })} />
            <input name="email" value={editPerson.email} onChange={e => setEditPerson({ ...editPerson, email: e.target.value })} />
            <input name="nr_tel" value={editPerson.nr_tel} onChange={e => setEditPerson({ ...editPerson, nr_tel: e.target.value })} />
            <input name="cnp" value={editPerson.cnp} onChange={e => setEditPerson({ ...editPerson, cnp: e.target.value })} />
            <input name="data_nastere" type="date" value={editPerson.data_nastere} onChange={e => setEditPerson({ ...editPerson, data_nastere: e.target.value })} />
            <button onClick={handleEditSave} className="adauga-btn">Salvează</button>
            <button onClick={() => setEditPerson(null)} className="btn-delete">Anulează</button>
          </div>
        </div>
      )}

      {deletePerson && (
        <div className="modal">
          <div className="modal-content_delete">
            <h2>Confirmare Ștergere</h2>
            <p>Sigur dorești să ștergi {deletePerson.nume} {deletePerson.prenume}?</p>
            <button onClick={handleDeleteConfirm} className="btn-delete">Șterge</button>
            <button onClick={() => setDeletePerson(null)} className="adauga-btn">Anulează</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Persoane;
