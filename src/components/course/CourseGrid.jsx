import React from 'react';
import CourseCard from './CourseCard';

export default function CourseGrid({ courses, enrollmentIds = [] }) {
  const set = new Set(enrollmentIds);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} enrolled={set.has(course._id)} />
      ))}
    </div>
  );
}
