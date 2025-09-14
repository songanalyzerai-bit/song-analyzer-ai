import type { AnalysisResult } from './types';

export const exampleAnalysis: AnalysisResult = {
  id: 'example-001',
  title: "Echoes in the Rain",
  createdAt: { toDate: () => new Date() } as any, // Mock Firebase Timestamp
  creativity: {
    score: 8.5,
    feedback: "The central metaphor of 'echoes in the rain' is compelling and original, creating a strong, moody atmosphere. The imagery used is vivid and consistently supports the song's theme of lingering memories."
  },
  emotionalImpact: {
    score: 9.0,
    feedback: "The song excels at creating a poignant sense of nostalgia and loss. The listener can genuinely feel the weight of the past, particularly in the chorus and bridge, which are emotionally resonant."
  },
  lyricism: {
    score: 8.2,
    feedback: "The lyricism is strong, with good use of alliteration and assonance. The rhyme scheme is effective without feeling forced. Some phrases are exceptionally poetic, though a few lines in the second verse are slightly clichéd."
  },
  craftsmanship: {
    score: 7.8,
    feedback: "The song follows a classic verse-chorus structure that is well-executed and easy to follow. The transition into the bridge is particularly smooth and builds tension effectively before the final chorus."
  },
  audienceAppeal: {
    score: 8.0,
    feedback: "The themes of love and memory are universally relatable, giving the song broad appeal. It would likely resonate well with fans of indie pop, folk, and singer-songwriter genres."
  },
  commercialPotential: {
    score: 7.5,
    feedback: "The song has a memorable chorus and a strong emotional core, which gives it commercial potential. It would be well-suited for placement in a film or TV show's emotional scene to enhance its reach."
  },
  overallScore: 8.2,
  firstImpression: "A beautifully melancholic and atmospheric track that uses a powerful central metaphor to explore themes of memory and loss.",
  strengths: [
    "Powerful and original central metaphor.",
    "Strong emotional resonance and atmosphere.",
    "Memorable and well-structured chorus."
  ],
  weaknesses: [
    "Some lyrical clichés in the second verse.",
    "The melody, as described, might feel slightly repetitive without a dynamic arrangement.",
    "Could benefit from a more impactful and surprising bridge."
  ],
  suggestions: [
    "Revisit the second verse to replace phrases like 'ghost of a smile' with more unique imagery.",
    "Consider adding a dynamic instrumental swell or a change in rhythm during the bridge to build more tension.",
    "Experiment with a slightly more varied vocal delivery between the verses and chorus to enhance the emotional arc."
  ],
  artistComparisons: [
    { artist: "Bon Iver", reason: "For its atmospheric production and emotionally raw, poetic lyrics." },
    { artist: "The National", reason: "Shares a similar melancholic tone and explores complex emotional landscapes." },
    { artist: "Phoebe Bridgers", reason: "Due to the intimate storytelling and poignant, specific lyrical details." }
  ],
  suggestedGenres: [
    { name: "Indie Folk", reason: "The song's lyrical depth and atmospheric quality fit well within this genre." },
    { name: "Singer-Songwriter", reason: "The personal and introspective nature of the lyrics is a hallmark of this genre." },
    { name: "Ambient Pop", reason: "With the right production, the song could lean into a more atmospheric, pop-oriented sound." }
  ],
  finalVerdict: "Overall, 'Echoes in the Rain' is a powerful and well-crafted song with significant artistic merit. Its greatest strength lies in its ability to create a deeply affecting mood and tell a relatable story through a unique and memorable metaphor. With a few minor lyrical refinements and a focus on dynamic arrangement, this song has the potential to be truly exceptional and connect with a wide audience."
};
