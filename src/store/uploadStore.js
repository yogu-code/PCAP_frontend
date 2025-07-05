import { create } from 'zustand';
import axios from 'axios';

const useUploadStore = create((set) => ({
  file: null,
  preview: null, // store rows and columns
  uploadStatus: '',
  error: '',
  filePath: '',

  setFile: (file) => set({ file }),
  setPreview: (preview) => set({ preview }),
  setUploadStatus: (uploadStatus) => set({ uploadStatus }),
  setError: (error) => set({ error }),
  setFilePath: (filePath) => set({ filePath }),
  clearState: () => set({
    file: null,
    preview: null,
    uploadStatus: '',
    error: '',
    filePath: ''
  }),

  uploadFile: async (file) => {
    if (!file) {
      set({ error: 'No file selected' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      set({ uploadStatus: 'Uploading...', error: '' });
      const response = await axios.post('http://127.0.0.1:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      set({
        uploadStatus: response.data.message || 'Upload successful!',
        filePath: response.data.file_path || '',
        preview: {
          rows: response.data.preview || [],
          columns: response.data.columns || []
        },
        error: '',
      });
      console.log('Upload API Response:', response.data);
    } catch (err) {
      set({
        uploadStatus: '',
        error: 'Upload failed. Please try again.',
      });
      console.error('Upload error:', err);
    }
  },
}));

export default useUploadStore;
