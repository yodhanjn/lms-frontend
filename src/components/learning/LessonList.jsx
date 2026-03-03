import React from 'react';

export default function LessonList({
  sections,
  currentLessonId,
  completedLessonIds = [],
  onSelectLesson,
  showOnlyCompleted = false,
}) {
  const completedSet = new Set(completedLessonIds);

  const flatLessons = sections.flatMap((s) => s.lessons || []);
  const isLocked = (lesson) => {
    const idx = flatLessons.findIndex((l) => l._id === lesson._id);
    if (idx <= 0) return false;
    const prev = flatLessons[idx - 1];
    return prev ? !completedSet.has(prev._id) : false;
  };

  return (
    <div className="py-2">
      {sections.map((section) => (
        <div key={section._id} className="mb-4">
          <h3 className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded">
            {section.title}
          </h3>
          <ul className="mt-1">
            {(section.lessons || []).map((lesson) => {
              const locked = isLocked(lesson);
              const completed = completedSet.has(lesson._id);
              if (showOnlyCompleted && !completed) return null;

              return (
                <li key={lesson._id} className="mt-0.5">
                  <button
                    type="button"
                    onClick={() => !locked && onSelectLesson(lesson)}
                    disabled={locked}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      currentLessonId === lesson._id
                        ? 'bg-indigo-100 text-indigo-800 font-medium'
                        : locked
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {completed && (
                        <span className="text-green-600" title="Completed">
                          ✓
                        </span>
                      )}
                      {lesson.title}
                      {locked && <span className="text-xs">(locked)</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
