import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface CaseStudySection {
  heading: string;
  body: string;
  image?: string;
}

interface CaseStudy {
  case_study_number: string;
  title: string;
  location: string;
  date: string;
  category: string;
  description: string;
  cover_image: string;
  upload_date: string;
  sections?: CaseStudySection[];
}

export default function CaseStudyDetail() {
  const { caseStudyNumber } = useParams();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        const response = await fetch(`${backend_url}/get_case_studies`);
        if (!response.ok) {
          throw new Error('Failed to fetch case studies');
        }
        const data = await response.json();
        const foundCaseStudy = data.case_studies.find(
          (cs: CaseStudy) => cs.case_study_number === caseStudyNumber
        );
        if (!foundCaseStudy) {
          throw new Error(`Case Study #${caseStudyNumber} not found`);
        }
        setCaseStudy(foundCaseStudy);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();
  }, [caseStudyNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="bg-white min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/case-studies')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Case Studies
          </button>
          <div className="text-center">
            <div className="text-red-600 text-lg">
              Error: {error || 'Case study not found'}
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
            onClick={() => navigate('/case-studies')}
            className="flex items-center text-blue-100 hover:text-white mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Case Studies
          </button>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{caseStudy.title}</h1>
            <div className="flex flex-wrap gap-6 text-blue-100">
              {caseStudy.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{caseStudy.location}</span>
                </div>
              )}
              {caseStudy.category && (
                <span className="bg-blue-500 bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  {caseStudy.category}
                </span>
              )}
            </div>
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
            {/* Cover Image */}
            {caseStudy.cover_image && (
              <div className="mb-12">
                <img
                  src={`${backend_url}${caseStudy.cover_image}`}
                  alt={caseStudy.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Overview</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {caseStudy.description}
                </p>
              </div>
            </div>

            {/* Sections */}
            {caseStudy.sections && caseStudy.sections.length > 0 && (
              <div className="mb-12 space-y-12">
                {caseStudy.sections.map((section, index) => (
                  <div key={index}>
                    {section.image && (
                      <div className="mb-8">
                        <img
                          src={`${backend_url}${section.image}`}
                          alt={section.heading}
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
                      </div>
                    )}
                    {section.heading && (
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.heading}</h2>
                    )}
                    {section.body && (
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {section.body}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Study Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Information</h3>
              <div className="space-y-3">
                {caseStudy.category && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category:</span>
                    <p className="text-gray-900">{caseStudy.category}</p>
                  </div>
                )}
                {caseStudy.date && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Study Date:</span>
                    <p className="text-gray-900">{caseStudy.date}</p>
                  </div>
                )}
                {caseStudy.location && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Location:</span>
                    <p className="text-gray-900">{caseStudy.location}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}