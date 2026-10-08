import React, { useState } from 'react';
import { PatientLabResult } from '../../types/pv';
import {
  FileText,
  BookOpen,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  ClipboardList,
} from 'lucide-react';

interface ClinicalDecisionSupportProps {
  labResults: PatientLabResult[];
  onAddLabResult: (lab: PatientLabResult) => void;
}

const CLINICAL_GUIDELINES = [
  {
    title: 'PvPI / IPC: Cutaneous ADR (SCARs) Diagnostic Algorithm',
    badge: 'IPC National Guideline',
    summary:
      'Immediate dechallenge required for beta-lactams and sulfonamides upon emergence of lip swelling (angioedema), mucosal erosions, or facial edema. Assess RegiSCAR score if fever >38.5°C and atypical lymphocytes.',
    keyPoints: [
      'Stop culprit medicine immediately (do not rechallenge without specialist patch testing).',
      'Monitor airway patency for angioedema involvement.',
      'Order Absolute Eosinophil Count (AEC) and Total IgE to differentiate Type I vs Type IV hypersensitivity.',
    ],
  },
  {
    title: 'Beers Criteria 2023 for Potentially Inappropriate Medications (PIMs)',
    badge: 'Geriatrics Standard',
    summary:
      'Avoid high-dose first-generation antihistamines, long-acting sulfonylureas, and concurrent NSAIDs in adults ≥65 years due to heightened sedation, fall risks, and renal decline.',
    keyPoints: [
      'Glimepiride in Glycomet-GP requires blood glucose self-monitoring for nocturnal hypoglycemia.',
      'Aspirin 75mg: Maintain proton-pump inhibitor (Pantoprazole) gastroprotection.',
    ],
  },
  {
    title: 'Renal Dose Adjustment Guidelines (Cockcroft-Gault)',
    badge: 'Pharmacokinetics',
    summary:
      'Dosing rules for chronic medications in elderly patients with estimated CrCl between 30 and 60 mL/min.',
    keyPoints: [
      'Metformin: Maximum 1000 mg/day if CrCl 30–59 mL/min; discontinue if CrCl < 30 mL/min.',
      'Cefuroxime: Standard dose 500mg BID is safe for CrCl > 30 mL/min.',
    ],
  },
];

const PRESET_LAB_ORDERS = [
  { name: 'Serum Creatinine & eGFR Panel', category: 'Renal Function', unit: 'mg/dL', range: '0.7 - 1.3' },
  { name: 'Absolute Eosinophil Count (AEC)', category: 'Hematology / Allergy', unit: 'cells/mcL', range: '20 - 500' },
  { name: 'Total Serum IgE Level', category: 'Immunology', unit: 'IU/mL', range: '< 100' },
  { name: 'Complete Blood Count with Platelets', category: 'Hematology', unit: 'k/mcL', range: '4.5 - 11.0' },
  { name: 'Liver Function Tests (ALT/AST/ALP)', category: 'Hepatic', unit: 'U/L', range: '10 - 40' },
];

export const ClinicalDecisionSupport: React.FC<ClinicalDecisionSupportProps> = ({
  labResults,
  onAddLabResult,
}) => {
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  const handleCreateLabOrder = (preset: typeof PRESET_LAB_ORDERS[0]) => {
    const newLab: PatientLabResult = {
      id: `lab-${Date.now()}`,
      testName: preset.name,
      category: preset.category,
      value: 'Pending Lab Run',
      unit: preset.unit,
      referenceRange: preset.range,
      status: 'Normal',
      date: new Date().toISOString().split('T')[0],
    };
    onAddLabResult(newLab);
    setOrderSuccessMsg(`Diagnostic order created: "${preset.name}". Sent to Sassoon Hospital Central Lab!`);
    setTimeout(() => setOrderSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Order confirmation banner */}
      {orderSuccessMsg && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-900 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold">{orderSuccessMsg}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
            Lab Order Dispatched
          </span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-orange-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-900 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200 uppercase">
            Evidence-Based CDS
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">
            Clinical Decision Support & Diagnostics Management
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Quick-reference clinical guidelines, pharmacovigilance safety protocols, and 1-click diagnostic laboratory order creation.
          </p>
        </div>
      </div>

      {/* Grid: Guidelines Reference (50%) + Lab Orders & Diagnostics (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Clinical Guidelines Quick-Reference */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-600" />
                Clinical Guidelines Quick-Reference Panel
              </h4>
              <span className="text-[10px] bg-orange-100 text-orange-900 px-2 py-0.5 rounded font-bold">
                IPC / CDSCO
              </span>
            </div>

            <div className="space-y-4">
              {CLINICAL_GUIDELINES.map((g, idx) => (
                <div key={idx} className="p-4 bg-orange-50/40 rounded-2xl border border-orange-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-extrabold text-slate-900 text-xs">{g.title}</span>
                    <span className="text-[10px] bg-white border border-orange-200 text-orange-900 font-mono font-bold px-2 py-0.5 rounded whitespace-nowrap">
                      {g.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{g.summary}</p>
                  <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5 pt-1">
                    {g.keyPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Lab Order Creation & Diagnostic Result Review */}
        <div className="lg:col-span-6 space-y-5">
          {/* Create Diagnostic Order Panel */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-600" />
                1-Click Laboratory Order Creation
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">Patient: PAT-6801</span>
            </div>

            <div className="space-y-2.5">
              {PRESET_LAB_ORDERS.map((preset, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 hover:bg-orange-50/50 rounded-2xl border border-slate-200 hover:border-orange-300 transition-all flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{preset.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Category: {preset.category} · Ref: {preset.range} {preset.unit}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCreateLabOrder(preset)}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Order Test</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Result Review */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-600" />
                Diagnostic Laboratory Results Review ({labResults.length})
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Hospital LIS Feed</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {labResults.map((lab) => (
                <div key={lab.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{lab.testName}</span>
                    <p className="text-[11px] text-slate-500">{lab.category} · {lab.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-slate-900">
                      {lab.value} {lab.unit}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      lab.status === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {lab.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
