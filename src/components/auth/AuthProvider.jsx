// src/auth/AuthProvider.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Login from './Login'; // ← 🟢 Add this for modal popup

export const AuthContext = createContext({
  user: null,
  handleLogin: () => { },
  handleLogout: () => { },
  loginModalVisible: false,
  setLoginModalVisible: () => { },
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [redirectedFromRegistration, setRedirectedFromRegistration] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Invalid token in localStorage');
        localStorage.clear();
        setUser(null);
      }
    }
  }, []);

  const handleLogin = (token) => {
    const decodedToken = jwtDecode(token);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', decodedToken.sub);
    if (decodedToken.roles) {
      localStorage.setItem('userRole', decodedToken.roles.join(','));
    } else if (decodedToken.role) {
      localStorage.setItem('userRole', decodedToken.role);
    }
    setUser(decodedToken);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        handleLogin,
        handleLogout,
        loginModalVisible,
        setLoginModalVisible,
        redirectedFromRegistration, // 👈 add this
        setRedirectedFromRegistration, // 👈 and this too
      }}
    >

      {children}

      {/* 🔐 Global Login Modal
      {loginModalVisible && (
        <Login
          onClose={() => setLoginModalVisible(false)}
          onLoginSuccess={() => setLoginModalVisible(false)}
        />
      )} */}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
