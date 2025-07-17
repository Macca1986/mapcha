// app/lib/getTodayPuzzle.ts
import { db, storage } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

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

    // Get download URLs for all images
    const downloadURLPromises = data.clueImages.map(async (imagePath) => {
      try {
        const imageRef = ref(storage, imagePath);
        return await getDownloadURL(imageRef);
      } catch (error) {
        console.error(`Error getting download URL for ${imagePath}:`, error);
        return null;
      }
    });

    const downloadURLs = await Promise.all(downloadURLPromises);
    
    // Filter out any failed URLs and update the clueImages array
    data.clueImages = downloadURLs.filter((url): url is string => url !== null);

    return data;
  } catch (error) {
    console.error("Error in getTodayPuzzle:", error);
    throw error;
  }
}
