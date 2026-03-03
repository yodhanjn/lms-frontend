import React from 'react';

/**
 * Learn Master logo: open book with graduation cap — education/LMS branding.
 * className = size (e.g. w-9 h-9), iconClassName = color (e.g. text-brand-accent).
 */
export default function Logo({ className = 'w-9 h-9', iconClassName = 'text-brand-accent' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Graduation cap */}
      <path
        className={iconClassName}
        fill="currentColor"
        d="M20 3 5 9v2l15-6 15 6V9L20 3Zm0 6L30 11v2.2c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V11l10-2Z"
      />
      {/* Open book */}
      <path
        className={iconClassName}
        fill="currentColor"
        fillRule="evenodd"
        d="M12 12v16c.65-.25 1.3-.4 2-.4s1.35.15 2 .4V12c-.65-.35-1.3-.5-2-.5s-1.35.15-2 .5Zm16 0v16c.65-.25 1.3-.4 2-.4s1.35.15 2 .4V12c-.65-.35-1.3-.5-2-.5s-1.35.15-2 .5ZM20 8c-1.5 0-2.9.5-4 1.4V28c1.1-.5 2.3-.8 3.5-.8 1.2 0 2.4.3 3.5.8V9.4C22.9 8.5 21.5 8 20 8Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
