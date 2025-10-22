import { Link } from 'react-router-dom';
import { Target, Users, BookOpen, Lightbulb, BarChart3 } from 'lucide-react';
import InteractiveWorldMap from '../components/InteractiveWorldMap';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/EPIChomepage.jpg"
            alt="About EPIC"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-blue-800/50" />
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About EPIC</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Equity Perspectives for Irrigation Care or Control? Creating knowledge and capacity for socially inclusive and ecologically sustainable irrigation water management
            </p>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              There is a need to reimagine the principles and practice of irrigation water management in a way that ensures fair distribution of water amongst different people, between people and nature, and across generations. Our aim is to unpack different perspectives and knowledges of equity using a grounded approach, and to trigger a transformation in the practice of irrigation water management by developing new knowledge and tools to mainstream equity concerns within irrigation engineers, practitioners and policymakers.
            </p>
          </div>
        </div>
      </section>

      {/* Research Focus */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Research Focus</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Overall Research Question */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-900">Overall Research Question</h3>
              </div>
              <p className="text-gray-600">
                How can the guiding principles and practice of irrigation water management respond to different knowledges and perspectives of equity in a way that results in enhanced social inclusiveness and greater sustainability of natural resources?
              </p>
            </div>

            {/* Specific Research Questions */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <Lightbulb className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-semibold text-gray-900">Specific Research Questions</h3>
              </div>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 font-semibold mr-2">•</span>
                  How do policies and programs (and the institutions designing them) conceptualize equity in irrigation management?
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-semibold mr-2">•</span>
                  What are the principles and practices of irrigation water distribution through which considerations of equity are operationalized (or not)?
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-semibold mr-2">•</span>
                  What are the different perceptions of fairness held by actors in different irrigation contexts, as linked to the social power derived from ethnicity, caste, class, gender and age identities?
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-semibold mr-2">•</span>
                  How can equity in irrigation water management be assessed based on different perspectives of equity?
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EPIC Pathways of Change */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">EPIC Pathways of Change</h2>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-5xl">
              <img
                src="/epic-pathways.png"
                alt="EPIC Pathways of Change"
                className="w-full h-auto rounded-lg shadow-lg"
              />
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

      {/* Expected Project Outcomes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Expected Project Outcomes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">New Knowledge</h3>
              <p className="text-gray-600">
                New, improved knowledge on diverse grounded perspectives of equity in irrigation water distribution
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tools</h3>
              <p className="text-gray-600">
                Application of equity assessment game, framework and/or tools by irrigational professionals, researchers and practitioners to better design or assess equity implications of irrigation interventions
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Capacity Building</h3>
              <p className="text-gray-600">
                Enhanced learning and capacity in research and education in water
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mainstreaming</h3>
              <p className="text-gray-600">
                Mainstreaming of equity concerns in irrigation water distribution within irrigation engineers, practitioners and policymakers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EPIC Project Partners */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">EPIC Project Partners</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
              The EPIC consortium comprises eight organizations (Academic, government and non-government) across four countries. Meet our team here.
            </p>
          </div>

          <div className="text-center">
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
    </div>
  );
};

export default About;
