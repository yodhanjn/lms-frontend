import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courses, enrollments } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EnrollButton from '../components/course/EnrollButton';
import Navbar from '../components/layout/Navbar';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    courses
      .get(id)
      .then((res) => setCourse(res.data.course))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !id) return;
    enrollments
      .getEnrollment(id)
      .then(() => setEnrolled(true))
      .catch(() => setEnrolled(false));
  }, [id, isAuthenticated]);

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

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-slate-500">Course not found.</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-4 text-brand-accent hover:underline font-medium"
          >
            Back to courses
          </button>
        </div>
      </>
    );
  }

  const instructorName = course.instructor?.name ?? 'Instructor';

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/courses')}
          className="text-brand-accent hover:underline font-medium mb-4 inline-block"
        >
          ← Courses
        </button>
        <img
          src={course.thumbnailUrl || 'https://placehold.co/800x400?text=Course'}
          alt={course.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
        <p className="text-slate-600 mt-2">{instructorName} · {course.category}</p>
        <p className="text-slate-500 mt-4">{course.totalLessons ?? 0} lessons · {course.totalDuration ?? 0} min total</p>
        <p className="text-lg font-semibold text-slate-900 mt-2">Enrollment: ₹999</p>
        <p className="mt-4 text-slate-700 whitespace-pre-wrap">{course.description}</p>
        <div className="mt-6">
          <EnrollButton courseId={course._id} enrolled={enrolled} price={999} />
        </div>
      </div>
    </>
  );
}
