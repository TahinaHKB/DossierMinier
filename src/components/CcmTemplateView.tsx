import React, { useState } from 'react';
import {
  Download,
  Printer,
  FileText,
  CheckCircle2,
  Lock,
  Edit3,
  Building,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { FullEvaluationReport, MiningPermitDocument } from '../types/mining';
import { generateCcmDocx } from '../utils/docxGenerator';
import { generateCcmPdf } from '../utils/pdfGenerator';

interface CcmTemplateViewProps {
  doc: MiningPermitDocument;
  report: FullEvaluationReport;
  onUpdateDoc?: (updatedDoc: MiningPermitDocument) => void;
}

export const CcmTemplateView: React.FC<CcmTemplateViewProps> = ({
  doc,
  report,
  onUpdateDoc
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Editable temporary fields
  const [editableTitulaire, setEditableTitulaire] = useState(doc.applicantName);
  const [editableGerant, setEditableGerant] = useState(doc.managerName);
  const [editableSiege, setEditableSiege] = useState(doc.headquarters);
  const [editableProjet, setEditableProjet] = useState(doc.projectTitle);

  const handleDownloadDocx = async () => {
    setIsGeneratingDocx(true);
    try {
      const currentDoc = {
        ...doc,
        applicantName: editableTitulaire,
        managerName: editableGerant,
        headquarters: editableSiege,
        projectTitle: editableProjet
      };
      const blob = await generateCcmDocx(currentDoc, report);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Cahier_des_Charges_Minieres_PR_${doc.permitNumber}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur export DOCX:', err);
      alert('Erreur lors de la génération du document DOCX.');
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      const currentDoc = {
        ...doc,
        applicantName: editableTitulaire,
        managerName: editableGerant,
        headquarters: editableSiege,
        projectTitle: editableProjet
      };
      const pdf = generateCcmPdf(currentDoc, report);
      pdf.save(`Cahier_des_Charges_Minieres_PR_${doc.permitNumber}.pdf`);
    } catch (err) {
      console.error('Erreur export PDF:', err);
      alert('Erreur lors de la génération du document PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const saveEdits = () => {
    if (onUpdateDoc) {
      onUpdateDoc({
        ...doc,
        applicantName: editableTitulaire,
        managerName: editableGerant,
        headquarters: editableSiege,
        projectTitle: editableProjet
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-5">
      {/* Action Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-6 shadow-2xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-2xs uppercase tracking-wider font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
              <span>Modèle Ministériel Officiel</span>
              <span>·</span>
              <span className="text-emerald-700 font-medium">Loi n° 2023-007</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Cahier des Charges Minières (CCM) Généré
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Document officiel pré-rempli à partir des données validées du PTPF n° {doc.permitNumber} et intégrant les 4 valeurs pivots révisées.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => (isEditing ? saveEdits() : setIsEditing(true))}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isEditing
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? 'Enregistrer' : 'Modifier'}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimer
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {isGeneratingPdf ? 'Génération...' : 'PDF (.pdf)'}
            </button>

            <button
              onClick={handleDownloadDocx}
              disabled={isGeneratingDocx}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              {isGeneratingDocx ? 'Génération...' : 'Word (.docx)'}
            </button>
          </div>
        </div>

        {!report.isOfficiallyValidated && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-2xs text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Note administrative :</strong> Ce canevas a été généré automatiquement par l’algorithme. Pour lui conférer pleine valeur juridique avant transmission à l'opérateur, effectuez la signature dans l'onglet <strong>« 3. Validation Humaine »</strong>.
            </span>
          </div>
        )}
      </div>

      {/* Official Form Document Body (Printable Page Layout) */}
      <div className="bg-white border border-slate-300 rounded-xl shadow-md p-4 sm:p-8 md:p-12 max-w-4xl mx-auto text-slate-900 leading-relaxed font-sans text-xs">
        {/* Official Header */}
        <div className="text-center pb-6 border-b border-slate-300 space-y-1">
          <div className="font-bold text-sm tracking-widest text-slate-900 uppercase">
            REPOBLIKAN'I MADAGASIKARA
          </div>
          <div className="italic text-xs text-slate-600">
            Fitiavana — Tanindrazana — Fandrosoana
          </div>
          <div className="font-bold text-xs tracking-wider text-slate-800 pt-1">
            MINISTÈRE DES MINES
          </div>
          <div className="text-2xs text-slate-600 uppercase font-medium">
            Direction de la Promotion des Grandes Mines
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-8 space-y-1.5">
          <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-tight text-slate-900 border-2 border-slate-900 py-2.5 px-4 inline-block">
            CAHIER DES CHARGES MINIÈRES DU PERMIS « PR » N° {doc.permitNumber}
          </h2>
          <div className="text-2xs text-slate-500 italic">
            Établi en application du Code Minier et du Décret portant Régimes des Permis Miniers
          </div>
        </div>

        {/* 1. INFORMATIONS GÉNÉRALES */}
        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1">
            1. INFORMATIONS GÉNÉRALES
          </h3>

          <div className="space-y-2">
            <h4 className="font-semibold text-xs text-slate-800">
              1.1 Renseignements sur le titulaire du Permis PR
            </h4>
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50/50">
                    <td className="w-1/3 p-2 font-medium text-slate-600">Dénomination :</td>
                    <td className="p-2 font-bold text-slate-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editableTitulaire}
                          onChange={e => setEditableTitulaire(e.target.value)}
                          className="w-full p-1 border rounded text-xs"
                        />
                      ) : (
                        editableTitulaire
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-slate-600">Forme juridique :</td>
                    <td className="p-2 font-semibold text-slate-900">{doc.legalForm}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-2 font-medium text-slate-600">Identification fiscale (NIF) :</td>
                    <td className="p-2 font-mono text-slate-900">{doc.taxId}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-slate-600">Siège ou domicile élu :</td>
                    <td className="p-2 text-slate-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editableSiege}
                          onChange={e => setEditableSiege(e.target.value)}
                          className="w-full p-1 border rounded text-xs"
                        />
                      ) : (
                        editableSiege
                      )}
                    </td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-2 font-medium text-slate-600">Gérant :</td>
                    <td className="p-2 font-bold text-slate-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editableGerant}
                          onChange={e => setEditableGerant(e.target.value)}
                          className="w-full p-1 border rounded text-xs"
                        />
                      ) : (
                        editableGerant
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <h4 className="font-semibold text-xs text-slate-800">
              1.2 Renseignements sur le projet / permis minier
            </h4>
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50/50">
                    <td className="w-1/3 p-2 font-medium text-slate-600">Nom du Projet :</td>
                    <td className="p-2 font-bold text-slate-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editableProjet}
                          onChange={e => setEditableProjet(e.target.value)}
                          className="w-full p-1 border rounded text-xs"
                        />
                      ) : (
                        `« ${editableProjet} »`
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-slate-600">Numéro des permis :</td>
                    <td className="p-2 font-mono font-bold text-slate-900">{doc.permitNumber}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-2 font-medium text-slate-600">Nombre de carrés par commune :</td>
                    <td className="p-2 text-slate-900">
                      {doc.carresCount} carrés ({doc.surfaceKm2} km²) — Commune de {doc.commune}, District {doc.district}, Région {doc.region} (Code BCMM : {doc.bcmmCode})
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-slate-600">Substances autorisées :</td>
                    <td className="p-2 font-bold text-emerald-800">{doc.mineralsTitle.join(', ')}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-2 font-medium text-slate-600">Situation du permis :</td>
                    <td className="p-2 text-slate-900">{doc.movementType}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 text-2xs text-slate-600 leading-relaxed">
            <strong>1.3 Objet du Cahier des Charges Minières :</strong> Le présent Cahier des charges minières (CCM) qui est annexé au Permis de Recherche numéro {doc.permitNumber} définit les engagements techniques et financiers du titulaire dans le cadre du suivi technique de ses activités minières relatives audit permis.
          </div>
        </div>

        {/* 2. PRESCRIPTION ADMINISTRATIVE */}
        <div className="space-y-3 mb-8">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1">
            2. PRESCRIPTION ADMINISTRATIVE
          </h3>
          <p className="text-2xs text-slate-700 leading-relaxed">
            <strong>2.1 Droits conférés aux titulaires des PR :</strong> Le permis de recherche « PR » confère à son titulaire le droit d'entreprendre à la fois la prospection et la recherche à l'intérieur de son périmètre.<br/>
            <strong>2.2 Droit d’Accès :</strong> Le titulaire s’engage à conclure et régler, dans un délai de six (06) mois après la délivrance de l'autorisation ou du permis environnemental par écrit, son droit d’accès sur la superficie du périmètre minier avec les propriétaires et usufruitiers.<br/>
            <strong>2.3 Transport des produits miniers extraits :</strong> Utilisation de laissez-passer réservée exclusivement aux échantillons de recherche envoyés en laboratoire d'analyse.<br/>
            <strong>2.4 Activités Minières des tiers :</strong> Interdiction absolue de tierces activités d'exploitation sauf couloirs artisanaux légalement institués.<br/>
            <strong>2.5 Compte-rendu :</strong> Fourniture obligatoire à l'Administration d'un rapport technique d'activités annuel selon les articles 271 du Code Minier et 190 du Décret d'application.
          </p>
        </div>

        {/* 3. PRESCRIPTIONS PARTICULIÈRES */}
        <div className="space-y-6 mb-8">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1">
            3. PRESCRIPTIONS PARTICULIÈRES
          </h3>

          <div>
            <h4 className="font-semibold text-xs text-slate-800 mb-2">
              3.2.1 Substances chimiques autorisées et confinées
            </h4>
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-2xs divide-y divide-slate-200">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2">Nom</th>
                    <th className="p-2">Source / Provenance</th>
                    <th className="p-2 text-right">Quantité</th>
                    <th className="p-2">Utilisation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {doc.chemicals.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2 font-medium text-slate-900">{c.name}</td>
                      <td className="p-2 text-slate-600">{c.source}</td>
                      <td className="p-2 text-right font-mono text-slate-900 font-semibold">{c.quantity}</td>
                      <td className="p-2 text-slate-600">{c.usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-slate-800 mb-2">
              3.2.2 Quantité prévisionnelle d'échantillons
            </h4>
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-2xs divide-y divide-slate-200">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2">Substances / Type de prélèvement</th>
                    <th className="p-2">Année 1</th>
                    <th className="p-2">Année 2</th>
                    <th className="p-2">Année 3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {doc.samplesForecast.map((s, i) => (
                    <tr key={i}>
                      <td className="p-2 font-medium text-slate-900">{s.category}</td>
                      <td className="p-2 font-mono text-slate-800">{s.year1}</td>
                      <td className="p-2 text-slate-400">{s.year2}</td>
                      <td className="p-2 text-slate-400">{s.year3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-slate-800 mb-1">
              3.4 Réalisation du Plan d'Investissement par Phase (Valeurs Pivot Révisées)
            </h4>
            <p className="text-2xs text-slate-500 mb-2 italic">
              * La ligne « Acquisition des matériels » intègre la valeur pivot COÛT MATÉRIEL 1 ({report.pivots.coutMateriel1.toLocaleString('fr-FR')} MGA) issue de l'évaluation officielle.
            </p>
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-2xs divide-y divide-slate-200">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2">Désignation des activités</th>
                    <th className="p-2 text-right">Montant Retenu (MGA)</th>
                    <th className="p-2">Début</th>
                    <th className="p-2">Durée prévisionnelle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {doc.investmentsPhase.map(item => {
                    const amount = item.id === 'inv-2' ? report.pivots.coutMateriel1 : item.initialAmountMGA;
                    return (
                      <tr key={item.id} className={item.id === 'inv-2' ? 'bg-emerald-50/70 font-semibold' : ''}>
                        <td className="p-1.5 font-sans text-slate-900">
                          {item.activity}
                          {item.id === 'inv-2' && (
                            <span className="ml-1 text-emerald-800 font-sans font-bold text-3xs">
                              [COÛT MATÉRIEL 1]
                            </span>
                          )}
                        </td>
                        <td className="p-1.5 text-right font-bold text-slate-900">
                          {amount.toLocaleString('fr-FR')} MGA
                        </td>
                        <td className="p-1.5 font-sans text-slate-600">{item.startMonth}</td>
                        <td className="p-1.5 font-sans text-slate-600">{item.duration}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-100 font-bold font-sans text-xs">
                    <td className="p-2 text-slate-900">TOTAL GÉNÉRAL INVESTISSEMENT AJUSTÉ (I_adj)</td>
                    <td className="p-2 text-right font-mono text-emerald-800">
                      {report.pivots.totalInvestissementAjuste.toLocaleString('fr-FR')} MGA
                    </td>
                    <td className="p-2">-</td>
                    <td className="p-2">36 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-slate-800 mb-2">
              3.5 Montant prévisionnel du Coût Minimum de Recherche Minière (CMRM Réglementaire)
            </h4>
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-2xs divide-y divide-slate-200">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2">N°</th>
                    <th className="p-2">13 Types de Dépenses Réglementaires</th>
                    <th className="p-2 text-right">Montant Garanti Retenu (MGA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {doc.cmrmDeclared.map(c => {
                    const amount = c.code === 10 ? report.pivots.coutMateriel1 : c.initialAmountMGA;
                    return (
                      <tr key={c.code} className={c.code === 10 ? 'bg-amber-50/70 font-semibold' : ''}>
                        <td className="p-1.5 text-slate-500">{c.code}</td>
                        <td className="p-1.5 font-sans text-slate-900">
                          {c.category}
                          {c.code === 10 && (
                            <span className="ml-1 text-amber-800 font-sans font-bold text-3xs">
                              [COÛT MATÉRIEL 1]
                            </span>
                          )}
                        </td>
                        <td className="p-1.5 text-right text-slate-900">
                          {amount.toLocaleString('fr-FR')} MGA
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-100 font-bold font-sans text-xs">
                    <td colSpan={2} className="p-2 text-slate-900">
                      TOTAL CMRM AJUSTÉ (GARANTIES FINANCIÈRES OBLIGATOIRES)
                    </td>
                    <td className="p-2 text-right font-mono text-emerald-800">
                      {report.pivots.totalCmrmAjuste.toLocaleString('fr-FR')} MGA
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-xs text-slate-800">
              3.8 Plan de Responsabilité Sociétale de l'Entreprise (PRSE &amp; Art. 242)
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-2xs space-y-1.5">
              <div>
                • Budget RSE global triennal consenti : <strong className="font-mono">{report.pivots.rseAjuste.toLocaleString('fr-FR')} MGA</strong> (≥ seuil minimal légal de 2% de l'investissement total ajusté soit {report.pivots.rseMinRequis.toLocaleString('fr-FR')} MGA).
              </div>
              <div>
                • Dotation annuelle PRSE (Convention Tripartite) : <strong className="font-mono text-emerald-800">{report.pivots.prseAnnuelRequis.toLocaleString('fr-FR')} MGA / an</strong>.
              </div>
              <div>
                • Le promoteur s'engage à déposer auprès du BCMM sous un délai maximum de six (06) mois les conventions tripartites signées avec la commune d'accueil ({doc.commune}) et les autorités locales.
              </div>
            </div>
          </div>
        </div>

        {/* 4. SIGNATURES */}
        <div className="pt-8 border-t border-slate-300">
          <div className="text-2xs text-slate-600 mb-6 italic">
            « Le titulaire certifie sur l'honneur que les déclarations ci-dessus sont sincères et complètes et s'engage à exécuter sans réserve le présent cahier des charges. »
          </div>

          <div className="flex justify-between items-start text-xs pt-4">
            <div className="space-y-1">
              <div className="text-2xs text-slate-500">Pour le Promoteur / Titulaire :</div>
              <div className="font-bold text-slate-900">{editableGerant}</div>
              <div className="text-2xs text-slate-600">Gérant — {editableTitulaire}</div>
              <div className="text-2xs text-slate-400 pt-4">[Signature &amp; Cachet de la Société]</div>
            </div>

            <div className="space-y-1 text-right">
              <div className="text-2xs text-slate-500">Antananarivo, le {doc.declarationDate}</div>
              <div className="text-2xs text-slate-500">Pour l'Administration Minière :</div>
              <div className="font-bold text-slate-900">{report.evaluatorRole}</div>
              <div className="text-2xs text-slate-600">Ministère des Mines de Madagascar</div>
              <div className="text-2xs text-emerald-700 font-medium pt-4">
                {report.isOfficiallyValidated ? '✓ Approuvé & Enregistré' : '[En attente de visa]'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
