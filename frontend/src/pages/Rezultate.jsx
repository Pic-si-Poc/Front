import React from 'react';
import LogoUSV from '../components/LogoUSV';
import Header from '../components/Header';
import '../styles/rezultate.css';

const Rezultate = () => {
  return (
    <div className="rezultate-gradient">
      <LogoUSV />
      <Header />
      <h1 className="rezultate-title">Rezultate Teste</h1>
      <table className="rezultate-table">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Data Testării</th>
            <th>Rezultat</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Popescu</td>
            <td>Maria</td>
            <td>03.06.2025</td>
            <td>Negativ</td>
            <td>
              <button className="btn-detalii">Vezi detalii</button>
            </td>
          </tr>
          <tr>
            <td>Ionescu</td>
            <td>Andrei</td>
            <td>01.06.2025</td>
            <td>Pozitiv</td>
            <td>
              <button className="btn-detalii">Vezi detalii</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Rezultate;
