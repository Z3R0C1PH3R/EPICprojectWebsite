import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Custom marker icon with different colors for different countries
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <svg width="45" height="55" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
      </div>
    `,
    iconSize: [45, 55],
    iconAnchor: [22.5, 55],
    popupAnchor: [0, -55]
  });
};

interface Partner {
  id: string;
  name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  color: string;
}

// Component to handle map bounds
function MapBounds({ partners }: { partners: Partner[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (partners.length > 0) {
      const bounds = L.latLngBounds(partners.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 4 });
    }
  }, [partners, map]);
  
  return null;
}

interface PartnersMapProps {
  onPartnerClick?: (partnerId: string) => void;
}

const PartnersMap = ({ onPartnerClick }: PartnersMapProps) => {
  const partners: Partner[] = [
    {
      id: 'iitd',
      name: 'IIT Delhi',
      location: 'New Delhi, India',
      country: 'India',
      lat: 28.5450,
      lng: 77.1920,
      color: '#2563EB' // Blue for India
    },
    {
      id: 'fes',
      name: 'FES',
      location: 'Bhilwara, Rajasthan, India',
      country: 'India',
      lat: 25.3470,
      lng: 74.6409,
      color: '#2563EB' // Blue for India
    },
    {
      id: 'atree',
      name: 'ATREE',
      location: 'Bangalore, India',
      country: 'India',
      lat: 12.9716,
      lng: 77.5946,
      color: '#2563EB' // Blue for India
    },
    {
      id: 'ihe-delft',
      name: 'IHE Delft',
      location: 'Delft, Netherlands',
      country: 'Netherlands',
      lat: 52.0116,
      lng: 4.3571,
      color: '#7C3AED' // Purple for Netherlands
    },
    {
      id: 'wollo',
      name: 'Wollo University',
      location: 'Dessie, Ethiopia',
      country: 'Ethiopia',
      lat: 11.1300,
      lng: 39.6333,
      color: '#DC2626' // Red for Ethiopia
    },
    {
      id: 'wodet',
      name: 'WoDET',
      location: 'Dessie, Ethiopia',
      country: 'Ethiopia',
      lat: 11.1350,
      lng: 39.6383,
      color: '#DC2626' // Red for Ethiopia
    },
    {
      id: 'nmaist',
      name: 'NMAIST',
      location: 'Arusha, Tanzania',
      country: 'Tanzania',
      lat: -3.3869,
      lng: 36.6830,
      color: '#059669' // Green for Tanzania
    },
    {
      id: 'pbwb',
      name: 'PBWB',
      location: 'Moshi, Tanzania',
      country: 'Tanzania',
      lat: -3.3500,
      lng: 37.3500,
      color: '#059669' // Green for Tanzania
    }
  ];

  const handleMarkerClick = (partnerId: string) => {
    if (onPartnerClick) {
      onPartnerClick(partnerId);
    } else {
      // Scroll to partner section
      const element = document.getElementById(`partner-${partnerId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full rounded-xl shadow-2xl overflow-hidden border-4 border-blue-100">
        <MapContainer
          center={[15, 45]}
          zoom={3}
          style={{ height: '600px', width: '100%' }}
          scrollWheelZoom={true}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapBounds partners={partners} />
          
          {partners.map((partner) => (
            <Marker
              key={partner.id}
              position={[partner.lat, partner.lng]}
              icon={createCustomIcon(partner.color)}
              eventHandlers={{
                click: () => handleMarkerClick(partner.id),
              }}
            >
              <Popup>
                <div className="text-center p-2">
                  <h3 className="font-bold text-lg text-gray-900">{partner.name}</h3>
                  <p className="text-gray-600 text-sm">{partner.location}</p>
                  <p className="text-blue-600 text-xs mt-1 cursor-pointer hover:underline">
                    Click to view team →
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-6">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          <span className="text-sm text-gray-700 font-medium">India</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-purple-600 mr-2"></div>
          <span className="text-sm text-gray-700 font-medium">Netherlands</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
          <span className="text-sm text-gray-700 font-medium">Ethiopia</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div>
          <span className="text-sm text-gray-700 font-medium">Tanzania</span>
        </div>
      </div>
    </div>
  );
};

export default PartnersMap;
