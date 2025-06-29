import React from 'react';

const Sort = ({ sortOrder, setSortOrder }) => {
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div className="d-flex flex-column gap-2">
      <label className="form-label fw-semibold text-secondary">
        <i className="bi bi-arrow-down-up me-2 text-primary"></i>
        Sort by Price
      </label>
      <select
        className="form-select shadow-sm"
        value={sortOrder}
        onChange={handleSortChange}
      >
        <option value="">Default</option>
        <option value="lowToHigh">Low to High</option>
        <option value="highToLow">High to Low</option>
      </select>
    </div>
  );
};

export default Sort;
