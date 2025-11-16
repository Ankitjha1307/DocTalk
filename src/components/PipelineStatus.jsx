import React from 'react';

const PipelineStatus = ({ pipelineState, overallProgress }) => {
  const { stage, extractionProgress, analysisProgress, error } = pipelineState;

  const getStageDescription = () => {
    switch (stage) {
      case 'extracting':
        return `Extracting text from document... ${extractionProgress}%`;
      case 'analyzing':
        return `AI analyzing medical content... ${analysisProgress}%`;
      case 'complete':
        return 'Analysis complete!';
      case 'error':
        return `Error: ${error}`;
      default:
        return 'Ready to process documents';
    }
  };

  const getStageIcon = () => {
    switch (stage) {
      case 'extracting': return '📄';
      case 'analyzing': return '🤖';
      case 'complete': return '✅';
      case 'error': return '❌';
      default: return '🎯';
    }
  };

  return (
    <div className="pipeline-status">
      <div className="status-header">
        <span className="status-icon">{getStageIcon()}</span>
        <span className="status-text">{getStageDescription()}</span>
      </div>
      
      {stage !== 'idle' && stage !== 'error' && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="progress-text">{Math.round(overallProgress)}%</div>
        </div>
      )}
      
      {stage === 'extracting' && (
        <div className="stage-detail">
          <small>Using OCR to read text from your document...</small>
        </div>
      )}
      
      {stage === 'analyzing' && (
        <div className="stage-detail">
          <small>Gemini AI is analyzing and simplifying medical content...</small>
        </div>
      )}
    </div>
  );
};

export default PipelineStatus;