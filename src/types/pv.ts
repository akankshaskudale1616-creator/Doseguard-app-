/**
 * DoseGuard - Pharmacovigilance Data Models & Types
 * Compliant with WHO-UMC, PvPI (Pharmacovigilance Programme of India) ADRMS standards
 */

export type UrgencyLevel = 'EMERGENCY' | 'URGENT_CLINICAL' | 'PHARMACIST_REVIEW' | 'MONITOR';

export type CausalityCategory = 'LOW_ASSOCIATION' | 'POSSIBLE' | 'PROBABLE' | 'HIGH_PRIORITY_ADR';

export type MedicineStatus = 'active' | 'stopped' | 'missed' | 'dose_changed';

export interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler' | 'Ointment' | 'Other';
  frequency: string;
  route: string;
  startDate: string;
  stoppedDate?: string;
  status: MedicineStatus;
  prescriber: string;
  indication: string;
  batchNumber?: string;
  source: 'ocr' | 'barcode' | 'manual';
  verifiedByPharmacist: boolean;
  ocrConfidence?: number;
  isSuspected?: boolean;
  labelPhoto?: string;
  attachment?: MedicationAttachment;
}

export interface MedicationAttachment {
  id: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  dataUrl: string;
  capturedAt: string;
  source: 'camera' | 'upload' | 'sample';
  batchNumber?: string;
  expiryDate?: string;
  notes?: string;
}

export interface VitalSigns {
  bpSystolic?: number;
  bpDiastolic?: number;
  heartRate?: number;
  spo2?: number;
  tempC?: number;
  bloodGlucose?: number;
  recordedAt?: string;
}

export interface MedDRATerm {
  pt: string; // Preferred Term (e.g. "Rash maculo-papular", "Angioedema")
  soc: string; // System Organ Class (e.g. "Skin and subcutaneous tissue disorders")
  code: string;
}

export interface SymptomReport {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  isElderlyPolypharmacy: boolean; // Age >= 60, 5+ meds
  reportedAt: string;
  inputLanguage: string; // Supported regional vernacular or international language (e.g. 'mr' | 'hi' | 'en' | 'ta' | 'te' | 'bn' | 'gu')
  originalText: string;
  translatedText: string;
  extractedSymptoms: string[];
  meddraTerms: MedDRATerm[];
  negatedSymptoms: string[];
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  onsetDate: string;
  durationDays: number;
  bodyLocations: string[];
  imageUrl?: string;
  vitals?: VitalSigns;
  emergencyRedFlags: string[];
  followUpResponses: Record<string, boolean | string>;
  outcome: 'recovering' | 'recovered' | 'persisting' | 'worsening' | 'hospitalized' | 'unknown';
  
  // Triage & Engine Results
  urgencyLevel: UrgencyLevel;
  completenessScore: number; // 0 - 100%
  missingFields: string[];
  
  // Temporal Causality Breakdown (Formula C_ADR)
  causality: CausalityScore;
  
  // Pharmacist review status
  reviewStatus: 'pending' | 'in_review' | 'verified' | 'escalated_physician' | 'unlikely_pv' | 'submitted_pvpi';
  pharmacistNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  pvpiCaseId?: string;
}

export interface CausalityScore {
  cAdrTotal: number; // 0 - 100
  category: CausalityCategory;
  categoryLabel: string;
  userFacingAdvice: string;
  breakdown: {
    temporalFit_T: { score: number; max: number; weight: number; contribution: number; rationale: string };
    doseResponse_D: { score: number; max: number; weight: number; contribution: number; rationale: string };
    knownAssociation_K: { score: number; max: number; weight: number; contribution: number; rationale: string };
    dechallenge_R: { score: number; max: number; weight: number; contribution: number; rationale: string };
    hostFactors_H: { score: number; max: number; weight: number; contribution: number; rationale: string };
    alternativeExplanations_A: { score: number; max: number; weight: number; contribution: number; rationale: string };
  };
  explanation: string;
}

