import React, { useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './AuthProvider';
import { loginUser, requestOtp, verifyOtp, resetPassword } from '../utils/ApiFunctions';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Link } from 'react-router-dom'; // ✅ ADDED THIS LINE

const Login = ({ onClose = () => {}, onLoginSuccess = () => {} }) => {
  const { handleLogin } = useContext(AuthContext);

  const [mode, setMode] = useState('login');
  const [login, setLogin] = useState({ email: '', password: '' });
  const [emailForReset, setEmailForReset] = useState('');
  const [otp, setOtp] = useState('');
  const [newPasswords, setNewPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleChange = (e, setter) =>
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const wrapAsync = fn => async e => {
    e.preventDefault();
    try {
      setLoading(true);
      await fn(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = wrapAsync(async () => {
    const res = await loginUser(login);
    if (res?.user?.token) {
      localStorage.setItem('token', res.user.token);
      localStorage.setItem('userId', res.user.id);
      localStorage.setItem('userRole', res.user.roles?.join(',') || res.user.role);
      handleLogin(res.user.token);
      toast.success('Login successful!');
      onLoginSuccess();
      onClose();
    } else {
      toast.error('Invalid email or password.');
    }
  });

  const handleForgotEmail = wrapAsync(async () => {
    await requestOtp(emailForReset);
    toast.success('OTP sent to your email.');
    setMode('verifyOtp');
  });

  const handleVerifyOtp = wrapAsync(async () => {
    await verifyOtp(emailForReset, otp);
    toast.success('OTP verified!');
    setMode('resetPassword');
  });

  const handleResetPassword = wrapAsync(async () => {
    if (newPasswords.newPassword !== newPasswords.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    await resetPassword(emailForReset, newPasswords.newPassword);
    toast.success('Password reset successful.');
    setMode('login');
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          <AiOutlineLoading3Quarters className="absolute text-white text-5xl animate-spin" />
        </div>
      )}

      <div
        className={`relative bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md transition-filter ${
          loading ? 'filter blur-sm pointer-events-none' : ''
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        {/* ─── LOGIN ───────────────────────────────────────── */}
        {mode === 'login' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={login.email}
                  onChange={e => handleChange(e, setLogin)}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={login.password}
                    onChange={e => handleChange(e, setLogin)}
                    required
                    className="w-full border border-gray-300 rounded-md p-2 mt-1 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('forgotEmail')}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Forgot Password?
                </button>
              </div>
              <p className="text-sm mt-3">
                Don't have an account?{' '}
                <Link to="/register-user" className="text-indigo-600 underline" onClick={onClose}>
                  Register
                </Link>
              </p>
            </form>
          </>
        )}

        {/* ─── FORGOT EMAIL ─────────────────────────────────────── */}
        {mode === 'forgotEmail' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
            <form onSubmit={handleForgotEmail}>
              <input
                type="email"
                value={emailForReset}
                onChange={e => setEmailForReset(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Send OTP
                </button>
              </div>
            </form>
          </>
        )}

        {/* ─── VERIFY OTP ─────────────────────────────────────── */}
        {mode === 'verifyOtp' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Enter OTP</h2>
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                placeholder="Enter the OTP"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setMode('forgotEmail')}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Verify
                </button>
              </div>
            </form>
          </>
        )}

        {/* ─── RESET PASSWORD ─────────────────────────────────── */}
        {mode === 'resetPassword' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
            <form onSubmit={handleResetPassword}>
              <div className="mb-4 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={newPasswords.newPassword}
                  onChange={e => handleChange(e, setNewPasswords)}
                  required
                  placeholder="New Password"
                  className="w-full border border-gray-300 rounded-md p-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <div className="mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={newPasswords.confirmPassword}
                  onChange={e => handleChange(e, setNewPasswords)}
                  required
                  placeholder="Confirm Password"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Reset
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
