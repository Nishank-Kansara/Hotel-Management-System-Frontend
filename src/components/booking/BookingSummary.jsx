import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const BookingSummary = ({ booking, payment, isFormValid, onConfirm, roomNumber, roomPrice }) => {
  const checkInDate = moment(booking.checkInDate);
  const checkOutDate = moment(booking.checkOutDate);
  const numOfDays = Math.max(0, checkOutDate.diff(checkInDate, 'days'));
  const totalPayment = Number(payment) || 0;

  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();

  const handleConfirmBooking = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsBookingConfirmed(true);
      onConfirm();
    }, 3000);
  };

  useEffect(() => {
    if (isBookingConfirmed) navigate('/booking-success');
  }, [isBookingConfirmed, navigate]);

  return (
    <div className="bg-white bg-opacity-95 shadow-lg rounded-2xl p-6 md:p-8 mt-6 w-full max-w-3xl mx-auto border border-gray-200">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[color:var(--primary-color)] border-b border-gray-200 pb-4">
        Reservation Summary
      </h2>

      <div className="mt-4 space-y-1 text-[color:var(--text-dark)]">
        <p><strong>Full Name:</strong> {booking.guestFullName}</p>
        <p><strong>Email:</strong> {booking.guestEmail}</p>
        <p><strong>Room Number:</strong> {roomNumber}</p>
        <p><strong>Price per Day:</strong> ₹{roomPrice?.toLocaleString('en-IN')}</p>
      </div>

      <div className="mt-4 py-4 border-y border-gray-300 space-y-1">
        <p><strong>Check-In:</strong> {checkInDate.format('DD/MM/YYYY')}</p>
        <p><strong>Check-Out:</strong> {checkOutDate.format('DD/MM/YYYY')}</p>
        <p><strong>Number of Days:</strong> {numOfDays}</p>
      </div>

      <div className="mt-4 space-y-1">
        <h5 className="text-lg font-semibold text-[color:var(--primary-hover)]">Guests</h5>
        <p><strong>Adults:</strong> {booking.numberOfAdults}</p>
        <p><strong>Children:</strong> {booking.numberOfChildren || 0}</p>
      </div>

      {numOfDays <= 0 || totalPayment <= 0 ? (
        <p className="text-red-600 font-medium mt-4">
          {numOfDays <= 0
            ? 'Check-out date must be after check-in date.'
            : 'Total payment must be greater than zero.'}
        </p>
      ) : (
        <>
          <h4 className="mt-6 text-xl font-bold text-[color:var(--accent-gold)] room-price">
            Total Payment: ₹{totalPayment.toLocaleString('en-IN')}
          </h4>

          {isFormValid && !isBookingConfirmed && (
            <button
              onClick={handleConfirmBooking}
              disabled={isProcessingPayment}
              className="btn-hotel mt-6 w-full rounded-full text-lg font-semibold"
            >
              {isProcessingPayment ? (
                <span className="flex justify-center items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Booking Confirmed, redirecting...
                </span>
              ) : 'Confirm Booking & Proceed to Payment'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default BookingSummary;
