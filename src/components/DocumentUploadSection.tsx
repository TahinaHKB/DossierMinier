import React, { useState } from 'react';
import {
  Upload,
  FileCheck,
  MapPin,
  Building,
  Layers,
  Coins,
  ShieldCheck,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  Download,
  FileText,
  Sparkles,
  ClipboardPaste,
  Edit2,
  Check
} from 'lucide-react';
import { MiningPermitDocument, FullEvaluationReport } from '../types/mining';
import { parsePdfFile } from '../utils/pdfParser';
import { SAMPLE_37255_DOSSIER, SAMPLE_41280_BETSIBOA } from '../data/sampleDossier';
import { generateCcmDocx } from '../utils/docxGenerator';
import { generateCcmPdf } from '../utils/pdfGenerator';

interface DocumentUploadSectionProps {
  doc: MiningPermitDocument;
  report: FullEvaluationReport;
  onDocChange: (newDoc: MiningPermitDocument) => void;
  onProceedToEval: () => void;
  onResetToSample: (sampleKey?: '37255' | '41280') => void;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  doc,
  report,
  onDocChange,
  onProceedToEval,
  onResetToSample
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'editor' | 'tables' | 'rawText'>('overview');
  const [rawTextPreview, setRawTextPreview] = useState<string>('');
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable fields in the inline editor
  const [editPermit, setEditPermit] = useState(doc.permitNumber);
  const [editApplicant, setEditApplicant] = useState(doc.applicantName);
  const [editManager, setEditManager] = useState(doc.managerName);
  const [editNif, setEditNif] = useState(doc.taxId);
  const [editRegion, setEditRegion] = useState(doc.region);
  const [editDistrict, setEditDistrict] = useState(doc.district);
  const [editCommune, setEditCommune] = useState(doc.commune);
  const [editCarres, setEditCarres] = useState(doc.carresCount);
  const [editMinerals, setEditMinerals] = useState(doc.mineralsProject.join(', '));
  const [editMainMineral, setEditMainMineral] = useState(doc.mainMineral);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const result = await parsePdfFile(file);
      onDocChange(result.extractedDoc);
      setRawTextPreview(result.rawText);

