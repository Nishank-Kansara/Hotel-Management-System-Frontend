import React, { useEffect, useState } from 'react';
import { availableRooms } from '../utils/ApiFunctions';
import RoomCard from './RoomCard';
import { Col, Container, Row, Button } from 'react-bootstrap';
import RoomFilter from '../common/RoomFilter';
import RoomPageinator from '../common/RoomPageinator';
import Sort from '../common/Sort';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const getTodayISTDate = () => {
  const now = new Date();
  const offset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + offset);
  return istDate.toISOString().split('T')[0];
};

const Room = () => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRoomsByDate = async () => {
    if (!checkInDate || !checkOutDate) {
      setError('Please select both check-in and check-out dates.');
      return;
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const rooms = await availableRooms(checkInDate, checkOutDate);
      setData(rooms);
      setRoomTypes([...new Set(rooms.map(room => room.roomType))]);
    } catch (err) {
      setError(err.message || 'Error fetching rooms');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = selectedRoomType
      ? data.filter(room => room.roomType === selectedRoomType)
      : [...data];

    if (sortOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.roomPrice - b.roomPrice);
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.roomPrice - a.roomPrice);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [selectedRoomType, sortOrder, data]);

  const totalPages = Math.ceil(filteredData.length / roomsPerPage);
  const currentRooms = filteredData.slice(
    (currentPage - 1) * roomsPerPage,
    currentPage * roomsPerPage
  );

  return (
    <Container className="mt-4 position-relative">
      {/* Loader Overlay */}
      {isLoading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-9999">
          <AiOutlineLoading3Quarters
            size={50}
            className="text-white spinner"
          />
          <style>{`
            .spinner {
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Date Selection */}
      <Row className="mb-3">
        <Col md={3}>
          <label>Check-in Date:</label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="form-control"
            min={getTodayISTDate()}
          />
        </Col>
        <Col md={3}>
          <label>Check-out Date:</label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="form-control"
            min={checkInDate || getTodayISTDate()}
          />
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button variant="primary" onClick={fetchRoomsByDate}>
            Search
          </Button>
        </Col>
      </Row>

      {/* Error Display */}
      {error && <div className="text-danger mb-3">{error}</div>}

      {/* Filter, Sort, Pagination */}
      {!isLoading && data.length > 0 && (
        <>
          <Row className="mb-3">
            <Col md={4}>
              <RoomFilter
                roomTypes={roomTypes}
                setSelectedRoomType={setSelectedRoomType}
              />
            </Col>
            <Col md={4}>
              <Sort sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </Col>
            <Col md={4} className="d-flex justify-content-end align-items-center">
              <RoomPageinator
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </Col>
          </Row>

          {/* Room Cards */}
          <Row>
            {currentRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
              />
            ))}
          </Row>

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <Row>
              <Col className="d-flex justify-content-center mt-4">
                <RoomPageinator
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </Col>
            </Row>
          )}
        </>
      )}

      {/* No Data Message */}
      {!isLoading && data.length === 0 && !error && (
        <div>No rooms available for selected dates.</div>
      )}
    </Container>
  );
};

export default Room;
