// FileService.jsx - Service for file upload-related API calls
import API from './Api';

const FileService = {
  // Upload a single file
  uploadFile: async (file, folder = 'general') => {
    try {
      console.log(`Uploading file ${file.name} to folder ${folder}`);

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Make the API call with multipart/form-data content type
      // We need to explicitly remove the Content-Type header so the browser can set it with the boundary
      const response = await API.post('/upload', formData, {
        headers: {
          'Content-Type': undefined // This forces Axios to remove the default header
        },
      });

      console.log('Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Upload multiple files
  uploadMultipleFiles: async (files, folder = 'general') => {
    try {
      console.log(`Uploading ${files.length} files to folder ${folder}`);

      // Create a FormData object to send the files
      const formData = new FormData();

      // Append each file to the FormData
      files.forEach((file, index) => {
        formData.append(`files`, file);
        console.log(`Added file ${index + 1}: ${file.name} (${file.type})`);
      });

      // Append the folder name
      formData.append('folder', folder);

      // Make the API call with multipart/form-data content type
      // We need to explicitly remove the Content-Type header so the browser can set it with the boundary
      const response = await API.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': undefined // This forces Axios to remove the default header
        },
      });

      console.log('Multiple upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  },

  // Upload a file with a specific name (for student documents)
  uploadStudentDocument: async (file, studentId, documentType) => {
    try {
      console.log(`Uploading ${documentType} for student ${studentId}: ${file.name}`);

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('studentId', studentId);
      formData.append('documentType', documentType);

      // Make the API call with multipart/form-data content type
      // We need to explicitly remove the Content-Type header so the browser can set it with the boundary
      const response = await API.post('/upload/student-document', formData, {
        headers: {
          'Content-Type': undefined // This forces Axios to remove the default header
        },
      });

      console.log('Student document upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error uploading ${documentType} for student ${studentId}:`, error);
      throw error;
    }
  },

  // Get file URL by filename
  getFileUrl: (filename) => {
    if (!filename) return null;

    // If it's already a full URL, return it
    if (filename.startsWith('http')) {
      return filename;
    }

    // For actual file access
    // Construct the URL to the file on the server
    const baseUrl = 'http://localhost:4000'; // Hardcoded for now to avoid errors

    try {
      console.log(`Getting URL for file: ${filename}`);

      // If it's a relative path that already includes 'uploads', don't add it again
      if (filename.startsWith('uploads/')) {
        const url = `${baseUrl}/${filename}`;
        console.log(`Constructed URL (with uploads): ${url}`);
        return url;
      }

      // Otherwise, construct the URL assuming it's in the uploads directory
      const url = `${baseUrl}/uploads/${filename}`;
      console.log(`Constructed URL: ${url}`);
      return url;
    } catch (error) {
      console.error('Error constructing file URL:', error);

      // Return a generic placeholder image as fallback
      let placeholderUrl;
      if (filename.toLowerCase().includes('photo')) {
        placeholderUrl = 'https://placehold.co/300x300/e0f2fe/0284c7?text=Student+Photo';
      } else if (filename.toLowerCase().includes('aadhar')) {
        placeholderUrl = 'https://placehold.co/400x250/ffe4e6/be123c?text=Aadhar+Card';
      } else {
        placeholderUrl = 'https://placehold.co/300x300/e2e8f0/475569?text=Document';
      }

      console.log(`Using placeholder URL: ${placeholderUrl}`);
      return placeholderUrl;
    }
  },

  // Delete a file
  deleteFile: async (filePath) => {
    try {
      console.log(`Deleting file: ${filePath}`);

      // Extract the path relative to the uploads directory
      let relativePath = filePath;

      // If it's a full URL, extract the path
      if (filePath.startsWith('http')) {
        const url = new URL(filePath);
        const pathParts = url.pathname.split('/');
        const uploadsIndex = pathParts.indexOf('uploads');

        if (uploadsIndex !== -1 && uploadsIndex < pathParts.length - 1) {
          relativePath = pathParts.slice(uploadsIndex + 1).join('/');
          console.log(`Extracted relative path: ${relativePath}`);
        } else {
          throw new Error('Invalid file path format');
        }
      }

      // Make the API call to delete the file
      const response = await API.delete(`/upload?path=${encodeURIComponent(relativePath)}`);

      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // Get appropriate placeholder image based on document type
  getPlaceholderImage: (documentType) => {
    if (!documentType) return 'https://placehold.co/200x200/e2e8f0/475569?text=Document';

    const type = String(documentType).toLowerCase();

    // Use more visually appealing placeholders with better colors
    if (type.includes('photo') || type.includes('image')) {
      return 'https://placehold.co/300x300/e0f2fe/0284c7?text=Student+Photo';
    } else if (type.includes('signature')) {
      return 'https://placehold.co/400x100/f0fdf4/16a34a?text=Signature';
    } else if (type.includes('thumb')) {
      return 'https://placehold.co/200x200/fef9c3/ca8a04?text=Thumb+Impression';
    } else if (type.includes('marksheet') && type.includes('10')) {
      return 'https://placehold.co/400x500/f1f5f9/475569?text=10th+Marksheet';
    } else if (type.includes('marksheet') && type.includes('12')) {
      return 'https://placehold.co/400x500/f1f5f9/475569?text=12th+Marksheet';
    } else if (type.includes('marksheet')) {
      return 'https://placehold.co/400x500/f1f5f9/475569?text=Marksheet';
    } else if (type.includes('aadhar')) {
      return 'https://placehold.co/400x250/ffe4e6/be123c?text=Aadhar+Card';
    } else if (type.includes('pdf')) {
      return 'https://placehold.co/400x500/f1f5f9/475569?text=PDF+Document';
    } else {
      return 'https://placehold.co/300x300/e2e8f0/475569?text=Document';
    }
  }
};

export default FileService;
