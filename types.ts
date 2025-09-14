export interface AnalysisCategory {
  score: number;
  feedback: string;
}

export interface ArtistComparison {
  artist: string;
  reason: string;
}

export interface SuggestedGenre {
  name: string;
  reason: string;
}

export interface AnalysisResult {
  id?: string; // Optional: will be added when saved to DB
  title: string;
  createdAt?: any; // Firebase ServerTimestamp
  creativity: AnalysisCategory;
  emotionalImpact: AnalysisCategory;
  lyricism: AnalysisCategory;
  craftsmanship: AnalysisCategory;
  audienceAppeal: AnalysisCategory;
  commercialPotential: AnalysisCategory; // New category
  overallScore: number;
  firstImpression: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  artistComparisons: ArtistComparison[];
  suggestedGenres: SuggestedGenre[];
  finalVerdict: string;
}