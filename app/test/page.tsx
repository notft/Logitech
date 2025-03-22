"use client";
import React from 'react';
import MapDistance from '@/components/custom/MapDistance';

function test() {
  const [showMap, setShowMap] = React.useState(false);
  const [formData, setFormData] = React.useState({ distance: null });
  return (
    <>
        <MapDistance
          onDistanceCalculated={(distance) => {
            //@ts-ignore
            setFormData(prev => ({ ...prev, distance: distance.toFixed(2) }));
          }}
          onClose={() => setShowMap(false)}
        />
    </>
  )
}

export default test;