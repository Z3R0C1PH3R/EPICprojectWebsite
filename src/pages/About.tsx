import { Link } from 'react-router-dom';
import { Target, Users, Globe, BookOpen, Lightbulb, BarChart3, MapPin, Calendar } from 'lucide-react';
import InteractiveWorldMap from '../components/InteractiveWorldMap';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About EPIC</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Equity Perspectives for Irrigation Care or Control - Advancing sustainable and equitable irrigation practices through innovative research and community collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* About Our Project */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Our Project</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              The EPIC project represents a comprehensive research initiative focused on understanding and improving 
              irrigation systems from an equity perspective. Our work spans multiple disciplines, bringing together 
              experts in agricultural engineering, environmental science, social equity, and technology to address 
              one of the most critical challenges facing global agriculture today.
            </p>
          </div>

          {/* Project Video */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Project Overview</h3>
              <p className="text-gray-600">Watch this video to learn more about our research, impact, and the communities we work with.</p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-xl">
                  <iframe 
                    src="https://drive.google.com/file/d/1KdZgHGjE1HxxnI5DKQLnVKjwKdLOJyxd/preview" 
                    className="absolute top-0 left-0 w-full h-full"
                    allow="autoplay"
                    title="EPIC Project Video"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Mission</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              To develop and promote equitable irrigation solutions that enhance agricultural productivity 
              while ensuring sustainable water resource management for communities worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Research Excellence</h3>
              <p className="text-gray-600">
                Conducting cutting-edge research to understand irrigation challenges and develop innovative solutions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Engagement</h3>
              <p className="text-gray-600">
                Working directly with farming communities to ensure our solutions meet real-world needs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Impact</h3>
              <p className="text-gray-600">
                Scaling successful irrigation practices to benefit communities across different regions and climates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Problem</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Irrigation systems are critical for global food security, yet they often perpetuate or exacerbate 
              social inequalities. Our research addresses the complex interplay between irrigation infrastructure, 
              water governance, and social equity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Objective */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-900">Objective</h3>
              </div>
              <p className="text-gray-600 mb-4">
                To develop a comprehensive understanding of how irrigation systems can be designed, managed, 
                and governed to promote equity and sustainability while enhancing agricultural productivity.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Analyze existing irrigation systems for equity gaps</li>
                <li>• Develop innovative solutions for equitable water distribution</li>
                <li>• Create frameworks for inclusive irrigation governance</li>
                <li>• Build capacity for sustainable irrigation practices</li>
              </ul>
            </div>

            {/* Research Questions */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <Lightbulb className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-900">Research Questions</h3>
              </div>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 font-semibold mr-2">1.</span>
                  How do irrigation systems currently distribute benefits and burdens across different social groups?
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-semibold mr-2">2.</span>
                  What governance mechanisms can ensure equitable access to irrigation water?
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-semibold mr-2">3.</span>
                  How can technology be leveraged to promote fairness in irrigation systems?
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-semibold mr-2">4.</span>
                  What role do gender and social inclusion play in irrigation effectiveness?
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Approach</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Our research employs a multidisciplinary approach combining field studies, data analysis, 
              community engagement, and policy development to create comprehensive solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Field Research</h3>
              <p className="text-gray-600">
                Conducting extensive field studies across multiple regions to understand local irrigation challenges.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Analysis</h3>
              <p className="text-gray-600">
                Using advanced analytics to identify patterns and develop evidence-based recommendations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Engagement</h3>
              <p className="text-gray-600">
                Working directly with stakeholders to ensure solutions are culturally appropriate and sustainable.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Knowledge Sharing</h3>
              <p className="text-gray-600">
                Disseminating findings through publications, workshops, and capacity-building programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Research Locations */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Research Locations</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Explore our case studies from different regions. Click on any location marker to learn more about 
              the specific challenges and solutions we're working on in that area.
            </p>
          </div>
          
          <InteractiveWorldMap />
        </div>
      </section>

      {/* Partners */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Partners</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Our research is strengthened by collaboration with leading institutions and organizations 
              committed to sustainable agriculture and water management.
            </p>
          </div>

          <div className="text-center mb-8">
            <Link
              to="/team"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              Meet Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* Project Activities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Activities</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Our project encompasses a wide range of activities designed to advance irrigation equity 
              and sustainability across different contexts and regions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Research Studies</h3>
              </div>
              <p className="text-gray-600">
                Conducting comprehensive studies on irrigation systems, water governance, and social equity 
                across multiple research sites.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Community Workshops</h3>
              </div>
              <p className="text-gray-600">
                Organizing participatory workshops with farming communities to understand local needs 
                and co-design solutions.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Capacity Building</h3>
              </div>
              <p className="text-gray-600">
                Developing training programs and educational materials for stakeholders involved in 
                irrigation management.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Policy Development</h3>
              </div>
              <p className="text-gray-600">
                Contributing to policy frameworks that promote equitable irrigation practices 
                and sustainable water management.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">International Collaboration</h3>
              </div>
              <p className="text-gray-600">
                Partnering with international organizations to share knowledge and scale successful 
                irrigation practices globally.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Impact Assessment</h3>
              </div>
              <p className="text-gray-600">
                Evaluating the effectiveness of irrigation interventions and their impact on 
                agricultural productivity and social equity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
