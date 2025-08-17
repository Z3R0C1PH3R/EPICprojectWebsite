import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Award, Users, Building } from 'lucide-react';

const backend_url = import.meta.env.VITE_BACKEND_URL;

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  email: string;
  linkedin: string;
  image: string;
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

  const advisors = [
    {
      name: "Prof. Elizabeth Watson",
      role: "Advisory Board Chair",
      affiliation: "MIT Water Resources Center"
    },
    {
      name: "Dr. Ahmed Hassan",
      role: "Regional Advisor",
      affiliation: "International Water Management Institute"
    },
    {
      name: "Prof. Maria Santos",
      role: "Technical Advisor",
      affiliation: "FAO Water and Agriculture Division"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Meet the dedicated researchers, scientists, and practitioners working to advance 
              equitable irrigation practices and sustainable water management worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Partners and Team Members */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Partners & Team</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our research is strengthened by collaboration with leading institutions and organizations 
              committed to sustainable agriculture and water management.
            </p>
            
            {/* Group Photo */}
            <div className="mb-12">
              <div className="relative max-w-4xl mx-auto">
                <img
                  src="/group.jpg"
                  alt="EPIC Project Team"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
                  <p className="text-sm font-medium">EPIC Project Team</p>
                </div>
              </div>
            </div>
          </div>

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
                          <div className="h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">{member.image}</span>
                          </div>
                          
                          <div className="p-4">
                            <h4 className="text-lg font-semibold mb-1">{member.name}</h4>
                            <p className="text-blue-600 font-medium mb-1">{member.role}</p>
                            <p className="text-gray-600 text-sm mb-3">{member.department}</p>
                            
                            <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{member.bio}</p>
                            
                            <div className="flex gap-2">
                              <a
                                href={`mailto:${member.email}`}
                                className="flex items-center px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </a>
                              {member.linkedin && (
                                <a
                                  href={member.linkedin}
                                  className="flex items-center px-2 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
                                >
                                  <Linkedin className="h-3 w-3 mr-1" />
                                  LinkedIn
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

      {/* Advisory Board */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advisory Board</h2>
            <p className="text-lg text-gray-600">
              Distinguished experts who provide strategic guidance and oversight for our research initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advisors.map((advisor, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{advisor.name}</h3>
                <p className="text-blue-600 font-medium mb-1">{advisor.role}</p>
                <p className="text-gray-600">{advisor.affiliation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;