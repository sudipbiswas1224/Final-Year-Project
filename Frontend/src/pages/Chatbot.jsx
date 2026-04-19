import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, User, Sparkles, Activity } from "lucide-react";
import axiosInstance from "../api/axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "Hello there. I'm your AI companion. I'm here to listen, offer support, or guide you through a grounding exercise. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // POST /analysis/chat to get NLP response
      const res = await axiosInstance.post("/analysis/chat", {
        text: userMessage.text,
      });
      const botResponse = {
        id: Date.now() + 1,
        role: "bot",
        text:
          res.data.response ||
          res.data.reply ||
          "I understand. I am here for you.",
        emotion: res.data.detectedEmotion,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error(err);
      const fallback = {
        id: Date.now() + 1,
        role: "bot",
        text: "I'm having trouble connecting to my service right now, but please know you're not alone. Consider using the journal to express your thoughts.",
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex-col animate-fade-in mx-auto w-full max-w-4xl rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden relative">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md relative z-10">
        <div className="flex items-center">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">AI Companion</h2>
            <p className="text-xs font-medium text-emerald-500 flex items-center">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>{" "}
              Online & Listening
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
        <div className="mx-auto max-w-2xl space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isBot = msg.role === "bot";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex w-full ${isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`flex max-w-[85%] sm:max-w-[75%] items-end ${isBot ? "flex-row" : "flex-row-reverse"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isBot
                          ? "mr-3 bg-purple-100 text-purple-600"
                          : "ml-3 bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isBot ? <Sparkles size={16} /> : <User size={16} />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`relative px-5 py-3.5 text-[0.95rem] shadow-sm leading-relaxed ${
                        isBot
                          ? "rounded-2xl rounded-bl-sm bg-white text-slate-700 ring-1 ring-slate-100"
                          : "rounded-2xl rounded-br-sm bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                      }`}
                    >
                      {msg.text}

                      {/* Emotion Tag (if bot detected one) */}
                      {msg.emotion && (
                        <span className="mt-2 block text-xs font-medium tracking-wide text-purple-500 uppercase">
                          Detected: {msg.emotion}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center h-10 px-4 rounded-full bg-white ring-1 ring-slate-100 text-slate-400">
                <div className="flex space-x-1">
                  <div
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} className="h-4" /> {/* Spacer */}
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 bg-white p-4 ring-1 ring-slate-100 relative z-10 box-border">
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-2xl items-center relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type your message..."
            className="h-14 w-full rounded-2xl border-none bg-slate-50 pl-6 pr-14 text-sm text-slate-700 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600"
          >
            <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-slate-400">
          AI can make mistakes. In a crisis, please contact emergency services.
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
