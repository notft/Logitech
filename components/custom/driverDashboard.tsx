/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useState,useEffect } from 'react';

interface Package {
  id: string;
  orderId: string;
  destination: string;
  recipient: string;
  status: 'pending' | 'in-transit' | 'delivered';
  eta: string;
  orderDate: string; 
}

interface DriverProfile {
  name: string;
  id: string;
  rating: number;
  completedDeliveries: number;
  vehicleInfo: string;
}

const DriverDashboard: React.FC = () => {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const driverProfile: DriverProfile = {
    name: "John Doe",
    id: "DR-12345",
    rating: 4.8,
    completedDeliveries: 342,
    vehicleInfo: "Toyota Corolla (2020) - ABC1234"
  };

  const packages: Package[] = [
    {
      id: "PKG-001",
      orderId: "ORD-56789",
      destination: "123 Main St, Anytown",
      recipient: "Alice Smith",
      status: "in-transit",
      eta: "15 mins",
      orderDate: "March 20, 2025",
    },
    {
      id: "PKG-002",
      orderId: "ORD-56789",
      destination: "456 Oak Ave, Somewhere",
      recipient: "Bob Johnson",
      status: "pending",
      eta: "35 mins",
      orderDate: "March 20, 2025",
    },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMapLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-gray-200">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Driver Dashboard</h1>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded hover:bg-slate-700"
          >
            <span>{driverProfile.name}</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              {driverProfile.name.charAt(0)}
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Map Area */}
        <div className="flex-grow p-4">
          <div className="bg-slate-900 rounded-lg shadow-md h-full flex flex-col border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Navigation Map</h2>
            </div>
            <div className="flex-grow relative">
              {isMapLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                </div>
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center border-2 border-dashed border-gray-600">
                  <div className="text-gray-400">
                    Map will be displayed here
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Package Details & Settings */}
        <div className="w-80 bg-slate-900 border-l border-gray-700 overflow-y-auto">
          {showSettings ? (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Profile Settings</h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-400"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl mb-2">
                    {driverProfile.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-xl">{driverProfile.name}</h3>
                  <p className="text-gray-400">ID: {driverProfile.id}</p>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span>Rating:</span>
                    <span className="font-semibold">{driverProfile.rating} ⭐</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Completed:</span>
                    <span className="font-semibold">{driverProfile.completedDeliveries} deliveries</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle:</span>
                    <span className="font-semibold">{driverProfile.vehicleInfo}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Package Details</h2>
              </div>

              <div className="space-y-4">
                {packages.map(pkg => (
                  <div key={pkg.id} className="border border-gray-700 rounded-lg p-3 hover:shadow-md bg-slate-800">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">Package {pkg.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        pkg.status === 'delivered' ? 'bg-green-800 text-green-300' :
                        pkg.status === 'in-transit' ? 'bg-blue-800 text-blue-300' :
                        'bg-yellow-800 text-yellow-300'
                      }`}>
                        {pkg.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><span className="text-gray-400">Order ID:</span> {pkg.orderId}</p>
                      <p><span className="text-gray-400">Order Date:</span> {pkg.orderDate}</p>
                      <p><span className="text-gray-400">To:</span> {pkg.recipient}</p>
                      <p><span className="text-gray-400">Address:</span> {pkg.destination}</p>
                      <p><span className="text-gray-400">ETA:</span> {pkg.eta}</p>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white text-sm py-1 px-2 rounded hover:bg-blue-700">
                        Navigate
                      </button>
                      <button className="flex-1 bg-gray-700 text-gray-300 text-sm py-1 px-2 rounded hover:bg-gray-600">
                        Details
                      </button>
                    </div>
                  </div>
                ))}

                <button className="w-full py-3 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 flex items-center justify-center">
                  Load More Packages
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
