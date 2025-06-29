import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RoomCard = ({ room ,checkInDate,checkOutDate}) => {
  return (
    <Card className="mb-3 shadow-sm rounded-3">
      <Row className="g-0">
        {/* Image Column */}
        <Col md={4}>
          <div
            style={{
              overflow: 'hidden',
              borderRadius: '0.375rem 0 0 0.375rem',
              height: '180px',       // fixed height
              width: '100%',
              position: 'relative',
            }}
          >
            <Link to={`/book-room/${room.id}`} className="btn btn-hotel btn-sm mt-2 mt-md-0 d-block h-100">
              <Card.Img
                src={`data:image/png;base64,${room.photo}`}
                alt="Room"
                style={{
                  height: '100%',   // fill container height
                  width: '100%',
                  objectFit: 'cover',  // maintain aspect ratio, cover entire container
                  display: 'block',
                  borderRadius: '0.375rem 0 0 0.375rem',
                }}
              />
            </Link>
          </div>
        </Col>

        {/* Info Column */}
        <Col md={8}>
          <Card.Body className="d-flex justify-content-between align-items-center flex-wrap py-3">
            <div>
              <Card.Title className="hotel-color mb-1">{room.roomType}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                <span className="fw-bold text-dark">₹{room.roomPrice}</span>
                <span className="text-secondary"> / night</span>
              </Card.Subtitle>
              <Card.Text className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                Some room information goes here for the guest to read
              </Card.Text>
            </div>
            <div>
              <Link to={`/room-info/${room.id}/${checkInDate}/${checkOutDate}`} className="btn btn-hotel btn-sm mt-2 mt-md-0">
                View/Book Now
              </Link>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default RoomCard;
