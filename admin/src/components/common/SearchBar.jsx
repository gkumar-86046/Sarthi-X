/**
 * admin/src/components/common/SearchBar.jsx
 */

import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search...', width = '320px' }) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: width,
        maxWidth: '100%',
      }}
    >
      <Search
        size={17}
        style={{
          position: 'absolute',
          left: '12px',
          color: 'var(--text-dim)',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field"
        style={{
          paddingLeft: '38px',
          paddingRight: value ? '34px' : '14px',
          fontSize: '0.88rem',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '10px',
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
          }}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

