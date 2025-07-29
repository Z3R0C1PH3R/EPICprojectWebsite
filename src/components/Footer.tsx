import React from 'react';
import { Mail, Phone, MapPin, Droplets } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Droplets className="h-8 w-8 text-blue-400" />
              <div>
                <span className="text-xl font-bold">EPIC</span>
                <p className="text-sm text-gray-300">Equity Perspectives for Irrigation Care or Control</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              A comprehensive academic research project focused on sustainable and equitable irrigation practices 
              for agricultural development and water resource management.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">info@epic-project.edu</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">University Research Center</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Research Papers</a></li>
              <li><a href="#" className="hover:text-white">Publications</a></li>
              <li><a href="#" className="hover:text-white">Partnerships</a></li>
              <li><a href="#" className="hover:text-white">News</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2024 EPIC Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;