export interface SignalMetric {
  drugName: string;
  symptomTerm: string;
  prr: number; // Proportional Reporting Ratio (> 2 implies potential signal)
  ror: number; // Reporting Odds Ratio
  caseCount: number;
  backgroundCases: number;
  chiSquare: number;
  signalStatus: 'CONFIRMED_SIGNAL' | 'EMERGING_SIGNAL' | 'INSUFFICIENT_EVIDENCE';
  socialMediaTrend: {
    velocityPercent: number; // +84% mention jump
    samplePublicPostsCount: number;
    disclaimer: string;
  };
}

export interface PvPIExportPackage {
  messageHeader: {
    messageDate: string;
    version: string;
    senderId: string;
    senderType: 'COMMUNITY_PHARMACY' | 'AMC_CENTRE' | 'HOSPITAL_PV';
  };
  patientData: {
    identifier: string;
    age: number;
    gender: string;
    weightKg?: number;
    concomitantConditions: string[];
  };
  suspectedMedicines: Array<{
    name: string;
    dose: string;
    route: string;
    indication: string;
    startDate: string;
    stopDate?: string;
    batchLot?: string;
    manufacturer?: string;
    causalityCategory: string;
  }>;
  concomitantMedicines: Array<{
    name: string;
    dose: string;
    indication: string;
  }>;
  reactionData: {
    reactionTerms: string[];
    meddraCodes: string[];
    onsetDate: string;
    seriousnessCriteria: string[];
    outcome: string;
    dechallengeResponse: string;
    rechallengeResponse: string;
  };
  reporterDetails: {
    reporterType: 'Pharmacist' | 'Patient/Caregiver' | 'Physician';
    institution: string;
    city: string;
    country: string;
  };
  cAdrScore: number;
  urgencyLevel: string;
}

export type UserRole =
  | 'patient'
  | 'caregiver'
  | 'pharmacist'
  | 'physician'
  | 'hospital_pv'
  | 'amc'
  | 'regulator'
  | 'researcher';

export interface UserGroupProfile {
  id: UserRole;
  name: string;
  roleTitle: string;
  userName: string;
  accessCategory: string;
  primaryRole: string;
  avatar: string;
  badgeColor: string;
  institution: string;
  permissions: string[];
}

export interface MedicationReminder {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  timeSlot: 'Morning' | 'Noon' | 'Evening' | 'Bedtime';
  scheduledTime: string; // e.g. "08:00"
  instructions?: string;
  isEnabled: boolean;
  soundEnabled: boolean;
  takenToday: boolean;
}

export interface ReminderNotification {
  id: string;
  reminderId: string;
  medicineName: string;
  timestamp: string;
  type: 'missed' | 'due' | 'taken' | 'skipped';
  read: boolean;
}

// ================= MULTI-ROLE CLINICAL WORKSPACE TYPES =================

export type DispenseStatus = 'Pending' | 'Processing' | 'Ready for Pickup/Delivery' | 'Completed';

export interface ElectronicPrescription {
  id: string; // e.g. "ERX-9821"
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  prescriberName: string;
  prescriberRegistration: string;
  hospital: string;
  date: string;
  diagnosis: string;
  medications: Array<{
    id: string;
    brandName: string;
    genericName: string;
    strength: string;
    dosageForm: string;
    frequency: string;
    route: string;
    durationDays: number;
    refills: number;
    instructions: string;
  }>;
  dispenseStatus: DispenseStatus;
  pharmacyName: string;
  allergyCheckPassed: boolean;
  allergyNotes?: string;
  interactionCheckPassed: boolean;
  interactionNotes?: string;
  dosageVerificationPassed: boolean;
  dosageNotes?: string;
  pharmacistNotes?: string;
  verifiedAt?: string;
  completedAt?: string;
}

export interface DrugInventoryItem {
  id: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  stockQuantity: number;
  unit: string;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string;
  mrp: number; // ₹
  costPrice: number; // ₹
  genericAlternative?: {
    brandName: string;
    genericName: string;
    mrp: number;
    savingsPercent: number;
  };
  status: 'In Stock' | 'Low Stock' | 'Critical Low' | 'Expiring Soon';
}

