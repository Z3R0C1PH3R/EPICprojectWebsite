import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icon
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <svg width="40" height="50" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50]
  });
};

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  caseStudyId: string;
}

// Component to handle map bounds and add clickable labels
function MapBounds({ locations, onLocationClick }: { locations: Location[], onLocationClick: (id: string) => void }) {
  const map = useMap();
  const markersRef = useRef<L.Marker[]>([]);
  
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
    }
  }, [locations, map]);

  useEffect(() => {
    // Clear previous labels
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add clickable labels
    locations.forEach((location) => {
      const labelIcon = L.divIcon({
        className: 'custom-label-marker',
        html: `<div class="custom-label" data-case-study-id="${location.caseStudyId}">${location.name}</div>`,
        iconSize: [120, 30],
        iconAnchor: [-15, 45]
      });

      const labelMarker = L.marker([location.lat, location.lng], { 
        icon: labelIcon,
        interactive: true
      }).addTo(map);

      // Add click event
      labelMarker.on('click', () => {
        onLocationClick(location.caseStudyId);
      });

      markersRef.current.push(labelMarker);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
    };
  }, [locations, map, onLocationClick]);
  
  return null;
}

const InteractiveWorldMap = () => {
  const navigate = useNavigate();

  const locations: Location[] = [
    {
      id: 'gaya',
      name: 'Gaya, India',
      lat: 24.7914,
      lng: 85.0002,
      caseStudyId: '1'
    },
    {
      id: 'mumbai',
      name: 'Mumbai, India',
      lat: 19.0760,
      lng: 72.8777,
      caseStudyId: '2'
    },
    {
      id: 'southafrica',
      name: 'Pretoria, South Africa',
      lat: -25.7579,
      lng: 28.2293,
      caseStudyId: '3'
    },
    {
      id: 'southafrica',
      name: 'Pretoria, South Africa',
      lat: -25.7479,
      lng: 28.2293,
      caseStudyId: '3'
    }
  ];

  const handleMarkerClick = (caseStudyId: string) => {
    navigate(`/case-studies/${caseStudyId}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative w-full rounded-2xl shadow-2xl overflow-hidden border-4 border-blue-200">
        <MapContainer
          center={[20, 60]}
          zoom={3}
          style={{ height: '600px', width: '100%' }}
          scrollWheelZoom={true}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapBounds locations={locations} onLocationClick={handleMarkerClick} />
          
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={createCustomIcon('#2563EB')}
              eventHandlers={{
                click: () => handleMarkerClick(location.caseStudyId),
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default InteractiveWorldMap;
