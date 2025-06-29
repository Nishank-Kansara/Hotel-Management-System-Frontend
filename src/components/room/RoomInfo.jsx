import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomById } from '../utils/ApiFunctions';
import { toast } from 'react-toastify';
import { FaWifi, FaUtensils, FaTv, FaSnowflake, FaWater } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const RoomInfo = () => {
  const { roomId, checkIn, checkOut } = useParams();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await getRoomById(roomId);
        setRoomData(data);

        if (data.photo) {
          setImagePreview(`data:image/jpeg;base64,${data.photo}`);
        }
      } catch (error) {
        toast.error('Failed to load room data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleBookingRedirect = () => {
    navigate(`/book-room/${roomId}/${checkIn}/${checkOut}`);
  };

  return (
    <div className="relative">
      {/* Fullscreen Loader */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AiOutlineLoading3Quarters
            size={48}
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

      {!loading && roomData && (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Room Details</h2>

          <div className="space-y-4">
            <div>
              <strong>Room Type:</strong> <span>{roomData.roomType}</span>
            </div>

            <div>
              <strong>Room Price:</strong> ₹{roomData.roomPrice}
            </div>

            <div>
              <strong>Amenities:</strong>
              <ul className="list-none mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <FaWifi className="text-blue-500" /> Free Wi-Fi
                </li>
                <li className="flex items-center gap-2">
                  <FaSnowflake className="text-cyan-500" /> Air Conditioning
                </li>
                <li className="flex items-center gap-2">
                  <FaTv className="text-purple-500" /> 42" Smart TV
                </li>
                <li className="flex items-center gap-2">
                  <FaUtensils className="text-green-600" /> Complimentary Breakfast
                </li>
                <li className="flex items-center gap-2">
                  <FaWater className="text-blue-400" /> Lake View Balcony
                </li>
              </ul>
            </div>

            {imagePreview && (
              <div>
                <strong>Photo:</strong>
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Room"
                    className="h-64 w-full object-cover cursor-pointer rounded-lg"
                    onClick={() => setIsZoomed(true)}
                  />
                </div>
              </div>
            )}

            <div className="text-center mt-6">
              <button
                onClick={handleBookingRedirect}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
              >
                Book Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zoomed Image Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={imagePreview}
            alt="Zoomed"
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold"
            onClick={() => setIsZoomed(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomInfo;
