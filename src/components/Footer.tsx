import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/logo.png" 
                alt="EPIC Logo" 
                className="h-10 w-auto"
              />
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
            <h3 className="text-lg text-right font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-right text-gray-300">
              <li><a href="/team" className="hover:text-white">Team</a></li>
              <li><a href="/resources" className="hover:text-white">Resources</a></li>
              <li><a href="/gallery" className="hover:text-white">Gallery</a></li>
              <li><a href="/admin" className="hover:text-white">Admin</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2025 EPIC Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;