import { Medicine, SymptomReport, SignalMetric, UserGroupProfile, MedicationReminder } from '../types/pv';

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-01',
    brandName: 'Augmentin 625 Duo',
    genericName: 'Amoxicillin + Clavulanic Acid',
    strength: '500 mg + 125 mg',
    dosageForm: 'Tablet',
    frequency: 'Twice daily (after food)',
    route: 'Oral',
    startDate: '2026-10-01',
    status: 'active',
    prescriber: 'Dr. S. Kulkarni (Chest Physician)',
    indication: 'Acute Bronchitis / Lower Respiratory Tract Infection',
    batchNumber: 'AX26-904',
    source: 'ocr',
    verifiedByPharmacist: true,
    ocrConfidence: 0.94,
    isSuspected: true,
    labelPhoto: '/src/assets/images/medicine_blister_pack_1791221295842.jpg',
    attachment: {
      id: 'att-01',
      fileName: 'augmentin_625_label_scan.jpg',
      fileSize: '418 KB',
      mimeType: 'image/jpeg',
      dataUrl: '/src/assets/images/medicine_blister_pack_1791221295842.jpg',
      capturedAt: '2026-10-01 10:24 AM',
      source: 'camera',
      batchNumber: 'AX26-904',
      expiryDate: '08/2027',
      notes: 'Physical blister strip photographed via device camera. Verified against patient prescription.',
    },
  },
  {
    id: 'med-02',
    brandName: 'Glycomet-GP 1',
    genericName: 'Metformin + Glimepiride',
    strength: '500 mg + 1 mg',
    dosageForm: 'Tablet',
    frequency: 'Once daily (morning)',
    route: 'Oral',
    startDate: '2024-03-15',
    status: 'active',
    prescriber: 'Dr. V. Joshi (Endocrinologist)',
    indication: 'Type 2 Diabetes Mellitus',
    batchNumber: 'GM-4412',
    source: 'manual',
    verifiedByPharmacist: true,
    ocrConfidence: 1.0,
    isSuspected: false,
  },
  {
    id: 'med-03',
    brandName: 'Amlodac 5',
    genericName: 'Amlodipine Besylate',
    strength: '5 mg',
    dosageForm: 'Tablet',
    frequency: 'Once daily (bedtime)',
    route: 'Oral',
    startDate: '2023-08-10',
    status: 'active',
    prescriber: 'Dr. A. Sharma (Cardiologist)',
    indication: 'Essential Hypertension',
    batchNumber: 'AM-1089',
    source: 'manual',
    verifiedByPharmacist: true,
    ocrConfidence: 1.0,
    isSuspected: false,
  },
  {
    id: 'med-04',
    brandName: 'Ecosprin 75',
    genericName: 'Aspirin (Enteric Coated)',
    strength: '75 mg',
    dosageForm: 'Tablet',
    frequency: 'Once daily (post-lunch)',
    route: 'Oral',
    startDate: '2023-08-10',
    status: 'active',
    prescriber: 'Dr. A. Sharma (Cardiologist)',
    indication: 'Cardiovascular Prophylaxis',
    batchNumber: 'EC-7821',
    source: 'manual',
    verifiedByPharmacist: true,
    ocrConfidence: 1.0,
    isSuspected: false,
  },
  {
    id: 'med-05',
    brandName: 'Pan 40',
    genericName: 'Pantoprazole Sodium',
    strength: '40 mg',
    dosageForm: 'Tablet',
    frequency: 'Once daily (empty stomach, 30 min before breakfast)',
    route: 'Oral',
    startDate: '2024-01-20',
    status: 'active',
    prescriber: 'Dr. V. Joshi (Endocrinologist)',
    indication: 'GERD / Gastroprotection',
    batchNumber: 'PN-6014',
    source: 'manual',
    verifiedByPharmacist: true,
    ocrConfidence: 1.0,
    isSuspected: false,
  },
  {
    id: 'med-06',
    brandName: 'Atorva 10',
    genericName: 'Atorvastatin Calcium',
    strength: '10 mg',
    dosageForm: 'Tablet',
    frequency: 'Once daily (night)',
    route: 'Oral',
    startDate: '2023-08-10',
    status: 'active',
    prescriber: 'Dr. A. Sharma (Cardiologist)',
    indication: 'Hyperlipidemia',
    batchNumber: 'AT-3329',
    source: 'manual',
    verifiedByPharmacist: true,
    ocrConfidence: 1.0,
    isSuspected: false,
  },
];

