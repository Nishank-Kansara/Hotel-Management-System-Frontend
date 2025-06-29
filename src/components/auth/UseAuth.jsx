import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

const useAuth = () => {
  const {
    user,
    handleLogin,
    handleLogout,
    loginModalVisible,
    setLoginModalVisible,
    redirectedFromRegistration,
    setRedirectedFromRegistration,
  } = useContext(AuthContext);

  const isLoggedIn = !!user;
  const isAdmin = user?.roles?.includes('ADMIN') || user?.role === 'ADMIN';

  return {
    user,
    isLoggedIn,
    isAdmin,
    handleLogin,
    handleLogout,
    loginModalVisible,
    setLoginModalVisible,
    redirectedFromRegistration,
    setRedirectedFromRegistration,
  };
};

export default useAuth;
