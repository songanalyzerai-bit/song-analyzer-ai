import React from 'react';
import type { ArtistComparison, SuggestedGenre } from '../types';

interface GenreAndArtistDetailsProps {
    title: string;
    items: (ArtistComparison | SuggestedGenre)[];
}

const GenreAndArtistDetails: React.FC<GenreAndArtistDetailsProps> = ({ title, items }) => {
    return (
        <div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-4">{title}</h3>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <p className="font-semibold text-slate-200">{'artist' in item ? item.artist : item.name}</p>
                        <p className="text-sm text-slate-400 italic mt-1">{item.reason}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GenreAndArtistDetails;
