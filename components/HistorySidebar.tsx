import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserAnalyses } from '../services/firestoreService';
import type { AnalysisResult } from '../types';
import { isFirebaseEnabled } from '../firebase';

interface HistorySidebarProps {
  isVisible: boolean;
  onSelectItem: (item: AnalysisResult) => void;
  onCompareItems: (item1: AnalysisResult, item2: AnalysisResult) => void;
  onClose: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isVisible, onSelectItem, onCompareItems, onClose }) => {
    const { currentUser } = useAuth();
    const [history, setHistory] = useState<AnalysisResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    useEffect(() => {
        if (currentUser && isVisible) {
            setIsLoading(true);
            setError(null);
            setSelectedItems([]);
            getUserAnalyses(currentUser.uid)
                .then(analyses => setHistory(analyses))
                .catch(err => setError("Could not load history."))
                .finally(() => setIsLoading(false));
        } else if (!currentUser) {
            setIsLoading(false);
        }
    }, [currentUser, isVisible]);

    const handleItemToggle = (id: string) => {
        setSelectedItems(prev => {
            if (prev.includes(id)) {
                return prev.filter(itemId => itemId !== id);
            }
            if (prev.length < 2) {
                return [...prev, id];
            }
            return prev;
        });
    };

    const handleCompareClick = () => {
        if (selectedItems.length === 2) {
            const item1 = history.find(h => h.id === selectedItems[0]);
            const item2 = history.find(h => h.id === selectedItems[1]);
            if (item1 && item2) {
                onCompareItems(item1, item2);
            }
        }
    };
    
    const formatDate = (timestamp: any) => {
        if (!timestamp || !timestamp.toDate) return 'Just now';
        return timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const sidebarClasses = `
        fixed top-0 left-0 h-full w-80 bg-slate-800 border-r border-slate-700 p-4 flex flex-col z-30
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-x-0' : '-translate-x-full'}
    `;

    const renderContent = () => {
        if (!isFirebaseEnabled) {
            return (
                 <div className="text-center text-slate-500 text-sm mt-8">
                    <p className="font-semibold text-slate-400">Feature Disabled</p>
                    <p>Login and history features are not configured for this instance.</p>
                </div>
            );
        }
        if (!currentUser) {
            return (
                <div className="text-center text-slate-500 text-sm mt-8">
                    <p className="font-semibold text-slate-400">Please Log In</p>
                    <p>Log in to save and view your analysis history.</p>
                </div>
            );
        }
        if (isLoading) return <p className="text-slate-400 text-sm">Loading history...</p>;
        if (error) return <p className="text-red-400 text-sm">{error}</p>;
        if (history.length === 0) {
             return (
                <div className="text-center text-slate-500 text-sm mt-8">
                    <p>Your saved analyses will appear here.</p>
                </div>
            );
        }
        return (
            <div className="overflow-y-auto space-y-2 flex-1 -mr-2 pr-2">
                {history.map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id={`cb-${item.id}`}
                            checked={selectedItems.includes(item.id!)}
                            onChange={() => handleItemToggle(item.id!)}
                        />
                        <label 
                             htmlFor={`cb-${item.id}`}
                             className="flex-1 text-left p-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                             onClick={() => onSelectItem(item)}
                        >
                            <p className="font-semibold text-slate-200 truncate">{item.title}</p>
                            <p className="text-xs text-slate-400">{formatDate(item.createdAt)}</p>
                        </label>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <aside className={sidebarClasses}>
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-lg font-bold text-white">Analysis History</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            {renderContent()}
             {currentUser && history.length > 0 && (
                <div className="pt-4 border-t border-slate-700 flex-shrink-0 space-y-2">
                     <button 
                        onClick={handleCompareClick}
                        disabled={selectedItems.length !== 2}
                        className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors"
                    >
                        Compare ({selectedItems.length}/2)
                    </button>
                    <button
                        onClick={() => setSelectedItems([])}
                        disabled={selectedItems.length === 0}
                        className="w-full bg-slate-700 text-slate-300 hover:bg-slate-600 font-medium py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                        Clear Selection
                    </button>
                </div>
            )}
        </aside>
    );
};

export default HistorySidebar;
