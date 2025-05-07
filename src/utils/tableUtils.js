/**
 * Utility functions for tables
 */

/**
 * Transforms table data to convert file paths to preview components
 * 
 * @param {Array} data Table data array
 * @param {Object} fileFields Object mapping field names to file types (e.g., { photo: 'image', document: 'pdf' })
 * @returns {Array} Transformed data with file preview components
 */
export const transformTableDataWithFilePreviews = (data, fileFields) => {
  if (!data || !Array.isArray(data) || !fileFields) {
    return data;
  }

  return data.map(item => {
    const newItem = { ...item };
    
    // For each file field, add a new field with _preview suffix
    Object.entries(fileFields).forEach(([field, fileType]) => {
      if (item[field]) {
        // Create a new field with _preview suffix
        newItem[`${field}_preview`] = {
          type: 'file-preview',
          value: item[field],
          fileType: fileType
        };
      }
    });
    
    return newItem;
  });
};

/**
 * Creates table columns configuration with file preview cells
 * 
 * @param {Array} baseColumns Base columns configuration
 * @param {Object} fileFields Object mapping field names to file types
 * @returns {Array} Enhanced columns configuration with file preview cells
 */
export const createColumnsWithFilePreviews = (baseColumns, fileFields) => {
  if (!baseColumns || !Array.isArray(baseColumns) || !fileFields) {
    return baseColumns;
  }
  
  return baseColumns.map(column => {
    // Check if this column is for a file field
    const fieldName = column.accessor;
    if (fieldName && fileFields[fieldName]) {
      return {
        ...column,
        isFilePreview: true,
        fileType: fileFields[fieldName]
      };
    }
    return column;
  });
};

export default {
  transformTableDataWithFilePreviews,
  createColumnsWithFilePreviews
};
