import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface Event {
  event_number: string;
  title: string;
  date?: string;
  time?: string;
  location?: string;
  description: string;
  cover_image?: string;
  status: string;
}

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${backend_url}/get_events`);
      const data = await response.json();
      
      // Split events into upcoming and past
      const upcoming = data.events.filter((event: Event) => event.status === 'Upcoming');
      const past = data.events.filter((event: Event) => event.status === 'Past');
      
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleLearnMore = (eventNumber: string) => {
    navigate(`/events/${eventNumber}`);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Events</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Stay updated with our latest conferences, workshops, and symposiums. 
              Join us in advancing equitable irrigation practices through collaborative learning and knowledge sharing.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600">
              Don't miss these exciting opportunities to learn, network, and contribute to our research community.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  {event.cover_image ? (
                    <img
                      src={`${backend_url}${event.cover_image}`}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600">Event Image Placeholder</span>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{event.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    {event.date && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-3" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                    )}
                    {event.time && (
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-3" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-3" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6">{event.description}</p>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleLearnMore(event.event_number)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Events;