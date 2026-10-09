import React from 'react';
import { FileText, CheckCircle2, Award, Download, SlidersHorizontal, FileDown } from 'lucide-react';

interface NavbarProps {
  currentTab: 'document' | 'evaluation' | 'validation' | 'ccm' | 'excel';
  setCurrentTab: (tab: 'document' | 'evaluation' | 'validation' | 'ccm' | 'excel') => void;
  isValidated: boolean;
  score: number;
  onDownloadDocx?: () => void;
  onDownloadPdf?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isValidated,
  score,
  onDownloadDocx,
  onDownloadPdf
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
              ÉM
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                ÉvalMinier
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono text-emerald-400">
                Guide v2.0
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs lg:text-sm font-medium">
            <button
              onClick={() => setCurrentTab('document')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'document'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              1. Document PTPF
            </button>

            <button
              onClick={() => setCurrentTab('evaluation')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'evaluation'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-4 h-4" />
              2. Évaluation Guide v2.0
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 ml-1">
                {score}/110
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('validation')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'validation'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              3. Validation Humaine
              {isValidated && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-1"></span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('ccm')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'ccm'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              4. Canevas CCM
            </button>

            <button
              onClick={() => setCurrentTab('excel')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'excel'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Download className="w-4 h-4" />
              5. Tableaux Ajustés
            </button>
          </nav>

          {/* Zone 3: Direct 1-Click Download Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {onDownloadDocx && (
              <button
                onClick={onDownloadDocx}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-2xs flex items-center gap-1.5 whitespace-nowrap"
                title="Télécharger le Canevas CCM au format Word (.docx)"
              >
                <FileDown className="w-3.5 h-3.5" />
                DOCX
              </button>
            )}

            {onDownloadPdf && (
              <button
                onClick={onDownloadPdf}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-2xs flex items-center gap-1.5 whitespace-nowrap"
                title="Télécharger le Canevas CCM au format PDF (.pdf)"
              >
                <Download className="w-3.5 h-3.5" />
                PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
