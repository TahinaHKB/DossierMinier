import React, { useState } from 'react';
import { Copy, Check, Table, Download } from 'lucide-react';
import { FullEvaluationReport, MiningPermitDocument } from '../types/mining';

interface AdjustedTablesExcelViewProps {
  doc: MiningPermitDocument;
  report: FullEvaluationReport;
}

export const AdjustedTablesExcelView: React.FC<AdjustedTablesExcelViewProps> = ({
  doc,
  report
}) => {
  const [copiedSheet, setCopiedSheet] = useState<string | null>(null);

  const copyToClipboard = (text: string, sheetName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSheet(sheetName);
    setTimeout(() => setCopiedSheet(null), 2500);
  };

  // 1. Investissement par phase (TSV pour Excel)
  const getInvestTsv = () => {
    let tsv = "Désignation des activités\tMontant (MGA)\tDébut\tDurée prévisionnelle\n";
    tsv += "Phase préparatoire\t\t\t\n";
    doc.investmentsPhase.filter(i => i.phase === 'Phase préparatoire').forEach(i => {
      const amt = i.id === 'inv-2' ? report.pivots.coutMateriel1 : i.initialAmountMGA;
      tsv += `${i.activity}\t${amt}\t${i.startMonth}\t${i.duration}\n`;
    });
    tsv += "Phase de recherche\t\t\t\n";
    doc.investmentsPhase.filter(i => i.phase === 'Phase de recherche').forEach(i => {
      tsv += `${i.activity}\t${i.initialAmountMGA}\t${i.startMonth}\t${i.duration}\n`;
    });
    tsv += "Phase de fermeture/restauration\t\t\t\n";
    doc.investmentsPhase.filter(i => i.phase === 'Phase de fermeture/restauration').forEach(i => {
      tsv += `${i.activity}\t${i.initialAmountMGA}\t${i.startMonth}\t${i.duration}\n`;
    });
    tsv += `TOTAL\t${report.pivots.totalInvestissementAjuste}\t\t\n`;
    return tsv;
  };

  // 2. Liste matériels V.2 (TSV)
  const getEquipmentTsv = () => {
    let tsv = "Matériel\tCaractéristiques\tQuantité / Nombre\tPrix Unitaire (MGA)\tMontant (MGA)\tAchat / Location / Sous-traitance\n";
    doc.equipmentList.forEach(eq => {
      tsv += `${eq.name}\t${eq.specs}\t${eq.quantity}\t${eq.unitPriceMGA}\t${eq.unitPriceMGA * eq.quantity}\t${eq.acquisitionType}\n`;
    });
    tsv += `TOTAL (MGA)\t\t\t\t${report.pivots.sommeTotaleV2}\t\n`;
    return tsv;
  };

  // 3. CMRM (TSV - 13 types standard)
  const getCmrmTsv = () => {
    let tsv = "N°\tTypes de dépenses\tCaution / garantie bancaire\tConsignation de fonds\tAutre garantie de financement (Apport de fonds d'associés)\n";
    doc.cmrmDeclared.forEach(c => {
      const amt = c.code === 10 ? report.pivots.coutMateriel1 : c.initialAmountMGA;
      tsv += `${c.code}\t${c.category}\t0\t0\t${amt}\n`;
    });
    tsv += `Total\t\t0\t0\t${report.pivots.totalCmrmAjuste}\n`;
    return tsv;
  };

  // 4. Financement (TSV)
  const getFinancingTsv = () => {
    let tsv = "Source\tForme (Numéraire / Nature)\tUtilisation\tMontant (MGA)\n";
    doc.financingBreakdown.forEach(f => {
      const amt = f.id === 'f-10' ? report.pivots.coutMateriel1 : f.amountMGA;
      tsv += `${f.source}\t${f.form}\t${f.use}\t${amt}\n`;
    });
    tsv += `Total\t\t\t${report.pivots.planFinancementAjuste}\n`;
    return tsv;
  };

  // 5. Provision environnementale (TSV)
  const getEnvTsv = () => {
    let tsv = "Activités\tMontant (MGA)\n";
    doc.environmentalProvision.forEach(e => {
      tsv += `${e.activity}\t${e.amountMGA}\n`;
    });
    const totalEnv = doc.environmentalProvision.reduce((s, e) => s + e.amountMGA, 0);
    tsv += `Totale\t${totalEnv}\n`;
    return tsv;
  };

  const downloadAllAsCsv = () => {
    const combined = `=== FEUILLE 1 : INVESTISSEMENT PAR PHASE ===\n${getInvestTsv()}\n\n` +
      `=== FEUILLE 2 : LISTE ET COUT DES MATERIELS ===\n${getEquipmentTsv()}\n\n` +
      `=== FEUILLE 3 : CMRM (13 CATEGORIES) ===\n${getCmrmTsv()}\n\n` +
      `=== FEUILLE 4 : REPARTITION DU FINANCEMENT ===\n${getFinancingTsv()}\n\n` +
      `=== FEUILLE 5 : PROVISION ENVIRONNEMENTALE ===\n${getEnvTsv()}`;

    const blob = new Blob([combined], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tableaux_Ajustes_PTPF_${doc.permitNumber}_Excel.tsv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">
            Prompt 2 du Guide d'Évaluation · Exportation Directe
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Table className="w-6 h-6 text-emerald-600" />
            Tableaux Ajustés Prêts pour Excel
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Données financières recalculées conformément aux étapes 3, 4 et 5 du Guide ministériel. Copiez chaque tableau en un clic pour le coller directement dans Microsoft Excel ou téléchargez le fichier complet.
          </p>
        </div>

        <button
          onClick={downloadAllAsCsv}
          className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Download className="w-4 h-4" />
          Télécharger le classeur complet (.tsv)
        </button>
      </div>

      <div className="space-y-6">
        {/* Sheet 1: Investissement par phase */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Feuille 1 : Investissement par Phase (Ajusté)
            </h3>
            <button
              onClick={() => copyToClipboard(getInvestTsv(), 'invest')}
              className="px-3 py-1.5 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
            >
              {copiedSheet === 'invest' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSheet === 'invest' ? 'Copié dans le presse-papier !' : 'Copier pour Excel'}
            </button>
          </div>
          <pre className="bg-slate-950 text-slate-300 p-3.5 rounded-lg font-mono text-2xs overflow-x-auto max-h-48 whitespace-pre leading-relaxed">
            {getInvestTsv()}
          </pre>
        </div>

        {/* Sheet 2: Matériels V.2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Feuille 2 : Liste et Coût des Matériels (Tableau V.2)
            </h3>
            <button
              onClick={() => copyToClipboard(getEquipmentTsv(), 'eq')}
              className="px-3 py-1.5 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
            >
              {copiedSheet === 'eq' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSheet === 'eq' ? 'Copié dans le presse-papier !' : 'Copier pour Excel'}
            </button>
          </div>
          <pre className="bg-slate-950 text-slate-300 p-3.5 rounded-lg font-mono text-2xs overflow-x-auto max-h-48 whitespace-pre leading-relaxed">
            {getEquipmentTsv()}
          </pre>
        </div>

        {/* Sheet 3: CMRM */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Feuille 3 : CMRM (13 Catégories Standard Révisées)
            </h3>
            <button
              onClick={() => copyToClipboard(getCmrmTsv(), 'cmrm')}
              className="px-3 py-1.5 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
            >
              {copiedSheet === 'cmrm' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSheet === 'cmrm' ? 'Copié dans le presse-papier !' : 'Copier pour Excel'}
            </button>
          </div>
          <pre className="bg-slate-950 text-slate-300 p-3.5 rounded-lg font-mono text-2xs overflow-x-auto max-h-48 whitespace-pre leading-relaxed">
            {getCmrmTsv()}
          </pre>
        </div>

        {/* Sheet 4: Financement & Sheet 5: Provision environnementale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Feuille 4 : Financement
              </h3>
              <button
                onClick={() => copyToClipboard(getFinancingTsv(), 'fin')}
                className="px-3 py-1.5 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
              >
                {copiedSheet === 'fin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSheet === 'fin' ? 'Copié' : 'Copier'}
              </button>
            </div>
            <pre className="bg-slate-950 text-slate-300 p-3.5 rounded-lg font-mono text-2xs overflow-x-auto max-h-40 whitespace-pre leading-relaxed">
              {getFinancingTsv()}
            </pre>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Feuille 5 : Provision Environnementale
              </h3>
              <button
                onClick={() => copyToClipboard(getEnvTsv(), 'env')}
                className="px-3 py-1.5 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5"
              >
                {copiedSheet === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSheet === 'env' ? 'Copié' : 'Copier'}
              </button>
            </div>
            <pre className="bg-slate-950 text-slate-300 p-3.5 rounded-lg font-mono text-2xs overflow-x-auto max-h-40 whitespace-pre leading-relaxed">
              {getEnvTsv()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
