// RoomProvider.jsx
import React, { createContext, useState } from 'react';

export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [roomFromView, setRoomFromView] = useState(false);
  const [roomFromEdit, setRoomFromEdit] = useState(false);

  return (
    <RoomContext.Provider
      value={{
        roomFromView,
        setRoomFromView,
        roomFromEdit,
        setRoomFromEdit
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
