'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface LocationAutocompleteProps {
  onLocationSelect: (location: Location) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationAutocomplete({
  onLocationSelect,
  placeholder = 'Enter a location',
  className = '',
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'],
        fields: ['geometry', 'formatted_address'],
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        
        if (!place?.geometry?.location) {
          setError('Please select a location from the dropdown');
          return;
        }

        const location: Location = {
          name: place.formatted_address || '',
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        setError(null);
        onLocationSelect(location);
      });
    } catch (err) {
      console.error('Error initializing autocomplete:', err);
      setError('Failed to initialize location search');
    }
  }, [onLocationSelect]);

  return (
    <div className="relative w-full">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError('Failed to load Google Maps');
          setIsLoading(false);
        }}
      />
      
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={`w-full p-3 border rounded-md ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        disabled={isLoading}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      
      {isLoading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
} 