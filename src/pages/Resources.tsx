import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, FileText, Video, BookOpen, Search } from 'lucide-react';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface Resource {
  resource_number: string;
  title: string;
  type: string;
  description: string;
  link: string;
  thumbnail?: string;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');

  const filterResources = useCallback(() => {
    let filtered = resources;

    if (selectedType !== 'All') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  }, [resources, selectedType, searchQuery]);

  // Group resources by type
  const groupedResources = filteredResources.reduce((acc, resource) => {
    const type = resource.type || 'Others';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  // Sort the types in a specific order
  const typeOrder = ['Journal Articles', 'Conference Papers', 'Masters Thesis', 'Blog Posts', 'Others'];
  const sortedTypes = typeOrder.filter(type => groupedResources[type] && groupedResources[type].length > 0);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(`${backend_url}/get_resources`);
        const data = await response.json();
        setResources(data.resources);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [filterResources]);

  const resourceTypes = ['All', 'Journal Articles', 'Conference Papers', 'Masters Thesis', 'Blog Posts', 'Others'];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-40 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/resources-bg.jpg"
            alt="Case Studies"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-blue-800/60" />
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Project Output</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Access our comprehensive collection of guides, research papers, training materials, 
              and tools to support sustainable irrigation practices and water management.            </p>
          </div>
        </div>
      </section>
      {/* Header
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Project Output</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Access our comprehensive collection of guides, research papers, training materials, 
              and tools to support sustainable irrigation practices and water management.
            </p>
          </div>
        </div>
      </section> */}

      {/* Search and Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative max-w-md w-full">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {resourceTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resources List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No resources found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {sortedTypes.map((type) => (
                <div key={type}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-600 pb-2">
                    {type}
                  </h2>
                  <div className="space-y-6">
                    {groupedResources[type].map((resource, index) => (
                      <a
                        key={index}
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all group"
                      >
                        <div className="flex items-start">
                          {/* Thumbnail */}
                          {resource.thumbnail && (
                            <div className="flex-shrink-0 w-48 h-48">
                              <img
                                src={`${backend_url}${resource.thumbnail}`}
                                alt={resource.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Content */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start gap-4 mb-3">
                                  <div className="flex-shrink-0 mt-1">
                                    {resource.type === 'Journal Articles' ? (
                                      <FileText className="h-6 w-6 text-blue-600" />
                                    ) : resource.type === 'Conference Papers' ? (
                                      <BookOpen className="h-6 w-6 text-green-600" />
                                    ) : resource.type === 'Masters Thesis' ? (
                                      <FileText className="h-6 w-6 text-purple-600" />
                                    ) : resource.type === 'Blog Posts' ? (
                                      <Video className="h-6 w-6 text-orange-600" />
                                    ) : (
                                      <BookOpen className="h-6 w-6 text-gray-600" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between gap-4">
                                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {resource.title}
                                      </h3>
                                      <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0 transition-colors" />
                                    </div>
                                  </div>
                                </div>
                                
                                {resource.description && (
                                  <p className="text-gray-600 leading-relaxed ml-10">{resource.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Resources;