import React, { useEffect, useState } from 'react';
import { getRoomTypes } from '../utils/ApiFunctions.js';

const RoomTypeSelector = ({ handleRoomInputChange, newRoom }) => {
    const [roomType, setRoomType] = useState([]);
    const [showRoomTypeInput, setShowRoomTypeInput] = useState(false);
    const [newRoomType, setNewRoomType] = useState("");

    useEffect(() => {
        getRoomTypes().then((data) => {
            console.log("Fetched Room Types: ", data); // Debugging
            setRoomType(data || []);
        });
    }, []);

    const handleNewRoomTypeChange = (e) => {
        setNewRoomType(e.target.value);
    };

    const handleAddNewRoomType = () => {
        if (newRoomType.trim() !== "") {
            setRoomType(prev => [...prev, newRoomType]);
            handleRoomInputChange({ target: { name: "roomType", value: newRoomType } });
            setNewRoomType("");
            setShowRoomTypeInput(false);
        }
    };

    return (
        <div>
            <select
                id="roomType"
                name="roomType"
                value={newRoom.roomType}
                className="form-select mb-2 "
                onChange={(e) => {
                    if (e.target.value === "Add New") {
                        setShowRoomTypeInput(true);
                    } else {
                        handleRoomInputChange(e);
                        setShowRoomTypeInput(false);
                    }
                }}
            >
                <option value="">Select a room type</option>
                <option value="Add New">Add New Room</option>
                {roomType.length === 0 ? (
                    <option disabled>No room types available</option>
                ) : (
                    roomType.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))
                )}
            </select>

            {showRoomTypeInput && (
                <div className="input-group">
                    <input
                        className="form-control"
                        type="text"
                        name="newRoomType"
                        value={newRoomType}
                        onChange={handleNewRoomTypeChange}
                        placeholder="Enter new room type"
                    />
                    <button
                        onClick={handleAddNewRoomType}
                        type="button"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition duration-200 ease-in-out hover:scale-105 active:scale-95"
                    >
                        Add
                    </button>

                </div>
            )}
        </div>
    );
};

export default RoomTypeSelector;
