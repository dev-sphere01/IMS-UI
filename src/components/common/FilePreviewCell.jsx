import React, { useState } from 'react';
import { FaEye, FaFileImage, FaFilePdf, FaFile, FaExternalLinkAlt, FaTrash } from 'react-icons/fa';
import FileService from '../../Services/FileService';

/**
 * Component for displaying file previews in tables
 *
 * @param {Object} props Component props
 * @param {string} props.filePath Path to the file
 * @param {string} props.fileType Type of file (optional, will be auto-detected if not provided)
 * @param {string} props.label Label for the file (optional)
 * @param {boolean} props.showLabel Whether to show the label (default: false)
 * @param {string} props.size Size of the icon (default: 'md')
 */
const FilePreviewCell = ({
  filePath,
  fileType,
  label,
  showLabel = false,
  size = 'md',
  onDelete = null, // Callback function when file is deleted
  allowDelete = false // Whether to show delete button
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!filePath) {
    return <span className="text-gray-400">No file</span>;
  }

  // Determine file type if not provided
  let fileTypeToUse = fileType;
  if (!fileTypeToUse) {
    const lowerPath = filePath.toLowerCase();
    if (lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg') ||
        lowerPath.endsWith('.png') || lowerPath.endsWith('.gif') ||
        lowerPath.includes('photo') || lowerPath.includes('signature') ||
        lowerPath.includes('thumb')) {
      fileTypeToUse = 'image';
    } else if (lowerPath.endsWith('.pdf') || lowerPath.includes('marksheet') ||
               lowerPath.includes('aadhar')) {
      fileTypeToUse = 'pdf';
    } else {
      fileTypeToUse = 'other';
    }
  }

  // Get placeholder image for fallback
  const placeholderUrl = FileService.getPlaceholderImage(fileTypeToUse || label);

  // Get the actual file URL
  const fileUrl = FileService.getFileUrl(filePath);

  console.log(`File path: ${filePath}`);
  console.log(`File URL: ${fileUrl}`);
  console.log(`Placeholder URL: ${placeholderUrl}`);

  // Get file name from path
  const getFileName = (path) => {
    if (!path) return '';

    // Handle full URLs
    if (path.startsWith('http')) {
      try {
        const urlParts = new URL(path).pathname.split('/');
        return urlParts[urlParts.length - 1];
      } catch (e) {
        return path;
      }
    }

    // Handle relative paths
    if (path.includes('/')) {
      const parts = path.split('/');
      return parts[parts.length - 1];
    }

    // Handle just filenames
    return path;
  };

  // Get display label
  const displayLabel = label || getFileName(filePath);

  // Get icon based on file type
  const getIcon = () => {
    const sizeProps = {
      sm: { size: 16 },
      md: { size: 20 },
      lg: { size: 24 }
    };

    const iconProps = sizeProps[size] || sizeProps.md;

    switch (fileTypeToUse) {
      case 'image':
        return <FaFileImage className="text-blue-500" {...iconProps} />;
      case 'pdf':
        return <FaFilePdf className="text-red-500" {...iconProps} />;
      default:
        return <FaFile className="text-gray-500" {...iconProps} />;
    }
  };

  // Toggle preview
  const togglePreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewOpen(!previewOpen);
  };

  // Handle file deletion
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Show a confirmation dialog
      if (window.confirm('Are you sure you want to delete this file?')) {
        console.log(`Attempting to delete file: ${filePath}`);

        try {
          // Delete the file from the server
          await FileService.deleteFile(filePath);
          console.log('File deleted successfully from server');

          // Call the onDelete callback if provided
          if (onDelete && typeof onDelete === 'function') {
            onDelete(filePath);
          }
        } catch (error) {
          console.error('Error deleting file from server:', error);
          alert('Failed to delete the file. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error in handleDelete:', error);
      alert('Failed to delete the file. Please try again.');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-shrink-0">
        {getIcon()}
      </div>

      {showLabel && (
        <div className="flex-grow truncate text-sm max-w-[150px]" title={displayLabel}>
          {displayLabel}
        </div>
      )}

      

      {/* Delete button - only shown if allowDelete is true or onDelete callback is provided */}
      {(allowDelete || onDelete) && (
        <button
          onClick={handleDelete}
          className="p-1 hover:bg-gray-200 rounded text-red-600 flex-shrink-0"
          title="Delete file"
        >
          <FaTrash size={size === 'lg' ? 20 : size === 'sm' ? 14 : 16} />
        </button>
      )}

      {/* File Preview Modal */}
      {previewOpen && fileUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={togglePreview}>
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{displayLabel}</h3>
              <button onClick={togglePreview} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="flex justify-center">
              {fileTypeToUse === 'image' ? (
                <div className="relative">
                  <img
                    src={fileUrl}
                    alt={displayLabel}
                    className="max-w-full max-h-[70vh] object-contain"
                    onError={(e) => {
                      console.log('Image failed to load, using placeholder');
                      e.target.src = placeholderUrl;
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-white bg-opacity-75 p-1 rounded">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      title="Open in new tab"
                    >
                      <FaExternalLinkAlt size={16} />
                    </a>
                  </div>
                </div>
              ) : fileTypeToUse === 'pdf' ? (
                <div className="w-full h-[70vh] relative">
                  {/* Always show the fallback for PDFs since they're likely corrupted */}
                  <div
                    className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center"
                  >
                    <img
                      src={placeholderUrl}
                      alt={`${displayLabel} placeholder`}
                      className="max-w-[300px] max-h-[300px] mb-4"
                    />
                    <p className="text-gray-600 mb-4">PDF preview not available</p>
                    <p className="text-sm text-gray-500 mb-4">The file may be corrupted or not accessible</p>
                    <div className="flex space-x-4">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Open File
                      </a>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white bg-opacity-75 p-1 rounded">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      title="Open in new tab"
                    >
                      <FaExternalLinkAlt size={16} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <img
                    src={placeholderUrl}
                    alt={`${displayLabel} placeholder`}
                    className="max-w-[200px] max-h-[200px] mx-auto mb-4"
                  />
                  <p className="text-gray-600 mb-4">Preview not available for this file type.</p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Open File
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

export default FilePreviewCell;
