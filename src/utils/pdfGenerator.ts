import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MiningPermitDocument, FullEvaluationReport } from '../types/mining';

export function generateCcmPdf(
  doc: MiningPermitDocument,
  report: FullEvaluationReport
): jsPDF {
  const docPdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor: [number, number, number] = [15, 23, 42]; // slate-900
  const accentColor: [number, number, number] = [30, 58, 138]; // blue-900

  // Header
  docPdf.setFont('helvetica', 'bold');
  docPdf.setFontSize(12);
  docPdf.text("REPOBLIKAN'I MADAGASIKARA", 105, 15, { align: 'center' });

  docPdf.setFont('helvetica', 'italic');
  docPdf.setFontSize(9);
  docPdf.text('Fitiavana — Tanindrazana — Fandrosoana', 105, 20, { align: 'center' });

  docPdf.setFont('helvetica', 'bold');
  docPdf.setFontSize(10);
  docPdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  docPdf.text('MINISTÈRE DES MINES — DIRECTION DE LA PROMOTION DES GRANDES MINES', 105, 26, { align: 'center' });

  docPdf.setDrawColor(200, 200, 200);
  docPdf.line(20, 29, 190, 29);

  // Titre Document
  docPdf.setFontSize(14);
  docPdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  docPdf.text(`CAHIER DES CHARGES MINIÈRES DU PERMIS « PR » N° ${doc.permitNumber}`, 105, 37, { align: 'center' });

  docPdf.setFontSize(9);
  docPdf.setFont('helvetica', 'normal');
  docPdf.setTextColor(100, 100, 100);
  docPdf.text('Annexe obligatoire au Permis de Recherche — Évaluation technique et financière validée', 105, 42, { align: 'center' });

  // 1. Informations Générales Table
  docPdf.setFontSize(11);
  docPdf.setFont('helvetica', 'bold');
  docPdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  docPdf.text('1. INFORMATIONS GÉNÉRALES SUR LE PERMIS & LE TITULAIRE', 20, 50);

  autoTable(docPdf, {
    startY: 53,
    head: [['Rubrique', 'Valeur Enregistrée']],
    body: [
      ['Dénomination du Titulaire', doc.applicantName],
      ['Forme Juridique', doc.legalForm],
      ['Identification Fiscale (NIF)', doc.taxId],
      ['Siège Social', doc.headquarters],
      ['Gérant Habilité', doc.managerName],
      ['Nom du Projet', doc.projectTitle],
      ['Numéro du Permis & Code BCMM', `Permis n° ${doc.permitNumber} — Code BCMM ${doc.bcmmCode}`],
      ['Localisation Administrative', `Région ${doc.region}, Distr. ${doc.district}, Comm. ${doc.commune}`],
      ['Nombre de carrés & Surface', `${doc.carresCount} carrés (${doc.surfaceKm2} km²)`],
      ['Substances Minières Autorisées', doc.mineralsTitle.join(', ')],
      ['Situation Juridique', doc.movementType]
    ],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 2 }
  });

  // 2. Prescriptions Administratives
  // @ts-ignore
  let currentY = (docPdf as any).lastAutoTable.finalY + 8;
  docPdf.setFontSize(11);
  docPdf.setFont('helvetica', 'bold');
  docPdf.text('2. PRESCRIPTIONS ADMINISTRATIVES ET ENVIRONNEMENTALES', 20, currentY);

  currentY += 5;
  docPdf.setFontSize(8.5);
  docPdf.setFont('helvetica', 'normal');
  const adminText = [
    `• Déclaration d'ouverture de chantier: Dans un délai de 3 mois auprès de la Direction Régionale de ${doc.region}.`,
    `• Accord d'accès au sol: À formaliser sous 6 mois avec les propriétaires traditionnels et usufruitiers.`,
    `• Transport des minerais: Réservé aux échantillons d'analyse sous strict laissez-passer ministériel.`,
    `• Rapports: Dépôt obligatoire d'un rapport technique annuel conforme à l'article 271 du Code Minier.`
  ];
  adminText.forEach(line => {
    docPdf.text(line, 20, currentY);
    currentY += 4.5;
  });

  // Tableaux Financiers Ajustés
  currentY += 3;
  docPdf.setFontSize(11);
  docPdf.setFont('helvetica', 'bold');
  docPdf.text('3. RÉALISATION DU PLAN D’INVESTISSEMENT PAR PHASE (VALEURS AJUSTÉES)', 20, currentY);

  const investData = doc.investmentsPhase.map(item => [
    item.activity,
    item.id === 'inv-2'
      ? `${report.pivots.coutMateriel1.toLocaleString('fr-FR')} MGA *`
      : `${item.initialAmountMGA.toLocaleString('fr-FR')} MGA`,
    item.startMonth,
    item.duration
  ]);

  investData.push([
    'TOTAL GÉNÉRAL INVESTISSEMENT AJUSTÉ (I_adj)',
    `${report.pivots.totalInvestissementAjuste.toLocaleString('fr-FR')} MGA`,
    '-',
    '36 mois'
  ]);

  autoTable(docPdf, {
    startY: currentY + 3,
    head: [['Activité programmée', 'Montant Retenu (MGA)', 'Début', 'Durée']],
    body: investData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 7.5, cellPadding: 1.6 }
  });

  // Nouvelle page pour CMRM et RSE
  docPdf.addPage();
  currentY = 20;

  docPdf.setFontSize(11);
  docPdf.setFont('helvetica', 'bold');
  docPdf.text('4. COÛT MINIMUM DE RECHERCHE MINIÈRE (CMRM RÉGLEMENTAIRE)', 20, currentY);

  const cmrmData = doc.cmrmDeclared.map(c => [
    `${c.code}`,
    c.category + (c.code === 10 ? ' [AJUSTÉ: COÛT MATÉRIEL 1]' : ''),
    c.code === 10
      ? `${report.pivots.coutMateriel1.toLocaleString('fr-FR')} MGA`
      : `${c.initialAmountMGA.toLocaleString('fr-FR')} MGA`
  ]);

  cmrmData.push([
    '-',
    'TOTAL CMRM AJUSTÉ (GARANTIES FINANCIÈRES OBLIGATOIRES)',
    `${report.pivots.totalCmrmAjuste.toLocaleString('fr-FR')} MGA`
  ]);

  autoTable(docPdf, {
    startY: currentY + 4,
    head: [['N°', '13 Types de Dépenses Réglementaires', 'Montant Garanti (MGA)']],
    body: cmrmData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 1.8 }
  });

  // @ts-ignore
  currentY = (docPdf as any).lastAutoTable.finalY + 8;

  docPdf.setFontSize(11);
  docPdf.setFont('helvetica', 'bold');
  docPdf.text('5. ENGAGEMENTS RSE & CONVENTION TRIPARTITE (PRSE)', 20, currentY);

  currentY += 5;
  docPdf.setFontSize(8.5);
  docPdf.setFont('helvetica', 'normal');
  const rseText = [
    `• Investissement Total Ajusté: ${report.pivots.totalInvestissementAjuste.toLocaleString('fr-FR')} MGA`,
    `• Seuil légal minimal RSE (2%): ${report.pivots.rseMinRequis.toLocaleString('fr-FR')} MGA`,
    `• Budget RSE global consenti (3 ans): ${report.pivots.rseAjuste.toLocaleString('fr-FR')} MGA`,
    `• Dotation annuelle PRSE (Convention Tripartite): ${report.pivots.prseAnnuelRequis.toLocaleString('fr-FR')} MGA / an`,
    `• Bénéficiaires prioritaires: Communes de ${doc.commune} et ${doc.district} (écoles, santé CSB II, adduction d'eau, AGR).`
  ];
  rseText.forEach(line => {
    docPdf.text(line, 20, currentY);
    currentY += 4.5;
  });

  currentY += 10;
  docPdf.setFontSize(10);
  docPdf.setFont('helvetica', 'bold');
  docPdf.text(`Fait à Antananarivo, le ${doc.declarationDate}`, 20, currentY);

  currentY += 8;
  docPdf.text('Pour le Titulaire:', 25, currentY);
  docPdf.text("Pour l'Administration Minière:", 125, currentY);

  currentY += 4;
  docPdf.setFont('helvetica', 'normal');
  docPdf.setFontSize(8.5);
  docPdf.text(`${doc.managerName}`, 25, currentY);
  docPdf.text("Directeur de la Promotion des Grandes Mines", 125, currentY);
  docPdf.text(`Gérant - ${doc.applicantName}`, 25, currentY + 4);
  docPdf.text("Ministère des Mines de Madagascar", 125, currentY + 4);

  return docPdf;
}
