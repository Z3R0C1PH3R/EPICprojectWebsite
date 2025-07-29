import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { compressImage } from '../../utils/imageCompression';

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function CaseStudiesAdmin() {
  const navigate = useNavigate();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [existingCaseStudies, setExistingCaseStudies] = useState([]);
  const [caseStudyNumber, setCaseStudyNumber] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState(null);
  const [imageQuality, setImageQuality] = useState(80);

  useEffect(() => {
    fetchExistingCaseStudies();
  }, []);

  const fetchExistingCaseStudies = async () => {
    try {
      const response = await fetch(`${backend_url}/get_case_studies`);
      const data = await response.json();
      setExistingCaseStudies(data.case_studies);
    } catch (error) {
      console.error('Error fetching case studies:', error);
    }
  };

  const handleCoverImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const compressed = await compressImage(file, imageQuality);
      setCoverImage(compressed);
    }
  };

  const handlePDFSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleViewCaseStudy = (caseStudyNumber: string) => {
    window.open(`/case-studies/${caseStudyNumber}`, '_blank');
  };

  const handleDeleteCaseStudy = async (caseStudyNumber: string) => {
    if (window.confirm('Are you sure you want to delete this case study?')) {
      try {
        const response = await fetch(`${backend_url}/delete_case_study/${caseStudyNumber}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchExistingCaseStudies();
        } else {
          const data = await response.json();
          throw new Error(data.error);
        }
      } catch (error) {
        alert('Error deleting case study: ' + (error as Error).message);
      }
    }
  };

  const handleEditCaseStudy = (caseStudy: any) => {
    setCaseStudyNumber(caseStudy.case_study_number);
    setTitle(caseStudy.title);
    setLocation(caseStudy.location);
    setDate(caseStudy.date);
    setCategory(caseStudy.category);
    setDescription(caseStudy.description);
    setEditingCaseStudy(caseStudy);
    setShowNewForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!coverImage && !editingCaseStudy) || !caseStudyNumber || !title) {
      alert('Please fill in at least case study number, title, and cover image');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('case_study_number', caseStudyNumber);
      formData.append('title', title);
      formData.append('location', location);
      formData.append('date', date);
      formData.append('category', category);
      formData.append('description', description);
      
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }

      if (pdfFile) {
        formData.append('pdf_file', pdfFile);
      }

      if (editingCaseStudy) {
        formData.append('is_edit', 'true');
      }

      const response = await fetch(backend_url + '/upload_case_study', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      alert('Upload successful!');
      fetchExistingCaseStudies();
      setShowNewForm(false);
      
      // Clear form
      setCoverImage(null);
      setPdfFile(null);
      setCaseStudyNumber('');
      setTitle('');
      setLocation('');
      setDate(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
      });
      setCategory('');
      setDescription('');
      setEditingCaseStudy(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading case study: ' + (error as Error).message);
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
            <h1 className="text-4xl font-bold">Case Studies Management</h1>
            <button
              onClick={() => setShowNewForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Case Study
            </button>
          </div>

          {/* Existing Case Studies List */}
          <div className="grid gap-6">
            {existingCaseStudies.map((caseStudy: any) => (
              <div
                key={caseStudy.case_study_number}
                className="bg-white backdrop-blur-md rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center"
              >
                {caseStudy.cover_image && (
                  <img
                    src={`${backend_url}${caseStudy.cover_image}`}
                    alt={caseStudy.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{caseStudy.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Case Study #{caseStudy.case_study_number} | {caseStudy.date}
                  </p>
                  <p className="text-gray-300">{caseStudy.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewCaseStudy(caseStudy.case_study_number)}
                    className="p-2 text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEditCaseStudy(caseStudy)}
                    className="p-2 text-yellow-400 hover:text-yellow-300"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCaseStudy(caseStudy.case_study_number)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* New/Edit Case Study Form Modal */}
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
                  {editingCaseStudy ? 'Edit Case Study' : 'Add New Case Study'}
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
                    Case Study Number*
                  </label>
                  <input
                    type="text"
                    value={caseStudyNumber}
                    onChange={(e) => setCaseStudyNumber(e.target.value)}
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
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Water Conservation">Water Conservation</option>
                    <option value="Community Engagement">Community Engagement</option>
                    <option value="Technology">Technology</option>
                    <option value="Social Equity">Social Equity</option>
                    <option value="Climate Adaptation">Climate Adaptation</option>
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
                    Cover Image {!editingCaseStudy && '*'}
                  </label>
                  <input
                    type="file"
                    onChange={handleCoverImageSelect}
                    accept="image/*"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!editingCaseStudy}
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
                  <label className="block text-sm font-medium mb-2">
                    PDF File
                  </label>
                  <input
                    type="file"
                    onChange={handlePDFSelect}
                    accept=".pdf"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex-1"
                  >
                    {isSubmitting ? 'Uploading...' : editingCaseStudy ? 'Update' : 'Create'}
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