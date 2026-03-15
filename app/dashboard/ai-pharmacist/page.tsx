"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, MessageCircle } from "lucide-react";

export default function AiPharmacist() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! I'm DocTalk's AI Pharmacist. I can help you with questions about medicines, symptoms, side effects, and interactions. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          type: "user",
          text: input,
        },
      ]);

      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: "bot",
            text: "That's a great question! Based on the information provided, I would recommend consulting with your healthcare provider for personalized advice. However, I can provide general information about this topic if you'd like.",
          },
        ]);
      }, 1000);

      setInput("");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Pharmacist</h1>
        <p className="text-muted-foreground mt-2">
          Chat with our AI assistant about medicines and health
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-4 bg-muted/20 rounded-lg p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-card border rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <Card className="p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything about medicines..."
            className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Tip: You can ask about medicine side effects, interactions, dosages, and symptoms.
        </p>
      </Card>
    </div>
  );
}
