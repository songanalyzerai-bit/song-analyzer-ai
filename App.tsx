import React, { useState } from 'react';
import { analyzeSong } from './services/geminiService';
import type { AnalysisResult } from './types';
import SongInputForm from './components/SongInputForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import HistorySidebar from './components/HistorySidebar';
import { exampleAnalysis } from './exampleAnalysis';
import { useAuth } from './hooks/useAuth';
import { saveAnalysis } from './services/firestoreService';
import ComparisonDisplay from './components/ComparisonDisplay';

type View = 'input' | 'analysis' | 'comparison';

function App() {
  const [currentView, setCurrentView] = useState<View>('input');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [comparisonItems, setComparisonItems] = useState<[AnalysisResult, AnalysisResult] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [historyKey, setHistoryKey] = useState(0); // To force re-render of history

  const { currentUser } = useAuth();

  const handleAnalysisRequest = async (title: string, lyrics: string, musicDescription: string, genre: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeSong(title, lyrics, musicDescription, genre);
      setAnalysisResult(result);
      setCurrentView('analysis');
      if (currentUser) {
        try {
            await saveAnalysis(currentUser.uid, result);
            setHistoryKey(prev => prev + 1); // Trigger history refresh
        } catch (saveError: any) {
            console.error("Failed to save analysis:", saveError);
        }
      }
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearView = () => {
    setAnalysisResult(null);
    setComparisonItems(null);
    setCurrentView('input');
    setError(null);
  }

  const handleShowExample = () => {
    setError(null);
    setComparisonItems(null);
    setAnalysisResult(exampleAnalysis);
    setCurrentView('analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryItem = (item: AnalysisResult) => {
    setError(null);
    setComparisonItems(null);
    setAnalysisResult(item);
    setCurrentView('analysis');
    setIsHistoryVisible(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleCompareItems = (item1: AnalysisResult, item2: AnalysisResult) => {
    setError(null);
    setAnalysisResult(null);
    setComparisonItems([item1, item2]);
    setCurrentView('comparison');
    setIsHistoryVisible(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const renderContent = () => {
    switch (currentView) {
      case 'analysis':
        return analysisResult ? (
          <AnalysisDisplay
            analysisResult={analysisResult}
            onNewAnalysis={handleClearView}
          />
        ) : null;
      case 'comparison':
        return comparisonItems ? (
           <ComparisonDisplay
            item1={comparisonItems[0]}
            item2={comparisonItems[1]}
            onNewAnalysis={handleClearView}
           />
        ) : null;
      case 'input':
      default:
        return (
          <SongInputForm 
            onAnalysisRequest={handleAnalysisRequest} 
            isLoading={isLoading} 
            error={error}
            onShowExample={handleShowExample}
          />
        );
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header onHistoryToggle={() => setIsHistoryVisible(!isHistoryVisible)} isHistoryVisible={isHistoryVisible}/>
       <div className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 ${isHistoryVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsHistoryVisible(false)}></div>
      <div className="flex flex-1 overflow-hidden relative">
        <HistorySidebar 
          isVisible={isHistoryVisible} 
          onSelectItem={handleSelectHistoryItem} 
          onCompareItems={handleCompareItems}
          onClose={() => setIsHistoryVisible(false)}
          key={historyKey} 
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;