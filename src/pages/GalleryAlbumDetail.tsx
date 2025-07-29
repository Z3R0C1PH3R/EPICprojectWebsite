import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, ZoomIn, X } from 'lucide-react';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface Album {
  album_number: string;
  title: string;
  date: string;
  description: string;
  cover_image: string;
  photos: string[];
  upload_date: string;
}

export default function GalleryAlbumDetail() {
  const { albumNumber } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`${backend_url}/get_photo_albums`);
        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }
        const data = await response.json();
        const foundAlbum = data.albums.find(
          (a: Album) => a.album_number === albumNumber
        );
        if (!foundAlbum) {
          throw new Error(`Album #${albumNumber} not found`);
        }
        setAlbum(foundAlbum);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/gallery')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </button>
          <div className="text-center">
            <div className="text-red-600 text-lg">
              Error: {error || 'Album not found'}
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
            onClick={() => navigate('/gallery')}
            className="flex items-center text-blue-100 hover:text-white mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </button>
          <div className="max-w-4xl">
            <span className="text-blue-200 text-sm">Album #{album.album_number}</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{album.title}</h1>
            <div className="flex flex-wrap gap-6 text-blue-100">
              {album.date && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{album.date}</span>
                </div>
              )}
              <span className="bg-blue-500 bg-opacity-50 px-3 py-1 rounded-full text-sm">
                {album.photos?.length || 0} Photos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Description */}
            {album.description && (
              <div className="mb-12 max-w-4xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Album</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {album.description}
                  </p>
                </div>
              </div>
            )}

            {/* Photo Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Photos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Cover Image */}
                {album.cover_image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedImage(album.cover_image)}
                  >
                    <img
                      src={`${backend_url}${album.cover_image}`}
                      alt="Album cover"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      Cover
                    </div>
                  </motion.div>
                )}

                {/* Album Photos */}
                {album.photos?.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedImage(photo)}
                  >
                    <img
                      src={`${backend_url}${photo}`}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Album Info */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Album Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-500">Album Number:</span>
                  <p className="text-gray-900">#{album.album_number}</p>
                </div>
                {album.date && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Date:</span>
                    <p className="text-gray-900">{album.date}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-500">Photos:</span>
                  <p className="text-gray-900">{(album.photos?.length || 0) + (album.cover_image ? 1 : 0)} total</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-5xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={`${backend_url}${selectedImage}`}
              alt="Full size"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}