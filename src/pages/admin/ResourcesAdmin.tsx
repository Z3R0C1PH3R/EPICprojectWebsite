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
  const [resourceNumber, setResourceNumber] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [downloadSize, setDownloadSize] = useState('');
  const [resourceFile, setResourceFile] = useState<File | null>(null);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setResourceFile(file);
      // Convert file size to MB
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setDownloadSize(`${sizeMB} MB`);
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
    setResourceNumber(resource.resource_number);
    setTitle(resource.title);
    setType(resource.type);
    setDescription(resource.description);
    setDownloadSize(resource.download_size);
    setEditingResource(resource);
    setShowNewForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!resourceFile && !editingResource) || !resourceNumber || !title) {
      alert('Please fill in at least resource number, title, and file');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('resource_number', resourceNumber);
      formData.append('title', title);
      formData.append('type', type);
      formData.append('description', description);
      formData.append('download_size', downloadSize);
      
      if (resourceFile) {
        formData.append('resource_file', resourceFile);
      }

      if (editingResource) {
        formData.append('is_edit', 'true');
      }

      const response = await fetch(backend_url + '/upload_resource', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      alert('Upload successful!');
      fetchExistingResources();
      setShowNewForm(false);
      
      // Clear form
      setResourceFile(null);
      setResourceNumber('');
      setTitle('');
      setType('');
      setDescription('');
      setDownloadSize('');
      setEditingResource(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading resource: ' + (error as Error).message);
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

          {/* Existing Resources List */}
          <div className="grid gap-6">
            {existingResources.map((resource: any) => (
              <div
                key={resource.resource_number}
                className="bg-white backdrop-blur-md rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center"
              >
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Resource #{resource.resource_number} | {resource.type} | {resource.download_size}
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

        {/* New/Edit Resource Form Modal */}
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
                    Resource Number*
                  </label>
                  <input
                    type="text"
                    value={resourceNumber}
                    onChange={(e) => setResourceNumber(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

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
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="PDF Guide">PDF Guide</option>
                    <option value="Resource Kit">Resource Kit</option>
                    <option value="Technical Manual">Technical Manual</option>
                    <option value="Handbook">Handbook</option>
                    <option value="Research Report">Research Report</option>
                    <option value="Strategy Guide">Strategy Guide</option>
                    <option value="Framework Document">Framework Document</option>
                    <option value="Training Package">Training Package</option>
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
                    Resource File {!editingResource && '*'}
                  </label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!editingResource}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex-1"
                  >
                    {isSubmitting ? 'Uploading...' : editingResource ? 'Update' : 'Create'}
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