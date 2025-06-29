import React, { useState } from 'react';
import { getBookingByConfirmationCode, cancelBooking } from '../utils/ApiFunctions';
import { Modal, Button } from 'react-bootstrap';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const FindBooking = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [bookingInfo, setBookingInfo] = useState({
    id: '',
    room: { id: '', roomType: '' },
    bookingConfirmationCode: '',
    roomNumber: '',
    checkInDate: '',
    checkOutDate: '',
    guestFullName: '',
    guestEmail: '',
    numOfAdults: '',
    numOfChildren: '',
    totalNumOfGuest: '',
  });

  const clearBookingInfo = {
    id: '',
    room: { id: '', roomType: '' },
    bookingConfirmationCode: '',
    roomNumber: '',
    checkInDate: '',
    checkOutDate: '',
    guestFullName: '',
    guestEmail: '',
    numOfAdults: '',
    numOfChildren: '',
    totalNumOfGuest: '',
  };

  const handleInputChange = (e) => {
    setConfirmationCode(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsDeleted(false);
    try {
      const data = await getBookingByConfirmationCode(confirmationCode.trim());
      setBookingInfo(data);
    } catch (error) {
      setBookingInfo(clearBookingInfo);
      if (error.response?.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('Failed to fetch booking. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingCancellation = async () => {
    setIsLoading(true);
    try {
      await cancelBooking(bookingInfo.id);
      setIsDeleted(true);
      setBookingInfo(clearBookingInfo);
      setConfirmationCode('');
      setError('');
      setShowModal(false);
    } catch (error) {
      setError('Cancellation failed. Please try again.');
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 🔄 Fullscreen Loader */}
      {isLoading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 z-50" style={{ backdropFilter: 'blur(4px)' }}>
          <AiOutlineLoading3Quarters
            className="text-white"
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
      )}

      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h2 className="text-center mb-4">Find My Booking</h2>
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="confirmationCode" className="form-label">
                Booking Confirmation Code
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="confirmationCode"
                  value={confirmationCode}
                  onChange={handleInputChange}
                  placeholder="Enter confirmation code"
                  required
                />
                <button type="submit" className="btn btn-dark">
                  Find Booking
                </button>
              </div>
            </form>

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}

            {isDeleted && (
              <div className="alert alert-success mt-3">
                Booking cancelled successfully.
              </div>
            )}

            {bookingInfo.bookingConfirmationCode && !isDeleted && (
              <div className="card mt-4 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Booking Details</h5>
                  <ul className="list-unstyled mb-0">
                    <li><strong>Booking ID:</strong> {bookingInfo.id}</li>
                    <li><strong>Confirmation Code:</strong> {bookingInfo.bookingConfirmationCode}</li>
                    <li><strong>Room ID:</strong> {bookingInfo.room.id}</li>
                    <li><strong>Room Type:</strong> {bookingInfo.room.roomType}</li>
                    <li><strong>Check-In:</strong> {bookingInfo.checkInDate}</li>
                    <li><strong>Check-Out:</strong> {bookingInfo.checkOutDate}</li>
                    <li><strong>Guest Name:</strong> {bookingInfo.guestFullName}</li>
                    <li><strong>Guest Email:</strong> {bookingInfo.guestEmail}</li>
                    <li><strong>Adults:</strong> {bookingInfo.numOfAdults}</li>
                    <li><strong>Children:</strong> {bookingInfo.numOfChildren}</li>
                    <li><strong>Total Guests:</strong> {bookingInfo.totalNumOfGuest}</li>
                  </ul>
                  <button className="btn btn-outline-danger mt-3" onClick={() => setShowModal(true)}>
                    Cancel Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this booking?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={handleBookingCancellation}>
            Yes, Cancel Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FindBooking;
