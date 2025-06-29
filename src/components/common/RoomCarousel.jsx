import React, { useEffect, useState } from 'react';
import { getAllRooms } from '../utils/ApiFunctions';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import { Card, Col, Row, Container, Placeholder } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import 'react-toastify/dist/ReactToastify.css';

const RoomCarousel = ({ onProtectedClick }) => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    getAllRooms()
      .then((data) => {
        setRooms(data);
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (onProtectedClick) {
      onProtectedClick(() => {
        navigate('/browse-all-rooms');
      });
    }
  };

  const skeletons = [...Array(4)].map((_, idx) => (
    <Col key={idx} xs={12} md={6} lg={3} className="mb-4">
      <Card className="h-100">
        <Placeholder as={Card.Img} animation="wave" className="w-100" style={{ height: '200px' }} />
        <Card.Body>
          <Placeholder.Button variant="secondary" className="w-100" />
        </Card.Body>
      </Card>
    </Col>
  ));

  return (
    <section className="bg-light mb-5 mt-5 shadow position-relative">

      {/* 🔄 Fullscreen Loader */}
      {isLoading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050, backdropFilter: 'blur(4px)' }}>
          <AiOutlineLoading3Quarters
            className="text-white"
            size={48}
            style={{ animation: 'spin 1s linear infinite' }}
          />
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      <div
        onClick={handleClick}
        className="hotel-color text-center d-block py-3 fs-5 fw-bold cursor-pointer"
        style={{ cursor: 'pointer' }}
      >
        Browse all rooms
      </div>

      <Container>
        {isLoading ? (
          <Row>{skeletons}</Row>
        ) : (
          <Carousel indicators={false}>
            {[...Array(Math.ceil(rooms.length / 4))].map((_, index) => (
              <Carousel.Item key={index}>
                <Row>
                  {rooms.slice(index * 4, index * 4 + 4).map((room) => (
                    <Col key={room.id} className="mb-4" xs={12} md={6} lg={3}>
                      <Card className="h-100">
                        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                          <Card.Img
                            variant="top"
                            src={`data:image/png;base64,${room.photo}`}
                            alt="Room"
                            className="w-100"
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                        </div>
                        <Card.Body>
                          <button onClick={handleClick} className="btn btn-hotel btn-sm w-100">
                            View / Book Now
                          </button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </Container>
    </section>
  );
};

export default RoomCarousel;
