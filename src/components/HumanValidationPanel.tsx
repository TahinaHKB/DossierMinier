import React, { useState } from 'react';
import {
  CheckCircle2,
  ShieldAlert,
  UserCheck,
  FileCheck,
  ArrowRight,
  Stamp,
  RotateCcw
} from 'lucide-react';
import { FullEvaluationReport, MiningPermitDocument } from '../types/mining';

interface HumanValidationPanelProps {
  report: FullEvaluationReport;
  doc: MiningPermitDocument;
  onValidate: (evaluatorName: string, notes: string) => void;
  onResetValidation: () => void;
  onProceedToCcm: () => void;
}

export const HumanValidationPanel: React.FC<HumanValidationPanelProps> = ({
  report,
  doc,
  onValidate,
  onResetValidation,
  onProceedToCcm
}) => {
  const [evaluatorName, setEvaluatorName] = useState('Ing. Jean-Luc RAKOTOMANANA');
  const [evaluatorRole, setEvaluatorRole] = useState('Ingénieur Minier Principal — Rapporteur');
  const [generalNotes, setGeneralNotes] = useState(
    `Évaluation technique et financière validée avec avis favorable. L'opérateur AMBILOBE MINERALS S.A.R.L.U. doit formaliser le CV du responsable technique des travaux avant la déclaration d'ouverture de chantier. Les valeurs pivots réglementaires (Coût Matériel 1 = 119 525 600 MGA, CMRM = 476 210 875 MGA) sont adoptées de plein droit pour le Cahier des Charges Minières.`
  );

  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState(true);
  const [check4, setCheck4] = useState(true);

  const allChecked = check1 && check2 && check3 && check4;

  const handleConfirmValidation = () => {
    onValidate(evaluatorName, generalNotes);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">
              Étape 3 du Protocole · Examen Collégial
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-emerald-600" />
              Vérification Humaine &amp; Validation par l'Ingénieur Minier
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Examen contradictoire des résultats calculés par l'algorithme d'évaluation. La validation humaine est obligatoire avant le remplissage officiel et l’export du Canevas de Cahier des Charges Minières (CCM).
            </p>
          </div>

          {report.isOfficiallyValidated ? (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Stamp className="w-4 h-4 text-emerald-600" />
                Dossier Validé Officiellement
              </div>
              <button
                onClick={onResetValidation}
                className="px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                title="Annuler la validation pour modifier"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Modifier
              </button>
              <button
                onClick={onProceedToCcm}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs"
              >
                Accéder au Canevas CCM
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConfirmValidation}
              disabled={!allChecked}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-xs ${
                allChecked
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Valider et Déverrouiller le CCM
            </button>
          )}
        </div>
      </div>

      {/* Validation Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Checklist */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-slate-500" />
            Points de Contrôle Obligatoires par l'Expert Minier
          </h2>

          <div className="space-y-3 text-xs">
            {/* Checklist item 1 */}
            <label className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
              check1 ? 'bg-emerald-50/40 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={check1}
                onChange={e => setCheck1(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <div className="space-y-1">
                <div className="font-bold text-slate-900">
                  1. Concordance Juridique des Substances (Chapitre I)
                </div>
                <div className="text-slate-600 leading-relaxed">
                  Je certifie avoir vérifié que les substances du programme (<span className="font-semibold text-slate-800">{doc.mineralsProject.join(', ')}</span>) sont strictement incluses dans le titre n° <span className="font-semibold text-slate-800">{doc.permitNumber}</span> et que le demandeur <span className="font-semibold text-slate-800">{doc.applicantName}</span> est éligible sans litige cadastral.
                </div>
              </div>
            </label>

            {/* Checklist item 2 */}
            <label className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
              check2 ? 'bg-emerald-50/40 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={check2}
                onChange={e => setCheck2(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <div className="space-y-1">
                <div className="font-bold text-slate-900">
                  2. Validation du COÛT MATÉRIEL 1 &amp; Règle Pivot (Étapes 3 et 5)
                </div>
                <div className="text-slate-600 leading-relaxed">
                  Je valide l'application de la formule pivot: Somme V.2 ({report.pivots.sommeTotaleV2.toLocaleString('fr-FR')} MGA) déduite des sous-traitances forages et drone ({report.pivots.totalSousTraitance.toLocaleString('fr-FR')} MGA) fixant le <span className="font-bold text-emerald-800 font-mono">COÛT MATÉRIEL 1 = {report.pivots.coutMateriel1.toLocaleString('fr-FR')} MGA</span>. Le poste d'acquisition de V.1 a été réévalué en conséquence.
                </div>
              </div>
            </label>

            {/* Checklist item 3 */}
            <label className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
              check3 ? 'bg-emerald-50/40 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={check3}
                onChange={e => setCheck3(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <div className="space-y-1">
                <div className="font-bold text-slate-900">
                  3. Couverture CMRM &amp; Solvabilité (Étapes 4 et 6)
                </div>
                <div className="text-slate-600 leading-relaxed">
                  Je confirme que l'Investissement Total Ajusté (<span className="font-mono font-semibold text-slate-900">{report.pivots.totalInvestissementAjuste.toLocaleString('fr-FR')} MGA</span>) est supérieur ou égal au Total CMRM (<span className="font-mono font-semibold text-slate-900">{report.pivots.totalCmrmAjuste.toLocaleString('fr-FR')} MGA</span>), respectant le seuil légal. Le promoteur fournira la garantie bancaire correspondante sous 3 mois.
                </div>
              </div>
            </label>

            {/* Checklist item 4 */}
            <label className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
              check4 ? 'bg-emerald-50/40 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <input
                type="checkbox"
                checked={check4}
                onChange={e => setCheck4(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <div className="space-y-1">
                <div className="font-bold text-slate-900">
                  4. Engagements RSE &amp; Dotation PRSE (Étape 7 &amp; Loi n° 2023-007)
                </div>
                <div className="text-slate-600 leading-relaxed">
                  Je valide le budget RSE consenti de <span className="font-mono font-semibold text-slate-900">{report.pivots.rseAjuste.toLocaleString('fr-FR')} MGA</span> (&gt; 2% de l'investissement) et la dotation annuelle tripartite PRSE de <span className="font-mono font-semibold text-slate-900">{report.pivots.prseAnnuelRequis.toLocaleString('fr-FR')} MGA / an</span> au bénéfice de la commune de <span className="font-semibold text-slate-800">{doc.commune}</span>.
                </div>
              </div>
            </label>
          </div>

          {/* Expert Observations Field */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
              Avis &amp; Prescriptions Particulières de l'Évaluateur
            </label>
            <textarea
              rows={4}
              value={generalNotes}
              onChange={e => setGeneralNotes(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-800 leading-relaxed font-sans"
              placeholder="Consignez ici les remarques, réserves ou ajustements requis..."
            />
          </div>
        </div>

        {/* Right: Signatory Information & Status Card */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Identité de l'Agent Évaluateur
            </h3>

            <div>
              <label className="block text-2xs text-slate-500 mb-1 font-medium">Nom de l'Ingénieur / Rapporteur :</label>
              <input
                type="text"
                value={evaluatorName}
                onChange={e => setEvaluatorName(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-2xs text-slate-500 mb-1 font-medium">Fonction / Direction :</label>
              <input
                type="text"
                value={evaluatorRole}
                onChange={e => setEvaluatorRole(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 text-slate-900"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-2xs text-slate-600 space-y-1">
              <div>Date d'examen : <span className="font-semibold text-slate-800">{report.evaluationDate}</span></div>
              <div>Commission : Direction de la Promotion des Grandes Mines</div>
              <div>Régime : Loi n° 2023-007 portant refonte du Code Minier</div>
            </div>

            {!report.isOfficiallyValidated && (
              <button
                onClick={handleConfirmValidation}
                disabled={!allChecked}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                  allChecked
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Valider l'Évaluation
              </button>
            )}

            {report.isOfficiallyValidated && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <Stamp className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-emerald-900">
                  Évaluation Officiellement Validée
                </div>
                <div className="text-2xs text-emerald-700">
                  Signé par {evaluatorName} le {report.evaluationDate}
                </div>
                <button
                  onClick={onProceedToCcm}
                  className="w-full mt-2 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  Ouvrir le Canevas CCM Rempli
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Alert Box if any warning was found */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Prescriptions Particulières Notifiées
            </div>
            <ul className="list-disc list-inside space-y-1 text-2xs text-amber-800/90 leading-relaxed">
              <li>L’opérateur doit formaliser le CV détaillé du responsable technique géologue.</li>
              <li>Ajustement du plan de financement pour couvrir l’investissement réévalué (906 488 375 MGA).</li>
              <li>Signature de la convention tripartite PRSE dans un délai de 6 mois après octroi du permis.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
