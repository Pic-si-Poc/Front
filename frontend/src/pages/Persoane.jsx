import React from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/persoane.css';

const Persoane = () => {
  return (
    <div className="persoane-gradient">
      <LogoUSV />
      <Header />
      <h1 className="persoane-title">Persoane înregistrate</h1>
      <table className="absolute top-40 persoane-table">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>CNP</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Popescu</td>
            <td>Ion</td>
            <td>1234567890123</td>
            <td>
              <button className="btn-edit">Editează</button>
              <button className="btn-delete">Șterge</button>
            </td>
          </tr>
          {/* Mai multe rânduri pot fi adăugate aici */}
        </tbody>
      </table>
    </div>
  );
};

export default Persoane;
