
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAirportFacilities, getAirportFacilityTypes, getAirports } from '../services/api';
import { useToast } from '../components/Toast';
import SearchInput from '../components/SearchInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';

const ITEMS_PER_PAGE = 6;

const FacilityListPage: React.FC = () => {
  const { airportId, typeId } = useParams<{ airportId: string; typeId: string }>();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [airport, setAirport] = useState<any>(null);
  const [facilityType, setFacilityType] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!airportId || !typeId) return;
      
      try {
        setLoading(true);
        
        // Fetch airport details
        const airports = await getAirports();
        const airportDetails = airports.find((a: any) => a.id === airportId);
        setAirport(airportDetails);
        
        if (!airportDetails) {
          throw new Error('Airport not found');
        }
        
        // Fetch facility type details
        const types = await getAirportFacilityTypes(airportId);
        const typeDetails = types.find((t: any) => t.id === typeId);
        setFacilityType(typeDetails);
        
        if (!typeDetails) {
          throw new Error('Facility type not found');
        }
        
        // Fetch facilities of this type
        const facilitiesData = await getAirportFacilities(airportId, typeId);
        setFacilities(facilitiesData);
      } catch (error) {
        console.error('Failed to fetch facilities:', error);
        showToast('Failed to load facilities. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [airportId, typeId, showToast]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter facilities by name
  const filteredFacilities = useMemo(() => {
    if (!searchTerm) return facilities;
    
    const term = searchTerm.toLowerCase();
    return facilities.filter(facility => 
      facility.name.toLowerCase().includes(term) || 
      facility.location?.toLowerCase().includes(term)
    );
  }, [facilities, searchTerm]);

  // Paginate facilities
  const paginatedFacilities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFacilities.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFacilities, currentPage]);

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      {loading ? (
        <LoadingSpinner message="Loading facilities..." />
      ) : !airport || !facilityType ? (
        <EmptyState 
          message="Information not found" 
          subMessage="The requested airport or facility type could not be found"
        />
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {facilityType.name} at {airport.name}
            </h1>
            <p className="text-gray-600 mt-2">{airport.city}, {airport.country}</p>
          </div>
          
          <div className="mb-8">
            <SearchInput 
              onSearch={setSearchTerm} 
              placeholder={`Search ${facilityType.name.toLowerCase()}...`} 
            />
          </div>
          
          {filteredFacilities.length === 0 ? (
            <EmptyState 
              message="No facilities found" 
              subMessage={searchTerm ? "Try adjusting your search criteria" : "There are no facilities in this category"}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedFacilities.map((facility) => (
                  <Link 
                    to={`/facilities/${facility.id}`} 
                    key={facility.id}
                    className="block facility-card-hover"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{facility.name}</h2>
                        
                        {facility.location && (
                          <p className="text-gray-600 mb-3">
                            <span className="font-medium">Location:</span> {facility.location}
                          </p>
                        )}
                        
                        {facility.hours && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Hours:</span> {facility.hours}
                          </p>
                        )}
                        
                        <div className="mt-4 flex justify-end">
                          <span className="text-airport-primary text-sm font-medium">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <Pagination 
                currentPage={currentPage}
                totalItems={filteredFacilities.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FacilityListPage;
