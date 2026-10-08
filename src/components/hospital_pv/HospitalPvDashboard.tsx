import React, { useState } from 'react';
import { Medicine, SymptomReport } from '../../types/pv';
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Layers,
  FileCheck,
  Download,
  Users,
  Search,
  Check,
  Sparkles,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Filter,
  Activity,
  AlertCircle,
  Send,
} from 'lucide-react';

interface HospitalPvDashboardProps {
  cases: SymptomReport[];
  medicines: Medicine[];
  onOpenPvpiModal: (caseData: SymptomReport) => void;
}

export const HospitalPvDashboard: React.FC<HospitalPvDashboardProps> = ({
  cases,
  medicines,
  onOpenPvpiModal,
}) => {
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'surveillance' | 'naranjo' | 'preventability' | 'bulletin'>('surveillance');
  const [bulletinSent, setBulletinSent] = useState(false);

  // Naranjo scale scoring state
  const [naranjoScores, setNaranjoScores] = useState<Record<string, number>>({
    q1_previousReports: 1, // Yes (+1)
    q2_afterDrug: 2, // Yes (+2)
    q3_improvedOnDechallenge: 1, // Yes (+1)
    q4_rechallenge: 0, // Not done (0)
    q5_alternativeCauses: 2, // No alternative causes (+2)
    q6_placebo: 0, // No (0)
    q7_toxicConcentration: 0, // No (0)
    q8_doseResponse: 1, // Yes (+1)
    q9_similarReaction: 0, // No (0)
    q10_objectiveConfirmation: 1, // Yes, rash photo verified (+1)
  });

  const naranjoTotal = Object.values(naranjoScores).reduce((a, b) => a + b, 0);
  const naranjoCategory =
    naranjoTotal >= 9
      ? 'Definite ADR'
      : naranjoTotal >= 5
      ? 'Probable ADR'
      : naranjoTotal >= 1
      ? 'Possible ADR'
      : 'Doubtful ADR';

  // Preventability assessment (Schumock & Thornton)
  const [preventability, setPreventability] = useState<'definitely_preventable' | 'probably_preventable' | 'not_preventable'>('probably_preventable');

  // Hospital ward surveillance clusters
  const WARD_CLUSTERS = [
    {
      id: 'CL-2026-08',
      ward: 'Ward 4B (Chest & Pulmonology)',
      drugName: 'Amoxicillin-Clavulanic Acid (Augmentin 625)',
      batchNumber: 'AX26-904',
      casesDetected: 4,
      period: 'Past 72 hours',
      severity: 'CRITICAL_CLUSTER',
      symptoms: 'Rash maculo-papular, facial angioedema, pruritus',
      action: 'Batch quarantine advised across central inpatient pharmacy',
    },
    {
      id: 'CL-2026-04',
      ward: 'Ward 2A (Cardiology Inpatients)',
      drugName: 'Atorvastatin 40 mg',
      batchNumber: 'AT-8812',
      casesDetected: 3,
      period: 'Past 7 days',
      severity: 'MODERATE_CLUSTER',
      symptoms: 'Bilateral calf and shoulder myalgia',
      action: 'CK levels screened; CK < 3x ULN',
    },
    {
      id: 'CL-2026-02',
      ward: 'Ward 5C (Geriatric Medicine Cohort)',
      drugName: 'Metformin + Glimepiride',
      batchNumber: 'GM-4412',
      casesDetected: 2,
      period: 'Past 14 days',
      severity: 'LOW_CLUSTER',
      symptoms: 'Transient morning hypoglycemia (BG < 65 mg/dL)',
      action: 'Dietary intake timing re-counseled with caregivers',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner - Light Orange & Amber Theme */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/70 border border-orange-200 rounded-3xl p-6 text-slate-900 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-orange-900 bg-orange-200/70 border border-orange-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Hospital Pharmacovigilance Unit
                </span>
                <span className="text-xs text-orange-800 font-mono font-medium">
                  City Central Hospital · Institutional Safety Committee
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Inpatient Pattern Detection & Validated ADR Dossiers
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Hospital-wide surveillance across wards, Naranjo probability algorithm execution, preventability criteria audit, and preparation of validated institutional submissions for regional AMC.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-white/90 border border-orange-200 px-4 py-2.5 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-orange-800 font-semibold block uppercase">Active Clusters</span>
              <span className="text-xl font-extrabold text-orange-950 font-mono">1 Critical</span>
            </div>
            <div className="bg-white/90 border border-amber-200 px-4 py-2.5 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-amber-800 font-semibold block uppercase">Wards Monitored</span>
              <span className="text-xl font-extrabold text-amber-950 font-mono">14 Inpatient</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 bg-orange-50/60 p-1.5 rounded-2xl border border-orange-200/80 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('surveillance')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'surveillance'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. Ward Pattern Surveillance & Clusters</span>
        </button>
        <button
          onClick={() => setActiveTab('naranjo')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'naranjo'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>2. Naranjo Algorithm Calculator ({naranjoTotal}/10)</span>
        </button>
        <button
          onClick={() => setActiveTab('preventability')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'preventability'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>3. Preventability Criteria Audit</span>
        </button>
        <button
          onClick={() => setActiveTab('bulletin')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'bulletin'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>4. Hospital P&amp;T Safety Bulletin</span>
        </button>
      </div>

      {/* TAB 1: Ward Pattern Surveillance */}
      {activeTab === 'surveillance' && (
        <div className="space-y-5">
          {/* Active Outbreak/Cluster Banner */}
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 shadow-xs text-rose-950 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-rose-950 uppercase tracking-wide">
                      Ward 4B Critical Cluster Signal #CL-2026-08
                    </span>
                    <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                      Immediate Audit
                    </span>
                  </div>
                  <p className="text-xs text-rose-900/90 mt-0.5">
                    4 acute hypersensitivity events with angioedema reported in Ward 4B associated with Amoxicillin-Clavulanic Acid Lot AX26-904.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenPvpiModal(cases[0])}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
              >
                Transmit Cluster Dossier to AMC
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-3 bg-white/80 rounded-xl border border-rose-200">
                <span className="text-slate-500 block text-[10px]">Manufacturer Lot</span>
                <span className="font-mono font-bold text-rose-900 text-sm">AX26-904</span>
                <span className="text-[10px] text-slate-500 block">Exp: 08/2027</span>
              </div>
              <div className="p-3 bg-white/80 rounded-xl border border-rose-200">
                <span className="text-slate-500 block text-[10px]">Index Patient</span>
                <span className="font-bold text-slate-900 text-sm">Ramesh V. Kulkarni (68y)</span>
                <span className="text-[10px] text-slate-500 block">Polypharmacy Cohort</span>
              </div>
              <div className="p-3 bg-white/80 rounded-xl border border-rose-200">
                <span className="text-slate-500 block text-[10px]">Action Recommended</span>
                <span className="font-bold text-rose-800 text-sm">Central Pharmacy Quarantine</span>
                <span className="text-[10px] text-slate-500 block">Lot inspection pending</span>
              </div>
            </div>
          </div>

          {/* List of Surveillance Clusters */}
          <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-orange-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Hospital-Wide ADR Cluster Surveillance Log
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time algorithmic pattern matching from patient mobile inputs and ward rounds
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="p-1.5 bg-orange-50/50 border border-orange-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Hospital Wards</option>
                  <option value="ward4b">Ward 4B (Chest)</option>
                  <option value="ward2a">Ward 2A (Cardiology)</option>
                  <option value="ward5c">Ward 5C (Geriatrics)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {WARD_CLUSTERS.map((cluster) => (
                <div
                  key={cluster.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-orange-300 transition-all bg-slate-50/50 hover:bg-white text-xs space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded border border-orange-200">
                        {cluster.id}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{cluster.ward}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        cluster.severity === 'CRITICAL_CLUSTER'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : cluster.severity === 'MODERATE_CLUSTER'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {cluster.severity.replace('_', ' ')} · {cluster.casesDetected} Cases ({cluster.period})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <strong className="text-slate-900">Drug:</strong> {cluster.drugName} (Batch: <code>{cluster.batchNumber}</code>)
                    </div>
                    <div>
                      <strong className="text-slate-900">Symptoms:</strong> {cluster.symptoms}
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-600 flex items-center justify-between">
                    <span>
                      <strong className="text-orange-900">PV Committee Action:</strong> {cluster.action}
                    </span>
                    <button
                      onClick={() => onOpenPvpiModal(cases[0])}
                      className="text-orange-700 hover:text-orange-900 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <span>Prepare Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Naranjo Algorithm Calculator */}
      {activeTab === 'naranjo' && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-100">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Naranjo Adverse Drug Reaction Probability Scale
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Standardized 10-item algorithmic questionnaire for index case: Ramesh V. Kulkarni (Augmentin 625 Duo)
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 px-4 py-2 rounded-2xl text-right">
              <span className="text-[10px] text-orange-700 font-bold block uppercase">Naranjo Total Score</span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold text-orange-950 font-mono">{naranjoTotal}</span>
                <span className="text-xs text-slate-400">/ 10</span>
                <span className="text-xs font-bold text-orange-900 bg-orange-200/80 px-2 py-0.5 rounded-full ml-1">
                  {naranjoCategory}
                </span>
              </div>
            </div>
          </div>

          {/* 10 Standard Questions */}
          <div className="space-y-2">
            {[
              { id: 'q1_previousReports', q: '1. Are there previous conclusive reports on this reaction?', yes: 1, no: 0, dontKnow: 0 },
              { id: 'q2_afterDrug', q: '2. Did the adverse event appear after the suspected drug was administered?', yes: 2, no: -1, dontKnow: 0 },
              { id: 'q3_improvedOnDechallenge', q: '3. Did the adverse reaction improve when the drug was discontinued or a specific antagonist was administered?', yes: 1, no: 0, dontKnow: 0 },
              { id: 'q4_rechallenge', q: '4. Did the adverse event reappear when the drug was readministered (rechallenge)?', yes: 2, no: -1, dontKnow: 0 },
              { id: 'q5_alternativeCauses', q: '5. Are there alternative causes that could on their own have caused the reaction?', yes: -1, no: 2, dontKnow: 0 },
              { id: 'q6_placebo', q: '6. Did the reaction appear when a placebo was given?', yes: -1, no: 1, dontKnow: 0 },
              { id: 'q7_toxicConcentration', q: '7. Was the drug detected in the blood (or other fluids) in concentrations known to be toxic?', yes: 1, no: 0, dontKnow: 0 },
              { id: 'q8_doseResponse', q: '8. Was the reaction more severe when the dose was increased, or less severe when decreased?', yes: 1, no: 0, dontKnow: 0 },
              { id: 'q9_similarReaction', q: '9. Did the patient have a similar reaction to the same or similar drugs in any previous exposure?', yes: 1, no: 0, dontKnow: 0 },
              { id: 'q10_objectiveConfirmation', q: '10. Was the adverse event confirmed by any objective evidence (photo/labs/biopsy)?', yes: 1, no: 0, dontKnow: 0 },
            ].map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <span className="font-medium text-slate-800">{item.q}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setNaranjoScores({ ...naranjoScores, [item.id]: item.yes })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      naranjoScores[item.id] === item.yes
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-orange-50'
                    }`}
                  >
                    Yes ({item.yes > 0 ? `+${item.yes}` : item.yes})
                  </button>
                  <button
                    type="button"
                    onClick={() => setNaranjoScores({ ...naranjoScores, [item.id]: item.no })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      naranjoScores[item.id] === item.no
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-orange-50'
                    }`}
                  >
                    No ({item.no > 0 ? `+${item.no}` : item.no})
                  </button>
                  <button
                    type="button"
                    onClick={() => setNaranjoScores({ ...naranjoScores, [item.id]: item.dontKnow })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      naranjoScores[item.id] === item.dontKnow
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-orange-50'
                    }`}
                  >
                    N/A (0)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Preventability Criteria Audit */}
      {activeTab === 'preventability' && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Schumock &amp; Thornton Preventability Assessment
              </h3>
              <p className="text-xs text-slate-500">
                Hospital Quality Assurance criteria to classify preventable adverse drug events
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full uppercase">
              {preventability.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPreventability('definitely_preventable')}
              className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                preventability === 'definitely_preventable'
                  ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-1 ring-orange-400'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <span className="font-bold text-slate-900 text-sm block">1. Definitely Preventable</span>
              <p className="text-[11px] text-slate-600">
                Drug was inappropriate for clinical condition, known allergy documented but ignored, or therapeutic drug monitoring omitted.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPreventability('probably_preventable')}
              className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                preventability === 'probably_preventable'
                  ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-1 ring-orange-400'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <span className="font-bold text-slate-900 text-sm block">2. Probably Preventable</span>
              <p className="text-[11px] text-slate-600">
                Drug-drug interaction was predictable, dose was suboptimal for elderly polypharmacy patient, or lab monitoring delayed.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPreventability('not_preventable')}
              className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                preventability === 'not_preventable'
                  ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-1 ring-orange-400'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <span className="font-bold text-slate-900 text-sm block">3. Not Preventable</span>
              <p className="text-[11px] text-slate-600">
                Idiosyncratic allergic reaction occurring at standard dose with zero prior allergy history in patient.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Hospital P&T Safety Bulletin */}
      {activeTab === 'bulletin' && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Hospital Pharmacy &amp; Therapeutics (P&amp;T) Internal Safety Bulletin
              </h3>
              <p className="text-xs text-slate-500">
                Issue clinical advisory to all ward heads, resident medical officers, and nursing supervisors
              </p>
            </div>
            <button
              onClick={() => {
                setBulletinSent(true);
                setTimeout(() => setBulletinSent(false), 4000);
              }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              {bulletinSent ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Bulletin Broadcasted!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Bulletin to Hospital</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-3 text-slate-800">
            <div className="flex items-center justify-between border-b border-orange-200/80 pb-2">
              <span className="font-bold text-orange-950 uppercase tracking-wider text-xs">
                City Central Hospital · Safety Advisory #PV-2026-14
              </span>
              <span className="font-mono text-slate-500 text-[11px]">Date: 07 Oct 2026</span>
            </div>

            <h4 className="font-bold text-slate-900 text-sm">
              Urgent Clinical Advisory: Increased Cutaneous Hypersensitivity with Amoxicillin-Clavulanic Acid (Batch AX26-904)
            </h4>

            <p className="leading-relaxed text-slate-700">
              The Hospital Pharmacovigilance Committee has detected a cluster of 4 acute cutaneous and mucosal hypersensitivity reactions within 72 hours across Ward 4B and Outpatient Pulmonology. Patients aged ≥60 years presenting with lip/facial swelling must be managed immediately with beta-lactam withholding, Levocetirizine, and airway monitoring.
            </p>

            <div className="p-3 bg-white rounded-xl border border-orange-200 font-semibold text-orange-900">
              Immediate Ward Actions:
              <ul className="list-disc pl-5 mt-1 font-normal text-slate-700 space-y-0.5">
                <li>Quarantine remaining blister packs of Lot AX26-904 in Ward 4B medication carts.</li>
                <li>Verify drug packaging photos captured via patient DoseGuard mobile app.</li>
                <li>Submit completed PvPI ADRMS electronic cases to regional AMC (KEM Hospital).</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
