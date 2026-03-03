import React from 'react';

export default function NextPrevButtons({
  flatLessons,
  currentIndex,
  onSelectIndex,
  completedLessonIds = [],
}) {
  const completedSet = new Set(completedLessonIds);
  const canGoNext =
    currentIndex < flatLessons.length - 1 &&
    (currentIndex < 0 || completedSet.has(flatLessons[currentIndex]?._id));
  const canGoPrev = currentIndex > 0;

  return (
    <div className="flex justify-between gap-4 mt-4">
      <button
        type="button"
        onClick={() => onSelectIndex(currentIndex - 1)}
        disabled={!canGoPrev}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        type="button"
        onClick={() => onSelectIndex(currentIndex + 1)}
        disabled={!canGoNext}
        className="px-4 py-2 bg-brand-accent hover:bg-brand-accentHover text-slate-900 rounded-md disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
      >
        Next
      </button>
    </div>
  );
}
