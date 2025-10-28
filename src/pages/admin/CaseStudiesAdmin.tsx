import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { compressImage } from '../../utils/imageCompression';
import { ImagePreview } from '../../components/ImagePreview';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface CaseStudy {
  case_study_number: string;
  title: string;
  location?: string;
  date?: string;
  description: string;
  cover_image?: string;
  pdf_file?: string;
  link?: string;
  sections?: Array<{
    heading: string;
    body: string;
    image?: string;
  }>;
}

export default function CaseStudiesAdmin() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [existingCaseStudies, setExistingCaseStudies] = useState<CaseStudy[]>([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [originalCoverImage, setOriginalCoverImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [imageQuality, setImageQuality] = useState(80);

  // Sections functionality
  const [numSections, setNumSections] = useState(1);
  const [sections, setSections] = useState([{ image: null, heading: '', body: '' }]);
  const [sectionQualities, setSectionQualities] = useState<number[]>([80]);
  const [originalSectionImages, setOriginalSectionImages] = useState<(File | null)[]>([]);
  const [existingSectionImages, setExistingSectionImages] = useState<string[]>([]);

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
      setOriginalCoverImage(file);
      const compressed = await compressImage(file, imageQuality);
      setCoverImage(compressed);
    }
  };

  const handleCoverImageQualityChange = async (quality: number) => {
    setImageQuality(quality);
    if (originalCoverImage) {
      const compressed = await compressImage(originalCoverImage, quality);
      setCoverImage(compressed);
    }
  };

  const handlePdfFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
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

  const handleEditCaseStudy = (caseStudy: CaseStudy) => {
    setTitle(caseStudy.title);
    setLocation(caseStudy.location || '');
    setDate(caseStudy.date || '');
    setDescription(caseStudy.description);
    setLink(caseStudy.link || '');
    setEditingCaseStudy(caseStudy);
    setShowNewForm(true);
    
    // Handle sections if they exist
    if (caseStudy.sections && caseStudy.sections.length > 0) {
      setNumSections(caseStudy.sections.length);
      setExistingSectionImages(caseStudy.sections.map((section: any) => section.image || ''));
      setSections(caseStudy.sections.map((section: any) => ({
        image: null,
        heading: section.heading || '',
        body: section.body || '',
        existingImage: section.image
      })));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!coverImage && !editingCaseStudy) || !title) {
      alert('Please fill in at least title and cover image');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('location', location);
      formData.append('date', date);
      formData.append('description', description);
      formData.append('link', link);
      
      if (editingCaseStudy) {
        formData.append('is_edit', 'true');
        formData.append('case_study_number', editingCaseStudy.case_study_number);
        
        // Preserve existing images if no new ones uploaded
        if (!coverImage && editingCaseStudy.cover_image) {
          formData.append('existing_cover_image', editingCaseStudy.cover_image);
        }
        if (!pdfFile && editingCaseStudy.pdf_file) {
          formData.append('existing_pdf_file', editingCaseStudy.pdf_file);
        }
      }
      
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }
      
      if (pdfFile) {
        formData.append('pdf_file', pdfFile);
      }

      // Add sections to form data
      sections.forEach((section, index) => {
        if (section.image) {
          formData.append(`section_${index}_image`, section.image);
        } else if (editingCaseStudy) {
          formData.append(`section_${index}_existing_image`, existingSectionImages[index] || '');
        }
        formData.append(`section_${index}_heading`, section.heading);
        formData.append(`section_${index}_body`, section.body);
      });

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
      setTitle('');
      setLocation('');
      setDate(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
      });
      setDescription('');
      setLink('');
      setEditingCaseStudy(null);
      setNumSections(1);
      setSections([{ image: null, heading: '', body: '' }]);
      setSectionQualities([80]);
      setOriginalSectionImages([]);
      setExistingSectionImages([]);
      
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
            {existingCaseStudies.map((caseStudy: CaseStudy) => (
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
                    Case Study #{caseStudy.case_study_number} | {caseStudy.date} | {caseStudy.location}
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
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl text-gray-900"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        onChange={(e) => handleCoverImageQualityChange(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    {coverImage && (
                      <div className="mt-4">
                        <ImagePreview file={coverImage} className="max-h-32 w-auto" showSize={true} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      PDF File (Optional)
                    </label>
                    <input
                      type="file"
                      onChange={handlePdfFileSelect}
                      accept=".pdf"
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {pdfFile && (
                      <p className="text-sm text-gray-500 mt-2">
                        Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
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
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 h-24 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
