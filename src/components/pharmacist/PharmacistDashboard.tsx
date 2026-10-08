import React, { useState } from 'react';
import {
  SymptomReport,
  Medicine,
  CausalityCategory,
  UrgencyLevel,
  ElectronicPrescription,
  DispenseStatus,
  DrugInventoryItem,
  RefillRequest,
  PharmacistConsultationLog,
  VisualAdrEvent,
  MedicationHistoryRecord,
} from '../../types/pv';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  Filter,
  Send,
  Sliders,
  Sparkles,
  Stethoscope,
  User,
  ArrowRight,
  ShieldAlert,
  Download,
  Info,
  Layers,
  ChevronDown,
  FileText,
  Package,
  Calculator,
  MessageSquare,
  Activity,
  ClipboardList,
} from 'lucide-react';
import { PrescriptionQueueFulfillment } from './PrescriptionQueueFulfillment';
import { InventoryDrugManagement } from './InventoryDrugManagement';
import { CompoundingCalculators } from './CompoundingCalculators';
import { PatientConsultationLogs } from './PatientConsultationLogs';
import { VisualAdrMapping } from '../adr/VisualAdrMapping';
import { MedicationHistoryView } from '../history/MedicationHistoryView';

interface PharmacistDashboardProps {
  cases?: SymptomReport[];
  selectedCase: SymptomReport;
  onSelectCase?: (report: SymptomReport) => void;
  onUpdateCaseStatus?: (id: string, status: SymptomReport['reviewStatus'], notes?: string) => void;
  medicines?: Medicine[];
  onOpenPvpiModal?: (caseData: SymptomReport) => void;
  prescriptions?: ElectronicPrescription[];
  onUpdateDispenseStatus?: (id: string, status: DispenseStatus, notes?: string) => void;
  onVerifyPrescription?: (
    id: string,
    verification: {
      allergyPassed: boolean;
      interactionPassed: boolean;
      dosagePassed: boolean;
      notes?: string;
    }
  ) => void;
  inventory?: DrugInventoryItem[];
  onReplenishStock?: (id: string, qty: number, batchNumber: string) => void;
  onUpdatePrice?: (id: string, newMrp: number) => void;
  refillRequests?: RefillRequest[];
  onUpdateRefillStatus?: (id: string, status: RefillRequest['status']) => void;
  consultationLogs?: PharmacistConsultationLog[];
  onAddConsultationLog?: (log: PharmacistConsultationLog) => void;
  visualAdrEvents?: VisualAdrEvent[];
  onAddAdrEvent?: (event: VisualAdrEvent) => void;
  medicationHistory?: MedicationHistoryRecord[];
  onAddMedicationHistory?: (record: MedicationHistoryRecord) => void;
  onReconcileMedication?: (id: string, notes: string) => void;
}

