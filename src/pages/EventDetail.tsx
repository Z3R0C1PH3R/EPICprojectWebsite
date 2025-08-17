import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface Section {
  image?: string;
  heading: string;
  body: string;
}

interface Event {
  event_number: string;
  title: string;
  date?: string;
  time?: string;
  location?: string;
  status: string;
  description: string;
  cover_image?: string;
  upload_date: string;
  sections?: Section[];
}

export default function EventDetail() {
  const { eventNumber } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${backend_url}/get_events`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        const foundEvent = data.events.find(
          (e: Event) => e.event_number === eventNumber
        );
        if (!foundEvent) {
          throw new Error(`Event #${eventNumber} not found`);
        }
        setEvent(foundEvent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </button>
          <div className="text-center">
            <div className="text-red-600 text-lg">
              Error: {error || 'Event not found'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center text-blue-100 hover:text-white mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </button>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>
            <div className="flex flex-wrap gap-6 text-blue-100">
              {event.date && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{event.date}</span>
                </div>
              )}
              {event.time && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{event.time}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{event.location}</span>
                </div>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                event.status === 'Upcoming' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
              }`}>
                {event.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Cover Image */}
            {event.cover_image && (
              <div className="mb-12">
                <img
                  src={`${backend_url}${event.cover_image}`}
                  alt={event.title}
                  className="w-full max-h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Event Sections */}
            {event.sections && event.sections.length > 0 && (
              <div className="mb-12">
                {event.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-16"
                  >
                    {section.image && (
                      <div className="mb-6 flex justify-start">
                        <img
                          src={`${backend_url}${section.image}`}
                          alt={section.heading}
                          className="max-h-[500px] object-contain rounded-lg"
                        />
                      </div>
                    )}
                    {section.heading && (
                      <h2 className="text-2xl font-semibold mb-4">{section.heading}</h2>
                    )}
                    {section.body && (
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {section.body}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Event Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.status && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <p className="text-gray-900">{event.status}</p>
                  </div>
                )}
                {event.date && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Date:</span>
                    <p className="text-gray-900">{event.date}</p>
                  </div>
                )}
                {event.time && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Time:</span>
                    <p className="text-gray-900">{event.time}</p>
                  </div>
                )}
                {event.location && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Location:</span>
                    <p className="text-gray-900">{event.location}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}