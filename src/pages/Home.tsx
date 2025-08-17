import React from 'react';
import { ChevronRight, Target, Users, Globe, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/Rabi_paddy.jpg"
            alt="Rice paddy fields"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-blue-800/50" />
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              EPIC: Equity Perspectives for Irrigation Care or Control
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Advancing sustainable and equitable irrigation practices through innovative research and community collaboration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/case-studies"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Explore Our Research
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/team"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Meet Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      {/* Project Video */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About Our Project
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch this video to learn more about our research, impact, and the communities we work with.
            </p>
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
      </section>

      {/* Research Areas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To develop and promote equitable irrigation solutions that enhance agricultural productivity 
              while ensuring sustainable water resource management for communities worldwide.
            </p>
          </div>
          
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div> */}
        </div>
      </section>

    </div>
  );
};

export default Home;