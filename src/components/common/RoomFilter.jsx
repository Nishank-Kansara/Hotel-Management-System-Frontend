import React, { useState } from 'react';

const RoomFilter = ({ roomTypes, setSelectedRoomType }) => {
  const [filter, setFilter] = useState('');

  const handleChange = (e) => {
    setFilter(e.target.value);
    setSelectedRoomType(e.target.value);
  };

  const clearFilter = () => {
    setFilter('');
    setSelectedRoomType('');
  };

  return (
    <div className='d-flex flex-column gap-2'>
      <label className='form-label fw-semibold text-secondary'>
        <i className='bi bi-funnel-fill me-2 text-primary'></i> Filter by Room Type
      </label>
      <div className='input-group'>
        <select className='form-select' value={filter} onChange={handleChange}>
          <option value=''>All Room Types</option>
          {roomTypes.map((type, idx) => (
            <option key={idx} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          className='btn btn-outline-secondary'
          onClick={clearFilter}
          title='Clear Filter'
        >
          <i className='bi bi-x-circle'> Clear</i>
        </button>
      </div>
    </div>
  );
};

export default RoomFilter;
