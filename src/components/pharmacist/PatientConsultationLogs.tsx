import React, { useState } from 'react';
import {
  PharmacistConsultationLog,
  Medicine,
  RefillRequest,
} from '../../types/pv';
import {
  FileText,
  User,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  RotateCw,
  Send,
  Pill,
} from 'lucide-react';

interface PatientConsultationLogsProps {
  consultationLogs: PharmacistConsultationLog[];
  onAddConsultationLog: (log: PharmacistConsultationLog) => void;
  medicines: Medicine[];
  refillRequests: RefillRequest[];
  onUpdateRefillStatus: (id: string, status: RefillRequest['status']) => void;
}

export const PatientConsultationLogs: React.FC<PatientConsultationLogsProps> = ({
  consultationLogs,
  onAddConsultationLog,
  medicines,
  refillRequests,
  onUpdateRefillStatus,
}) => {
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('ADR Counseling & Withholding Protocol');
  const [newLogNotes, setNewLogNotes] = useState<string>('');
  const [refillAuthorized, setRefillAuthorized] = useState<boolean>(true);
  const [patientNameInput, setPatientNameInput] = useState<string>('Ramesh V. Kulkarni (PAT-6801)');

  const handleSubmitNewLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNotes.trim()) return;

    const newLog: PharmacistConsultationLog = {
      id: `CON-2026-${Date.now().toString().slice(-3)}`,
      patientId: 'PAT-6801',
      patientName: patientNameInput,
      date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      pharmacistName: 'Vinayak Joshi, R.Ph.',
      topicsCovered: [selectedTopic],
      notes: newLogNotes,
      refillAuthorized,
      nextFollowUp: 'In 7 days',
    };

    onAddConsultationLog(newLog);
    setNewLogNotes('');
    setIsAddingLog(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Patient Interaction & Clinical Counseling Logs</h3>
            <p className="text-xs text-slate-500">
              Document patient telephonic/in-person counseling, medication history reviews, and refill authorizations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddingLog(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Consultation Note</span>
        </button>
      </div>

      {/* Main Grid: Active Patient Medication History + Consultation Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Patient Meds (40%) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Patient Medication Profile
                </h4>
              </div>
              <span className="text-[10px] font-mono bg-orange-100 text-orange-900 px-2 py-0.5 rounded-full font-bold">
                PAT-6801 (68 yrs)
              </span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
              {medicines.map((med) => (
                <div
                  key={med.id}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    med.isSuspected
                      ? 'bg-rose-50 border-rose-300'
                      : med.status === 'stopped'
                      ? 'bg-slate-100 border-slate-200 opacity-60'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-slate-900">{med.brandName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                      med.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {med.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{med.genericName} · {med.strength}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-200/60">
                    <span>{med.frequency}</span>
                    <span className="font-mono">Prescribed: {med.startDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Consultation History & Modal */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-orange-600" />
              Recorded Clinical Counseling History ({consultationLogs.length})
            </h4>

            <div className="space-y-3">
              {consultationLogs.map((log) => (
                <div key={log.id} className="p-4 bg-orange-50/40 rounded-2xl border border-orange-200 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{log.patientName}</span>
                        <span className="text-[10px] font-mono bg-white text-slate-600 px-2 py-0.5 rounded border border-orange-200">
                          {log.date}
                        </span>
                      </div>
                      <p className="text-xs text-orange-950 font-semibold mt-0.5">
                        Pharmacist: {log.pharmacistName}
                      </p>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      log.refillAuthorized
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border-rose-300'
                    }`}>
                      {log.refillAuthorized ? 'Refill Authorized' : 'Refill Withheld / Deferred'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {log.topicsCovered.map((topic, i) => (
                      <span key={i} className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-700 bg-white/90 p-3 rounded-xl border border-orange-100 leading-relaxed">
                    {log.notes}
                  </p>

                  {log.nextFollowUp && (
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Next Follow-up Planned: {log.nextFollowUp}</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Log Signed by R.Ph.
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Consultation Log Modal */}
      {isAddingLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                Add Pharmacist Consultation & Refill Record
              </h4>
              <button
                onClick={() => setIsAddingLog(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewLog} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Patient:</label>
                <input
                  type="text"
                  value={patientNameInput}
                  onChange={(e) => setPatientNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Primary Counseling Topic:</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="ADR Counseling & Withholding Protocol">ADR Counseling & Withholding Protocol</option>
                  <option value="Polypharmacy Adherence & Timing">Polypharmacy Adherence & Timing</option>
                  <option value="Refill Authorization & Supply Review">Refill Authorization & Supply Review</option>
                  <option value="Diabetic & Renal Medication Monitoring">Diabetic & Renal Medication Monitoring</option>
                  <option value="Over-the-Counter Interaction Warning">Over-the-Counter Interaction Warning</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Clinical Counseling Notes:</label>
                <textarea
                  rows={4}
                  value={newLogNotes}
                  onChange={(e) => setNewLogNotes(e.target.value)}
                  placeholder="Record summary of patient conversation, instructions given, red-flags discussed..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="refillAuth"
                  checked={refillAuthorized}
                  onChange={(e) => setRefillAuthorized(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-400"
                />
                <label htmlFor="refillAuth" className="text-xs font-bold text-slate-900 cursor-pointer">
                  Authorize monthly refill batch for stable medications
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingLog(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20"
                >
                  Save Consultation Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
