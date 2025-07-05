import React from 'react'
import Sidebar from '@/components/SideBar.jsx';

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to the Home Page</h1>
          <p className="text-gray-600 mt-2">Your hub for network file analysis and machine learning workflows</p>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Overview</h2>
            <p className="text-gray-600">
              This application allows you to upload PCAP and CSV files, preprocess data, train models, and make predictions. 
              Use the sidebar to navigate through the workflow.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Quick Start</h2>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Upload: Start by uploading your PCAP or CSV files</li>
              <li>Preprocess: Clean and prepare your data</li>
              <li>Train: Build machine learning models</li>
              <li>Predict: Test and generate predictions</li>
            </ul>
            <a
              href="/upload"
              className="mt-4 inline-block py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Get Started
            </a>
          </div>
        </section>
        <section className="mt-6 p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">About</h2>
          <p className="text-gray-600">
            This platform streamlines network traffic analysis and model training. 
            Designed for efficiency, it supports file uploads, data visualization, and predictive analytics.
          </p>
        </section>
      </main>
    </div>
  );
}

