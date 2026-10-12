import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, FileDown, BookOpen, Menu, X } from 'lucide-react';

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
  isValidated: _isValidated,
  score: _score,
  onDownloadDocx,
  onDownloadPdf
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks: { id: 'document' | 'evaluation' | 'validation' | 'ccm' | 'excel'; label: string }[] = [
    { id: 'document', label: 'Dossier' },
    { id: 'evaluation', label: 'Évaluation' },
    { id: 'validation', label: 'Validation' },
    { id: 'ccm', label: 'Canevas CCM' },
    { id: 'excel', label: 'Tableaux' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Single Brand Element */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setCurrentTab('document');
                setMobileMenuOpen(false);
              }}
              className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
            >
              <span className="w-7 h-7 rounded-md bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                ÉM
              </span>
              <span>ÉvalMinier</span>
            </button>
          </div>

          {/* Zone 2: 4-5 Clean Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`py-1 transition-colors whitespace-nowrap text-xs uppercase tracking-wider font-semibold ${
                    isActive
                      ? 'text-white border-b-2 border-emerald-500'
                      : 'text-slate-400 hover:text-white border-b-2 border-transparent'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Unified Export Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exporter</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1.5 z-50 text-xs">
                  {onDownloadDocx && (
                    <button
                      onClick={() => {
                        onDownloadDocx();
                        setDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="font-semibold">Cahier des Charges (.docx)</div>
                        <div className="text-2xs text-slate-400">Microsoft Word officiel</div>
                      </div>
                    </button>
                  )}

                  {onDownloadPdf && (
                    <button
                      onClick={() => {
                        onDownloadPdf();
                        setDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold">Cahier des Charges (.pdf)</div>
                        <div className="text-2xs text-slate-400">Prêt pour impression et visa</div>
                      </div>
                    </button>
                  )}

                  <div className="border-t border-slate-800 my-1"></div>

                  <a
                    href="/DOCUMENTATION_COMPLETE_EVALMINIER.docx"
                    download="DOCUMENTATION_COMPLETE_EVALMINIER.docx"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-semibold">Documentation (.docx)</div>
                      <div className="text-2xs text-slate-400">Guide Dev &amp; Manuel Utilisateur</div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map(link => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
