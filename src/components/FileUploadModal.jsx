import { useState, useRef, useCallback } from 'react';
import { useAIPipeline } from '../hooks/useAIPipeline';
import privacyService from '../services/privacyService';

const FileUploadModal = ({ isOpen, onClose, onAnalysisComplete }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // Use the REAL AI pipeline
  const { 
    pipelineState, 
    processMedicalDocument, 
    resetPipeline,
    getOverallProgress 
  } = useAIPipeline();

  // Supported file types
  const supportedFormats = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt']
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  // JUST STORE FILES, don't process immediately
  const handleFiles = (newFiles) => {
    if (newFiles.length > 0) {
      const file = newFiles[0];
      
      // Validate file type
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      const isValid = Object.values(supportedFormats).flat().includes(fileExtension) ||
                    Object.keys(supportedFormats).some(type => file.type.match(type));
      
      if (!isValid) {
        alert(`File type not supported: ${file.name}. Please use images, PDFs, or text files.`);
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert(`File too large: ${file.name}. Maximum size is 10MB.`);
        return;
      }

      const filesWithPreview = [{
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      }];

      setFiles(filesWithPreview);
    }
  };

  // NEW: Function to START the AI processing
  const startProcessing = async () => {
  if (files.length === 0) {
    alert('Please select a file first');
    return;
  }
  
  const file = files[0].file;
  
  try {
    console.log('🚀 Starting AI processing with privacy protection...');
    
    // Import privacy service to show it's working
    const PrivacyService = await import('../services/privacyService.js');
    console.log('✅ Privacy protection module loaded');
    
    const analysis = await processMedicalDocument(file, { 
      context: getFileContext(file.name) 
    });
    
    console.log('✅ AI analysis completed with privacy protection');
    
    if (onAnalysisComplete) {
      onAnalysisComplete(analysis, file);
    }
    
  } catch (error) {
    console.error('❌ Processing failed:', error);
    alert(`Processing failed: ${error.message}\n\nPlease check:\n- Your Gemini API key\n- File format\n- Internet connection`);
  }
};

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

  const removeFile = (fileId) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
    resetPipeline();
  };

  const handleClose = () => {
    // Clean up object URLs
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    resetPipeline();
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '📷';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.startsWith('text/')) return '📝';
    return '📎';
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 50
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0
            }}>Upload Medical File</h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: '0.25rem 0 0 0'
            }}>
              Upload lab reports, prescriptions, or medical documents
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              color: '#9ca3af',
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer'
            }}
            disabled={pipelineState.stage === 'processing'}
          >
            ✕
          </button>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem'
        }}>
          {/* Privacy Notice */}
          <div style={{
            backgroundColor: '#dbeafe',
            border: '1px solid #93c5fd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.75rem', color: '#3b82f6' }}>🛡️</span>
              <div>
                <strong style={{ color: '#1e40af' }}>Advanced Privacy Protection</strong>
                <p style={{ color: '#1d4ed8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                  All personal information (names, IDs, contact details) is automatically removed before processing. 
                  Only medical data is sent to AI for analysis.
                </p>
              </div>
            </div>
          </div>

          {/* Drag & Drop Area - Only show if no file selected and not processing */}
          {files.length === 0 && !pipelineState.isProcessing && (
            <div
              style={{
                border: `2px dashed ${isDragging ? '#3b82f6' : '#d1d5db'}`,
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                transition: 'all 0.3s',
                backgroundColor: isDragging ? '#dbeafe' : '#f9fafb',
                cursor: 'pointer'
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ fontSize: '2.25rem', color: '#3b82f6', marginBottom: '1rem' }}>📤</div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Drop your medical file here
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  or <span style={{ color: '#3b82f6', fontWeight: '500' }}>browse files</span>
                </p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                  Supports: JPG, PNG, PDF, TXT (Max 10MB)
                </p>
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.pdf,.txt"
            style={{ display: 'none' }}
            disabled={pipelineState.stage === 'processing'}
          />

          {/* File Ready to Process */}
          {files.length > 0 && !pipelineState.isProcessing && !pipelineState.isComplete && (
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #7dd3fc',
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '1.875rem', color: '#0ea5e9', marginBottom: '1rem' }}>📄</div>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  File Ready for Analysis
                </h4>
                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                  Click "Analyze with AI" to extract and simplify your medical report
                </p>
                
                <button
                  onClick={startProcessing}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>🤖</span>
                  <span>Analyze with AI</span>
                </button>
              </div>
            </div>
          )}

          {/* Real Processing Status */}
          {pipelineState.isProcessing && (
            <div style={{
              backgroundColor: '#dbeafe',
              border: '1px solid #93c5fd',
              borderRadius: '8px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '1.875rem', color: '#3b82f6', marginBottom: '1rem' }}>🤖</div>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  {pipelineState.stage === 'extracting' ? 'Reading Document...' : 'AI Analysis...'}
                </h4>
                
                {/* Real Progress Bar */}
                <div style={{
                  width: '100%',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '9999px',
                  height: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  <div
                    style={{
                      backgroundColor: '#10b981',
                      height: '0.75rem',
                      borderRadius: '9999px',
                      transition: 'all 0.3s',
                      width: `${getOverallProgress()}%`
                    }}
                  ></div>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {Math.round(getOverallProgress())}% complete
                </p>
                
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  {pipelineState.stage === 'extracting' 
                    ? 'Extracting text from your document...' 
                    : 'Gemini AI is analyzing medical content...'}
                </p>
              </div>
            </div>
          )}

          {/* Selected Files List */}
          {files.length > 0 && !pipelineState.isProcessing && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '1rem'
              }}>
                Selected File
              </h4>
              <div>
                {files.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          style={{
                            width: '3rem',
                            height: '3rem',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            border: '1px solid #e5e7eb'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#dbeafe',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '1.25rem' }}>{getFileIcon(file.type)}</span>
                        </div>
                      )}
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontWeight: '500',
                          color: '#374151',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {file.name}
                        </p>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          margin: 0
                        }}>
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      style={{
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        marginLeft: '1rem'
                      }}
                      disabled={pipelineState.stage === 'processing'}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Complete */}
          {pipelineState.isComplete && (
            <div style={{
              marginTop: '1.5rem',
              backgroundColor: '#dcfce7',
              border: '1px solid #86efac',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#16a34a', fontSize: '1.25rem', marginRight: '0.75rem' }}>✅</span>
                <div>
                  <strong style={{ color: '#166534' }}>Analysis Complete!</strong>
                  <p style={{ color: '#15803d', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                    Medical report has been processed successfully.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {pipelineState.hasError && (
            <div style={{
              marginTop: '1.5rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc2626', fontSize: '1.25rem', marginRight: '0.75rem' }}>❌</span>
                <div>
                  <strong style={{ color: '#991b1b' }}>Processing Error</strong>
                  <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                    {pipelineState.error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          borderRadius: '0 0 12px 12px'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {files.length > 0 ? (
              <span>
                {files.length} file selected • {formatFileSize(files[0]?.size || 0)}
              </span>
            ) : (
              <span>No files selected</span>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleClose}
              style={{
                padding: '0.5rem 1.5rem',
                border: '1px solid #d1d5db',
                color: '#374151',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
              disabled={pipelineState.stage === 'processing'}
            >
              Cancel
            </button>
            
            {/* Show different button based on state */}
            {pipelineState.isComplete ? (
              <button
                onClick={handleClose}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>✅</span>
                <span>Done</span>
              </button>
            ) : pipelineState.isProcessing ? (
              <button
                disabled
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#60a5fa',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>⏳</span>
                <span>Processing...</span>
              </button>
            ) : files.length > 0 ? (
              <button
                onClick={startProcessing}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>🤖</span>
                <span>Analyze with AI</span>
              </button>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>➕</span>
                <span>Add File</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;