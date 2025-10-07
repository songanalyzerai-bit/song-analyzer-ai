import React from 'react';
import type { AnalysisResult } from '../types';

interface ComparisonDisplayProps {
    item1: AnalysisResult;
    item2: AnalysisResult;
    onNewAnalysis: () => void;
}

const ComparisonColumn: React.FC<{ item: AnalysisResult }> = ({ item }) => (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col gap-6 h-full">
        <h2 className="text-2xl font-bold text-white mb-0 tracking-tight text-center truncate" title={item.title}>{item.title}</h2>
        <div className="text-center">
            <p className="text-xl font-semibold text-slate-300">Overall Score</p>
            <p className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400 my-2">
                {item.overallScore.toFixed(1)}
            </p>
        </div>
        <div className="space-y-2 text-slate-300">
            <div className="flex justify-between items-baseline"><span className="font-semibold">Creativity</span> <span className="font-bold text-lg">{item.creativity.score.toFixed(1)}</span></div>
            <div className="flex justify-between items-baseline"><span className="font-semibold">Emotional Impact</span> <span className="font-bold text-lg">{item.emotionalImpact.score.toFixed(1)}</span></div>
            <div className="flex justify-between items-baseline"><span className="font-semibold">Lyricism</span> <span className="font-bold text-lg">{item.lyricism.score.toFixed(1)}</span></div>
            <div className="flex justify-between items-baseline"><span className="font-semibold">Craftsmanship</span> <span className="font-bold text-lg">{item.craftsmanship.score.toFixed(1)}</span></div>
            <div className="flex justify-between items-baseline"><span className="font-semibold">Audience Appeal</span> <span className="font-bold text-lg">{item.audienceAppeal.score.toFixed(1)}</span></div>
            <div className="flex justify-between items-baseline"><span className="font-semibold">Commercial Potential</span> <span className="font-bold text-lg">{item.commercialPotential.score.toFixed(1)}</span></div>
        </div>
         <div className="border-t border-slate-700 pt-4 mt-auto">
            <h4 className="font-bold text-white mb-2">Final Verdict</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{item.finalVerdict}</p>
        </div>
    </div>
);

const ComparisonDisplay: React.FC<ComparisonDisplayProps> = ({ item1, item2, onNewAnalysis }) => {
    return (
         <div className="space-y-8 animate-fade-in">
            <header className="text-center p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl relative hide-on-pdf">
                <div className="absolute top-4 left-4">
                     <button 
                        onClick={onNewAnalysis} 
                        className="bg-slate-700 text-slate-200 hover:bg-slate-600 px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                    >
                        New Analysis
                    </button>
                </div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Comparison View</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <ComparisonColumn item={item1} />
                <ComparisonColumn item={item2} />
            </div>
        </div>
    );
};

export default ComparisonDisplay;