export const INITIAL_CASES: SymptomReport[] = [
  {
    id: 'CASE-2026-001',
    patientId: 'PAT-6801',
    patientName: 'Ramesh V. Kulkarni',
    patientAge: 68,
    patientGender: 'Male',
    isElderlyPolypharmacy: true,
    reportedAt: '2026-10-03T14:30:00Z',
    inputLanguage: 'mr',
    originalText: 'मी नवीन गोळी सुरू केल्यापासून दोन दिवसांपासून अंगावर लाल पुरळ आणि खाज येत आहे. आज सकाळी ओठ थोडे सुजल्यासारखे वाटत आहेत.',
    translatedText: 'Since starting the new tablet two days ago, red patches and itching started on the body. This morning lips feel slightly swollen.',
    extractedSymptoms: ['Erythematous rash / red patches', 'Severe generalized pruritus / itching', 'Lip swelling / Angioedema'],
    meddraTerms: [
      { pt: 'Rash erythematous', soc: 'Skin and subcutaneous tissue disorders', code: '10037844' },
      { pt: 'Pruritus', soc: 'Skin and subcutaneous tissue disorders', code: '10037087' },
      { pt: 'Lip swelling / Angioedema', soc: 'Immune system disorders', code: '10002424' }
    ],
    negatedSymptoms: ['No breathing difficulty', 'No blistering rash in mouth/eyes'],
    severity: 'severe',
    onsetDate: '2026-10-03',
    durationDays: 2,
    bodyLocations: ['Chest', 'Arms', 'Face / Lips'],
    vitals: {
      bpSystolic: 138,
      bpDiastolic: 86,
      heartRate: 88,
      spo2: 97,
      tempC: 37.2,
      bloodGlucose: 142
    },
    emergencyRedFlags: ['Facial / Lip Swelling detected', 'Rapid spread within 48h of beta-lactam initiation'],
    followUpResponses: {
      hasDifficultyBreathing: false,
      hasMouthSoresOrBlisters: false,
      hasFever: true,
      medicineStoppedByUser: false
    },
    outcome: 'persisting',
    urgencyLevel: 'EMERGENCY',
    completenessScore: 88,
    missingFields: ['Confirmation of batch/lot expiry date'],
    causality: {
      cAdrTotal: 84,
      category: 'HIGH_PRIORITY_ADR',
      categoryLabel: 'High-Priority Suspected ADR',
      userFacingAdvice: 'Seek immediate emergency clinical evaluation. Do not wait for standard follow-up.',
      breakdown: {
        temporalFit_T: { score: 9.5, max: 10, weight: 0.25, contribution: 23.75, rationale: 'Symptoms manifested precisely 48h after Amoxicillin-Clavulanate initiation (classic IgE/T-cell delayed hypersensitivity window).' },
        doseResponse_D: { score: 7.0, max: 10, weight: 0.15, contribution: 10.5, rationale: 'Dose 625mg BID; cumulative exposure aligns with drug-induced cutaneous adverse reaction threshold.' },
        knownAssociation_K: { score: 9.8, max: 10, weight: 0.20, contribution: 19.6, rationale: 'Well-documented high-incidence adverse drug reaction in SmPC and WHO VigiBase for co-amoxiclav (3-7% incidence of exanthema/pruritus).' },
        dechallenge_R: { score: 6.5, max: 10, weight: 0.15, contribution: 9.75, rationale: 'Medicine not yet fully withdrawn at reporting time; dechallenge pending clinical advice.' },
        hostFactors_H: { score: 8.5, max: 10, weight: 0.15, contribution: 12.75, rationale: 'Patient is 68 years old, taking 6 concomitant medications (polypharmacy), with hypertension and T2D.' },
        alternativeExplanations_A: { score: 2.4, max: 10, weight: 0.10, contribution: 2.4, rationale: 'Viral exanthem unlikely given afebrile start and distinct temporal link to beta-lactam initiation.' }
      },
      explanation: 'Calculated C_ADR = (0.25*9.5 + 0.15*7.0 + 0.20*9.8 + 0.15*6.5 + 0.15*8.5) - (0.10*2.4) = 84.0 / 100. Strong temporal association with high-risk penicillin class allergen.'
    },
    reviewStatus: 'pending',
    pharmacistNotes: 'Prioritized for immediate triage. Clinical pharmacist phoned caregiver Rohan; advised immediate emergency department assessment for possible impending anaphylaxis/angioedema. Amoxicillin withheld pending physician review.'
  },
  {
    id: 'CASE-2026-002',
    patientId: 'PAT-7203',
    patientName: 'Savitri Bai Deshmukh',
    patientAge: 71,
    patientGender: 'Female',
    isElderlyPolypharmacy: true,
    reportedAt: '2026-10-04T10:15:00Z',
    inputLanguage: 'hi',
    originalText: 'पैर के टखनों में पिछले चार दिनों से सूजन आ रही है और चलने में भारीपन लग रहा है।',
    translatedText: 'Ankles have been swelling for the past four days and feet feel heavy while walking.',
    extractedSymptoms: ['Bilateral ankle edema', 'Heavy sensation in lower extremities'],
    meddraTerms: [
      { pt: 'Edema peripheral', soc: 'General disorders and administration site conditions', code: '10014389' },
      { pt: 'Swelling of limbs', soc: 'General disorders', code: '10042767' }
    ],
    negatedSymptoms: ['No chest pain', 'No shortness of breath while lying flat'],
    severity: 'moderate',
    onsetDate: '2026-09-30',
    durationDays: 4,
    bodyLocations: ['Lower Limbs', 'Ankles / Feet'],
    vitals: {
      bpSystolic: 128,
      bpDiastolic: 82,
      heartRate: 72,
      spo2: 98,
      tempC: 36.8
    },
    emergencyRedFlags: [],
    followUpResponses: {
      hasDifficultyBreathing: false,
      hasChestPain: false,
      doseChangedRecently: true
    },
    outcome: 'persisting',
    urgencyLevel: 'PHARMACIST_REVIEW',
    completenessScore: 92,
    missingFields: [],
    causality: {
      cAdrTotal: 72,
      category: 'PROBABLE',
      categoryLabel: 'Probable Drug-Related Association',
      userFacingAdvice: 'Consult your community pharmacist or physician today for dose review or alternative therapy.',
      breakdown: {
        temporalFit_T: { score: 8.0, max: 10, weight: 0.25, contribution: 20.0, rationale: 'Onset 5 days after Amlodipine dose escalation from 5mg to 10mg.' },
        doseResponse_D: { score: 9.0, max: 10, weight: 0.15, contribution: 13.5, rationale: 'Classic dose-dependent precapillary vasodilation characteristic of dihydropyridine calcium channel blockers.' },
        knownAssociation_K: { score: 9.5, max: 10, weight: 0.20, contribution: 19.0, rationale: 'Extremely well-characterized side effect of Amlodipine occurring in 5-15% of patients at 10mg daily.' },
        dechallenge_R: { score: 5.0, max: 10, weight: 0.15, contribution: 7.5, rationale: 'Patient continues medicine awaiting physician consultation.' },
        hostFactors_H: { score: 8.0, max: 10, weight: 0.15, contribution: 12.0, rationale: 'Age 71, female gender, chronic venous insufficiency co-factor.' },
        alternativeExplanations_A: { score: 3.0, max: 10, weight: 0.10, contribution: 3.0, rationale: 'Heart failure ruled out by normal SpO2 and absence of orthopnea/PND.' }
      },
      explanation: 'Calculated C_ADR = 72.0 / 100. Strong pharmacological fit with dihydropyridine CCB peripheral vasodilatory edema.'
    },
    reviewStatus: 'in_review',
    pharmacistNotes: 'Pharmacist scheduled call with Dr. Sharma to recommend adding low-dose ACE inhibitor or reducing Amlodipine back to 5mg with adjunct therapy.'
  },
  {
    id: 'CASE-2026-003',
    patientId: 'PAT-6542',
    patientName: 'Anil Narayan Patil',
    patientAge: 64,
    patientGender: 'Male',
    isElderlyPolypharmacy: true,
    reportedAt: '2026-10-02T08:40:00Z',
    inputLanguage: 'en',
    originalText: 'Severe muscle aches in both thighs and upper arms since 3 days after doctor increased cholesterol tablet.',
    translatedText: 'Severe muscle aches in both thighs and upper arms since 3 days after doctor increased cholesterol tablet.',
    extractedSymptoms: ['Myalgia', 'Bilateral thigh and upper arm muscle stiffness'],
    meddraTerms: [
      { pt: 'Myalgia', soc: 'Musculoskeletal and connective tissue disorders', code: '10028411' },
      { pt: 'Muscle fatigue', soc: 'Musculoskeletal disorders', code: '10028384' }
    ],
    negatedSymptoms: ['No dark brown or cola-colored urine', 'No muscle weakness preventing standing up'],
    severity: 'moderate',
    onsetDate: '2026-09-29',
    durationDays: 3,
    bodyLocations: ['Thighs', 'Shoulders / Upper Arms'],
    vitals: {
      bpSystolic: 132,
      bpDiastolic: 84,
      heartRate: 76,
      spo2: 98,
      tempC: 36.7
    },
    emergencyRedFlags: [],
    followUpResponses: {
      hasDarkUrine: false,
      unableToWalk: false,
      concomitantClarithromycin: false
    },
    outcome: 'persisting',
    urgencyLevel: 'URGENT_CLINICAL',
    completenessScore: 85,
    missingFields: ['Serum Creatine Kinase (CK) laboratory measurement'],
    causality: {
      cAdrTotal: 68,
      category: 'PROBABLE',
      categoryLabel: 'Probable Drug-Related Association',
      userFacingAdvice: 'Contact your physician within 24 hours. Check serum CK levels if muscle pain worsens or urine darkens.',
      breakdown: {
        temporalFit_T: { score: 7.5, max: 10, weight: 0.25, contribution: 18.75, rationale: 'Onset within 72h of Atorvastatin dose adjustment.' },
        doseResponse_D: { score: 8.0, max: 10, weight: 0.15, contribution: 12.0, rationale: 'Atorvastatin increased to 40mg daily; statin-associated muscle symptoms are dose-correlated.' },
        knownAssociation_K: { score: 9.2, max: 10, weight: 0.20, contribution: 18.4, rationale: 'Statin-associated muscle symptoms (SAMS) confirmed by Statin Muscle Safety Task Force.' },
        dechallenge_R: { score: 4.0, max: 10, weight: 0.15, contribution: 6.0, rationale: 'Dechallenge pending physician consultation.' },
        hostFactors_H: { score: 7.5, max: 10, weight: 0.15, contribution: 11.25, rationale: 'Age 64, concomitant cardiovascular medications.' },
        alternativeExplanations_A: { score: 2.0, max: 10, weight: 0.10, contribution: 2.0, rationale: 'No strenuous physical exertion or gym activity reported.' }
      },
      explanation: 'Calculated C_ADR = 68.0 / 100. Likely statin-induced myopathy. Advise checking serum CK and renal panel.'
    },
    reviewStatus: 'verified',
    pharmacistNotes: 'Verified and escalated to primary cardiologist. Ordered serum CK test. Recommended temporary hold of Atorvastatin pending lab report.'
  }
];

