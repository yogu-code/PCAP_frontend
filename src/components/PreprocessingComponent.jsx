"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/SideBar.jsx';
import useUploadStore from '@/store/uploadStore';

function PreprocessingComponent() {
  const { preview, filePath } = useUploadStore();
  const [labelColumn, setLabelColumn] = useState('');
  const [columnsToDrop, setColumnsToDrop] = useState('');
  const [preprocessStatus, setPreprocessStatus] = useState('');
  const [error, setError] = useState('');
  const [processedData, setProcessedData] = useState(null);

  const handlePreprocess = async () => {
    if (!filePath) {
      setError('No file uploaded. Please upload a file first.');
      return;
    }
    if (!labelColumn) {
      setError('Please specify the label column.');
      return;
    }

    const columnsToDropArray = columnsToDrop
      .split(',')
      .map(col => col.trim())
      .filter(col => col);

    try {
      setPreprocessStatus('Preprocessing...');
      setError('');
      const response = await axios.post('http://127.0.0.1:8080/preprocess', {
        file_path: filePath,
        label_column: labelColumn,
        columns_to_drop: columnsToDropArray,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setPreprocessStatus('Preprocessing successful!');
      setProcessedData(response.data);
      console.log('Preprocess Response:', response.data);
    } catch (err) {
      setPreprocessStatus('');
      setError('Preprocessing failed. Please try again.');
      console.error('Preprocess error:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-6">
        <div className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Preprocess Uploaded File
          </h2>

          {preview && preview.rows && (
            <>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded File Preview</h3>
                <div className="overflow-x-auto max-h-96">
                  <table className="min-w-full bg-white border border-gray-200 text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        {preview.columns.map((col) => (
                          <th key={col} className="py-2 px-3 text-left font-medium text-gray-700 border-b">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {preview.columns.map((col) => (
                            <td key={col} className="py-2 px-3 border-b text-gray-600 truncate max-w-xs">
                              {row[col]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Target Column
                </label>
                <select
                  value={labelColumn}
                  onChange={(e) => setLabelColumn(e.target.value)}
                  className="block w-full text-sm text-gray-500 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a column</option>
                  {preview.columns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Columns to Drop (optional, comma-separated)
                </label>
                <input
                  type="text"
                  value={columnsToDrop}
                  onChange={(e) => setColumnsToDrop(e.target.value)}
                  placeholder="e.g., column1, column2"
                  className="block w-full text-sm text-gray-500 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {!preview && (
            <p className="text-sm text-gray-600 mb-6">No file uploaded yet. Please upload a file from the Upload page.</p>
          )}

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button
            onClick={handlePreprocess}
            disabled={!filePath || !labelColumn || preprocessStatus === 'Preprocessing...'}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
          >
            {preprocessStatus === 'Preprocessing...' ? 'Preprocessing...' : 'Preprocess File'}
          </button>

          {preprocessStatus && !error && (
            <div className="mb-6">
              <p className="text-sm text-green-500">{preprocessStatus}</p>
            </div>
          )}

          {processedData && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Preprocessing Results
              </h3>
              {/* Rest of your results rendering here... */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PreprocessingComponent;
