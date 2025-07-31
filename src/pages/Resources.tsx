import { useState, useEffect } from 'react';
import { Download, FileText, Video, BookOpen, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface Resource {
  resource_number: string;
  title: string;
  type: string;
  description: string;
  file: string;
  download_size: string;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${backend_url}/get_resources`);
      const data = await response.json();
      setResources(data.resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleViewDetails = (resourceNumber: string) => {
    navigate(`/resources/${resourceNumber}`);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Resources</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Access our comprehensive collection of guides, research papers, training materials, 
              and tools to support sustainable irrigation practices and water management.
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="relative max-w-md w-full">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resources List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className="mr-4">
                        {resource.type.includes('PDF') || resource.type.includes('Report') || resource.type.includes('Document') ? (
                          <FileText className="h-8 w-8 text-red-600" />
                        ) : resource.type.includes('Video') ? (
                          <Video className="h-8 w-8 text-purple-600" />
                        ) : (
                          <BookOpen className="h-8 w-8 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-1">{resource.title}</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {resource.type}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">{resource.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Size: {resource.download_size}</span>
                      <div className="flex gap-2">
                        <a 
                          href={`${backend_url}${resource.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                        <button
                          onClick={() => handleViewDetails(resource.resource_number)}
                          className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;