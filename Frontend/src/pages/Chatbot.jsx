import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Send, User, Sparkles, Activity } from "lucide-react";
import axiosInstance from "../api/axios";
import { io } from "socket.io-client";

const welcomeMessage = {
  id: "welcome",
  role: "model",
  text: "Hello there. I'm your AI companion. I'm here to listen, offer support, or guide you through a grounding exercise. How are you feeling today?",
};

const normalizeMessage = (message) => ({
  id: message._id || message.id,
  role: message.role === "model" ? "model" : message.role,
  text: message.content,
  createdAt: message.createdAt,
});

const Chatbot = () => {
  const token = useSelector((state) => state.auth.token);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isMounted = true;
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      (import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
        : "http://localhost:5000");

    const socket = io(socketUrl, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    const loadHistory = async () => {
      try {
        setIsHistoryLoading(true);
        const response = await axiosInstance.get("/chat");
        if (!isMounted) return;

        const history = Array.isArray(response.data?.messages)
          ? response.data.messages.map(normalizeMessage)
          : [];

        setMessages(history.length > 0 ? history : [welcomeMessage]);
      } catch (error) {
        console.error("Failed to load chat history:", error);
        if (isMounted) {
          setMessages([welcomeMessage]);
        }
      } finally {
        if (isMounted) {
          setIsHistoryLoading(false);
        }
      }
    };

    loadHistory();

    const handleAiResponse = (payload) => {
      setMessages((prev) => [
        ...prev,
        {
          id: payload.clientId ? `${payload.clientId}-reply` : Date.now() + 1,
          role: "model",
          text: payload.content,
        },
      ]);
      setIsLoading(false);
    };
    const handleChatError = (payload) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "model",
          text: payload?.message || "I couldn't generate a reply just now.",
        },
      ]);
      setIsLoading(false);
    };

    socket.on("ai-response", handleAiResponse);
    socket.on("chat-error", handleChatError);

    return () => {
      isMounted = false;
      socket.off("ai-response", handleAiResponse);
      socket.off("chat-error", handleChatError);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isHistoryLoading) return;

    const socket = socketRef.current;
    if (!socket) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "model",
          text: "The chat connection is not ready yet. Please wait a moment and try again.",
        },
      ]);
      return;
    }

    const userMessage = { id: Date.now(), role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      socket.emit("user-message", {
        content: userMessage.text,
        clientId: userMessage.id,
      });
    } catch (err) {
      console.error(err);
      const fallback = {
        id: Date.now() + 1,
        role: "model",
        text: "I'm having trouble connecting right now, but please know you're not alone. Try again in a moment.",
      };
      setMessages((prev) => [...prev, fallback]);
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
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Online & Listening
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
        <div className="mx-auto max-w-2xl space-y-6">
          {messages.map((msg) => {
            const isBot = msg.role === "model";
            return (
              <div
                key={msg.id}
                className={`flex w-full ${isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`flex max-w-[85%] sm:max-w-[75%] items-end ${isBot ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isBot
                        ? "mr-3 bg-purple-100 text-purple-600"
                        : "ml-3 bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isBot ? <Sparkles size={16} /> : <User size={16} />}
                  </div>

                  <div
                    className={`relative px-5 py-3.5 text-[0.95rem] shadow-sm leading-relaxed ${
                      isBot
                        ? "rounded-2xl rounded-bl-sm bg-white text-slate-700 ring-1 ring-slate-100"
                        : "rounded-2xl rounded-br-sm bg-linear-to-br from-emerald-500 to-teal-600 text-white"
                    }`}
                  >
                    {msg.text}

                    {msg.emotion && (
                      <span className="mt-2 block text-xs font-medium tracking-wide text-purple-500 uppercase">
                        Detected: {msg.emotion}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex h-10 items-center rounded-full bg-white px-4 text-slate-400 ring-1 ring-slate-100">
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
            </div>
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
            <Send size={18} className="-translate-x-px translate-y-px" />
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
