import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { compressImage } from '../../utils/imageCompression';
import { ImagePreview } from '../../components/ImagePreview';

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function GalleryAdmin() {
  const navigate = useNavigate();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [existingAlbums, setExistingAlbums] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoCaptions, setPhotoCaptions] = useState<string[]>([]);
  const [photoQualities, setPhotoQualities] = useState<number[]>([]);
  const [compressedPhotos, setCompressedPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [coverQuality, setCoverQuality] = useState(80);
  const [photoQuality, setPhotoQuality] = useState(80);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);

  useEffect(() => {
    fetchExistingAlbums();
  }, []);

  const fetchExistingAlbums = async () => {
    try {
      const response = await fetch(`${backend_url}/get_photo_albums`);
      const data = await response.json();
      setExistingAlbums(data.albums);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const handleCoverImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const compressed = await compressImage(file, coverQuality);
      setCoverImage(compressed);
    }
  };

    const handlePhotosSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos(newPhotos);
      
      // Initialize captions array for new photos
      const newCaptions = [...photoCaptions];
      while (newCaptions.length < newPhotos.length) {
        newCaptions.push('');
      }
      setPhotoCaptions(newCaptions);
      
      // Initialize qualities array
      const newQualities = newPhotos.map(() => 80);
      setPhotoQualities(newQualities);
      
      // Compress all photos
      const compressed = await Promise.all(
        newPhotos.map(photo => compressImage(photo, 80))
      );
      setCompressedPhotos(compressed);
    }
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const newCaptions = [...photoCaptions];
    newCaptions[index] = caption;
    setPhotoCaptions(newCaptions);
  };

  const removePhoto = (index: number) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (url: string) => {
    setExistingPhotos(prev => prev.filter(photo => photo !== url));
  };

  const handleViewAlbum = (albumNumber: string) => {
    window.open(`/gallery/${albumNumber}`, '_blank');
  };

  const handleDeleteAlbum = async (albumNumber: string) => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      try {
        const response = await fetch(`${backend_url}/delete_photo_album/${albumNumber}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchExistingAlbums();
        } else {
          const data = await response.json();
          throw new Error(data.error);
        }
      } catch (error) {
        alert('Error deleting album: ' + (error as Error).message);
      }
    }
  };

  const handleEditAlbum = (album: any) => {
    setTitle(album.title);
    setDescription(album.description || '');
    setDate(album.date);
    setExistingPhotos(album.photos || []);
    setEditingAlbum(album);
    setShowNewForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!coverImage && !editingAlbum) || !title) {
      alert('Please fill in at least title and cover image');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date);
      
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }

      if (editingAlbum) {
        formData.append('is_edit', 'true');
        formData.append('existing_photos', JSON.stringify(existingPhotos));
      }

            photos.forEach((photo, index) => {
        formData.append(`photo_${index}`, compressedPhotos[index] || photo);
        formData.append(`photo_${index}_caption`, photoCaptions[index] || '');
      });

      const response = await fetch(backend_url + '/upload_photo_album', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      alert('Upload successful!');
      fetchExistingAlbums();
      setShowNewForm(false);
      
      // Clear form
      setCoverImage(null);
      setPhotos([]);
      setTitle('');
      setDescription('');
      setDate(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
      });
      setEditingAlbum(null);
      setExistingPhotos([]);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading album: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-blue-400 hover:text-blue-300 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Portal
          </button>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Gallery Management</h1>
            <button
              onClick={() => setShowNewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Album
            </button>
          </div>

          {/* Existing Albums List */}
          <div className="grid gap-6">
            {existingAlbums.map((album: any) => (
              <div
                key={album.album_number}
                className="bg-white backdrop-blur-md rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center"
              >
                {album.cover_image && (
                  <img
                    src={`${backend_url}${album.cover_image}`}
                    alt={album.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{album.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Album #{album.album_number} | {album.date}
                  </p>
                  <p className="text-gray-300">{album.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewAlbum(album.album_number)}
                    className="p-2 text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEditAlbum(album)}
                    className="p-2 text-yellow-400 hover:text-yellow-300"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAlbum(album.album_number)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* New/Edit Album Form Modal */}
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl text-gray-900"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingAlbum ? 'Edit Album' : 'Add New Album'}
                </h2>
                <button
                  onClick={() => setShowNewForm(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title*
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 h-32 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cover Image {!editingAlbum && '*'}
                  </label>
                  <input
                    type="file"
                    onChange={handleCoverImageSelect}
                    accept="image/*"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!editingAlbum}
                  />
                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-2">
                      Cover Image Quality: {coverQuality}%
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={coverQuality}
                      onChange={(e) => setCoverQuality(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Photos
                  </label>
                  <input
                    type="file"
                    onChange={handlePhotosSelect}
                    accept="image/*"
                    multiple
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-2">
                      Photo Quality: {photoQuality}%
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={photoQuality}
                      onChange={(e) => setPhotoQuality(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Existing Photos Preview */}
                {existingPhotos.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Existing Photos
                    </label>
                    <div className="grid grid-cols-4 gap-4">
                      {existingPhotos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`${backend_url}${photo}`}
                            alt={`Existing photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingPhoto(photo)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Photos Preview */}
                {photos.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      New Photos with Captions
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="space-y-2">
                          <div className="relative">
                            <ImagePreview 
                              file={compressedPhotos[index] || photo} 
                              className="w-full h-32 object-cover rounded" 
                              showSize={true}
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              ✕
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder={`Caption for photo ${index + 1} (optional)`}
                            value={photoCaptions[index] || ''}
                            onChange={(e) => handleCaptionChange(index, e.target.value)}
                            className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex-1"
                  >
                    {isSubmitting ? 'Uploading...' : editingAlbum ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}