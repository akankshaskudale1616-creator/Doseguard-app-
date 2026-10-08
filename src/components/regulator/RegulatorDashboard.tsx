import React, { useState } from 'react';
import { Medicine, SymptomReport } from '../../types/pv';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Send,
  Building2,
  Flame,
  Award,
  BarChart,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

interface RegulatorDashboardProps {
  cases: SymptomReport[];
  medicines: Medicine[];
  onOpenPvpiModal: (caseData: SymptomReport) => void;
}

export const RegulatorDashboard: React.FC<RegulatorDashboardProps> = ({
  cases,
  medicines,
  onOpenPvpiModal,
}) => {
  const [activeRegTab, setActiveRegTab] = useState<'signals' | 'actions' | 'kpis'>('signals');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleTriggerAction = (actionTitle: string) => {
    setActionSuccess(`Action initiated: ${actionTitle}. Notification dispatched to state drug controllers & CDSCO portal.`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Light Orange & Warm Amber Palette */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/70 border border-orange-200 rounded-3xl p-6 text-slate-900 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-orange-900 bg-orange-200/70 border border-orange-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  National Authority Console
                </span>
                <span className="text-xs text-orange-800 font-mono font-medium">
                  NCC-PvPI (Indian Pharmacopoeia Commission) &amp; CDSCO
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                National Pharmacovigilance Oversight &amp; Regulatory Actions
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Review professionally validated, consented, standards-compliant ICSR data from across India. Evaluate safety signals, issue public health advisories, mandate package insert revisions, and order batch recalls.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-white/90 border border-orange-200 px-4 py-2.5 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-orange-800 font-semibold block uppercase">National Registry</span>
              <span className="text-xl font-extrabold text-orange-950 font-mono">1.28M ICSRs</span>
            </div>
            <div className="bg-white/90 border border-amber-200 px-4 py-2.5 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-amber-800 font-semibold block uppercase">Active AMCs</span>
              <span className="text-xl font-extrabold text-amber-950 font-mono">650 Nodes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 bg-orange-50/60 p-1.5 rounded-2xl border border-orange-200/80 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveRegTab('signals')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeRegTab === 'signals'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. National Safety Signal Registry
        </button>
        <button
          onClick={() => setActiveRegTab('actions')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeRegTab === 'actions'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Regulatory Action Triggers &amp; Recalls
        </button>
        <button
          onClick={() => setActiveRegTab('kpis')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeRegTab === 'kpis'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. National Quality &amp; Completeness KPIs
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 font-bold text-xs flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* TAB 1: National Safety Signal Registry */}
      {activeRegTab === 'signals' && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Active National Pharmacovigilance Drug Safety Signals
              </h3>
              <p className="text-slate-500 text-xs">
                Under evaluation by Central Drugs Standard Control Organisation (CDSCO) &amp; NCC-PvPI Signal Committee
              </p>
            </div>
            <span className="text-xs bg-orange-100 text-orange-900 font-bold px-3 py-1 rounded-full border border-orange-200">
              3 High Priority Signals
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">
                  Amoxicillin + Clavulanic Acid (Augmentin &amp; Generics)
                </span>
                <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                  Emergency Signal (Angioedema &amp; Blistering)
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Cluster of 48 reports within 30 days across Western Zone AMC nodes (including index case Ramesh Kulkarni, Case ID: {cases[0]?.id}) exhibiting acute mucosal angioedema within 48–72h in elderly polypharmacy cohort. Lot AX26-904 cited in 4 cases.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-orange-200/60 text-[11px]">
                <span className="text-slate-500 font-mono">Disproportionality: PRR = 3.42 (p &lt; 0.001)</span>
                <button
                  onClick={() => handleTriggerAction('Immediate Recall & Inspection of Batch AX26-904')}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors"
                >
                  Order Lot Quarantine
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">
                  Metformin + Glimepiride Fixed-Dose Combinations
                </span>
                <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                  Monitoring Signal
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Unintended nocturnal hypoglycemia in patients aged &ge;65 years taking concomitant ACE inhibitors or beta-blockers.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                <span className="text-slate-500 font-mono">Disproportionality: PRR = 2.15</span>
                <button
                  onClick={() => handleTriggerAction('SmPC Warning Update for Metformin/Glimepiride in Elderly')}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
                >
                  Issue SmPC Advisory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Regulatory Action Triggers */}
      {activeRegTab === 'actions' && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
          <div className="pb-3 border-b border-orange-100">
            <h3 className="text-sm font-bold text-slate-900">
              National Authority Action Execution Panel
            </h3>
            <p className="text-slate-500 text-xs">
              Execute formal regulatory directives under Drugs &amp; Cosmetics Act (India)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">1. Batch Specific Quarantine &amp; Recall Order</h4>
              <p className="text-slate-600 text-[11px]">
                Order mandatory quarantine for Amoxicillin-Clavulanic Acid 625mg Lot AX26-904 across wholesale distributors, retail pharmacies, and hospital dispensaries.
              </p>
              <button
                onClick={() => handleTriggerAction('National Gazette Notice: Batch AX26-904 Quarantine')}
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs"
              >
                Issue Batch Quarantine Directive
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">2. SmPC / Package Insert Label Revision</h4>
              <p className="text-slate-600 text-[11px]">
                Mandate enhanced warning in Section 4.4 on elderly polypharmacy angioedema risk and immediate Levocetirizine co-administration advisory.
              </p>
              <button
                onClick={() => handleTriggerAction('CDSCO Directive: Package Insert SmPC Revision')}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs"
              >
                Mandate Label Revision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: National KPIs */}
      {activeRegTab === 'kpis' && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
          <div className="pb-3 border-b border-orange-100">
            <h3 className="text-sm font-bold text-slate-900">
              National Pharmacovigilance Programme Quality &amp; Completeness Metrics
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200">
              <span className="text-slate-500 block uppercase text-[10px]">Report Completeness Score</span>
              <span className="text-2xl font-extrabold text-orange-950 font-mono">94.2%</span>
              <span className="text-[10px] text-emerald-700 block mt-1">Exceeds 90% PvPI Target ✓</span>
            </div>

            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200">
              <span className="text-slate-500 block uppercase text-[10px]">Emergency Triage Latency</span>
              <span className="text-2xl font-extrabold text-orange-950 font-mono">1.8 hrs</span>
              <span className="text-[10px] text-emerald-700 block mt-1">Well within 24h statutory limit ✓</span>
            </div>

            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200">
              <span className="text-slate-500 block uppercase text-[10px]">Direct Patient Voice Adoption</span>
              <span className="text-2xl font-extrabold text-orange-950 font-mono">68.4%</span>
              <span className="text-[10px] text-orange-800 block mt-1">Marathi / Hindi / English inputs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
