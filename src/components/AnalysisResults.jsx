// AnalysisResults.jsx
import React from 'react';

const AnalysisResults = ({ analysis, file, onClose, onNewAnalysis }) => {
  if (!analysis) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Medical Analysis Results</h2>
            <p className="text-gray-600 mt-1">
              {file?.name} • {new Date(analysis.timestamp).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {analysis.rawAnalysis ? (
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-800">
                {analysis.rawAnalysis}
              </pre>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No analysis content available.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {analysis.wordCount} words analyzed
          </div>
          <div className="flex gap-3">
            <button
              onClick={onNewAnalysis}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              New Analysis
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;