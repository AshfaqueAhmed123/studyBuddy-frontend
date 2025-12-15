import React, { useState, useEffect, useRef } from "react";
import { MessagesSquare, Send, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import aiService from "../../services/aiServices";
import Spinner from "../../components/common/Spinner";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";

const ChatInterface = () => {
  const { id: documentId } = useParams();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // Dummy user object for avatar
  const user = { username: "User" };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);
        setHistory(response.data || []);
      } catch (error) {
        console.error("Failed to fetch chat history", error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (documentId) {
      fetchChatHistory();
    }
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, userMessage.content);

      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks: response.data.relevantChunks,
      };

      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={index}
        className={`flex items-start gap-3 my-4 ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        {/* AI Logo on left */}
        {!isUser && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 flex items-center justify-center shrink-0">
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
        )}

        <div
          className={`max-w-lg p-4 rounded-2xl shadow-sm ${
            isUser
              ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-br-md"
              : "bg-white border border-slate-200/60 text-slate-800 rounded-bl-md"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{msg.content}</p>
          ) : (
            <div className="pros pros-sm max-w-none prose-slate">
              <MarkdownRenderer content={msg.content} />
            </div>
          )}
        </div>

        {/* User Avatar on right */}
        {isUser && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-700 font-semibold text-sm shrink-0 shadow-sm">
            {"you"}
          </div>
        )}
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl items-center justify-center shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
          <MessagesSquare className="w-7 h-7 text-emerald-600" strokeWidth={2} />
        </div>
        <Spinner />
        <p className="text-sm text-slate-500 mt-3 font-medium">
          Loading chat history...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50">
        {/* Message Area */}
        <div className="flex-1 overflow-y-auto space-y-4 p-6">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-md shadow-emerald-200/40">
                <MessagesSquare strokeWidth={2} className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Start a conversation
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Ask me anything about the document
              </p>
            </div>
          ) : (
            history.map(renderMessage)
          )}

          <div ref={messagesEndRef} />

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100/80 backdrop-blur rounded-xl px-4 py-3 flex gap-1 shadow-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200/60 bg-white/70 backdrop-blur p-4 rounded-b-2xl">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a follow-up question..."
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
