import React, { useState } from 'react';
import FileUploadModal from './FileUploadModal'; // Adjust path as needed

const MedicalAnalyzer = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);

  // Handle analysis results from FileUploadModal
  const handleAnalysisComplete = (analysis, file) => {
    console.log('Analysis received:', analysis);
    setAnalysisResult(analysis);
    setCurrentFile(file);
    setIsUploadModalOpen(false); // Close modal after analysis
  };

  const handleCloseModal = () => {
    setIsUploadModalOpen(false);
    setAnalysisResult(null);
    setCurrentFile(null);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setCurrentFile(null);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="medical-analyzer">
      <h2>🧬 DocTalk - Medical Report Analysis</h2>
      
      {/* Show Upload Button when no analysis */}
      {!analysisResult && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            📁 Upload Medical Report
          </button>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>
            Upload lab reports, prescriptions, or medical documents for AI analysis
          </p>
        </div>
      )}

      {/* File Upload Modal */}
      <FileUploadModal 
        isOpen={isUploadModalOpen}
        onClose={handleCloseModal}
        onAnalysisComplete={handleAnalysisComplete} // ✅ CRUCIAL: This was missing!
      />

      {/* Display Analysis Results */}
      {analysisResult && (
        <div className="analysis-results" style={{ marginTop: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3>📊 Analysis Results</h3>
            <button 
              onClick={handleNewAnalysis}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Analyze New File
            </button>
          </div>

          {/* File Info */}
          {currentFile && (
            <div style={{
              backgroundColor: '#f3f4f6',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <strong>File:</strong> {currentFile.name} • 
              <strong> Analyzed:</strong> {new Date(analysisResult.timestamp).toLocaleString()}
            </div>
          )}

          {/* Analysis Content */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem',
            maxHeight: '60vh',
            overflowY: 'auto'
          }}>
            <pre style={{ 
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              lineHeight: '1.5',
              margin: 0
            }}>
              {analysisResult.rawAnalysis}
            </pre>
          </div>

          {/* Disclaimer */}
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fcd34d',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem',
            fontSize: '0.875rem',
            color: '#92400e'
          }}>
            <strong>⚠️ Important:</strong> This AI analysis is for educational purposes only. 
            Always consult healthcare professionals for medical advice and diagnosis.
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalAnalyzer;