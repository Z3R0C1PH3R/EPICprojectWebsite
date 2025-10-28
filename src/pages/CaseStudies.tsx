import { useState, useEffect } from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CaseStudiesMap from '../components/CaseStudiesMap';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface Section {
  image?: string;
  heading: string;
  body: string;
}

interface CaseStudy {
  case_study_number: string;
  title: string;
  location?: string;
  date?: string;
  description: string;
  cover_image?: string;
  pdf_file?: string;
  link?: string;
  sections?: Section[];
}

const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await fetch(`${backend_url}/get_case_studies`);
      const data = await response.json();
      setCaseStudies(data.case_studies);
    } catch (error) {
      console.error('Error fetching case studies:', error);
    }
  };

  const handleViewDetails = (caseStudyNumber: string) => {
    navigate(`/case-studies/${caseStudyNumber}`);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-40 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/case-study-bg.jpg"
            alt="Case Studies"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-blue-800/60" />
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Case Studies</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Project EPIC explores grounded ideas of equity through case studies in three different countries. Find more details about our case studies here.
            </p>
          </div>
        </div>
      </section>

          {/* Our Case Study Locations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Case Study Locations</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
              Explore our research sites across India, Tanzania, and Ethiopia. Click on each location to learn more about the specific case study.
            </p>
          </div>
          
          <CaseStudiesMap />
        </div>
      </section>      {/* Case Studies Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {study.cover_image ? (
                    <img
                      src={`${backend_url}${study.cover_image}`}
                      alt={study.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">Study Image Placeholder</span>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{study.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    {study.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{study.location}</span>
                      </div>
                    )}
                    {study.date && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">{study.date}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">{study.description}</p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(study.case_study_number)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </button>
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

export default CaseStudies;