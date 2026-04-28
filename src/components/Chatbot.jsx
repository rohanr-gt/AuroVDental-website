import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! I can help with booking, services, pricing, and FAQs. What do you need?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState([
    'Book appointment',
    'Treatments',
    'Pricing',
    'FAQ',
    'Contact'
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const params = new URLSearchParams(location.search || '');
    if (params.get('chat') === '1') {
      setIsOpen(true);
      params.delete('chat');
      const qs = params.toString();
      navigate({ pathname: location.pathname, search: qs ? `?${qs}` : '' }, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  const sendMessage = async (text) => {
    const msg = String(text || '').trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { type: 'user', text: msg }]);
    setLoading(true);

    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
    try {
      const response = await axios.post(`${API_BASE}/api/chat`, { message: msg });
      if (response?.data?.chatbotVersion) {
        // Helps confirm the backend is restarted and updated
        console.debug('chatbotVersion:', response.data.chatbotVersion);
      }
      const replyText = response?.data?.reply || 'Sorry, I could not generate a response.';
      setMessages((prev) => [...prev, { type: 'bot', text: replyText }]);
      if (Array.isArray(response?.data?.quickReplies) && response.data.quickReplies.length) {
        setSuggestedReplies(response.data.quickReplies.slice(0, 6));
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: "Sorry, I couldn't process that. Please try again or contact our team." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-[calc(100vw-2rem)] flex flex-col h-[560px] mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 px-5 py-4 text-white border-b border-white/10">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-cyan-200" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a1 1 0 0 1 1 1v1.06A7.002 7.002 0 0 1 19 11v5a4 4 0 0 1-4 4h-1v1a1 1 0 1 1-2 0v-1h-2v1a1 1 0 1 1-2 0v-1H7a4 4 0 0 1-4-4v-5a7.002 7.002 0 0 1 6-6.94V3a1 1 0 0 1 1-1h2ZM5 11v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-5a5 5 0 0 0-5-5h-2a5 5 0 0 0-5 5Zm4 1a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 9 12Zm6 0a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 15 12Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-wide">Auro V Dental Assistant</h3>
                <p className="text-xs text-white/70">Quick answers • booking • pricing • FAQs</p>
              </div>
              </div>
              <button
                type="button"
                onClick={() => sendMessage('Pricing')}
                disabled={loading}
                className="rounded-xl px-4 py-2 bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
              >
                Pricing
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 transition flex items-center justify-center"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gradient-to-b from-white to-[color:var(--soft)]/40">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg whitespace-pre-wrap break-words ${
                    msg.type === 'user'
                      ? 'bg-[color:var(--teal)] text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {!loading && !input.trim() && suggestedReplies?.length ? (
            <div className="px-4 py-2 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-500 mb-2">Suggested</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestedReplies.slice(0, 4).map((reply, idx) => (
                  <button
                    key={`${reply}-${idx}`}
                    type="button"
                    onClick={() => sendMessage(reply)}
                    className="text-xs bg-[color:var(--soft)] text-[color:var(--dk)] px-3 py-2 rounded-xl hover:bg-white transition font-semibold border border-black/5 text-left"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about booking, pricing, services…"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[color:var(--teal)] text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[color:var(--teal)] text-white px-4 py-2 rounded-lg hover:bg-[color:var(--dk)] transition disabled:opacity-50 font-bold"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-4 shadow-lg transition-all hover:scale-110 flex items-center justify-center w-16 h-16 border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.38),0_0_0_1px_rgba(34,211,238,0.25)]"
        title={isOpen ? 'Close assistant' : 'Open assistant'}
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
      >
        {isOpen ? (
          <span className="text-xl leading-none">✕</span>
        ) : (
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-cyan-200" fill="currentColor" aria-hidden="true">
            <path d="M12 2a1 1 0 0 1 1 1v1.06A7.002 7.002 0 0 1 19 11v5a4 4 0 0 1-4 4h-1v1a1 1 0 1 1-2 0v-1h-2v1a1 1 0 1 1-2 0v-1H7a4 4 0 0 1-4-4v-5a7.002 7.002 0 0 1 6-6.94V3a1 1 0 0 1 1-1h2ZM5 11v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-5a5 5 0 0 0-5-5h-2a5 5 0 0 0-5 5Zm4 1a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 9 12Zm6 0a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 15 12Z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
