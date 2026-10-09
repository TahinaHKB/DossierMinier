import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  AlertTriangle,
  Calculator,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Lock,
  Compass
} from 'lucide-react';
import { FullEvaluationReport, MiningPermitDocument } from '../types/mining';

interface EvaluationSectionProps {
  report: FullEvaluationReport;
  doc: MiningPermitDocument;
  onProceedToValidation: () => void;
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  report,
  doc: _doc,
  onProceedToValidation
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string>('all');

  const stepsList = [
    { id: 'etape1_substances', step: report.steps.etape1_substances, max: 20 },
    { id: 'etape2a_geologie', step: report.steps.etape2a_geologie, max: 15 },
    { id: 'etape2b_programme', step: report.steps.etape2b_programme, max: 25 },
    { id: 'etape2c_rh', step: report.steps.etape2c_rh, max: 10 },
    { id: 'etape3_materiels', step: report.steps.etape3_materiels, max: 0, isPivot: true },
    { id: 'etape4_cmrm', step: report.steps.etape4_cmrm, max: 0, isPivot: true },
    { id: 'etape5_pertinence', step: report.steps.etape5_pertinence, max: 20 },
    { id: 'etape6_financement', step: report.steps.etape6_financement, max: 15 },
    { id: 'etape7_declaration_prse', step: report.steps.etape7_declaration_prse, max: 5 }
  ];

