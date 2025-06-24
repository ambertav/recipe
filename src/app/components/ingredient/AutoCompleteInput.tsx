'use client';

import { useState } from 'react';

interface AutoCompleteProps {
    suggestions: string[];
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

export default function AutoCompleteInput ({ suggestions, placeholder, value, onChange} : AutoCompleteProps) {
    const [focused, setFocused] = useState(false);
    const filtered = suggestions.filter((s) => s.toLowerCase().startsWith(value.toLowerCase()));

 return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 100)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {focused && filtered.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto text-sm">
          {filtered.map((s, i) => (
            <li
              key={i}
              onMouseDown={() => onChange(s)}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};