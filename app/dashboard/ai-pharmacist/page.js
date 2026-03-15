'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, AlertCircle } from 'lucide-react';
import { aiPharmacistAPI } from '@/lib/api';

export default function AiPharmacist() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    try {
      const history = await aiPharmacistAPI.getChatHistory();
      setMessages(history.messages || []);
    } catch (err) {
      console.error('[AI Pharmacist] Fetch history error:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: newMessage,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);
    setError(null);

    try {
      const response = await aiPharmacistAPI.sendMessage(newMessage);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('[AI Pharmacist] Send error:', err);
      setError(`Failed to send message: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    'What are the side effects of Metformin?',
    'Can I take Aspirin with Ibuprofen?',
    'What should I do if I miss a dose?',
    'How long does this medicine take to work?',
    'Are there any dietary restrictions?',
  ];

  const handleQuickQuestion = (question) => {
    setNewMessage(question);
  };

  return (
    <main className="flex-1 lg:ml-64 mt-20 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Pharmacist Assistant</h1>
        <p className="text-muted-foreground">Ask questions about medicines, symptoms, and health</p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto">
                ✕
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="flex flex-col h-[600px]">
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-2">Welcome to AI Pharmacist</p>
                    <p className="text-sm">
                      Ask me anything about medicines, drugs interactions, or health concerns
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground border'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-primary-foreground/70' : ''
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </CardContent>

            {/* Input Area */}
            <div className="border-t p-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask me something..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !newMessage.trim()}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Suggested Questions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(question)}
                  className="w-full text-left text-sm p-3 border rounded-lg hover:bg-muted transition-colors"
                >
                  {question}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-semibold mb-1">Be Specific</p>
                <p className="text-muted-foreground">
                  Include medicine names, dosages, and your symptoms for better answers.
                </p>
              </div>
              <div className="text-sm">
                <p className="font-semibold mb-1">Ask About Interactions</p>
                <p className="text-muted-foreground">
                  Tell me all the medicines you're taking to check for interactions.
                </p>
              </div>
              <div className="text-sm">
                <p className="font-semibold mb-1">Consult Your Doctor</p>
                <p className="text-muted-foreground">
                  For serious health concerns, always consult a healthcare professional.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
