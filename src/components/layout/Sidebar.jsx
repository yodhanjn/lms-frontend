import React from 'react';

export default function Sidebar({ children, className = '' }) {
  return (
    <aside
      className={`w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto ${className}`}
    >
      {children}
    </aside>
  );
}
