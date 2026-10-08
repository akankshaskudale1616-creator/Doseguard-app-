import React, { useState } from 'react';
import { SignalMetric } from '../../types/pv';
import { INITIAL_SIGNALS } from '../../data/mockPvData';
import {
  TrendingUp,
  AlertCircle,
  BarChart3,
  Globe2,
  ShieldCheck,
  Search,
  Filter,
  Users,
  Database,
  Info,
} from 'lucide-react';

export const SignalAnalytics: React.FC = () => {
  const [signals] = useState<SignalMetric[]>(INITIAL_SIGNALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSignal, setSelectedSignal] = useState<SignalMetric>(INITIAL_SIGNALS[0]);

  const filtered = signals.filter(
    (s) =>
      s.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.symptomTerm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Pharmacovigilance Analytics &amp; Disproportionality Signal Detection
            </h2>
            <span className="text-xs bg-orange-100 text-orange-900 font-semibold px-2 py-0.5 rounded-full border border-orange-200">
              Layer 5 PV Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Detects drug-event associations using WHO-UMC &amp; PvPI standard disproportionality metrics: Proportional Reporting Ratio (PRR), Reporting Odds Ratio (ROR), and time-series anomaly flags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total AMC Reports</span>
            <span className="text-lg font-bold text-slate-900 font-mono">14,290</span>
          </div>
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-orange-700 block">Active Signals</span>
            <span className="text-lg font-bold text-orange-950 font-mono">4</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Signal Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Disproportionality Metric Registry (PRR / ROR)
              </h3>
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter drug or symptom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-orange-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                    <th className="py-2 px-3">Suspected Drug &amp; Event</th>
                    <th className="py-2 px-3 text-right">PRR</th>
                    <th className="py-2 px-3 text-right">ROR</th>
                    <th className="py-2 px-3 text-right">Cases</th>
                    <th className="py-2 px-3 text-right">Chi²</th>
                    <th className="py-2 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((sig, idx) => {
                    const isSelected = selectedSignal.drugName === sig.drugName;
                    return (
                      <tr
                        key={idx}
                        onClick={() => setSelectedSignal(sig)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-orange-50/80 font-semibold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900 block">{sig.drugName}</span>
                          <span className="text-[11px] text-slate-500 font-normal">{sig.symptomTerm}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-orange-700">
                          {sig.prr.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                          {sig.ror.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                          {sig.caseCount}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                          {sig.chiSquare.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              sig.signalStatus === 'CONFIRMED_SIGNAL'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {sig.signalStatus === 'CONFIRMED_SIGNAL' ? 'CONFIRMED' : 'EMERGING'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Scientific Math Note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800">Signal Detection Criteria (Evans et al. / PvPI):</span>
              <p>
                A positive safety signal is triggered when <strong>PRR ≥ 2.0</strong>, <strong>Chi² ≥ 4.0</strong>, and number of reports <strong>N ≥ 3</strong>.
                Disproportionality generates early hypotheses, which must be clinically validated before regulatory action.
              </p>
            </div>
          </div>

          {/* Population Priority Cohort: Polypharmacy in Seniors */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-orange-600" />
                <span>Priority Population Cohort Analytics: Adults 60+ on Polypharmacy</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">N=1,840 elderly patients</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Mean Concomitant Meds</span>
                <span className="text-lg font-bold text-slate-900 font-mono mt-0.5 block">6.2 medicines</span>
                <span className="text-[10px] text-orange-700 font-semibold">Diabetes + HTN + CVD</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Top Suspected Drug Class</span>
                <span className="text-lg font-bold text-slate-900 font-mono mt-0.5 block">Antibiotics</span>
                <span className="text-[10px] text-rose-700 font-semibold">Co-Amoxiclav &amp; Cephalosporins</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Red-Flag Triage Escalation</span>
                <span className="text-lg font-bold text-slate-900 font-mono mt-0.5 block">14.2%</span>
                <span className="text-[10px] text-amber-700 font-semibold">Angioedema &amp; Severe Rash</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected Signal Deep Dive & Social Media Module (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Signal Detail Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 block">
                Selected Signal Profile
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedSignal.drugName}</h3>
              <p className="text-xs text-slate-600 font-medium">{selectedSignal.symptomTerm}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">PRR Ratio</span>
                <span className="text-xl font-bold font-mono text-orange-700">{selectedSignal.prr.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 block">vs baseline background</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Reporting Odds (ROR)</span>
                <span className="text-xl font-bold font-mono text-orange-700">{selectedSignal.ror.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 block">95% CI [2.8 - 4.1]</span>
              </div>
            </div>

            {/* Social Media Early Safety Signal Module */}
            <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-orange-600" />
                  <span>Public Social-Media Signal Hypothesis Monitor</span>
                </span>
                <span className="text-[10px] bg-orange-100 text-orange-900 font-semibold px-2 py-0.5 rounded border border-orange-200">
                  De-Identified Aggregate
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-orange-950">
                  +{selectedSignal.socialMediaTrend.velocityPercent}%
                </span>
                <span className="text-xs text-slate-600">
                  30-day velocity in public discussion mentions
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {selectedSignal.socialMediaTrend.disclaimer}
              </p>

              {/* Strict Ethical & Scientific Disclaimer */}
              <div className="p-2.5 bg-white/80 rounded-lg border border-orange-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1 text-slate-800 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                  <span>Ethical &amp; Scientific Pharmacovigilance Safeguard</span>
                </div>
                <p>
                  Social media data is restricted to public, de-identified, aggregate counts.
                  It is used strictly as an <strong>early hypothesis-generation signal</strong> and never to diagnose an individual or unilaterally withdraw a product.
                </p>
              </div>
            </div>

            {/* Interoperability Gateway with PvPI ADRMS */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">PvPI ADRMS Gateway Connection</span>
                <span className="text-blue-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Connected
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Official submission gateway: Indian Pharmacopoeia Commission (IPC), Ministry of Health & Family Welfare.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
