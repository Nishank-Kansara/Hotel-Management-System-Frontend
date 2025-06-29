// src/pages/Admin.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaDoorOpen, FaClipboardList } from "react-icons/fa";

const Admin = () => (
  <section className="container mx-auto mt-16 max-w-2xl animated-texts">
    <div className="bg-white rounded-3xl shadow-lg p-8 text-center border border-gray-100 card">
      <h2 className="text-3xl font-bold hotel-color mb-4">Admin Panel</h2>
      <p className="text-gray-600 mb-6 text-base">
        Welcome back! Choose a section to manage:
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/existing-rooms"
          className="no-underline text-white flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-base shadow hover:shadow-md transition duration-200"
          style={{
            background: "linear-gradient(to right, var(--primary-color), var(--primary-hover))",
          }}
        >
          <FaDoorOpen className="text-lg" />
          <span>Manage Rooms</span>
        </Link>


        <Link
          to="/existing-bookings"
          className="bg-green-600 hover:bg-green-700 no-underline text-white flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-base shadow hover:shadow-md transition duration-200"
        >
          <FaClipboardList /> Manage Bookings
        </Link>
      </div>
    </div>
  </section>
);

export default Admin;
