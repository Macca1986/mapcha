'use client';

import { useEffect, useState } from "react";
import { getTodayPuzzle, PuzzleData } from "./lib/getTodayPuzzle";

export default function Home() {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);

  useEffect(() => {
    getTodayPuzzle().then(setPuzzle);
  }, []);

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
      <p className="mt-4 text-gray-700">
        Can you guess where this is?
      </p>
    </main>
  );
}
