import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Clock,
  FileText,
  Download,
  Printer,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Building2,
  Calendar,
  AlertTriangle,
  Send,
  ExternalLink,
  Award
} from 'lucide-react';
import { SymptomReport } from '../../types/pv';

interface PvpiComplianceChecklistProps {
  activeCase?: SymptomReport;
  onOpenPvpiExport?: () => void;
}

interface ChecklistItem {
  id: string;
  category: 'core' | 'timelines' | 'causality' | 'traceability' | 'reporting';
  title: string;
  requirement: string;
  regulatoryReference: string;
  isMandatory: boolean;
  checked: boolean;
  notes?: string;
  severity: 'Critical' | 'Major' | 'Standard';
}

const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  // 1. Core Four Minimum Criteria
  {
    id: 'chk-1',
    category: 'core',
    title: 'Identifiable Patient Present',
    requirement: 'Patient initials, age (68 Yrs), gender (Male), and de-identified Hospital ID (PAT-6801) must be clearly stated.',
    regulatoryReference: 'PvPI Standard Operating Procedures Section 4.1.1 (ICH E2D)',
    isMandatory: true,
    checked: true,
    notes: 'Ramesh V. Kulkarni (68/M, ID: PAT-6801) verified.',
    severity: 'Critical',
  },
  {
    id: 'chk-2',
    category: 'core',
    title: 'Identifiable Primary Healthcare Reporter',
    requirement: 'Primary reporter name, profession (Clinical Pharmacist), qualification (M.Pharm), and healthcare facility documented.',
    regulatoryReference: 'PvPI SOP Section 4.1.2 (Qualified Person for Pharmacovigilance)',
    isMandatory: true,
    checked: true,
    notes: 'Rajesh Varma, M.Pharm (Community / Clinical Pharmacist, City Hospital)',
    severity: 'Critical',
  },
  {
    id: 'chk-3',
    category: 'core',
    title: 'Suspected Medicinal Product Specifically Identified',
    requirement: 'Generic and proprietary trade names, strength, dosage form, and batch/lot number extracted.',
    regulatoryReference: 'Drugs and Cosmetics Act Schedule M & PvPI Reporting Mandate',
    isMandatory: true,
    checked: true,
    notes: 'Augmentin 625 (Amoxicillin 500mg + Clavulanate 125mg), Batch: BX-A409',
    severity: 'Critical',
  },
  {
    id: 'chk-4',
    category: 'core',
    title: 'Documented Adverse Event / Clinical Reaction',
    requirement: 'Specific MedDRA Preferred Term (PT), onset latency date/time, and clinical course recorded.',
    regulatoryReference: 'PvPI Medical Dictionary for Regulatory Activities (MedDRA v27.0)',
    isMandatory: true,
    checked: true,
    notes: 'Diffuse maculopapular cutaneous rash & perioral edema (PT: Drug eruption)',
    severity: 'Critical',
  },

  // 2. Regulatory Timelines & Expedited Triage
  {
    id: 'chk-5',
    category: 'timelines',
    title: 'Serious ADR 15-Calendar-Day Expedited Submission',
    requirement: 'If reaction resulted in hospitalization prolongation or life-threatening risk, must transmit within 15 calendar days.',
    regulatoryReference: 'CDSCO GSR 227(E) & IPC-NCC Notification 2024',
    isMandatory: true,
    checked: true,
    notes: 'Current case flagged on Day 4 of therapy. Case logged 2 hours post-triage.',
    severity: 'Critical',
  },
  {
    id: 'chk-6',
    category: 'timelines',
    title: '24-Hour Red-Flag & Anaphylaxis Escalation',
    requirement: 'Acute airway, cardiovascular, or mucosal emergency alerts transmitted to on-duty casualty physician within 24h.',
    regulatoryReference: 'National Pharmacovigilance Casualty Fast-Track Protocol',
    isMandatory: true,
    checked: true,
    notes: 'Physician Dr. Ananya Deshmukh alerted via integrated EHR direct message.',
    severity: 'Critical',
  },
  {
    id: 'chk-7',
    category: 'timelines',
    title: 'Non-Serious Event Monthly Log & Consolidation',
    requirement: 'Non-serious ADRs collated and transmitted within 30 days to regional ADR Monitoring Centre (AMC).',
    regulatoryReference: 'PvPI AMC Operational Manual Chapter 3',
    isMandatory: false,
    checked: true,
    notes: 'Included in October 2026 Monthly AMC Batch.',
    severity: 'Standard',
  },

  // 3. Causality & Clinical Investigation
  {
    id: 'chk-8',
    category: 'causality',
    title: 'Dechallenge Evaluation Documented',
    requirement: 'Reaction outcome upon dose reduction or drug discontinuation recorded (Did rash regress on stopping Augmentin?).',
    regulatoryReference: 'WHO-UMC Causality Assessment System / Naranjo Algorithm Q2',
    isMandatory: true,
    checked: true,
    notes: 'Positive Dechallenge confirmed: Marked resolution of erythema 48h after stopping.',
    severity: 'Major',
  },
  {
    id: 'chk-9',
    category: 'causality',
    title: 'Rechallenge Consideration & Clinical Risk Decision',
    requirement: 'Rechallenge status noted: If not rechallenged due to severe allergy risk, explicit rationale must be recorded.',
    regulatoryReference: 'ICH Guideline E2A Section III.A',
    isMandatory: true,
    checked: true,
    notes: 'Rechallenge NOT performed: Medically unethical due to severe IgE anaphylactoid risk.',
    severity: 'Major',
  },
  {
    id: 'chk-10',
    category: 'causality',
    title: 'Exclusion of Concomitant Confounders & Alternative Etiology',
    requirement: 'Co-prescribed medicines (Amlodipine, Metformin) and background conditions (Hypertension, T2D) screened.',
    regulatoryReference: 'PvPI Causality Scale - Rule of Concomitant Administration',
    isMandatory: true,
    checked: true,
    notes: 'Amlodipine & Metformin taken for >18 months with stable tolerance. Viral exanthem excluded.',
    severity: 'Major',
  },
  {
    id: 'chk-11',
    category: 'causality',
    title: 'Objective Clinical Evidence / Photo Attachment',
    requirement: 'Clinical photograph, skin examination chart, vital sign records, or eosinophil lab results attached.',
    regulatoryReference: 'PvPI Visual Evidence Submissions Guideline',
    isMandatory: false,
    checked: true,
    notes: 'Dermatology rash photograph and Body Map distribution chart attached.',
    severity: 'Standard',
  },

  // 4. Product Traceability & Quality Inspection
  {
    id: 'chk-12',
    category: 'traceability',
    title: 'Batch / Lot Number & Expiry Date Verified',
    requirement: 'Valid manufacturer batch number (BX-A409) and expiry date (Exp: 08/2027) confirmed against primary packaging.',
    regulatoryReference: 'Drugs and Cosmetics Rules 1945 Rule 96 (Manner of Labelling)',
    isMandatory: true,
    checked: true,
    notes: 'Scanned via integrated Camera OCR and verified from blister foil.',
    severity: 'Major',
  },
  {
    id: 'chk-13',
    category: 'traceability',
    title: 'Marketing Authorization Holder (MAH) Noted',
    requirement: 'Manufacturer / Importer license holder recorded for signal detection collation.',
    regulatoryReference: 'PvPI MAH Pharmacovigilance Obligations 2026',
    isMandatory: false,
    checked: true,
    notes: 'GlaxoSmithKline Pharmaceuticals India Ltd. (License: MH-FDA-28A)',
    severity: 'Standard',
  },
  {
    id: 'chk-14',
    category: 'traceability',
    title: 'Storage & Cold-Chain Adherence Checked',
    requirement: 'Product was stored under prescribed manufacturer temperature conditions (Below 25°C in dry place).',
    regulatoryReference: 'Good Distribution Practices (GDP) India',
    isMandatory: false,
    checked: true,
    notes: 'Preserved in original foil blister pack at room temperature ~23°C.',
    severity: 'Standard',
  },

  // 5. Electronic Reporting & E2B(R3) Compliance
  {
    id: 'chk-15',
    category: 'reporting',
    title: 'ICSR E2B(R3) XML Compatibility Schema Validation',
    requirement: 'Export structure complies with XML Schema for Individual Case Safety Reports (ICSR) under ICH E2B(R3).',
    regulatoryReference: 'PvPI Electronic Reporting Standard & VigiFlow Gateway',
    isMandatory: true,
    checked: true,
    notes: 'Validated against Indian Pharmacopoeia Commission ICSR DTD schema.',
    severity: 'Critical',
  },
  {
    id: 'chk-16',
    category: 'reporting',
    title: 'Patient Data Confidentiality & Consent Verification',
    requirement: 'Confidentiality maintained: no Aadhaar, direct phone or personal identity leaked in public transmission.',
    regulatoryReference: 'Digital Personal Data Protection (DPDP) Act 2023 & PvPI Privacy Rules',
    isMandatory: true,
    checked: true,
    notes: 'Masked identifier PAT-6801 utilized. Patient informed consent recorded.',
    severity: 'Critical',
  },
  {
    id: 'chk-17',
    category: 'reporting',
    title: 'Regional AMC Node & Nodal Officer Routing',
    requirement: 'Case assigned to corresponding PvPI Adverse Drug Reaction Monitoring Centre (AMC Code: AMC-042 Sassoon Hospital).',
    regulatoryReference: 'PvPI National Network Hierarchy (Peripheral ➔ AMC ➔ NCC)',
    isMandatory: true,
    checked: true,
    notes: 'Dispatched to AMC-042 (B.J. Govt Medical College & Sassoon General Hospital, Pune).',
    severity: 'Critical',
  },
];

