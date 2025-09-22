'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fixează pictogramele Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RomaniaMap = () => {
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    fetch('/ro_judete_poligon.geojson')
      .then(response => response.json())
      .then(data => setGeojsonData(data))
      .catch(error => console.error('Eroare la încărcarea GeoJSON:', error));
  }, []);

  const onEachFeature = (feature, layer) => {
    const countyName = feature.properties.name;
    layer.bindPopup(countyName);
    
    layer.on({
      click: (e) => {
        alert(`Ai selectat zona: ${countyName}`);
      },
      mouseover: (e) => {
        e.target.setStyle({ weight: 3, color: '#666', dashArray: '', fillOpacity: 0.7 });
      },
      mouseout: (e) => {
        e.target.setStyle({ weight: 1, color: 'white', fillOpacity: 0.5 });
      }
    });
  };

  const style = () => ({
    fillColor: '#0000FF',
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.5,
  });

  return (
    <MapContainer
      center={[45.9432, 24.9668]}
      zoom={7}
      minZoom={6}
      scrollWheelZoom={true}
      style={{ height: '100vh', width: '100vh', background: 'none' }} // Fundal transparent
    >
      {/* Stratul de fundal transparent */}
      <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" opacity={0} />

      {geojsonData && (
        <GeoJSON data={geojsonData} style={style} onEachFeature={onEachFeature} />
      )}
    </MapContainer>
  );
};

export default RomaniaMap;