import React, { useState } from 'react';
import {
  Medicine,
  SymptomReport,
  ElectronicPrescription,
  PatientDocumentedAllergy,
  VitalSignEntry,
  PatientLabResult,
  TelehealthAppointment,
  ConsultationSoapNote,
  VisualAdrEvent,
  MedicationHistoryRecord,
} from '../../types/pv';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Activity,
  Pill,
  Clock,
  User,
  ShieldAlert,
  Send,
  Download,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Info,
  ExternalLink,
  Search,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { PatientEhrView } from './PatientEhrView';
import { EPrescriptionGenerator } from './EPrescriptionGenerator';
import { ClinicalDecisionSupport } from './ClinicalDecisionSupport';
import { AppointmentsSoapNotes } from './AppointmentsSoapNotes';
import { VisualAdrMapping } from '../adr/VisualAdrMapping';
import { MedicationHistoryView } from '../history/MedicationHistoryView';

interface PhysicianDashboardProps {
  cases: SymptomReport[];
  selectedCase: SymptomReport;
  onSelectCase: (report: SymptomReport) => void;
  medicines: Medicine[];
  onOpenPvpiModal: (caseData: SymptomReport) => void;
  onUpdateMedicineStatus: (id: string, status: Medicine['status']) => void;
  onAddEPrescription?: (erx: ElectronicPrescription) => void;
  allergies?: PatientDocumentedAllergy[];
  vitalsLog?: VitalSignEntry[];
  labResults?: PatientLabResult[];
  onAddLabResult?: (lab: PatientLabResult) => void;
  appointments?: TelehealthAppointment[];
  onBookAppointment?: (apt: TelehealthAppointment) => void;
  soapNotes?: ConsultationSoapNote[];
  onAddSoapNote?: (note: ConsultationSoapNote) => void;
  visualAdrEvents?: VisualAdrEvent[];
  onAddAdrEvent?: (event: VisualAdrEvent) => void;
  medicationHistory?: MedicationHistoryRecord[];
  onAddMedicationHistory?: (record: MedicationHistoryRecord) => void;
  onDechallengeAction?: (id: string, action: string) => void;
}