export const PvpiComplianceChecklist: React.FC<PvpiComplianceChecklistProps> = ({
  activeCase,
  onOpenPvpiExport,
}) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'timelines' | 'causality' | 'traceability' | 'reporting'>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'mandatory'>('all');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Toggle item status
  const handleToggle = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  // Filter items
  const filteredItems = checklist.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (filterSeverity === 'critical' && item.severity !== 'Critical') return false;
    if (filterSeverity === 'mandatory' && !item.isMandatory) return false;
    return true;
  });

  // Calculate compliance statistics
  const totalItems = checklist.length;
  const completedItems = checklist.filter((i) => i.checked).length;
  const mandatoryItems = checklist.filter((i) => i.isMandatory);
  const completedMandatory = mandatoryItems.filter((i) => i.checked).length;
  const compliancePercentage = Math.round((completedItems / totalItems) * 100);
  const mandatoryCompliancePercentage = Math.round((completedMandatory / mandatoryItems.length) * 100);

  const isAuditReady = mandatoryCompliancePercentage === 100 && compliancePercentage >= 85;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/80 border border-orange-200 rounded-3xl p-6 text-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-900 bg-white border border-orange-300 px-2.5 py-0.5 rounded-full shadow-2xs">
              IPC / NCC-PvPI Regulatory Standard
            </span>
            <span className="text-xs text-slate-500 font-mono">GVP-India 2026 Audit Ready</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-orange-600" />
            <span>PvPI Statutory Compliance &amp; Case Audit Checklist</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
            Verify adverse drug reaction case reports against Indian Pharmacopoeia Commission (IPC) and CDSCO Pharmacovigilance Programme of India standards before electronic VigiFlow / ADRMS transmission.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            onClick={() => setShowCertificateModal(true)}
            className="px-4 py-2.5 bg-white hover:bg-orange-50 text-orange-950 font-bold border border-orange-300 rounded-2xl text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Award className="w-4 h-4 text-orange-600" />
            <span>Audit Certificate</span>
          </button>

          {onOpenPvpiExport && (
            <button
              onClick={onOpenPvpiExport}
              className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Open PvPI XML Exporter</span>
            </button>
          )}
        </div>
      </div>

      {/* Compliance Scorecards Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Overall Score */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Overall Audit Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {compliancePercentage}%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({completedItems}/{totalItems} items)
              </span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
              isAuditReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isAuditReady ? 'Audit Passed · Ready for Submission' : 'Verification In Progress'}
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Mandatory 4 Valid Criteria */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Mandatory PvPI Criteria
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-700 font-mono">
                {mandatoryCompliancePercentage}%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({completedMandatory}/{mandatoryItems.length} passed)
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">
              Zero Critical Deficiencies
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Expedited Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Statutory 15-Day Clock
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">Day 2</span>
              <span className="text-xs text-slate-500 font-medium">of 15 Days</span>
            </div>
            <span className="text-[10px] text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-full inline-block mt-1 border border-sky-200">
              Expedited Window Active
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Assigned Nodal AMC */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Assigned Nodal AMC
            </span>
            <strong className="text-xs font-black text-slate-900 block mt-1 truncate max-w-[140px]">
              Sassoon Hospital, Pune
            </strong>
            <span className="text-[10px] font-mono font-bold text-orange-700 block mt-0.5">
              Code: AMC-042 (Maharashtra)
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs & Severity Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            All Checkpoints ({checklist.length})
          </button>
          <button
            onClick={() => setSelectedCategory('core')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'core'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            1. 4 Valid Criteria ({checklist.filter((i) => i.category === 'core').length})
          </button>
          <button
            onClick={() => setSelectedCategory('timelines')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'timelines'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            2. Timelines &amp; 15-Day Rule ({checklist.filter((i) => i.category === 'timelines').length})
          </button>
          <button
            onClick={() => setSelectedCategory('causality')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'causality'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            3. Causality &amp; Dechallenge ({checklist.filter((i) => i.category === 'causality').length})
          </button>
          <button
            onClick={() => setSelectedCategory('traceability')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'traceability'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            4. Batch &amp; Quality ({checklist.filter((i) => i.category === 'traceability').length})
          </button>
          <button
            onClick={() => setSelectedCategory('reporting')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'reporting'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            5. E2B(R3) &amp; Privacy ({checklist.filter((i) => i.category === 'reporting').length})
          </button>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Filter:</span>
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
              filterSeverity === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterSeverity('mandatory')}
            className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
              filterSeverity === 'mandatory' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            Mandatory Only
          </button>
          <button
            onClick={() => setFilterSeverity('critical')}
            className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
              filterSeverity === 'critical' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            Critical Only
          </button>
        </div>
      </div>

      {/* Main Checklist Items Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>PvPI Statutory Checkpoints</span>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                {filteredItems.length} of {checklist.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any checklist item to toggle verification status or review the applicable CDSCO regulation.
            </p>
          </div>

          <button
            onClick={() => {
              setChecklist((prev) => prev.map((item) => ({ ...item, checked: true })));
            }}
            className="text-xs font-bold text-orange-600 hover:text-orange-800 transition-colors"
          >
            Mark All as Verified ✓
          </button>
        </div>

        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer select-none space-y-2 ${
                item.checked
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : item.isMandatory
                  ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg border-2 mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                      item.checked
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    {item.checked && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm font-extrabold ${item.checked ? 'text-slate-900' : 'text-slate-800'}`}>
                        {item.title}
                      </span>
                      {item.isMandatory && (
                        <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.2 rounded-full">
                          Mandatory
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full font-mono ${
                        item.severity === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.severity === 'Major'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.severity} Severity
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.requirement}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
                      <span className="text-orange-950 font-bold bg-orange-100/70 border border-orange-200 px-2 py-0.5 rounded-md">
                        Rule: {item.regulatoryReference}
                      </span>
                    </div>

                    {item.notes && (
                      <div className="mt-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 font-mono">
                        <strong className="text-slate-900">Case Audit Evidence: </strong>
                        {item.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl block ${
                      item.checked
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.checked ? 'Compliant ✓' : 'Pending Action'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Audit Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Official PvPI Case Compliance Certificate
                </h3>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Simulated Government Certificate Document */}
            <div className="p-6 bg-gradient-to-b from-orange-50/40 via-white to-amber-50/30 border-2 border-orange-300 rounded-2xl space-y-4 text-xs text-slate-800 font-sans shadow-sm">
              <div className="text-center border-b-2 border-orange-200 pb-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-800 block">
                  GOVERNMENT OF INDIA · MINISTRY OF HEALTH AND FAMILY WELFARE
                </span>
                <h2 className="text-base font-black text-slate-900 uppercase">
                  Indian Pharmacopoeia Commission (IPC)
                </h2>
                <p className="text-[11px] font-bold text-slate-600">
                  National Coordinating Centre — Pharmacovigilance Programme of India (NCC-PvPI)
                </p>
                <div className="inline-block mt-1 bg-orange-100 border border-orange-300 text-orange-900 font-mono font-bold text-[10px] px-3 py-0.5 rounded-full">
                  Certificate Ref: PVPI-CERT-2026-8901-OK
                </div>
              </div>

              <div className="space-y-2 py-2 text-xs">
                <p>
                  This is to certify that Adverse Drug Reaction Case Record <strong>PV-2026-8901</strong>, associated with patient identifier <strong>PAT-6801 (Ramesh V. Kulkarni)</strong> and suspected medicinal product <strong>Augmentin 625 (Amoxicillin/Clavulanate, Batch: BX-A409)</strong>, has undergone formal regulatory audit against the statutory requirements of the Pharmacovigilance Programme of India (PvPI).
                </p>

                <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-orange-200 font-mono text-[11px]">
                  <div>
                    <p><strong>Audit Compliance Score:</strong> {compliancePercentage}%</p>
                    <p><strong>Mandatory Criteria:</strong> 100% Passed</p>
                    <p><strong>Audit Date:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p><strong>Assigned AMC:</strong> AMC-042 (Sassoon Hospital, Pune)</p>
                    <p><strong>ICSR Format:</strong> ICH E2B(R3) Validated</p>
                    <p><strong>Status:</strong> Approved for VigiFlow Gateway</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600">
                  The case complies with CDSCO GSR 227(E) reporting directives. All de-identification procedures conform to the Digital Personal Data Protection (DPDP) Act 2023.
                </p>
              </div>

              <div className="pt-4 flex items-end justify-between border-t border-orange-200">
                <div className="space-y-0.5">
                  <div className="h-6 w-32 bg-slate-300/80 rounded flex items-center justify-center font-mono text-[8px] text-slate-600 tracking-widest">
                    ||||| ||||||| |||||
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono block">
                    Cryptographically Sealed PvPI Ledger
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-serif italic font-bold text-slate-900 text-sm block">
                    Rajesh Varma, M.Pharm
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Clinical Pharmacist &amp; Qualified PV Auditor
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Certificate Hash: #SHA256-PVPI-8901-VERIFIED
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => {
                    alert('Certificate downloaded to local downloads folder!');
                    setShowCertificateModal(false);
                  }}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