  const getVerdictStyle = () => {
    if (report.verdict === 'DOSSIER_CONFORME') {
      return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        card: 'bg-emerald-50/50 border-emerald-200',
        title: 'DOSSIER CONFORME — AVIS FAVORABLE'
      };
    }
    if (report.verdict === 'ACCEPTABLE_AJUSTEMENTS') {
      return {
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        card: 'bg-amber-50/50 border-amber-200',
        title: 'ACCEPTABLE — AJUSTEMENTS NÉCESSAIRES'
      };
    }
    return {
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      card: 'bg-rose-50/50 border-rose-200',
      title: 'NON ADMISSIBLE — DCI ÉMISE'
    };
  };

  const verdictStyle = getVerdictStyle();

  return (
    <div className="space-y-6">
      {/* Top Banner: Global Score & Verdict */}
      <div className={`p-6 rounded-xl border ${verdictStyle.card} shadow-xs`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${verdictStyle.badge}`}>
                {verdictStyle.title}
              </span>
              <span className="text-xs text-slate-500">
                Direction de la Promotion des Grandes Mines
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Résultat Global de l’Évaluation Algorithmique
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              {report.administrativeConsequence}
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-right">
              <div className="text-2xs uppercase tracking-wider text-slate-400 font-semibold">
                Score Global PTPF
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                {report.totalScore}
                <span className="text-sm font-normal text-slate-400 font-sans"> / {report.maxScore} pts</span>
              </div>
              <div className="text-2xs text-slate-500 mt-0.5">
                Seuil d'approbation : ≥ 95 pts
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={onProceedToValidation}
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                Passer à la validation humaine
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Immutable Pivot Values Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Les 4 Valeurs Pivots Immuables du Guide d’Évaluation v2.0
            </h3>
          </div>
          <span className="text-2xs text-slate-400">
            Immuables une fois calculées · Reportées à toutes les étapes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
            <div className="text-2xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Calculator className="w-3.5 h-3.5 text-blue-400" /> Pivot 1 : COÛT MATÉRIEL 1
            </div>
            <div className="text-base font-bold font-mono text-blue-300 tabular-nums">
              {report.pivots.coutMateriel1.toLocaleString('fr-FR')} MGA
            </div>
            <div className="text-2xs text-slate-400 mt-1">
              Somme V.2 − Sous-traitances
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
            <div className="text-2xs text-slate-400 flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Pivot 2 : TOTAL CMRM AJUSTÉ
            </div>
            <div className="text-base font-bold font-mono text-amber-300 tabular-nums">
              {report.pivots.totalCmrmAjuste.toLocaleString('fr-FR')} MGA
            </div>
            <div className="text-2xs text-slate-400 mt-1">
              Initial : 364 450 775 (+111 760 100)
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
            <div className="text-2xs text-slate-400 flex items-center gap-1.5 mb-1">
              <CoinsIcon className="w-3.5 h-3.5 text-emerald-400" /> Pivot 3 : TOTAL INVESTISSEMENT (I_adj)
            </div>
            <div className="text-base font-bold font-mono text-emerald-300 tabular-nums">
              {report.pivots.totalInvestissementAjuste.toLocaleString('fr-FR')} MGA
            </div>
            <div className="text-2xs text-slate-400 mt-1">
              ≥ CMRM ({report.pivots.totalCmrmAjuste.toLocaleString('fr-FR')} MGA)
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
            <div className="text-2xs text-slate-400 flex items-center gap-1.5 mb-1">
              <FileCheck2 className="w-3.5 h-3.5 text-purple-400" /> Pivot 4 : RSE AJUSTÉ &amp; PRSE
            </div>
            <div className="text-base font-bold font-mono text-purple-300 tabular-nums">
              {report.pivots.rseAjuste.toLocaleString('fr-FR')} MGA
            </div>
            <div className="text-2xs text-slate-400 mt-1">
              PRSE annuel : {report.pivots.prseAnnuelRequis.toLocaleString('fr-FR')} MGA/an
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Step Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedStepId('all')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedStepId === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Toutes les Étapes (1 à 7)
        </button>
        {stepsList.map(item => (
          <button
            key={item.id}
            onClick={() => setSelectedStepId(item.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedStepId === item.id
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{item.step.stepNumber}</span>
            {item.max > 0 && (
              <span className="font-mono text-2xs opacity-75">
                ({item.step.currentScore}/{item.max})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Step Cards List */}
      <div className="space-y-6">
        {stepsList
          .filter(item => selectedStepId === 'all' || selectedStepId === item.id)
          .map(item => {
            const step = item.step;
            const isFullyConforme = step.status === 'CONFORME';

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"
              >
                {/* Step Header */}
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {step.stepNumber}
                      </span>
                      <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${
                        isFullyConforme
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : step.status === 'ACCEPTABLE'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {step.summary}
                    </p>
                  </div>

                  {item.max > 0 && (
                    <div className="text-right shrink-0 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-2xs">
                      <div className="text-2xs uppercase tracking-wider text-slate-400 font-semibold">
                        Note attribuée
                      </div>
                      <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                        {step.currentScore}
                        <span className="text-xs text-slate-400 font-normal"> / {item.max} pts</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-5">
                  {/* Arithmetic Operations Required by Guide Rule 1 */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-slate-500" />
                      Calculs Arithmétiques selon Règle Absolue n°1 [A] × [B] = [Résultat]
                    </h4>
                    <div className="bg-slate-950 text-emerald-300 p-3.5 rounded-lg font-mono text-2xs space-y-1 overflow-x-auto shadow-inner">
                      {step.arithmeticOperations.map((op, idx) => (
                        <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                          {op}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Résultat Attendu Table */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-slate-500" />
                      Tableau « Résultat Attendu » selon Guide Officiel
                    </h4>
                    <div className="border border-slate-200 rounded-lg overflow-x-auto">
                      <table className="w-full text-left text-xs divide-y divide-slate-200">
                        <thead className="bg-slate-50 text-2xs uppercase tracking-wider font-semibold text-slate-600">
                          <tr>
                            <th className="px-3.5 py-2">Paramètre d’Évaluation</th>
                            <th className="px-3.5 py-2">Valeur Contrôlée</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-2xs">
                          {Object.entries(step.tableResultData).map(([key, val], idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="px-3.5 py-2 font-medium text-slate-700 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </td>
                              <td className="px-3.5 py-2 font-mono text-slate-900 font-semibold">
                                {String(val)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Findings and Alerts */}
                  {step.findings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Observations &amp; Recommandations
                      </h4>
                      {step.findings.map((f, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border text-xs flex items-start gap-3 ${
                            f.severity === 'success'
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                              : f.severity === 'warning'
                              ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                              : 'bg-rose-50/60 border-rose-200 text-rose-900'
                          }`}
                        >
                          {f.severity === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-1">
                            <div className="font-semibold">{f.category} : {f.message}</div>
                            {f.actionRequired && (
                              <div className="text-2xs font-medium text-slate-700 bg-white/70 p-1.5 rounded border border-slate-200/50">
                                <strong>Action requise de l’Administration :</strong> {f.actionRequired}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Synthesis Table Étape 8 */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Étape 8 — Grille de Synthèse Récapitulative (Score Global 110 pts)
          </h3>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-2xs uppercase tracking-wider font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-2.5">Chapitre</th>
                <th className="px-4 py-2.5">Intitulé</th>
                <th className="px-4 py-2.5 text-right">Max Pts</th>
                <th className="px-4 py-2.5 text-right">Score Obtenu</th>
                <th className="px-4 py-2.5">Critère DCI Prioritaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 tabular-nums font-mono text-2xs">
              <tr>
                <td className="px-4 py-2 text-slate-500 font-sans font-medium">I</td>
                <td className="px-4 py-2 font-sans font-medium text-slate-900">Identification du Projet</td>
                <td className="px-4 py-2 text-right">20</td>
                <td className="px-4 py-2 text-right font-bold text-slate-900">{report.steps.etape1_substances.currentScore}</td>
                <td className="px-4 py-2 font-sans text-slate-500">Discordance substance/titre (Vérifiée Conforme)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-slate-500 font-sans font-medium">II</td>
                <td className="px-4 py-2 font-sans font-medium text-slate-900">Raisons du choix du périmètre</td>
                <td className="px-4 py-2 text-right">15</td>
                <td className="px-4 py-2 text-right font-bold text-slate-900">{report.steps.etape2a_geologie.currentScore}</td>
                <td className="px-4 py-2 font-sans text-slate-500">Aucune base géologique (Vérifiée Conforme)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-slate-500 font-sans font-medium">III</td>
                <td className="px-4 py-2 font-sans font-medium text-slate-900">Programme de Recherche</td>
                <td className="px-4 py-2 text-right">25</td>
                <td className="px-4 py-2 text-right font-bold text-slate-900">{report.steps.etape2b_programme.currentScore}</td>
                <td className="px-4 py-2 font-sans text-slate-500">Méthode inadaptée / Règle du tiers (Vérifiée Conforme)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-slate-500 font-sans font-medium">IV</td>
                <td className="px-4 py-2 font-sans font-medium text-slate-900">Ressources Humaines</td>
                <td className="px-4 py-2 text-right">10</td>
                <td className="px-4 py-2 text-right font-bold text-amber-600">{report.steps.etape2c_rh.currentScore}</td>
                <td className="px-4 py-2 font-sans text-amber-700">Responsable technique sans CV détaillé joint (Alerte émise)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-slate-500 font-sans font-medium">V</td>
                <td className="px-4 py-2 font-sans font-medium text-slate-900">Investissement (V.1, V.2, V.3)</td>
                <td className="px-4 py-2 text-right">20</td>
                <td className="px-4 py-2 text-right font-bold text-slate-900">{report.steps.etape5_pertinence.currentScore}</td>
                <td className="px-4 py-2 font-sans text-slate-500">Total &lt; CMRM / matériel critique (Coût Matériel 1 intégré)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-slate-500 font-sans font-medium">VI</td>
                <td className="px-4 py-2 font-sans font-medium text-slate-900">Plan de Financement + RSE</td>
                <td className="px-4 py-2 text-right">15</td>
                <td className="px-4 py-2 text-right font-bold text-slate-900">{report.steps.etape6_financement.currentScore}</td>
                <td className="px-4 py-2 font-sans text-slate-500">RSE absent / insolvabilité (RSE &gt; 2% conforme)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-slate-500 font-sans font-medium">VII</td>
                <td className="px-4 py-2 font-sans font-medium text-slate-900">Déclaration + PRSE</td>
                <td className="px-4 py-2 text-right">5</td>
                <td className="px-4 py-2 text-right font-bold text-slate-900">{report.steps.etape7_declaration_prse.currentScore}</td>
                <td className="px-4 py-2 font-sans text-slate-500">Déclaration signée, PRSE = RSE / 3</td>
              </tr>
              <tr className="bg-slate-50 font-bold font-sans text-xs">
                <td colSpan={2} className="px-4 py-3 text-slate-900">TOTAL SCORE GLOBAL</td>
                <td className="px-4 py-3 text-right font-mono">110</td>
                <td className="px-4 py-3 text-right font-mono text-emerald-700 text-sm">{report.totalScore}</td>
                <td className="px-4 py-3 text-emerald-800">
                  {report.totalScore >= 95 ? 'Dossier Conforme (≥ 95 pts)' : 'Ajustements requis'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function CoinsIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6"/>
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18"/>
      <path d="M7 6h1v4"/>
      <path d="m16.71 13.88.7.71-2.82 2.82"/>
    </svg>
  );
}
