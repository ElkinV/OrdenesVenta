import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';

export interface Item {
  id: string;
  name: string;
  price: number;
}

interface ItemSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: Item) => void;
}

const ItemSelectionModal: React.FC<ItemSelectionModalProps> = ({ isOpen, onClose, onSelectItem }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchItems();
    }
  }, [isOpen]);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/items');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError('Error fetching items. Please check if the server is running and try again.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select an Item</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Search items..."
          className="w-full p-2 border rounded mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && <p className="text-center">Loading items...</p>}
        {error && (
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={fetchItems}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center mx-auto"
            >
              <RefreshCw size={18} className="mr-2" />
              Retry
            </button>
          </div>
        )}
        {!loading && !error && (
          <ul className="max-h-60 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <li
                  key={item.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                >
                  {item.name} - ${item.price.toFixed(2)}
                </li>
              ))
            ) : (
              <li className="p-2 text-center text-gray-500">No items found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ItemSelectionModal;