import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const message = location.state?.message;
  const error = location.state?.error;

  useEffect(() => {
    if (message !== undefined || error !== undefined) {
      setIsLoading(false);
    }
  }, [message, error]);

  const handleGoHome = () => navigate('/');

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <AiOutlineLoading3Quarters
          className="text-gray-600"
          size={48}
          style={{ animation: 'spin 1s linear infinite' }}
        />
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white bg-opacity-90 px-4 py-8 flex flex-col items-center justify-start">
      <div className="w-full max-w-2xl mt-10 bg-white shadow-xl rounded-xl p-6 border border-gray-200 text-center">
        {message ? (
          <>
            <h3 className="text-[color:var(--accent-green)] text-2xl font-bold mb-4">
              Booking Successful!
            </h3>
            <p className="text-[color:var(--text-dark)] mb-6">{message}</p>
            <button
              onClick={handleGoHome}
              className="btn-hotel w-full max-w-xs mx-auto"
            >
              Go to Home Page
            </button>
          </>
        ) : (
          <>
            <h3 className="text-[color:var(--primary-hover)] text-2xl font-bold mb-4">
              Booking Failed
            </h3>
            <p className="text-[color:var(--text-dark)] mb-6">
              {error || 'Something went wrong. Please try again later.'}
            </p>
            <button
              onClick={handleGoHome}
              className="btn-hotel w-full max-w-xs mx-auto"
            >
              Return to Home Page
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingSuccess;
