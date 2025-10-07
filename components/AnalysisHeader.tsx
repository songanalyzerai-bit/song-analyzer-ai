import React from 'react';
import DownloadControls from './DownloadControls';
import type { AnalysisResult } from '../types';

interface AnalysisHeaderProps {
    analysisResult: AnalysisResult;
}

const getScoreGradient = (score: number) => {
    if (score >= 8.0) return 'from-green-400 to-cyan-400';
    if (score >= 6.0) return 'from-yellow-400 to-orange-400';
    return 'from-orange-500 to-red-500';
};

const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({ analysisResult }) => {
    const { title, overallScore } = analysisResult;
    return (
        <header className="text-center p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl relative mb-8">
            <div className="absolute top-4 right-4 hide-on-pdf">
                <DownloadControls analysisResult={analysisResult} />
            </div>

            <p className="text-sm font-medium text-slate-400">Analysis Report for</p>
            <h1 className="text-4xl font-extrabold text-white tracking-tight my-2">{title}</h1>

            <div className="mt-4 inline-block">
                <p className="text-xl font-semibold text-slate-300">Overall Score</p>
                <p className={`text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getScoreGradient(overallScore)} my-2`}>
                    {overallScore.toFixed(1)}
                </p>
            </div>
        </header>
    );
};

export default AnalysisHeader;
