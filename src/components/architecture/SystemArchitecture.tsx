import React, { useState } from 'react';
import {
  Layers,
  Users,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  AlertTriangle,
  FileText,
  Activity,
  Database,
  Server,
  Stethoscope,
  ChevronRight,
  Heart,
  Clock,
  PhoneCall,
  Check,
  Globe2,
  FileCode,
  Scan,
  Mic,
  Table,
} from 'lucide-react';

export const SystemArchitecture: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'architecture' | 'modules' | 'objectives' | 'validation' | 'ethics'>('users');
  const [activeJourneyStep, setActiveJourneyStep] = useState<number>(0);

  const TARGET_USERS = [
    {
      group: 'Patients',
      role: 'Record medicines, symptoms, photos, voice reports',
      icon: Heart,
      badge: 'Core End-User',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    },
    {
      group: 'Caregivers',
      role: 'Report for elderly, paediatric, disabled, or low-literacy users',
      icon: Users,
      badge: 'Proxy Reporter',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
    },
    {
      group: 'Community pharmacists',
      role: 'Verify reports, assess completeness, counsel, escalate high-risk cases',
      icon: Stethoscope,
      badge: 'Clinical Reviewer',
      color: 'bg-sky-50 border-sky-200 text-sky-900',
    },
    {
      group: 'Physicians',
      role: 'Review serious/clinically relevant suspected ADRs',
      icon: Activity,
      badge: 'Prescriber Escalation',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
    },
    {
      group: 'Hospital PV team',
      role: 'Detect patterns; prepare validated reports',
      icon: ShieldCheck,
      badge: 'Hospital Safety Unit',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    },
    {
      group: 'ADR Monitoring Centres (AMC)',
      role: 'Receive structured, verified reports via approved integration',
      icon: Globe2,
      badge: 'Regulatory Node',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    },
    {
      group: 'Regulators (PvPI / CDSCO)',
      role: 'Receive professionally reviewed, consented, standards-compliant data',
      icon: FileCheck2Icon,
      badge: 'National Authority',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
    },
    {
      group: 'Researchers',
      role: 'Analyse anonymized aggregate data for safety signals',
      icon: Database,
      badge: 'Epidemiological Safety',
      color: 'bg-slate-50 border-slate-200 text-slate-900',
    },
  ];

  const JOURNEY_STEPS = [
    {
      step: 1,
      title: 'Prescription Ingestion',
      actor: 'Caregiver & Patient',
      detail: 'Caregiver scans new printed prescription using DoseGuard OCR. Augmentin 625 Duo (Amoxicillin + Clavulanate) is detected with dosage, start date (Day 0), and added to baseline medications.',
      action: 'Metformin, Amlodipine, Aspirin, Pantoprazole active + New Antibiotic enrolled.',
    },
    {
      step: 2,
      title: 'Multilingual Voice Reporting (Marathi)',
      actor: 'Patient (Age 68)',
      detail: 'Two days post-initiation, patient speaks in Marathi: "मी नवीन गोळी सुरू केल्यापासून दोन दिवसांपासून अंगावर लाल पुरळ आणि खाज येत आहे."',
      action: 'Voice recording captured & processed via vernacular speech recognition.',
    },
    {
      step: 3,
      title: 'NLP Extraction & MedDRA Standardization',
      actor: 'Data Standardization Engine',
      detail: 'NLP extracts colloquial symptoms: "लाल पुरळ" -> Maculopapular Rash (MedDRA PT 10025400) and "खाज" -> Pruritus (MedDRA PT 10037087). Negation parser confirms no negated symptoms.',
      action: 'Symptoms linked with time interval: 36–48h post-exposure.',
    },
    {
      step: 4,
      title: 'Timeline Sequence Alignment',
      actor: 'Temporal ADR Causality Engine',
      detail: 'System reconstructs Day 0 to Day 2 timeline. Verifies that rash and pruritus began strictly post-antibiotic exposure, establishing temporal plausibility.',
      action: 'Baseline drugs stable for >12 months; acute antibiotic is primary suspect.',
    },
    {
      step: 5,
      title: 'Adaptive Red-Flag Screening Questions',
      actor: 'Urgency Triage Engine',
      detail: 'DoseGuard asks targeted safety prompts: (1) Any breathing difficulty? (2) Any facial or lip swelling? (3) Any blistering or mouth sores? (4) High fever?',
      action: 'Patient reports progressive lip swelling (angioedema) + tightness in breathing.',
    },
    {
      step: 6,
      title: 'Emergency Safety Triage Trigger',
      actor: 'Clinical Safety Protocol',
      detail: 'Deterministic rule triggers EMERGENCY: (Rash + Angioedema + Respiratory distress). App displays direct 108/112 emergency SOS screen and prompts immediate casualty visit.',
      action: 'Immediate push notification dispatched to linked caregiver and community pharmacist.',
    },
    {
      step: 7,
      title: 'Pharmacist Review & Clinical Notes',
      actor: 'Community Pharmacist',
      detail: 'Pharmacist accesses prioritized Emergency Queue. Reviews timeline, checks DDI, confirms antibiotic dechallenge with physician, and notes antihistamine administration.',
      action: 'Pharmacist verifies case, records dechallenge resolution by Day 6.',
    },
    {
      step: 8,
      title: 'Standardized PvPI / ADRMS Case Generation',
      actor: 'Regulatory Export Gateway',
      detail: 'Complete validated case structured into ICH E2B (R3) XML / JSON & IPC Form 1 format. Transmitted to ADR Monitoring Centre (AMC #218) with full audit trail.',
      action: 'Tamper-evident case exported with C_ADR causality score: 86.5/100.',
    },
  ];

  function FileCheck2Icon(props: any) {
    return <FileText {...props} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              System Architecture, Specifications & Target Users
            </h2>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
              Full Blueprint & Specification
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Production-ready specifications of the <strong>DoseGuard</strong> digital pharmacovigilance platform: 5-layer architecture, 8 target user groups, priority elderly cohort, temporal causality engine, functional modules, validation metrics, and bioethical safeguards.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Target Users & Test Case</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'architecture' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5-Layer Architecture</span>
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'modules' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Functional Modules (A–I)</span>
          </button>
          <button
            onClick={() => setActiveTab('objectives')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'objectives' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Objectives & Outcomes</span>
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'validation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Validation & Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('ethics')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'ethics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ethics & Limitations</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: TARGET USERS & TEST CASE ================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Priority Prototype Population Banner - Warm Light Orange Theme */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/80 rounded-2xl p-6 text-slate-900 border border-orange-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-orange-200/80 text-orange-950 border border-orange-300 rounded-full text-xs font-bold uppercase tracking-wider">
                Priority Prototype Population
              </span>
              <span className="text-xs text-orange-800 font-semibold">Target Focus Cohort</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Adults ≥ 60 Years Taking ≥ 5 Chronic Medications (Senior Polypharmacy)
            </h3>
            <p className="text-xs text-slate-600 max-w-4xl leading-relaxed">
              Designed specifically for elderly patients with chronic comorbidities: type 2 diabetes, hypertension, cardiovascular disease, osteoarthritis, and chronic respiratory illness. Conventional ADR reporting fails this cohort due to low digital literacy, polypharmacy symptom confusion, and complex multi-drug timelines.
            </p>
          </div>

          {/* Target Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Table className="w-4 h-4 text-indigo-600" />
                  <span>Target Users Table (Roles & Permissions Definition)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specification of target user groups and their primary roles in DoseGuard:
                </p>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                8 Defined User Groups
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="py-3 px-4 font-bold uppercase tracking-wider w-1/4">User group</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider w-1/2">Primary role in DoseGuard</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider w-1/4">Access Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {TARGET_USERS.map((user, idx) => {
                    const Icon = user.icon;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{user.group}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 leading-relaxed font-medium">
                          {user.role}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${user.color}`}>
                            {user.badge}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive End-to-End User Journey Walkthrough */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
                  Reference Test Case Scenario
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Patient Journey: 68yo Polypharmacy Senior with Acute Antibiotic Exposure
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comorbidities: Hypertension, Type 2 Diabetes, Osteoarthritis · Baseline: Metformin, Amlodipine, Aspirin, Pantoprazole.
                </p>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-1.5">
                {JOURNEY_STEPS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveJourneyStep(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                      activeJourneyStep === idx
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s.step}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Step Showcase */}
            {(() => {
              const cur = JOURNEY_STEPS[activeJourneyStep];
              return (
                <div className="p-5 bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-indigo-200/60 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                      Step {cur.step} of 8: {cur.title}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      <span>Actor:</span>
                      <strong className="text-indigo-900">{cur.actor}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {cur.detail}
                  </p>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{cur.action}</span>
                    </div>
                    {activeJourneyStep < JOURNEY_STEPS.length - 1 && (
                      <button
                        onClick={() => setActiveJourneyStep(activeJourneyStep + 1)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 ml-4"
                      >
                        <span>Next Step</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================= TAB 2: 5-LAYER ARCHITECTURE ================= */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          {/* Visual Data Flow Diagram (Flowchart for Poster) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>End-to-End Pharmacovigilance Data Flow Pipeline (Poster Ready)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">1. Patient / Caregiver</span>
                <p className="text-[11px] text-slate-500">
                  Voice report (Marathi / Hindi / English), text, body map, prescription scan, vital signs
                </p>
              </div>

              <div className="hidden md:flex items-center justify-center text-slate-400">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1">
                <span className="font-bold text-indigo-950 block">2. Multilingual NLP & OCR</span>
                <p className="text-[11px] text-slate-600">
                  Speech recognition, MedDRA coding, negation detection, and prescription medicine extraction
                </p>
              </div>

              <div className="hidden md:flex items-center justify-center text-slate-400">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-950 block">3. Temporal Causality Engine</span>
                <p className="text-[11px] text-slate-600">
                  Calculates formula C_ADR, reconstructs medicine timeline, checks emergency red flags
                </p>
              </div>

              <div className="hidden md:flex items-center justify-center text-slate-400">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                <span className="font-bold text-blue-950 block">4. Pharmacist Verification</span>
                <p className="text-[11px] text-slate-600">
                  Professional review, patient counseling, physician escalation, PvPI ADRMS submission
                </p>
              </div>
            </div>
          </div>

          {/* 5 Structural Layers Detailed */}
          <div className="space-y-4">
            {/* Layer 1 */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">
                    Layer 1
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Patient-Facing Mobile Application</h4>
                </div>
                <span className="text-xs text-slate-500">Android & iOS Touch UI</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tailored for senior polypharmacy patients and family caregivers. Includes five core screens:
                (1) Home dashboard with today’s medicines and emergency button, (2) My Medicines with prescription image OCR & barcode scan, (3) Report a Symptom with Marathi/Hindi/English speech and touch body map, (4) Safety Result Screen with 4 urgency tiers (Monitor, Contact clinician, Urgent clinical assessment, Emergency warning), and (5) Follow-up Screen for dechallenge tracking.
              </p>
            </div>

            {/* Layer 2 */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">
                    Layer 2
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Data Capture & Standardization Engine</h4>
                </div>
                <span className="text-xs text-slate-500">NLP + Vision OCR</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transforms everyday patient descriptions in Marathi, Hindi, or English into standardized clinical fields mapped to MedDRA Preferred Terms (PT) and System Organ Classes (SOC). Enforces negation detection (“no breathlessness” is never falsely marked as dyspnea) and standardizes OCR prescriptions with mandatory patient confirmation.
              </p>
            </div>

            {/* Layer 3 */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">
                    Layer 3
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Temporal ADR Causality and Urgency Engine</h4>
                </div>
                <span className="text-xs text-slate-500">Core Decision Intelligence</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The mathematical core linking: Medicine exposure → Dose/change → Symptom onset → Clinical evolution → Outcome. Evaluates the transparent formula <code>C_ADR = w₁T + w₂D + w₃K + w₄R + w₅H - w₆A</code>, generating three independent outputs: (1) Exposure-event association score, (2) Seriousness/urgency level, and (3) Report completeness score.
              </p>
            </div>

            {/* Layer 4 */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">
                    Layer 4
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Professional Clinical Review Dashboard</h4>
                </div>
                <span className="text-xs text-slate-500">Pharmacist & Physician Console</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prioritized case triage queue (Emergency, High, Moderate, Low), visual timeline reconstruction from Day 0 to Day 6, Drug-Drug Interaction alerts, explainable prioritization rationale, missing-data prompts, and official PvPI export generation.
              </p>
            </div>

            {/* Layer 5 */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">
                    Layer 5
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Pharmacovigilance Analytics & Disproportionality Server</h4>
                </div>
                <span className="text-xs text-slate-500">Institutional Safety & PvPI ADRMS</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates Proportional Reporting Ratio (PRR) and Reporting Odds Ratio (ROR), monitors de-identified public social media mention trends strictly for hypothesis generation, and maintains tamper-evident audit trails.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: FUNCTIONAL MODULES (A–I) ================= */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>9 Detailed Functional Modules (Complete Specifications)</span>
            </h3>
            <p className="text-xs text-slate-500">
              In-depth operational specifications for all modules implemented across DoseGuard:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Module A */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                Module A · Multilingual Voice ADR Reporting
              </span>
              <h4 className="text-sm font-bold text-slate-900">Regional Speech-to-Text & MedDRA Mapping</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Allows patients to describe symptoms naturally in Marathi, Hindi, and English. Executes 7 sequential processing steps: Speech-to-text → Translation → NLP entity extraction → MedDRA Low-Level Term mapping → Timeline linking → Emergency risk screening → Adaptive follow-up question generation.
              </p>
            </div>

            {/* Module B */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                Module B · Prescription OCR & Medicine Recognition
              </span>
              <h4 className="text-sm font-bold text-slate-900">Vision OCR with Mandatory Patient Confirmation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extracts brand name, generic formulation, strength, dosage form, frequency, and route from prescription images. Enforces clinical rule: <em>never auto-assume OCR is 100% accurate</em>; requires explicit patient tap confirmation or pharmacist adjustment.
              </p>
            </div>

            {/* Module C */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                Module C · Medication Timeline Reconstruction
              </span>
              <h4 className="text-sm font-bold text-slate-900">7-Day Day 0–6 Chronological Matrix</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Maps drug exposure, dose adjustments, missed doses, and dechallenge milestones against exact symptom onset hours. Identifies natural dechallenge resolution without ever recommending unsupervised medicine stopping.
              </p>
            </div>

            {/* Module D */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                Module D · Temporal Causality Scoring (C_ADR)
              </span>
              <h4 className="text-sm font-bold text-slate-900">C_ADR = w₁T + w₂D + w₃K + w₄R + w₅H - w₆A</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Research prototype transparent formula calculating: Temporal Fit (T), Dose-Response (D), Known Literature (K), Dechallenge/Rechallenge (R), Host Polypharmacy Factors (H), and Alternative Explanations penalty (A). Yields 4 clear categories: Low, Possible, Probable, High-Priority ADR.
              </p>
            </div>

            {/* Module E */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
                Module E · Emergency Safety Triage
              </span>
              <h4 className="text-sm font-bold text-slate-900">Deterministic Red-Flag Gatekeeper</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hardcoded rule-based filter detecting anaphylaxis, airway compromise (wheeze/stridor), angioedema (facial/lip swelling), mucocutaneous detachment (SJS/TEN), syncope, and severe gastrointestinal hemorrhage. Triggers immediate 108/112 emergency routing.
              </p>
            </div>

            {/* Module F */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                Module F · Wearable & Vital Signs Integration
              </span>
              <h4 className="text-sm font-bold text-slate-900">Supportive Physiologic Biomarkers</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Captures heart rate, SpO₂, blood pressure, temperature, and blood glucose via Bluetooth or manual entry. Modulates urgency scoring (e.g. tachycardia + palpitations elevates urgency) strictly as supportive signals, never replacing clinical examination.
              </p>
            </div>

            {/* Module G */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                Module G · Social Media Safety Signal Detection
              </span>
              <h4 className="text-sm font-bold text-slate-900">Aggregate De-Identified Hypothesis Generation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monitors public, legally accessible, de-identified discussions for anomalous surges in drug–symptom co-mentions. Used solely for population hypothesis generation; never used to diagnose individuals or declare drugs unsafe without professional validation.
              </p>
            </div>

            {/* Module H */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                Module H · Pharmacist Verification Cockpit
              </span>
              <h4 className="text-sm font-bold text-slate-900">Human-in-the-Loop Professional Review</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pharmacist console to confirm drug names/doses, screen for drug–drug interactions, ask follow-up questions, correct OCR/voice errors, classify seriousness, document clinical actions, and generate PvPI ADRMS submissions.
              </p>
            </div>

            {/* Module I */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 md:col-span-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                Module I · Gamified Patient Engagement
              </span>
              <h4 className="text-sm font-bold text-slate-900">Ethical Follow-up Adherence Incentives</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Encourages timely Day 2 and Day 6 follow-ups using medicine safety check-in reminders, report completeness progress bars, non-financial milestone badges (e.g., “Safety Champion”), and educational bite-sized safety cards. Avoids financial rewards that could induce spurious reporting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: OBJECTIVES & OUTCOMES ================= */}
      {activeTab === 'objectives' && (
        <div className="space-y-6">
          {/* Primary & Secondary Objectives */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Project Objectives (Academic & Clinical Scope)</span>
            </h3>

            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1 text-xs text-indigo-950 font-medium">
              <strong className="block text-indigo-900 text-sm">Primary Objective:</strong>
              <p className="leading-relaxed">
                To design and develop a multilingual, multi-source digital pharmacovigilance application for real-time detection, temporal assessment, and risk prioritization of suspected adverse drug reactions in polypharmacy patients.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Secondary Objectives:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Capture ADR data through voice, text, prescription images, symptom checklists, and supportive wearable sensors.</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Develop a transparent engine for drug–symptom temporal correlation and research-prototype causality scoring.</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Identify emergency red-flag symptoms and provide immediate, unambiguous triage guidance.</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Create pharmacist-verified, structured suspected-ADR case reports for onward transmission via approved channels (PvPI/ADRMS).</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Improve report completeness through adaptive follow-up prompts for missing regulatory fields.</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Assess usability, speech recognition accuracy, completeness enhancement, and triage agreement with clinical pharmacists.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Expected Outcomes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Expected Outcomes & Real-World Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-950 block">1. Faster ADR Capture</span>
                <p className="text-slate-600">Immediate reporting post-symptom onset rather than weeks later at outpatient review.</p>
              </div>
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-950 block">2. High-Quality Completeness</span>
                <p className="text-slate-600">+48% reduction in missing dose, start date, batch, and dechallenge data.</p>
              </div>
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-950 block">3. Regional Language Access</span>
                <p className="text-slate-600">Voice reporting in Marathi and Hindi empowers non-English low-literacy elderly patients.</p>
              </div>
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-950 block">4. Early Serious Reaction Alerts</span>
                <p className="text-slate-600">Prompt detection of angioedema, anaphylaxis, and SJS/TEN before hospitalization.</p>
              </div>
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-950 block">5. Reduced Pharmacist Burden</span>
                <p className="text-slate-600">Auto-structured case files and timeline reconstructions accelerate verification workflow.</p>
              </div>
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-950 block">6. Longitudinal Follow-ups</span>
                <p className="text-slate-600">Gamified check-ins log post-dechallenge recovery and physician consultation outcomes.</p>
              </div>
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1 md:col-span-2">
                <span className="font-bold text-emerald-950 block">7. Population Safety Signal Generation</span>
                <p className="text-slate-600">Aggregated disproportionality metrics (PRR/ROR) assist institutional PV research.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: VALIDATION & SCHEMA ================= */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          {/* Phase 1–3 Validation Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Multi-Phase Technical Validation Plan & Performance Targets
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target performance metrics across Phase 1 (Prototype), Phase 2 (Technical Validation), and Phase 3 (Clinical Simulation Study).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Metric Area</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Measurement Tool</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Target Benchmark</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Clinical Relevance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Speech Recognition Accuracy</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">Word Error Rate (WER)</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">&lt; 12% in Marathi & Hindi</td>
                    <td className="py-2.5 px-3 text-slate-600">Ensures colloquial Indian patient audio is faithfully transcribed</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Symptom Extraction & Negation</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">Precision / Recall / F1-Score</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">F1 &gt; 0.90</td>
                    <td className="py-2.5 px-3 text-slate-600">Prevents false alarms from negated statements</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Prescription OCR Accuracy</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">Field Accuracy %</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">&gt; 94% on Printed Rx</td>
                    <td className="py-2.5 px-3 text-slate-600">Includes mandatory patient confirmation check</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Emergency Red-Flag Sensitivity</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">True Positive Sensitivity</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-700">&gt; 99% (Near-Zero Miss Rate)</td>
                    <td className="py-2.5 px-3 text-slate-600">Prioritizes sensitivity: missing an emergency is dangerous</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Report Completeness Improvement</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">Completeness Ratio</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">+48% vs Standard Web Forms</td>
                    <td className="py-2.5 px-3 text-slate-600">Resolves missing batch, onset, and dechallenge data</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">System Usability (Elderly/Caregiver)</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">System Usability Scale (SUS)</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">SUS &gt; 82/100</td>
                    <td className="py-2.5 px-3 text-slate-600">Easy accessibility for patients aged 60+</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Pharmacist-App Agreement</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">Cohen&apos;s Kappa (κ)</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">κ &gt; 0.85 (Strong Agreement)</td>
                    <td className="py-2.5 px-3 text-slate-600">Aligns app priority categorization with clinical consensus</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Schema & REST Endpoints */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Database Architecture & REST Backend Endpoints</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-900 block">PostgreSQL / Firestore Collections:</span>
                <ul className="space-y-1 text-slate-700 font-mono text-[11px]">
                  <li>• <strong>users:</strong> id, role, age, language, consent_status</li>
                  <li>• <strong>medicines:</strong> id, user_id, brand, generic, dose, route, freq, start_date</li>
                  <li>• <strong>symptoms:</strong> id, user_id, text, meddra_code, onset, severity, body_region</li>
                  <li>• <strong>timelines:</strong> id, user_id, day_offset, med_id, symptom_id, status</li>
                  <li>• <strong>causality_scores:</strong> id, case_id, C_ADR, T, D, K, R, H, A, category</li>
                  <li>• <strong>followups:</strong> id, case_id, resolution_day, dechallenge_result, outcome</li>
                  <li>• <strong>audit_logs:</strong> id, user_id, action, timestamp, tamper_hash</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-900 block">RESTful Backend Endpoints:</span>
                <ul className="space-y-1 text-slate-700 font-mono text-[11px]">
                  <li>• <span className="text-blue-600">POST</span> /api/auth/register & login (Role verification)</li>
                  <li>• <span className="text-emerald-600">GET/POST</span> /api/medicines (CRUD prescription entries)</li>
                  <li>• <span className="text-blue-600">POST</span> /api/analyze-symptom (NLP & Triage engine)</li>
                  <li>• <span className="text-blue-600">POST</span> /api/calculate-cadr (Formula C_ADR breakdown)</li>
                  <li>• <span className="text-emerald-600">GET</span> /api/pharmacist/cases (Priority triage queue)</li>
                  <li>• <span className="text-purple-600">PUT</span> /api/pharmacist/verify/:id (Sign-off & escalation)</li>
                  <li>• <span className="text-amber-600">GET</span> /api/pvpi/export/:id (ICH E2B R3 XML generator)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: ETHICS & LIMITATIONS ================= */}
      {activeTab === 'ethics' && (
        <div className="space-y-6">
          {/* Key Limitations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Key Clinical & Technical Limitations
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-950 block">1. Suspected ADRs Only</span>
                <p className="text-slate-600">Identifies suspected adverse events; cannot establish definitive causality without formal medical diagnosis.</p>
              </div>
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-950 block">2. Model Sensitivity Bounds</span>
                <p className="text-slate-600">Performance is conditioned on speech clarity, vernacular accuracy, and user input veracity.</p>
              </div>
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-950 block">3. OCR Handwriting Variance</span>
                <p className="text-slate-600">Cursive handwritten prescriptions may introduce recognition errors, requiring patient verification.</p>
              </div>
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-950 block">4. Supportive Vitals Only</span>
                <p className="text-slate-600">Wearable sensor readings are supportive physiological markers, not diagnostic criteria.</p>
              </div>
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-950 block">5. Social Media Noise</span>
                <p className="text-slate-600">Public signals contain noise and serve solely for epidemiological hypothesis generation.</p>
              </div>
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-950 block">6. Governance & Approval</span>
                <p className="text-slate-600">Direct hospital EHR linkage requires institutional ethics review, HL7 FHIR compliance, and approvals.</p>
              </div>
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1 md:col-span-2">
                <span className="font-bold text-amber-950 block">7. No Autonomous Prescription Changes</span>
                <p className="text-slate-600">The application never advises patients to discontinue essential maintenance medications on their own.</p>
              </div>
            </div>
          </div>

          {/* Ethics, Privacy, and Safety Safeguards */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Bioethics, Patient Privacy & Algorithmic Safeguards</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">Data Privacy Protocols</span>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• Explicit informed consent recorded before symptom audio or photo capture.</li>
                  <li>• End-to-end TLS encryption in transit & AES-256 at rest.</li>
                  <li>• De-identification before any aggregate signal computation.</li>
                  <li>• Tamper-evident audit logs of all pharmacist case reviews.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">Clinical Safety Guardrails</span>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• Emergency instructions prominently displayed above review queues.</li>
                  <li>• No black-box autonomous decision making for critical triage.</li>
                  <li>• Mandatory pharmacist verification before regulatory PvPI export.</li>
                  <li>• Visible uncertainty notice: &ldquo;Suspected drug event requiring clinical assessment.&rdquo;</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">Algorithmic Bias Safeguards</span>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• Performance validated separately for Marathi, Hindi, and English.</li>
                  <li>• Continuous tracking of false-negative emergency triage rates.</li>
                  <li>• Low-bandwidth offline mode ensures equity for rural patients.</li>
                  <li>• Voice models tested against geriatric speech patterns and ambient noise.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
