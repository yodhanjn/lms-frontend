import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessons, progress } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import VideoPlayer from '../components/learning/VideoPlayer';
import LessonList from '../components/learning/LessonList';
import ProgressBar from '../components/learning/ProgressBar';
import NextPrevButtons from '../components/learning/NextPrevButtons';

function flattenLessons(sections) {
  return (sections || []).flatMap((s) => s.lessons || []);
}

export default function Learning() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [progressData, setProgressData] = useState({ completedLessonIds: [], lastWatchedLesson: null });
  const [currentLesson, setCurrentLesson] = useState(null);
  const [showOnlyCompleted, setShowOnlyCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const flatLessons = useMemo(() => flattenLessons(sections), [sections]);
  const currentIndex = useMemo(
    () => flatLessons.findIndex((l) => l._id === currentLesson?._id),
    [flatLessons, currentLesson]
  );

  useEffect(() => {
    Promise.all([
      lessons.getByCourse(courseId),
      progress.getCourseProgress(courseId),
    ])
      .then(([lessonsRes, progressRes]) => {
        setSections(lessonsRes.data.sections || []);
        setProgressData({
          completedLessonIds: progressRes.data.completedLessonIds || [],
          lastWatchedLesson: progressRes.data.lastWatchedLesson,
        });
        const lastId = progressRes.data.lastWatchedLesson?._id || progressRes.data.lastWatchedLesson;
        const all = flattenLessons(lessonsRes.data.sections || []);
        const initial = lastId
          ? all.find((l) => l._id === lastId)
          : all[0];
        setCurrentLesson(initial || null);
      })
      .catch(() => {
        setSections([]);
        navigate('/courses');
      })
      .finally(() => setLoading(false));
  }, [courseId, navigate]);

  useEffect(() => {
    if (!currentLesson?.youtubeVideoId) return;
    progress.updateLastWatched(courseId, currentLesson._id).catch(() => {});
  }, [courseId, currentLesson?._id]);

  const handleMarkComplete = () => {
    if (!currentLesson) return;
    progress
      .complete(courseId, currentLesson._id)
      .then(() => {
        setProgressData((prev) => ({
          ...prev,
          completedLessonIds: [...new Set([...prev.completedLessonIds, currentLesson._id])],
        }));
      })
      .catch(() => {});
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent" />
        </div>
      </>
    );
  }

  const totalLessons = flatLessons.length;
  const completedCount = progressData.completedLessonIds.length;

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex flex-1 min-h-0">
          <Sidebar>
            <div className="p-3 border-b border-gray-200 flex items-center justify-between">
              <span className="font-medium text-gray-800">Lessons</span>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={showOnlyCompleted}
                  onChange={(e) => setShowOnlyCompleted(e.target.checked)}
                  className="rounded"
                />
                Completed only
              </label>
            </div>
            <LessonList
              sections={sections}
              currentLessonId={currentLesson?._id}
              completedLessonIds={progressData.completedLessonIds}
              onSelectLesson={setCurrentLesson}
              showOnlyCompleted={showOnlyCompleted}
            />
          </Sidebar>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
              <ProgressBar completedCount={completedCount} totalCount={totalLessons} />
              <div className="mt-4">
                <VideoPlayer
                  videoId={currentLesson?.youtubeVideoId}
                  title={currentLesson?.title}
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  {currentLesson?.title ?? 'Select a lesson'}
                </h2>
                {currentLesson && (
                  <button
                    type="button"
                    onClick={handleMarkComplete}
                    className="px-4 py-2 bg-brand-accent hover:bg-brand-accentHover text-slate-900 rounded-md text-sm font-medium transition-colors"
                  >
                    Mark complete
                  </button>
                )}
              </div>
              <NextPrevButtons
                flatLessons={flatLessons}
                currentIndex={currentIndex}
                onSelectIndex={(i) => setCurrentLesson(flatLessons[i] ?? null)}
                completedLessonIds={progressData.completedLessonIds}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