export const INITIAL_SIGNALS: SignalMetric[] = [
  {
    drugName: 'Amoxicillin + Clavulanic Acid',
    symptomTerm: 'Severe Cutaneous Adverse Reaction / Angioedema',
    prr: 3.42,
    ror: 3.65,
    caseCount: 48,
    backgroundCases: 1420,
    chiSquare: 24.8,
    signalStatus: 'CONFIRMED_SIGNAL',
    socialMediaTrend: {
      velocityPercent: 64,
      samplePublicPostsCount: 182,
      disclaimer: 'Public aggregate mentions on health forums indicate increased patient confusion regarding co-amoxiclav rash vs viral exanthem.'
    }
  },
  {
    drugName: 'Amlodipine',
    symptomTerm: 'Bilateral Peripheral Edema (High-Dose)',
    prr: 4.88,
    ror: 5.12,
    caseCount: 112,
    backgroundCases: 2310,
    chiSquare: 82.1,
    signalStatus: 'CONFIRMED_SIGNAL',
    socialMediaTrend: {
      velocityPercent: 18,
      samplePublicPostsCount: 430,
      disclaimer: 'Consistent baseline discussion in senior patient groups regarding shoe tightness and ankle puffiness.'
    }
  },
  {
    drugName: 'Metformin',
    symptomTerm: 'Persistent Gastrointestinal Distress / Metallic Taste',
    prr: 2.15,
    ror: 2.24,
    caseCount: 89,
    backgroundCases: 3100,
    chiSquare: 16.4,
    signalStatus: 'EMERGING_SIGNAL',
    socialMediaTrend: {
      velocityPercent: 32,
      samplePublicPostsCount: 290,
      disclaimer: 'Patients switching to extended-release formulations report 50% fewer intolerance reports.'
    }
  },
  {
    drugName: 'Atorvastatin',
    symptomTerm: 'Bilateral Proximal Myalgia',
    prr: 2.89,
    ror: 3.01,
    caseCount: 76,
    backgroundCases: 2650,
    chiSquare: 28.3,
    signalStatus: 'CONFIRMED_SIGNAL',
    socialMediaTrend: {
      velocityPercent: 44,
      samplePublicPostsCount: 315,
      disclaimer: 'De-identified aggregate public sentiment reflects hesitation to adhere to statin therapy upon onset of soreness.'
    }
  }
];

