import React, { useState } from 'react';
import { SignalMetric } from '../../types/pv';
import { SIGNAL_METRICS } from '../../data/mockPvData';
import {
  TrendingUp,
  BarChart2,
  Download,
  Filter,
  Layers,
  Sparkles,
  PieChart,
  FileSpreadsheet,
  Check,
  Info,
  Calendar,
} from 'lucide-react';

export const ResearcherDashboard: React.FC = () => {
  const [selectedCohort, setSelectedCohort] = useState<'elderly_polypharmacy' | 'paediatric' | 'all'>('elderly_polypharmacy');
  const [exportNotice, setExportNotice] = useState(false);

  const handleExportData = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Light Orange & Warm Amber Theme */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/70 border border-orange-200 rounded-3xl p-6 text-slate-900 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-orange-900 bg-orange-200/70 border border-orange-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Epidemiological Safety Analytics
                </span>
                <span className="text-xs text-orange-800 font-mono font-medium">
                  Prof. S. Patil, Ph.D. · Clinical Pharmacology &amp; Pharmacovigilance
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Disproportionality Signal Mining &amp; Polypharmacy Research
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Analyse de-identified aggregate adverse drug reaction datasets across India. Compute Proportional Reporting Ratios (PRR), Reporting Odds Ratios (ROR), and stratify polypharmacy cohorts aged 60+ taking 5+ medicines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleExportData}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Anonymized Dataset</span>
            </button>
          </div>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 font-bold text-xs flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>De-identified dataset export generated (50,000 anonymized records, CSV format, compliant with WHO &amp; ICSR privacy standards).</span>
        </div>
      )}

      {/* Cohort Stratification Bar */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Filter className="w-4 h-4 text-orange-600" />
          <span>Stratify Epidemiological Cohort:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCohort('elderly_polypharmacy')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedCohort === 'elderly_polypharmacy'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-orange-50'
            }`}
          >
            Adults &ge;60y &amp; &ge;5 Medicines (Priority Cohort)
          </button>
          <button
            onClick={() => setSelectedCohort('paediatric')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedCohort === 'paediatric'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-orange-50'
            }`}
          >
            Paediatric (&lt;12 yrs)
          </button>
          <button
            onClick={() => setSelectedCohort('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedCohort === 'all'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-orange-50'
            }`}
          >
            All Age Groups
          </button>
        </div>
      </div>

      {/* Key Statistical Signal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {SIGNAL_METRICS.map((sig, idx) => (
          <div
            key={idx}
            className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-3 hover:border-orange-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-orange-800 font-bold uppercase tracking-wider block">
                  Suspect Drug Pair
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">{sig.drugName}</h3>
                <span className="text-slate-600 text-[11px] block">{sig.symptomTerm}</span>
              </div>
              <span className="text-[10px] bg-orange-100 text-orange-900 border border-orange-200 px-2 py-0.5 rounded-full font-bold">
                {sig.signalStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2.5 bg-orange-50/50 rounded-xl border border-orange-100 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">PRR Ratio:</span>
                <span className="font-bold text-orange-950 text-sm">{sig.prr}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ROR (95% CI):</span>
                <span className="font-bold text-slate-900 text-sm">{sig.ror}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Case Count:</span>
                <span className="font-bold text-slate-900">{sig.caseCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Chi-Square:</span>
                <span className="font-bold text-slate-900">{sig.chiSquare}</span>
              </div>
            </div>

            <p className="text-slate-500 text-[10px] leading-relaxed">
              {sig.socialMediaTrend.disclaimer}
            </p>
          </div>
        ))}
      </div>

      {/* Mathematical Methodology Box */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-3 text-xs text-slate-800">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <Info className="w-4 h-4 text-orange-600" />
          <span>Disproportionality Analysis Mathematical Formulation</span>
        </h3>
        <p className="leading-relaxed text-slate-600 text-[11px]">
          In DoseGuard research algorithms, safety signals are calculated using 2&times;2 contingency tables where cell <em>a</em> represents reports of the specific drug–event pair, <em>b</em> is reports of other events for the drug, <em>c</em> is reports of the event for all other drugs, and <em>d</em> is reports of other events for other drugs.
        </p>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
          <div>&bull; <strong>PRR (Proportional Reporting Ratio)</strong> = [a / (a + b)] / [c / (c + d)] (Signal flagged if PRR &ge; 2.0 and &chi;&sup2; &ge; 4.0)</div>
          <div>&bull; <strong>ROR (Reporting Odds Ratio)</strong> = (a &middot; d) / (b &middot; c) with standard error SE = &radic;(1/a + 1/b + 1/c + 1/d)</div>
        </div>
      </div>
    </div>
  );
};
