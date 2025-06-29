import React from 'react';
import { Container } from 'react-bootstrap';

const Parallax = () => {
  return (
    <div className="parallax mb-5">
      <Container className="text-center px-5 py-5 flex flex-col items-center justify-center text-white">
        <div className="animated-texts bounceIn max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Welcome to <span className="hotel-color">NJ Hotel</span>
          </h2>
          <p className="text-lg md:text-xl font-medium">
            Where every stay is a story — curated experiences, plush comfort, and heartfelt service await you.
            Whether you're here to relax, celebrate, or explore, we promise a stay that lingers in memory.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Parallax;
