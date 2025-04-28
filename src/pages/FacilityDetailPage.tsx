
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFacilityDetail } from '../services/api';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const FacilityDetailPage: React.FC = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const [facility, setFacility] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchFacilityDetails = async () => {
      if (!facilityId) return;
      
      try {
        setLoading(true);
        const data = await getFacilityDetail(facilityId);
        setFacility(data);
      } catch (error) {
        console.error('Failed to fetch facility details:', error);
        showToast('Failed to load facility details. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityDetails();
  }, [facilityId, showToast]);

  // Helper to render field if it exists
  const renderField = (label: string, value: any) => {
    if (!value) return null;
    
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <p className="mt-1 text-base text-gray-900">{value}</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      {loading ? (
        <LoadingSpinner message="Loading facility details..." />
      ) : !facility ? (
        <EmptyState 
          message="Facility not found" 
          subMessage="The requested facility could not be found"
        />
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{facility.name}</h1>
              <p className="text-lg text-airport-primary mb-6">
                {facility.type} • {facility.airport_name}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {renderField('Location', facility.location)}
                {renderField('Hours', facility.hours)}
              </div>
              
              {facility.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600">{facility.description}</p>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Additional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderField('Contact', facility.contact)}
                  {renderField('Access', facility.access_info)}
                  {renderField('Rates', facility.rates)}
                  {facility.amenities && facility.amenities.length > 0 && (
                    <div className="mb-4 col-span-1 md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Amenities</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {facility.amenities.map((amenity: string, index: number) => (
                          <span 
                            key={index}
                            className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityDetailPage;
