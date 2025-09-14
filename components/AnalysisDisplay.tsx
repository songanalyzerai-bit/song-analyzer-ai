import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';
import { exampleAnalysis } from '../exampleAnalysis';

interface SongInputFormProps {
  onAnalysisRequest: (title: string, lyrics: string, musicDescription: string, genre: string) => void;
  isLoading: boolean;
  error: string | null;
  onShowExample: () => void;
}

const CHAR_LIMITS = {
  title: 100,
  genre: 50,
  musicDescription: 500,
  lyrics: 10000,
};

const InputField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  maxLength: number;
  required?: boolean;
  disabled?: boolean;
  isTextArea?: boolean;
  rows?: number;
}> = ({ id, label, value, onChange, placeholder, maxLength, required, disabled, isTextArea, rows }) => {
  const InputComponent = isTextArea ? 'textarea' : 'input';
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <span className="text-xs text-slate-500">
          {value.length} / {maxLength}
        </span>
      </div>
      <InputComponent
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        rows={rows}
        className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition duration-200 disabled:opacity-50"
        {...(isTextArea && { className: "w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition duration-200 font-mono text-sm disabled:opacity-50"})}
      />
    </div>
  );
};

const SongInputForm: React.FC<SongInputFormProps> = ({ onAnalysisRequest, isLoading, error, onShowExample }) => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [musicDescription, setMusicDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !lyrics.trim()) {
      setFormError('Please provide a song title and lyrics.');
      return;
    }
    setFormError(null);
    onAnalysisRequest(title, lyrics, musicDescription, genre);
  };
  
  const exampleLyricsPlaceholder = `[Verse 1]
Streetlights paint the town in shades of blue
Another night, another memory of you
I walk the pavement where we used to dream
Lost in the echoes of a silent scream

[Chorus]
And it's just echoes in the rain
A whispered requiem of pain
Every drop a memory, a face I can't replace
Just empty spaces, time cannot erase
`;

  return (
    <div className="bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-2xl relative animate-fade-in-up">
      {isLoading && <LoadingSpinner />}
      {error && !isLoading && <ErrorAlert message={error} />}

      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Analyze Your Song</h2>
        <p className="text-slate-400 mt-2">Get instant, AI-powered feedback on your lyrics and musical ideas.</p>
      </div>
      
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center text-sm text-slate-400 mb-6">
        <span className="font-bold text-cyan-400">Pro Tip:</span> For a more accurate analysis, provide a genre, a music description, and label all song sections (e.g., [Verse], [Chorus], [Guitar Solo]).
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InputField
            id="title"
            label="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={exampleAnalysis.title}
            maxLength={CHAR_LIMITS.title}
            required
            disabled={isLoading}
          />
          <InputField
            id="genre"
            label="Genre (Optional)"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g., Indie Folk, Country, Pop"
            maxLength={CHAR_LIMITS.genre}
            disabled={isLoading}
          />
        </div>
        
        <InputField
            id="musicDescription"
            label="Music Description (Optional)"
            value={musicDescription}
            onChange={(e) => setMusicDescription(e.target.value)}
            placeholder="e.g., Slow, melancholic acoustic ballad with a sparse piano melody."
            maxLength={CHAR_LIMITS.musicDescription}
            disabled={isLoading}
            isTextArea
            rows={2}
          />

        <InputField
            id="lyrics"
            label="Lyrics"
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder={exampleLyricsPlaceholder}
            maxLength={CHAR_LIMITS.lyrics}
            required
            disabled={isLoading}
            isTextArea
            rows={10}
        />

        {formError && <p className="text-sm text-red-400 text-center">{formError}</p>}

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex-1 bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:from-fuchsia-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : 'Analyze Song'}
          </button>
           <button
            type="button"
            onClick={onShowExample}
            disabled={isLoading}
            className="w-full sm:w-auto bg-slate-700 text-slate-300 hover:bg-slate-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            View Example Analysis
          </button>
        </div>
      </form>
    </div>
  );
};

export default SongInputForm;
