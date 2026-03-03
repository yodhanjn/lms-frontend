import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollments } from '../services/api';
import Navbar from '../components/layout/Navbar';

export default function MyLearning() {
  const [enrollmentList, setEnrollmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = React.useCallback(() => {
    setError(null);
    enrollments
      .getMyLearning()
      .then((res) => {
        const data = res.data;
        const list = data?.enrollments ?? data?.data ?? [];
        setEnrollmentList(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        setEnrollmentList([]);
        setError(err.response?.data?.message || 'Failed to load your courses.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  useEffect(() => {
    const onFocus = () => fetchEnrollments();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchEnrollments]);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900">My Learning</h1>
        <p className="text-slate-600 mt-1 mb-6">
          Continue from where you left off.
        </p>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
            <p className="text-red-700 mb-4">{error}</p>
            <Link
              to="/courses"
              className="inline-flex items-center px-5 py-2.5 bg-brand-accent hover:bg-brand-accentHover text-slate-900 font-medium rounded-md transition-colors"
            >
              Browse courses
            </Link>
          </div>
        ) : enrollmentList.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-slate-600 mb-4">You haven’t enrolled in any courses yet.</p>
            <Link
              to="/courses"
              className="inline-flex items-center px-5 py-2.5 bg-brand-accent hover:bg-brand-accentHover text-slate-900 font-medium rounded-md transition-colors"
            >
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollmentList.map((enrollment) => {
              const course = enrollment.course;
              if (!course) return null;
              const instructorName =
                course.instructor?.name ?? (course.instructor?.email ? 'Instructor' : 'Unknown');
              const hasStarted = !!enrollment.lastWatchedLesson;

              return (
                <div
                  key={enrollment._id}
                  className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <Link to={`/courses/${course._id}`} className="block">
                    <img
                      src={course.thumbnailUrl || 'https://placehold.co/400x225?text=Course'}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 truncate">{course.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{instructorName}</p>
                      <p className="text-xs text-slate-400 mt-1">{course.category}</p>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <Link
                      to={`/learn/${course._id}`}
                      className="block w-full py-2.5 text-center bg-brand-accent hover:bg-brand-accentHover text-slate-900 rounded-md text-sm font-medium transition-colors"
                    >
                      {hasStarted ? 'Continue learning' : 'Start course'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
