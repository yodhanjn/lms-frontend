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
  const [error, setError] = useState('');

  const loadRazorpayCheckout = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

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
    setError('');
    try {
      const scriptLoaded = await loadRazorpayCheckout();
      if (!scriptLoaded) throw new Error('Unable to load Razorpay checkout');

      const orderRes = await enrollments.createOrder(courseId);
      if (orderRes.data?.alreadyEnrolled) {
        setEnrolledState(true);
        navigate(`/learn/${courseId}`);
        return;
      }

      const { key, order, amount, currency } = orderRes.data;
      if (!key || !order?.id) {
        throw new Error('Payment order generation failed');
      }

      await new Promise((resolve, reject) => {
        const options = {
          key,
          amount,
          currency,
          name: 'Learn Master',
          description: 'Course enrollment',
          order_id: order.id,
          handler: async (response) => {
            try {
              await enrollments.verifyPayment(courseId, response);
              setEnrolledState(true);
              navigate(`/learn/${courseId}`);
              resolve(true);
            } catch (verifyErr) {
              reject(verifyErr);
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
          theme: {
            color: '#f59e0b',
          },
        };
        const rz = new window.Razorpay(options);
        rz.open();
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Unable to complete enrollment payment.';
      setError(message);
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
    <div>
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="w-full py-2 px-4 bg-brand-accent hover:bg-brand-accentHover text-slate-900 rounded-md disabled:opacity-50 text-sm font-medium transition-colors"
      >
        {loading ? 'Processing...' : `Enroll – ₹${price}`}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
