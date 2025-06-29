import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Header from './Header';
import {
  FaClock,
  FaCocktail,
  FaParking,
  FaSnowflake,
  FaTshirt,
  FaUtensils,
  FaWifi
} from 'react-icons/fa';

const services = [
  {
    icon: <FaWifi />,
    title: 'Wifi',
    description: 'Stay connected with high-speed internet access',
  },
  {
    icon: <FaUtensils />,
    title: 'Breakfast',
    description: 'Start your day with a delicious breakfast buffet',
  },
  {
    icon: <FaTshirt />,
    title: 'Laundry',
    description: 'Keep your clothes clean and fresh with our laundry service',
  },
  {
    icon: <FaCocktail />,
    title: 'Mini-bar',
    description: 'Enjoy a refreshing drink or snack from our in-room mini-bar',
  },
  {
    icon: <FaParking />,
    title: 'Parking',
    description: 'Park your car conveniently in our on-site parking lot',
  },
  {
    icon: <FaSnowflake />,
    title: 'Air Conditioning',
    description: 'Stay cool and comfortable with our air conditioning system',
  },
];

const HotelService = () => {
  return (
    <>
      <Container className='mb-5'>
        <Header title='Our Services' />

        <Row className='text-center my-4'>
          <h4 className='fw-bold'>
            Services at <span className='hotel-color'>NJ-</span>Hotel{' '}
            <span className='d-inline-flex align-items-center gap-2'>
              <FaClock /> 24-Hour Front Desk
            </span>
          </h4>
        </Row>

        <hr />

        <Row xs={1} md={2} lg={3} className='g-4 mt-3'>
          {services.map((service, idx) => (
            <Col key={idx}>
              <Card className='shadow-sm h-100'>
                <Card.Body>
                  <Card.Title className='hotel-color d-flex align-items-center gap-2 fs-5'>
                    {service.icon} {service.title}
                  </Card.Title>
                  <Card.Text>{service.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default HotelService;
