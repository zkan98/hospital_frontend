// src/components/Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
            <button
                key={index + 1}
                onClick={() => onPageChange(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
        ))}
      </div>
  );
};

export default Pagination;
