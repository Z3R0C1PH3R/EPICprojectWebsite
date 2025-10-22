import { useState, useEffect } from 'react';
import { Mail, Linkedin, Twitter, ExternalLink, ChevronDown, ChevronUp, Users, Building } from 'lucide-react';
import PartnersMap from '../components/PartnersMap';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface TeamMember {
  id: string;
  name: string;
  designation?: string;
  role: string;
  department?: string;
  bio: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  webpage?: string;
  image?: string;
}

interface Partner {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
}

const Team = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBios, setExpandedBios] = useState<{ [key: string]: boolean }>({});

  const toggleBio = (memberId: string) => {
    setExpandedBios(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch(`${backend_url}/get_partners`);
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/group.jpg"
            alt="EPIC Project Team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-blue-800/60" />
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              The EPIC consortium comprises eight organizations across four countries. Meet them here.
            </p>
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Partners</h2>
            <p className="text-lg text-gray-600 mb-8">
              Led by IIT Delhi, the EPIC project team comprises the following partners
            </p>
          </div>

          {/* Interactive Map */}
          <div className="mb-16">
            <PartnersMap />
          </div>
        </div>
      </section>

      {/* Partners and Team Members */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading team information...</p>
            </div>
          ) : (
            <div className="space-y-12">
              {partners.map((partner) => (
                <div key={partner.id} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                  <div className="flex items-center mb-6">
                    <Building className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{partner.name}</h3>
                      <p className="text-gray-600">{partner.description}</p>
                    </div>
                  </div>

                  {partner.members.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {partner.members.map((member) => (
                        <div key={member.id} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          {/* Member Image */}
                          <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                            {member.image ? (
                              <img 
                                src={member.image} 
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-500">No Photo</span>
                            )}
                          </div>
                          
                          <div className="p-4">
                            <h4 className="text-lg font-semibold mb-1">{member.name}</h4>
                            {member.designation && (
                              <p className="text-gray-700 font-medium mb-1">{member.designation}</p>
                            )}
                            <p className="text-blue-600 font-medium mb-1">{member.role}</p>
                            {member.department && (
                              <p className="text-gray-600 text-sm mb-3">{member.department}</p>
                            )}
                            
                            {/* Bio with expand/collapse */}
                            {member.bio && (
                              <div className="mb-4">
                                <p className={`text-gray-600 text-sm ${expandedBios[member.id] ? '' : 'line-clamp-3'}`}>
                                  {member.bio}
                                </p>
                                {member.bio.length > 150 && (
                                  <button
                                    onClick={() => toggleBio(member.id)}
                                    className="text-blue-600 text-sm hover:text-blue-800 flex items-center gap-1 mt-1"
                                  >
                                    {expandedBios[member.id] ? (
                                      <>
                                        <span>Show less</span>
                                        <ChevronUp className="h-3 w-3" />
                                      </>
                                    ) : (
                                      <>
                                        <span>Read more</span>
                                        <ChevronDown className="h-3 w-3" />
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            )}
                            
                            {/* Social Links */}
                            <div className="flex flex-wrap gap-2">
                              {member.email && (
                                <a
                                  href={`mailto:${member.email}`}
                                  className="flex items-center px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                  title="Email"
                                >
                                  <Mail className="h-3 w-3 mr-1" />
                                  Email
                                </a>
                              )}
                              {member.webpage && (
                                <a
                                  href={member.webpage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center px-2 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
                                  title="Webpage"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Website
                                </a>
                              )}
                              {member.linkedin && (
                                <a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center px-2 py-1 border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50 transition-colors"
                                  title="LinkedIn"
                                >
                                  <Linkedin className="h-3 w-3 mr-1" />
                                  LinkedIn
                                </a>
                              )}
                              {member.twitter && (
                                <a
                                  href={member.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center px-2 py-1 border border-sky-500 text-sky-500 rounded text-sm hover:bg-sky-50 transition-colors"
                                  title="Twitter/X"
                                >
                                  <Twitter className="h-3 w-3 mr-1" />
                                  Twitter
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No team members added yet for this partner organization.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Team;