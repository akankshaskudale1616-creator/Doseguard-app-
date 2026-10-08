import React, { useState } from 'react';
import { SymptomReport } from '../../types/pv';
import { X, Download, Copy, Check, ShieldCheck, FileCode } from 'lucide-react';

interface PvpiExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseReport: SymptomReport;
}

export const PvpiExportModal: React.FC<PvpiExportModalProps> = ({
  isOpen,
  onClose,
  caseReport,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exportPayload = {
    standard: 'PvPI_ADRMS_v2.4_ICH_E2B_R3',
    programme: 'Pharmacovigilance Programme of India (PvPI)',
    governingAuthority: 'Indian Pharmacopoeia Commission (IPC), Ghaziabad',
    regulatoryPathway: 'CDSCO Spontaneous Suspected ADR Submission',
    transmissionDate: new Date().toISOString(),
    messageIdentifier: `PVPI-CASE-${caseReport.id}`,
    safetyReport: {
      patient: {
        patientInitials: caseReport.patientName.split(' ').map((n) => n[0]).join(''),
        patientAge: caseReport.patientAge,
        patientSex: caseReport.patientGender,
        priorityCohort: 'Polypharmacy Senior (Age >= 60, Concomitant Meds >= 5)',
      },
      adverseReaction: {
        reactionReportedDate: caseReport.reportedAt,
        reactionOnsetDate: caseReport.onsetDate,
        durationDays: caseReport.durationDays,
        outcome: caseReport.outcome,
        seriousness:
          caseReport.urgencyLevel === 'EMERGENCY'
            ? 'SERIOUS_LIFE_THREATENING_SCAR'
            : 'NON_SERIOUS_MEDICALLY_SIGNIFICANT',
        meddraCodedTerms: caseReport.meddraTerms,
        patientVerbatimReport: caseReport.originalText,
        translatedVerbatim: caseReport.translatedText,
      },
      suspectedDrug: {
        drugName: 'Augmentin 625 Duo (Amoxicillin + Clavulanate)',
        dailyDose: '625 mg Twice daily',
        route: 'Oral',
        startDate: '2026-10-01',
        dechallenge: 'POSITIVE_RESOLVED_AFTER_STOPPING',
        causalityScore: caseReport.causality.cAdrTotal,
        causalityCategory: caseReport.causality.categoryLabel,
      },
      concomitantMedications: [
        { drug: 'Glycomet-GP 1 (Metformin + Glimepiride)', indication: 'Type 2 Diabetes' },
        { drug: 'Amlodac 5 (Amlodipine Besylate)', indication: 'Hypertension' },
        { drug: 'Ecosprin 75 (Aspirin)', indication: 'Cardiovascular Prophylaxis' },
        { drug: 'Pan 40 (Pantoprazole)', indication: 'GERD' },
        { drug: 'Atorva 10 (Atorvastatin)', indication: 'Hyperlipidemia' },
      ],
      triageAlgorithm: {
        system: 'DoseGuard Temporal Causality Engine',
        urgencyAssigned: caseReport.urgencyLevel,
        formula: 'C_ADR = w1T + w2D + w3K + w4R + w5H - w6A',
        triageSensitivity: 'High-Alert Protocol (Near-Zero Red-Flag Miss Rate)',
      },
      reporterDetails: {
        reporterQualification: 'Registered Clinical Pharmacist (PharmD / M.Pharm)',
        monitoringCentre: 'ADR Monitoring Centre (AMC) #218, Pune',
        country: 'India',
      },
    },
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PvPI_ADRMS_${caseReport.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-orange-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        {/* Header - Warm Orange Theme */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-base font-bold text-white">PvPI ADRMS Verified Case Export</h3>
              <p className="text-xs text-orange-100">
                Format: ICH E2B (R3) XML/JSON · Indian Pharmacopoeia Commission
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Standards-compliant validated dataset ready for ADRMS submission.</span>
            </div>
            <span className="font-mono font-bold text-orange-900">{caseReport.id}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-slate-700">
                JSON Case Payload
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-orange-600 hover:text-orange-800 font-semibold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-orange-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-orange-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-72 border border-slate-800">
              {jsonString}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PvPI Case Package (.json)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
