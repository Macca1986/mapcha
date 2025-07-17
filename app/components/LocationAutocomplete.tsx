'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Location | null>(null);

  useEffect(() => {
    const initializePlaces = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();
        const { Place, Autocomplete } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

        if (!inputRef.current) {
          console.error('Input reference not ready');
          return;
        }

        const autocomplete = new Autocomplete(inputRef.current, {
          types: ['(cities)'],
          fields: ['name', 'geometry.location', 'formatted_address'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          console.log('Place selected:', place);
          
          if (!place.geometry?.location) {
            setError('Please select a location from the dropdown');
            return;
          }

          const location: Location = {
            name: place.formatted_address || place.name || '',
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          console.log('Location data:', location);
          setError(null);
          setSelectedPlace(location);
        });

        console.log('Places API (New) initialized successfully');
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing Places API:', err);
        setError('Failed to initialize location search');
        setIsLoading(false);
      }
    };

    initializePlaces();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlace) {
      onLocationSelect(selectedPlace);
      if (inputRef.current) {
        inputRef.current.value = ''; // Clear input after submission
      }
      setSelectedPlace(null);
    } else {
      setError('Please select a location from the dropdown');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className={`flex-1 p-3 border rounded-md ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={isLoading || !selectedPlace}
          className={`px-6 py-3 rounded-md text-white font-medium
            ${isLoading || !selectedPlace 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          Guess
        </button>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      
      {isLoading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
        </div>
      )}
    </form>
  );
} 