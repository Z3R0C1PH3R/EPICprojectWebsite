import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Custom marker icon with gradient and animation
const createCustomIcon = (color: string, pulseColor: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <div class="marker-pulse" style="
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: ${pulseColor};
          opacity: 0.6;
          top: 5px;
          left: -5px;
          animation: pulse 2s infinite;
        "></div>
        <svg width="45" height="55" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" style="position: relative; z-index: 10; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
      </div>
      <style>
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          50% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.6;
          }
        }
      </style>
    `,
    iconSize: [45, 55],
    iconAnchor: [22.5, 55],
    popupAnchor: [0, -55]
  });
};

interface CaseStudyLocation {
  id: string;
  caseStudyNumber: string;
  title: string;
  country: string;
  lat: number;
  lng: number;
  description: string;
  color: string;
  pulseColor: string;
}

// Component to handle map bounds
function MapBounds({ locations }: { locations: CaseStudyLocation[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 6 });
    }
  }, [locations, map]);
  
  return null;
}

const CaseStudiesMap = () => {
  const navigate = useNavigate();

  const locations: CaseStudyLocation[] = [
    {
      id: 'andhra',
      caseStudyNumber: '1',
      title: 'Groundwater based farmer collectives of Andhra Pradesh',
      country: 'India',
      lat: 14.11168,
      lng: 78.15982,
      description: 'Exploring equity in groundwater-based farmer managed irrigation systems in Andhra Pradesh',
      color: '#2563EB',
      pulseColor: 'rgba(37, 99, 235, 0.3)'
    },
    {
      id: 'gaya',
      caseStudyNumber: '2',
      title: 'Indigenous and modern irrigation systems in Gaya',
      country: 'India',
      lat: 24.7937,
      lng: 85.0018,
      description: 'Understanding equity implications of traditional and modern irrigation practices in Gaya district',
      color: '#2563EB',
      pulseColor: 'rgba(37, 99, 235, 0.3)'
    },
    {
      id: 'kalyanpura',
      caseStudyNumber: '3',
      title: 'Watershed development in Kalyanpura',
      country: 'India',
      lat: 25.362281,
      lng: 75.227060,
      description: 'Examining equity outcomes of watershed development interventions in Rajasthan',
      color: '#2563EB',
      pulseColor: 'rgba(37, 99, 235, 0.3)'
    },
    {
      id: 'gurukunj',
      caseStudyNumber: '4',
      title: 'Piped distribution in Gurukunj lift irrigation scheme',
      country: 'India',
      lat: 20.80677,
      lng: 77.36450,
      description: 'Analyzing equity in modern piped irrigation distribution systems',
      color: '#2563EB',
      pulseColor: 'rgba(37, 99, 235, 0.3)'
    },
    {
      id: 'tanzania',
      caseStudyNumber: '5',
      title: 'Farmer-led irrigation schemes of Mtambo and Ismai',
      country: 'Tanzania',
      lat: -3.420861,
      lng: 37.198694,
      description: 'Investigating equity in farmer-managed irrigation systems in Tanzania',
      color: '#059669',
      pulseColor: 'rgba(5, 150, 105, 0.3)'
    },
    {
      id: 'melka-chefe',
      caseStudyNumber: '6',
      title: 'Melka-Chefe irrigation scheme',
      country: 'Ethiopia',
      lat: 10.953583,
      lng: 39.764528,
      description: 'Assessing equity in government-managed irrigation schemes in Ethiopia',
      color: '#DC2626',
      pulseColor: 'rgba(220, 38, 38, 0.3)'
    },
    {
      id: 'kobo-girana',
      caseStudyNumber: '7',
      title: 'Kobo-Girana Irrigation Scheme',
      country: 'Ethiopia',
      lat: 12.164608,
      lng: 39.634729,
      description: 'Examining equity dimensions in large-scale irrigation development in Ethiopia',
      color: '#DC2626',
      pulseColor: 'rgba(220, 38, 38, 0.3)'
    }
  ];

  const handleMarkerClick = (caseStudyNumber: string) => {
    navigate(`/case-studies/${caseStudyNumber}`);
  };

  return (
    <div className="w-full">
      <div className="relative w-full rounded-xl shadow-2xl overflow-hidden border-4 border-blue-100 bg-gradient-to-br from-blue-50 to-white p-1">
        <MapContainer
          center={[15, 55]}
          zoom={3}
          style={{ height: '650px', width: '100%' }}
          scrollWheelZoom={true}
          className="z-0 rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapBounds locations={locations} />
          
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(location.color, location.pulseColor)}
              eventHandlers={{
                click: () => handleMarkerClick(location.caseStudyNumber),
              }}
            >
              <Popup maxWidth={300} className="custom-popup">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      Case Study #{location.caseStudyNumber}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                    {location.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {location.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {location.country}
                    </span>
                    <button 
                      onClick={() => handleMarkerClick(location.caseStudyNumber)}
                      className="text-blue-600 text-sm font-semibold hover:text-blue-800 hover:underline flex items-center"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Case Study Locations by Country</h4>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-blue-600 mr-3 shadow-lg"></div>
            <div>
              <span className="text-sm text-gray-900 font-semibold">India</span>
              <span className="text-xs text-gray-500 ml-2">(4 case studies)</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-green-600 mr-3 shadow-lg"></div>
            <div>
              <span className="text-sm text-gray-900 font-semibold">Tanzania</span>
              <span className="text-xs text-gray-500 ml-2">(1 case study)</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-red-600 mr-3 shadow-lg"></div>
            <div>
              <span className="text-sm text-gray-900 font-semibold">Ethiopia</span>
              <span className="text-xs text-gray-500 ml-2">(2 case studies)</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4 italic">Click on any marker to view detailed case study information</p>
      </div>
    </div>
  );
};

export default CaseStudiesMap;
