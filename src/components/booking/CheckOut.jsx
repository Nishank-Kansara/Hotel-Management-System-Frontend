import React, { useEffect, useState } from 'react';
import BookingForm from './BookingForm';
import { getRoomById } from '../utils/ApiFunctions';
import { useParams } from 'react-router-dom';

const CheckOut = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
            <BookingForm />
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
