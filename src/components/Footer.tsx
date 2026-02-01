import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white rounded-full p-2 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="EPIC Logo" 
                  className="h-12 w-auto"
                />
              </div>
              <div>
                <span className="text-3xl font-bold">EPIC</span>
                <p className="text-base text-gray-300">Equity Perspectives for Irrigation Care or Control</p>
              </div>
            </div>
          </div>

          <div className="text-gray-300">
            <h3 className="text-lg text-right font-semibold mb-2">Contact</h3>
            <div className="text-right">
              <p className="mb-1">Prof. Pooja Prasad</p>
              <p className="mb-1">School of Public Policy, IIT Delhi</p>
              <p className="mb-1">Hauz Khas, New Delhi 110016</p>
              <p>Email: p_pooja [at] iitd...</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            <Link to="/admin" className="cursor-text">
              &copy;
            </Link>
            {' '} 2025 EPIC Project. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;