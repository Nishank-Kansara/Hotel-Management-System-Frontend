import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import DateSlider from '../common/DateSlider';

const BookingsTable = ({ bookingInfo, handleBookingCancellation }) => {
  const [filteredBookings, setFilteredBookings] = useState(bookingInfo);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const handleDateFilter = (startDate, endDate) => {
    let filtered = bookingInfo;
    if (startDate && endDate) {
      filtered = bookingInfo.filter((booking) => {
        const bookingStartDate = new Date(booking.checkInDate);
        const bookingEndDate = new Date(booking.checkOutDate);
        return (
          bookingStartDate >= startDate &&
          bookingEndDate <= endDate &&
          bookingEndDate >= startDate
        );
      });
    }
    setFilteredBookings(filtered);
  };

  useEffect(() => {
    setFilteredBookings(bookingInfo);
  }, [bookingInfo]);

  const openCancelModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    const modal = new window.bootstrap.Modal(document.getElementById('cancelModal'));
    modal.show();
  };

  const confirmCancel = () => {
    if (selectedBookingId) {
      handleBookingCancellation(selectedBookingId);
      const modal = window.bootstrap.Modal.getInstance(document.getElementById('cancelModal'));
      modal.hide();
      setSelectedBookingId(null);
    }
  };

  return (
    <section className="p-3">
      <DateSlider onDateChange={handleDateFilter} onFilterChange={handleDateFilter} />

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>S/N</th>
              <th>Booking ID</th>
              <th>Room ID</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Guest Name</th>
              <th>Guest Email</th>
              <th>Adults</th>
              <th>Children</th>
              <th>Total Guests</th>
              <th>Confirmation Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr key={booking.id}>
                <td>{index + 1}</td>
                <td>{booking.id}</td>
                <td>{booking.room.id}</td>
                <td>{format(new Date(booking.checkInDate), 'yyyy-MM-dd')}</td>
                <td>{format(new Date(booking.checkOutDate), 'yyyy-MM-dd')}</td>
                <td>{booking.guestName}</td>
                <td>{booking.guestEmail}</td>
                <td>{booking.numOfAdults}</td>
                <td>{booking.numOfChildren}</td>
                <td>{booking.totalNumOfGuest}</td>
                <td>{booking.bookingConfirmationCode}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => openCancelModal(booking.id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center mt-3 alert alert-info">
          No bookings found for selected date.
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <div
        className="modal fade"
        id="cancelModal"
        tabIndex="-1"
        aria-labelledby="cancelModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title" id="cancelModalLabel">Confirm Cancellation</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to cancel this booking?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmCancel}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingsTable;
