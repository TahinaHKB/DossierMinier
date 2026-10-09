import { MiningPermitDocument } from '../types/mining';

export const SAMPLE_37255_DOSSIER: MiningPermitDocument = {
  id: '37255_AC_Carte',
  fileName: '37255_AC_Carte.pdf',
  permitNumber: '37255',
  permitType: 'PR',
  bcmmCode: '846',
  movementType: 'CESSION / TRANSFORMATION R (14/11/2016)',
  filingDate: '26/05/2026',
  validityEnd: '19/04/2018',
  region: 'DIANA',
  district: 'AMBILOBE',
  commune: 'Antanambe',
  carresCount: 2,
  surfaceKm2: 0.78, // 2 carrés de 625m de côté (2 × 0.390625 km²)
  mineralsTitle: ['Zinc', 'Barytine', 'Plomb', 'Or'],
  mineralsProject: ['Zinc', 'Barytine', 'Plomb', 'Or'],
  mainMineral: 'Barytine',

  applicantName: 'AMBILOBE MINERALS S.A.R.L.U.',
  legalForm: 'S.A.R.L.U.',
  taxId: '4 002 319 288',
  headquarters: '25, Rue Raveloary, Isoraka- Antananarivo, 101',
  managerName: 'MARCHAND Adrien Francisco',
  projectTitle: 'AMBILOBE I',
  status: 'Eligible',

  geologicalContext: 'Socle précambrien (groupe de Betsiaka) et bassin permo-mésozoïque, veines quartzo-barytiques épithermales aurifères (Zn-Pb), formation de Mantalimanera.',
  geologicalMapRef: 'Carte géologique U-33, coupure Antsiranana',
  artisanalActivityPresent: false,
  artisanalManagementPlan: 'Aucuns artisans au moment des prospections préliminaires; engagement à créer un corridor d’exploitation artisanale en accord avec la communauté et les autorités si présence ultérieure.',
  previousWork: 'Prospections préliminaires sur contacts socle-sédiments, failles post-triasiques, altérations hydrothermales et filons hydrothermaux.',

  remoteSensingMethods: ['Sentinel-2', 'Imagerie hyperspectrale', 'Levé aéromagnétique par drone DJI M600 Pro + magnétomètre SENSYS MagDrone R3 (lignes 50m, contrôle 500m)'],
  geodesyMethod: 'GPS classique (+/- 3m) pour travaux préliminaires, GPS différentiel (DGPS, précision centimétrique) pour l’implantation des sondages',
  drillingCount: 4,
  drillingDepthM: 200,
  trenchesLengthM: 50,
  pitsCount: 10,
  coveredAreaKm2: 15.0, // 15 km² en cartographie, 10 km² en sédiments ruisseaux (≥ 1/3 de 0.78 km²)
  laboratories: ['Alchemex (Afrique du Sud - Analyse)', 'SGS (Contrôle qualité QA/QC)'],
  qaQcMeasures: [
    'Analyse par un tiers (2e labo)',
    'Duplicatas de pulpe',
    'Blancs (roche stérile)',
    'Standards certifiés GEOSTATS PTY LTD'
  ],

  equipmentList: [
    {
      id: 'eq-1',
      name: 'EPI (Équipements de Protection Individuelle)',
      specs: 'Casque, gilet, chaussure de terrain, gant, etc.',
      quantity: 1,
      unitPriceMGA: 1446900,
      totalPriceMGA: 1446900,
      acquisitionType: 'Achat'
    },
    {
      id: 'eq-2',
      name: 'Générateur électrique',
      specs: '2.5 kVA à essence',
      quantity: 1,
      unitPriceMGA: 1004300,
      totalPriceMGA: 1004300,
      acquisitionType: 'Achat'
    },
    {
      id: 'eq-3',
      name: 'Matériel de bureau',
      specs: 'Ordinateur portable, imprimante, table de travail, fournitures',
      quantity: 1,
      unitPriceMGA: 2714300,
      totalPriceMGA: 2714300,
      acquisitionType: 'Achat'
    },
    {
      id: 'eq-4',
      name: 'Matériel de cuisine campement',
      specs: 'Réchaud à gaz, seau, cocotte-minute, ustensiles',
      quantity: 1,
      unitPriceMGA: 857100,
      totalPriceMGA: 857100,
      acquisitionType: 'Achat'
    },
    {
      id: 'eq-5',
      name: 'Outils de géologue de terrain',
      specs: 'GPS de terrain, boussole clinomètre, loupe ×10/×20, marteau Estwing',
      quantity: 2,
      unitPriceMGA: 871450,
      totalPriceMGA: 1742900,
      acquisitionType: 'Achat'
    },
    {
      id: 'eq-6',
      name: 'Matériels d’exploration',
      specs: 'Batteries GPS, sacs à échantillons, marqueurs indélébiles, stylos, carnets de terrain',
      quantity: 1,
      unitPriceMGA: 2274500,
      totalPriceMGA: 2274500,
      acquisitionType: 'Achat'
    },
    {
      id: 'eq-7',
      name: 'Véhicules 4x4 Diesel pick-up tout-terrain',
      specs: 'Location 1 véhicule pendant la durée des campagnes terrain (226 jours)',
      quantity: 226,
      unitPriceMGA: 240000,
      totalPriceMGA: 47760000,
      acquisitionType: 'Location'
    },
    {
      id: 'eq-8',
      name: 'Foreuse et divers outils de forage',
      specs: 'Carottage au diamant HQ/NQ, tiges de forage, pompes et boue de forage (3 foreuses / 200m cumulés)',
      quantity: 200,
      unitPriceMGA: 752000,
      totalPriceMGA: 150400000,
      acquisitionType: 'Sous-traitance'
    },
    {
      id: 'eq-9',
      name: 'Matériaux de construction campement fixe',
      specs: 'Planches, briques, moellon, gravillons, sables, ciment et tôles pour base vie permanente',
      quantity: 1,
      unitPriceMGA: 50000000,
      totalPriceMGA: 50000000,
      acquisitionType: 'Achat'
    },
    {
      id: 'eq-10',
      name: 'Drone de levé magnétométrique',
      specs: 'DJI M600 Pro équipé du capteur magnétomètre SENSYS MagDrone R3',
      quantity: 1,
      unitPriceMGA: 8225000,
      totalPriceMGA: 8225000,
      acquisitionType: 'Sous-traitance'
    },
    {
      id: 'eq-11',
      name: 'Équipement de traitement de minerai (pilote)',
      specs: 'Mini-concasseur/broyeur, cuve de flottation de laboratoire, séparateur magnétique',
      quantity: 1,
      unitPriceMGA: 11725600,
      totalPriceMGA: 11725600,
      acquisitionType: 'Achat'
    }
  ],

  investmentsPhase: [
    {
      id: 'inv-1',
      phase: 'Phase préparatoire',
      activity: 'Préparation administrative et Documentation',
      initialAmountMGA: 5000000,
      adjustedAmountMGA: 5000000,
      startMonth: 'Mois 1',
      duration: '30 jours'
    },
    {
      id: 'inv-2',
      phase: 'Phase préparatoire',
      activity: 'Acquisition des matériels et matériaux',
      initialAmountMGA: 7765500,
      adjustedAmountMGA: 119525600,
      startMonth: 'Mois 1',
      duration: '60 jours',
      isAdjusted: true
    },
    {
      id: 'inv-3',
      phase: 'Phase préparatoire',
      activity: 'Création et/ou aménagement des voies d’accès',
      initialAmountMGA: 1428600,
      adjustedAmountMGA: 1428600,
      startMonth: 'Mois 3 / Mois 27',
      duration: '10 jours'
    },
    {
      id: 'inv-4',
      phase: 'Phase préparatoire',
      activity: 'Installation du campement (temporaire & fixe)',
      initialAmountMGA: 0,
      adjustedAmountMGA: 0,
      startMonth: 'Mois 3 / Mois 24',
      duration: '80 jours'
    },
    {
      id: 'inv-5',
      phase: 'Phase préparatoire',
      activity: 'Recrutement des personnels',
      initialAmountMGA: 40000000,
      adjustedAmountMGA: 40000000,
      startMonth: 'Mois 1',
      duration: '30 jours'
    },
    {
      id: 'inv-6',
      phase: 'Phase préparatoire',
      activity: 'Formation et renforcement des capacités des personnels',
      initialAmountMGA: 3000000,
      adjustedAmountMGA: 3000000,
      startMonth: 'Mois 2',
      duration: '30 jours'
    },
    {
      id: 'inv-7',
      phase: 'Phase préparatoire',
      activity: 'Frais d’administration minière (redevances & taxes)',
      initialAmountMGA: 954000,
      adjustedAmountMGA: 954000,
      startMonth: 'Mois 1',
      duration: '3 ans'
    },
    {
      id: 'inv-8',
      phase: 'Phase de recherche',
      activity: 'Bornage et levés topographiques',
      initialAmountMGA: 6110000,
      adjustedAmountMGA: 6110000,
      startMonth: 'Mois 29',
      duration: '3 jours'
    },
    {
      id: 'inv-9',
      phase: 'Phase de recherche',
      activity: 'Télédétection et traitement d’images',
      initialAmountMGA: 1000000,
      adjustedAmountMGA: 1000000,
      startMonth: 'Mois 3',
      duration: '1 jour'
    },
    {
      id: 'inv-10',
      phase: 'Phase de recherche',
      activity: 'Travaux géologiques et prospection cartographique',
      initialAmountMGA: 13232550,
      adjustedAmountMGA: 13232550,
      startMonth: 'Mois 3 / Mois 8',
      duration: '92 jours'
    },
    {
      id: 'inv-11',
      phase: 'Phase de recherche',
      activity: 'Travaux géophysiques (levé drone magnétométrie)',
      initialAmountMGA: 8225000,
      adjustedAmountMGA: 8225000,
      startMonth: 'Mois 7',
      duration: '1 jour'
    },
    {
      id: 'inv-12',
      phase: 'Phase de recherche',
      activity: 'Travaux géochimiques',
      initialAmountMGA: 1828125,
      adjustedAmountMGA: 1828125,
      startMonth: 'Mois 3',
      duration: '30 jours'
    },
    {
      id: 'inv-13',
      phase: 'Phase de recherche',
      activity: 'Travaux géotechniques',
      initialAmountMGA: 3000000,
      adjustedAmountMGA: 3000000,
      startMonth: 'Mois 28',
      duration: '15 jours'
    },
    {
      id: 'inv-14',
      phase: 'Phase de recherche',
      activity: 'Excavations / puits et tranchées',
      initialAmountMGA: 49167200,
      adjustedAmountMGA: 49167200,
      startMonth: 'Mois 9',
      duration: '50 jours'
    },
    {
      id: 'inv-15',
      phase: 'Phase de recherche',
      activity: 'Sondages carottés / Forages et modélisation',
      initialAmountMGA: 268380000,
      adjustedAmountMGA: 268380000,
      startMonth: 'Mois 27',
      duration: '40 jours'
    },
    {
      id: 'inv-16',
      phase: 'Phase de recherche',
      activity: 'Échantillonnage et analyses des échantillons (roches)',
      initialAmountMGA: 3772000,
      adjustedAmountMGA: 3772000,
      startMonth: 'Mois 3',
      duration: '20 jours'
    },
    {
      id: 'inv-17',
      phase: 'Phase de recherche',
      activity: 'Échantillonnage et analyses (géochimiques)',
      initialAmountMGA: 9440000,
      adjustedAmountMGA: 9440000,
      startMonth: 'Mois 4',
      duration: '30 jours'
    },
    {
      id: 'inv-18',
      phase: 'Phase de recherche',
      activity: 'Échantillonnage et analyses (tranchées / puits)',
      initialAmountMGA: 153400000,
      adjustedAmountMGA: 153400000,
      startMonth: 'Mois 10',
      duration: '30 jours'
    },
    {
      id: 'inv-19',
      phase: 'Phase de recherche',
      activity: 'Échantillonnage et analyses (forage carotté)',
      initialAmountMGA: 141600000,
      adjustedAmountMGA: 141600000,
      startMonth: 'Mois 28',
      duration: '30 jours'
    },
    {
      id: 'inv-20',
      phase: 'Phase de recherche',
      activity: 'Interprétation des données et évaluations des ressources',
      initialAmountMGA: 25000000,
      adjustedAmountMGA: 25000000,
      startMonth: 'Mois 30',
      duration: '15 jours'
    },
    {
      id: 'inv-21',
      phase: 'Phase de recherche',
      activity: 'Usine pilote d’essais métallurgiques',
      initialAmountMGA: 11725600,
      adjustedAmountMGA: 11725600,
      startMonth: 'Mois 29',
      duration: '15 jours'
    },
    {
      id: 'inv-22',
      phase: 'Phase de recherche',
      activity: 'Compensation des propriétaires fonciers',
      initialAmountMGA: 1700000,
      adjustedAmountMGA: 1700000,
      startMonth: 'Mois 8',
      duration: 'Progressive'
    },
    {
      id: 'inv-23',
      phase: 'Phase de fermeture/restauration',
      activity: 'Démantèlement, réhabilitation et restauration environnementale progressive',
      initialAmountMGA: 7769700,
      adjustedAmountMGA: 7769700,
      startMonth: 'Mois 8',
      duration: 'Progressive'
    }
  ],

  cmrmDeclared: [
    { code: 1, category: 'Études de bureau', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 5000000, initialAmountMGA: 5000000, adjustedAmountMGA: 5000000 },
    { code: 2, category: 'Prospection et travaux géologiques', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 13232550, initialAmountMGA: 13232550, adjustedAmountMGA: 13232550 },
    { code: 3, category: 'Activités géochimiques', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 1828125, initialAmountMGA: 1828125, adjustedAmountMGA: 1828125 },
    { code: 4, category: 'Activités géophysiques', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 8225000, initialAmountMGA: 8225000, adjustedAmountMGA: 8225000 },
    { code: 5, category: 'Télédétection', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 1000000, initialAmountMGA: 1000000, adjustedAmountMGA: 1000000 },
    { code: 6, category: 'Voies d’accès', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 1428600, initialAmountMGA: 1428600, adjustedAmountMGA: 1428600 },
    { code: 7, category: 'Forage et modélisation', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 268380000, initialAmountMGA: 268380000, adjustedAmountMGA: 268380000 },
    { code: 8, category: 'Travaux géotechniques', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 3000000, initialAmountMGA: 3000000, adjustedAmountMGA: 3000000 },
    { code: 9, category: 'Travaux topographiques', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 6110000, initialAmountMGA: 6110000, adjustedAmountMGA: 6110000 },
    {
      code: 10,
      category: 'Acquisitions de matériels et appareils',
      cautionBancaireMGA: 0,
      consignationFondsMGA: 0,
      autreGarantieMGA: 7765500,
      initialAmountMGA: 7765500,
      adjustedAmountMGA: 119525600,
      isAdjusted: true
    },
    { code: 11, category: 'Formation du personnel', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 2285700, initialAmountMGA: 2285700, adjustedAmountMGA: 2285700 },
    { code: 12, category: 'Réhabilitation environnementale', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 9469700, initialAmountMGA: 9469700, adjustedAmountMGA: 9469700 },
    { code: 13, category: 'Étude de préfaisabilité', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 36725600, initialAmountMGA: 36725600, adjustedAmountMGA: 36725600 }
  ],

  financingBreakdown: [
    { id: 'f-1', source: 'Fonds propres', form: 'Numéraire', use: 'Études de bureau', amountMGA: 5000000 },
    { id: 'f-2', source: 'Fonds propres', form: 'Numéraire', use: 'Prospection et travaux géologiques', amountMGA: 13232550 },
    { id: 'f-3', source: 'Fonds propres', form: 'Numéraire', use: 'Activités géochimiques', amountMGA: 1828125 },
    { id: 'f-4', source: 'Fonds propres', form: 'Numéraire', use: 'Activités géophysiques', amountMGA: 8225000 },
    { id: 'f-5', source: 'Fonds propres', form: 'Numéraire', use: 'Télédétection', amountMGA: 1000000 },
    { id: 'f-6', source: 'Fonds propres', form: 'Numéraire', use: 'Voies d’accès', amountMGA: 1428600 },
    { id: 'f-7', source: 'Fonds propres', form: 'Numéraire', use: 'Forage et modélisation', amountMGA: 268380000 },
    { id: 'f-8', source: 'Fonds propres', form: 'Numéraire', use: 'Travaux géotechniques', amountMGA: 3000000 },
    { id: 'f-9', source: 'Fonds propres', form: 'Numéraire', use: 'Travaux topographiques', amountMGA: 6110000 },
    { id: 'f-10', source: 'Fonds propres', form: 'Numéraire', use: 'Acquisitions de matériels et appareils', amountMGA: 7765500 },
    { id: 'f-11', source: 'Fonds propres', form: 'Numéraire', use: 'Formation du personnel', amountMGA: 2285700 },
    { id: 'f-12', source: 'Fonds propres', form: 'Numéraire', use: 'Réhabilitation environnementale', amountMGA: 9469700 },
    { id: 'f-13', source: 'Fonds propres', form: 'Numéraire', use: 'Étude de préfaisabilité', amountMGA: 36725600 },
    { id: 'f-14', source: 'Fonds propres', form: 'Numéraire', use: 'Installation', amountMGA: 0 },
    { id: 'f-15', source: 'Fonds propres', form: 'Numéraire', use: 'Recrutement des personnels', amountMGA: 40000000 },
    { id: 'f-16', source: 'Fonds propres', form: 'Numéraire', use: 'Frais d’administration minière', amountMGA: 954000 },
    { id: 'f-17', source: 'Fonds propres', form: 'Numéraire', use: 'RSE (Responsabilité Sociétale)', amountMGA: 31230000 }
  ],

  environmentalProvision: [
    { id: 'env-1', activity: 'Réhabilitation et restauration environnementale', amountMGA: 2840000 },
    { id: 'env-2', activity: 'Protection environnementale', amountMGA: 2270000 },
    { id: 'env-3', activity: 'Gestion des risques environnementaux liés aux activités minières', amountMGA: 2180000 },
    { id: 'env-4', activity: 'Reboisement', amountMGA: 2179700 }
  ],

  rseAnnualDeclared: 10410000,
  rseTotalDeclared: 31230000,
  rseDurationYears: 3,
  prseActivities: [
    'Formation des éleveurs (50 bénéficiaires à Antanambe)',
    'Formation des agriculteurs (100 bénéficiaires)',
    'Diversification artisanale (50 artisans locaux)',
    'Formation en langues touristiques (50 bénéficiaires Ambilobe)',
    'Réparation des routes communales desservant les localités',
    'Plantation de 2000 jeunes plants pour préservation environnementale',
    'Appui matériel scolaire et centres de santé CSB II'
  ],

  technicalManager: {
    name: 'Responsable Technique à désigner / Non mentionné explicitement',
    qualification: 'Diplôme d’Ingénieur Géologue / Mines requis',
    cvProvided: false,
    hasAdequateExperience: false
  },
  totalStaffCount: 17,
  nationalStaffCount: 14,
  expatriateStaffCount: 3,
  localPriorityCommitted: true,

  chemicals: [
    {
      name: 'Boue de forage (bentonite, barytine, hydroxyde de sodium, KCl, lubrifiants)',
      source: 'Afrique du Sud',
      quantity: '30 000 litres',
      usage: 'Refroidir trépan, lubrifier, remonter déblais de roche et stabiliser le trou'
    },
    {
      name: 'Carburant (Gasoil / Essence)',
      source: 'Fournisseur local',
      quantity: '16 270 litres',
      usage: 'Alimentation véhicules, engins de chantier, foreuse et groupe électrogène'
    },
    {
      name: 'Lubrifiant / Huile moteur et hydraulique',
      source: 'Fournisseur local',
      quantity: '503,5 litres',
      usage: 'Entretien et lubrification véhicules, engins et compresseurs'
    }
  ],

  samplesForecast: [
    { category: 'Sédiments de ruisseau', year1: '40 échantillons', year2: '-', year3: '-' },
    { category: 'Sols', year1: '0', year2: '-', year3: '-' },
    { category: 'Échantillons de tranchées et puits', year1: '600 échantillons (500 tranchées + 100 puits)', year2: '-', year3: '-' },
    { category: 'Échantillons de forage', year1: '100 carottes échantillonnées', year2: '-', year3: '-' }
  ],

  declarationDate: '06 Octobre 2025',
  isDeclarationSigned: true,
  signatory: 'Adrien Francisco MARCHAND, Gérant'
};

