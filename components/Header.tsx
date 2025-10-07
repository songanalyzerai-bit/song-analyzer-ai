import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getFirebaseAuth } from '../firebase';
import { signOut } from 'firebase/auth';
import AuthModal from './AuthModal';

interface HeaderProps {
  onHistoryToggle: () => void;
  isHistoryVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ onHistoryToggle, isHistoryVisible }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    const hasSeenGlow = sessionStorage.getItem('hasSeenHistoryGlow');
    if (!hasSeenGlow && !isHistoryVisible) {
      setShowGlow(true);
      sessionStorage.setItem('hasSeenHistoryGlow', 'true');
      const timer = setTimeout(() => setShowGlow(false), 5000); // Glow for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isHistoryVisible]);

  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Error signing out: ", error);
      }
    }
  };

  const glowClass = showGlow ? 'animate-glow' : '';

  return (
    <>
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={onHistoryToggle}
            className={`relative p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white ${glowClass}`}
            aria-label="Toggle history sidebar"
          >
             <style>{`
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 0px #06b6d4; }
                    50% { box-shadow: 0 0 15px #06b6d4; }
                }
                .animate-glow {
                    animation: glow 2.5s ease-in-out 2;
                }
            `}</style>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">Song Analyzer AI</h1>
        </div>
        <div>
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300 hidden sm:block">{currentUser.email}</span>
              <button
                onClick={handleLogout}
                className="bg-slate-700 text-slate-300 hover:bg-slate-600 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:from-fuchsia-700 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 transition-all duration-300 text-sm"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
