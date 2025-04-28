import axios from 'axios';

// Mock data for development when API is unavailable
const MOCK_DATA = {
  airports: [
    { id: '1', name: 'Indira Gandhi International Airport', code: 'DEL', city: 'New Delhi', country: 'India', terminals: 3 },
    { id: '2', name: 'Chhatrapati Shivaji International', code: 'BOM', city: 'Mumbai', country: 'India', terminals: 2 },
    { id: '3', name: 'Kempegowda International', code: 'BLR', city: 'Bangalore', country: 'India', terminals: 2 },
    { id: '4', name: 'Chennai International Airport', code: 'MAA', city: 'Chennai', country: 'India', terminals: 2 },
    { id: '5', name: 'Rajiv Gandhi International', code: 'HYD', city: 'Hyderabad', country: 'India', terminals: 1 },
    { id: '6', name: 'Netaji Subhas Chandra Bose International', code: 'CCU', city: 'Kolkata', country: 'India', terminals: 2 },
    { id: '7', name: 'Cochin International Airport', code: 'COK', city: 'Kochi', country: 'India', terminals: 1 },
    { id: '8', name: 'Sardar Vallabhbhai Patel International', code: 'AMD', city: 'Ahmedabad', country: 'India', terminals: 2 },
  ],
  facilityTypes: [
    { id: 'rest', name: 'Restaurants', icon: '🍽️', count: 12 },
    { id: 'shop', name: 'Shops', icon: '🛍️', count: 24 },
    { id: 'lounge', name: 'Lounges', icon: '🛋️', count: 6 },
    { id: 'service', name: 'Services', icon: '🧳', count: 15 },
  ],
  facilities: {
    rest: [
      { id: 'r1', name: 'Sky Café', location: 'Terminal 1, Gate A', description: 'Coffee shop with light snacks', type: 'rest' },
      { id: 'r2', name: 'Global Grill', location: 'Terminal 2, Food Court', description: 'International cuisine', type: 'rest' },
      { id: 'r3', name: 'Pasta Paradise', location: 'Terminal 1, Gate C', description: 'Italian restaurant', type: 'rest' },
    ],
    shop: [
      { id: 's1', name: 'Duty Free', location: 'Terminal 1, Main Hall', description: 'Tax-free shopping', type: 'shop' },
      { id: 's2', name: 'Travel Essentials', location: 'Terminal 2, Gate B', description: 'Travel accessories and necessities', type: 'shop' },
    ],
    lounge: [
      { id: 'l1', name: 'Business Lounge', location: 'Terminal 1, Upper Level', description: 'Quiet workspace with refreshments', type: 'lounge' },
    ],
    service: [
      { id: 'sv1', name: 'Currency Exchange', location: 'Terminal 1, Arrivals', description: 'Foreign currency exchange service', type: 'service' },
    ],
  },
  facilityDetails: {
    'r1': { 
      id: 'r1',
      name: 'Sky Café', 
      location: 'Terminal 1, Gate A', 
      description: 'Cozy coffee shop offering premium coffee, pastries, and light sandwiches. Perfect for a quick bite before your flight.',
      hours: '5:00 AM - 11:00 PM',
      type: 'rest',
      contact: '+1 555-123-4567',
      priceRange: '$$',
      menu: ['Espresso', 'Cappuccino', 'Croissant', 'Chicken Sandwich', 'Fruit Cup']
    },
    'r2': { 
      id: 'r2',
      name: 'Global Grill', 
      location: 'Terminal 2, Food Court', 
      description: 'Restaurant featuring cuisines from around the world. Sit-down dining with table service.',
      hours: '6:00 AM - 10:00 PM',
      type: 'rest',
      contact: '+1 555-234-5678',
      priceRange: '$$$',
      menu: ['Burger', 'Pasta', 'Stir Fry', 'Salads', 'Smoothies']
    },
    's1': { 
      id: 's1',
      name: 'Duty Free', 
      location: 'Terminal 1, Main Hall', 
      description: 'Tax-free shopping featuring luxury brands, perfumes, spirits, and more.',
      hours: '24 hours',
      type: 'shop',
      contact: '+1 555-345-6789',
      brands: ['Chanel', 'Dior', 'Johnnie Walker', 'Godiva']
    },
  }
};

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

// Flag to determine if we should use mock data
const useMockData = true; // Set this to false when your real API is available

// Helper to get from cache or fetch
const getWithCache = async <T>(url: string, mockData: T): Promise<T> => {
  // If we're using mock data, return it immediately
  if (useMockData) {
    console.log(`Using mock data for ${url}`);
    return mockData as T;
  }
  
  const now = Date.now();
  const cachedItem = cache[url];
  
  if (cachedItem && now - cachedItem.timestamp < CACHE_DURATION) {
    return cachedItem.data as T;
  }

  try {
    const response = await api.get<T>(url);
    cache[url] = { data: response.data, timestamp: now };
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

// API methods
export const getAirports = () => getWithCache<any[]>('/airports', MOCK_DATA.airports);

export const getAirportFacilityTypes = (airportId: string) => 
  getWithCache<any[]>(`/airports/${airportId}/facility-types`, MOCK_DATA.facilityTypes);

export const getAirportFacilities = (airportId: string, typeId: string) => 
  getWithCache<any[]>(`/airports/${airportId}/facilities?type=${typeId}`, MOCK_DATA.facilities[typeId as keyof typeof MOCK_DATA.facilities] || []);

export const getFacilityDetail = (facilityId: string) => 
  getWithCache<any>(`/facilities/${facilityId}`, MOCK_DATA.facilityDetails[facilityId as keyof typeof MOCK_DATA.facilityDetails] || null);

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
