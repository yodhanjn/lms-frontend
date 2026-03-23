import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CourseListing from './pages/CourseListing';
import CourseDetails from './pages/CourseDetails';
import Learning from './pages/Learning';
import MyLearning from './pages/MyLearning';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AIChat from './pages/AIChat';
import api, { ai } from './services/api';

function ApiConfigBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (isProduction && !apiUrl && !dismissed) setShow(true);
  }, [dismissed]);

  if (!show) return null;

  return (
    <div className="bg-amber-500 text-amber-950 text-center py-2 px-4 text-sm flex items-center justify-center gap-4 flex-wrap">
      <span>
        API not configured: set <strong>VITE_API_URL</strong> in Vercel (Settings → Environment Variables) to your Render backend URL ending with <strong>/api</strong>, then redeploy.
      </span>
      <button
        type="button"
        onClick={() => { setDismissed(true); setShow(false); }}
        className="underline font-medium hover:no-underline"
      >
        Dismiss
      </button>
    </div>
  );
}

function FloatingChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me anything about courses or learning.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    // Wake backend early so first chat message does not fail on cold start.
    api.get('/health').catch(() => {});
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError('');
    setInput('');
    setLoading(true);

    setMessages((prev) => [...prev, { role: 'user', content: text }]);

    try {
      const history = messages.slice(-12).map((m) => ({ role: m.role, content: m.content }));
      const res = await ai.chat(text, history);
      const reply = res.data?.reply || 'I could not generate a response right now.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach AI assistant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-40">
      {open && (
        <div className="mb-3 w-[320px] h-[420px] bg-slate-50 border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="h-11 px-3 bg-slate-900 text-white flex items-center justify-between">
            <p className="text-sm font-medium">AI Assistant</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
              aria-label="Close chat"
              title="Close"
            >
              X
            </button>
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={[
                    'max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-5 whitespace-pre-wrap',
                    msg.role === 'user'
                      ? 'bg-brand-accent text-slate-900'
                      : 'bg-white border border-slate-200 text-slate-800',
                  ].join(' ')}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-xs text-slate-500">Thinking...</div>
            )}
          </div>
          <div className="border-t border-slate-200 p-2 bg-white">
            {error && <p className="text-[11px] text-red-600 mb-1">{error}</p>}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
                placeholder="Type a message..."
                className="flex-1 h-9 rounded-lg border border-slate-300 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="h-9 px-3 rounded-lg bg-brand-accent text-slate-900 text-xs font-medium hover:bg-brand-accentHover disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-11 h-11 rounded-full bg-brand-accent text-slate-900 shadow-lg hover:bg-brand-accentHover transition-colors flex items-center justify-center"
          title="Open AI Chat"
          aria-label="Open AI Chat"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M8 10h8M8 14h5M7 18h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10l3-2Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <>
      <ApiConfigBanner />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<CourseListing />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route
          path="/learn/:courseId"
          element={
            <ProtectedRoute>
              <Learning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-learning"
          element={
            <ProtectedRoute>
              <MyLearning />
            </ProtectedRoute>
          }
        />
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingChatWidget />
    </>
  );
}
