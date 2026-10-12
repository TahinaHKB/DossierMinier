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
import fs from 'fs';
import path from 'path';

async function generateCompleteDocx() {
  const tableBorderNone = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' }
  };

  const headerCell = (text: string, widthPercent = 25) =>
    new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      shading: { fill: '0F172A' },
      borders: tableBorderNone,
      children: [
        new Paragraph({
          children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 19 })]
        })
      ]
    });

  const bodyCell = (text: string, widthPercent = 25, isBold = false) =>
    new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      borders: tableBorderNone,
      children: [
        new Paragraph({
          children: [new TextRun({ text, bold: isBold, size: 18 })]
        })
      ]
    });

  // Table des étapes d'évaluation
  const stepsSummaryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          headerCell('Chapitre', 10),
          headerCell('Titre de l’Étape', 35),
          headerCell('Max Pts', 15),
          headerCell('Critère DCI Prioritaire / Règle Pivot', 40)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('I', 10, true),
          bodyCell('Identification du Projet', 35),
          bodyCell('20 pts', 15),
          bodyCell('Discordance substances titre vs projet (Éliminatoire)', 40)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('II', 10, true),
          bodyCell('Raisons du choix du périmètre', 35),
          bodyCell('15 pts', 15),
          bodyCell('Aucune base géologique ou artisanat non géré', 40)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('III', 10, true),
          bodyCell('Programme de Recherche', 35),
          bodyCell('25 pts', 15),
          bodyCell('Méthode inadaptée, Règle du tiers (Superficie >= 1/3)', 40)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('IV', 10, true),
          bodyCell('Ressources Humaines', 35),
          bodyCell('10 pts', 15),
          bodyCell('Responsable technique manquant ou CV absent', 40)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('V', 10, true),
          bodyCell('Investissement (V.1, V.2, V.3)', 35),
          bodyCell('20 pts', 15),
          bodyCell('Pivot Coût Matériel 1 réinjecté. Investissement >= CMRM', 40)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('VI', 10, true),
          bodyCell('Plan de Financement + RSE', 35),
          bodyCell('15 pts', 15),
          bodyCell('RSE >= 2% de l’investissement ajusté. Couverture intégrale', 40)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('VII', 10, true),
          bodyCell('Déclaration + PRSE', 35),
          bodyCell('5 pts', 15),
          bodyCell('Déclaration signée. Dotation PRSE annuelle = RSE / 3', 40)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('TOTAL', 10, true),
          bodyCell('Score Global & Décision', 35, true),
          bodyCell('110 pts', 15, true),
          bodyCell('Seuil d’approbation : >= 95 points (Avis Favorable)', 40, true)
        ]
      })
    ]
  });

  // Table d'arborescence des fichiers
  const filesArchitectureTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          headerCell('Chemin du Fichier', 35),
          headerCell('Type / Couche', 20),
          headerCell('Rôle & Responsabilité Fonctionnelle', 45)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('/server.ts', 35, true),
          bodyCell('Backend Express / API', 20),
          bodyCell('Serveur Node.js, middleware Vite, route /api/extract-ptpf pour extraction par IA Gemini.', 45)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('/src/types/mining.ts', 35, true),
          bodyCell('Modèle de Données', 20),
          bodyCell('Interfaces TypeScript strictes pour les permis, matériels V.2, investissements V.1, CMRM V.3, pivots et rapports d’évaluation.', 45)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('/src/utils/evaluationEngine.ts', 35, true),
          bodyCell('Moteur d’Évaluation', 20),
          bodyCell('Cœur logique implémentant fidèlement le Guide v2.0 (110 pts), les calculs arithmétiques [A] × [B] et les 4 valeurs pivots immuables.', 45)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('/src/utils/pdfParser.ts', 35, true),
          bodyCell('Parseur Universel', 20),
          bodyCell('Extraction de texte PDF multi-pages (pdfjs-dist), moteur heuristique regex et fallback IA pour analyser n’importe quel document.', 45)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('/src/utils/docxGenerator.ts', 35, true),
          bodyCell('Générateur DOCX', 20),
          bodyCell('Génération native Microsoft Word (.docx) du Cahier des Charges Minières (CCM) complet avec tableaux officiels.', 45)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('/src/utils/pdfGenerator.ts', 35, true),
          bodyCell('Générateur PDF', 20),
          bodyCell('Génération vectorielle et formatée du CCM au format PDF avec autoTable et en-tête gouvernemental officiel.', 45)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('/src/components/DocumentUploadSection.tsx', 35, true),
          bodyCell('Interface UI', 20),
          bodyCell('Zone d’importation PDF, sélection de spécimens, édition rapide des paramètres extraits, téléchargement instantané du CCM.', 45)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('/src/components/EvaluationSection.tsx', 35, true),
          bodyCell('Interface UI', 20),
          bodyCell('Visualisation des 8 étapes d’évaluation, bannières des 4 pivots, formules arithmétiques détaillées et alertes DCI.', 45)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('/src/components/HumanValidationPanel.tsx', 35, true),
          bodyCell('Interface UI', 20),
          bodyCell('Validation humaine obligatoire (Human-in-the-loop), checklist de conformité, consignation des réserves et visa de l’évaluateur.', 45)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('/src/components/CcmTemplateView.tsx', 35, true),
          bodyCell('Interface UI', 20),
          bodyCell('Rendu fidèle du template ministériel CCM, édition in situ, téléchargement 1-clic Word (.docx) et PDF (.pdf), impression.', 45)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('/src/components/AdjustedTablesExcelView.tsx', 35, true),
          bodyCell('Interface UI', 20),
          bodyCell('Export des 5 feuilles de calcul réajustées au format TSV pour collage direct dans Microsoft Excel (Prompt 2 du Guide).', 45)
        ]
      }),
      new TableRow({
        children: [
          bodyCell('/src/App.tsx', 35, true),
          bodyCell('Contrôleur Principal', 20),
          bodyCell('Gestion de l’état global, synchronisation dynamique entre document, rapport d’évaluation et canevas CCM.', 45)
        ]
      })
    ]
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Titre principal
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "REPOBLIKAN'I MADAGASIKARA",
                bold: true,
                size: 26,
                color: '0F172A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Fitiavana — Tanindrazana — Fandrosoana',
                italics: true,
                size: 20,
                color: '475569'
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
                text: 'DOCUMENTATION COMPLÈTE DU PROJET ÉVALMINIER',
                bold: true,
                size: 32,
                color: '0F172A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Plateforme Universelle d’Évaluation des PTPF (Guide v2.0 - 110 points) & Génération Automatisée du Cahier des Charges Minières (CCM)',
                italics: true,
                size: 20,
                color: '334155'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Guide de Référence Technique pour Développeurs & Manuel d’Utilisation Opérationnel pour Évaluateurs Miniers',
                bold: true,
                size: 18,
                color: '059669'
              })
            ]
          }),
          new Paragraph({ text: '' }),

          // Introduction
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'PRÉSENTATION DU PROJET & OBJECTIFS STRATÉGIQUES', bold: true, size: 24, color: '1E3A8A' })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Le projet ÉvalMinier a été conçu pour digitaliser, standardiser et automatiser l’instruction technique et financière des dossiers de demande de permis minier (PTPF - Programme de Travail et Plan de Financement) soumis au Ministère des Mines de Madagascar en vertu de la Loi n° 2023-007 portant refonte du Code Minier et du Décret n° 2024-1464 sur le régime des permis.\n\n' +
                'Historiquement, l’instruction manuelle d’un dossier minier de 50+ pages exigeait des heures de recoupement arithmétique complexe (dépenses d’acquisition, sous-traitances, budget RSE de 2%, caution CMRM, etc.), avec des risques d’erreurs de calcul ou d’incohérences non détectées.\n\n' +
                'ÉvalMinier répond à ce défi en introduisant un moteur algorithmique rigoureux qui applique fidèlement les étapes du Guide d’Évaluation v2.0 (110 points), calcule instantanément les 4 valeurs pivots réglementaires, soumet les résultats à une validation humaine sécurisée (Human-in-the-Loop), et génère automatiquement le Cahier des Charges Minières (CCM) complet prêt pour signature au format Word (.docx) et PDF (.pdf).',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          // PARTIE 1 : MANUEL UTILISATEUR
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'PARTIE 1 : GUIDE D’UTILISATION OPÉRATIONNEL', bold: true, size: 26, color: '0F172A' })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Cette partie décrit comment utiliser l’application, étape par étape, depuis l’importation d’un document quelconque jusqu’à l’exportation finale des actes officiels.',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '1.1 Étape 1 : Importation de n’importe quel document minier (PDF ou Texte)', bold: true, size: 22 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '1. Universitalité des documents : Le système n’est pas limité au document spécimen 37255_AC_Carte. Il est conçu pour ingérer tout document minier (PTPF, Avis Cadastral, demande d’octroi ou de renouvellement), qu’il s’agisse d’un PDF structuré ou d’un document scanné.\n' +
                '2. Méthodes d’importation disponibles :\n' +
                '   • Glisser-déposer d’un fichier PDF : Le fichier est lu page par page en local via la librairie pdfjs-dist. Le texte extrait est immédiatement scanné pour identifier le numéro de permis, le demandeur, le NIF, la localisation administrative, le nombre de carrés, les substances minérales et les montants budgétaires.\n' +
                '   • Bouton « Coller texte / OCR » : Si vous disposez d’une transcription textuelle brute issue d’un scanner ou d’un rapport Word, collez le texte directement dans le formulaire pour lancer l’analyse.\n' +
                '   • Spécimens intégrés en 1 clic : Pour tester instantanément la plateforme, deux cas réels sont intégrés : Permis 37255 (AMBILOBE MINERALS - Barytine, 2 carrés) et Permis 41280 (BETSIBOA GOLD CORP - Or, 16 carrés).\n' +
                '3. Édition rapide des paramètres extraits : Dans l’onglet « Éditer les Paramètres Extraits », l’utilisateur peut à tout moment corriger ou compléter un champ (ex. rectifier une commune, ajouter une substance) : l’évaluation algorithmique et le Canevas CCM se mettent immédiatement à jour en temps réel.',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '1.2 Étape 2 : Algorithme d’Évaluation Automatique selon le Guide v2.0', bold: true, size: 22 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'L’algorithme applique sans déviation les règles de calcul et le barème sur 110 points du Guide d’Évaluation officiel :',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),
          stepsSummaryTable,
          new Paragraph({ text: '' }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Les 4 Valeurs Pivots Immuables :\n' +
                '• PIVOT 1 — COÛT MATÉRIEL 1 : Calculé selon la formule stricte [Somme Totale V.2] − [Sous-traitances] − [Matériel déjà acquis]. Les locations de véhicules ne sont pas déduites. Cette valeur devient la base financière immuable de l’effort d’équipement.\n' +
                '• PIVOT 2 — TOTAL CMRM AJUSTÉ : Remplacement automatique de la ligne 10 du tableau V.3 (« Acquisitions de matériels ») par le Coût Matériel 1. Cela garantit que les garanties financières couvrent les achats réels de matériel.\n' +
                '• PIVOT 3 — TOTAL INVESTISSEMENT AJUSTÉ (I_adj) : Remplacement de la ligne d’acquisition de la phase préparatoire (Tableau V.1) par le Coût Matériel 1. Recalcul des totaux par phase et vérification obligatoire de l’inégalité I_adj >= Total CMRM.\n' +
                '• PIVOT 4 — RSE AJUSTÉ & PRSE : Calcul du seuil légal minimal de 2% [I_adj × 0.02]. Si le promoteur a consenti un montant supérieur, ce dernier est retenu. La dotation annuelle triennale pour le PRSE (Plan de Responsabilité Sociétale) est fixée à [RSE_ajusté ÷ 3].\n\n' +
                'Matrice de décision administrative :\n' +
                '• 95 à 110 points : DOSSIER CONFORME — AVIS FAVORABLE. Le PTPF est approuvé, convocation pour signature du CCM et dépôt des garanties bancaires.\n' +
                '• 75 à 94 points : ACCEPTABLE — AJUSTEMENTS NÉCESSAIRES. Convocation pour réalignement des postes sans rejet du dossier.\n' +
                '• 0 à 74 points : NON ADMISSIBLE — DCI ÉMISE. Demande de Complément d’Information, délai de régularisation de 30 jours.',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '1.3 Étape 3 : Vérification Humaine (Human-in-the-Loop)', bold: true, size: 22 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Aucun document ne peut être émis sans le visa formel de l’ingénieur minier instructeur. Cet onglet propose :\n' +
                '1. Une checklist obligatoire de 4 critères vérifiés (concordance substances, règle pivot matériel, solvabilité CMRM, dotation tripartite PRSE).\n' +
                '2. Un champ de texte libre pour formuler les prescriptions administratives particulières (ex. obligation pour le promoteur de transmettre le CV de l’ingénieur géologue avant démarrage du chantier).\n' +
                '3. Un bouton de validation et signature électronique qui horodate le visa et certifie la conformité de l’acte.',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '1.4 Étape 4 & 5 : Remplissage Automatique du CCM & Téléchargements 1-Clic', bold: true, size: 22 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Dès que le document est chargé et évalué, le Canevas officiel du Cahier des Charges Minières (CCM) est pré-rempli à 100% de manière automatique :\n' +
                '• Chapitre 1 : Informations générales (Dénomination, Forme juridique, NIF, Siège, Gérant, Nom projet, N° permis, carrés, substances, situation).\n' +
                '• Chapitre 2 : Prescriptions administratives (droits conférés, droit d’accès, transport d’échantillons, compte-rendu annuel).\n' +
                '• Chapitre 3 : Prescriptions techniques (chimiques, échantillonnage, RH, investissement ajusté par phase, tableau V.2 complet, CMRM 13 types, provision environnementale, convention tripartite PRSE).\n' +
                '• Chapitre 4 : Engagements juridiques et signatures des parties.\n\n' +
                'Options d’exportation instantanée :\n' +
                '• Télécharger Word (.docx) : Génère un fichier Microsoft Word complet, formaté avec des tableaux éditables et des en-têtes officiels.\n' +
                '• Télécharger PDF (.pdf) : Génère un document vectoriel A4 officiel avec pagination et mise en page ministérielle.\n' +
                '• Tableaux Excel (.tsv) : Permet de copier ou télécharger en un clic les 5 tableaux financiers ajustés pour les coller directement dans Microsoft Excel (Prompt 2 du Guide).',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          // PARTIE 2 : GUIDE TECHNIQUE POUR DÉVELOPPEURS
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'PARTIE 2 : GUIDE TECHNIQUE & ARCHITECTURE DU CODE POUR DÉVELOPPEURS', bold: true, size: 26, color: '0F172A' })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Cette section s’adresse aux ingénieurs logiciels et mainteneurs de la plateforme pour comprendre l’architecture interne, les types, le flux de données et la logique d’implémentation.',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '2.1 Stack Technologique & Dépendances Clés', bold: true, size: 22 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Frontend : React 19 SPA, TypeScript 5.8, Tailwind CSS v4, Lucide Icons, Vite 8.\n' +
                '• Backend / Serveur : Node.js avec Express et tsx (exécution directe TypeScript sans compilation intermédiaire). Vite middlewares montés en développement pour un rechargement transparent.\n' +
                '• Moteur d’extraction PDF : pdfjs-dist (rendu et parsing textuel de flux binaires côté client) couplé à une couche regex heuristique avancée.\n' +
                '• Intelligence Artificielle (Optionnelle) : @google/genai SDK (modèle gemini-3.8-flash) exécuté exclusivement côté serveur sur la route POST /api/extract-ptpf pour garantir la sécurité absolue de la clé API.\n' +
                '• Moteur de génération Word : docx v9.9.0 (compilation en mémoire d’arbres de paragraphes, tables et styles, export natif sous forme de Blob).\n' +
                '• Moteur de génération PDF : jspdf et jspdf-autotable (génération de documents vectoriels multi-pages avec respect de la grille typographique A4).',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '2.2 Arborescence Complète des Fichiers & Responsabilités', bold: true, size: 22 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Voici l’organisation structurelle de l’application :',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),
          filesArchitectureTable,
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '2.3 Le Modèle de Données TypeScript (src/types/mining.ts)', bold: true, size: 22 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Le fichier src/types/mining.ts définit les contrats d’interface indispensables :\n' +
                '• MiningPermitDocument : représente l’intégralité des données du document minier (identifiants administratifs, géologie, programme technique, tableaux d’équipements, investissements par phase, CMRM déclaré, substances chimiques, RH, déclarations).\n' +
                '• EquipmentItem : élément de la liste V.2 (nom, caractéristiques, quantité, prix unitaire en MGA, montant total, mode d’acquisition : Achat, Location ou Sous-traitance).\n' +
                '• EvaluationPivotValues : encapsule les 4 valeurs pivots immuables calculées par l’algorithme.\n' +
                '• EvaluationStepResult : décrit le résultat d’une étape d’évaluation (score obtenu, score max, statut CONFORME/ACCEPTABLE/DCI, opérations arithmétiques au format texte, observations d’anomalies et actions requises).\n' +
                '• FullEvaluationReport : synthèse complète consolidée de l’évaluation avec verdict final, date, évaluateur et visa de validation.',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '2.4 Moteur d’Évaluation Réglementaire (src/utils/evaluationEngine.ts)', bold: true, size: 22 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'La fonction pure evaluateMiningDossier(doc: MiningPermitDocument): FullEvaluationReport est le cœur algorithmique du système. Elle s’exécute de façon déterministe en appliquant les règles dans un ordre rigoureux :\n\n' +
                '1. Étape 3 (Matériels V.2) : Calcule la somme arithmétique de chaque ligne (Prix Unitaire × Quantité). Isole le total des lignes classées en "Sous-traitance" (comme les forages carottés ou les drones magnétomètres) et déduit ce montant de la somme totale pour obtenir le COÛT MATÉRIEL 1. Les locations ne sont pas soustraites conformément à la note explicite du Guide.\n\n' +
                '2. Étape 4 (CMRM V.3) : Contrôle la conformité des 13 catégories réglementaires de dépenses minimales. La ligne 10 (« Acquisitions de matériels et appareils ») est impérativement remplacée par le Coût Matériel 1 calculé à l’étape 3. Le Total CMRM ajusté est ainsi consolidé.\n\n' +
                '3. Étape 5 (Tableau V.1 & Pertinence) : Dans le plan d’investissement par phase, la ligne « Acquisition des matériels et matériaux » est réajustée sur le Coût Matériel 1. La somme totale de l’investissement ajusté (I_adj) est calculée et confrontée à la condition éliminatoire : I_adj >= Total CMRM. Si cette condition n’est pas remplie, le statut DCI immédiat est déclenché.\n\n' +
                '4. Étape 6 (Financement & RSE) : Calcule RSE_min = I_adj × 0.02. Compare avec le RSE déclaré et retient la valeur la plus élevée. Vérifie que le plan de financement couvre au minimum [I_adj + RSE_ajusté]. En cas de déficit, un ajustement automatique est opéré pour garantir la solvabilité du projet.\n\n' +
                '5. Étape 7 (PRSE & Déclaration) : Calcule la dotation annuelle tripartite PRSE = [RSE_ajusté ÷ 3]. Vérifie la présence de la signature du gérant et la date de l’engagement formel.\n\n' +
                '6. Notation (Chapitres I à VII) : Attribue les points pour chaque sous-critère selon le barème officiel pour atteindre la note globale sur 110 points.',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '2.5 Génération Documentaire Word & PDF', bold: true, size: 22 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Moteur Word (src/utils/docxGenerator.ts) :\n' +
                'Utilise Packer.toBlob() de docx. Chaque section du document source (Informations Générales, Prescriptions Administratives, Prescriptions Particulières, Investissements ajustés, CMRM 13 types, PRSE) est structurée en Tables Word stylisées avec bordures 1pt #CBD5E1 et en-têtes foncés #0F172A. Le fichier généré est compatible à 100% avec Microsoft Word, Google Docs et LibreOffice Writer.\n\n' +
                '• Moteur PDF (src/utils/pdfGenerator.ts) :\n' +
                'Instancie jsPDF en format A4 portrait. Utilise le plugin autoTable pour formater les données tabulaires avec des styles de cellules adaptés, des sauts de page automatiques et un bloc de signature officiel au bas de l’acte.',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: '2.6 Commandes Utiles & Maintenance', bold: true, size: 22 })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Lancement en développement : npm run dev (démarre tsx server.ts sur le port 3000)\n' +
                '• Compilation de production : npm run build (compile les assets Vite dans /dist)\n' +
                '• Démarrage en production : npm start (exécute tsx server.ts en mode production servant les fichiers statiques de /dist)\n' +
                '• Vérification des types : npm run lint (exécute tsc --noEmit pour garantir zéro erreur de typage)',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }),

          // CONCLUSION
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'CONCLUSION & CONFORMITÉ LÉGALE', bold: true, size: 24, color: '1E3A8A' })]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'La plateforme ÉvalMinier assure la stricte équité de traitement de tous les dossiers miniers à Madagascar en éliminant toute subjectivité de calcul et en garantissant que les investissements en recherche, les obligations de réhabilitation environnementale et les retombées sociales communautaires (PRSE) respectent scrupuleusement les exigences de la Loi n° 2023-007.\n\n' +
                'Toute évolution future des décrets d’application peut être répercutée directement en modifiant les règles de barème dans src/utils/evaluationEngine.ts et le canevas documentaire dans src/utils/docxGenerator.ts.',
                size: 20
              })
            ]
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.resolve(process.cwd(), 'DOCUMENTATION_COMPLETE_EVALMINIER.docx');
  fs.writeFileSync(outPath, buffer);

  // Also write to public directory so it can be served/downloaded via browser
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicOutPath = path.resolve(publicDir, 'DOCUMENTATION_COMPLETE_EVALMINIER.docx');
  fs.writeFileSync(publicOutPath, buffer);

  console.log(`Documentation générée avec succès :`);
  console.log(`- Racine : ${outPath}`);
  console.log(`- Dossier public : ${publicOutPath}`);
}

generateCompleteDocx().catch(err => {
  console.error('Erreur lors de la génération de la documentation Word:', err);
  process.exit(1);
});
