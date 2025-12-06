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

// Custom marker icon
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <svg width="45" height="55" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));">
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
  popupOffset?: [number, number]; // [x, y] offset for popup positioning
  popupAnchor?: 'top' | 'bottom' | 'left' | 'right'; // Direction of the arrow
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

// Component to auto-open all popups
function AutoOpenPopups() {
  const map = useMap();
  
  useEffect(() => {
    // Wait for map to be ready and markers to be added
    const timer = setTimeout(() => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.openPopup();
        }
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [map]);
  
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
      pulseColor: 'rgba(37, 99, 235, 0.3)',
      popupOffset: [0, 180],
      popupAnchor: 'top'
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
      pulseColor: 'rgba(37, 99, 235, 0.3)',
      popupOffset: [140, 110],
      popupAnchor: 'left'
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
      pulseColor: 'rgba(37, 99, 235, 0.3)',
      popupOffset: [0, 15],
      popupAnchor: 'bottom'
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
      pulseColor: 'rgba(37, 99, 235, 0.3)',
      popupOffset: [-140, 120],
      popupAnchor: 'right'
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
      pulseColor: 'rgba(5, 150, 105, 0.3)',
      popupOffset: [0, 180],
      popupAnchor: 'top'
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
      pulseColor: 'rgba(220, 38, 38, 0.3)',
      popupOffset: [0, 150],
      popupAnchor: 'top'
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
      pulseColor: 'rgba(220, 38, 38, 0.3)',
      popupOffset: [0, 15],
      popupAnchor: 'bottom'
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
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          zoomControl={false}
          touchZoom={false}
          className="z-0 rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          />
          
          <MapBounds locations={locations} />
          <AutoOpenPopups />
          
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(location.color)}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.preventDefault();
                  e.originalEvent.stopPropagation();

                  const marker = e.target as L.Marker;
                  marker.openPopup();

                  handleMarkerClick(location.caseStudyNumber);
                },
              }}
            >
              <Popup 
                maxWidth={250} 
                className={`custom-popup popup-anchor-${location.popupAnchor || 'bottom'}`}
                autoClose={false}
                closeOnClick={false}
                closeButton={false}
                offset={location.popupOffset || [0, -55]}
              >
                <div 
                  className="p-2 cursor-pointer"
                  onClick={() => handleMarkerClick(location.caseStudyNumber)}
                >
                  <h3 className="font-bold text-xs text-gray-900 leading-tight">
                    {location.title}
                  </h3>
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
      
      {/* CSS for popup arrow directions */}
      <style>{`
        /* Make popups compact with max width */
        .custom-popup .leaflet-popup-content-wrapper {
          padding: 4px 6px;
          border-radius: 6px;
          max-width: 250px !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0 !important;
          max-width: 250px !important;
        }
        
        /* Bottom arrow (default - points down to marker) */
        .popup-anchor-bottom .leaflet-popup-tip-container {
          bottom: 0;
          margin-bottom: -20px;
        }
        .popup-anchor-bottom .leaflet-popup-tip {
          box-shadow: none;
        }
        
        /* Top arrow (points up) */
        .popup-anchor-top .leaflet-popup-tip-container {
          top: 0;
          bottom: auto;
          margin-top: -20px;
          transform: rotate(180deg);
        }
        
        /* Left arrow (points left) */
        .popup-anchor-left .leaflet-popup-tip-container {
          left: 0;
          right: auto;
          bottom: 50%;
          margin-left: -30px;
          transform: translateY(50%) rotate(+90deg);
        }
        
        /* Right arrow (points right) */
        .popup-anchor-right .leaflet-popup-tip-container {
          right: 0;
          left: auto;
          bottom: 50%;
          margin-right: -30px;
          transform: translateY(50%) rotate(-90deg);
        }
      `}</style>
    </div>
  );
};

export default CaseStudiesMap;
