export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'mr'
  | 'ta'
  | 'te'
  | 'bn'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'es'
  | 'fr';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  script: string;
  region: string;
  speakersCount: string;
  pvpiStatus: 'Official National' | 'Scheduled Regional' | 'International';
  greeting: string;
  sampleSymptomPhrase: string;
  sampleSymptomTranslation: string;
}

export interface VernacularMeddraMapping {
  id: string;
  language: SupportedLanguage;
  colloquialPhrase: string;
  script: string;
  englishMeaning: string;
  meddraTerm: string;
  meddraCode: string;
  socCategory: string; // System Organ Class
  urgency: 'EMERGENCY' | 'HIGH' | 'MODERATE' | 'LOW';
  redFlagReason?: string;
  suspectedDrugAssociation: string;
}

export interface RegionalPvCenter {
  id: string;
  regionName: string;
  statesCovered: string[];
  primaryLanguages: string[];
  centerName: string;
  city: string;
  tollFreeNumber: string;
  helplineTiming: string;
  inCharge: string;
  vernacularSupport: boolean;
}
