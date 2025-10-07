import React, { useState, useEffect } from 'react';
import { ChevronRight, Target, Users, Globe, BookOpen, Calendar, FileText, Image, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const backend_url = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentCaseStudies, setRecentCaseStudies] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentContent();
  }, []);

  const fetchRecentContent = async () => {
    try {
      // Fetch recent events
      const eventsResponse = await fetch(`${backend_url}/get_events?limit=3`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setRecentEvents(eventsData.events || []);
      }

      // Fetch recent case studies
      const caseStudiesResponse = await fetch(`${backend_url}/get_case_studies?limit=3`);
      if (caseStudiesResponse.ok) {
        const caseStudiesData = await caseStudiesResponse.json();
        setRecentCaseStudies(caseStudiesData.case_studies || []);
      }

      // Fetch recent gallery albums
      const albumsResponse = await fetch(`${backend_url}/get_photo_albums?limit=3`);
      if (albumsResponse.ok) {
        const albumsData = await albumsResponse.json();
        setRecentAlbums(albumsData.albums || []);
      }
    } catch (error) {
      console.error('Error fetching recent content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/group.jpg"
            alt="Rice paddy fields"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-blue-800/50" />
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              EPIC: Equity Perspectives for Irrigation Care or Control
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Advancing sustainable and equitable irrigation practices through innovative research and community collaboration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/about"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Learn More About EPIC
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/team"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Meet Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Project Video */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About Our Project
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch this video to learn more about our research, impact, and the communities we work with.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-xl">
                <iframe 
                  src="https://drive.google.com/file/d/1KdZgHGjE1HxxnI5DKQLnVKjwKdLOJyxd/preview" 
                  className="absolute top-0 left-0 w-full h-full"
                  allow="autoplay"
                  title="EPIC Project Video"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Events</h2>
              <p className="text-lg text-gray-600">
                Stay updated with our latest workshops, conferences, and community engagement activities.
              </p>
            </div>
            <Link
              to="/events"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading recent events...</p>
            </div>
          ) : recentEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentEvents.map((event) => (
                <Link
                  key={event.event_number}
                  to={`/events/${event.event_number}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {event.cover_image && (
                    <div className="h-48 bg-gray-200">
                      <img
                        src={event.cover_image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      {event.date}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    {event.location && (
                      <p className="text-sm text-gray-500">{event.location}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent events available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Case Studies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Case Studies</h2>
              <p className="text-lg text-gray-600">
                Explore our latest research findings and real-world irrigation solutions.
              </p>
            </div>
            <Link
              to="/case-studies"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Case Studies
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading recent case studies...</p>
            </div>
          ) : recentCaseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentCaseStudies.map((caseStudy) => (
                <Link
                  key={caseStudy.case_study_number}
                  to={`/case-studies/${caseStudy.case_study_number}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {caseStudy.cover_image && (
                    <div className="h-48 bg-gray-200">
                      <img
                        src={caseStudy.cover_image}
                        alt={caseStudy.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FileText className="h-4 w-4 mr-1" />
                      Case Study
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{caseStudy.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{caseStudy.description}</p>
                    {caseStudy.location && (
                      <p className="text-sm text-gray-500">{caseStudy.location}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent case studies available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Gallery Albums */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Gallery Albums</h2>
              <p className="text-lg text-gray-600">
                Visual stories from our field research, community visits, and project activities.
              </p>
            </div>
            <Link
              to="/gallery"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Albums
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading recent albums...</p>
            </div>
          ) : recentAlbums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentAlbums.map((album) => (
                <Link
                  key={album.album_number}
                  to={`/gallery/${album.album_number}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {album.cover_image && (
                    <div className="h-48 bg-gray-200">
                      <img
                        src={album.cover_image}
                        alt={album.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Image className="h-4 w-4 mr-1" />
                      Album
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{album.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{album.description}</p>
                    {album.photo_count && (
                      <p className="text-sm text-gray-500">{album.photo_count} photos</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent albums available.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;