import { useState, useCallback } from 'react';
import TextExtractionService from '../services/textExtractionService';
import GeminiService from '../services/geminiService';

export const useAIPipeline = () => {
  const [pipelineState, setPipelineState] = useState({
    // Pipeline stages
    stage: 'idle', // 'idle', 'extracting', 'analyzing', 'complete', 'error'
    
    // Data flow
    originalFile: null,
    extractedText: '',
    analysis: null,
    
    // Progress tracking
    extractionProgress: 0,
    analysisProgress: 0,
    
    // Errors
    error: null,
    
    // Metadata
    fileType: null,
    wordCount: 0
  });

  // Reset pipeline
  const resetPipeline = useCallback(() => {
    setPipelineState({
      stage: 'idle',
      originalFile: null,
      extractedText: '',
      analysis: null,
      extractionProgress: 0,
      analysisProgress: 0,
      error: null,
      fileType: null,
      wordCount: 0
    });
  }, []);

  // Main pipeline function
  const processMedicalDocument = useCallback(async (file, options = {}) => {
    try {
      // Reset state
      setPipelineState(prev => ({
        ...prev,
        stage: 'extracting',
        originalFile: file,
        error: null,
        extractionProgress: 0
      }));

      // Stage 1: Validate file
      TextExtractionService.validateFile(file);

      // Stage 2: Extract text
      const extractedText = await TextExtractionService.extractTextFromFile(file);
      
      setPipelineState(prev => ({
        ...prev,
        stage: 'analyzing',
        extractedText,
        extractionProgress: 100,
        wordCount: extractedText.split(/\s+/).length
      }));

      // Stage 3: AI Analysis
      const analysis = await GeminiService.analyzeMedicalText(extractedText, options);
      
      setPipelineState(prev => ({
        ...prev,
        stage: 'complete',
        analysis,
        analysisProgress: 100
      }));

      return analysis;

    } catch (error) {
      console.error('Pipeline error:', error);
      setPipelineState(prev => ({
        ...prev,
        stage: 'error',
        error: error.message
      }));
      throw error;
    }
  }, []);

  // Process raw text directly (bypass file extraction)
  const processRawText = useCallback(async (text, options = {}) => {
    try {
      setPipelineState(prev => ({
        ...prev,
        stage: 'analyzing',
        extractedText: text,
        error: null,
        analysisProgress: 0
      }));

      const analysis = await GeminiService.analyzeMedicalText(text, options);
      
      setPipelineState(prev => ({
        ...prev,
        stage: 'complete',
        analysis,
        analysisProgress: 100,
        wordCount: text.split(/\s+/).length
      }));

      return analysis;
    } catch (error) {
      setPipelineState(prev => ({
        ...prev,
        stage: 'error',
        error: error.message
      }));
      throw error;
    }
  }, []);

  // Get current progress percentage
  const getOverallProgress = useCallback(() => {
    switch (pipelineState.stage) {
      case 'extracting': return pipelineState.extractionProgress * 0.7; // 70% weight for extraction
      case 'analyzing': return 70 + (pipelineState.analysisProgress * 0.3); // 30% weight for analysis
      case 'complete': return 100;
      default: return 0;
    }
  }, [pipelineState]);

  return {
    // State
    pipelineState,
    
    // Actions
    processMedicalDocument,
    processRawText,
    resetPipeline,
    
    // Utilities
    getOverallProgress,
    
    // Derived state
    isProcessing: ['extracting', 'analyzing'].includes(pipelineState.stage),
    isComplete: pipelineState.stage === 'complete',
    hasError: pipelineState.stage === 'error'
  };
};