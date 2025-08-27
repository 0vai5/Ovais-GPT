import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Send, User, Bot } from "lucide-react";
import Loader from "./Loader";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "User", text: input }]);
    setInput("");
    setLoading(true);

    let botText = "";
    let botIndex = null;

    try {
      const response = await fetch("https://ovaisgpt-server.vercel.app/message/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      setLoading(false);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          botText += decoder.decode(value);

          setMessages((prev) => {
            const updated = [...prev];
            if (botIndex === null) {
              // first chunk -> push bot message
              botIndex = updated.length;
              updated.push({ sender: "Bot", text: botText, completed: false });
            } else {
              updated[botIndex] = {
                sender: "Bot",
                text: botText,
                completed: false,
              };
            }
            return updated;
          });
        }
      }

      // Mark message as completed
      setMessages((prev) => {
        const updated = [...prev];
        if (botIndex !== null) {
          updated[botIndex] = { ...updated[botIndex], completed: true };
        }
        return updated;
      });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "Bot", text: "Error: " + err.message, completed: true },
      ]);
    }
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <div className="py-4 text-center text-2xl font-bold text-gray-800 border-b bg-white shadow-sm select-none">
        Ovais-GPT
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-6 w-full">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex mb-4 w-full ${
              m.sender === "User" ? "justify-end" : "justify-start"
            }`}
          >
            {m.sender === "Bot" && (
              <div className="flex items-end mr-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <Bot size={18} />
                </div>
              </div>
            )}

            <div
              className={`w-full md:max-w-2xl px-4 py-3 rounded-2xl shadow-sm text-base ${
                m.sender === "User"
                  ? "bg-blue-600 text-white rounded-br-none ml-auto"
                  : "bg-white text-gray-900 border rounded-bl-none mr-auto"
              }`}
              style={{ wordBreak: "break-word" }}
            >
              <ReactMarkdown
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {m.text}
              </ReactMarkdown>

              {/* Pending indicator (black dot) */}
              {m.sender === "Bot" && !m.completed && (
                <span className="inline-block ml-1 w-2 h-2 bg-black rounded-full animate-pulse" />
              )}
            </div>

            {m.sender === "User" && (
              <div className="flex items-end ml-2">
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white shadow-md">
                  <User size={18} />
                </div>
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
        {loading && <Loader />}
      </div>

      {/* Input */}
      <div className="w-full border-t bg-white p-4">
        <form
          className="flex gap-2 max-w-3xl mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
            placeholder="Type your message..."
            disabled={loading}
          />
          <button
            type="submit"
            className={`px-4 py-3 rounded-xl font-medium flex items-center gap-1 shadow-sm transition-colors duration-200 ${
              loading
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={loading}
          >
            <Send size={18} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
