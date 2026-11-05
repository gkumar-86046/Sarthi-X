import React from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

const categories = [
  'All Games',
  'Recommended',
  'Mathematics',
  'Logical Reasoning',
  'Aptitude',
  'Memory',
  'Problem Solving'
];

const GameFilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="gz-filter-bar glass">
      {/* Search Input */}
      <div className="gz-search-wrapper">
        <Search size={18} className="gz-search-icon" />
        <input
          type="text"
          placeholder="Search authorized games or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="gz-search-input"
        />
      </div>

      {/* Category Skill Filter Pills */}
      <div className="gz-pills-row">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div className="gz-sort-wrapper">
        <SlidersHorizontal size={16} className="sort-icon" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="recommended">Sort by Recommended</option>
          <option value="progress">Sort by Progress</option>
          <option value="duration">Sort by Duration</option>
        </select>
        <ChevronDown size={14} className="sort-arrow" />
      </div>
    </div>
  );
};

export default GameFilterBar;
