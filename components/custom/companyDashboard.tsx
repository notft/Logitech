"use client"

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';



interface Order {
  id: number; // Changed from string to number
  name: string;
  start_location: string;
  destination: string;
  type: string;
  status: 'pending' | 'processing' | 'in-transit' | 'delivered';
  created_at: string; // Changed from createdAt to created_at
  driver?: string;
}
const CompanyDashboard: React.FC = () => {
    const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'newOrder'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    // const token = Cookies.get("token")
    // if (!token) {
    //   router.push("/auth/login")
    //   return;
    // }
  

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/package", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          // The API returns an array directly instead of {orders: [...]}
          // So we need to use the data array directly
          setOrders(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch orders");
          
          // Fallback to local storage if API fails
          const localOrders = localStorage.getItem('companyOrders');
          if (localOrders) {
            setOrders(JSON.parse(localOrders));
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        
        // Fallback to local storage on error
        const localOrders = localStorage.getItem('companyOrders');
        if (localOrders) {
          setOrders(JSON.parse(localOrders));
        }
      } finally {
        setLoading(false);
      }
  };
      fetchOrders();
    }, [router]);

    useEffect(() => {
        if (orders.length > 0) {
          localStorage.setItem('companyOrders', JSON.stringify(orders));
        }
      }, [orders]);

  const [newOrderForm, setNewOrderForm] = useState({
    name:"",
    start_location: "",
    destination: "",
    type: "electronics",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOrderForm(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmitOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);


  const newOrder = {
    name: newOrderForm.name,
    startLocation: newOrderForm.start_location, 
    destination: newOrderForm.destination,
    type: newOrderForm.type,
  };

  try {
  
    const response = await fetch("/api/company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to place order");
  } catch (error) {
    console.error("❌ Error placing order:", error);
  }


    const createdOrder = {
        name:newOrderForm.name,
        id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
        start_location: newOrderForm.start_location,
        destination: newOrderForm.destination,
        type: newOrderForm.type,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
      };

    setOrders([createdOrder, ...orders]);
    setNewOrderForm({ name: "", start_location: "", destination: "", type: "" });
    setActiveTab("orders");

};


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

    const handleLogout = () => {
    
    Cookies.remove("token")
    Cookies.remove("user")
    Cookies.remove("session")

    setTimeout(() => {
      window.location.href = "/auth/login"
    }, 100)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Company Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            Logout  
          </button>
        </div>
      </header>

      
      <main className="container mx-auto py-6 px-4">
       
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

    
        {activeTab === 'orders' && (
          <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              
      
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
              
             
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Order ID</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Destination</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Items</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                        <td className="py-3 px-4 font-medium">{order.id}</td>
                        <td className="py-3 px-4">{order.destination}</td>
                        <td className="py-3 px-4">{order.type}</td>
                        <td className="py-3 px-4">{formatDate(order.createdAt)}</td>    
                        <td className="py-3 px-4">
                          
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
                {activeTab === "newOrder" && (
                <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Place New Order</h2>

                    <form onSubmit={handleSubmitOrder} className="space-y-6">
      
                        <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                            Order Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={newOrderForm.name}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter order name"
                        />
                        </div>

                        <div>
                        <label htmlFor="start_location" className="block text-sm font-medium text-gray-300 mb-2">
                            Start Location
                        </label>
                        <input
                            id="start_location"
                            name="start_location"
                            type="text"
                            required
                            value={newOrderForm.start_location}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter start location"
                        />
                        </div>

                        <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-300 mb-2">
                            Destination
                        </label>
                        <input
                            id="destination"
                            name="destination"
                            type="text"
                            required
                            value={newOrderForm.destination}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter delivery destination"
                        />
                        </div>

                        <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                            Order Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={newOrderForm.type}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="electronics">Electronics</option>
                            <option value="food">Food</option>
                            <option value="documents">Documents</option>
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
                            onClick={() => setActiveTab("orders")}
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