export const SIGNAL_METRICS: SignalMetric[] = INITIAL_SIGNALS;

export const EDUCATIONAL_CARDS = [
  {
    id: 'edu-1',
    title: 'Why reporting side effects matters',
    description: 'Every adverse reaction reported helps protect other patients and updates safety alerts for medicines nationwide.',
    category: 'Patient Safety',
    readTime: '2 min read'
  },
  {
    id: 'edu-2',
    title: 'How to recognize a severe allergic reaction (Red Flags)',
    description: 'Lip, face, or tongue swelling, difficulty breathing, or blistering rash require immediate emergency care (108 / 112).',
    category: 'Emergency Triage',
    readTime: '3 min read'
  },
  {
    id: 'edu-3',
    title: 'Why you should never stop heart or diabetes medicines suddenly',
    description: 'Stopping essential drugs on your own can cause rebound high blood pressure or sugar spikes. Always ask your pharmacist first.',
    category: 'Medication Adherence',
    readTime: '2 min read'
  }
];

export const INITIAL_REMINDERS: MedicationReminder[] = [
  {
    id: 'rem-1',
    medicineId: 'med-01',
    medicineName: 'Augmentin 625 Duo',
    dosage: '625 mg (1 tab)',
    timeSlot: 'Morning',
    scheduledTime: '08:30',
    instructions: 'Take with or right after breakfast with water',
    isEnabled: true,
    soundEnabled: true,
    takenToday: false,
  },
  {
    id: 'rem-2',
    medicineId: 'med-02',
    medicineName: 'Glycomet-GP 1',
    dosage: '500 mg + 1 mg',
    timeSlot: 'Morning',
    scheduledTime: '09:00',
    instructions: 'Take immediately before morning meal',
    isEnabled: true,
    soundEnabled: true,
    takenToday: true,
  },
  {
    id: 'rem-3',
    medicineId: 'med-01',
    medicineName: 'Augmentin 625 Duo',
    dosage: '625 mg (1 tab)',
    timeSlot: 'Evening',
    scheduledTime: '20:30',
    instructions: 'Take after dinner to minimize GI upset',
    isEnabled: true,
    soundEnabled: true,
    takenToday: false,
  },
  {
    id: 'rem-4',
    medicineId: 'med-03',
    medicineName: 'Amlodac 5',
    dosage: '5 mg',
    timeSlot: 'Bedtime',
    scheduledTime: '22:00',
    instructions: 'Take at night before sleep for 24h BP regulation',
    isEnabled: true,
    soundEnabled: false,
    takenToday: false,
  },
];

