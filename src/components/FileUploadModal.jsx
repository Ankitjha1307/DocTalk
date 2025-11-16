import { useState, useRef, useCallback } from 'react';

const FileUploadModal = ({ isOpen, onClose, onFilesUpload }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  // Supported file types
  const supportedFormats = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
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
    processFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      const isValid = Object.values(supportedFormats).flat().includes(fileExtension) ||
                    Object.keys(supportedFormats).some(type => file.type.match(type));
      
      if (!isValid) {
        alert(`File type not supported: ${file.name}`);
        return false;
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        alert(`File too large: ${file.name}. Maximum size is 50MB.`);
        return false;
      }
      
      return true;
    });

    const filesWithPreview = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      uploadProgress: 0
    }));

    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const simulateUpload = (fileId) => {
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = (prev[fileId] || 0) + Math.random() * 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, [fileId]: 100 };
        }
        return { ...prev, [fileId]: newProgress };
      });
    }, 200);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    // Simulate upload progress for each file
    files.forEach(file => {
      simulateUpload(file.id);
    });

    // Simulate complete upload after 3 seconds
    setTimeout(() => {
      if (onFilesUpload) {
        onFilesUpload(files);
      }
      handleClose();
    }, 3000);
  };

  const handleClose = () => {
    // Clean up object URLs
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    setUploadProgress({});
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
    if (fileType.startsWith('image/')) return 'fas fa-image';
    if (fileType === 'application/pdf') return 'fas fa-file-pdf';
    if (fileType.startsWith('text/')) return 'fas fa-file-alt';
    if (fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word';
    return 'fas fa-file';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Upload Medical Files</h2>
            <p className="text-sm text-gray-600 mt-1">
              Upload lab reports, prescriptions, medical images, and other documents
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="max-w-md mx-auto">
              <i className="fas fa-cloud-upload-alt text-4xl text-blue-500 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Drop your files here
              </h3>
              <p className="text-gray-500 mb-4">
                or <span className="text-blue-500 font-medium">browse files</span>
              </p>
              <p className="text-sm text-gray-400">
                Supports: {Object.values(supportedFormats).flat().join(', ')} (Max 50MB each)
              </p>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept={Object.keys(supportedFormats).join(',')}
            className="hidden"
          />

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Selected Files ({files.length})
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                          <i className={`${getFileIcon(file.type)} text-blue-600`}></i>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                        
                        {/* Progress Bar */}
                        {uploadProgress[file.id] !== undefined && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress[file.id]}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.round(uploadProgress[file.id])}% uploaded
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700 transition-colors ml-4"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Type Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h5 className="font-semibold text-blue-800 mb-2">Supported File Types:</h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <i className="fas fa-image text-blue-600"></i>
                <span>Images (JPG, PNG, GIF, BMP)</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-file-pdf text-red-600"></i>
                <span>PDF Documents</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-file-alt text-green-600"></i>
                <span>Text Files (TXT)</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-file-word text-blue-700"></i>
                <span>Word Documents</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="text-sm text-gray-600">
            {files.length > 0 ? (
              <span>
                {files.length} file{files.length > 1 ? 's' : ''} selected •{' '}
                {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
              </span>
            ) : (
              <span>No files selected</span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={files.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <i className="fas fa-upload"></i>
              <span>Upload Files</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FileUploadModal;