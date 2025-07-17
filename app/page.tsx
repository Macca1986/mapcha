'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { getTodayPuzzle, PuzzleData } from "./lib/getTodayPuzzle";
import GuessInput from './components/GuessInput';

export default function Home() {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [guesses, setGuesses] = useState<{ name: string; distance: number }[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCorrectGuess = () => {
    setIsCorrect(true);
  };

  const handleWrongGuess = (distance: number, guessName: string) => {
    setGuesses((prev) => [...prev, { name: guessName, distance }]);
  };

  useEffect(() => {
    getTodayPuzzle()
      .then((data) => {
        if (!data) {
          setError("Puzzle not found for today");
          return;
        }
        console.log("Puzzle data:", data);
        console.log("Image URL:", data.clueImages[0]);
        setPuzzle(data);
      })
      .catch((err) => {
        console.error("Error fetching puzzle:", err);
        setError("Failed to load puzzle");
      });
  }, []);

  if (error) {
    return <p className="text-red-500 mt-10 text-center">{error}</p>;
  }

  if (!puzzle) {
    return <p className="text-center mt-10 text-gray-600">Loading today&apos;s puzzle...</p>;
  }

  return (
    <main className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">🌍 Mapcha</h1>
      <img
        src={puzzle.clueImages[0]}
        alt="Clue"
        className="max-w-full rounded-xl shadow-md"
      />

      <GuessInput
        correctLocation={puzzle.location}
        onCorrectGuess={handleCorrectGuess}
        onWrongGuess={handleWrongGuess}
      />

      {isCorrect ? (
        <p className="mt-4 text-green-600 font-bold">🎉 You got it!</p>
      ) : (
        guesses.map((g, i) => (
          <p key={i} className="text-sm text-gray-600">
            ❌ {g.name} — {g.distance} km away
          </p>
        ))
      )}
    </main>
  );
}

