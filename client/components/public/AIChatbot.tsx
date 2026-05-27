"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { CLINIC } from "@/lib/constants";
import { useAuthStore } from "@/store/useAuthStore";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function AIChatbot() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: `Hello! I am the Hollyhill Dental AI Assistant. Under the direction of Dr. Roghay Alizadeh, we offer cosmetic & general dentistry. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  // Scroll to bottom on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const data = await apiRequest("/ai/chatbot", {
        method: "POST",
        body: JSON.stringify({
          message: userMessage,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (data && data.reply) {
        setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
      } else {
        throw new Error("Invalid reply format");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "Sorry, I am having trouble connecting right now. Please call us at +353 21 430 3072 for any urgent queries.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* WhatsApp quick button (prefilled message) */}
      <button
        onClick={() => {
          const name = user?.patientProfile ? `${user.patientProfile.firstName || ""} ${user.patientProfile.lastName || ""}`.trim() : "";
          const prefill = name
            ? `Hi, my name is ${name}. I am contacting Hollyhill Dental regarding...` 
            : `Hi, I found you on the Hollyhill Dental website and would like to enquire about...`;
          const url = `${CLINIC.whatsapp}?text=${encodeURIComponent(prefill)}`;
          window.open(url, "_blank");
        }}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-[#25D366] hover:bg-opacity-95 text-white flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
        aria-label="Chat on WhatsApp"
        title="Message us on WhatsApp"
      >
        <WhatsAppIcon className="w-5 h-5 text-white" />
      </button>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat Widget Panel */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl border border-gray-100 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 w-[92vw] sm:w-[380px] ${
            // Responsive heights: 90vh on mobile, 60vh on tablet/medium screens, 520px on desktop
            "h-[75vh] md:h-[520px] mb-4"
          }`}
        >
          {/* Header */}
          <div className="bg-navy text-white p-4 flex items-center justify-between border-b border-gold/20">
            <div className="flex items-center gap-3">
              {/* Doctor Avatar */}
              <div className="w-10 h-10 rounded-full border-2 border-gold bg-gray-700 flex items-center justify-center font-bold text-gold overflow-hidden">
                RA
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide text-white font-serif">{CLINIC.name} AI</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-gray-400 font-medium">Assistant Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-gold text-navy" : "bg-navy text-gold"
                  }`}
                >
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <span className="text-[10px] font-bold">RA</span>}
                </div>
                {/* Bubble content */}
                <div
                  className={`rounded-2xl p-3.5 text-[13px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-gold text-navy font-medium rounded-tr-none"
                      : "bg-white text-navy border border-gray-100 rounded-tl-none"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
                <div className="w-7 h-7 rounded-full bg-navy text-gold flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold">RA</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3.5 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pricing, hours, booking..."
              className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gold hover:bg-gold-dark text-navy p-2 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Closed Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gold hover:bg-gold-dark text-navy flex items-center justify-center shadow-2xl relative transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none group"
        >
          {/* Pulsing ring indicator */}
          <span className="absolute -inset-0.5 rounded-full bg-gold/50 animate-ping opacity-60 pointer-events-none group-hover:hidden" />
          <MessageSquare className="w-6 h-6 text-white" />
        </button>
      )}

    </div>
    </>
  );
}
