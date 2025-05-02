import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-4 right-4">
      <button
  onClick={() => {
    console.log('Se apasă butonul');
    navigate('/');
  }}
  className="p-2 bg-red-600 hover:bg-red-700 rounded-full shadow-lg text-white"
>
  <LogOut size={24} />
</button>

      {/*<button
        onClick={() => navigate('/')}
        className="p-2 bg-red-600 hover:bg-red-700 rounded-full shadow-lg text-white"
      >
        <LogOut size={24} />
      </button>*/}
    </div>
  );
};

export default Header;
