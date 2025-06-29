import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import RoomFilter from '../common/RoomFilter';
import Sort from '../common/Sort';
import RoomPageinator from '../common/RoomPageinator';
import { deleteRoom, getAllRooms } from '../utils/ApiFunctions';
import { OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaEdit, FaTrashAlt, FaEye, FaPlusCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { RoomContext } from './RoomProvider'; // Adjust the import path as necessary

const ExistingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [viewType, setViewType] = useState('card');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // ✅ NEW: for overlay loader
  const { roomFromView, setRoomFromView, roomFromEdit, setRoomFromEdit } = useContext(RoomContext);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const result = await getAllRooms();
      setRooms(result);
      setFilteredRooms(result);
    } catch (e) {
      toast.error('Unable to get rooms!!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let updated = [...rooms];

    if (selectedRoomType) {
      updated = updated.filter((r) => r.roomType === selectedRoomType);
    }

    if (sortOrder === 'lowToHigh') {
      updated.sort((a, b) => a.roomPrice - b.roomPrice);
    } else if (sortOrder === 'highToLow') {
      updated.sort((a, b) => b.roomPrice - a.roomPrice);
    }

    setFilteredRooms(updated);
    setCurrentPage(1);
  }, [rooms, selectedRoomType, sortOrder]);

  const handlePaginationClick = (pageNumber) => setCurrentPage(pageNumber);

  const calculateTotalPages = () => Math.ceil(filteredRooms.length / roomsPerPage);

  const indexOfLast = currentPage * roomsPerPage;
  const indexOfFirst = indexOfLast - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirst, indexOfLast);

  const uniqueRoomTypes = [...new Set(rooms.map((r) => r.roomType))];

  const confirmDelete = (roomId) => {
    setRoomToDelete(roomId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true); // ✅ Show overlay loader
    try {
      const result = await deleteRoom(roomToDelete);
      if (result === '') {
        toast.success(`Room no ${roomToDelete} was deleted Successfully!!`);
        fetchRooms();
      } else {
        toast.error(`Error deleting room: ${result.message}`);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false); // ✅ Hide loader
      setShowConfirmModal(false);
      setRoomToDelete(null);
    }
  };

  const ActionButtons = ({ roomId }) => (
    <div className="flex justify-center space-x-2">
      <OverlayTrigger placement="top" overlay={<Tooltip>View Details</Tooltip>}>
        <Link
          to={`/edit-room/${roomId}`}
          className="w-8 h-8 flex items-center justify-center border rounded-full transition"
          style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
          onClick={() => {
            setRoomFromView(true);
            setRoomFromEdit(false);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-color)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = 'var(--primary-color)';
          }}
        >
          <FaEye className="text-lg" />
        </Link>
      </OverlayTrigger>

      <OverlayTrigger placement="top" overlay={<Tooltip>Edit Room</Tooltip>}>
        <Link
          to={`/edit-room/${roomId}`}
          className="w-8 h-8 flex items-center justify-center border rounded-full transition"
          style={{ borderColor: 'darkgoldenrod', color: 'darkgoldenrod' }}
          onClick={() => {
            setRoomFromView(false);
            setRoomFromEdit(true);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'darkgoldenrod';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = 'darkgoldenrod';
          }}
        >
          <FaEdit className="text-lg" />
        </Link>
      </OverlayTrigger>

      <OverlayTrigger placement="top" overlay={<Tooltip>Delete Room</Tooltip>}>
        <button
          className="w-8 h-8 flex items-center justify-center border rounded-full transition"
          style={{ borderColor: '#dc3545', color: '#dc3545' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#dc3545';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#dc3545';
          }}
          onClick={() => confirmDelete(roomId)}
        >
          <FaTrashAlt className="text-lg" />
        </button>
      </OverlayTrigger>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto flex flex-col min-h-screen pb-12 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-1" style={{ color: 'var(--primary-color)' }}>
            Available Rooms
          </h2>
          <p className="text-gray-600">Browse and manage all room listings</p>
        </div>
        <Link
          to="/add-room"
          className="inline-flex items-center justify-center space-x-2 rounded-2xl shadow px-3 py-2 text-sm sm:text-base no-underline text-white hover:shadow-md transition duration-200"
          style={{
            background: "linear-gradient(to right, var(--primary-color), var(--primary-hover))",
          }}
        >
          <FaPlusCircle className="text-lg sm:text-xl" />
          <span className="hidden sm:inline">Add Room</span> {/* Hidden on small screens */}
        </Link>


      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <RoomFilter roomTypes={uniqueRoomTypes} setSelectedRoomType={setSelectedRoomType} />
        <Sort sortOrder={sortOrder} setSortOrder={setSortOrder} />
        <div className="flex justify-end items-end space-x-2">
          <button onClick={() => setViewType('card')} className={`px-3 py-2 rounded-2xl transition ${viewType === 'card' ? 'bg-[var(--primary-color)] text-white' : 'border border-[var(--primary-color)] text-[var(--primary-color)] bg-white'}`}>
            Card View
          </button>
          <button onClick={() => setViewType('table')} className={`px-3 py-2 rounded-2xl transition ${viewType === 'table' ? 'bg-[var(--primary-color)] text-white' : 'border border-[var(--primary-color)] text-[var(--primary-color)] bg-white'}`}>
            Table View
          </button>
        </div>
      </div>

      {/* Main View */}
      <div className="flex-grow overflow-auto max-h-[60vh]">
        {isLoading ? (
          <Skeleton count={viewType === 'card' ? 6 : 5} height={100} />
        ) : currentRooms.length > 0 ? (
          viewType === 'card' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentRooms.map((room) => (
                <div key={room.id} className="card shadow-lg rounded-2xl bg-white p-4 flex flex-col justify-between h-60">
                  <div>
                    <h5 className="text-2xl hotel-color mb-2">{room.roomType}</h5>
                    <p className="room-price mb-4">₹ <strong>{room.roomPrice}</strong> / night</p>
                  </div>
                  <ActionButtons roomId={room.id} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Room #</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRooms.map((room) => (
                    <tr key={room.id}>
                      <td className="px-4 py-2">{room.id}</td>
                      <td className="px-4 py-2">{room.roomType}</td>
                      <td className="px-4 py-2">₹ {room.roomPrice}</td>
                      <td className="px-4 py-2 text-center">
                        <ActionButtons roomId={room.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-center text-gray-600 mt-12">No rooms found matching your criteria.</div>
        )}
      </div>

      {/* Pagination */}
      {viewType === 'table' && !isLoading && (
        <div className="mt-6">
          <RoomPageinator currentPage={currentPage} totalPages={calculateTotalPages()} onPageChange={handlePaginationClick} />
        </div>
      )}

      {/* Confirm Delete Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>Room #{roomToDelete}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <button className="px-4 py-2 rounded-2xl border border-gray-400" onClick={() => setShowConfirmModal(false)}>Cancel</button>
          <button className="px-4 py-2 rounded-2xl bg-[var(--primary-color)] text-white" onClick={handleConfirmDelete}>Delete</button>
        </Modal.Footer>
      </Modal>

      {/* Deleting Overlay Loader */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-full p-6 shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
            <p className="mt-4 text-sm text-gray-700">Deleting room...</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExistingRooms;
