import React from 'react';

export default function ProgressBar({ completedCount, totalCount }) {
  const total = Math.max(0, totalCount);
  const completed = Math.min(completedCount, total);
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-slate-600 mb-1">
        <span>Progress</span>
        <span>{percent}% ({completed}/{total} lessons)</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-accent rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
