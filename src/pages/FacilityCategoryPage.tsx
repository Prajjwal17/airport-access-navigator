
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAirportFacilityTypes, getAirports } from '../services/api';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const FacilityCategoryPage: React.FC = () => {
  const { airportId } = useParams<{ airportId: string }>();
  const [facilityTypes, setFacilityTypes] = useState<any[]>([]);
  const [airport, setAirport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!airportId) return;
      
      try {
        setLoading(true);
        
        // Fetch airport details
        const airports = await getAirports();
        const airportDetails = airports.find((a: any) => a.id === airportId);
        setAirport(airportDetails);
        
        if (!airportDetails) {
          throw new Error('Airport not found');
        }
        
        // Fetch facility types for this airport
        const types = await getAirportFacilityTypes(airportId);
        setFacilityTypes(types);
      } catch (error) {
        console.error('Failed to fetch facility categories:', error);
        showToast('Failed to load facility categories. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [airportId, showToast]);

  // Get icon for facility type
  const getFacilityIcon = (type: string): string => {
    const icons: Record<string, string> = {
      'restaurants': '🍽️',
      'shops': '🛍️',
      'lounges': '🛋️',
      'restrooms': '🚻',
      'information': 'ℹ️',
      'gates': '🚪',
      'security': '🔒',
      'parking': '🅿️',
      'baggage': '🧳',
    };
    
    const key = Object.keys(icons).find(k => type.toLowerCase().includes(k.toLowerCase()));
    return key ? icons[key] : '📍';
  };

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      {loading ? (
        <LoadingSpinner message="Loading facilities..." />
      ) : !airport ? (
        <EmptyState 
          message="Airport not found" 
          subMessage="The requested airport could not be found"
        />
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {airport.name} ({airport.code})
            </h1>
            <p className="text-gray-600 mt-2">{airport.city}, {airport.country}</p>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Facility Categories</h2>
          
          {facilityTypes.length === 0 ? (
            <EmptyState 
              message="No facility categories available" 
              subMessage="This airport does not have any facility categories registered"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {facilityTypes.map((type) => (
                <Link
                  to={`/airports/${airportId}/${type.id}`}
                  key={type.id}
                  className="facility-card-hover"
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                    <div className="text-4xl mb-3">{getFacilityIcon(type.name)}</div>
                    <h3 className="text-lg font-medium text-gray-800 mb-1">{type.name}</h3>
                    <p className="text-sm text-gray-500">{type.count} facilities</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FacilityCategoryPage;
