import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import saveAs from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

interface DownloadControlsProps {
    analysisResult: AnalysisResult;
}

// Fix: The 'sections' array for a Document was incorrectly typed and minimally populated.
// This function has been updated to correctly type the children as Paragraph[] and has been expanded 
// to include the full analysis report in the generated DOCX file for a better user experience.
const formatForDocx = (result: AnalysisResult): Document => {
  const scoreCategories = [
    { title: 'Creativity', ...result.creativity },
    { title: 'Emotional Impact', ...result.emotionalImpact },
    { title: 'Lyricism', ...result.lyricism },
    { title: 'Craftsmanship', ...result.craftsmanship },
    { title: 'Audience Appeal', ...result.audienceAppeal },
    { title: 'Commercial Potential', ...result.commercialPotential },
  ];

  const children: Paragraph[] = [
    new Paragraph({ text: "Song Analysis Report", heading: HeadingLevel.HEADING_1, alignment: 'center' }),
    new Paragraph({ text: `Title: ${result.title}`, heading: HeadingLevel.HEADING_2 }),
    new Paragraph({ text: `Overall Score: ${result.overallScore.toFixed(1)}/10.0`, heading: HeadingLevel.HEADING_3 }),
    new Paragraph({ text: "" }),
    new Paragraph({ text: "First Impression", heading: HeadingLevel.HEADING_4 }),
    new Paragraph({ children: [new TextRun({ text: result.firstImpression, italics: true })] }),
    new Paragraph({ text: "" }),

    new Paragraph({ text: "Score Breakdown", heading: HeadingLevel.HEADING_2 }),
    ...scoreCategories.flatMap(cat => [
      new Paragraph({ text: `${cat.title}: ${cat.score.toFixed(1)}/10.0`, heading: HeadingLevel.HEADING_3 }),
      new Paragraph({ text: cat.feedback }),
      new Paragraph({ text: "" }),
    ]),

    new Paragraph({ text: "Strengths", heading: HeadingLevel.HEADING_2 }),
    ...result.strengths.map(strength => new Paragraph({ text: strength, bullet: { level: 0 } })),
    new Paragraph({ text: "" }),

    new Paragraph({ text: "Weaknesses", heading: HeadingLevel.HEADING_2 }),
    ...result.weaknesses.map(weakness => new Paragraph({ text: weakness, bullet: { level: 0 } })),
    new Paragraph({ text: "" }),
    
    new Paragraph({ text: "Suggestions", heading: HeadingLevel.HEADING_2 }),
    ...result.suggestions.map(suggestion => new Paragraph({ text: suggestion, bullet: { level: 0 } })),
    new Paragraph({ text: "" }),

    new Paragraph({ text: "Artist Comparisons", heading: HeadingLevel.HEADING_2 }),
    ...result.artistComparisons.flatMap(comp => [
      new Paragraph({ text: comp.artist, heading: HeadingLevel.HEADING_3 }),
      new Paragraph({ text: comp.reason }),
      new Paragraph({ text: "" }),
    ]),

    new Paragraph({ text: "Suggested Genres", heading: HeadingLevel.HEADING_2 }),
    ...result.suggestedGenres.flatMap(genre => [
      new Paragraph({ text: genre.name, heading: HeadingLevel.HEADING_3 }),
      new Paragraph({ text: genre.reason }),
      new Paragraph({ text: "" }),
    ]),
    
    new Paragraph({ text: "Final Verdict", heading: HeadingLevel.HEADING_2 }),
    new Paragraph({ text: result.finalVerdict }),
  ];
  
  return new Document({
    sections: [{ children }],
  });
};

const DownloadControls: React.FC<DownloadControlsProps> = ({ analysisResult }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const safeTitle = analysisResult.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `Song_Analysis_${safeTitle}`;

    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        const reportElement = document.getElementById('analysis-report');
        if (reportElement) {
            const buttons = reportElement.querySelectorAll('.hide-on-pdf');
            buttons.forEach(btn => btn.classList.add('invisible'));

            const canvas = await html2canvas(reportElement, { scale: 2, backgroundColor: '#1e293b' });
            
            buttons.forEach(btn => btn.classList.remove('invisible'));

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${fileName}.pdf`);
        }
        setIsDownloading(false);
        setIsOpen(false);
    };

    const handleDownloadDocx = async () => {
        setIsDownloading(true);
        const doc = formatForDocx(analysisResult);
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${fileName}.docx`);
        setIsDownloading(false);
        setIsOpen(false);
    };
    
    const handleDownloadJson = () => {
        const jsonContent = JSON.stringify(analysisResult, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
        saveAs(blob, `${fileName}.json`);
        setIsOpen(false);
    };
    
    const handleDownloadTxt = () => {
        const textContent = JSON.stringify(analysisResult, null, 2); // Simple text version
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `${fileName}.txt`);
        setIsOpen(false);
    };

    const downloadOptions = [
        { label: "PDF (.pdf)", handler: handleDownloadPdf },
        { label: "DOCX (.docx)", handler: handleDownloadDocx },
        { label: "Text (.txt)", handler: handleDownloadTxt },
        { label: "JSON (.json)", handler: handleDownloadJson }
    ];

    return (
        <div className="relative hide-on-pdf">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-slate-700 text-slate-200 hover:bg-slate-600 px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg"
            >
                Export
            </button>
            {isOpen && (
                <div 
                    className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-20 py-1"
                >
                    {downloadOptions.map(option => (
                         <button
                            key={option.label}
                            onClick={option.handler}
                            disabled={isDownloading}
                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-3 disabled:opacity-50"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DownloadControls;