'use client';

import { useState } from 'react';
import { getDistance } from 'geolib';

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
  const [guess, setGuess] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TEMP: hardcoded guess locations until we add autocomplete
    const fakeGuessLocation = {
      lat: 48.8566, // Paris
      lng: 2.3522,
    };

    const distance = getDistance(
      { latitude: fakeGuessLocation.lat, longitude: fakeGuessLocation.lng },
      { latitude: correctLocation.lat, longitude: correctLocation.lng }
    );

    const distanceKm = Math.round(distance / 1000);

    // TEMP logic — in real version, you'd get lat/lng from actual autocomplete
    const isCorrect = distanceKm < 100; // e.g., within 100km is a win

    if (isCorrect) {
      onCorrectGuess();
    } else {
      onWrongGuess(distanceKm, guess);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 w-full max-w-sm">
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter city or country"
        className="w-full p-3 border border-gray-300 rounded-md"
      />
      <button
        type="submit"
        className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Guess
      </button>
    </form>
  );
}
