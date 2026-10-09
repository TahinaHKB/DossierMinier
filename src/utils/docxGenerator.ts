import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Packer
} from 'docx';
import { MiningPermitDocument, FullEvaluationReport } from '../types/mining';

export async function generateCcmDocx(
  doc: MiningPermitDocument,
  report: FullEvaluationReport
): Promise<Blob> {
  const tableBorderNone = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'D0D7DE' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D0D7DE' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'D0D7DE' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'D0D7DE' }
  };

  const headerCell = (text: string, widthPercent = 25) =>
    new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      shading: { fill: '0F172A' },
      borders: tableBorderNone,
      children: [
        new Paragraph({
          children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 20 })]
        })
      ]
    });

  const bodyCell = (text: string, widthPercent = 25, isBold = false) =>
    new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      borders: tableBorderNone,
      children: [
        new Paragraph({
          children: [new TextRun({ text, bold: isBold, size: 19 })]
        })
      ]
    });

  // Table 1: Info Titulaire & Projet
  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [headerCell('Rubrique', 35), headerCell('Information enregistrée', 65)]
      }),
      new TableRow({
        children: [bodyCell('Dénomination du Titulaire', 35, true), bodyCell(doc.applicantName, 65)]
      }),
      new TableRow({
        children: [bodyCell('Forme juridique', 35, true), bodyCell(doc.legalForm, 65)]
      }),
      new TableRow({
        children: [bodyCell('Identification fiscale (NIF)', 35, true), bodyCell(doc.taxId, 65)]
      }),
      new TableRow({
        children: [bodyCell('Siège ou domicile élu', 35, true), bodyCell(doc.headquarters, 65)]
      }),
      new TableRow({
        children: [bodyCell('Gérant / Représentant légal', 35, true), bodyCell(doc.managerName, 65)]
      }),
      new TableRow({
        children: [bodyCell('Nom du Projet', 35, true), bodyCell(doc.projectTitle, 65)]
      }),
      new TableRow({
        children: [bodyCell('Numéro du permis minier', 35, true), bodyCell(doc.permitNumber, 65)]
      }),
      new TableRow({
        children: [
          bodyCell('Nombre de carrés & Localisation', 35, true),
          bodyCell(`${doc.carresCount} carrés (${doc.surfaceKm2} km²) - Région ${doc.region}, Distr. ${doc.district}, Comm. ${doc.commune}`, 65)
        ]
      }),
      new TableRow({
        children: [bodyCell('Substances minières autorisées', 35, true), bodyCell(doc.mineralsTitle.join(', '), 65)]
      }),
      new TableRow({
        children: [bodyCell('Situation du permis', 35, true), bodyCell(doc.movementType, 65)]
      })
    ]
  });

  // Table 2: Investissements ajustés par phase
  const investRows = [
    new TableRow({
      children: [
        headerCell('Désignation des activités', 45),
        headerCell('Montant Validé (MGA)', 25),
        headerCell('Début', 15),
        headerCell('Durée', 15)
      ]
    })
  ];

  doc.investmentsPhase.forEach(item => {
    const amount = item.id === 'inv-2' ? report.pivots.coutMateriel1 : item.initialAmountMGA;
    investRows.push(
      new TableRow({
        children: [
          bodyCell(item.activity, 45, item.id === 'inv-2'),
          bodyCell(`${amount.toLocaleString('fr-FR')} MGA`, 25, item.id === 'inv-2'),
          bodyCell(item.startMonth, 15),
          bodyCell(item.duration, 15)
        ]
      })
    );
  });

  investRows.push(
    new TableRow({
      children: [
        bodyCell('TOTAL GÉNÉRAL INVESTISSEMENT AJUSTÉ (I_adj)', 45, true),
        bodyCell(`${report.pivots.totalInvestissementAjuste.toLocaleString('fr-FR')} MGA`, 25, true),
        bodyCell('-', 15),
        bodyCell('36 mois', 15)
      ]
    })
  );

  const investTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: investRows
  });

  // Table 3: CMRM (13 catégories)
  const cmrmRows = [
    new TableRow({
      children: [
        headerCell('N°', 8),
        headerCell('Types de dépenses obligatoires', 52),
        headerCell('Montant Garanti (MGA)', 40)
      ]
    })
  ];

  doc.cmrmDeclared.forEach(c => {
    const amount = c.code === 10 ? report.pivots.coutMateriel1 : c.initialAmountMGA;
    cmrmRows.push(
      new TableRow({
        children: [
          bodyCell(`${c.code}`, 8),
          bodyCell(c.category + (c.code === 10 ? ' [COÛT MATÉRIEL 1 AJUSTÉ]' : ''), 52, c.code === 10),
          bodyCell(`${amount.toLocaleString('fr-FR')} MGA`, 40, c.code === 10)
        ]
      })
    );
  });

  cmrmRows.push(
    new TableRow({
      children: [
        bodyCell('TOTAL', 8, true),
        bodyCell('TOTAL COÛT MINIMUM DE RECHERCHE MINIÈRE (CMRM AJUSTÉ)', 52, true),
        bodyCell(`${report.pivots.totalCmrmAjuste.toLocaleString('fr-FR')} MGA`, 40, true)
      ]
    })
  );

  const cmrmTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: cmrmRows
  });

  // Table 4: Équipements V.2
  const equipRows = [
    new TableRow({
      children: [
        headerCell('Matériel', 25),
        headerCell('Caractéristiques', 30),
        headerCell('Quantité', 10),
        headerCell('Prix Unitaire (MGA)', 15),
        headerCell('Montant Total (MGA)', 20)
      ]
    })
  ];

  doc.equipmentList.forEach(eq => {
    equipRows.push(
      new TableRow({
        children: [
          bodyCell(eq.name, 25),
          bodyCell(eq.specs, 30),
          bodyCell(`${eq.quantity}`, 10),
          bodyCell(`${eq.unitPriceMGA.toLocaleString('fr-FR')}`, 15),
          bodyCell(`${(eq.unitPriceMGA * eq.quantity).toLocaleString('fr-FR')}`, 20)
        ]
      })
    );
  });

  equipRows.push(
    new TableRow({
      children: [
        bodyCell('TOTAL V.2', 25, true),
        bodyCell('Total général des matériels et équipements', 30, true),
        bodyCell('-', 10),
        bodyCell('-', 15),
        bodyCell(`${report.pivots.sommeTotaleV2.toLocaleString('fr-FR')} MGA`, 20, true)
      ]
    })
  );

  const equipTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: equipRows
  });

  // Document Assembly
  const wordDoc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "REPOBLIKAN'I MADAGASIKARA",
                bold: true,
                size: 24
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Fitiavana — Tanindrazana — Fandrosoana',
                italics: true,
                size: 20
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'MINISTÈRE DES MINES — DIRECTION DE LA PROMOTION DES GRANDES MINES',
                bold: true,
                size: 22,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `CAHIER DES CHARGES MINIÈRES DU PERMIS « PR » N° ${doc.permitNumber}`,
                bold: true,
                size: 28,
                color: '0F172A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Annexe officielle au Permis de Recherche Minière — Évaluation validée selon le Guide v2.0`,
                italics: true,
                size: 18,
                color: '475569'
              })
            ]
          }),
          new Paragraph({ text: '' }),

          // Chapitre 1
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '1. INFORMATIONS GÉNÉRALES', bold: true, size: 24 })]
          }),
          new Paragraph({ text: '' }),
          infoTable,
          new Paragraph({ text: '' }),

          // Chapitre 2
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '2. PRESCRIPTIONS ADMINISTRATIVES', bold: true, size: 24 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '2.1 Droits conférés: Le permis « PR » confère à son titulaire le droit exclusif d’entreprendre la prospection et la recherche à l’intérieur de son périmètre concédé.\n' +
                  '2.2 Droit d’Accès: Le titulaire s’engage à conclure et régler dans un délai de six (06) mois après la délivrance de l’autorisation environnementale son droit d’accès avec les propriétaires fonciers et usufruitiers.\n' +
                  '2.3 Transport des échantillons: Utilisation stricte de laissez-passer délivrés par l’Administration minière uniquement pour l’analyse des substances minérales autorisées.\n' +
                  '2.4 Compte-rendu: Dépôt obligatoire d’un rapport d’activités annuel et technique conforme aux articles 271 du Code Minier et 190 du Décret d’application.',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          // Chapitre 3
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '3. PRESCRIPTIONS PARTICULIÈRES TECHNIQUES & FINANCIÈRES', bold: true, size: 24 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `3.1 Déclaration d’ouverture de chantier: Dans un délai de 3 mois auprès de la Direction Régionale des Mines de la Région ${doc.region}.\n` +
                  `3.2 Substances chimiques: Utilisation contrôlée de 30 000 L de boue de forage, 16 270 L de carburant et 503,5 L de lubrifiants sous confinement étanche et gestion environnementale.\n` +
                  `3.3 Travaux programmés: 4 forages profonds (${doc.drillingDepthM} m cumulés), 50 m de tranchées, 10 puits, échantillonnage QA/QC confié aux laboratoires agréés Alchemex et SGS.`,
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '3.4 Plan d’Investissement par Phase (Ajusté)', bold: true, size: 22 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Conformément au Guide d'Évaluation, le poste Acquisition des matériels a été réajusté à la valeur pivot COÛT MATÉRIEL 1 (${report.pivots.coutMateriel1.toLocaleString('fr-FR')} MGA).`,
                italics: true,
                size: 18
              })
            ]
          }),
          new Paragraph({ text: '' }),
          investTable,
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '3.4.1 Liste Prévisionnelle et Coût des Matériels (Tableau V.2)', bold: true, size: 22 })]
          }),
          equipTable,
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '3.5 Coût Minimum de Recherche Minière (CMRM Réglementaire)', bold: true, size: 22 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Total garanti: ${report.pivots.totalCmrmAjuste.toLocaleString('fr-FR')} MGA (conforme aux 13 types légaux).`,
                italics: true,
                size: 18
              })
            ]
          }),
          new Paragraph({ text: '' }),
          cmrmTable,
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '3.6 Provision Environnementale & Responsabilité Sociétale (PRSE)', bold: true, size: 22 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `• Provision environnementale totale: ${doc.environmentalProvision.reduce((s, e) => s + e.amountMGA, 0).toLocaleString('fr-FR')} MGA (Réhabilitation progressive, reboisement, gestion des risques).\n` +
                  `• Budget RSE global (3 ans): ${report.pivots.rseAjuste.toLocaleString('fr-FR')} MGA (≥ 2% légal de l'investissement total ajusté).\n` +
                  `• Dotation annuelle PRSE (Convention Tripartite): ${report.pivots.prseAnnuelRequis.toLocaleString('fr-FR')} MGA / an répartie en concertation avec les CTD et communautés d'accueil (${doc.commune}).`,
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: '4. ENGAGEMENT FORMEL DU TITULAIRE', bold: true, size: 24 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Je soussigné, ${doc.managerName}, gérant de ${doc.applicantName}, titulaire du permis minier n° ${doc.permitNumber}, m'engage formellement à respecter l'ensemble des clauses techniques et engagements financiers consignés dans le présent Cahier des Charges Minières.\n\n` +
                  `Fait à Antananarivo, le ${doc.declarationDate}\n\n` +
                  `Pour le Titulaire:                                                         Pour l'Administration des Mines:`,
                size: 20
              })
            ]
          })
        ]
      }
    ]
  });

  return await Packer.toBlob(wordDoc);
}
