import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProtectedRoute from '../components/layout/ProtectedRoute';

export default function AdminDashboard() {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courses
      .list()
      .then((res) => setCourseList(res.data.courses || []))
      .catch(() => setCourseList([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete course "${title}"?`)) return;
    try {
      await courses.delete(id);
      setCourseList((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <ProtectedRoute roles={['admin']}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin – Courses</h1>
        <p className="text-slate-600 mt-1 mb-6">View and manage all courses on the platform.</p>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Instructor</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {courseList.map((course) => (
                  <tr key={course._id}>
                    <td className="px-4 py-3">
                      <Link to={`/courses/${course._id}`} className="text-brand-accent hover:underline font-medium">
                        {course.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{course.category}</td>
                    <td className="px-4 py-3 text-slate-600">{course.instructor?.name ?? '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(course._id, course.title)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && courseList.length === 0 && (
          <p className="text-slate-500">No courses.</p>
        )}
      </div>
      <Footer />
    </ProtectedRoute>
  );
}