export interface RefillRequest {
  id: string;
  patientId: string;
  patientName: string;
  medicineName: string;
  dosage: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Dispensed' | 'Declined';
  notes?: string;
}

export interface PharmacistConsultationLog {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  pharmacistName: string;
  topicsCovered: string[];
  notes: string;
  refillAuthorized: boolean;
  nextFollowUp?: string;
}

export interface TelehealthAppointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  dateTime: string;
  type: 'In-person' | 'Virtual Telehealth';
  status: 'Scheduled' | 'Completed' | 'In Progress';
  meetUrl?: string;
  reason: string;
}

export interface ConsultationSoapNote {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  doctorName: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface DirectChatMessage {
  id: string;
  sender: 'patient' | 'physician' | 'pharmacist';
  senderName: string;
  recipient: 'patient' | 'physician' | 'pharmacist';
  text: string;
  timestamp: string;
}

export interface VitalSignEntry {
  id: string;
  date: string;
  time: string;
  bpSystolic: number;
  bpDiastolic: number;
  bloodGlucose: number;
  glucoseType: 'Fasting' | 'Post-Meal' | 'Random';
  heartRate: number;
  tempC?: number;
  spo2?: number;
  notes?: string;
}

export interface PatientLabResult {
  id: string;
  testName: string;
  category: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  date: string;
}

export interface PatientDocumentedAllergy {
  id: string;
  substance: string;
  reaction: string;
  severity: 'Mild' | 'Moderate' | 'Severe (Anaphylaxis)';
  diagnosedDate: string;
}

// ================= VISUAL ADR MAPPING & MEDICATION HISTORY =================

export type OrganSystemType =
  | 'cns'
  | 'face_lips'
  | 'airway_pulmonary'
  | 'cardiovascular'
  | 'hepatic'
  | 'gi_tract'
  | 'renal'
  | 'skin_cutaneous'
  | 'musculoskeletal'
  | 'hematologic';

export interface VisualAdrEvent {
  id: string;
  patientId: string;
  patientName: string;
  organSystem: OrganSystemType;
  organLabel: string;
  reactionName: string;
  meddraTerm: string;
  meddraCode: string;
  meddraSoc: string;
  suspectedDrug: {
    id?: string;
    brandName: string;
    genericName: string;
    dose: string;
    route: string;
    startDate: string;
    batchNumber?: string;
  };
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  causalityScore: number; // 0-100 C_ADR Indian formula
  naranjoScore: number; // Naranjo algorithm score
  causalityCategory: 'HIGH_PRIORITY_ADR' | 'PROBABLE' | 'POSSIBLE' | 'LOW_ASSOCIATION';
  onsetDate: string;
  latencyDays: number;
  dechallengeStatus: 'Positive (Resolved on stopping)' | 'Negative' | 'In Progress / Suspected Withheld' | 'Not Performed';
  rechallengeStatus: 'Contraindicated (Not re-challenged)' | 'Negative' | 'Positive';
  outcome: 'Recovering' | 'Recovered' | 'Persisting' | 'Worsening' | 'Hospitalized';
  photoEvidenceUrl?: string;
  clinicalAction: string;
  reportedBy: string;
  status: 'active_alert' | 'under_review' | 'resolved' | 'escalated';
  coordinates: { x: number; y: number }; // Percentage position on anatomical diagram
}

export interface MedicationHistoryRecord {
  id: string;
  patientId: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  frequency: string;
  route: string;
  indication: string;
  prescriber: string;
  prescriberRegistration?: string;
  hospital: string;
  pharmacyName: string;
  batchNumber: string;
  startDate: string;
  endDate?: string;
  durationText: string;
  status: 'active' | 'discontinued_adr' | 'discontinued_ineffective' | 'completed_course' | 'dose_adjusted';
  statusReason?: string;
  adrLinkedId?: string;
  adrSummary?: string;
  adherenceRatePercent: number; // e.g. 96%
  dechallengeResponse?: string;
  substitutionDrug?: string;
  notes: string;
  prescribedDate: string;
}

