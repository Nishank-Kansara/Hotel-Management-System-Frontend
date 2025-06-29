import React, { useEffect, useState } from "react"
import {
  deleteUser,
  getBookingsByUserId,
  getUser,
  changePassword,
} from "../utils/ApiFunctions"
import { useNavigate } from "react-router-dom"
import moment from "moment"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { toast } from "react-toastify"

const Profile = () => {
  const [user, setUser] = useState({ id: "", email: "", firstName: "", lastName: "", roles: [{ id: "", name: "" }] })
  const [bookings, setBookings] = useState([])
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)         // Loader for change password
  const [initialLoading, setInitialLoading] = useState(true) // Loader for profile/bookings

  const navigate = useNavigate()
  const userId = localStorage.getItem("userId")
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("userEmail")

  useEffect(() => {
    (async () => {
      try {
        const data = await getUser(userId, token)
        setUser(data)
      } catch {
        toast.error("Failed to load user profile")
      }
    })()
  }, [userId, token])

  useEffect(() => {
    (async () => {
      try {
        const data = await getBookingsByUserId(userId, token)
        setBookings(data)
      } catch {
        toast.error("Failed to load bookings")
      } finally {
        setInitialLoading(false)
      }
    })()
  }, [userId, token])

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return
    try {
      const res = await deleteUser(userId)
      toast.success(res)
      localStorage.clear()
      navigate("/")
      window.location.reload()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.warning("Please fill all password fields")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.warning("Passwords do not match")
      return
    }
    try {
      setLoading(true)
      const res = await changePassword(email, oldPassword, newPassword)
      toast.success(res.message)
      setShowModal(false)
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5 position-relative">

      {/* 🔄 Loader Overlay */}
      {(initialLoading || loading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Semi‑transparent blurred backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          {/* Spinner */}
          <AiOutlineLoading3Quarters className="absolute text-white text-5xl animate-spin" />
        </div>
      )}

      {/* Messages */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {/* Profile Card */}
      <div className="card shadow-lg border-0 rounded-4 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        <h3 className="text-center mb-4">👤 User Profile</h3>
        <div className="row g-4">
          <div className="col-md-3 d-flex justify-content-center">
            <img
              src="https://themindfulaimanifesto.org/wp-content/uploads/2020/09/male-placeholder-image.jpeg"
              alt="Profile"
              className="rounded-circle shadow"
              style={{ width: 150, height: 150, objectFit: "cover" }}
            />
          </div>
          <div className="col-md-9">
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><strong>ID:</strong> {user.id}</li>
              <li className="list-group-item"><strong>First Name:</strong> {user.firstName}</li>
              <li className="list-group-item"><strong>Last Name:</strong> {user.lastName}</li>
              <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
              <li className="list-group-item">
                <strong>Roles:</strong>{" "}
                {user.roles.map(r => (
                  <span key={r.id} className="badge bg-secondary me-1">{r.name}</span>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />
        <h4 className="text-center mb-3">📖 Booking History</h4>

        {bookings.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Booking ID</th>
                  <th>Room ID</th>
                  <th>Room Type</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Confirmation Code</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.room.id}</td>
                    <td>{b.room.roomType}</td>
                    <td>{moment(b.checkInDate).format("MMM Do, YYYY")}</td>
                    <td>{moment(b.checkOutDate).format("MMM Do, YYYY")}</td>
                    <td>{b.bookingConfirmationCode}</td>
                    <td><span className="badge bg-success">On-going</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted text-center">You have not made any bookings yet.</p>
        )}

        <div className="text-center mt-4 d-flex justify-content-center gap-4 flex-wrap">
          <button className="btn btn-outline-danger px-4 py-2 rounded-pill shadow-sm" onClick={handleDeleteAccount}>
            Close Account 🗑️
          </button>
          <button className="btn btn-outline-primary px-4 py-2 rounded-pill shadow-sm" onClick={() => setShowModal(true)}>
            Change Password 🔒
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show" style={{ backdropFilter: "blur(4px)" }} />
          <div className="modal d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Change Password</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Old Password</label>
                    <div className="input-group">
                      <input type={showPassword ? "text" : "password"} className="form-control" value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)} />
                      <span className="input-group-text cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input type={showPassword ? "text" : "password"} className="form-control" value={newPassword}
                      onChange={e => setNewPassword(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input type={showPassword ? "text" : "password"} className="form-control" value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleChangePassword}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Profile
