import React from 'react';
import { FaEye, FaFileImage, FaFilePdf, FaFile, FaExternalLinkAlt } from 'react-icons/fa';
import FilePreviewCell from '../common/FilePreviewCell';
import FileService from '../../Services/FileService';

/**
 * Component for displaying file previews in tables
 *
 * @param {Object} props Component props
 * @param {string} props.value Path to the file
 * @param {string} props.fileType Type of file (optional, will be auto-detected if not provided)
 * @param {string} props.label Label for the file (optional)
 * @param {boolean} props.showIcon Whether to show the file type icon (default: true)
 * @param {boolean} props.showPreview Whether to show the preview button (default: true)
 */
const FilePreviewTableCell = ({
  value,
  fileType,
  label,
  showIcon = true,
  showPreview = true
}) => {
  if (!value) {
    return <span className="text-gray-400">—</span>;
  }

  // Get the actual file URL
  const fileUrl = FileService.getFileUrl(value);

  // Get placeholder image for fallback
  const placeholderUrl = FileService.getPlaceholderImage(fileType || label);

  console.log(`Table cell - File path: ${value}`);
  console.log(`Table cell - File URL: ${fileUrl}`);

  return (
    <div className="flex items-center space-x-2">
      {/* Always use the FilePreviewCell for consistent behavior */}
      <FilePreviewCell
        filePath={value}
        fileType={fileType}
        label={label || 'Document'}
        showLabel={false}
        size="sm"
      />

      {/* Add a direct link as an alternative */}
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700"
        title="Open in new tab"
      >
        <FaExternalLinkAlt size={14} />
      </a>
    </div>
  );
};

export default FilePreviewTableCell;
