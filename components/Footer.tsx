import React, { useState } from 'react';
import FAQModal from './FAQModal';

const Footer: React.FC = () => {
    const [isFaqOpen, setIsFaqOpen] = useState(false);

    return (
        <>
            <footer className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 text-center p-4 text-xs text-slate-500 flex-shrink-0">
                <p>
                    Powered by Google Gemini. Not professional advice. Please review analyses critically.
                </p>
                <div className="flex justify-center gap-4 mt-2">
                    <button onClick={() => setIsFaqOpen(true)} className="hover:text-cyan-400 transition-colors">
                        About / FAQ
                    </button>
                    <span>&bull;</span>
                     <button onClick={() => setIsFaqOpen(true)} className="hover:text-cyan-400 transition-colors">
                        Disclaimer
                    </button>
                </div>
            </footer>
            <FAQModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
        </>
    );
}

export default Footer;
