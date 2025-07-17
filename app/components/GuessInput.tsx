'use client';

import { useState } from 'react';
import { getDistance } from 'geolib';
import LocationAutocomplete from './LocationAutocomplete';

interface GuessInputProps {
  correctLocation: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  onCorrectGuess: () => void;
  onWrongGuess: (distance: number, guessName: string) => void;
}

export default function GuessInput({ correctLocation, onCorrectGuess, onWrongGuess }: GuessInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationSelect = async (location: { name: string; lat: number; lng: number }) => {
    setIsSubmitting(true);

    try {
      const distance = getDistance(
        { latitude: location.lat, longitude: location.lng },
        { latitude: correctLocation.lat, longitude: correctLocation.lng }
      );

      const distanceKm = Math.round(distance / 1000);
      const isCorrect = location.name.toLowerCase().includes(correctLocation.city.toLowerCase()) ||
                       distanceKm < 10; // Within 10km is considered correct

      if (isCorrect) {
        onCorrectGuess();
      } else {
        onWrongGuess(distanceKm, location.name);
      }
    } catch (error) {
      console.error('Error calculating distance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 w-full max-w-sm">
      <LocationAutocomplete
        onLocationSelect={handleLocationSelect}
        placeholder="Enter city or country"
      />
      
      {isSubmitting && (
        <p className="mt-2 text-sm text-gray-600">Calculating distance...</p>
      )}
    </div>
  );
}
