import React, { useState, useRef } from 'react';
import { FaFileUpload, FaEye, FaTrash, FaFilePdf, FaFileImage, FaExchangeAlt } from 'react-icons/fa';
import FileService from '../../Services/FileService';

const FileUploadField = ({
  id,
  label,
  value,
  onChange,
  onDelete = null, // Custom delete handler
  accept = "image/*,.pdf",
  required = false,
  error = null
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(`file-input-${id}-${Date.now()}`);
  const fileInputRef = useRef(null);

  // Determine if the file is an image or PDF
  const isImage = value && (
    value.toLowerCase().endsWith('.jpg') ||
    value.toLowerCase().endsWith('.jpeg') ||
    value.toLowerCase().endsWith('.png') ||
    value.toLowerCase().endsWith('.gif') ||
    value.toLowerCase().includes('/image/') ||
    value.toLowerCase().includes('candidatephoto') ||
    value.toLowerCase().includes('candidatesignature') ||
    value.toLowerCase().includes('thumbimpression')
  );

  const isPdf = value && (
    value.toLowerCase().endsWith('.pdf') ||
    value.toLowerCase().includes('/pdf/') ||
    value.toLowerCase().includes('marksheet') ||
    value.toLowerCase().includes('aadharphoto')
  );

  // Get file URL for preview
  const fileUrl = value ? FileService.getFileUrl(value) : null;

  // Get file name from path
  const getFileName = (path) => {
    if (!path) return '';

    // Handle full URLs
    if (path.startsWith('http')) {
      const urlParts = new URL(path).pathname.split('/');
      return urlParts[urlParts.length - 1];
    }

    // Handle relative paths
    if (path.includes('/')) {
      const parts = path.split('/');
      return parts[parts.length - 1];
    }

    // Handle just filenames
    return path;
  };

  // Handle file deletion
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Only attempt to delete the file from the server if it's a real file path
      if (value && (value.includes('/') || value.startsWith('http'))) {
        console.log(`Attempting to delete file: ${value}`);

        // Show a confirmation dialog
        if (window.confirm('Are you sure you want to delete this file?')) {
          try {
            // Delete the file from the server
            await FileService.deleteFile(value);
            console.log('File deleted successfully from server');
          } catch (error) {
            console.error('Error deleting file from server:', error);
            // Continue with clearing the field even if server deletion fails
          }
        } else {
          // User cancelled the deletion
          return;
        }
      }

      // If a custom delete handler is provided, use it
      if (onDelete && typeof onDelete === 'function') {
        console.log(`Using custom delete handler for ${id}`);
        onDelete();
      } else {
        // Otherwise, use the default behavior
        console.log(`Using default delete handler for ${id}`);

        // Generate a new key for the file input to force a complete reset
        const newKey = `file-input-${id}-${Date.now()}`;
        setFileInputKey(newKey);

        // Create a synthetic event to clear the file
        const syntheticEvent = {
          target: {
            id,
            value: '',
            files: null
          }
        };

        // Call onChange to update the parent component's state
        onChange(syntheticEvent);
      }

      // Log the deletion for debugging
      console.log(`File deleted and field cleared for ${id}`);
    } catch (error) {
      console.error('Error in handleDelete:', error);
      alert('Failed to delete the file. Please try again.');
    }
  };

  // Toggle preview
  const togglePreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewOpen(!previewOpen);
  };

  // Trigger file input click to allow changing the file
  const handleChangeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Trigger the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div>
        {/* Always render the file input but hide it */}
        <div className="hidden">
          <input
            type="file"
            id={id}
            ref={fileInputRef}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            accept={accept}
            key={fileInputKey} // Use the state variable to force re-render when value changes
          />
        </div>

        {/* Show file upload UI when no file is selected */}
        {!value && (
          <div className="relative" onClick={() => fileInputRef.current?.click()}>
            <div className="w-full px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 flex items-center justify-center">
              <FaFileUpload size={20} className="text-gray-400 mr-2" />
              <span className="text-gray-500">Click to select a file</span>
            </div>
          </div>
        )}

        {/* File preview when a file is selected */}
        {value && (
          <div className="flex items-center border rounded-lg p-2 bg-gray-50">
            <div className="mr-2">
              {isImage ? <FaFileImage className="text-blue-500" size={20} /> :
               isPdf ? <FaFilePdf className="text-red-500" size={20} /> :
               <FaFileUpload className="text-gray-500" size={20} />}
            </div>
            <div className="flex-grow truncate text-sm">
              {getFileName(value)}
            </div>
            <div className="flex space-x-2">
              {fileUrl && (
                <button
                  onClick={togglePreview}
                  className="p-1 hover:bg-gray-200 rounded text-blue-600"
                  title="Preview file"
                >
                  <FaEye size={16} />
                </button>
              )}
              <button
                onClick={handleChangeClick}
                className="p-1 hover:bg-gray-200 rounded text-green-600"
                title="Change file"
              >
                <FaExchangeAlt size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-gray-200 rounded text-red-600"
                title="Remove file"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {/* File Preview Modal */}
      {previewOpen && fileUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={togglePreview}>
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{getFileName(value)}</h3>
              <button onClick={togglePreview} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="flex justify-center">
              {isImage ? (
                <img src={fileUrl} alt={label} className="max-w-full max-h-[70vh] object-contain" />
              ) : isPdf ? (
                <iframe src={fileUrl} title={label} className="w-full h-[70vh]" />
              ) : (
                <div className="p-4 text-center">
                  <p>Preview not available for this file type.</p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadField;
