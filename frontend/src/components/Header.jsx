import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      navigate('/'); // redirect către login
    } catch (err) {
      console.error('Eroare la logout:', err);
    }
  };

  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={handleLogout}
        className="p-2 bg-red-600 hover:bg-red-700 rounded-full shadow-lg text-white"
      >
        <LogOut size={24} />
      </button>
    </div>
  );
};

export default Header;
