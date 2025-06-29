import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Home from './components/home/Home';
import AddRoom from './components/room/AddRoom';
import ExistingRooms from './components/room/ExistingRooms';
import EditRoom from './components/room/EditRoom';
import RoomListing from './components/room/RoomListing';
import Admin from './components/admin/Admin';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Profile from './components/auth/Profile';
import CheckOut from './components/booking/CheckOut';
import BookingSuccess from './components/booking/BookingSuccess';
import RoomInfo from './components/room/RoomInfo';
import Bookings from './components/booking/Bookings';
import FindBooking from './components/booking/FindBooking';
import Registration from './components/auth/Registration';

import AuthProvider from './components/auth/AuthProvider';
import RoomProvider from './components/room/RoomProvider';
import ProtectedRoute from './components/auth/ProtectedRoute'; // ✅ import this

function App() {
  return (
    <AuthProvider>
      <RoomProvider>
        <div className="flex flex-col min-h-screen">
          <Router>
            <Navbar />

            <ToastContainer
              position="top-right"
              autoClose={1000}
              limit={1}
              pauseOnHover={false}
              draggable={false}
              theme="light"
            />
            <main className="flex-grow">
              <Routes>

                {/* ✅ Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/room-info/:roomId/:checkIn/:checkOut" element={<RoomInfo />} />
                <Route path="/booking-success" element={<BookingSuccess />} />
                <Route path="/find-booking" element={<FindBooking />} />

                {/* 🔒 Protected Routes (login required) */}
                <Route path="/profile" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />
                <Route path="/add-room" element={
                  <ProtectedRoute><AddRoom /></ProtectedRoute>
                } />
                <Route path="/edit-room/:roomId" element={
                  <ProtectedRoute><EditRoom /></ProtectedRoute>
                } />
                <Route path="/existing-rooms" element={
                  <ProtectedRoute><ExistingRooms /></ProtectedRoute>
                } />
                <Route path="/browse-all-rooms" element={
                  <ProtectedRoute><RoomListing /></ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute><Admin /></ProtectedRoute>
                } />
                <Route path="/book-room/:roomId/:checkIn/:checkOut" element={
                  <ProtectedRoute><CheckOut /></ProtectedRoute>
                } />
                <Route path="/existing-bookings" element={
                  <ProtectedRoute><Bookings /></ProtectedRoute>
                } />

              </Routes>
            </main>

            <Footer />
          </Router>
        </div>
      </RoomProvider>
    </AuthProvider>
  );
}

export default App;
