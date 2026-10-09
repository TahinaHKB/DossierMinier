/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { SAMPLE_37255_DOSSIER, SAMPLE_41280_BETSIBOA } from './data/sampleDossier';
import { MiningPermitDocument, FullEvaluationReport } from './types/mining';
import { evaluateMiningDossier } from './utils/evaluationEngine';
import { generateCcmDocx } from './utils/docxGenerator';
import { generateCcmPdf } from './utils/pdfGenerator';
import { Navbar } from './components/Navbar';
import { DocumentUploadSection } from './components/DocumentUploadSection';
import { EvaluationSection } from './components/EvaluationSection';
import { HumanValidationPanel } from './components/HumanValidationPanel';
import { CcmTemplateView } from './components/CcmTemplateView';
import { AdjustedTablesExcelView } from './components/AdjustedTablesExcelView';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export default function App() {
  const [doc, setDoc] = useState<MiningPermitDocument>(SAMPLE_37255_DOSSIER);
  const [currentTab, setCurrentTab] = useState<'document' | 'evaluation' | 'validation' | 'ccm' | 'excel'>('document');
  const [humanValidationOverride, setHumanValidationOverride] = useState<{
    isValidated: boolean;
    evaluatorName: string;
    notes: string;
    timestamp: string;
  }>({
    isValidated: false,
    evaluatorName: '',
    notes: '',
    timestamp: ''
  });

  // Calculate algorithmic evaluation dynamically whenever doc changes
  const report: FullEvaluationReport = useMemo(() => {
    const rawReport = evaluateMiningDossier(doc);
    if (humanValidationOverride.isValidated) {
      rawReport.isOfficiallyValidated = true;
      rawReport.evaluatorName = humanValidationOverride.evaluatorName;
      rawReport.validationTimestamp = humanValidationOverride.timestamp;
    }
    return rawReport;
  }, [doc, humanValidationOverride]);

  const handleValidate = (evaluatorName: string, notes: string) => {
    setHumanValidationOverride({
      isValidated: true,
      evaluatorName,
      notes,
      timestamp: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    });
    // Auto-advance to CCM template after validation
    setCurrentTab('ccm');
  };

  const handleResetValidation = () => {
    setHumanValidationOverride({
      isValidated: false,
      evaluatorName: '',
      notes: '',
      timestamp: ''
    });
  };

  const handleResetToSample = (sampleKey?: '37255' | '41280') => {
    if (sampleKey === '41280') {
      setDoc(JSON.parse(JSON.stringify(SAMPLE_41280_BETSIBOA)));
    } else {
      setDoc(JSON.parse(JSON.stringify(SAMPLE_37255_DOSSIER)));
    }
    handleResetValidation();
  };

  // 1-Click Direct Downloads from Navbar or any section
  const handleGlobalDownloadDocx = async () => {
    try {
      const blob = await generateCcmDocx(doc, report);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Cahier_des_Charges_Minieres_PR_${doc.permitNumber}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du téléchargement Word (.docx)');
    }
  };

  const handleGlobalDownloadPdf = () => {
    try {
      const pdf = generateCcmPdf(doc, report);
      pdf.save(`Cahier_des_Charges_Minieres_PR_${doc.permitNumber}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du téléchargement PDF (.pdf)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Contract Navigation with direct 1-click downloads */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isValidated={humanValidationOverride.isValidated}
        score={report.totalScore}
        onDownloadDocx={handleGlobalDownloadDocx}
        onDownloadPdf={handleGlobalDownloadPdf}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Contextual Workflow Progress Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs no-print">
          <div className="flex items-center justify-between overflow-x-auto text-xs font-medium gap-2">
            <button
              onClick={() => setCurrentTab('document')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentTab === 'document' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-2xs flex items-center justify-center font-bold">1</span>
              <span>Importation &amp; Document</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

            <button
              onClick={() => setCurrentTab('evaluation')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentTab === 'evaluation' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-2xs flex items-center justify-center font-bold">2</span>
              <span>Algorithme Guide v2.0</span>
              <span className="font-mono text-2xs font-bold text-emerald-600">({report.totalScore}/110)</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

            <button
              onClick={() => setCurrentTab('validation')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentTab === 'validation' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-2xs flex items-center justify-center font-bold">3</span>
              <span>Validation Humaine</span>
              {humanValidationOverride.isValidated && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

            <button
              onClick={() => setCurrentTab('ccm')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentTab === 'ccm' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-2xs flex items-center justify-center font-bold">4</span>
              <span>Canevas CCM Rempli</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

            <button
              onClick={() => setCurrentTab('excel')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentTab === 'excel' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-2xs flex items-center justify-center font-bold">5</span>
              <span>Tableaux Excel</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {currentTab === 'document' && (
          <DocumentUploadSection
            doc={doc}
            report={report}
            onDocChange={setDoc}
            onProceedToEval={() => setCurrentTab('evaluation')}
            onResetToSample={handleResetToSample}
          />
        )}

        {currentTab === 'evaluation' && (
          <EvaluationSection
            report={report}
            doc={doc}
            onProceedToValidation={() => setCurrentTab('validation')}
          />
        )}

        {currentTab === 'validation' && (
          <HumanValidationPanel
            report={report}
            doc={doc}
            onValidate={handleValidate}
            onResetValidation={handleResetValidation}
            onProceedToCcm={() => setCurrentTab('ccm')}
          />
        )}

        {currentTab === 'ccm' && (
          <CcmTemplateView
            doc={doc}
            report={report}
            onUpdateDoc={setDoc}
          />
        )}

        {currentTab === 'excel' && (
          <AdjustedTablesExcelView
            doc={doc}
            report={report}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Direction de la Promotion des Grandes Mines</span>
            <span>·</span>
            <span>Ministère des Mines de Madagascar</span>
          </div>
          <div className="flex items-center gap-4 text-2xs text-slate-400">
            <span>Guide d'Évaluation PTPF v2.0</span>
            <span>·</span>
            <span>Loi n° 2023-007</span>
            <span>·</span>
            <span>Traitement Multi-documents Universel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
