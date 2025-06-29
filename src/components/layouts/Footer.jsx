import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    let today = new Date();

    return (
        <footer className='bg-dark text-light py-1'>
            <Container className="text-center">
                <Row>
                    <Col>
                        <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                            &copy; {today.getFullYear()} NJ-Hotel
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