// Second Realistic Example: Gold Exploration permit in Betsiboa region
export const SAMPLE_41280_BETSIBOA: MiningPermitDocument = {
  id: '41280_PTPF_BETSIBOA',
  fileName: '41280_PTPF_Betsiboa_Gold.pdf',
  permitNumber: '41280',
  permitType: 'PR',
  bcmmCode: '912',
  movementType: 'NOUVEL OCTROI PR',
  filingDate: '15/01/2026',
  validityEnd: '15/01/2031',
  region: 'BETSIBOA',
  district: 'MAEVATANANA',
  commune: 'Marokoro',
  carresCount: 16,
  surfaceKm2: 6.25, // 16 carrés
  mineralsTitle: ['Or', 'Platinoïdes'],
  mineralsProject: ['Or', 'Platinoïdes'],
  mainMineral: 'Or',

  applicantName: 'BETSIBOA MINING RESOURCES S.A.',
  legalForm: 'S.A.',
  taxId: '5 001 842 901',
  headquarters: 'Zone Industrielle Forello, Tanjombato, Antananarivo',
  managerName: 'Dr. Hery RANDRIANASOLO',
  projectTitle: 'BETSIBOA GOLD PROJECT',
  status: 'Eligible',

  geologicalContext: 'Formations alluvionnaires récentes du bassin versant de l’Ikopa et quartzites aurifères du Protérozoïque.',
  geologicalMapRef: 'Feuille géologique Maevatanana S-45',
  artisanalActivityPresent: true,
  artisanalManagementPlan: 'Présence d’orpaillage artisanal traditionnel sur les terrasses; couloir d’orpaillage réservé de 2 carrés et encadrement technique.',
  previousWork: 'Travaux historiques du Service Géologique et batayage systématique de 120 puits artisanaux.',

  remoteSensingMethods: ['LiDAR aéroporté haute résolution', 'Imagerie multispectrale ASTER'],
  geodesyMethod: 'Station totale Leica & réseau GNSS RTK centimétrique',
  drillingCount: 12,
  drillingDepthM: 600,
  trenchesLengthM: 250,
  pitsCount: 40,
  coveredAreaKm2: 5.5,
  laboratories: ['ALS Minerals (Johannesburg)', 'OMNIS Antananarivo (Préparation)'],
  qaQcMeasures: ['Duplicatas terrain 5%', 'Blancs de silice 5%', 'Standards certifiés Rocklabs (Au)'],

  equipmentList: [
    { id: 'eq-1', name: 'Équipements de Sécurité EPI', specs: 'Bottes, casques, masques anti-poussière', quantity: 20, unitPriceMGA: 350000, totalPriceMGA: 7000000, acquisitionType: 'Achat' },
    { id: 'eq-2', name: 'Groupe électrogène insonorisé', specs: '15 kVA Diesel Caterpillar', quantity: 1, unitPriceMGA: 22000000, totalPriceMGA: 22000000, acquisitionType: 'Achat' },
    { id: 'eq-3', name: 'Station Totale & GPS RTK', specs: 'Trimble R12i GNSS récepteur bi-fréquence', quantity: 1, unitPriceMGA: 45000000, totalPriceMGA: 45000000, acquisitionType: 'Achat' },
    { id: 'eq-4', name: 'Location 2 véhicules 4x4 pick-up', specs: 'Toyota Hilux 4x4 double cabine (300 jours)', quantity: 300, unitPriceMGA: 280000, totalPriceMGA: 84000000, acquisitionType: 'Location' },
    { id: 'eq-5', name: 'Campagne de sondage carotté (Sous-traitance)', specs: 'Foreuse Boart Longyear LF70 / 600m carottés NQ', quantity: 600, unitPriceMGA: 650000, totalPriceMGA: 390000000, acquisitionType: 'Sous-traitance' },
    { id: 'eq-6', name: 'Matériaux base-vie démontable', specs: 'Containers aménagés bureaux et dortoirs', quantity: 1, unitPriceMGA: 80000000, totalPriceMGA: 80000000, acquisitionType: 'Achat' }
  ],

  investmentsPhase: [
    { id: 'inv-1', phase: 'Phase préparatoire', activity: 'Études et montage du dossier', initialAmountMGA: 12000000, adjustedAmountMGA: 12000000, startMonth: 'Mois 1', duration: '60 jours' },
    { id: 'inv-2', phase: 'Phase préparatoire', activity: 'Acquisition des matériels et matériaux', initialAmountMGA: 25000000, adjustedAmountMGA: 238000000, startMonth: 'Mois 2', duration: '90 jours', isAdjusted: true },
    { id: 'inv-3', phase: 'Phase préparatoire', activity: 'Aménagement voies de desserte', initialAmountMGA: 15000000, adjustedAmountMGA: 15000000, startMonth: 'Mois 3', duration: '30 jours' },
    { id: 'inv-4', phase: 'Phase préparatoire', activity: 'Installation campement de base', initialAmountMGA: 40000000, adjustedAmountMGA: 40000000, startMonth: 'Mois 3', duration: '45 jours' },
    { id: 'inv-5', phase: 'Phase préparatoire', activity: 'Recrutement et formation', initialAmountMGA: 50000000, adjustedAmountMGA: 50000000, startMonth: 'Mois 2', duration: '60 jours' },
    { id: 'inv-6', phase: 'Phase de recherche', activity: 'Levés géophysiques et cartographie', initialAmountMGA: 95000000, adjustedAmountMGA: 95000000, startMonth: 'Mois 4', duration: '120 jours' },
    { id: 'inv-7', phase: 'Phase de recherche', activity: 'Campagne forages et analyses de laboratoire', initialAmountMGA: 520000000, adjustedAmountMGA: 520000000, startMonth: 'Mois 8', duration: '180 jours' },
    { id: 'inv-8', phase: 'Phase de recherche', activity: 'Études de préfaisabilité technico-économique', initialAmountMGA: 150000000, adjustedAmountMGA: 150000000, startMonth: 'Mois 20', duration: '180 jours' },
    { id: 'inv-9', phase: 'Phase de fermeture/restauration', activity: 'Réhabilitation des sites forés et reboisement', initialAmountMGA: 28000000, adjustedAmountMGA: 28000000, startMonth: 'Mois 12', duration: 'Progressive' }
  ],

  cmrmDeclared: [
    { code: 1, category: 'Études de bureau', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 12000000, initialAmountMGA: 12000000, adjustedAmountMGA: 12000000 },
    { code: 2, category: 'Prospection et travaux géologiques', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 45000000, initialAmountMGA: 45000000, adjustedAmountMGA: 45000000 },
    { code: 3, category: 'Activités géochimiques', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 30000000, initialAmountMGA: 30000000, adjustedAmountMGA: 30000000 },
    { code: 4, category: 'Activités géophysiques', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 50000000, initialAmountMGA: 50000000, adjustedAmountMGA: 50000000 },
    { code: 5, category: 'Télédétection', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 15000000, initialAmountMGA: 15000000, adjustedAmountMGA: 15000000 },
    { code: 6, category: 'Voies d’accès', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 15000000, initialAmountMGA: 15000000, adjustedAmountMGA: 15000000 },
    { code: 7, category: 'Forage et modélisation', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 450000000, initialAmountMGA: 450000000, adjustedAmountMGA: 450000000 },
    { code: 8, category: 'Travaux géotechniques', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 20000000, initialAmountMGA: 20000000, adjustedAmountMGA: 20000000 },
    { code: 9, category: 'Travaux topographiques', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 25000000, initialAmountMGA: 25000000, adjustedAmountMGA: 25000000 },
    { code: 10, category: 'Acquisitions de matériels et appareils', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 25000000, initialAmountMGA: 25000000, adjustedAmountMGA: 238000000, isAdjusted: true },
    { code: 11, category: 'Formation du personnel', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 10000000, initialAmountMGA: 10000000, adjustedAmountMGA: 10000000 },
    { code: 12, category: 'Réhabilitation environnementale', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 28000000, initialAmountMGA: 28000000, adjustedAmountMGA: 28000000 },
    { code: 13, category: 'Étude de préfaisabilité', cautionBancaireMGA: 0, consignationFondsMGA: 0, autreGarantieMGA: 120000000, initialAmountMGA: 120000000, adjustedAmountMGA: 120000000 }
  ],

  financingBreakdown: [
    { id: 'f-1', source: 'Fonds propres associés', form: 'Numéraire', use: 'Programme de recherche et développement minier', amountMGA: 1200000000 },
    { id: 'f-2', source: 'Partenaire technique', form: 'Numéraire', use: 'Campagne de forages profonds', amountMGA: 300000000 }
  ],

  environmentalProvision: [
    { id: 'env-1', activity: 'Comblement et régalage des tranchées', amountMGA: 10000000 },
    { id: 'env-2', activity: 'Bouchage et cimentation des têtes de sondages', amountMGA: 6000000 },
    { id: 'env-3', activity: 'Reboisement communautaire (5 000 acacias)', amountMGA: 7000000 },
    { id: 'env-4', activity: 'Bassins de décantation et suivi hydrogéologique', amountMGA: 5000000 }
  ],

  rseAnnualDeclared: 25000000,
  rseTotalDeclared: 75000000,
  rseDurationYears: 3,
  prseActivities: [
    'Construction d’un centre de santé CSB I à Marokoro',
    'Aménagement d’un point d’eau potable solaire',
    'Formation de 100 orpailleurs aux méthodes gravimétriques sans mercure'
  ],

  technicalManager: {
    name: 'Ing. Tiana ANDRIANTSOA',
    qualification: 'Ingénieur des Mines et Géologue Sénior (18 ans d’expérience)',
    cvProvided: true,
    hasAdequateExperience: true
  },
  totalStaffCount: 28,
  nationalStaffCount: 25,
  expatriateStaffCount: 3,
  localPriorityCommitted: true,

  chemicals: [
    { name: 'Boue de forage biodégradable', source: 'Importation', quantity: '45 000 L', usage: 'Forages diamantés profonds' },
    { name: 'Carburant Gasoil', source: 'TotalEnergies Maevatanana', quantity: '38 000 L', usage: 'Engins et foreuse' }
  ],

  samplesForecast: [
    { category: 'Sédiments de ruisseau', year1: '150 échantillons', year2: '50 échantillons', year3: '-' },
    { category: 'Sols en maille', year1: '400 échantillons', year2: '200 échantillons', year3: '-' },
    { category: 'Carottes de forage', year1: '250 carottes analysées', year2: '350 carottes', year3: '-' }
  ],

  declarationDate: '12 Janvier 2026',
  isDeclarationSigned: true,
  signatory: 'Dr. Hery RANDRIANASOLO, Directeur Général'
};
