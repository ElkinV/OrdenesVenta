import React from 'react';
import { SalesOrder } from '../types';

interface SalesOrderListProps {
  salesOrders: SalesOrder[];
}

const SalesOrderList: React.FC<SalesOrderListProps> = ({ salesOrders }) => {
  return (
    <div className="space-y-4">
      {salesOrders.length === 0 ? (
        <p className="text-center text-gray-500">No sales orders yet.</p>
      ) : (
        salesOrders.map((order) => (
          <div key={order.id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{order.customerName}</h3>
              <span className="text-sm text-gray-500">
                {new Date(order.date).toLocaleDateString()}
              </span>
            </div>
            <ul className="list-disc list-inside mb-2">
              {order.items.map((item, index) => (
                <li key={index} className="text-sm">
                  {item.name} - Quantity: {item.quantity}, Price: ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="text-right font-semibold">
              Total: ${order.total.toFixed(2)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SalesOrderList;