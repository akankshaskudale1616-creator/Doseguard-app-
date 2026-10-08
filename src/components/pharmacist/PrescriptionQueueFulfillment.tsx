import React, { useState } from 'react';
import {
  ElectronicPrescription,
  DispenseStatus,
  RefillRequest,
} from '../../types/pv';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Send,
  User,
  Stethoscope,
  Building2,
  ChevronRight,
  Filter,
  Check,
  Package,
  RotateCw,
  Sparkles,
  ArrowRight,
  Pill,
} from 'lucide-react';

interface PrescriptionQueueFulfillmentProps {
  prescriptions: ElectronicPrescription[];
  onUpdateDispenseStatus: (id: string, status: DispenseStatus, notes?: string) => void;
  onVerifyPrescription: (
    id: string,
    verification: {
      allergyPassed: boolean;
      interactionPassed: boolean;
      dosagePassed: boolean;
      notes?: string;
    }
  ) => void;
  refillRequests: RefillRequest[];
  onUpdateRefillStatus: (id: string, status: RefillRequest['status']) => void;
}

export const PrescriptionQueueFulfillment: React.FC<PrescriptionQueueFulfillmentProps> = ({
  prescriptions,
  onUpdateDispenseStatus,
  onVerifyPrescription,
  refillRequests,
  onUpdateRefillStatus,
}) => {
  const [selectedRxId, setSelectedRxId] = useState<string>(
    prescriptions[0]?.id || ''
  );
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [pharmacistNoteText, setPharmacistNoteText] = useState<string>('');

  const selectedRx = prescriptions.find((p) => p.id === selectedRxId) || prescriptions[0];

  const filteredPrescriptions = prescriptions.filter((p) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return p.dispenseStatus === 'Pending';
    if (filterStatus === 'processing') return p.dispenseStatus === 'Processing';
    if (filterStatus === 'ready') return p.dispenseStatus === 'Ready for Pickup/Delivery';
    if (filterStatus === 'completed') return p.dispenseStatus === 'Completed';
    return true;
  });

  const getStatusBadge = (status: DispenseStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Processing':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'Ready for Pickup/Delivery':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metric summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Pending e-Rx</span>
            <span className="text-xl font-mono font-black text-amber-900">
              {prescriptions.filter((p) => p.dispenseStatus === 'Pending').length}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">In Processing</span>
            <span className="text-xl font-mono font-black text-sky-900">
              {prescriptions.filter((p) => p.dispenseStatus === 'Processing').length}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Ready for Pickup</span>
            <span className="text-xl font-mono font-black text-purple-900">
              {prescriptions.filter((p) => p.dispenseStatus === 'Ready for Pickup/Delivery').length}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Refill Requests</span>
            <span className="text-xl font-mono font-black text-rose-900">
              {refillRequests.filter((r) => r.status === 'Pending').length}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <RotateCw className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Prescription Queue (35%) + Right Dispensing Workspace (65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: e-Rx List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Electronic Rx Queue ({filteredPrescriptions.length})
                </h3>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2 py-0.5 rounded ${
                    filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-2 py-0.5 rounded ${
                    filterStatus === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilterStatus('processing')}
                  className={`px-2 py-0.5 rounded ${
                    filterStatus === 'processing' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Process
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto">
              {filteredPrescriptions.map((rx) => {
                const isSelected = selectedRx?.id === rx.id;
                return (
                  <div
                    key={rx.id}
                    onClick={() => {
                      setSelectedRxId(rx.id);
                      setPharmacistNoteText(rx.pharmacistNotes || '');
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-orange-50/70 border-orange-400 ring-1 ring-orange-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{rx.patientName}</span>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {rx.patientId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Prescribed by: {rx.prescriberName}
                        </p>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(rx.dispenseStatus)}`}>
                        {rx.dispenseStatus}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-700 bg-white/80 p-2 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-900 block truncate">
                        {rx.medications.map((m) => `${m.brandName} (${m.strength})`).join(', ')}
                      </span>
                      <span className="text-[11px] text-slate-500">{rx.diagnosis}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{rx.date}</span>
                      <span className="font-mono text-orange-800 font-bold">
                        {rx.medications.length} Item{rx.medications.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Patient Refill Requests Queue Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Patient Refill Authorization Queue ({refillRequests.length})
                </h3>
              </div>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                1-Click Refills
              </span>
            </div>

            <div className="space-y-2">
              {refillRequests.map((req) => (
                <div key={req.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{req.patientName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : req.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{req.medicineName} · {req.dosage}</p>
                  <p className="text-[11px] text-slate-500 italic">{req.notes}</p>
                  
                  {req.status === 'Pending' && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onUpdateRefillStatus(req.id, 'Approved')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-all flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Authorize Refill</span>
                      </button>
                      <button
                        onClick={() => onUpdateRefillStatus(req.id, 'Declined')}
                        className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg text-[11px]"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Full e-Rx Verification & Dispense Console */}
        <div className="lg:col-span-7 space-y-4">
          {selectedRx ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Rx Title Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-orange-900 bg-orange-100 px-2.5 py-0.5 rounded-lg border border-orange-200">
                      {selectedRx.id}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{selectedRx.date}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {selectedRx.diagnosis}
                  </h3>
                </div>

                {/* Live Dispense Status Toggles */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Update Dispense Status:
                  </span>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {(['Pending', 'Processing', 'Ready for Pickup/Delivery', 'Completed'] as DispenseStatus[]).map(
                      (st) => {
                        const isCurrent = selectedRx.dispenseStatus === st;
                        return (
                          <button
                            key={st}
                            onClick={() => onUpdateDispenseStatus(selectedRx.id, st, pharmacistNoteText)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              isCurrent
                                ? st === 'Pending'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : st === 'Processing'
                                  ? 'bg-sky-600 text-white shadow-xs'
                                  : st === 'Ready for Pickup/Delivery'
                                  ? 'bg-purple-600 text-white shadow-xs'
                                  : 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {st === 'Ready for Pickup/Delivery' ? 'Ready' : st}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              {/* Patient & Prescriber Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Information</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedRx.patientName}</span>
                  <p className="text-slate-600">
                    Age: {selectedRx.patientAge} yrs · {selectedRx.patientGender} · ID: {selectedRx.patientId}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Prescriber</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedRx.prescriberName}</span>
                  <p className="text-slate-600 truncate">{selectedRx.hospital}</p>
                  <p className="text-[11px] font-mono text-slate-400">Reg: {selectedRx.prescriberRegistration}</p>
                </div>
              </div>

              {/* Prescribed Items Table */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                  Prescribed Medications ({selectedRx.medications.length})
                </span>

                <div className="space-y-3">
                  {selectedRx.medications.map((med, idx) => (
                    <div key={med.id || idx} className="p-4 bg-orange-50/40 rounded-2xl border border-orange-200 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{med.brandName}</span>
                            <span className="text-xs font-mono font-bold text-orange-900 bg-orange-100 px-2 py-0.5 rounded">
                              {med.strength}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium mt-0.5">
                            Generic: {med.genericName} · Form: {med.dosageForm}
                          </p>
                        </div>
                        <span className="text-xs font-bold bg-white text-slate-800 px-2.5 py-1 rounded-xl border border-slate-200">
                          {med.frequency}
                        </span>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-orange-100 text-xs text-slate-700">
                        <span className="font-semibold text-slate-900">Instructions: </span>
                        {med.instructions}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Duration: {med.durationDays} days · Route: {med.route}</span>
                        <span>Refills Allowed: {med.refills}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Verification Checkpoints */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Pharmacist Digital Verification Checkpoints
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Check 1: Allergy */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Patient Allergy Check</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${selectedRx.allergyCheckPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {selectedRx.allergyCheckPassed ? 'PASSED' : 'FLAGGED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {selectedRx.allergyNotes || 'Checked against active allergy register.'}
                    </p>
                  </div>

                  {/* Check 2: Drug Interaction */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Drug Interactions</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${selectedRx.interactionCheckPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {selectedRx.interactionCheckPassed ? 'PASSED' : 'CAUTION'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {selectedRx.interactionNotes || 'No dangerous kinetic or dynamic conflicts.'}
                    </p>
                  </div>

                  {/* Check 3: Dosage & Renal */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Dosage Verification</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${selectedRx.dosageVerificationPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {selectedRx.dosageVerificationPassed ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {selectedRx.dosageNotes || 'Dose verified within therapeutic range.'}
                    </p>
                  </div>
                </div>

                {/* Pharmacist Consultation & Dispense Sign-off */}
                <div className="pt-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Pharmacist Consultation Notes & Dispensing Record:
                  </label>
                  <textarea
                    rows={2}
                    value={pharmacistNoteText}
                    onChange={(e) => setPharmacistNoteText(e.target.value)}
                    placeholder="Add batch notes, patient counseling remarks, or storage instructions..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Dispensing Pharmacy: {selectedRx.pharmacyName}
                    </span>
                    <button
                      onClick={() => {
                        onVerifyPrescription(selectedRx.id, {
                          allergyPassed: true,
                          interactionPassed: true,
                          dosagePassed: true,
                          notes: pharmacistNoteText,
                        });
                        onUpdateDispenseStatus(selectedRx.id, 'Processing', pharmacistNoteText);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Begin Processing</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
              Select an electronic prescription to view fulfillment details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