export const PharmacistDashboard: React.FC<PharmacistDashboardProps> = ({
  cases = [],
  selectedCase,
  onSelectCase = () => {},
  onUpdateCaseStatus = () => {},
  medicines = [],
  onOpenPvpiModal = () => {},
  prescriptions = [],
  onUpdateDispenseStatus = () => {},
  onVerifyPrescription = () => {},
  inventory = [],
  onReplenishStock = () => {},
  onUpdatePrice = () => {},
  refillRequests = [],
  onUpdateRefillStatus = () => {},
  consultationLogs = [],
  onAddConsultationLog = () => {},
  visualAdrEvents = [],
  onAddAdrEvent = () => {},
  medicationHistory = [],
  onAddMedicationHistory = () => {},
  onReconcileMedication = () => {},
}) => {
  const [pharmacistTab, setPharmacistTab] = useState<
    'queue' | 'inventory' | 'calculators' | 'consultations' | 'adrmap' | 'history' | 'pvpi'
  >('queue');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const activeCase = selectedCase || cases[0];
  const [pharmacistNotes, setPharmacistNotes] = useState<string>(activeCase?.pharmacistNotes || '');

  // Interactive Causality Parameter Sliders for Formula C_ADR
  const [cParams, setCParams] = useState({
    T: activeCase?.causality?.breakdown?.temporalFit_T?.score ?? 3,
    D: activeCase?.causality?.breakdown?.doseResponse_D?.score ?? 2,
    K: activeCase?.causality?.breakdown?.knownAssociation_K?.score ?? 2,
    R: activeCase?.causality?.breakdown?.dechallenge_R?.score ?? 3,
    H: activeCase?.causality?.breakdown?.hostFactors_H?.score ?? 2,
    A: activeCase?.causality?.breakdown?.alternativeExplanations_A?.score ?? 1,
  });

  // Calculate formula C_ADR dynamically
  const w1 = 0.25;
  const w2 = 0.15;
  const w3 = 0.20;
  const w4 = 0.15;
  const w5 = 0.15;
  const w6 = 0.10;

  const dynamicRaw =
    w1 * cParams.T +
    w2 * cParams.D +
    w3 * cParams.K +
    w4 * cParams.R +
    w5 * cParams.H -
    w6 * cParams.A;

  const dynamicCAdr = Math.min(100, Math.max(0, Math.round((dynamicRaw / 9.0) * 100)));

  const filteredCases = cases.filter((c) => {
    if (filterPriority === 'all') return true;
    if (filterPriority === 'emergency') return c.urgencyLevel === 'EMERGENCY';
    if (filterPriority === 'urgent') return c.urgencyLevel === 'URGENT_CLINICAL';
    if (filterPriority === 'review') return c.urgencyLevel === 'PHARMACIST_REVIEW';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <img
            src="/src/assets/images/clinical_pharmacist_1791221308531.jpg"
            alt="Clinical Pharmacist"
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-400/40 shrink-0 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Clinical Pharmacist Triage Console</h2>
              <span className="text-xs bg-orange-100 text-orange-900 font-semibold px-2 py-0.5 rounded-full border border-orange-200">
                PvPI Gateway Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Reviewing real-world suspect ADR cases for adults 60+ on polypharmacy. Interoperable with Indian Pharmacopoeia Commission ADRMS.
            </p>
          </div>
        </div>

        {/* Quick Triage Stats */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider block">Emergency</span>
            <span className="text-lg font-bold text-rose-900 font-mono">
              {cases.filter((c) => c.urgencyLevel === 'EMERGENCY').length}
            </span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider block">Urgent</span>
            <span className="text-lg font-bold text-amber-900 font-mono">
              {cases.filter((c) => c.urgencyLevel === 'URGENT_CLINICAL').length}
            </span>
          </div>

          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-bold text-orange-700 tracking-wider block">Review</span>
            <span className="text-lg font-bold text-orange-950 font-mono">
              {cases.filter((c) => c.urgencyLevel === 'PHARMACIST_REVIEW').length}
            </span>
          </div>
        </div>
      </div>

      {/* Pharmacist Operations Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setPharmacistTab('queue')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            pharmacistTab === 'queue'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Prescription Queue & Fulfillment ({prescriptions.filter((p) => p.dispenseStatus === 'Pending').length})</span>
        </button>

        <button
          onClick={() => setPharmacistTab('inventory')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            pharmacistTab === 'inventory'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Inventory & Stock Management ({inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Critical Low').length} Alerts)</span>
        </button>

        <button
          onClick={() => setPharmacistTab('calculators')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            pharmacistTab === 'calculators'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Compounding & Dosage Calculators</span>
        </button>

        <button
          onClick={() => setPharmacistTab('consultations')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            pharmacistTab === 'consultations'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Patient Consultation Logs ({consultationLogs.length})</span>
        </button>

        <button
          onClick={() => setPharmacistTab('adrmap')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            pharmacistTab === 'adrmap'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-rose-700 bg-rose-50/70 hover:bg-rose-100 font-bold border border-rose-200/80'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-rose-600" />
          <span>Visual ADR Mapping & Organ Risk ({visualAdrEvents.length})</span>
        </button>

        <button
          onClick={() => setPharmacistTab('history')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            pharmacistTab === 'history'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>Medication History & Reconciliation ({medicationHistory.length})</span>
        </button>

        <button
          onClick={() => setPharmacistTab('pvpi')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            pharmacistTab === 'pvpi'
              ? 'bg-orange-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Suspected ADR Triage & PvPI</span>
        </button>
      </div>

      {/* 1. PRESCRIPTION QUEUE & FULFILLMENT TAB */}
      {pharmacistTab === 'queue' && (
        <PrescriptionQueueFulfillment
          prescriptions={prescriptions}
          onUpdateDispenseStatus={onUpdateDispenseStatus}
          onVerifyPrescription={onVerifyPrescription}
          refillRequests={refillRequests}
          onUpdateRefillStatus={onUpdateRefillStatus}
        />
      )}

      {/* 2. INVENTORY & DRUG MANAGEMENT TAB */}
      {pharmacistTab === 'inventory' && (
        <InventoryDrugManagement
          inventory={inventory}
          onReplenishStock={onReplenishStock}
          onUpdatePrice={onUpdatePrice}
        />
      )}

      {/* 3. COMPOUND & DOSAGE CALCULATORS TAB */}
      {pharmacistTab === 'calculators' && <CompoundingCalculators />}

      {/* 4. PATIENT CONSULTATION LOGS TAB */}
      {pharmacistTab === 'consultations' && (
        <PatientConsultationLogs
          consultationLogs={consultationLogs}
          onAddConsultationLog={onAddConsultationLog}
          medicines={medicines}
          refillRequests={refillRequests}
          onUpdateRefillStatus={onUpdateRefillStatus}
        />
      )}

      {/* 5. VISUAL ADR MAPPING & ORGAN RISK TAB */}
      {pharmacistTab === 'adrmap' && (
        <VisualAdrMapping
          mode="pharmacist"
          adrEvents={visualAdrEvents}
          onAddAdrEvent={onAddAdrEvent}
          patientName="Ramesh V. Kulkarni"
        />
      )}

      {/* 6. MEDICATION HISTORY & RECONCILIATION TAB */}
      {pharmacistTab === 'history' && (
        <MedicationHistoryView
          mode="pharmacist"
          historyRecords={medicationHistory}
          onAddRecord={onAddMedicationHistory}
          onReconcileRecord={onReconcileMedication}
          patientName="Ramesh V. Kulkarni"
        />
      )}

      {/* 7. SUSPECTED ADR TRIAGE & PVPI GATEWAY TAB */}
      {pharmacistTab === 'pvpi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triage Queue */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Suspected ADR Queue ({filteredCases.length})
              </h3>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setFilterPriority('all')}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    filterPriority === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterPriority('emergency')}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    filterPriority === 'emergency' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Emerg
                </button>
                <button
                  onClick={() => setFilterPriority('urgent')}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    filterPriority === 'urgent' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Urgent
                </button>
              </div>
            </div>

            {/* List of Cases */}
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto">
              {filteredCases.map((c) => {
                const isSelected = activeCase?.id === c.id;
                const isEmerg = c.urgencyLevel === 'EMERGENCY';

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectCase(c);
                      setPharmacistNotes(c.pharmacistNotes || '');
                      setCParams({
                        T: c.causality.breakdown.temporalFit_T.score,
                        D: c.causality.breakdown.doseResponse_D.score,
                        K: c.causality.breakdown.knownAssociation_K.score,
                        R: c.causality.breakdown.dechallenge_R.score,
                        H: c.causality.breakdown.hostFactors_H.score,
                        A: c.causality.breakdown.alternativeExplanations_A.score,
                      });
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? isEmerg
                          ? 'bg-rose-50 border-rose-400 shadow-xs ring-1 ring-rose-400'
                          : 'bg-orange-50 border-orange-400 shadow-xs ring-1 ring-orange-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{c.patientName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">({c.patientAge}y)</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isEmerg
                            ? 'bg-rose-100 text-rose-800'
                            : c.urgencyLevel === 'URGENT_CLINICAL'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-orange-100 text-orange-900'
                        }`}
                      >
                        {c.urgencyLevel}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 font-medium">
                      {c.extractedSymptoms.slice(0, 2).join(' · ')}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-1 border-t border-slate-100">
                      <span>C_ADR: <strong className="text-slate-900 font-mono">{c.causality.cAdrTotal}</strong>/100</span>
                      <span className="capitalize">{c.reviewStatus.replace('_', ' ')}</span>
                      <span>{c.onsetDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Deep-Dive Clinical Review & Causality Engine */}
        <div className="lg:col-span-8 space-y-5">
          {/* Header of Active Case */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-orange-900 bg-orange-100 px-2 py-0.5 rounded">
                    {selectedCase.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCase.patientName}</h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {selectedCase.patientGender} · {selectedCase.patientAge} yrs
                  </span>
                  {selectedCase.isElderlyPolypharmacy && (
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                      Polypharmacy Cohort
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Reported at: {new Date(selectedCase.reportedAt).toLocaleString()} · Input Language:{' '}
                  {selectedCase.inputLanguage.toUpperCase()}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-xl uppercase ${
                    selectedCase.urgencyLevel === 'EMERGENCY'
                      ? 'bg-rose-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {selectedCase.urgencyLevel}
                </span>

                <button
                  onClick={() => onOpenPvpiModal(selectedCase)}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>PvPI ADRMS Export</span>
                </button>
              </div>
            </div>

            {/* AI Explanation Banner: "Why was this case prioritized?" */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Explainable AI Triage Rationale</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-medium">
                {selectedCase.causality.explanation}
              </p>
              {selectedCase.emergencyRedFlags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 pt-1">
                  {selectedCase.emergencyRedFlags.map((flag, idx) => (
                    <span key={idx} className="text-[10px] bg-rose-100 text-rose-900 font-semibold px-2 py-0.5 rounded">
                      ⚠️ {flag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* MedDRA & Clinical Terms Mapping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                  Reported Patient Language & Audio Transcript
                </span>
                <p className="text-slate-800 italic">&ldquo;{selectedCase.originalText}&rdquo;</p>
                <p className="text-slate-500 pt-1 text-[11px]">
                  <strong>English Translation:</strong> &ldquo;{selectedCase.translatedText}&rdquo;
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                  Standardized MedDRA Preferred Terms (PT)
                </span>
                <div className="space-y-1">
                  {selectedCase.meddraTerms.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded border border-slate-200">
                      <span className="font-semibold text-slate-800">{m.pt}</span>
                      <span className="font-mono text-slate-500 text-[10px]">{m.code}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Medication–Symptom Timeline Reconstruction */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Medication–Symptom Timeline Reconstruction</span>
                </span>
                <span className="text-[11px] text-slate-500">Day 0 to Day 6 Clinical Course</span>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-orange-200">
                {/* Day 0 */}
                <div className="relative text-xs">
                  <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white" />
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Day 0 (01 Oct)</span>
                    <span className="text-[11px] font-normal text-slate-500">Rx Initiation</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Patient started <strong>Augmentin 625 Duo</strong> (Amoxicillin + Clavulanate) twice daily for respiratory infection. Baseline medications active.
                  </p>
                </div>

                {/* Day 2 */}
                <div className="relative text-xs">
                  <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white" />
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Day 2 (03 Oct)</span>
                    <span className="text-[11px] font-normal text-amber-700">Initial Onset</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Mild itching and red macules started on chest and arms. Patient continued antibiotic.
                  </p>
                </div>

                {/* Day 3 */}
                <div className="relative text-xs">
                  <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-rose-600 border-2 border-white animate-pulse" />
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Day 3 (04 Oct)</span>
                    <span className="text-[11px] font-semibold text-rose-700">Emergency Trigger</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Patient reports rash spread plus <strong>lip swelling (angioedema)</strong> via Marathi voice input. DoseGuard flags Emergency Triage & prompts ER visit.
                  </p>
                </div>

                {/* Day 4 */}
                <div className="relative text-xs">
                  <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-orange-600 border-2 border-white" />
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Day 4 (05 Oct)</span>
                    <span className="text-[11px] font-normal text-orange-700">Dechallenge</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Antibiotic withheld after physician consultation; antihistamine + short steroid course given.
                  </p>
                </div>

                {/* Day 6 */}
                <div className="relative text-xs">
                  <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-amber-600 border-2 border-white" />
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Day 6 (07 Oct)</span>
                    <span className="text-[11px] font-normal text-amber-700">Outcome Evolution</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Cutaneous rash resolving, angioedema completely subsided. Strengthens causality score to Probable/Definite.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Causality Formula Breakdown: C_ADR = w1T + w2D + w3K + w4R + w5H - w6A */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Temporal ADR Causality Engine (Formula C_ADR)
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    C_ADR = w₁T + w₂D + w₃K + w₄R + w₅H - w₆A
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-orange-950">{dynamicCAdr}</span>
                  <span className="text-xs text-slate-400 font-mono">/100</span>
                  <span className="block text-[10px] font-semibold text-orange-800">
                    {dynamicCAdr >= 80 ? 'High-Priority Suspected ADR' : dynamicCAdr >= 65 ? 'Probable Association' : 'Possible'}
                  </span>
                </div>
              </div>

              {/* Slider Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* T: Temporal */}
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">T (Temporal Fit, w=0.25)</span>
                    <span className="font-mono font-bold">{cParams.T}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={cParams.T}
                    onChange={(e) => setCParams({ ...cParams, T: Number(e.target.value) })}
                    className="w-full accent-orange-600"
                  />
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Onset aligns precisely with drug initiation timeline.
                  </p>
                </div>

                {/* D: Dose */}
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">D (Dose-Response, w=0.15)</span>
                    <span className="font-mono font-bold">{cParams.D}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={cParams.D}
                    onChange={(e) => setCParams({ ...cParams, D: Number(e.target.value) })}
                    className="w-full accent-orange-600"
                  />
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Cumulative dose reaches sensitization threshold.
                  </p>
                </div>

                {/* K: Known association */}
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">K (Known Association, w=0.20)</span>
                    <span className="font-mono font-bold">{cParams.K}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={cParams.K}
                    onChange={(e) => setCParams({ ...cParams, K: Number(e.target.value) })}
                    className="w-full accent-orange-600"
                  />
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Extensively characterized in SmPC and WHO VigiBase.
                  </p>
                </div>

                {/* R: Dechallenge */}
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">R (Dechallenge, w=0.15)</span>
                    <span className="font-mono font-bold">{cParams.R}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={cParams.R}
                    onChange={(e) => setCParams({ ...cParams, R: Number(e.target.value) })}
                    className="w-full accent-orange-600"
                  />
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Resolution following medication withdrawal.
                  </p>
                </div>

                {/* H: Host factors */}
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">H (Host Factors, w=0.15)</span>
                    <span className="font-mono font-bold">{cParams.H}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={cParams.H}
                    onChange={(e) => setCParams({ ...cParams, H: Number(e.target.value) })}
                    className="w-full accent-orange-600"
                  />
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Age 68 + 6 concomitant drugs (polypharmacy).
                  </p>
                </div>

                {/* A: Alternative explanations (penalty) */}
                <div className="p-2.5 bg-slate-50 rounded-lg space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">A (Alternative Explanations, w=0.10)</span>
                    <span className="font-mono font-bold text-rose-700">-{cParams.A}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={cParams.A}
                    onChange={(e) => setCParams({ ...cParams, A: Number(e.target.value) })}
                    className="w-full accent-rose-700"
                  />
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Viral rash or food allergen assessed as secondary.
                  </p>
                </div>
              </div>
            </div>

            {/* Pharmacist Action Box & Verification Workflow */}
            <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-orange-950 uppercase tracking-wider block">
                Clinical Pharmacist Verification &amp; Escalation
              </span>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Pharmacist Clinical Assessment Notes:
                </label>
                <textarea
                  rows={2}
                  value={pharmacistNotes}
                  onChange={(e) => setPharmacistNotes(e.target.value)}
                  placeholder="Record professional counseling, interaction verification, and physician escalation notes..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => onUpdateCaseStatus(selectedCase.id, 'verified', pharmacistNotes)}
                  className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify ADR Case</span>
                </button>

                <button
                  onClick={() => activeCase && onUpdateCaseStatus(activeCase.id, 'escalated_physician', pharmacistNotes)}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Escalate to Physician</span>
                </button>

                <button
                  onClick={() => activeCase && onUpdateCaseStatus(activeCase.id, 'in_review', pharmacistNotes)}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Clock className="w-4 h-4" />
                  <span>Request Patient Follow-up</span>
                </button>

                <button
                  onClick={() => activeCase && onOpenPvpiModal(activeCase)}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 ml-auto shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate PvPI Package</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
