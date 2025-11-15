import axios from 'axios';
require('dotenv').config();
const apiKey = import.meta.env.GEMINI_API_KEY;

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

class GeminiService {
  
  // Main medical analysis function
  async analyzeMedicalText(medicalText, options = {}) {
    try {
      // Validate and preprocess input
      const processedText = this.preprocessMedicalText(medicalText);
      
      if (!processedText || processedText.trim().length < 10) {
        throw new Error('Insufficient medical text for analysis. Please provide a more detailed medical report.');
      }

      // Create context-aware prompt
      const prompt = this.createMedicalAnalysisPrompt(processedText, options);
      
      // Call Gemini API
      const analysis = await this.callGeminiAPI(prompt);
      
      // Post-process and structure the response
      return this.structureAnalysisResponse(analysis, processedText);
      
    } catch (error) {
      console.error('Medical analysis error:', error);
      throw this.handleGeminiError(error);
    }
  }

  // Preprocess medical text for better analysis
  preprocessMedicalText(text) {
    return text
      .replace(/([A-Z][a-z]+)\s+(\d+\.\d+)/g, '$1: $2') // Improve number formatting
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000); // Limit text length for API
  }

  // Create sophisticated medical analysis prompt
  createMedicalAnalysisPrompt(medicalText, options) {
    const context = options.context || 'general'; // lab, discharge, prescription, etc.

    return `
        You are DocTalk - an AI medical translator specialized in explaining complex medical information to patients in simple, clear, and compassionate language.

        CONTEXT: ${this.getContextDescription(context)}
        MEDICAL REPORT CONTENT:
        """
        ${medicalText}
        """

        ANALYSIS INSTRUCTIONS:

        Please analyze this medical content and provide a structured explanation following this EXACT format:

        🎯 **EXECUTIVE SUMMARY**
        [Provide a 2-3 sentence overview of the most important findings in simple terms. Focus on what the patient needs to know first.]

        🔍 **DETAILED BREAKDOWN**
        [For each significant finding, use this structure:
        • **Test/Item**: [Name and value]
        • **What it means**: [Simple explanation using everyday analogies]
        • **Normal Range**: [If applicable]
        • **Significance**: [Why this matters in practical terms]
        ]

        💡 **PATIENT-FRIENDLY EXPLANATION**
        [Explain the overall health implications as if talking to a friend:
        - Use analogies like "think of this as your body's delivery system"
        - Avoid all medical jargon
        - Be reassuring but honest
        - Connect findings to daily life
        ]

        📋 **RECOMMENDED ACTION PLAN**
        • [Priority action 1 - e.g., "Discuss these results with your doctor"]
        • [Priority action 2 - e.g., "Monitor for specific symptoms"]
        • [Lifestyle consideration - if applicable]

        ❓ **QUESTIONS TO ASK YOUR DOCTOR**
        • "Can you explain what [specific term] means in my situation?"
        • "What might be causing [specific finding]?"
        • "What are the next steps we should consider?"

        ⚠️ **SAFETY & NEXT STEPS**
        - Highlight any values that need urgent attention
        - Mention when to seek immediate care
        - Reinforce this is educational only

        CRITICAL GUIDELINES:
        1. NEVER diagnose conditions - only explain what the numbers/terms mean
        2. ALWAYS emphasize consulting healthcare providers
        3. Use simple, compassionate language
        4. Include specific numbers from the report in explanations
        5. If information is unclear, state what's missing rather than guessing
        6. Be culturally sensitive and age-appropriate
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
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.1,  // Very low for consistent medical responses
        maxOutputTokens: 2000,
        topP: 0.8,
        topK: 40
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_MEDICAL",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 45000 // 45 second timeout for complex analysis
    });

    if (response.data && response.data.candidates && response.data.candidates[0]) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from AI service');
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
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          return new Error('Invalid request to AI service. Please check the input and try again.');
        case 401:
          return new Error('AI service authentication failed. Please check API configuration.');
        case 403:
          return new Error('AI service access denied. Please check permissions.');
        case 429:
          return new Error('AI service rate limit exceeded. Please wait a moment and try again.');
        case 500:
          return new Error('AI service is temporarily unavailable. Please try again later.');
        default:
          return new Error(`AI service error: ${error.response.statusText}`);
      }
    } else if (error.request) {
      return new Error('Unable to reach AI service. Please check your internet connection.');
    } else {
      return error;
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