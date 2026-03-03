import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <Logo className="w-9 h-9 shrink-0" iconClassName="text-brand-accent" />
              <span className="font-brand text-lg font-semibold tracking-tight text-white">Learn Master</span>
            </Link>
            <div className="hidden sm:flex items-center gap-6">
              <Link to="/courses" className="text-slate-300 hover:text-white transition-colors">
                Courses
              </Link>
              {isAuthenticated && user?.role === 'student' && (
                <Link to="/my-learning" className="text-slate-300 hover:text-white transition-colors">
                  My Learning
                </Link>
              )}
              {isAuthenticated && user?.role === 'instructor' && (
                <Link to="/instructor" className="text-slate-300 hover:text-white transition-colors">
                  My Courses
                </Link>
              )}
              {isAuthenticated && user?.role === 'admin' && (
                <Link to="/admin" className="text-slate-300 hover:text-white transition-colors">
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/courses"
              className="p-2 text-slate-300 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Search courses"
            >
              <SearchIcon />
            </Link>
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-2 text-slate-300 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                >
                  <UserIcon />
                  <span className="hidden sm:inline text-sm">{user?.name}</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 py-1 bg-white rounded-md shadow-lg text-slate-900 z-50">
                    <div className="px-4 py-2 border-b border-slate-200">
                      <p className="text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 uppercase">{user?.role}</p>
                    </div>
                    {user?.role === 'student' && (
                      <Link
                        to="/my-learning"
                        className="block px-4 py-2 text-sm hover:bg-slate-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Learning
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-brand-accent hover:bg-brand-accentHover text-slate-900 font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
