import React, { useState, useEffect } from 'react';

function SearchFilterBar({
  searchValue,
  onSearchChange,
  priorityValue,
  onPriorityChange,
  onClear,
  isSearching = false,
}) {
  const [localSearch, setLocalSearch] = useState(searchValue);

  // Sync internal search input when searchValue prop changes externally
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  // Debounce calling onSearchChange (400ms delay)
  useEffect(() => {
    if (localSearch === searchValue) return;

    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 400);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchValue]);

  const hasActiveFilters = Boolean(
    (searchValue && searchValue.trim() !== '') || (priorityValue && priorityValue !== '')
  );

  return (
    <div className="search-filter-bar">
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">&#9906;</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        {isSearching && <span className="inline-spinner" title="Searching..." />}
      </div>

      <div className="filter-select-wrapper">
        <select
          className="priority-filter-select"
          value={priorityValue}
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          className="btn-clear-filters"
          onClick={onClear}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export default SearchFilterBar;
