import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { compressImage } from '../../utils/imageCompression';

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function EventsAdmin() {
  const navigate = useNavigate();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [existingEvents, setExistingEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Upcoming');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [imageQuality, setImageQuality] = useState(80);

  // Sections functionality similar to PAC Reading Circle
  const [numSections, setNumSections] = useState(1);
  const [sections, setSections] = useState([{ image: null, heading: '', body: '' }]);
  const [sectionQualities, setSectionQualities] = useState<number[]>([]);
  const [originalSectionImages, setOriginalSectionImages] = useState<(File | null)[]>([]);
  const [existingSectionImages, setExistingSectionImages] = useState<string[]>([]);

  useEffect(() => {
    fetchExistingEvents();
  }, []);

  const fetchExistingEvents = async () => {
    try {
      const response = await fetch(`${backend_url}/get_events`);
      const data = await response.json();
      setExistingEvents(data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleCoverImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const compressed = await compressImage(file, imageQuality);
      setCoverImage(compressed);
    }
  };

  const handleSectionImageSelect = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newOriginalImages = [...originalSectionImages];
      newOriginalImages[index] = file;
      setOriginalSectionImages(newOriginalImages);
      
      const compressed = await compressImage(file, sectionQualities[index] || 80);
      handleSectionChange(index, 'image', compressed);
    }
  };

  const handleSectionChange = (index: number, field: string, value: any) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  const updateSectionCount = (count: number) => {
    const newCount = Math.max(1, count);
    setNumSections(newCount);
    setSections(current => {
      if (newCount > current.length) {
        return [...current, ...Array(newCount - current.length).fill({ image: null, heading: '', body: '' })];
      }
      return current.slice(0, newCount);
    });
  };

  const handleViewEvent = (eventNumber: string) => {
    window.open(`/events/${eventNumber}`, '_blank');
  };

  const handleDeleteEvent = async (eventNumber: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`${backend_url}/delete_event/${eventNumber}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchExistingEvents();
        } else {
          const data = await response.json();
          throw new Error(data.error);
        }
      } catch (error) {
        alert('Error deleting event: ' + (error as Error).message);
      }
    }
  };

  const handleEditEvent = (event: any) => {
    setTitle(event.title);
    setDate(event.date);
    setTime(event.time || '');
    setLocation(event.location);
    setStatus(event.status);
    setDescription(event.description);
    setEditingEvent(event);
    setShowNewForm(true);
    
    // Handle sections if they exist
    if (event.sections && event.sections.length > 0) {
      setNumSections(event.sections.length);
      setExistingSectionImages(event.sections.map((section: any) => section.image || ''));
      setSections(event.sections.map((section: any) => ({
        image: null,
        heading: section.heading || '',
        body: section.body || '',
        existingImage: section.image
      })));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!coverImage && !editingEvent) || !title) {
      alert('Please fill in at least title and cover image');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('date', date);
      formData.append('time', time);
      formData.append('location', location);
      formData.append('status', status);
      formData.append('description', description);
      
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }

      if (editingEvent) {
        formData.append('is_edit', 'true');
      }

      // Add sections to form data
      sections.forEach((section, index) => {
        if (section.image) {
          formData.append(`section_${index}_image`, section.image);
        } else if (editingEvent) {
          formData.append(`section_${index}_existing_image`, existingSectionImages[index] || '');
        }
        formData.append(`section_${index}_heading`, section.heading);
        formData.append(`section_${index}_body`, section.body);
      });

      const response = await fetch(backend_url + '/upload_event', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      alert('Upload successful!');
      fetchExistingEvents();
      setShowNewForm(false);
      
      // Clear form
      setCoverImage(null);
      setTitle('');
      setDate(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
      });
      setTime('');
      setLocation('');
      setStatus('Upcoming');
      setDescription('');
      setEditingEvent(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading event: ' + (error as Error).message);
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
            <h1 className="text-4xl font-bold">Events Management</h1>
            <button
              onClick={() => setShowNewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Event
            </button>
          </div>

          {/* Existing Events List */}
          <div className="grid gap-6">
            {existingEvents.map((event: any) => (
              <div
                key={event.event_number}
                className="bg-white backdrop-blur-md rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center"
              >
                {event.cover_image && (
                  <img
                    src={`${backend_url}${event.cover_image}`}
                    alt={event.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Event #{event.event_number} | {event.date} | {event.status}
                  </p>
                  <p className="text-gray-300">{event.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewEvent(event.event_number)}
                    className="p-2 text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="p-2 text-yellow-400 hover:text-yellow-300"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.event_number)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* New/Edit Event Form Modal */}
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
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
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
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Past">Past</option>
                  </select>
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
                    Cover Image {!editingEvent && '*'}
                  </label>
                  <input
                    type="file"
                    onChange={handleCoverImageSelect}
                    accept="image/*"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!editingEvent}
                  />
                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-2">
                      Image Quality: {imageQuality}%
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={imageQuality}
                      onChange={(e) => setImageQuality(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Sections</label>
                  <input
                    type="number"
                    min="1"
                    value={numSections}
                    onChange={(e) => updateSectionCount(parseInt(e.target.value))}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {sections.map((section, index) => (
                  <div key={index} className="mb-8 p-4 border border-gray-300 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Section {index + 1}</h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Section Image (Optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSectionImageSelect(index, e)}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Section Heading</label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Section Body</label>
                      <textarea
                        value={section.body}
                        onChange={(e) => handleSectionChange(index, 'body', e.target.value)}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 min-h-[100px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex-1"
                  >
                    {isSubmitting ? 'Uploading...' : editingEvent ? 'Update' : 'Create'}
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