import { useState, useRef, useEffect } from 'react';


const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm DocTalk AI. I can help you understand medical reports, prescription details, lab values, and general health advice. I am not a doctor, so please consult a physician for diagnoses or treatment.",
      sender: 'ai',
      sources: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);

  // Firebase Configuration
  // const apiKey = "AIzaSyCNW2MdBaQpwlsK6t-2MSEmb4q8Bglm4ko"; // Will be provided by environment
  // const MODEL_NAME = 'gemini-2.5-flash-preview-09-2025';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${import.meta.env.VITE_MODEL_NAME}:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

  const SYSTEM_PROMPT = `
    You are the DocTalk AI, a helpful, friendly, and highly accurate healthcare information assistant. Your primary function is to explain complex medical and health-related topics clearly and concisely.

    **Always adhere to the following rules:**
    1.  **Non-Diagnostic Rule:** You MUST NEVER provide a diagnosis, medical opinion, or replace the advice of a qualified healthcare professional. Always state clearly that the user must consult their doctor for any medical decisions.
    2.  **Specific Tasks:** You are excellent at:
        * **Explaining Reports & Lab Values:** Clarify the meaning of a specific medical test or a lab result (e.g., "What does an HbA1c of 7.5 mean?").
        * **Prescription/Medicine Info:** Provide summaries on drug usage, potential side effects, and mechanism of action.
        * **Appointment Guidance:** Offer advice on how to prepare for doctor visits or what questions to ask.
        * **General Health Advice:** Provide non-diagnostic, evidence-based wellness tips (e.g., diet, exercise).
    3.  **Tone:** Be professional, empathetic, and easy to understand. Break down jargon.
    4.  **Grounding:** Use the search grounding tool to ensure all information is up-to-date and reliable. Cite your sources clearly when generating the response.
    5.  **Safety First:** If a query suggests a medical emergency or requires immediate care, advise the user to contact emergency services immediately.
  `;

  const chatSuggestions = [
    "Explain my lab report",
    "What are the side effects of...",
    "Compare medicine prices",
    "Set a vaccination reminder",
    "Explain medical terms",
    "Find generic alternatives",
    "What does HbA1c mean?",
    "Explain blood pressure readings"
  ];

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  const sendMessage = async (text = inputText) => {
    const prompt = text.trim();
    if (!prompt) return;

    // Add user message
    const userMessage = { text: prompt, sender: 'user', sources: [] };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Prepare chat history for API
    const chatHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = {
      contents: chatHistory,
      tools: [{ "google_search": {} }],
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      let generatedText = 'Sorry, I couldn\'t find a clear explanation.';
      let sources = [];

      if (candidate && candidate.content?.parts?.[0]?.text) {
        generatedText = candidate.content.parts[0].text;
        
        // Extract grounding sources
        const groundingMetadata = candidate.groundingMetadata;
        if (groundingMetadata && groundingMetadata.groundingAttributions) {
          sources = groundingMetadata.groundingAttributions
            .map(attribution => ({
              uri: attribution.web?.uri,
              title: attribution.web?.title,
            }))
            .filter(source => source.uri && source.title);
        }
      }

      // Add AI response
      const aiMessage = { text: generatedText, sender: 'ai', sources };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: 'Sorry, I am having trouble connecting to the service. Please try again later.',
        sender: 'ai',
        sources: []
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col h-[90vh]">
        
        {/* Header */}
        <header className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-4 rounded-t-xl shadow-lg flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-brain mr-2"></i>
            <h1 className="text-xl font-bold">DocTalk AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-light hidden sm:inline">Healthcare Information Assistant</span>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </header>

        {/* Quick Suggestions */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {chatSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-full hover:bg-teal-50 hover:border-teal-300 transition-colors disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div 
          ref={chatWindowRef}
          className="flex-grow p-4 space-y-4 overflow-y-auto"
          style={{ maxHeight: '60vh' }}
        >
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] rounded-xl p-4 shadow-sm ${
                message.sender === 'user' 
                  ? 'bg-blue-50 text-gray-800' 
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}>
                <div 
                  className="message-content"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                />
                
                {message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    <strong>Sources:</strong>
                    <ul className="mt-1 space-y-1">
                      {message.sources.map((source, idx) => (
                        <li key={idx}>
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline text-teal-600"
                          >
                            ({idx + 1}) {source.title || 'Source Link'}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-[90%]">
                <div className="flex items-center space-x-2 text-teal-600">
                  <i className="fas fa-circle-notch fa-spin"></i>
                  <span className="text-sm font-medium">Analyzing complex data...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., What does an HbA1c of 7.5 mean? Or, explain my blood pressure medicine."
              disabled={isLoading}
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-5 rounded-lg transition duration-150 ease-in-out shadow-md hover:shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-paper-plane"></i>
              <span className="ml-2 hidden sm:inline">Send</span>
            </button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            <i className="fas fa-shield-alt mr-1"></i>
            <strong>Disclaimer:</strong> I cannot provide diagnoses or replace professional medical advice.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;