// src/components/CategoryFilter.js
import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
      <div className="category-filter">
        <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">전체</option>
          {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
          ))}
        </select>
      </div>
  );
};

export default CategoryFilter;
