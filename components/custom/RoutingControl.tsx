// @ts-nocheck

"use client";
import L, { icon } from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { startIcon, endIcon } from '@/components/custom/MarkerIcons';
import { Marker } from "react-leaflet";

interface RoutingMachineProps {
  fast: boolean;
  position: L.ControlPosition;
  start: [number, number];
  end: [number, number];
  color: string;
  routeMode: string;
  onWaypointChange?: (points: [number, number][], distance?: number) => void;
}

const createRoutineMachineLayer = ({
  fast,
  position,
  start,
  end,
  color,
  routeMode,
  onWaypointChange
}: RoutingMachineProps) => {
  const instance = L.Routing.control({
    position,
    waypoints: [
      L.latLng(start[0], start[1]),
      L.latLng(end[0], end[1])
    ],
    lineOptions: {
      styles: [{ color, weight: 6, opacity: 0.7 }], 
      extendToWaypoints: false,
      missingRouteTolerance: 100,
      addWaypoints: true
    },
    router: L.Routing.mapbox("pk.eyJ1IjoiYXJhdmluZG1hbm9qIiwiYSI6ImNtOGtrcHplcjB2cWEyaXNmcXk2azNoeTcifQ.oSKbvDJ5hvRJpNy0IHvYvQ", {
      alternatives: false,
      profile: `mapbox/${routeMode}`
    }),
    autoRoute: true,
    show: false,
    addWaypoints: true,
    draggableWaypoints: true,
    routeWhileDragging: false,
    showAlternatives: false,
    // showAlternatives: fast ? false : true,
    fitSelectedRoutes: false,
    dragStyle: {
      opacity: 0.9,
      className: 'routing-draw-touch',
      weight: 8,
      touchArea: 0
    },
    waypointMode: '',
    createMarker: function(i: number, wp: any, n: number) {
      const marker = L.marker(wp.latLng, {
        draggable: false,
        icon: i === 0 ? startIcon : i === (n-1) ? endIcon : L.divIcon({
          className: 'custom-waypoint-touch',
          html: `<div style="width:18px;height:18px;background:white;border:3px solid ${color};border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [18, 18],
          iconAnchor: [12, 12]
        })
      });

      marker.on('touchstart', (e) => {
        L.DomEvent.preventDefault(e);
        marker.dragging.enable();
      });

      return marker;
    }
  });

  instance.on('waypoint:click', (e: any) => {
    e.waypoint.dragging.enable();
  });

  instance.on('routesfound', (e) => {
    if (e.routes && e.routes.length > 0) {
      const totalDistance = e.routes[0].summary.totalDistance / 1000;
      const points = instance.getWaypoints()
        .filter(wp => wp.latLng)
        .map(wp => [wp.latLng.lat, wp.latLng.lng] as [number, number]);
      onWaypointChange?.(points, totalDistance);
    }
  });
  console.log(instance);
  return instance;
};

const style = document.createElement('style');
style.textContent = `
  .routing-draw-touch {
    cursor: pointer;
    pointer-events: all;
  }
  .custom-waypoint-touch {
    cursor: grab;
    touch-action: none;
  }
  .leaflet-touch .leaflet-routing-container {
    touch-action: none;
  }
`;
document.head.appendChild(style);

const RoutingControl = createControlComponent(createRoutineMachineLayer);

export default RoutingControl;