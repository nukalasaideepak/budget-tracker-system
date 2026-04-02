import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons not showing in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const defaultCenter = [12.9716, 77.5946]; // Bangalore center

function MapClickListener({ pickup, dropoff, setPickup, setDropoff, activeSelection }) {
  useMapEvents({
    click(e) {
      if (activeSelection === 'pickup') {
        setPickup([e.latlng.lat, e.latlng.lng]);
      } else if (activeSelection === 'dropoff') {
        setDropoff([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
}

export default function MapSelector({ onCoordinatesChange }) {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [activeSelection, setActiveSelection] = useState('pickup');

  useEffect(() => {
    if (pickup && dropoff) {
      onCoordinatesChange({
        fromLat: pickup[0],
        fromLng: pickup[1],
        toLat: dropoff[0],
        toLng: dropoff[1]
      });
    }
  }, [pickup, dropoff, onCoordinatesChange]);

  return (
    <div style={{ background: '#13131a', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px' }}>
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a26' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>📍 Select Locations on Map</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button"
            onClick={() => setActiveSelection('pickup')}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '8px', 
              border: activeSelection === 'pickup' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)', 
              background: activeSelection === 'pickup' ? 'rgba(16,185,129,0.1)' : 'transparent',
              color: activeSelection === 'pickup' ? '#10b981' : '#a0a0c0',
              cursor: 'pointer'
            }}
          >
            1. Set Pickup
          </button>
          <button 
            type="button"
            onClick={() => setActiveSelection('dropoff')}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '8px', 
              border: activeSelection === 'dropoff' ? '1px solid #f97316' : '1px solid rgba(255,255,255,0.1)', 
              background: activeSelection === 'dropoff' ? 'rgba(249,115,22,0.1)' : 'transparent',
              color: activeSelection === 'dropoff' ? '#f97316' : '#a0a0c0',
              cursor: 'pointer'
            }}
          >
            2. Set Dropoff
          </button>
          <button 
             type="button"
             onClick={() => { setPickup(null); setDropoff(null); }}
             style={{ padding: '8px', background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', textDecoration: 'underline' }}
          >
             Reset
          </button>
        </div>
      </div>
      
      <div style={{ position: 'relative', height: '350px', width: '100%' }}>
        <MapContainer center={defaultCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          <MapClickListener 
             pickup={pickup} 
             dropoff={dropoff} 
             setPickup={setPickup} 
             setDropoff={setDropoff}
             activeSelection={activeSelection} 
          />
          
          {pickup && <Marker position={pickup}></Marker>}
          {dropoff && <Marker position={dropoff}></Marker>}
          {pickup && dropoff && <Polyline positions={[pickup, dropoff]} color="#6366f1" weight={3} dashArray="5, 10" />}
        </MapContainer>
        
        {(!pickup || !dropoff) && (
          <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: 'rgba(0,0,0,0.8)', padding: '10px 20px', borderRadius: '30px', color: '#fff', fontSize: '14px', fontWeight: 600, pointerEvents: 'none', backdropFilter: 'blur(4px)' }}>
             {!pickup ? "Click the map to drop the Pickup pin" : "Now click to drop the Dropoff pin"}
          </div>
        )}
      </div>
    </div>
  );
}
