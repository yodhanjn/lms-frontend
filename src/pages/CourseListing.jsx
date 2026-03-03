import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courses, enrollments } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CourseGrid from '../components/course/CourseGrid';
import SearchBar from '../components/common/SearchBar';
import CategoryFilter from '../components/common/CategoryFilter';
import Navbar from '../components/layout/Navbar';

const CATEGORIES = [
  'Web Development',
  'Frontend',
  'Backend',
  'Full Stack',
  'Other',
];

export default function CourseListing() {
  const [courseList, setCourseList] = useState([]);
  const [enrollmentIds, setEnrollmentIds] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    courses
      .list(params)
      .then((res) => setCourseList(res.data.courses || []))
      .catch(() => setCourseList([]))
      .finally(() => setLoading(false));
  }, [search, category]);

  const fetchEnrollments = React.useCallback(() => {
    if (!isAuthenticated) {
      setEnrollmentIds([]);
      return;
    }
    enrollments
      .getMyEnrollments()
      .then((res) => setEnrollmentIds(res.data.courseIds || []))
      .catch(() => setEnrollmentIds([]));
  }, [isAuthenticated]);

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
        <h1 className="text-3xl font-bold text-slate-900">Explore Courses</h1>
        <p className="text-slate-600 mt-1 mb-6">Find the right course and start learning today.</p>
        <div className="flex flex-wrap gap-4 mb-6">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter
            categories={CATEGORIES}
            value={category}
            onChange={setCategory}
          />
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent" />
          </div>
        ) : (
          <CourseGrid courses={courseList} enrollmentIds={enrollmentIds} />
        )}
        {!loading && courseList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">No courses found.</p>
            <Link to="/" className="text-brand-accent hover:underline font-medium">
              Back to home
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
