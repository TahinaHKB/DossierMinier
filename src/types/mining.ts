export interface MiningPermitDocument {
  id: string;
  fileName: string;
  permitNumber: string;
  permitType: string;
  bcmmCode: string;
  movementType: string;
  filingDate: string;
  validityEnd: string;
  region: string;
  district: string;
  commune: string;
  carresCount: number;
  surfaceKm2: number;
  mineralsTitle: string[];
  mineralsProject: string[];
  mainMineral: string;
  
  // Titulaire
  applicantName: string;
  legalForm: string;
  taxId: string;
  headquarters: string;
  managerName: string;
  projectTitle: string;
  status: string;

  // Géologie & Travaux
  geologicalContext: string;
  geologicalMapRef: string;
  artisanalActivityPresent: boolean;
  artisanalManagementPlan: string;
  previousWork: string;

  // Programme
  remoteSensingMethods: string[];
  geodesyMethod: string;
  drillingCount: number;
  drillingDepthM: number;
  trenchesLengthM: number;
  pitsCount: number;
  coveredAreaKm2: number;
  laboratories: string[];
  qaQcMeasures: string[];

  // Équipements (Tableau V.2)
  equipmentList: EquipmentItem[];

  // Investissements (Tableau V.1)
  investmentsPhase: InvestmentPhaseItem[];

  // CMRM déclaré (Tableau V.3)
  cmrmDeclared: CmrmItem[];

  // Financement (Tableau VI-1)
  financingBreakdown: FinancingItem[];

  // Provision environnementale (Tableau VI-2)
  environmentalProvision: EnvironmentalItem[];

  // RSE & PRSE
  rseAnnualDeclared: number;
  rseTotalDeclared: number;
  rseDurationYears: number;
  prseActivities: string[];

  // Personnel
  technicalManager: {
    name: string;
    qualification: string;
    cvProvided: boolean;
    hasAdequateExperience: boolean;
  };
  totalStaffCount: number;
  nationalStaffCount: number;
  expatriateStaffCount: number;
  localPriorityCommitted: boolean;

  // Substances chimiques
  chemicals: ChemicalItem[];

  // Échantillons prévisionnels
  samplesForecast: SampleForecastItem[];

  // Déclaration
  declarationDate: string;
  isDeclarationSigned: boolean;
  signatory: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  specs: string;
  quantity: number;
  unitPriceMGA: number;
  totalPriceMGA: number;
  acquisitionType: 'Achat' | 'Location' | 'Sous-traitance';
  isAlreadyAcquired?: boolean;
}

export interface InvestmentPhaseItem {
  id: string;
  phase: 'Phase préparatoire' | 'Phase de recherche' | 'Phase de fermeture/restauration';
  activity: string;
  initialAmountMGA: number;
  adjustedAmountMGA: number;
  startMonth: string;
  duration: string;
  isAdjusted?: boolean;
}

export interface CmrmItem {
  code: number;
  category: string;
  cautionBancaireMGA: number;
  consignationFondsMGA: number;
  autreGarantieMGA: number; // Apport de fonds d'associés
  initialAmountMGA: number;
  adjustedAmountMGA: number;
  isAdjusted?: boolean;
}

export interface FinancingItem {
  id: string;
  source: string;
  form: 'Numéraire' | 'Nature';
  use: string;
  amountMGA: number;
}

export interface EnvironmentalItem {
  id: string;
  activity: string;
  amountMGA: number;
}

export interface ChemicalItem {
  name: string;
  source: string;
  quantity: string;
  usage: string;
}

export interface SampleForecastItem {
  category: string;
  year1: string;
  year2: string;
  year3: string;
}

export interface EvaluationStepResult {
  stepNumber: string;
  title: string;
  maxScore: number;
  currentScore: number;
  status: 'CONFORME' | 'ACCEPTABLE' | 'NON_ADMISSIBLE' | 'DCI';
  summary: string;
  arithmeticOperations: string[];
  findings: FindingItem[];
  tableResultData: Record<string, any>;
  humanOverrideScore?: number;
  humanComments?: string;
  isApprovedByHuman?: boolean;
}

export interface FindingItem {
  severity: 'success' | 'warning' | 'error' | 'dci';
  category: string;
  message: string;
  actionRequired?: string;
}

export interface EvaluationPivotValues {
  coutMateriel1: number; // Somme V.2 - Sous-traitance - Déjà acquis
  sommeTotaleV2: number;
  totalSousTraitance: number;
  totalMaterielAcquis: number;
  
  totalCmrmInitial: number;
  totalCmrmAjuste: number;

  totalInvestissementInitial: number;
  totalInvestissementAjuste: number;

  rseMinRequis: number; // 2% * Investissement total ajusté
  rseDeclare: number;
  rseAjuste: number;

  planFinancementRequis: number; // I_adj + RSE_ajusté
  planFinancementDeclare: number;
  planFinancementAjuste: number;

  prseAnnuelRequis: number; // RSE_ajusté / 3
  prseAnnuelDeclare: number;
  prseTotal: number;
}

export interface FullEvaluationReport {
  documentId: string;
  evaluationDate: string;
  evaluatorRole: string;
  evaluatorName: string;
  pivots: EvaluationPivotValues;
  steps: {
    etape1_substances: EvaluationStepResult;
    etape2a_geologie: EvaluationStepResult;
    etape2b_programme: EvaluationStepResult;
    etape2c_rh: EvaluationStepResult;
    etape3_materiels: EvaluationStepResult;
    etape4_cmrm: EvaluationStepResult;
    etape5_pertinence: EvaluationStepResult;
    etape6_financement: EvaluationStepResult;
    etape7_declaration_prse: EvaluationStepResult;
  };
  totalScore: number;
  maxScore: number; // 110
  verdict: 'DOSSIER_CONFORME' | 'ACCEPTABLE_AJUSTEMENTS' | 'NON_ADMISSIBLE_DCI';
  administrativeConsequence: string;
  isOfficiallyValidated: boolean;
  validationTimestamp?: string;
}
