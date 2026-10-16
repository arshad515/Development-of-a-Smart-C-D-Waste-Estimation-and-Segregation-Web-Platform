/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, BrainCircuit, RefreshCw, AlertTriangle } from "lucide-react";
import { ProjectMetadata, EstimationOutputs } from "../types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantProps {
  meta: ProjectMetadata;
  output: EstimationOutputs | null;
}

export function AIAssistant({ meta, output }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your AI C&D Waste Demolition Consultant. I have loaded your current active civil estimation results in my context panel. You can ask me to: \n- Audit your calculated waste tonnage\n- Propose an optimization layout to reduce landfill taxes\n- Suggest specific aggregate processing strategies for Concrete or Steel\nHow can I help with your structural project today?"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const starterPrompts = [
    "Audit my estimated waste tonnage",
    "How do I recycle concrete into RCA?",
    "Ways to reduce transport trucking trips",
    "What goes in White vs Yellow bins?"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorMessage(null);
    const updatedMessages = [...messages, { role: "user" as const, content: textToSend }];
    setMessages(updatedMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          context: output ? { meta, output } : null
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "The AI specialist module had a transit failure.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Failed to reach AI Consultant. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Draft wiped clean. Tell me about your site conditions, partition layouts, or municipal standards, and I will outline a customized C&D sorting framework immediately."
      }
    ]);
    setErrorMessage(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col md:h-[550px]">
      {/* Bot Header */}
      <div className="bg-slate-900 px-5 py-4 flex items-center justify-between border-b border-slate-850">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BrainCircuit size={18} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
              Smart Segregation Consultant <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-[10px] text-slate-400">Advanced AI Civil Demolition Specialist</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="text-slate-450 hover:text-white transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
        >
          <RefreshCw size={12} /> Clear Chat
        </button>
      </div>

      {/* Messages Scrollbox */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/20 max-h-[340px] md:max-h-full">
        {messages.map((m, idx) => {
          const isAI = m.role === "assistant";
          return (
            <div key={idx} className={`flex items-start gap-3 ${isAI ? "" : "flex-row-reverse"}`}>
              {/* Profile icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${isAI ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-100 border-slate-200 text-slate-700"}`}>
                {isAI ? <Bot size={14} /> : <User size={14} />}
              </div>

              {/* Chat bubble body */}
              <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-2xs text-justify font-sans ${isAI ? "bg-white border border-slate-200 text-slate-850" : "bg-emerald-850 text-white font-medium"}`}>
                {m.content}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
              <Bot size={14} />
            </div>
            <div className="p-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl text-xs flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span> Civil expert calculations in progress...
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-850 text-[11px] font-medium flex items-center gap-2">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts Bar */}
      {messages.length === 1 && (
        <div className="px-5 py-2 flex flex-wrap gap-2 bg-slate-50 border-t border-slate-150">
          {starterPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-emerald-600 text-[10px] text-slate-600 font-bold hover:text-emerald-850 rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Inputs box */}
      <div className="p-4 bg-white border-t border-slate-150 flex gap-2">
        <input
          type="text"
          placeholder="Ask specialist about sorting, recycling costs, regulations..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
          className="flex-1 px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 outline-hidden bg-slate-50/20"
        />
        <button
          onClick={() => handleSendMessage(inputText)}
          disabled={isLoading || !inputText.trim()}
          className="w-10 h-10 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl flex items-center justify-center transition-transform hover:scale-103 cursor-pointer shadow-xs disabled:opacity-50"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
