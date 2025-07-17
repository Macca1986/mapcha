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
    <main className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">🌍 Mapcha</h1>
      <div className="relative w-full max-w-2xl aspect-video">
        <Image
          src={puzzle.clueImages[0]}
          alt="Location clue image"
          fill
          className="rounded-xl shadow-md object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          priority
          onError={(e) => {
            console.error("Image failed to load:", e);
          }}
        />
      </div>
      <p className="mt-4 text-gray-700">
        Can you guess where this is?
      </p>
    </main>
  );
}