      // sync fields
      setEditPermit(result.extractedDoc.permitNumber);
      setEditApplicant(result.extractedDoc.applicantName);
      setEditManager(result.extractedDoc.managerName);
      setEditNif(result.extractedDoc.taxId);
      setEditRegion(result.extractedDoc.region);
      setEditDistrict(result.extractedDoc.district);
      setEditCommune(result.extractedDoc.commune);
      setEditCarres(result.extractedDoc.carresCount);
      setEditMinerals(result.extractedDoc.mineralsProject.join(', '));
      setEditMainMineral(result.extractedDoc.mainMineral);
    } catch (err) {
      console.error('Erreur traitement PDF:', err);
      alert('Une erreur est survenue lors de l’analyse du PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    const fakeFile = new File([pastedText], 'Document_Texte_Colle.txt', { type: 'text/plain' });
    setIsProcessing(true);
    try {
      // simple heuristic parse
      const permitMatch = pastedText.match(/(?:Permis(?:\s+minier)?\s*(?:N°|Numero|Numéro)?\s*[:\s]+|[Nn]°\s*permis\s*[:\s]+)(\d[\d\s]{2,7})/i);
      const titulaireMatch = pastedText.match(/(?:Titulaire|Nom du demandeur|Société|Raison sociale)\s*[:\s]+([^\n\r.]+)/i);

      const newDoc: MiningPermitDocument = JSON.parse(JSON.stringify(doc));
      newDoc.fileName = 'Document_Texte_Colle.txt';
      if (permitMatch && permitMatch[1]) newDoc.permitNumber = permitMatch[1].replace(/\s+/g, '').trim();
      if (titulaireMatch && titulaireMatch[1]) newDoc.applicantName = titulaireMatch[1].trim();

      onDocChange(newDoc);
      setRawTextPreview(pastedText);
      setShowPasteModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickDownloadDocx = async () => {
    setIsDownloadingDocx(true);
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
    } catch (e) {
      console.error(e);
      alert('Erreur lors du téléchargement Word');
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  const handleQuickDownloadPdf = () => {
    setIsDownloadingPdf(true);
    try {
      const pdf = generateCcmPdf(doc, report);
      pdf.save(`Cahier_des_Charges_Minieres_PR_${doc.permitNumber}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Erreur lors du téléchargement PDF');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const saveManualEdits = () => {
    const updatedMinerals = editMinerals.split(/[,;]/).map(s => s.trim()).filter(Boolean);
    const updatedDoc: MiningPermitDocument = {
      ...doc,
      permitNumber: editPermit,
      applicantName: editApplicant,
      managerName: editManager,
      taxId: editNif,
      region: editRegion,
      district: editDistrict,
      commune: editCommune,
      carresCount: Number(editCarres),
      surfaceKm2: parseFloat((Number(editCarres) * 0.390625).toFixed(2)),
      mineralsTitle: updatedMinerals,
      mineralsProject: updatedMinerals,
      mainMineral: editMainMineral
    };
    onDocChange(updatedDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-2xs uppercase tracking-wider font-semibold text-slate-500 mb-1">
              République de Madagascar · Ministère des Mines
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Traitement &amp; Évaluation de Documents Miniers
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Importez <strong className="font-semibold text-slate-800">n'importe quel document (PDF ou texte)</strong>. Le système applique le <strong className="font-semibold text-slate-800">Guide d'Évaluation v2.0</strong> et pré-remplit instantanément le <strong className="font-semibold text-slate-800">Cahier des Charges Minières (CCM)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onResetToSample('37255')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                doc.permitNumber === '37255'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Spécimen 1 : 37255 (Ambilobe)
            </button>
            <button
              onClick={() => onResetToSample('41280')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                doc.permitNumber === '41280'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Spécimen 2 : 41280 (Betsiboa)
            </button>
            <button
              onClick={() => setShowPasteModal(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              Coller texte/OCR
            </button>
          </div>
        </div>
      </div>

      {/* INSTANT DOWNLOAD & AUTO-FILL CALLOUT CARD */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white border border-emerald-800/60 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Canevas CCM Rempli Automatiquement
              </span>
              <span className="text-2xs text-slate-400 truncate max-w-xs">
                · Permis n° {doc.permitNumber} ({doc.applicantName})
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Cahier des Charges (CCM) prêt au téléchargement
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Valeurs pivots intégrées : Coût Matériel 1 ({report.pivots.coutMateriel1.toLocaleString('fr-FR')} MGA), CMRM ({report.pivots.totalCmrmAjuste.toLocaleString('fr-FR')} MGA), PRSE ({report.pivots.prseAnnuelRequis.toLocaleString('fr-FR')} MGA/an).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleQuickDownloadDocx}
              disabled={isDownloadingDocx}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              {isDownloadingDocx ? 'Génération...' : 'Télécharger Word (.docx)'}
            </button>

            <button
              onClick={handleQuickDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {isDownloadingPdf ? 'Génération...' : 'Télécharger PDF (.pdf)'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Upload Box + Current Document Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Dropzone */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              Importer Votre Fichier PDF
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Glissez-déposez n'importe quel dossier minier (PTPF, demande de permis, avis cadastral).
            </p>

            <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/20 transition-all group">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 flex items-center justify-center transition-colors mb-3">
                {isProcessing ? (
                  <Sparkles className="w-5 h-5 animate-spin text-emerald-600" />
                ) : (
                  <FileCheck className="w-5 h-5" />
                )}
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-800 text-center">
                {isProcessing ? 'Traitement du PDF en cours...' : 'Sélectionner un fichier PDF'}
              </span>
              <span className="text-2xs text-slate-400 mt-1">Tous formats acceptés · Traitement 100% local</span>
            </label>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-2xs text-slate-500 flex items-center justify-between">
              <span>Fichier actif :</span>
              <span className="font-semibold text-slate-800 truncate max-w-[170px]">{doc.fileName}</span>
            </div>
            <div className="text-2xs text-slate-500 flex items-center justify-between mt-1">
              <span>Type de permis :</span>
              <span className="text-slate-700 font-medium">{doc.permitType} (Permis de Recherche)</span>
            </div>
          </div>
        </div>

        {/* Current Document Summary */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Paramètres Extraits du Document
                </span>
                <span className="text-2xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Permis n° {doc.permitNumber}
                </span>
              </div>
              <button
                onClick={() => setActiveSubTab('editor')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Modifier ou ajuster les paramètres
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-2xs text-slate-500 flex items-center gap-1.5 mb-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" /> Titulaire / Entreprise
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">{doc.applicantName}</div>
                <div className="text-2xs text-slate-500 font-mono mt-0.5">NIF: {doc.taxId}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-2xs text-slate-500 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Localisation &amp; Périmètre
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {doc.commune}, {doc.district}
                </div>
                <div className="text-2xs text-slate-500 mt-0.5">
                  Région {doc.region} · {doc.carresCount} carrés ({doc.surfaceKm2} km²)
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-2xs text-slate-500 flex items-center gap-1.5 mb-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" /> Substances Minérales
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {doc.mineralsProject.join(', ')}
                </div>
                <div className="text-2xs text-emerald-600 font-medium mt-0.5">
                  Cible principale : {doc.mainMineral}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-2xs text-slate-500 flex items-center gap-1.5 mb-1">
                  <Coins className="w-3.5 h-3.5 text-slate-400" /> Investissement Déclaré
                </div>
                <div className="text-xs font-bold font-mono text-slate-900">
                  {doc.investmentsPhase.reduce((s, i) => s + i.initialAmountMGA, 0).toLocaleString('fr-FR')} MGA
                </div>
                <div className="text-2xs text-slate-500 mt-0.5">
                  Ajusté à {report.pivots.totalInvestissementAjuste.toLocaleString('fr-FR')} MGA
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-2xs text-slate-500 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> CMRM Réglementaire
                </div>
                <div className="text-xs font-bold font-mono text-slate-900">
                  {report.pivots.totalCmrmAjuste.toLocaleString('fr-FR')} MGA
                </div>
                <div className="text-2xs text-slate-500 mt-0.5">13 postes obligatoires</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-2xs text-slate-500 flex items-center gap-1.5 mb-1">
                  <Coins className="w-3.5 h-3.5 text-slate-400" /> Budget RSE (3 ans)
                </div>
                <div className="text-xs font-bold font-mono text-slate-900">
                  {report.pivots.rseAjuste.toLocaleString('fr-FR')} MGA
                </div>
                <div className="text-2xs text-emerald-600 font-medium mt-0.5">
                  PRSE : {report.pivots.prseAnnuelRequis.toLocaleString('fr-FR')} MGA / an
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Gérant légal : <span className="font-semibold text-slate-800">{doc.managerName}</span>
            </div>
            <div>
              Score Guide v2.0 : <span className="font-bold text-emerald-700 font-mono">{report.totalScore} / 110 pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Details / Editable Form / Tables / Raw Text */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="border-b border-slate-200 px-6 pt-4 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
                activeSubTab === 'overview'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Données Techniques
            </button>
            <button
              onClick={() => setActiveSubTab('editor')}
              className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'editor'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              Éditer les Paramètres Extraits
            </button>
            <button
              onClick={() => setActiveSubTab('tables')}
              className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'tables'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Tableaux Financiers (V.1, V.2, V.3)
            </button>
            <button
              onClick={() => setActiveSubTab('rawText')}
              className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'rawText'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Texte Brut Extrait
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeSubTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-sm">Contexte Géologique &amp; Périmètre</h3>
                  <p className="leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {doc.geologicalContext}
                  </p>
                  <div className="text-2xs text-slate-500 mt-1">
                    Référence cartographique : <span className="font-medium text-slate-800">{doc.geologicalMapRef}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-sm">Gestion de l’Exploitation Artisanale</h3>
                  <p className="leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {doc.artisanalManagementPlan}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-sm">Encadrement Technique &amp; RH</h3>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                    <div>Responsable : <span className="font-semibold text-slate-800">{doc.technicalManager.name}</span></div>
                    <div>Effectif permanent : <span className="font-semibold text-slate-800">{doc.totalStaffCount} employés</span> ({doc.nationalStaffCount} Nationaux / {doc.expatriateStaffCount} Expatriés)</div>
                    <div>Priorité à l’emploi local : <span className="text-emerald-700 font-medium">Engagée (Commune de {doc.commune})</span></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-sm">Travaux Programmés</h3>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                    <div>• Méthodes de détection : {doc.remoteSensingMethods.join(' · ')}</div>
                    <div>• Forages prévus : <span className="font-semibold text-slate-800">{doc.drillingCount} forages</span> ({doc.drillingDepthM} m cumulés)</div>
                    <div>• Tranchées &amp; puits : <span className="font-semibold text-slate-800">{doc.trenchesLengthM} m</span> de tranchées, <span className="font-semibold text-slate-800">{doc.pitsCount} puits</span></div>
                    <div>• Laboratoires d’analyses : <span className="font-semibold text-slate-800">{doc.laboratories.join(' et ')}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-sm">Produits Chimiques Déclarés (Tableau II-3)</h3>
                  <div className="space-y-1.5">
                    {doc.chemicals.map((chem, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-100">
                        <div className="font-semibold text-slate-800">{chem.name}</div>
                        <div className="text-2xs text-slate-500">
                          Quantité : <span className="font-mono text-slate-700">{chem.quantity}</span> · Provenance : {chem.source}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'editor' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <p className="text-slate-600">
                  Ajustez ici les champs extraits pour n'importe quel document PDF avant de générer le CCM officiel.
                </p>
                <button
                  onClick={saveManualEdits}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center gap-1.5"
                >
                  {savedSuccess ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  {savedSuccess ? 'Enregistré avec succès !' : 'Appliquer les modifications'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-2xs font-semibold text-slate-600 mb-1">Numéro du Permis :</label>
                  <input
                    type="text"
                    value={editPermit}
                    onChange={e => setEditPermit(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-slate-600 mb-1">Titulaire / Société :</label>
                  <input
                    type="text"
                    value={editApplicant}
                    onChange={e => setEditApplicant(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-slate-600 mb-1">Gérant / Représentant :</label>
                  <input
                    type="text"
                    value={editManager}
                    onChange={e => setEditManager(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-slate-600 mb-1">NIF (Identification fiscale) :</label>
                  <input
                    type="text"
                    value={editNif}
                    onChange={e => setEditNif(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-slate-600 mb-1">Région :</label>
                  <input
                    type="text"
                    value={editRegion}
                    onChange={e => setEditRegion(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-slate-600 mb-1">District :</label>
                  <input
                    type="text"
                    value={editDistrict}
                    onChange={e => setEditDistrict(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-slate-600 mb-1">Commune :</label>
                  <input
                    type="text"
                    value={editCommune}
                    onChange={e => setEditCommune(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-slate-600 mb-1">Nombre de carrés :</label>
                  <input
                    type="number"
                    value={editCarres}
                    onChange={e => setEditCarres(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-slate-600 mb-1">Substances minérales :</label>
                  <input
                    type="text"
                    value={editMinerals}
                    onChange={e => setEditMinerals(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold text-slate-600 mb-1">Substance principale :</label>
                  <input
                    type="text"
                    value={editMainMineral}
                    onChange={e => setEditMainMineral(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'tables' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Tableau V-2 : Liste et coût des matériels à utiliser
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-2xs uppercase tracking-wider font-semibold text-slate-600">
                      <tr>
                        <th className="px-3 py-2">Matériel</th>
                        <th className="px-3 py-2">Caractéristiques</th>
                        <th className="px-3 py-2 text-right">Quantité</th>
                        <th className="px-3 py-2 text-right">P.U (MGA)</th>
                        <th className="px-3 py-2 text-right">Total (MGA)</th>
                        <th className="px-3 py-2">Mode</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 tabular-nums font-mono text-2xs">
                      {doc.equipmentList.map(eq => (
                        <tr key={eq.id}>
                          <td className="px-3 py-1.5 font-sans font-medium text-slate-900">{eq.name}</td>
                          <td className="px-3 py-1.5 font-sans text-slate-500 max-w-xs truncate">{eq.specs}</td>
                          <td className="px-3 py-1.5 text-right">{eq.quantity}</td>
                          <td className="px-3 py-1.5 text-right">{eq.unitPriceMGA.toLocaleString('fr-FR')}</td>
                          <td className="px-3 py-1.5 text-right font-semibold text-slate-900">
                            {(eq.unitPriceMGA * eq.quantity).toLocaleString('fr-FR')}
                          </td>
                          <td className="px-3 py-1.5 font-sans">
                            <span className="px-2 py-0.5 rounded text-2xs font-sans bg-slate-100 text-slate-700">
                              {eq.acquisitionType}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'rawText' && (
            <div className="space-y-3">
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-lg text-2xs font-mono max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {rawTextPreview || `[Document : ${doc.fileName}]\nPermis n° ${doc.permitNumber}\nTitulaire : ${doc.applicantName}\nSubstances : ${doc.mineralsProject.join(', ')}\nRégion : ${doc.region} | District : ${doc.district} | Commune : ${doc.commune}`}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ClipboardPaste className="w-5 h-5 text-emerald-600" />
              Coller le Texte ou l'OCR d'un Document Minier
            </h3>
            <p className="text-xs text-slate-500">
              Collez ici le texte brut extrait de votre document pour exécuter automatiquement l'extraction des données et l'évaluation.
            </p>
            <textarea
              rows={10}
              value={pastedText}
              onChange={e => setPastedText(e.target.value)}
              placeholder="Collez ici le texte (ex: Permis Numero: 37255, Titulaire: ..., Substances: ..., etc.)"
              className="w-full text-xs font-mono p-3 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handlePasteSubmit}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Analyser ce texte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
