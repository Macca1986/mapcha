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
  try {
    const today = new Date();
    const id = today.toISOString().split("T")[0]; // e.g. "2025-07-17"

    const docRef = doc(db, "puzzles", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.data() as PuzzleData;
    return data;
  } catch (error) {
    console.error("Error in getTodayPuzzle:", error);
    throw error;
  }
}
