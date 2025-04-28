
import axios from 'axios';

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple in-memory cache
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper to get from cache or fetch
const getWithCache = async <T>(url: string): Promise<T> => {
  const now = Date.now();
  const cachedItem = cache[url];
  
  if (cachedItem && now - cachedItem.timestamp < CACHE_DURATION) {
    return cachedItem.data as T;
  }

  const response = await api.get<T>(url);
  cache[url] = { data: response.data, timestamp: now };
  return response.data;
};

// API methods
export const getAirports = () => getWithCache<any[]>('/airports');

export const getAirportFacilityTypes = (airportId: string) => 
  getWithCache<any[]>(`/airports/${airportId}/facility-types`);

export const getAirportFacilities = (airportId: string, typeId: string) => 
  getWithCache<any[]>(`/airports/${airportId}/facilities?type=${typeId}`);

export const getFacilityDetail = (facilityId: string) => 
  getWithCache<any>(`/facilities/${facilityId}`);

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