export const USER_GROUP_PROFILES: UserGroupProfile[] = [
  {
    id: 'patient',
    name: 'Patients',
    roleTitle: 'Core End-User',
    userName: 'Ramesh V. Kulkarni',
    accessCategory: 'Core End-User',
    primaryRole: 'Record medicines, symptoms, photos, voice reports',
    avatar: '/src/assets/images/senior_patient_1791221318901.jpg',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    institution: 'Home Patient (Caregiver: Rohan Kulkarni)',
    permissions: [
      'Record medicines & doses',
      'Submit voice/text symptoms',
      'Upload packaging photos',
      'View safety triage guidance',
      'Interactive 7-day timeline grid'
    ]
  },
  {
    id: 'caregiver',
    name: 'Caregivers',
    roleTitle: 'Proxy Reporter',
    userName: 'Rohan Kulkarni',
    accessCategory: 'Proxy Reporter',
    primaryRole: 'Report for elderly, paediatric, disabled, or low-literacy users',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    institution: 'Family Proxy Caregiver (Dependents: Ramesh & Aarav)',
    permissions: [
      'Proxy ADR symptom reporting',
      'Manage dependent medicine profiles',
      'Track adherence & missed doses',
      'Elderly/Paediatric emergency escalation',
      'Caregiver direct communication'
    ]
  },
  {
    id: 'pharmacist',
    name: 'Community Pharmacists',
    roleTitle: 'Clinical Reviewer',
    userName: 'Rajesh Varma, M.Pharm',
    accessCategory: 'Clinical Reviewer',
    primaryRole: 'Verify reports, assess completeness, counsel, escalate high-risk cases',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    institution: 'Apex Community Pharmacy, Pune (PvPI Network Node)',
    permissions: [
      'Triage queue clinical assessment',
      'Physical package label & batch verification',
      'Assess report completeness score',
      'Direct patient counseling logs',
      'Escalate high-risk cases to physician',
      'Generate official PvPI ADRMS package'
    ]
  },
  {
    id: 'physician',
    name: 'Physicians',
    roleTitle: 'Prescriber Escalation',
    userName: 'Dr. Ananya Deshmukh, MD',
    accessCategory: 'Prescriber Escalation',
    primaryRole: 'Review serious/clinically relevant suspected ADRs',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    institution: 'Department of Internal & Chest Medicine, Sassoon Hospital',
    permissions: [
      'Review serious & escalated ADR cases',
      'Prescription change & therapeutic substitution orders',
      'Dechallenge/Rechallenge clinical decisions',
      'Organ toxicity & laboratory correlation',
      'Attestation & medical sign-off for national registry'
    ]
  },
  {
    id: 'hospital_pv',
    name: 'Hospital PV Team',
    roleTitle: 'Hospital Safety Unit',
    userName: 'Dr. Meera Sen, MD, FICM',
    accessCategory: 'Hospital Safety Unit',
    primaryRole: 'Detect patterns; prepare validated reports',
    avatar: 'https://images.unsplash.com/photo-1594824813572-c288f5d03bb5?auto=format&fit=crop&w=256&q=80',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    institution: 'Pharmacovigilance Committee, City Central Hospital (Ward 4B Inpatients)',
    permissions: [
      'Hospital ward cluster & signal detection',
      'Inpatient/outpatient pattern surveillance',
      'Hospital causality committee review (WHO/Naranjo)',
      'Preventability criteria audit (Schumock & Thornton)',
      'Prepare validated hospital ADR dossiers'
    ]
  },
  {
    id: 'amc',
    name: 'ADR Monitoring Centres (AMC)',
    roleTitle: 'Regulatory Node',
    userName: 'Dr. K. Joshi, Ph.D.',
    accessCategory: 'Regulatory Node',
    primaryRole: 'Receive structured, verified reports via approved integration',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=256&q=80',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    institution: 'AMC-MH-04 KEM Hospital & GS Medical College, Mumbai',
    permissions: [
      'Structured batch ingestion from regional hospitals/pharmacies',
      'MedDRA term coding verification (SOC, PT, LLT)',
      'ICSR E2B(R3) transmission gateway status',
      'Regional consensus review voting',
      'PvPI national coordinator integration'
    ]
  },
  {
    id: 'regulator',
    name: 'Regulators (PvPI / CDSCO)',
    roleTitle: 'National Authority',
    userName: 'Director R. Shinde, M.D. (PvPI)',
    accessCategory: 'National Authority',
    primaryRole: 'Receive professionally reviewed, consented, standards-compliant data',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    institution: 'National Coordination Centre (NCC) - PvPI & CDSCO (IPC Ghaziabad)',
    permissions: [
      'National safety signal registry oversight',
      'Issue drug safety alerts & gazette notices',
      'Black box warning & package insert revisions',
      'Manufacturer lot quarantine & recall orders',
      'National pharmacovigilance KPI monitoring'
    ]
  },
  {
    id: 'researcher',
    name: 'Researchers',
    roleTitle: 'Epidemiological Safety',
    userName: 'Prof. S. Patil, Ph.D.',
    accessCategory: 'Epidemiological Safety',
    primaryRole: 'Analyse anonymized aggregate data for safety signals',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    institution: 'Department of Clinical Pharmacology & Pharmacovigilance Research',
    permissions: [
      'Anonymized aggregate population datasets',
      'Disproportionality PRR & ROR signal mining',
      'Polypharmacy elderly cohort stratification',
      'Time-series anomaly algorithms',
      'Export de-identified research datasets'
    ]
  }
];
