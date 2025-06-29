import React, { useState, useEffect, useRef, useContext } from "react";
import RoomTypeSelector from "../common/RoomTypeSelector";
import { toast } from "react-toastify";
import { updateRoom, getRoomById } from "../utils/ApiFunctions";
import { useParams, Link } from "react-router-dom";
import { RoomContext } from "./RoomProvider";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const EditRoom = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState({
    photo: null,
    roomType: "",
    roomPrice: "",
    removePhoto: false,
  });
  const { roomFromView } = useContext(RoomContext);
  const [imagePreview, setImagePreview] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(false); // true when updating
  const [initialLoading, setInitialLoading] = useState(true); // true when fetching
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRemovePhotoModal, setShowRemovePhotoModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchRoom = async () => {
      setInitialLoading(true);
      try {
        const data = await getRoomById(roomId);
        setRoomData({
          roomType: data.roomType || "",
          roomPrice: data.roomPrice || "",
          photo: null,
          removePhoto: false,
        });
        if (data.photo) {
          setImagePreview(`data:image/jpeg;base64,${data.photo}`);
        } else {
          setImagePreview("");
        }
      } catch (error) {
        toast.error("Failed to load room data: " + error.message);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleRoomInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({
      ...prev,
      [name]: name === "roomPrice" ? value.replace(/[^0-9.]/g, "") : value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage && !roomData.removePhoto) {
      setRoomData((prev) => ({
        ...prev,
        photo: selectedImage,
        removePhoto: false,
      }));
      setImagePreview(URL.createObjectURL(selectedImage));
      setIsZoomed(false);
    }
  };

  const handleRemovePhotoClick = () => setShowRemovePhotoModal(true);

  const confirmRemovePhoto = () => {
    setRoomData((prev) => ({ ...prev, photo: null, removePhoto: true }));
    setImagePreview("");
    setIsZoomed(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowRemovePhotoModal(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!roomData.roomType || !roomData.roomPrice) {
      toast.error("Please fill in all fields.");
      return;
    }
    setShowUpdateModal(true);
  };

  const handleModalConfirm = async () => {
    setShowUpdateModal(false);
    await new Promise((res) => setTimeout(res, 50));
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("roomType", roomData.roomType);
      formData.append("roomPrice", parseFloat(roomData.roomPrice).toFixed(2));
      if (roomData.photo) formData.append("photo", roomData.photo);
      formData.append("removePhoto", roomData.removePhoto ? "true" : "false");

      await updateRoom(roomId, formData);
      toast.success("Room updated successfully!");
    } catch (error) {
      toast.error("Error updating room: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto mt-8 mb-12 px-4 relative">
      {/* Initial Data Loader */}
      {initialLoading && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-10 flex flex-col items-center justify-center">
          <AiOutlineLoading3Quarters className="text-white text-5xl animate-spin" />
          <p className="mt-4 text-white text-sm">Loading Room Data...</p>
        </div>
      )}

      {/* Room Updating Loader */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-10 flex flex-col items-center justify-center">
          <AiOutlineLoading3Quarters className="text-white text-5xl animate-spin" />
          <p className="mt-4 text-white text-sm">Updating Room...</p>
        </div>
      )}

      {/* Image Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-[9999]"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={imagePreview}
            alt="Zoomed Preview"
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

      {/* Main Card */}
      {!initialLoading && (
        <div className="card shadow-lg rounded-2xl bg-white p-6">
          <h2 className="text-2xl font-bold hotel-color mb-6 text-center">
            {roomFromView ? "View Room Details" : "Edit Room"}
          </h2>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col items-center w-full lg:w-1/2">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Room Preview"
                  className="mt-4 rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 shadow-md w-full max-h-[300px] object-cover"
                  onClick={() => setIsZoomed(true)}
                />
              ) : (
                <div className="border rounded-lg flex items-center justify-center text-gray-500 w-full h-[300px]">
                  No Image Selected
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/2">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label htmlFor="roomType" className="block text-gray-800 font-semibold mb-1">
                    Room Type
                  </label>
                  {roomFromView ? (
                    <input
                      id="roomType"
                      name="roomType"
                      value={roomData.roomType}
                      type="text"
                      disabled
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  ) : (
                    <RoomTypeSelector
                      handleRoomInputChange={handleRoomInputChange}
                      newRoom={roomData}
                    />
                  )}
                </div>

                <div>
                  <label htmlFor="roomPrice" className="block text-gray-800 font-semibold mb-1">
                    Room Price
                  </label>
                  <input
                    id="roomPrice"
                    name="roomPrice"
                    value={roomData.roomPrice}
                    onChange={handleRoomInputChange}
                    type="text"
                    disabled={roomFromView}
                    inputMode="decimal"
                    placeholder="Enter price"
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label htmlFor="photo" className="block text-gray-800 font-semibold mb-1">
                    Change Photo
                  </label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    hidden={roomFromView}
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    accept="image/*"
                    disabled={roomData.removePhoto}
                  />
                </div>

                <div className="flex flex-wrap gap-4 justify-end mt-4">
                  <Link
                    to="/existing-rooms"
                    className="px-4 py-2 border border-gray-400 rounded-2xl hover:bg-gray-100 transition w-full sm:w-auto text-center"
                  >
                    ⬅ Back
                  </Link>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition w-full sm:w-auto"
                    onClick={handleRemovePhotoClick}
                    hidden={roomFromView}
                    disabled={loading || !imagePreview}
                  >
                    🗑 Remove Photo
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    hidden={roomFromView}
                    className="btn-hotel px-4 py-2 rounded-2xl shadow hover:shadow-lg transition w-full sm:w-auto"
                  >
                    {loading ? "Updating..." : "💾 Update Room"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h5 className="text-lg font-semibold">Confirm Update</h5>
              <button className="text-gray-600 text-xl" onClick={() => setShowUpdateModal(false)}>
                ✖
              </button>
            </div>
            <div className="p-4 text-gray-800">Are you sure you want to update this room's details?</div>
            <div className="p-4 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-400 rounded-2xl hover:bg-gray-100 transition"
                onClick={() => setShowUpdateModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[var(--accent-green)] text-white rounded-2xl hover:bg-opacity-90 transition"
                onClick={handleModalConfirm}
                disabled={loading}
              >
                {loading ? "Updating..." : "Yes, Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Photo Modal */}
      {showRemovePhotoModal && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h5 className="text-lg font-semibold">Confirm Photo Removal</h5>
              <button
                className="text-gray-600 text-xl"
                onClick={() => setShowRemovePhotoModal(false)}
              >
                ✖
              </button>
            </div>
            <div className="p-4 text-gray-800">
              Are you sure you want to remove the current photo? You can upload a new one after this.
            </div>
            <div className="p-4 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-400 rounded-2xl hover:bg-gray-100 transition"
                onClick={() => setShowRemovePhotoModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition"
                onClick={confirmRemovePhoto}
              >
                Yes, Remove Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EditRoom;
