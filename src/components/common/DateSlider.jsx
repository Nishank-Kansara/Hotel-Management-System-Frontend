import React, { useState } from 'react';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from 'react-date-range';

const DateSlider = ({ onDateChange, onFilterChange }) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const handleSelect = (range) => {
    const { startDate, endDate } = range.selection;
    setDateRange(range.selection);
    onDateChange(startDate, endDate);
    onFilterChange(startDate, endDate);
  };

  const handleClearFilter = () => {
    const clearedRange = {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    };
    setDateRange(clearedRange);
    onDateChange(null, null);
    onFilterChange(null, null);
  };

  return (
    <div className="mb-4 p-3 border rounded shadow-sm bg-light">
      <h5 className="mb-3">📅 Filter bookings by date</h5>
      <div className="d-flex flex-wrap justify-content-between">
        <div className="flex-grow-1 me-3">
          <DateRangePicker
            ranges={[dateRange]}
            onChange={handleSelect}
            className="w-100"
          />
        </div>
        <div className="align-self-center mt-3 mt-md-0">
          <button className="btn btn-outline-secondary" onClick={handleClearFilter}>
            Clear Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateSlider;
