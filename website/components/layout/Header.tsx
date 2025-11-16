import React from 'react';
import { Captions } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Captions className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Video Caption Studio
              </h1>
              <p className="text-sm text-gray-600">
                Auto-generate and style captions for your videos
              </p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              How it Works
            </a>
            <a
              href="#support"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Support
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};