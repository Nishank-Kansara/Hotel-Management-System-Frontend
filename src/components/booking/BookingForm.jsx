import React, { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import { bookedRoom as bookRoomApi, getRoomById } from '../utils/ApiFunctions';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { Form, FormControl } from 'react-bootstrap';
import BookingSummary from './BookingSummary';
import 'react-toastify/dist/ReactToastify.css';

const BookingForm = () => {
  const [isValidated, setIsValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [roomPrice, setRoomPrice] = useState(0);
  const [roomType, setRoomType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { roomId, checkIn, checkOut } = useParams();
  const currentEmail = localStorage.getItem('userEmail');

  const [booking, setBooking] = useState({
    guestFullName: '',
    guestEmail: currentEmail || '',
    checkInDate: '',
    checkOutDate: '',
    numberOfAdults: '',
    numberOfChildren: '',
  });

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setIsLoading(true);
      try {
        const resp = await getRoomById(roomId);
        setRoomPrice(Number(resp.roomPrice));
        setRoomType(resp.roomType);
      } catch {
        toast.error('Error fetching room details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetails();

    if (checkIn && checkOut) {
      setBooking(prev => ({
        ...prev,
        checkInDate: moment(checkIn).format('YYYY-MM-DD'),
        checkOutDate: moment(checkOut).format('YYYY-MM-DD'),
      }));
    }
  }, [roomId, checkIn, checkOut]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setBooking(prev => ({ ...prev, [name]: value }));
  };

  const calculatePayment = () => {
    const inD = moment(booking.checkInDate);
    const outD = moment(booking.checkOutDate);
    if (!inD.isValid() || !outD.isValid()) return 0;
    const nights = outD.diff(inD, 'days');
    return nights > 0 ? nights * roomPrice : 0;
  };

  const isGuestCountValid = () => {
    const adults = parseInt(booking.numberOfAdults, 10) || 0;
    const kids = parseInt(booking.numberOfChildren, 10) || 0;
    return adults >= 1 && adults + kids >= 1;
  };

  const isCheckOutValid = () => {
    if (!moment(booking.checkOutDate).isAfter(moment(booking.checkInDate))) {
      toast.error('Check-out must be after check-in');
      return false;
    }
    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity() || !isGuestCountValid() || !isCheckOutValid()) {
      e.stopPropagation();
      if (!isGuestCountValid()) toast.error('At least one adult required');
    } else {
      setIsSubmitted(true);
    }
    setIsValidated(true);
  };

  const handleBooking = async () => {
    setIsLoading(true);
    try {
      const bookedRoomData = {
        ...booking,
        numOfAdults: parseInt(booking.numberOfAdults, 10),
        numOfChildren: parseInt(booking.numberOfChildren, 10),
        room: { roomType, roomPrice },
      };
      const totalAmount = calculatePayment();
      const payload = { bookedRoom: bookedRoomData, totalAmount };
      const confirmationCode = await bookRoomApi(roomId, payload);

      toast.success('Booking successful!');
      navigate('/booking-success', {
        state: {
          message: `Room booked! Your confirmation code is: ${confirmationCode}`,
          booking: bookedRoomData,
          payment: totalAmount,
        },
      });
    } catch (err) {
      toast.error(err.message || 'Booking failed.');
      navigate('/booking-success', {
        state: { error: err.message || 'Booking failed.' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mb-5 mt-4 position-relative">
      <ToastContainer />

      {/* 🔁 Fullscreen Loader */}
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

      <div className={`row g-4 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Booking Form */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="card-title mb-4">Reserve Room</h4>
              <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name:</Form.Label>
                  <FormControl
                    required
                    type="text"
                    name="guestFullName"
                    value={booking.guestFullName}
                    placeholder="Enter your full name"
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">Please enter your name.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email:</Form.Label>
                  <FormControl
                    required
                    type="email"
                    name="guestEmail"
                    value={booking.guestEmail}
                    disabled
                  />
                </Form.Group>

                <fieldset className="mb-4">
                  <legend className="fs-5 mb-3">Lodging Period</legend>
                  <div className="row">
                    <div className="col-sm-6 mb-3">
                      <Form.Label>Check-In:</Form.Label>
                      <FormControl
                        required
                        type="date"
                        name="checkInDate"
                        value={booking.checkInDate}
                        onChange={handleInputChange}
                        disabled={!!checkIn}
                      />
                    </div>
                    <div className="col-sm-6 mb-3">
                      <Form.Label>Check-Out:</Form.Label>
                      <FormControl
                        required
                        type="date"
                        name="checkOutDate"
                        value={booking.checkOutDate}
                        onChange={handleInputChange}
                        disabled={!!checkOut}
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="mb-4">
                  <legend className="fs-5 mb-3">Guests</legend>
                  <div className="row">
                    <div className="col-sm-6 mb-3">
                      <Form.Label>Adults:</Form.Label>
                      <FormControl
                        required
                        type="number"
                        name="numberOfAdults"
                        min={1}
                        value={booking.numberOfAdults}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-sm-6 mb-3">
                      <Form.Label>Children:</Form.Label>
                      <FormControl
                        type="number"
                        name="numberOfChildren"
                        min={0}
                        value={booking.numberOfChildren}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </fieldset>

                <div className="text-end">
                  <button type="submit" className="btn btn-hotel px-4">Continue</button>
                </div>
              </Form>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        {isSubmitted && (
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <BookingSummary
                  booking={booking}
                  payment={calculatePayment()}
                  isFormValid={isValidated}
                  onConfirm={handleBooking}
                  roomPrice={roomPrice}
                  roomNumber={roomId}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
