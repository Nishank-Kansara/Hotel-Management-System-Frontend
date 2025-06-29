import React, { useRef, useState } from 'react';
import { addRoom } from '../utils/ApiFunctions';
import RoomTypeSelector from '../common/RoomTypeSelector';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const AddRoom = () => {
  const [newRoom, setNewRoom] = useState({
    photo: null,
    roomType: "",
    roomPrice: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleRoomInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({
      ...newRoom,
      [name]: name === "roomPrice" ? value.replace(/\D/g, "") : value,
    });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setNewRoom({ ...newRoom, photo: selectedImage });
      setImagePreview(URL.createObjectURL(selectedImage));
      setIsZoomed(false);
    }
  };

  const handleRemovePhoto = () => {
    setNewRoom({ ...newRoom, photo: null });
    setImagePreview("");
    setIsZoomed(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { roomType, roomPrice } = newRoom;
    if (!roomType || !roomPrice) {
      toast.error("Please fill in all fields.");
      return;
    }
    setShowConfirmation(true);
  };

  const confirmAddRoom = async () => {
    const { photo, roomType, roomPrice } = newRoom;
    setIsLoading(true);
    try {
      const response = await addRoom(photo, roomType, roomPrice);
      if (response !== undefined) {
        toast.success("Room added successfully!");
        setNewRoom({ photo: null, roomType: "", roomPrice: "" });
        setImagePreview("");
        setIsZoomed(false);
        setShowConfirmation(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error("Failed to add room. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto mt-8 mb-12 px-4 relative">
      {/* 🔄 Fullscreen Loader */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
          <AiOutlineLoading3Quarters
            size={48}
            className="text-white animate-spin"
          />
          <style>{`
            .animate-spin {
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      <div className="card shadow-lg rounded-2xl bg-white p-6">
        <h2 className="text-2xl font-bold hotel-color mb-6 text-center">
          Add a New Room
        </h2>

        <form
          onSubmit={handleFormSubmit}
          className="space-y-6 max-h-[60vh] overflow-auto"
        >
          <div>
            <label htmlFor="roomType" className="block text-gray-800 font-semibold mb-1">
              Room Type
            </label>
            <RoomTypeSelector
              handleRoomInputChange={handleRoomInputChange}
              newRoom={newRoom}
            />
          </div>

          <div>
            <label htmlFor="roomPrice" className="block text-gray-800 font-semibold mb-1">
              Room Price
            </label>
            <input
              id="roomPrice"
              name="roomPrice"
              value={newRoom.roomPrice}
              onChange={handleRoomInputChange}
              type="text"
              inputMode="decimal"
              pattern="^\\d*\\.?\\d*$"
              placeholder="Enter price"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
          </div>

          <div>
            <label htmlFor="photo" className="block text-gray-800 font-semibold mb-1">
              Room Photo
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              className="w-full border border-gray-300 rounded-lg p-2"
              onChange={handleImageChange}
              ref={fileInputRef}
            />

            {imagePreview && (
              <>
                {isZoomed && (
                  <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
                    onClick={() => setIsZoomed(false)}
                  >
                    <img
                      src={imagePreview}
                      alt="Zoomed"
                      className="max-h-[90vh] max-w-[90vw] object-contain shadow-xl rounded-2xl"
                    />
                    <button
                      className="absolute top-5 right-5 text-white text-3xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomed(false);
                      }}
                    >
                      ✖
                    </button>
                  </div>
                )}

                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 shadow-md"
                  style={{ maxHeight: "300px" }}
                  onClick={() => setIsZoomed(true)}
                />
              </>
            )}
          </div>
        </form>

        <div className="flex flex-wrap gap-4 mt-8">
          <Link
            to="/existing-rooms"
            className="px-4 py-2 border border-gray-400 rounded-2xl hover:bg-gray-100 transition w-full sm:w-auto text-center"
          >
            ⬅ Back
          </Link>
          <button
            type="submit"
            onClick={handleFormSubmit}
            className="btn-hotel px-4 py-2 rounded-2xl shadow hover:shadow-lg transition w-full sm:w-auto"
          >
            💾 Save Room
          </button>
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition w-full sm:w-auto"
          >
            🗑 Remove Photo
          </button>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h5 className="text-lg font-semibold">Confirm Room Addition</h5>
              <button
                className="text-gray-600 text-xl"
                onClick={() => setShowConfirmation(false)}
              >
                ✖
              </button>
            </div>
            <div className="p-4 text-gray-800">
              Are you sure you want to add this room?
            </div>
            <div className="p-4 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-400 rounded-2xl hover:bg-gray-100 transition"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[var(--accent-green)] text-white rounded-2xl hover:bg-opacity-90 transition"
                onClick={confirmAddRoom}
              >
                Yes, Add Room
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AddRoom;