export const PhysicianDashboard: React.FC<PhysicianDashboardProps> = ({
  cases,
  selectedCase,
  onSelectCase,
  medicines,
  onOpenPvpiModal,
  onUpdateMedicineStatus,
  onAddEPrescription = () => {},
  allergies = [],
  vitalsLog = [],
  labResults = [],
  onAddLabResult = () => {},
  appointments = [],
  onBookAppointment = () => {},
  soapNotes = [],
  onAddSoapNote = () => {},
  visualAdrEvents = [],
  onAddAdrEvent = () => {},
  medicationHistory = [],
  onAddMedicationHistory = () => {},
  onDechallengeAction = () => {},
}) => {
  const [physicianMainTab, setPhysicianMainTab] = useState<
    'ehr' | 'erx' | 'cds' | 'appointments' | 'adrmap' | 'history' | 'escalated'
  >('ehr');
  const [activeTab, setActiveTab] = useState<'review' | 'substitution' | 'labs' | 'attestation'>('review');
  const [physicianDecision, setPhysicianDecision] = useState<'withhold' | 'continue' | 'substitute'>('withhold');
  const [substituteMed, setSubstituteMed] = useState('Cefuroxime Axetil 500 mg');
  const [physicianOrderNotes, setPhysicianOrderNotes] = useState(
    'Discontinue Augmentin 625 Duo immediately due to acute type-1 hypersensitivity with angioedema risk. Initiate therapeutic alternative (Cefuroxime Axetil 500mg BID) after 24-hour observation. Prescribe short-course Levocetirizine 5mg.'
  );
  const [isSignedOff, setIsSignedOff] = useState(false);
  const [signatureTimestamp, setSignatureTimestamp] = useState<string | null>(null);

  const handleSignOff = () => {
    setIsSignedOff(true);
    setSignatureTimestamp(new Date().toLocaleString());
    // Also mark suspect medicine stopped in medication schedule
    const suspect = medicines.find((m) => m.isSuspected);
    if (suspect) {
      onUpdateMedicineStatus(suspect.id, 'stopped');
    }
  };

  const escalatedCases = cases.filter(
    (c) => c.urgencyLevel === 'EMERGENCY' || c.urgencyLevel === 'URGENT_CLINICAL'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner - Warm Light Orange Palette */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/70 border border-orange-200 rounded-3xl p-6 text-slate-900 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-orange-900 bg-orange-200/70 border border-orange-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Prescriber Escalation Console
                </span>
                <span className="text-xs text-orange-800 font-mono font-medium">
                  Dr. Ananya Deshmukh, MD (Consultant Chest Physician)
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Clinical ADR Review & Dechallenge Management
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Review serious & clinically escalated adverse reactions from community pharmacists, issue therapeutic discontinuation/substitution orders, and attest cases for national PvPI regulatory reporting.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-white/90 border border-orange-200 px-4 py-2.5 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-orange-800 font-semibold block uppercase">Escalated Cases</span>
              <span className="text-xl font-extrabold text-orange-950 font-mono">{escalatedCases.length}</span>
            </div>
            <div className="bg-white/90 border border-amber-200 px-4 py-2.5 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-amber-800 font-semibold block uppercase">Elderly Polypharmacy</span>
              <span className="text-xl font-extrabold text-amber-950 font-mono">
                {cases.filter((c) => c.isElderlyPolypharmacy).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Physician Operations Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-orange-200/80 p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setPhysicianMainTab('ehr')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            physicianMainTab === 'ehr'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/50'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Patient EHR Lookup & Records</span>
        </button>

        <button
          onClick={() => setPhysicianMainTab('erx')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            physicianMainTab === 'erx'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/50'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>e-Prescription (e-Rx) Generator</span>
        </button>

        <button
          onClick={() => setPhysicianMainTab('cds')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            physicianMainTab === 'cds'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Clinical Decision Support & Lab Orders</span>
        </button>

        <button
          onClick={() => setPhysicianMainTab('appointments')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            physicianMainTab === 'appointments'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Appointments & SOAP Notes Editor</span>
        </button>

        <button
          onClick={() => setPhysicianMainTab('adrmap')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            physicianMainTab === 'adrmap'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-rose-700 bg-rose-50/70 hover:bg-rose-100 font-bold border border-rose-200/80'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-rose-600" />
          <span>Visual ADR Mapping & Systemic Review ({visualAdrEvents.length})</span>
        </button>

        <button
          onClick={() => setPhysicianMainTab('history')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            physicianMainTab === 'history'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/50'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>Medication History & Prescribing Timeline ({medicationHistory.length})</span>
        </button>

        <button
          onClick={() => setPhysicianMainTab('escalated')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            physicianMainTab === 'escalated'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Escalated ADR Review & Dechallenge ({escalatedCases.length})</span>
        </button>
      </div>

      {/* 1. PATIENT EHR LOOKUP TAB */}
      {physicianMainTab === 'ehr' && (
        <PatientEhrView
          medicines={medicines}
          vitalsLog={vitalsLog}
          labResults={labResults}
          allergies={allergies}
        />
      )}

      {/* 2. E-PRESCRIPTION GENERATOR TAB */}
      {physicianMainTab === 'erx' && (
        <EPrescriptionGenerator
          onAddEPrescription={onAddEPrescription}
          allergies={allergies}
          activeMedicines={medicines}
        />
      )}

      {/* 3. CLINICAL DECISION SUPPORT & LAB ORDERS TAB */}
      {physicianMainTab === 'cds' && (
        <ClinicalDecisionSupport
          labResults={labResults}
          onAddLabResult={onAddLabResult}
        />
      )}

      {/* 4. APPOINTMENTS & SOAP NOTES TAB */}
      {physicianMainTab === 'appointments' && (
        <AppointmentsSoapNotes
          appointments={appointments}
          onBookAppointment={onBookAppointment}
          soapNotes={soapNotes}
          onAddSoapNote={onAddSoapNote}
        />
      )}

      {/* 5. VISUAL ADR MAPPING & SYSTEMIC REVIEW TAB */}
      {physicianMainTab === 'adrmap' && (
        <VisualAdrMapping
          mode="physician"
          adrEvents={visualAdrEvents}
          onAddAdrEvent={onAddAdrEvent}
          onDechallengeAction={onDechallengeAction}
          patientName="Ramesh V. Kulkarni"
        />
      )}

      {/* 6. MEDICATION HISTORY & CLINICAL TIMELINE TAB */}
      {physicianMainTab === 'history' && (
        <MedicationHistoryView
          mode="physician"
          historyRecords={medicationHistory}
          onAddRecord={onAddMedicationHistory}
          patientName="Ramesh V. Kulkarni"
        />
      )}

      {/* 7. ESCALATED CASES TAB */}
      {physicianMainTab === 'escalated' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Escalated Cases Queue */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-orange-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-orange-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Escalated Cases for Prescriber ({cases.length})
                </h3>
              </div>
              <span className="text-[11px] text-orange-700 font-semibold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                Live Feed
              </span>
            </div>

            <div className="space-y-2.5 mt-3 max-h-[580px] overflow-y-auto pr-1">
              {cases.map((c) => {
                const isSelected = selectedCase.id === c.id;
                const isEmerg = c.urgencyLevel === 'EMERGENCY';

                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectCase(c)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-1 ring-orange-400'
                        : 'border-slate-200 hover:border-orange-300 bg-white hover:bg-orange-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">{c.patientName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">({c.patientAge}y)</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isEmerg
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {c.urgencyLevel}
                      </span>
                    </div>

                    <p className="text-slate-700 font-medium text-xs line-clamp-2">
                      {c.extractedSymptoms.join(', ')}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-100">
                      <span className="text-orange-800 font-semibold">
                        Causality: <strong>{c.causality.cAdrTotal}/100</strong>
                      </span>
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                        {c.id}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Physician Clinical Decision Workspace */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Case Header */}
          <div className="bg-white rounded-2xl border border-orange-200/80 p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-100">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-orange-800 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded">
                    {selectedCase.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCase.patientName}</h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {selectedCase.patientGender} · {selectedCase.patientAge} yrs
                  </span>
                  {selectedCase.isElderlyPolypharmacy && (
                    <span className="text-[10px] bg-orange-100 text-orange-900 border border-orange-300 font-semibold px-2 py-0.5 rounded-full">
                      Elderly Polypharmacy (6 Meds)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Referred by Community Pharmacist: Rajesh Varma, M.Pharm · Caregiver: Rohan Kulkarni (Son)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenPvpiModal(selectedCase)}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>PvPI ADRMS Dossier</span>
                </button>
              </div>
            </div>

            {/* Segmented Workspace Tabs */}
            <div className="flex items-center gap-1.5 bg-orange-50/60 p-1 rounded-xl border border-orange-200/60 text-xs overflow-x-auto">
              <button
                onClick={() => setActiveTab('review')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeTab === 'review'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Clinical Review & Rationale
              </button>
              <button
                onClick={() => setActiveTab('substitution')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeTab === 'substitution'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Dechallenge & Substitution Order
              </button>
              <button
                onClick={() => setActiveTab('labs')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeTab === 'labs'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Lab & Organ Toxicity Correlation
              </button>
              <button
                onClick={() => setActiveTab('attestation')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                  activeTab === 'attestation'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                4. Physician Sign-off & Attestation
              </button>
            </div>

            {/* TAB 1: Clinical Review */}
            {activeTab === 'review' && (
              <div className="space-y-4 pt-1">
                {/* Emergency Red Flags Notice */}
                {selectedCase.emergencyRedFlags.length > 0 && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Physician Attention Required: Severe Red-Flag Symptom Cluster</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCase.emergencyRedFlags.map((flag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-white border border-rose-200 text-rose-800 font-semibold px-2 py-0.5 rounded-lg"
                        >
                          ⚠️ {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suspect Drug & Temporal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-orange-50/50 rounded-2xl border border-orange-200/80 space-y-2">
                    <span className="font-bold text-orange-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-orange-600" />
                      <span>Primary Suspect Medication</span>
                    </span>
                    <div className="space-y-1 text-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Brand Name:</span>
                        <span className="font-bold text-slate-900">Augmentin 625 Duo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Active Formula:</span>
                        <span className="font-medium text-slate-900">Amoxicillin + Clavulanate (500+125 mg)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Batch Number:</span>
                        <span className="font-mono text-orange-900 font-bold bg-white px-1.5 py-0.2 rounded border border-orange-200">
                          AX26-904
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Temporal Onset:</span>
                        <span className="font-semibold text-rose-700">48h post Day 0 initiation</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-orange-600" />
                      <span>Reported Reaction & Vitals</span>
                    </span>
                    <div className="space-y-1 text-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Chief Symptoms:</span>
                        <span className="font-bold text-slate-900">{selectedCase.extractedSymptoms.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Blood Pressure:</span>
                        <span className="font-mono">{selectedCase.vitals?.bpSystolic}/{selectedCase.vitals?.bpDiastolic} mmHg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pulse / SpO₂:</span>
                        <span className="font-mono">{selectedCase.vitals?.heartRate} bpm · {selectedCase.vitals?.spo2}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Causality Fit:</span>
                        <span className="font-bold text-orange-700">Probable ADR (Score: {selectedCase.causality.cAdrTotal}/100)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Transcript in Marathi/Hindi + English */}
                <div className="p-3.5 bg-white border border-slate-200 rounded-2xl text-xs space-y-1.5">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Patient Verbatim Voice Transcript (Language: {selectedCase.inputLanguage.toUpperCase()})
                  </span>
                  <p className="text-slate-800 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    &ldquo;{selectedCase.originalText}&rdquo;
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    <strong>Clinical Translation:</strong> &ldquo;{selectedCase.translatedText}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Dechallenge & Substitution Order */}
            {activeTab === 'substitution' && (
              <div className="space-y-4 pt-1 text-xs">
                <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-orange-950 uppercase tracking-wider block">
                    Prescriber Order: Dechallenge & Management Protocol
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPhysicianDecision('withhold')}
                      className={`p-3 rounded-xl border font-bold text-left transition-all ${
                        physicianDecision === 'withhold'
                          ? 'bg-white border-orange-500 text-orange-900 shadow-sm ring-1 ring-orange-400'
                          : 'bg-white/60 border-orange-200 text-slate-700'
                      }`}
                    >
                      <span className="block text-sm">⛔ Withhold Drug</span>
                      <span className="text-[11px] font-normal text-slate-500">
                        Stop suspect drug; monitor for clearance ($R$ score)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhysicianDecision('substitute')}
                      className={`p-3 rounded-xl border font-bold text-left transition-all ${
                        physicianDecision === 'substitute'
                          ? 'bg-white border-orange-500 text-orange-900 shadow-sm ring-1 ring-orange-400'
                          : 'bg-white/60 border-orange-200 text-slate-700'
                      }`}
                    >
                      <span className="block text-sm">🔄 Substitute Therapy</span>
                      <span className="text-[11px] font-normal text-slate-500">
                        Switch to safe alternative non-cross-reacting drug
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhysicianDecision('continue')}
                      className={`p-3 rounded-xl border font-bold text-left transition-all ${
                        physicianDecision === 'continue'
                          ? 'bg-white border-orange-500 text-orange-900 shadow-sm ring-1 ring-orange-400'
                          : 'bg-white/60 border-orange-200 text-slate-700'
                      }`}
                    >
                      <span className="block text-sm">⚠️ Continue with Symptomatic Care</span>
                      <span className="text-[11px] font-normal text-slate-500">
                        Maintain essential drug; prescribe antihistamines
                      </span>
                    </button>
                  </div>

                  {physicianDecision === 'substitute' && (
                    <div className="space-y-1.5 pt-2">
                      <label className="font-bold text-slate-800 text-[11px]">
                        Recommended Therapeutic Alternative:
                      </label>
                      <select
                        value={substituteMed}
                        onChange={(e) => setSubstituteMed(e.target.value)}
                        className="w-full p-2.5 bg-white border border-orange-300 rounded-xl text-xs text-slate-900 font-semibold"
                      >
                        <option value="Cefuroxime Axetil 500 mg">Cefuroxime Axetil 500 mg (Cephalosporin 2nd Gen - Low beta-lactam cross-reactivity)</option>
                        <option value="Azithromycin 500 mg">Azithromycin 500 mg (Macrolide - Zero beta-lactam ring cross-reactivity)</option>
                        <option value="Levofloxacin 500 mg">Levofloxacin 500 mg (Fluoroquinolone - Broad spectrum)</option>
                        <option value="Doxycycline 100 mg">Doxycycline 100 mg (Tetracycline derivative)</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 text-[11px]">
                      Physician Written Prescription Order & Patient Advice:
                    </label>
                    <textarea
                      rows={3}
                      value={physicianOrderNotes}
                      onChange={(e) => setPhysicianOrderNotes(e.target.value)}
                      className="w-full p-3 bg-white border border-orange-300 rounded-xl text-xs text-slate-900 leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Lab & Organ Toxicity Correlation */}
            {activeTab === 'labs' && (
              <div className="space-y-3 pt-1 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-orange-600" />
                      <span>Clinical Chemistry & Organ Function Panel</span>
                    </span>
                    <span className="text-[11px] text-slate-500">Collected: 04 Oct 2026 (Sassoon Labs)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Serum Creatinine</span>
                      <span className="font-mono text-sm font-bold text-slate-900">1.18 mg/dL</span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">Normal (eGFR 68)</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">SGPT (ALT)</span>
                      <span className="font-mono text-sm font-bold text-slate-900">38 U/L</span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">Normal baseline</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-rose-200 bg-rose-50/30">
                      <span className="text-rose-700 block text-[10px] font-bold">Absolute Eosinophils</span>
                      <span className="font-mono text-sm font-bold text-rose-900">620 /μL (8.4%)</span>
                      <span className="text-[10px] text-rose-700 font-bold block mt-0.5">⚠️ Mild Eosinophilia</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Serum Bilirubin</span>
                      <span className="font-mono text-sm font-bold text-slate-900">0.8 mg/dL</span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">No cholestatic injury</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                    <strong>Physician Interpretation:</strong> Mild peripheral eosinophilia (8.4%) corroborates an immunologically mediated drug hypersensitivity reaction rather than primary viral exanthem. Normal hepatic transaminases rule out amoxicillin-clavulanate induced cholestasis at present.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: Attestation & Sign-off */}
            {activeTab === 'attestation' && (
              <div className="space-y-4 pt-1 text-xs">
                <div className="p-4 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/60 border border-orange-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-orange-950 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-orange-600" />
                    <span>Formal Medical Practitioner Attestation (PvPI / CDSCO Form Compliant)</span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    By providing this digital attestation, I confirm that as the prescribing/consulting medical specialist, I have reviewed the patient clinical history, medication timeline, and symptoms for <strong>Ramesh V. Kulkarni (Case ID: {selectedCase.id})</strong>. I endorse the dechallenge order and validate the report for transmission to the regional ADR Monitoring Centre (AMC).
                  </p>

                  <div className="p-3 bg-white rounded-xl border border-orange-200 space-y-1.5 font-mono text-[11px] text-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Physician Name:</span>
                      <span className="font-bold">Dr. Ananya Deshmukh, MD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Medical Registration Number:</span>
                      <span className="font-bold">MMC-2012/04/1892</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Specialty / Hospital:</span>
                      <span>Internal Medicine · Sassoon General Hospital, Pune</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assessed Causality:</span>
                      <span className="text-orange-900 font-bold">Probable ADR (WHO-UMC Criteria)</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {isSignedOff ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-950 font-bold">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-emerald-600" />
                          <span>Case Officially Attested & Signed Off at {signatureTimestamp}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full uppercase">
                          Verified ✓
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={handleSignOff}
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 text-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Sign Off & Issue Physician Clinical Attestation</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
