"use client";
import React, { useState, useEffect, useMemo } from 'react';
// import MapDistance from '@/components/custom/MapDistance';
import dynamic from 'next/dynamic';
import {Button} from "@/components/ui/button"
import Cookies from "js-cookie";
import html2canvas from 'html2canvas-pro';
interface Package {
  id: string;
  destination: string;
  recipient: string;
  status: 'pending' | 'in-transit' | 'delivered';
  eta: string;
  orderDate: string;
  name: string;
  created_at: string;
  start_location: string;
}

interface DriverProfile {
  name: string;
  id: string;
  rating: number;
  completedDeliveries: number;
  vehicleInfo: string;
}

const DriverDashboard: React.FC = () => {
  const Map = useMemo(() => dynamic(
    () => import('@/components/custom/Map'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [packageList, setPackageList] = useState<Package[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [formData, setFormData] = useState<{ distance: string | null }>({ distance: null });
  const [startLoc, setStartLoc] = useState<string | null>(null);
  const [endLoc, setEndLoc] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const [drivername, setDriverName] = useState("");
  const [loading, setLoading] = useState(false);

  const driverProfile = {
    name: drivername,
  };


  const fetchPackage = async () => {
    try {
      const response = await fetch("/api/package");
      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }
      const data = await response.json();
      setPackageList(data);
    } catch (err) {
      setError("No orders found");
    }
  };
const userId =Cookies.get("ussrId")
  const fetchDriver = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user?ussrID=${userId}`);
      if (!res.ok) throw new Error("Driver not found");
      const data = await res.json();
      setDriverName(data.username || "Unknown Driver");
      setError(null);
    } catch (err) {
      setError("Driver not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackage();
    fetchDriver();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMapLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    if (startLoc && endLoc) {
      console.log("Navigation points set:", { startLoc, endLoc });
      setShowMap(true);
    }
  }, [startLoc, endLoc]);

  const handleNavigate = (pkg: Package) => {
    console.log("Navigate clicked for package:", pkg.id);
    setSelectedPackage(pkg);
    setStartLoc(null);
    setEndLoc(null);
    setTimeout(() => {
      if (pkg.start_location && pkg.destination) {
        setStartLoc(pkg.start_location);
        setEndLoc(pkg.destination);
        setShowMap(true);
      } else {
        console.error("Missing location data for package:", pkg.id);
      }
    }, 50);
  };

  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  const calculateRoute = async () => {
    html2canvas(document.getElementById("map-container")!, { useCORS: true, allowTaint: true }).then(async (canvas) => {
      const imgBase64 = canvas.toDataURL("image/png").split(",")[1];
      const blob = base64ToBlob(imgBase64, "image/png");
    
      const formData = new FormData();
      formData.append("file", blob, "screenshot.png"); // Provide a filename
    
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        alert("Image uploaded to Cloudinary: " + result.imgUrl);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    });
  };
  

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-gray-200">
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
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-grow p-4">
          <div className="bg-slate-900 rounded-lg shadow-md h-full flex flex-col border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Navigation Map</h2>
              {selectedPackage && (
                <div className="text-sm text-blue-400">
                  Navigating to: {selectedPackage.destination}
                </div>
              )}
            </div>
            <div className="flex-grow relative">
              {isMapLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p>Loading map...</p>
                </div>
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center border-2 border-dashed border-gray-600"
                id="map-container"
                >
                  {showMap && startLoc && endLoc ? (
                    <Map
                      key={`${startLoc}-${endLoc}`} // Add key to force re-render when locations change
                      startLoc={startLoc}
                      endLoc={endLoc}
                      onDistanceCalculated={(distance) => {
                        console.log("Distance calculated:", distance);
                        setFormData({ distance: distance.toFixed(2) });
                      }}
                      onClose={() => {
                        console.log("Map closed");
                        setShowMap(false);
                        setStartLoc(null);
                        setEndLoc(null);
                        setSelectedPackage(null);
                      }}
                    />
                  ) : (
                    <div className="text-center p-4">
                      <p className="mb-2">Select a package to navigate</p>
                      {formData.distance && (
                        <p className="text-green-400">
                          Last calculated distance: {formData.distance} miles
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
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
                  <h3 className="font-semibold text-xl">{drivername}</h3>
                  <p className="text-gray-400">ID: DVRID-827</p>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span>Rating:</span>
                    <span className="font-semibold">4 ⭐</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Completed:</span>
                    <span className="font-semibold">87 deliveries</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <Button onClick={()=>{Cookies.remove("token");Cookies.remove("ussrId");window.location.href = "/auth/login"}}>Logout</Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Package Details</h2>
              </div>

              {error ? (
                <div className="bg-red-900 text-red-200 p-3 rounded-lg">
                  {error}
                </div>
              ) : packageList.length === 0 ? (
                <div className="bg-slate-800 p-3 rounded-lg text-center">
                  Loading packages...
                </div>
              ) : (
                <div className="space-y-4">
                  {packageList.map(pkg => (
                    <div key={pkg.id} className={`border rounded-lg p-3 hover:shadow-md bg-slate-800 ${
                      selectedPackage?.id === pkg.id ? 'border-blue-500' : 'border-gray-700'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold">Package {pkg.id}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${pkg.status === 'delivered' ? 'bg-green-800 text-green-300' :
                          pkg.status === 'in-transit' ? 'bg-blue-800 text-blue-300' :
                            'bg-yellow-800 text-yellow-300'
                          }`}>
                          {pkg.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p><span className="text-gray-400">Order ID:</span> ORD-{pkg.id}</p>
                        <p><span className="text-gray-400">Order Date:</span> {pkg.created_at.slice(0, 10)}</p>
                        <p><span className="text-gray-400">To:</span> {pkg.name}</p>
                        <p><span className="text-gray-400">Address:</span> {pkg.destination}</p>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button 
                          className={`flex-1 text-white text-sm py-1 px-2 rounded ${
                            selectedPackage?.id === pkg.id 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                          onClick={() => handleNavigate(pkg)}
                        >
                          {selectedPackage?.id === pkg.id ? 'Navigated' : 'Navigate'}
                        </button>
                        <button className="flex-1 bg-gray-700 text-gray-300 text-sm py-1 px-2 rounded hover:bg-gray-600"
                        onClick={calculateRoute}
                        >
                          Calculate Route
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;