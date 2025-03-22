"use client"

import React, { useState } from 'react';


interface Order {
  id: string;
  destination: string;
  items: string[];
  status: 'pending' | 'processing' | 'in-transit' | 'delivered';
  createdAt: string;
  estimatedDelivery: string;
  driver?: string;
}

const CompanyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'newOrder'>('orders');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      destination: "123 Main St, Anytown",
      items: ["Package A", "Package B"],
      status: "in-transit",
      createdAt: "2025-03-21T14:30:00",
      estimatedDelivery: "2025-03-23",
      driver: "John Doe"
    },
    {
      id: "ORD-002",
      destination: "456 Oak Ave, Somewhere",
      items: ["Package C"],
      status: "pending",
      createdAt: "2025-03-22T09:15:00",
      estimatedDelivery: "2025-03-24"
    },
    {
      id: "ORD-003",
      destination: "789 Pine Rd, Elsewhere",
      items: ["Package D", "Package E", "Package F"],
      status: "delivered",
      createdAt: "2025-03-20T11:45:00",
      estimatedDelivery: "2025-03-22",
      driver: "Jane Smith"
    }
  ]);

  // Form state for new order
  const [newOrderForm, setNewOrderForm] = useState({
    destination: '',
    items: '',
    priority: 'standard'
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOrderForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const res = fetch("/api/company/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrderForm),
      });
    }catch(e){
      console.error(e);

    }
    setActiveTab('orders');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'in-transit': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Company Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="py-2 pl-10 pr-4 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="font-bold">AC</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'orders' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
            onClick={() => setActiveTab('orders')}
          >
            Track Orders
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'newOrder' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
            onClick={() => setActiveTab('newOrder')}
          >
            Place New Order
          </button>
        </div>

        {/* Orders List */}
        {activeTab === 'orders' && (
          <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              
              {/* Orders Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">Total Orders</div>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">Pending</div>
                  <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">In Transit</div>
                  <div className="text-2xl font-bold">{orders.filter(o => o.status === 'in-transit').length}</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">Delivered</div>
                  <div className="text-2xl font-bold">{orders.filter(o => o.status === 'delivered').length}</div>
                </div>
              </div>
              
              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Order ID</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Destination</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Items</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Delivery</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                        <td className="py-3 px-4 font-medium">{order.id}</td>
                        <td className="py-3 px-4">{order.destination}</td>
                        <td className="py-3 px-4">{order.items.length} item(s)</td>
                        <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                        <td className="py-3 px-4">{formatDate(order.estimatedDelivery)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)} text-white`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-400 hover:text-blue-300 mr-2">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* New Order Form */}
        {activeTab === 'newOrder' && (
          <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Place New Order</h2>
              
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-300 mb-2">
                    Delivery Address
                  </label>
                  <input
                    id="destination"
                    name="destination"
                    type="text"
                    required
                    value={newOrderForm.destination}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full delivery address"
                  />
                </div>

                <div>
                  <label htmlFor="items" className="block text-sm font-medium text-gray-300 mb-2">
                    Items (comma separated)
                  </label>
                  <textarea
                    id="items"
                    name="items"
                    required
                    value={newOrderForm.items}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Package A, Package B, Package C"
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
                    Delivery Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={newOrderForm.priority}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="standard">Standard (2-3 days)</option>
                    <option value="express">Express (1-2 days)</option>
                    <option value="same-day">Same Day</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-4 pt-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 rounded-lg font-medium text-white hover:bg-blue-500 transition"
                  >
                    Submit Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="w-full sm:w-auto mt-3 sm:mt-0 px-6 py-3 bg-slate-700 rounded-lg font-medium text-white hover:bg-slate-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyDashboard;