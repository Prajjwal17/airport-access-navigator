
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  onSearch, 
  placeholder = 'Search...' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search to avoid excessive filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch]);
  
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-airport-primary focus:border-transparent"
        placeholder={placeholder}
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <span className="text-xl">×</span>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
