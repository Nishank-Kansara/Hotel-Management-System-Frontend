import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../auth/AuthProvider';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Logout = ({ onClose = () => {} }) => {
  const navigate = useNavigate();
  const { handleLogout } = useContext(AuthContext);
  const toastShown = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader first
    setLoading(true);

    const timer = setTimeout(() => {
      // Perform logout
      handleLogout();

      if (!toastShown.current) {
        toast.info('Logged out successfully!');
        toastShown.current = true;
      }

      onClose();
      navigate('/');
      setLoading(false);
    }, 500); // adjust delay as needed

    return () => clearTimeout(timer);
  }, [handleLogout, navigate, onClose]);

  // Nothing to render except the loader
  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi‑transparent blurred backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      {/* Spinner */}
      <AiOutlineLoading3Quarters className="absolute text-white text-5xl animate-spin" />
    </div>
  );
};

export default Logout;
