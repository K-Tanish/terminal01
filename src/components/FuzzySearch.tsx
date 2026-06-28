import React, { useRef } from 'react';

interface Props {
  onSearch: (value: string) => void;
}

export const FuzzySearch = React.memo(function FuzzySearch({ onSearch }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search anything..."
        className="w-full border border-gray-200 bg-gray-50 rounded-xl text-xs py-2.5 pl-4 pr-10 focus:ring-1 focus:ring-black focus:border-black outline-none"
        onChange={(e) => onSearch(e.target.value)}
      />
      <svg
        className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    </div>
  );
});
