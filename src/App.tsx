import React, { useState } from 'react';
import { Package, List } from 'lucide-react';
import Header from './components/Header';
import SalesOrderForm from './components/SalesOrderForm';
import SalesOrderList from './components/SalesOrderList';
import { SalesOrder } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'create' | 'view'>('create');
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);

  const handleCreateSalesOrder = (newOrder: SalesOrder) => {
    setSalesOrders([...salesOrders, { ...newOrder, id: Date.now() }]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center ${
                activeTab === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
              onClick={() => setActiveTab('create')}
            >
              <Package className="inline-block mr-2" />
              Create Sales Order
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center ${
                activeTab === 'view' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
              onClick={() => setActiveTab('view')}
            >
              <List className="inline-block mr-2" />
              View Sales Orders
            </button>
          </div>
          <div className="p-6">
            {activeTab === 'create' ? (
              <SalesOrderForm onCreateSalesOrder={handleCreateSalesOrder} />
            ) : (
              <SalesOrderList salesOrders={salesOrders} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;