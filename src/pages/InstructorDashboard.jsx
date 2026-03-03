import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProtectedRoute from '../components/layout/ProtectedRoute';

export default function InstructorDashboard() {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courses
      .list({ instructor: 'me' })
      .then((res) => setCourseList(res.data.courses || []))
      .catch(() => setCourseList([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute roles={['instructor', 'admin']}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
        <p className="text-slate-600 mt-1 mb-6">Manage and view your published courses.</p>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseList.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden"
              >
                <Link to={`/courses/${course._id}`}>
                  <img
                    src={course.thumbnailUrl || 'https://placehold.co/400x225?text=Course'}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900">{course.title}</h3>
                    <p className="text-sm text-slate-500">{course.category}</p>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <Link
                    to={`/courses/${course._id}`}
                    className="block w-full py-2 text-center bg-brand-accent hover:bg-brand-accentHover text-slate-900 rounded-md text-sm font-medium transition-colors"
                  >
                    View / Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && courseList.length === 0 && (
          <p className="text-slate-500">You have not created any courses yet.</p>
        )}
      </div>
      <Footer />
    </ProtectedRoute>
  );
}
