import React from 'react';
import { Link } from 'react-router-dom';
import EnrollButton from './EnrollButton';

export default function CourseCard({ course, enrolled }) {
  const instructorName =
    course.instructor?.name ?? (course.instructor?.email ? 'Instructor' : 'Unknown');

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/courses/${course._id}`} className="block">
        <img
          src={course.thumbnailUrl || 'https://placehold.co/400x225?text=Course'}
          alt={course.title}
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{instructorName}</p>
          <p className="text-xs text-gray-400 mt-1">{course.category}</p>
          <p className="text-sm font-medium text-gray-700 mt-2">₹999</p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <EnrollButton courseId={course._id} enrolled={enrolled} price={999} />
      </div>
    </div>
  );
}
