import React from 'react';
import { Mail, Linkedin, Award, Users } from 'lucide-react';

const Team = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Principal Investigator",
      department: "Agricultural Engineering",
      bio: "Dr. Chen leads our research initiatives with over 15 years of experience in sustainable irrigation systems and water resource management.",
      image: "Team Member Photo",
      email: "s.chen@epic-project.edu",
      linkedin: "#"
    },
    {
      name: "Prof. Michael Rodriguez",
      role: "Research Director",
      department: "Environmental Science",
      bio: "Specializes in climate adaptation strategies and community-based water management with extensive fieldwork experience.",
      image: "Team Member Photo",
      email: "m.rodriguez@epic-project.edu",
      linkedin: "#"
    },
    {
      name: "Dr. Amara Okafor",
      role: "Social Equity Researcher",
      department: "Development Studies",
      bio: "Focuses on gender equity in irrigation access and participatory approaches to water resource management.",
      image: "Team Member Photo",
      email: "a.okafor@epic-project.edu",
      linkedin: "#"
    },
    {
      name: "Dr. James Thompson",
      role: "Technology Lead",
      department: "Computer Science",
      bio: "Develops smart irrigation systems and IoT solutions for precision agriculture and water conservation.",
      image: "Team Member Photo",
      email: "j.thompson@epic-project.edu",
      linkedin: "#"
    },
    {
      name: "Dr. Priya Sharma",
      role: "Field Coordinator",
      department: "Agricultural Economics",
      bio: "Coordinates field studies and community engagement programs across multiple countries and regions.",
      image: "Team Member Photo",
      email: "p.sharma@epic-project.edu",
      linkedin: "#"
    },
    {
      name: "Dr. David Kim",
      role: "Data Analyst",
      department: "Statistics",
      bio: "Leads data analysis and modeling efforts to evaluate irrigation system effectiveness and impact assessment.",
      image: "Team Member Photo",
      email: "d.kim@epic-project.edu",
      linkedin: "#"
    }
  ];

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

      {/* Core Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Research Team</h2>
            <p className="text-lg text-gray-600">
              Our multidisciplinary team brings together expertise from various fields to address complex irrigation challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">{member.image}</span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-1">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.department}</p>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">{member.bio}</p>
                  
                  <div className="flex gap-3">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                    <a
                      href={member.linkedin}
                      className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      {/* Team Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Team Impact</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">25+</div>
              <p className="text-gray-600">Team Members</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <p className="text-gray-600">Research Papers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15</div>
              <p className="text-gray-600">Countries</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <p className="text-gray-600">Collaborations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;