import React, { useState } from 'react';
import { Medicine, SymptomReport } from '../../types/pv';
import {
  MapPin,
  CheckCircle2,
  FileCode,
  Send,
  Download,
  AlertTriangle,
  Building,
  Check,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface AmcDashboardProps {
  cases: SymptomReport[];
  medicines: Medicine[];
  onOpenPvpiModal: (caseData: SymptomReport) => void;
}

export const AmcDashboard: React.FC<AmcDashboardProps> = ({
  cases,
  medicines,
  onOpenPvpiModal,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || 'CASE-6801');
  const [activeAmcTab, setActiveAmcTab] = useState<'intake' | 'meddra' | 'e2br3' | 'consensus'>('intake');
  const [transmissionSuccess, setTransmissionSuccess] = useState(false);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const handleTransmitE2BR3 = () => {
    setTransmissionSuccess(true);
    setTimeout(() => setTransmissionSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Light Orange & Warm Amber Palette */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/70 border border-orange-200 rounded-3xl p-6 text-slate-900 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-orange-900 bg-orange-200/70 border border-orange-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  ADR Monitoring Centre (AMC) Node
                </span>
                <span className="text-xs text-orange-800 font-mono font-medium">
                  AMC-MH-04 · KEM Hospital &amp; Seth GS Medical College, Mumbai
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Regional Gateway &amp; MedDRA Coding Workstation
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Receive structured, pharmacist-verified suspected ADR batches via approved API integration. Validate MedDRA terminology coding, ensure ICSR E2B(R3) compliance, and transmit validated records to National Coordination Centre (NCC-PvPI).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-white/90 border border-orange-200 px-4 py-2.5 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-orange-800 font-semibold block uppercase">Intake Queue</span>
              <span className="text-xl font-extrabold text-orange-950 font-mono">{cases.length} ICSRs</span>
            </div>
            <div className="bg-white/90 border border-amber-200 px-4 py-2.5 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-amber-800 font-semibold block uppercase">E2B(R3) Valid</span>
              <span className="text-xl font-extrabold text-amber-950 font-mono">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 bg-orange-50/60 p-1.5 rounded-2xl border border-orange-200/80 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveAmcTab('intake')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeAmcTab === 'intake'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Regional Intake Queue ({cases.length})
        </button>
        <button
          onClick={() => setActiveAmcTab('meddra')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeAmcTab === 'meddra'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. MedDRA Coding Verification
        </button>
        <button
          onClick={() => setActiveAmcTab('e2br3')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeAmcTab === 'e2br3'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. ICSR E2B(R3) Gateway XML Transmitter
        </button>
        <button
          onClick={() => setActiveAmcTab('consensus')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeAmcTab === 'consensus'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          4. AMC Causality Consensus Panel
        </button>
      </div>

      {/* TAB 1: Intake Queue */}
      {activeAmcTab === 'intake' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white border border-orange-200/80 rounded-3xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-orange-100">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Incoming ICSRs from Community Nodes
                </span>
                <span className="text-[10px] bg-orange-100 text-orange-900 font-bold px-2 py-0.5 rounded-full">
                  Batch Synced
                </span>
              </div>

              <div className="space-y-2">
                {cases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedCaseId === c.id
                        ? 'border-orange-500 bg-orange-50/70 shadow-xs ring-1 ring-orange-400'
                        : 'border-slate-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{c.patientName}</span>
                      <span className="font-mono text-[10px] text-orange-900 bg-orange-100 px-1.5 py-0.2 rounded font-bold">
                        {c.id}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1 line-clamp-1">
                      {c.extractedSymptoms.join(', ')}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-100">
                      <span>Source: Apex Pharmacy (Rajesh Varma)</span>
                      <span className="font-bold text-orange-800">{c.urgencyLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Selected ICSR Case Review: {selectedCase.patientName} ({selectedCase.id})
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Patient Age: {selectedCase.patientAge}y · Polypharmacy Cohort
                  </p>
                </div>
                <button
                  onClick={() => onOpenPvpiModal(selectedCase)}
                  className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Official PvPI Form</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-200 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Suspect Drug</span>
                  <span className="font-bold text-slate-900">Augmentin 625 Duo</span>
                  <span className="text-[10px] text-orange-900 font-mono block">Batch: AX26-904 (Exp: 08/2027)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Reaction Onset</span>
                  <span className="font-bold text-slate-900">48h Post Initiation</span>
                  <span className="text-[10px] text-rose-700 block font-semibold">Angioedema + Rash</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Pharmacist Clinical Attestation</span>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  &ldquo;Patient presented with severe cutaneous erythema and upper lip edema 48h after Day 0 antibiotic initiation. Augmentin withheld. Referred to emergency chest OPD.&rdquo;
                </p>
              </div>

              <button
                onClick={() => setActiveAmcTab('e2br3')}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Validate &amp; Transmit E2B(R3) Record</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MedDRA Coding Workstation */}
      {activeAmcTab === 'meddra' && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
          <div className="pb-3 border-b border-orange-100">
            <h3 className="text-sm font-bold text-slate-900">
              MedDRA v27.0 Hierarchical Medical Coding Workstation
            </h3>
            <p className="text-slate-500 text-xs">
              Standardized mapping from patient regional verbatim expressions (Marathi/Hindi/English) to international regulatory terminology
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-50/70 border-b border-orange-200 text-orange-950 font-bold text-[11px]">
                  <th className="p-3">Patient Verbatim Input</th>
                  <th className="p-3">Lowest Level Term (LLT)</th>
                  <th className="p-3">Preferred Term (PT)</th>
                  <th className="p-3">System Organ Class (SOC)</th>
                  <th className="p-3">MedDRA Code</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 text-[11px]">
                <tr className="hover:bg-orange-50/30">
                  <td className="p-3 italic">&ldquo;ओठ सुजले&rdquo; (Lip swelling)</td>
                  <td className="p-3 font-medium">Lip swelling</td>
                  <td className="p-3 font-bold text-slate-900">Angioedema</td>
                  <td className="p-3 text-slate-600">Immune system disorders</td>
                  <td className="p-3 font-mono font-bold text-orange-900">10002424</td>
                  <td className="p-3 text-right">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Validated ✓</span>
                  </td>
                </tr>
                <tr className="hover:bg-orange-50/30">
                  <td className="p-3 italic">&ldquo;अंगावर लाल पुरळ&rdquo; (Red rash)</td>
                  <td className="p-3 font-medium">Erythematous rash</td>
                  <td className="p-3 font-bold text-slate-900">Rash erythematous</td>
                  <td className="p-3 text-slate-600">Skin &amp; subcutaneous tissue</td>
                  <td className="p-3 font-mono font-bold text-orange-900">10037844</td>
                  <td className="p-3 text-right">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Validated ✓</span>
                  </td>
                </tr>
                <tr className="hover:bg-orange-50/30">
                  <td className="p-3 italic">&ldquo;खाज येत आहे&rdquo; (Severe itching)</td>
                  <td className="p-3 font-medium">Severe itching</td>
                  <td className="p-3 font-bold text-slate-900">Pruritus</td>
                  <td className="p-3 text-slate-600">Skin &amp; subcutaneous tissue</td>
                  <td className="p-3 font-mono font-bold text-orange-900">10037087</td>
                  <td className="p-3 text-right">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Validated ✓</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ICSR E2B(R3) XML Transmitter */}
      {activeAmcTab === 'e2br3' && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-100">
            <div>
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  ICH ICSR E2B(R3) XML Compliance Gateway
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Official electronic transmission format compliant with CDSCO and PvPI Indian Pharmacopoeia Commission specifications
              </p>
            </div>

            <button
              onClick={handleTransmitE2BR3}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit to National Gateway</span>
            </button>
          </div>

          {transmissionSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 font-bold flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>ICSR E2B(R3) XML package transmitted successfully to NCC-PvPI (ACK Code: 01-ACK-2026-891).</span>
            </div>
          )}

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
              Generated ICH ICSR E2B(R3) Message Header &amp; Safety Payload:
            </span>
            <pre className="p-3 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-orange-950 overflow-x-auto max-h-56 leading-relaxed">
{`<?xml version="1.0" encoding="UTF-8"?>
<ichicsr lang="en">
  <ichicsrmessageheader>
    <messagetype>ichicsr</messagetype>
    <messageformatversion>2.1</messageformatversion>
    <messagesenderidentifier>AMC-MH-04-KEM-MUMBAI</messagesenderidentifier>
    <messagereceiveridentifier>NCC-PVPI-IPC-GHAZIABAD</messagereceiveridentifier>
    <messagedate>${new Date().toISOString()}</messagedate>
  </ichicsrmessageheader>
  <safetyreport>
    <safetyreportid>IN-NCCPVPI-2026-009182</safetyreportid>
    <primarysourcecountry>IN</primarysourcecountry>
    <occurcountry>IN</occurcountry>
    <patient>
      <patientinitial>RVK</patientinitial>
      <patientonsetage>68</patientonsetage>
      <patientonsetageunit>801</patientonsetageunit>
      <patientsex>1</patientsex>
      <reaction>
        <primarysourcereaction>Lip angioedema and erythematous rash</primarysourcereaction>
        <reactionmeddraversionpt>27.0</reactionmeddraversionpt>
        <reactionmeddrapt>Angioedema</reactionmeddrapt>
      </reaction>
      <drug>
        <drugcharacterization>1</drugcharacterization>
        <medicinalproduct>Augmentin 625 Duo (Amoxicillin + Clavulanate)</medicinalproduct>
        <drugbatchnumb>AX26-904</drugbatchnumb>
      </drug>
    </patient>
  </safetyreport>
</ichicsr>`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: Consensus Panel */}
      {activeAmcTab === 'consensus' && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
          <div className="pb-3 border-b border-orange-100">
            <h3 className="text-sm font-bold text-slate-900">
              Regional AMC Consensus Committee Review
            </h3>
            <p className="text-slate-500 text-xs">
              Multidisciplinary causality consensus by clinical pharmacologists and physicians
            </p>
          </div>

          <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-950 text-sm">Committee Consensus Vote</span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                Unanimous: Probable ADR
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Panel unanimously verified that the 48-hour latency, resolution upon drug cessation, positive dechallenge, and known beta-lactam hypersensitivity mechanism satisfy WHO-UMC criteria for <strong>Probable ADR</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
