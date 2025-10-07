import React from 'react';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQItem: React.FC<{ question: string, children: React.ReactNode }> = ({ question, children }) => (
    <div className="mb-6">
        <h4 className="font-bold text-slate-200 mb-2">{question}</h4>
        <div className="text-slate-400 text-sm space-y-2">{children}</div>
    </div>
);

const CriteriaItem: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <li className="ml-4">
        <span className="font-semibold text-slate-300">{title}:</span> {children}
    </li>
);

const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">FAQ & About</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <FAQItem question="How does this work?">
                        <p>This tool uses Google's Gemini large language model to analyze your song. You provide the title, lyrics, and an optional description of the music, and the AI generates a detailed critique based on a predefined set of criteria.</p>
                    </FAQItem>
                    
                    <FAQItem question="What are the analysis criteria?">
                        <p>The AI is instructed to evaluate your song across several key areas:</p>
                        <ul className="list-disc space-y-2 mt-2">
                            <CriteriaItem title="Creativity & Originality">
                                Does the song offer a fresh perspective and avoid common clichés? This rewards unique ideas and clever wordplay.
                            </CriteriaItem>
                            <CriteriaItem title="Emotional Impact">
                                How well does the song connect with the listener emotionally? This measures its power to make the listener *feel* something.
                            </CriteriaItem>
                            <CriteriaItem title="Lyricism & Language">
                                This evaluates the quality of the writing itself—rhyme scheme, meter, imagery, and storytelling.
                            </CriteriaItem>
                            <CriteriaItem title="Craftsmanship">
                                This assesses the song's structure and technical construction. Does it have a clear verse-chorus structure and smooth transitions?
                            </CriteriaItem>
                             <CriteriaItem title="Audience Appeal">
                                How likely is this song to find its target audience? This measures its potential to resonate with a specific demographic or niche.
                            </CriteriaItem>
                            <CriteriaItem title="Commercial Potential">
                                Does the song have viability for mainstream success? This evaluates its potential for radio play, streaming playlists, and synchronization in media.
                            </CriteriaItem>
                        </ul>
                    </FAQItem>

                    <FAQItem question="Why do the scores change if I run the same song again?">
                        <p>This "variability" is an intentional feature that mimics human creativity! Think of it like getting feedback from a panel of three different music experts. They would all agree on the main points, but each might focus on slightly different details and give slightly different scores (an 8.2 vs an 8.5).</p>
                        <p>The AI behaves similarly to provide a more nuanced and "human-like" critique. Instead of focusing on the exact number, look at the overall trends. If a category consistently scores lower, that's a strong indicator of where you can improve.</p>
                    </FAQItem>
                    
                    <FAQItem question="Do I have to sign up or log in to use this?">
                        <p>No. The core song analysis functionality is available to everyone without an account. Signing up is completely optional but allows you to access the History feature, where you can save, revisit, and compare different versions of your songs.</p>
                    </FAQItem>
                    
                    <FAQItem question="Is my data saved if I'm not logged in?">
                         <p>No. Any analysis you run while logged out is processed and then immediately discarded. Nothing is saved. To save your work, you must be logged into an account, which associates your analyses securely with your user profile.</p>
                    </FAQItem>

                </div>
            </div>
        </div>
    );
};

export default FAQModal;
