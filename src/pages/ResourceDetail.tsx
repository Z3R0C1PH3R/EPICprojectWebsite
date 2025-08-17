import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileText } from 'lucide-react';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface Resource {
  resource_number: string;
  title: string;
  type: string;
  description: string;
  file: string;
  download_size: string;
  upload_date: string;
}

export default function ResourceDetail() {
  const { resourceNumber } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch(`${backend_url}/get_resources`);
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        const data = await response.json();
        const foundResource = data.resources.find(
          (r: Resource) => r.resource_number === resourceNumber
        );
        if (!foundResource) {
          throw new Error(`Resource #${resourceNumber} not found`);
        }
        setResource(foundResource);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [resourceNumber]);

  const getFileIcon = (type: string) => {
    if (type.includes('PDF') || type.includes('Report') || type.includes('Document')) {
      return <FileText className="h-8 w-8 text-red-600" />;
    }
    return <FileText className="h-8 w-8 text-blue-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </button>
          <div className="text-center">
            <div className="text-red-600 text-lg">
              Error: {error || 'Resource not found'}
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
            onClick={() => navigate('/resources')}
            className="flex items-center text-blue-100 hover:text-white mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </button>
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              {getFileIcon(resource.type)}
              <span className="bg-blue-500 bg-opacity-50 px-3 py-1 rounded-full text-sm">
                {resource.type}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{resource.title}</h1>
            {resource.download_size && (
              <div className="flex items-center text-blue-100">
                <span>File Size: {resource.download_size}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resource Overview</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {resource.description}
                </p>
              </div>
            </div>

            {/* Download Section */}
            <div className="bg-blue-50 rounded-lg p-8 mb-12 text-center">
              <div className="mb-6">
                {getFileIcon(resource.type)}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Download Resource</h3>
              <p className="text-gray-600 mb-6">
                Access this valuable resource to support your irrigation and water management projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={`${backend_url}${resource.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Now
                </a>
                {resource.download_size && (
                  <span className="text-sm text-gray-500">Size: {resource.download_size}</span>
                )}
              </div>
            </div>

            {/* Resource Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Information</h3>
              <div className="space-y-3">

                {resource.type && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Type:</span>
                    <p className="text-gray-900">{resource.type}</p>
                  </div>
                )}
                {resource.download_size && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">File Size:</span>
                    <p className="text-gray-900">{resource.download_size}</p>
                  </div>
                )}
                {resource.upload_date && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Upload Date:</span>
                    <p className="text-gray-900">{new Date(resource.upload_date).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-500">Download:</span>
                  <a
                    href={`${backend_url}${resource.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Direct Download Link
                  </a>
                </div>
              </div>
            </div>

            {/* Usage Guidelines */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Usage Guidelines</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700">
                  This resource is provided for educational and research purposes. Please cite appropriately when using 
                  this material in your work. For questions about usage rights or licensing, please contact our team.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}