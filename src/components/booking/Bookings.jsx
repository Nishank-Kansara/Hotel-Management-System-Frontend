import React, { useEffect, useState } from 'react';
import { cancelBooking, getAllBookings } from '../utils/ApiFunctions';
import Header from '../common/Header';
import BookingsTable from './BookingsTable';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Bookings = () => {
  const [bookingInfo, setBookingInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings();
        setBookingInfo(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    setTimeout(fetchBookings, 1000); // Simulated delay
  }, []);

  const handleBookingCancellation = async (bookingId) => {
    try {
      setIsLoading(true);
      await cancelBooking(bookingId);
      const data = await getAllBookings();
      setBookingInfo(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container py-4 position-relative" style={{ backgroundColor: "whitesmoke" }}>
      {/* Loader Overlay */}
      {isLoading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 z-50" style={{ backdropFilter: 'blur(4px)' }}>
          <AiOutlineLoading3Quarters
            className="text-white"
            size={48}
            style={{ animation: "spin 1s linear infinite" }}
          />
          <style>
            {`@keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }`}
          </style>
        </div>
      )}

      <Header title="Existing Bookings" />

      {error && <div className="alert alert-danger">{error}</div>}

      {!isLoading && (
        <BookingsTable
          bookingInfo={bookingInfo}
          handleBookingCancellation={handleBookingCancellation}
        />
      )}
    </section>
  );
};

export default Bookings;
