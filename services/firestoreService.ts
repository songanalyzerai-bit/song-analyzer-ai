import { getFirestoreDb } from '../firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy } from 'firebase/firestore';
import type { AnalysisResult } from '../types';

const ANALYSES_COLLECTION = 'analyses';

export const saveAnalysis = async (userId: string, analysis: Omit<AnalysisResult, 'id' | 'createdAt'>): Promise<string> => {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore is not initialized. Cannot save analysis.");
  }

  try {
    const docRef = await addDoc(collection(db, ANALYSES_COLLECTION), {
      ...analysis,
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving analysis to Firestore:", error);
    throw new Error("Could not save your analysis. Please try again.");
  }
};

export const getUserAnalyses = async (userId: string): Promise<AnalysisResult[]> => {
    const db = getFirestoreDb();
    if (!db) {
        console.error("Firestore is not initialized. Cannot fetch analyses.");
        return [];
    }

    try {
        const q = query(
            collection(db, ANALYSES_COLLECTION), 
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const analyses: AnalysisResult[] = [];
        querySnapshot.forEach((doc) => {
            analyses.push({ id: doc.id, ...doc.data() } as AnalysisResult);
        });
        return analyses;
    } catch (error) {
        console.error("Error fetching user analyses:", error);
        throw new Error("Could not fetch your saved analyses.");
    }
}
