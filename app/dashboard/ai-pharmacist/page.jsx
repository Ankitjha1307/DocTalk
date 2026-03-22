"use client";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Send } from "lucide-react";

const BASE_URL = "https://doctalk-production-a83f.up.railway.app";

export default function AiPharmacist() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! I'm DocTalk's AI Pharmacist. I can help you with questions about medicines, symptoms, side effects, and interactions. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { id: messages.length + 1, type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          session_id: "user-session-1",
          history: history,
        }),
      });

      const data = await res.json();

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        text: data.reply || "Sorry, I could not process your request.",
      };

      setMessages((prev) => [...prev, botMessage]);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: input },
        { role: "assistant", content: data.reply },
      ]);

      if (data.is_emergency) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: "bot",
            text: "🚨 EMERGENCY DETECTED: Please call 112 / 911 immediately!",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "bot",
          text: "Sorry, I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Pharmacist</h1>
        <p className="text-muted-foreground mt-2">
          Chat with our AI assistant about medicines and health
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 space-y-4 bg-muted/20 rounded-lg p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
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
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border px-4 py-2 rounded-lg rounded-bl-none">
              <p className="text-sm text-muted-foreground">Thinking...</p>
            </div>
          </div>
        )}
      </div>

      <Card className="p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything about medicines..."
            className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
          <Button onClick={handleSend} size="icon" disabled={loading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Tip: Ask about medicine side effects, interactions, dosages, and symptoms.
        </p>
      </Card>
    </div>
  );
}