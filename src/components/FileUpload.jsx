import React, { useCallback, useState } from 'react';
import { useAIPipeline } from '../hooks/useAIPipeline';

const FileUpload = () => {
  const { 
    pipelineState, 
    processMedicalDocument, 
    resetPipeline,
    getOverallProgress 
  } = useAIPipeline();
  
  const [dragActive, setDragActive] = useState(false);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Process selected files
  const handleFiles = async (files) => {
    const file = files[0];
    
    try {
      await processMedicalDocument(file, { 
        context: getFileContext(file.name) 
      });
    } catch (error) {
      console.error('File processing error:', error);
    }
  };

  // Determine context based on filename
  const getFileContext = (filename) => {
    const name = filename.toLowerCase();
    if (name.includes('lab') || name.includes('test') || name.includes('blood')) {
      return 'lab';
    } else if (name.includes('discharge') || name.includes('summary')) {
      return 'discharge';
    } else if (name.includes('prescription') || name.includes('med')) {
      return 'prescription';
    } else if (name.includes('xray') || name.includes('mri') || name.includes('ct') || name.includes('scan')) {
      return 'radiology';
    }
    return 'general';
  };

  // Get supported file types description
  const getSupportedTypes = () => {
    return "Images (JPEG, PNG), PDFs, Text files (max 10MB)";
  };

  return (
    <div className="file-upload-container">
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${pipelineState.stage === 'processing' ? 'processing' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          onChange={handleFileSelect}
          accept=".jpg,.jpeg,.png,.pdf,.txt,.text"
          disabled={pipelineState.stage === 'processing'}
          style={{ display: 'none' }}
        />
        
        <div className="upload-content">
          {pipelineState.stage === 'processing' ? (
            <div className="processing-state">
              <div className="processing-spinner"></div>
              <p>Processing {pipelineState.originalFile?.name}...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <div className="upload-text">
                <p>
                  <label htmlFor="file-upload" className="browse-link">
                    Click to upload
                  </label>{' '}
                  or drag and drop
                </p>
                <p className="file-types">{getSupportedTypes()}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* File Info */}
      {pipelineState.originalFile && (
        <div className="file-info">
          <strong>Selected File:</strong> {pipelineState.originalFile.name}
          <br />
          <small>Type: {pipelineState.originalFile.type || 'Unknown'}</small>
          <br />
          <small>Size: {(pipelineState.originalFile.size / 1024 / 1024).toFixed(2)} MB</small>
        </div>
      )}

      {/* Error Display */}
      {pipelineState.error && (
        <div className="error-message">
          <strong>Error:</strong> {pipelineState.error}
          <button onClick={resetPipeline} className="retry-btn">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;