import React from 'react';

interface ScoreCardProps {
  title: string;
  score: number;
  feedback: string;
  colorClass: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, feedback, colorClass }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'text-green-400';
    if (score >= 6.0) return 'text-yellow-400';
    if (score >= 4.0) return 'text-orange-400';
    return 'text-red-400';
  };

  const circumference = 2 * Math.PI * 45; // r=45
  const offset = circumference - (score / 10) * circumference;

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-start gap-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:border-slate-600">
      <div className="flex-shrink-0 flex flex-col items-center w-full md:w-32">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-slate-700"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <circle
              className={colorClass}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score.toFixed(1)}</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mt-4 text-center">{title}</h3>
      </div>
      <div className="flex-grow">
        <p className="text-slate-300 leading-relaxed">{feedback}</p>
      </div>
    </div>
  );
};

export default ScoreCard;
