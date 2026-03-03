import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-400 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4">
        <span className="font-brand text-sm font-medium tracking-tight">© Learn Master</span>
        <div className="flex gap-6">
          <Link to="/courses" className="text-sm hover:text-white transition-colors">
            Courses
          </Link>
          <Link to="/login" className="text-sm hover:text-white transition-colors">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
