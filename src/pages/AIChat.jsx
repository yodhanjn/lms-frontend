import React, { useMemo, useRef, useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { ai } from '../services/api';
import { useAuth } from '../context/AuthContext';

function MessageBubble({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <div
        className={[
          'max-w-2xl rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap shadow-sm',
          isUser
            ? 'bg-brand-accent text-slate-900'
            : 'bg-white border border-slate-200 text-slate-800',
        ].join(' ')}
      >
        {content}
      </div>
    </div>
  );
}

export default function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I am your LMS AI assistant. Ask me about courses, learning plans, coding topics, or study help.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef(null);

  const chatHistory = useMemo(
    () =>
      messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content })),
    [messages]
  );

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError('');
    setLoading(true);
    setInput('');

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);

    try {
      const res = await ai.chat(text, chatHistory.slice(-12));
      const reply =
        res.data?.reply ||
        'I could not generate a response right now. Please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reach AI assistant.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-slate-900">AI Assistant</h1>
          <p className="text-slate-600 text-sm">
            Signed in as {user?.name || 'student'} - Ask course and study questions.
          </p>
        </div>

        <section className="bg-slate-50 border border-slate-200 rounded-2xl shadow-sm h-[70vh] flex flex-col overflow-hidden">
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg, idx) => (
              <MessageBubble key={`${msg.role}-${idx}`} role={msg.role} content={msg.content} />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl px-4 py-3 text-sm">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
            {error && (
              <p className="text-sm text-red-600 mb-2">{error}</p>
            )}
            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Message AI assistant..."
                className="flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="h-10 px-4 rounded-xl bg-brand-accent text-slate-900 text-sm font-medium hover:bg-brand-accentHover disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
