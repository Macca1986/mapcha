'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { getTodayPuzzle, PuzzleData } from "./lib/getTodayPuzzle";

export default function Home() {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🌍 Mapcha</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-center">
            <Image
              src={puzzle.clueImages[0]}
              alt="Location clue image"
              width={600}
              height={450}
              className="rounded-lg"
              priority
              onError={(e) => {
                console.error("Image failed to load:", e);
              }}
            />
          </div>
          
          <p className="mt-6 text-lg text-gray-700 text-center">
            Can you guess where this is?
          </p>
        </div>
      </div>
    </main>
  );
}

