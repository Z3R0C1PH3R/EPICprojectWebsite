import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { compressImage } from '../../utils/imageCompression';
import { ImagePreview } from '../../components/ImagePreview';

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
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  // Sections functionality
  const [numSections, setNumSections] = useState(1);
  const [sections, setSections] = useState([{ image: null, heading: '', body: '' }]);
  const [sectionQualities, setSectionQualities] = useState<number[]>([80]);
  const [originalSectionImages, setOriginalSectionImages] = useState<(File | null)[]>([]);
  const [existingSectionImages, setExistingSectionImages] = useState<string[]>([]);

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

  const handleResourceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResourceFile(e.target.files[0]);
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

  const handleSectionQualityChange = async (index: number, quality: number) => {
    const newQualities = [...sectionQualities];
    newQualities[index] = quality;
    setSectionQualities(newQualities);
    
    if (originalSectionImages[index]) {
      const compressed = await compressImage(originalSectionImages[index]!, quality);
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
    setSectionQualities(current => {
      if (newCount > current.length) {
        return [...current, ...Array(newCount - current.length).fill(80)];
      }
      return current.slice(0, newCount);
    });
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
    
    // Handle sections if they exist
    if (resource.sections && resource.sections.length > 0) {
      setNumSections(resource.sections.length);
      setExistingSectionImages(resource.sections.map((section: any) => section.image || ''));
      setSections(resource.sections.map((section: any) => ({
        image: null,
        heading: section.heading || '',
        body: section.body || '',
        existingImage: section.image
      })));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resourceFile && !editingResource) {
      alert('Please select a resource file');
      return;
    }
    
    if (!title) {
      alert('Please fill in title');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', type);
      formData.append('description', description);
      formData.append('link', link);
      
      if (resourceFile) {
        formData.append('resource_file', resourceFile);
      }

      if (editingResource) {
        formData.append('is_edit', 'true');
      }

      // Add sections to form data
      sections.forEach((section, index) => {
        if (section.image) {
          formData.append(`section_${index}_image`, section.image);
        } else if (editingResource) {
          formData.append(`section_${index}_existing_image`, existingSectionImages[index] || '');
        }
        formData.append(`section_${index}_heading`, section.heading);
        formData.append(`section_${index}_body`, section.body);
      });

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
      setTitle('');
      setType('');
      setDescription('');
      setLink('');
      setEditingResource(null);
      setNumSections(1);
      setSections([{ image: null, heading: '', body: '' }]);
      setSectionQualities([80]);
      setOriginalSectionImages([]);
      setExistingSectionImages([]);
      
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
                    <option value="Report">Report</option>
                    <option value="Guide">Guide</option>
                    <option value="Manual">Manual</option>
                    <option value="Policy">Policy</option>
                    <option value="Research">Research</option>
                    <option value="Other">Other</option>
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
                    External Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Resource File {!editingResource && '*'}
                  </label>
                  <input
                    type="file"
                    onChange={handleResourceFileSelect}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!editingResource}
                  />
                  {resourceFile && (
                    <p className="text-sm text-gray-500 mt-2">
                      Selected: {resourceFile.name} ({(resourceFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
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
                      {section.image && (
                        <div className="mt-4">
                          <ImagePreview file={section.image} className="max-h-32 w-auto" showSize={true} />
                          <div className="mt-2">
                            <label className="block text-sm font-medium mb-2">
                              Section {index + 1} Quality: {sectionQualities[index] || 80}%
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="100"
                              value={sectionQualities[index] || 80}
                              onChange={(e) => handleSectionQualityChange(index, Number(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
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