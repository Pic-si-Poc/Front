import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Persoane from './pages/Persoane';
import Rezultate from './pages/Rezultate';
import Statistici from './pages/Statistici';
import StartTestare from './pages/StartTestare';
import TestareLive from './pages/TestareLive';
import DetaliiRezultat from './pages/DetaliiRezultat';
import Register from './pages/Register';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/persoane" element={<Persoane />} />
      <Route path="/rezultate" element={<Rezultate />} />
      <Route path="/statistici" element={<Statistici />} />
      <Route path="/start-testare" element={<StartTestare />} />
      <Route path="/testare-live" element={<TestareLive />} />
      <Route path="/rezultate/:id" element={<DetaliiRezultat />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
