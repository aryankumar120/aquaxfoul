export type VesselType =
  | 'Container Ship'
  | 'Bulk Carrier'
  | 'General Cargo'
  | 'LNG Carrier'
  | 'Mega Container Ship'
  | 'Cruise'
  | 'Tanker'
  | 'Other';

export type VesselStatus = 'Active' | 'In Maintenance' | 'Anchored' | 'Dry Dock' | 'Decommissioned';

export type FoulingRiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface Vessel {
  id: string;
  imo: string;
  name: string;
  yardNumber: string;
  type: VesselType;
  category: string;
  technicalManager: string;
  managerDomicile: string;
  managerRegistration: string;
  dwt: number;
  gt: number;
  teu?: number;
  teu14?: number;
  builtYear: number;
  flag: string;
  lengthMeters: number;
  beamMeters: number;
  draftMeters: number;
  status: VesselStatus;
  foulingRisk: FoulingRiskLevel;
  foulingRating: number; // 0 - 100%
  lastInspectionDate: string;
  nextCleaningDueDate: string;
  currentRoute?: string;
  speedKnots: number;
  fuelConsumptionTonsPerDay: number;
}

export interface InspectionRecord {
  id: string;
  vesselId: string;
  date: string;
  type: 'Underwater Drone / ROV' | 'Diver Video' | 'Dry Dock Survey' | 'Port State Inspection';
  inspector: string;
  location: string;
  hullRating: number; // 1-5 scale or %
  propellerCondition: 'Clean' | 'Light Slime' | 'Heavy Macrofouling' | 'Calcareous Growth';
  findings: string;
  status: 'Completed' | 'Pending Review';
}

export interface FoulingAssessmentRecord {
  id: string;
  vesselId: string;
  date: string;
  riskLevel: FoulingRiskLevel;
  foulingCoveragePct: number;
  roughnessMicrons: number;
  speedLossPct: number;
  excessFuelPct: number;
  estimatedCo2PenaltyTons: number;
  assessedBy: string;
}

export interface CleaningEvent {
  id: string;
  vesselId: string;
  date: string;
  location: string;
  provider: string;
  method: 'In-Water ROV Hull Cleaning' | 'Propeller Hydro-Polish' | 'Full Dry Dock Grit Blasting';
  status: 'Completed' | 'Scheduled' | 'In Progress';
  beforeRating: number;
  afterRating: number;
  efficiencyGainPct: number;
  costUsd: number;
  co2SavedTonsEst: number;
}

export interface PerformanceRecord {
  id: string;
  vesselId: string;
  date: string;
  speedKnots: number;
  fuelConsumptionTonsPerDay: number;
  slipRatioPct: number;
  weatherBeaufort: number;
  excessFuelPenaltyPct: number;
}

export interface ScenarioProjection {
  scenarioId: 'no-cleaning' | 'clean-now' | 'clean-later';
  scenarioName: string;
  description: string;
  recommendationBadge?: string;
  cleaningDate?: string;
  projectedFoulingPct: number;
  excessFuelTons: number;
  excessCo2Tons: number;
  financialImpactUsd: number;
  efficiencyRecoveryPct: number;
  series: {
    month: string;
    historical?: number;
    projected: number;
  }[];
}

export interface VesselProjections {
  vesselId: string;
  vesselName: string;
  imo: string;
  calculatedAt: string;
  optimalCleaningWindow: string;
  recommendedAction: string;
  currentPenaltyUsdPerDay: number;
  confidenceIntervalPct: number;
  scenarios: {
    noCleaning: ScenarioProjection;
    cleanNow: ScenarioProjection;
    cleanLater: ScenarioProjection;
  };
}

export interface AlertItem {
  id: string;
  vesselId: string;
  vesselName: string;
  imo: string;
  message: string;
  severity: 'critical' | 'high' | 'warning' | 'info';
  timestamp: string;
  timeAgo: string;
}

export interface DashboardSummary {
  kpis: {
    totalVessels: { value: number; changePct: number; trend: number[] };
    activeVessels: { value: number; changePct: number; trend: number[] };
    requiringAttention: { value: number; changePct: number; trend: number[] };
    cleaningDue: { value: number; changePct: number; trend: number[] };
    estimatedCo2Savings: { value: number; changePct: number; trend: number[] };
  };
  vesselDistribution: {
    type: VesselType;
    count: number;
    percentage: number;
    color: string;
  }[];
  riskDistribution: {
    level: FoulingRiskLevel;
    count: number;
    color: string;
  }[];
  fuelConsumptionTrend: {
    month: string;
    value: number;
  }[];
  recentVessels: Vessel[];
  recentAlerts: AlertItem[];
}

export interface VesselFilterParams {
  search?: string;
  type?: string;
  category?: string;
  technicalManager?: string;
  managerDomicile?: string;
  minDwt?: number;
  maxDwt?: number;
  minGt?: number;
  maxGt?: number;
  status?: string;
  foulingRisk?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'Fleet Biofouling Audit' | 'Vessel Performance' | 'Cleaning ROI' | 'IMO DCS Emissions' | 'Executive Summary';
  targetVessel?: string;
  generatedDate: string;
  period: string;
  fileSizeBytes: string;
  format: 'PDF' | 'CSV' | 'XLSX';
  status: 'Ready' | 'Generating';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  avatarUrl?: string;
}
