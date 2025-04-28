
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAirports } from '../services/api';
import { useToast } from '../components/Toast';
import SearchInput from '../components/SearchInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';

const ITEMS_PER_PAGE = 6;

const AirportListPage: React.FC = () => {
  const [airports, setAirports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        setLoading(true);
        const data = await getAirports();
        setAirports(data);
      } catch (error) {
        console.error('Failed to fetch airports:', error);
        showToast('Failed to load airports. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAirports();
  }, [showToast]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter airports by name
  const filteredAirports = useMemo(() => {
    if (!searchTerm) return airports;
    
    const term = searchTerm.toLowerCase();
    return airports.filter(airport => 
      airport.name.toLowerCase().includes(term) || 
      airport.code.toLowerCase().includes(term)
    );
  }, [airports, searchTerm]);

  // Paginate airports
  const paginatedAirports = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAirports.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAirports, currentPage]);

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Airports</h1>
      
      <div className="mb-8">
        <SearchInput 
          onSearch={setSearchTerm} 
          placeholder="Search airports by name or code..." 
        />
      </div>
      
      {loading ? (
        <LoadingSpinner message="Loading airports..." />
      ) : filteredAirports.length === 0 ? (
        <EmptyState 
          message="No airports found" 
          subMessage="Try adjusting your search criteria"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAirports.map((airport) => (
              <Link 
                to={`/airports/${airport.id}`} 
                key={airport.id}
                className="block airport-card-hover"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-airport-primary/10 text-airport-primary font-semibold px-3 py-1 rounded-full text-sm">
                        {airport.code}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{airport.name}</h2>
                    <p className="text-gray-600">{airport.city}, {airport.country}</p>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {airport.terminals} Terminals
                      </div>
                      <span className="text-airport-primary text-sm font-medium">
                        View Facilities →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <Pagination 
            currentPage={currentPage}
            totalItems={filteredAirports.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default AirportListPage;
