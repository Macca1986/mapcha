// app/lib/getTodayPuzzle.ts
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export interface PuzzleData {
  clueImages: string[];
  location: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  hints: string[];
}

export async function getTodayPuzzle(): Promise<PuzzleData | null> {
  const today = new Date();
  const id = today.toISOString().split("T")[0]; // e.g. "2025-07-17"

  const ref = doc(db, "puzzles", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return snapshot.data() as PuzzleData;
}
