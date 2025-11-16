import axios from 'axios';
import PrivacyService from './privacyService';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

class GeminiService {
  
  async analyzeMedicalText(medicalText, options = {}) {
    try {
      console.log('Original text length:', medicalText.length);
      
      // Check for sensitive information
      const hasSensitiveInfo = PrivacyService.hasSensitiveInfo(medicalText);
      if (hasSensitiveInfo) {
        console.log('⚠️ Personal information detected in medical text');
      }
      
      // Sanitize the text before sending to Gemini
      const sanitizedText = PrivacyService.sanitizeMedicalText(medicalText);
      console.log('Sanitized text length:', sanitizedText.length);
      
      if (hasSensitiveInfo) {
        console.log('✅ Personal information removed before AI analysis');
      }
      // === END PRIVACY PROTECTION ===

      if (!sanitizedText || sanitizedText.trim().length < 10) {
        throw new Error('Insufficient medical text for analysis after privacy filtering.');
      }

      const prompt = this.createMedicalAnalysisPrompt(sanitizedText, options);
      const analysis = await this.callGeminiAPI(prompt);
      
      return this.structureAnalysisResponse(analysis, sanitizedText);
      
    } catch (error) {
      console.error('Medical analysis error:', error);
      throw this.handleGeminiError(error);
    }
  }

  // Update prompt to mention privacy protection
  createMedicalAnalysisPrompt(medicalText, options) {
    const context = options.context || 'general';

    return `
      Analyze this medical ${context} report and explain it in simple terms:
      ${medicalText}

      Provide:
      1. Brief summary of key findings
      2. Simple explanations of medical terms
      3. Normal ranges if available
      4. Questions to ask a doctor

      Use simple language and avoid medical jargon. Be reassuring but honest.
      `;
  }

  getContextDescription(context) {
    const contexts = {
      lab: "Laboratory test results (blood tests, urine tests, etc.)",
      discharge: "Hospital discharge summary or clinical notes", 
      prescription: "Medication instructions or prescription details",
      radiology: "Imaging reports (X-ray, MRI, CT scan)",
      general: "General medical report or health document"
    };
    return contexts[context] || contexts.general;
  }

  // Call Gemini API with enhanced error handling
  async callGeminiAPI(prompt) {
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      topK: 40,
      topP: 0.8,
      maxOutputTokens: 4096,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH", 
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  console.log('🔧 Sending request to Gemini API...');
  
  try {
    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000
    });

    console.log('✅ Gemini API response received');
    
    // Fixed response parsing based on the actual structure
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts[0]) {
      
      const text = response.data.candidates[0].content.parts[0].text;
      console.log('📝 Extracted text length:', text.length);
      return text;
      
    } else {
      console.error('❌ Unexpected response structure:', JSON.stringify(response.data, null, 2));
      throw new Error('Invalid response format from AI service');
    }
    
  } catch (error) {
    console.error('❌ Gemini API call failed:', error.response?.data || error.message);
    throw error;
  }
}

  // Structure and validate the analysis response
  structureAnalysisResponse(analysis, originalText) {
    // Basic validation
    if (!analysis || analysis.length < 50) {
      throw new Error('AI analysis appears incomplete. Please try again.');
    }

    // Check for safety disclaimer
    if (!analysis.includes('consult') && !analysis.includes('doctor') && !analysis.includes('medical advice')) {
      analysis += '\n\n⚠️ **Important**: This analysis is for educational purposes only. Always consult healthcare professionals for medical advice.';
    }

    return {
      rawAnalysis: analysis,
      structured: this.parseStructuredResponse(analysis),
      originalTextSnippet: originalText.substring(0, 200) + '...',
      timestamp: new Date().toISOString(),
      wordCount: originalText.split(/\s+/).length
    };
  }

  // Parse the structured response (basic implementation)
  parseStructuredResponse(analysis) {
    // This can be enhanced to properly parse the structured format
    const sections = {
      summary: this.extractSection(analysis, '🎯', '🔍'),
      breakdown: this.extractSection(analysis, '🔍', '💡'),
      explanation: this.extractSection(analysis, '💡', '📋'),
      actions: this.extractSection(analysis, '📋', '❓'),
      questions: this.extractSection(analysis, '❓', '⚠️'),
      safety: this.extractSection(analysis, '⚠️', null)
    };

    return sections;
  }

  extractSection(text, startMarker, endMarker) {
    const startIndex = text.indexOf(startMarker);
    if (startIndex === -1) return '';

    const endIndex = endMarker ? text.indexOf(endMarker, startIndex) : text.length;
    return text.substring(startIndex, endIndex !== -1 ? endIndex : text.length).trim();
  }

  // Enhanced error handling
  handleGeminiError(error) {
  console.error('Full error details:', error);
  
  if (error.response) {
    const status = error.response.status;
    const errorData = error.response.data;
    
    console.error('Gemini API Error Details:', errorData);
    
    switch (status) {
      case 400:
        return new Error(`Invalid API request: ${errorData.error?.message || 'Check your prompt format'}`);
      case 401:
        return new Error('Invalid API key. Please check your Gemini API key configuration.');
      case 403:
        return new Error('API access denied. Please check your API key permissions and billing.');
      case 429:
        return new Error('Rate limit exceeded. Please wait a moment and try again.');
      case 500:
        return new Error('Google AI service is temporarily unavailable.');
      default:
        return new Error(`API error ${status}: ${errorData.error?.message || 'Unknown error'}`);
    }
  } else if (error.request) {
    return new Error('Unable to reach Google AI service. Please check your internet connection.');
  } else {
    return new Error(`Request configuration error: ${error.message}`);
  }
}

  // Quick analysis for shorter texts
  async quickAnalysis(medicalText) {
    const shortPrompt = `
    Briefly explain this medical information in 2-3 sentences for a patient:
    "${medicalText.substring(0, 500)}"
    
    Use simple language and suggest discussing with a doctor.`;
    
    return this.callGeminiAPI(shortPrompt);
  }
}

export default new GeminiService();