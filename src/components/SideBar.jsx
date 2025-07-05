"use client";
import React from 'react';
import Link from 'next/link';

function Sidebar() {
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Upload', path: '/upload' },
    { name: 'Preprocess', path: '/preprocess' },
    { name: 'Train', path: '/train' },
    { name: 'Upload Test', path: '/upload-test' },
    { name: 'Predict', path: '/predict' },
  ];

  return (
    <div className="h-screen w-64 bg-gray-800 text-white fixed top-0 left-0 flex flex-col shadow-lg">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Navigation</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {pages.map((page) => (
            <li key={page.name}>
              <Link
                href={page.path}
                className="block py-2 px-4 rounded-md hover:bg-gray-700 hover:text-blue-300 transition-colors duration-200"
              >
                {page.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;