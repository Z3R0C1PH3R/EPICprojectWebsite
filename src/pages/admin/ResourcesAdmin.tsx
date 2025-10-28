import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function ResourcesAdmin() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [existingResources, setExistingResources] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    fetchExistingResources();
  }, []);

  const fetchExistingResources = async () => {
    try {
      const response = await fetch(`${backend_url}/get_resources`);
      const data = await response.json();
      setExistingResources(data.resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };



  const handleViewResource = (resourceNumber: string) => {
    window.open(`/resources/${resourceNumber}`, '_blank');
  };

  const handleDeleteResource = async (resourceNumber: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const response = await fetch(`${backend_url}/delete_resource/${resourceNumber}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchExistingResources();
        } else {
          const data = await response.json();
          throw new Error(data.error);
        }
      } catch (error) {
        alert('Error deleting resource: ' + (error as Error).message);
      }
    }
  };

  const handleEditResource = (resource: any) => {
    setTitle(resource.title);
    setType(resource.type);
    setDescription(resource.description);
    setLink(resource.link || '');
    setEditingResource(resource);
    setShowNewForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !link || !type) {
      alert('Please fill in all required fields (Title, Link, and Type)');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', type);
      formData.append('description', description);
      formData.append('link', link);
      
      if (editingResource) {
        formData.append('is_edit', 'true');
        formData.append('resource_number', (editingResource as any).resource_number);
        
        // Preserve existing thumbnail if no new one uploaded
        if (!thumbnail && (editingResource as any).thumbnail) {
          formData.append('existing_thumbnail', (editingResource as any).thumbnail);
        }
      }
      
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      const response = await fetch(backend_url + '/upload_resource', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      alert(editingResource ? 'Resource updated successfully!' : 'Resource created successfully!');
      fetchExistingResources();
      setShowNewForm(false);
      
      // Clear form
      setTitle('');
      setType('');
      setDescription('');
      setLink('');
      setThumbnail(null);
      setEditingResource(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error saving resource: ' + (error as Error).message);
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
            <h1 className="text-4xl font-bold">Resources Management</h1>
            <button
              onClick={() => setShowNewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Resource
            </button>
          </div>

          <div className="grid gap-6">
            {existingResources.map((resource: any) => (
              <div
                key={resource.resource_number}
                className="bg-white backdrop-blur-md rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center"
              >
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Resource #{resource.resource_number} | {resource.type}
                  </p>
                  <p className="text-gray-300">{resource.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewResource(resource.resource_number)}
                    className="p-2 text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEditResource(resource)}
                    className="p-2 text-yellow-400 hover:text-yellow-300"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteResource(resource.resource_number)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {showNewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl text-gray-900"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingResource ? 'Edit Resource' : 'Add New Resource'}
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
                    Type*
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Journal Articles">Journal Articles</option>
                    <option value="Conference Papers">Conference Papers</option>
                    <option value="Masters Thesis">Masters Thesis</option>
                    <option value="Blog Posts">Blog Posts</option>
                    <option value="Others">Others</option>
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
                    Thumbnail Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {editingResource && (editingResource as any).thumbnail && !thumbnail && (
                    <p className="text-sm text-gray-600 mt-2">
                      Current thumbnail: {(editingResource as any).thumbnail.split('/').pop()}
                    </p>
                  )}
                  {thumbnail && (
                    <p className="text-sm text-green-600 mt-2">
                      New thumbnail selected: {thumbnail.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Link*
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com/resource"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : editingResource ? 'Update Resource' : 'Create Resource'}
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