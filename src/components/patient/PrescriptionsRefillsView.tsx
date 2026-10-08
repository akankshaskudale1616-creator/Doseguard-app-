import React, { useState } from 'react';
import { Medicine, RefillRequest, ElectronicPrescription } from '../../types/pv';
import {
  FileText,
  RotateCw,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  Sun,
  Sunrise,
  Moon,
  AlertTriangle,
  Pill,
  ExternalLink,
  ShieldCheck,
  Building2,
  User,
} from 'lucide-react';

interface PrescriptionsRefillsViewProps {
  medicines: Medicine[];
  onRequestRefill: (req: RefillRequest) => void;
  ePrescriptions: ElectronicPrescription[];
}

export const PrescriptionsRefillsView: React.FC<PrescriptionsRefillsViewProps> = ({
  medicines,
  onRequestRefill,
  ePrescriptions,
}) => {
  const [refillSuccessMessage, setRefillSuccessMessage] = useState<string | null>(null);
  const [isRxPdfOpen, setIsRxPdfOpen] = useState(false);
  const [selectedRxForPdf, setSelectedRxForPdf] = useState<ElectronicPrescription | null>(
    ePrescriptions[0] || null
  );

  const handleRefillClick = (med: Medicine) => {
    const newReq: RefillRequest = {
      id: `REF-2026-${Date.now().toString().slice(-3)}`,
      patientId: 'PAT-6801',
      patientName: 'Ramesh V. Kulkarni',
      medicineName: `${med.brandName} (${med.genericName})`,
      dosage: med.strength,
      requestedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      status: 'Pending',
      notes: `One-click refill requested by patient for 30-day course.`,
    };
    onRequestRefill(newReq);
    setRefillSuccessMessage(`Refill request for ${med.brandName} dispatched directly to City Hospital Pharmacy!`);
    setTimeout(() => setRefillSuccessMessage(null), 4000);
  };

  // Helper to determine dosage schedule icons
  const getScheduleBreakdown = (freq: string) => {
    const lower = freq.toLowerCase();
    const morning = lower.includes('morning') || lower.includes('bid') || lower.includes('tid') || lower.includes('breakfast');
    const afternoon = lower.includes('afternoon') || lower.includes('lunch') || lower.includes('tid');
    const night = lower.includes('night') || lower.includes('bedtime') || lower.includes('dinner') || lower.includes('bid') || lower.includes('tid');
    return { morning, afternoon, night };
  };

  return (
    <div className="space-y-6">
      {/* Refill Success Alert Banner */}
      {refillSuccessMessage && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-900 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold">{refillSuccessMessage}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
            Live Queue Updated
          </span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-sky-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200 uppercase">
              Digital Dispensary
            </span>
            <span className="text-xs text-slate-500 font-mono">Patient Portal PAT-6801</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">
            My Prescriptions & Direct Pharmacy Refills
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            View active medication dosage schedules across morning, afternoon, and night, request instant refills, and download official PDF prescriptions.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedRxForPdf(ePrescriptions[0] || null);
            setIsRxPdfOpen(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>View / Download Digital Rx (PDF)</span>
        </button>
      </div>

      {/* Active Medications List with Morning, Afternoon, Night Schedule */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Pill className="w-4 h-4 text-sky-600" />
            Active Medications & Daily Timing Schedule ({medicines.filter((m) => m.status === 'active').length})
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">
            Tap 'Request Refill' for one-click pharmacy dispatch
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medicines.map((med) => {
            const sched = getScheduleBreakdown(med.frequency);
            const isStopped = med.status === 'stopped';

            return (
              <div
                key={med.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  med.isSuspected
                    ? 'bg-rose-50/60 border-rose-300'
                    : isStopped
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{med.brandName}</span>
                      <span className="text-xs font-mono font-bold bg-sky-100 text-sky-900 px-2 py-0.2 rounded">
                        {med.strength}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{med.genericName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">Prescriber: {med.prescriber}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      med.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : med.status === 'stopped'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {med.status.toUpperCase()}
                  </span>
                </div>

                {/* Dosage Schedule Badges (Morning, Afternoon, Night) */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                    Daily Timing Schedule:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className={`p-2 rounded-lg text-center flex flex-col items-center justify-center gap-1 border ${
                        sched.morning
                          ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold'
                          : 'bg-white border-slate-100 text-slate-300'
                      }`}
                    >
                      <Sunrise className="w-4 h-4 text-amber-500" />
                      <span className="text-[10px]">Morning 🌅</span>
                    </div>

                    <div
                      className={`p-2 rounded-lg text-center flex flex-col items-center justify-center gap-1 border ${
                        sched.afternoon
                          ? 'bg-orange-50 border-orange-200 text-orange-900 font-bold'
                          : 'bg-white border-slate-100 text-slate-300'
                      }`}
                    >
                      <Sun className="w-4 h-4 text-orange-500" />
                      <span className="text-[10px]">Afternoon ☀️</span>
                    </div>

                    <div
                      className={`p-2 rounded-lg text-center flex flex-col items-center justify-center gap-1 border ${
                        sched.night
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold'
                          : 'bg-white border-slate-100 text-slate-300'
                      }`}
                    >
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <span className="text-[10px]">Night 🌙</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 italic pt-1">{med.frequency}</p>
                </div>

                {/* Actions & Refill Trigger */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Batch: {med.batchNumber || 'BX-Verified'}
                  </span>

                  {!isStopped ? (
                    <button
                      onClick={() => handleRefillClick(med)}
                      className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold border border-sky-300 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-sky-600" />
                      <span>Request Refill</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Stopped due to ADR
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Digital Prescription PDF Modal */}
      {isRxPdfOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header / Modal controls */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Digital Prescription Document (Official e-Rx Copy)
                </h4>
              </div>
              <button
                onClick={() => setIsRxPdfOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Simulated Hospital Letterhead & Prescription Sheet */}
            <div className="p-6 bg-slate-50 border-2 border-slate-300 rounded-2xl space-y-4 font-sans text-xs text-slate-800">
              {/* Letterhead */}
              <div className="flex items-start justify-between border-b-2 border-slate-300 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">
                    City Central Hospital & Sassoon Medical Centre
                  </h3>
                  <p className="text-slate-600 text-[11px]">
                    Department of Internal Medicine & Clinical Pharmacovigilance
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    Pune, Maharashtra 411001 · Phone: +91 20 2612 8000
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-300 block">
                    e-Rx: {selectedRxForPdf?.id || 'ERX-2026-901'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Date: {selectedRxForPdf?.date || '2026-10-06'}
                  </span>
                </div>
              </div>

              {/* Patient & Doctor Box */}
              <div className="grid grid-cols-2 gap-4 py-2 border-b border-slate-200 text-xs">
                <div>
                  <p><strong>Patient Name:</strong> Ramesh V. Kulkarni</p>
                  <p><strong>Age / Gender:</strong> 68 Yrs / Male</p>
                  <p><strong>Patient ID:</strong> PAT-6801</p>
                  <p><strong>Primary Diagnosis:</strong> {selectedRxForPdf?.diagnosis || 'Acute Bronchitis with Penicillin Cutaneous ADR'}</p>
                </div>
                <div>
                  <p><strong>Consultant Physician:</strong> {selectedRxForPdf?.prescriberName || 'Dr. Ananya Deshmukh, MD'}</p>
                  <p><strong>Registration No:</strong> {selectedRxForPdf?.prescriberRegistration || 'MCI-2009-4821'}</p>
                  <p><strong>Designation:</strong> Consultant Chest Physician</p>
                </div>
              </div>

              {/* Rx Symbol & Medication Items */}
              <div className="space-y-3 pt-2">
                <span className="text-2xl font-serif font-black text-slate-900">℞</span>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 text-slate-600 font-bold uppercase text-[10px]">
                      <th className="py-2">Item</th>
                      <th className="py-2">Strength & Form</th>
                      <th className="py-2">Frequency</th>
                      <th className="py-2">Duration</th>
                      <th className="py-2">Refills</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedRxForPdf?.medications.map((m, i) => (
                      <tr key={i} className="py-2">
                        <td className="py-2 font-bold text-slate-900">{m.brandName} ({m.genericName})</td>
                        <td className="py-2">{m.strength} {m.dosageForm}</td>
                        <td className="py-2 font-semibold text-sky-800">{m.frequency}</td>
                        <td className="py-2">{m.durationDays} Days</td>
                        <td className="py-2">{m.refills}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Physician Signature & Barcode */}
              <div className="pt-6 flex items-end justify-between border-t border-slate-300">
                <div className="space-y-1">
                  <div className="h-6 w-36 bg-slate-300/80 rounded flex items-center justify-center font-mono text-[9px] text-slate-600 tracking-widest">
                    |||||||| ||||||||||
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Digitally Verified via DoseGuard EHR Gateway
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-serif italic text-slate-800 font-bold text-sm">
                    Dr. Ananya Deshmukh, MD
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Digital Signature Verified · Sassoon Hospital
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Format: Compliant with Indian Medical Council (Professional Conduct) Regulations
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Prescription</span>
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(selectedRxForPdf, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Prescription_${selectedRxForPdf?.id || 'ERX-PAT6801'}.json`;
                    a.click();
                  }}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Digital Record</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
