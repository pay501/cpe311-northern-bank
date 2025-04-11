import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 👇 Scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const resp = await axios.post(
        "https://api.opentyphoon.ai/v1/chat/completions",
        {
          model: "typhoon-v2-8b-instruct",
          max_tokens: 512,
          temperature: 0.7,
          top_p: 0.95,
          top_k: 0,
          repetition_penalty: 1.05,
          min_p: 0,
          messages: newMessages,
        },
        {
          headers: {
            Authorization:
              "Bearer sk-Sd9dZs9PYThq6Jzen9N7qNvIGzKaXmL97S848Kmq1tKlXf3X",
          },
        }
      );

      const reply = resp.data.choices[0].message.content;
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "❌ เกิดข้อผิดพลาดในการติดต่อ AI" },
      ]);
      console.error("Error calling Typhoon:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[800px] flex flex-col bg-gray-100">
      <div className="max-w-2xl w-full flex flex-col h-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-green-500">
            💬 SaiFa Chatbot
        </h1>

        {/* Scrollable messages */}
        <div className="flex-1 overflow-y-auto bg-white rounded-lg p-4 space-y-3 shadow-inner">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg whitespace-pre-wrap w-fit ${
                msg.role === "user"
                  ? "bg-green-100 text-right ml-auto"
                  : "bg-gray-100 text-left mr-auto"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          ))}

          {loading && <p className="text-gray-400 italic">AI กำลังพิมพ์...</p>}

          {/* 👇 จุดเลื่อนอัตโนมัติ */}
          <div ref={scrollRef} />
        </div>

        {/* Input field */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 border rounded-lg p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
            onClick={sendMessage}
            disabled={loading}
          >
            ส่ง
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
