import React, { useContext, useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthProvider';
import Login from '../auth/Login';
import Logout from '../auth/Logout';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const {
    user,
    loginModalVisible,
    setLoginModalVisible,
    redirectedFromRegistration,
    setRedirectedFromRegistration,
  } = useContext(AuthContext);

  const isLoggedIn = !!user;
  const userRole = user?.roles?.[0] || user?.role || '';

  const linkBase =
    'px-4 py-2 text-lg font-medium transition-colors duration-200 text-[var(--text-dark)] hover:text-[var(--primary-color)] text-decoration-none';

  const protectedNavigate = (path) => {
    if (!isLoggedIn) {
      setLoginModalVisible(true);
    } else {
      navigate(path);
    }
  };

  // 👇 Show login modal if redirected from registration
  useEffect(() => {
    if (redirectedFromRegistration) {
      setLoginModalVisible(true);
      setRedirectedFromRegistration(false);
    }
  }, [redirectedFromRegistration, setLoginModalVisible, setRedirectedFromRegistration]);

  return (
    <>
      <nav className="bg-[#f9f9f9] shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="hotel-color text-3xl font-extrabold uppercase tracking-widest">
              NJ Hotel
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              <span onClick={() => protectedNavigate('/browse-all-rooms')} className={linkBase}>
                Browse Rooms
              </span>

              {isLoggedIn && userRole === 'ROLE_ADMIN' && (
                <span onClick={() => navigate('/admin')} className={linkBase}>
                  Admin
                </span>
              )}

              <span onClick={() => protectedNavigate('/find-booking')} className={linkBase}>
                Find Booking
              </span>

              {/* Account Dropdown */}
              <div className="relative">
                <span
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`cursor-pointer ${linkBase}`}
                >
                  Account
                  <span
                    className={`ml-1 inline-block transition-transform duration-300 transform ${
                      isDropdownOpen ? 'rotate-0' : '-rotate-90'
                    } text-sm align-middle`}
                  >
                    ▼
                  </span>
                </span>

                {isDropdownOpen && (
                  <ul className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl ring-1 ring-gray-200 overflow-hidden z-50">
                    {!isLoggedIn ? (
                      <li>
                        <span
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setLoginModalVisible(true);
                          }}
                          className="block px-4 py-2 text-lg cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                        >
                          Login
                        </span>
                      </li>
                    ) : (
                      <>
                        <li>
                          <span
                            onClick={() => {
                              setIsDropdownOpen(false);
                              navigate('/profile');
                            }}
                            className="block px-4 py-2 text-lg text-[var(--text-dark)] hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                          >
                            Profile
                          </span>
                        </li>
                        <li>
                          <span
                            onClick={() => {
                              setIsDropdownOpen(false);
                              setShowLogoutConfirm(true);
                            }}
                            className="block px-4 py-2 text-lg text-[var(--text-dark)] hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                          >
                            Logout
                          </span>
                        </li>
                      </>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6 text-[var(--text-dark)]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg ring-1 ring-gray-200 animate-slide-down">
            <span
              onClick={() => protectedNavigate('/browse-all-rooms')}
              className="block px-6 py-3 border-b border-gray-100 hover:bg-gray-50 text-lg text-[var(--text-dark)] cursor-pointer"
            >
              Browse Rooms
            </span>

            <span
              onClick={() => protectedNavigate('/find-booking')}
              className="block px-6 py-3 border-b border-gray-100 hover:bg-gray-50 text-lg text-[var(--text-dark)] cursor-pointer"
            >
              Find Booking
            </span>

            {isLoggedIn && userRole === 'ROLE_ADMIN' && (
              <span
                onClick={() => navigate('/admin')}
                className="block px-6 py-3 border-b border-gray-100 hover:bg-gray-50 text-lg text-[var(--text-dark)] cursor-pointer"
              >
                Admin
              </span>
            )}

            {!isLoggedIn ? (
              <span
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setLoginModalVisible(true);
                }}
                className="block px-6 py-3 text-lg text-[var(--text-dark)] hover:text-[var(--primary-color)] cursor-pointer"
              >
                Login
              </span>
            ) : (
              <>
                <span
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="block px-6 py-3 border-t border-gray-100 text-lg text-[var(--text-dark)] hover:bg-gray-50 cursor-pointer"
                >
                  Profile
                </span>
                <span
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="block px-6 py-3 text-lg text-[var(--text-dark)] hover:bg-gray-50 cursor-pointer"
                >
                  Logout
                </span>
              </>
            )}
          </div>
        )}
      </nav>

      {/* 🔐 Modals */}
      {loginModalVisible && (
        <Login
          onClose={() => setLoginModalVisible(false)}
          onLoginSuccess={() => setLoginModalVisible(false)}
        />
      )}
      {showLogoutConfirm && <Logout onClose={() => setShowLogoutConfirm(false)} />}
    </>
  );
};

export default Navbar;
