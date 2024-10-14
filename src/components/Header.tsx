import React from 'react';
import { BarChart2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex items-center">
        <BarChart2 className="mr-2" size={24} />
        <h1 className="text-2xl font-bold">Orden de Venta</h1>
      </div>
    </header>
  );
};

export default Header;