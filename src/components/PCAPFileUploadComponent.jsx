"use client";
import React, { useState } from 'react';
import Papa from 'papaparse';
import Sidebar from '@/components/SideBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useUploadStore from '@/store/uploadStore';

function PCAPFileUploadComponent() {
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  
  const { file, preview, uploadStatus, error, filePath, setFile, setPreview, setError, uploadFile } = useUploadStore();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === 'application/vnd.tcpdump.pcap' || selectedFile.type === 'text/csv')
    ) {
      setFile(selectedFile);
      setPreview({
        name: selectedFile.name,
        size: (selectedFile.size / 1024).toFixed(2) + ' KB',
        type: selectedFile.type,
      });
      setError('');

      if (selectedFile.type === 'text/csv') {
        Papa.parse(selectedFile, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim().replace(/^"|"$/g, ''),
          transform: (value) => value.trim().replace(/^"|"$/g, ''),
          complete: (results) => {
            const cleanedData = results.data.map((row) => {
              const cleanedRow = {};
              Object.keys(row).forEach((key) => {
                cleanedRow[key] = row[key] === '' || row[key] == null ? 'N/A' : row[key];
              });
              return cleanedRow;
            });
            setCsvHeaders(Object.keys(cleanedData[0] || {}));
            setCsvData(cleanedData);
          },
          error: (err) => {
            setError('Failed to parse CSV file.');
            console.error('CSV parse error:', err);
          },
        });
      } else {
        setCsvData([]);
        setCsvHeaders([]);
      }
    } else {
      setFile(null);
      setPreview(null);
      setCsvData([]);
      setCsvHeaders([]);
      setError('Please select a valid .pcap or .csv file');
    }
  };

  const chartData = csvData.map((row, index) => ({
    index: index + 1,
    FwdPktLenMax: parseFloat(row['Fwd Pkt Len Max']) || 0,
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-6">
        <div className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Upload PCAP or CSV File
          </h2>

          <div className="mb-4">
            <input
              type="file"
              accept=".pcap,.csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {preview && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700">
                File Preview
              </h3>
              <p className="text-sm text-gray-600">Name: {preview.name}</p>
              <p className="text-sm text-gray-600">Size: {preview.size}</p>
              <p className="text-sm text-gray-600">Type: {preview.type}</p>
            </div>
          )}

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button
            onClick={() => uploadFile(file)}
            disabled={!file || uploadStatus === 'Uploading...'}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
          >
            {uploadStatus === 'Uploading...' ? 'Uploading...' : 'Upload File'}
          </button>

          {uploadStatus && !error && (
            <div className="mb-4">
              <p className="text-sm text-green-500">{uploadStatus}</p>
              {filePath && (
                <p className="text-sm text-gray-600 mt-2">File Path: {filePath}</p>
              )}
            </div>
          )}

          {csvData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                CSV Data
              </h3>
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full bg-white border border-gray-200 text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      {csvHeaders.map((header) => (
                        <th
                          key={header}
                          className="py-2 px-3 text-left font-medium text-gray-700 border-b"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {csvHeaders.map((header) => (
                          <td
                            key={header}
                            className="py-2 px-3 border-b text-gray-600 truncate max-w-xs"
                          >
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Forward Packet Length Max Distribution
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Interesting fact: The maximum forward packet length varies
                  significantly, with some flows reaching up to 1375 bytes,
                  indicating potential large data transfers in certain sessions.
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="index"
                      label={{
                        value: 'Flow Index',
                        position: 'bottom',
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      label={{
                        value: 'Fwd Pkt Len Max (bytes)',
                        angle: -90,
                        position: 'insideLeft',
                        fontSize: 12,
                      }}
                      fontSize={12}
                    />
                    <Tooltip />
                    <Bar dataKey="FwdPktLenMax" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PCAPFileUploadComponent;