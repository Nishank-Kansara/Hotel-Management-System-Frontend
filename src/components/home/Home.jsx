import React, { useContext, useState } from 'react';
import MainHeader from '../layouts/MainHeader';
import HotelService from '../common/HotelService';
import Parallax from '../common/Parallax';
import RoomCarousel from '../common/RoomCarousel';
import { AuthContext } from '../auth/AuthProvider';
import Login from '../auth/Login';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleProtectedClick = (action) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      action(); // navigate to browse-all-rooms
    }
  };

  return (
    <section>
      <MainHeader />
      <section className="container">
        <RoomCarousel onProtectedClick={handleProtectedClick} />
        <Parallax />
        <HotelService />
      </section>

      {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
    </section>
  );
};

export default Home;
