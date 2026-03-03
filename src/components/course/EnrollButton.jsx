import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { enrollments } from '../../services/api';

const ENROLLMENT_PRICE = 999;

export default function EnrollButton({ courseId, enrolled, price = ENROLLMENT_PRICE }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [enrolledState, setEnrolledState] = useState(enrolled);

  const handleEnroll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (enrolledState) {
      navigate(`/learn/${courseId}`);
      return;
    }
    setLoading(true);
    try {
      await enrollments.enroll(courseId);
      setEnrolledState(true);
      navigate(`/learn/${courseId}`);
    } catch (err) {
      if (err.response?.status === 200) setEnrolledState(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleEnroll}
        className="w-full py-2 px-4 bg-brand-accent hover:bg-brand-accentHover text-slate-900 rounded-md text-sm font-medium transition-colors"
      >
        Enroll – ₹{price} (Login required)
      </button>
    );
  }

  if (enrolledState) {
    return (
      <button
        onClick={handleEnroll}
        className="w-full py-2 px-4 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 text-sm font-medium transition-colors"
      >
        Go to course
      </button>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full py-2 px-4 bg-brand-accent hover:bg-brand-accentHover text-slate-900 rounded-md disabled:opacity-50 text-sm font-medium transition-colors"
    >
      {loading ? 'Enrolling...' : `Enroll – ₹${price}`}
    </button>
  );
}
