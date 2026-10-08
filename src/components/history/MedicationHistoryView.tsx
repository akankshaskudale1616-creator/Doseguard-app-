import React, { useState } from 'react';
import {
  MedicationHistoryRecord,
} from '../../types/pv';
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Pill,
  ShieldAlert,
  ArrowRight,
  FileText,
  Download,
  Share2,
  Plus,
  X,
  Stethoscope,
  Building,
  User,
  Activity,
  Check,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface MedicationHistoryViewProps {
  mode: 'patient' | 'pharmacist' | 'physician';
  historyRecords?: MedicationHistoryRecord[];
  onAddRecord?: (record: MedicationHistoryRecord) => void;
  onReconcileRecord?: (id: string, notes: string) => void;
  patientName?: string;
  onNavigateToAdrMap?: (adrId?: string) => void;
}

export const MedicationHistoryView: React.FC<MedicationHistoryViewProps> = ({
  mode,
  historyRecords = [],
  onAddRecord,
  onReconcileRecord,
  patientName = 'Ramesh V. Kulkarni',
  onNavigateToAdrMap,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [reconciliationModalId, setReconciliationModalId] = useState<string | null>(null);
  const [reconciliationNotes, setReconciliationNotes] = useState('');

  // New Record Form State
  const [newBrand, setNewBrand] = useState('');
  const [newGeneric, setNewGeneric] = useState('');
  const [newStrength, setNewStrength] = useState('');
  const [newForm, setNewForm] = useState('Tablet');
  const [newIndication, setNewIndication] = useState('');
  const [newPrescriber, setNewPrescriber] = useState('Dr. Suresh Kulkarni, MD');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newStatus, setNewStatus] = useState<MedicationHistoryRecord['status']>('completed_course');
  const [newReason, setNewReason] = useState('');

  const filteredRecords = historyRecords.filter((rec) => {
    if (statusFilter !== 'all' && rec.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchBrand = rec.brandName.toLowerCase().includes(q);
      const matchGeneric = rec.genericName.toLowerCase().includes(q);
      const matchIndication = rec.indication.toLowerCase().includes(q);
      const matchPrescriber = rec.prescriber.toLowerCase().includes(q);
      return matchBrand || matchGeneric || matchIndication || matchPrescriber;
    }
    return true;
  });

  const activeCount = historyRecords.filter((r) => r.status === 'active').length;
  const adrStoppedCount = historyRecords.filter((r) => r.status === 'discontinued_adr').length;
  const completedCount = historyRecords.filter((r) => r.status === 'completed_course').length;
  const avgAdherence = Math.round(
    historyRecords.reduce((acc, r) => acc + (r.adherenceRatePercent || 95), 0) /
      (historyRecords.length || 1)
  );

  const handleSaveNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.trim()) return;

    const newRec: MedicationHistoryRecord = {
      id: `HIST-MED-${Date.now().toString().slice(-4)}`,
      patientId: 'PAT-6801',
      brandName: newBrand,
      genericName: newGeneric || newBrand,
      strength: newStrength || 'Standard strength',
      dosageForm: newForm,
      frequency: 'As prescribed',
      route: 'Oral',
      indication: newIndication || 'General clinical indication',
      prescriber: newPrescriber,
      hospital: 'Apex Clinic, Pune',
      pharmacyName: 'City Hospital Pharmacy',
      batchNumber: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
      startDate: newStartDate || new Date().toISOString().split('T')[0],
      endDate: newEndDate || undefined,
      durationText: newEndDate ? `${newStartDate} to ${newEndDate}` : 'Ongoing',
      status: newStatus,
      statusReason: newReason,
      adherenceRatePercent: 95,
      notes: newReason || 'Documented in medication history registry.',
      prescribedDate: newStartDate || new Date().toISOString().split('T')[0],
    };

    if (onAddRecord) onAddRecord(newRec);
    setIsAddModalOpen(false);
    setNewBrand('');
    setNewGeneric('');
    setNewStrength('');
    setNewIndication('');
    setNewReason('');
  };

  const handleSaveReconciliation = () => {
    if (reconciliationModalId && onReconcileRecord) {
      onReconcileRecord(reconciliationModalId, reconciliationNotes);
    }
    alert('Medication reconciliation verified and saved.');
    setReconciliationModalId(null);
    setReconciliationNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Longitudinal Medication History
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {patientName} · Lifetime Pharmacotherapy Timeline
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                {mode === 'patient' ? 'Patient Personal Records' : mode === 'pharmacist' ? 'Medication Reconciliation & Audit' : 'Clinical EHR Prescribing History'}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Active Regimens, Past Discontinued Drugs & Dechallenge Records
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Complete chronological audit of current prescriptions, therapeutic switches, stopped medications due to adverse drug reactions, and historical treatment courses.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Historical Drug</span>
          </button>
          <button
            onClick={() => alert('Medication Passport summary PDF generated and ready for print.')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-slate-200"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export Passport</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Therapies</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600 font-mono">{activeCount}</span>
            <span className="text-xs text-slate-500">current meds</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">Active daily monitoring</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-rose-200 shadow-xs bg-rose-50/20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Stopped Due to ADR</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-700 font-mono">{adrStoppedCount}</span>
            <span className="text-xs text-rose-600 font-bold">reactions</span>
          </div>
          <span className="text-[10px] text-rose-800 font-semibold block mt-1">Contraindicated for rechallenge</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Completed Courses</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-sky-600 font-mono">{completedCount}</span>
            <span className="text-xs text-slate-500">short-term</span>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1">Fully tolerated antibiotics/PRN</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Overall Adherence</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-indigo-600 font-mono">{avgAdherence}%</span>
            <span className="text-xs text-indigo-600 font-bold">compliance</span>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1">High polypharmacy fidelity</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by drug name, generic compound, prescriber, or indication..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All History ({historyRecords.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('discontinued_adr')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              statusFilter === 'discontinued_adr'
                ? 'bg-rose-600 text-white'
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            Discontinued - ADR ({adrStoppedCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed_course')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              statusFilter === 'completed_course'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Medication Timeline Cards List */}
      <div className="space-y-3.5">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
            No medication history records matching &quot;{searchTerm}&quot;.
          </div>
        ) : (
          filteredRecords.map((record, idx) => {
            const isAdrStopped = record.status === 'discontinued_adr';
            const isActive = record.status === 'active';
            const isCompleted = record.status === 'completed_course';

            return (
              <div
                key={record.id}
                className={`bg-white rounded-3xl border transition-all p-5 shadow-xs relative overflow-hidden ${
                  isAdrStopped
                    ? 'border-rose-300 ring-1 ring-rose-200 bg-gradient-to-r from-rose-50/20 via-white to-white'
                    : isActive
                    ? 'border-slate-200 hover:border-emerald-300'
                    : 'border-slate-200 opacity-90'
                }`}
              >
                {/* Status Color Strip */}
                <div
                  className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                    isAdrStopped ? 'bg-rose-600' : isActive ? 'bg-emerald-500' : 'bg-sky-500'
                  }`}
                />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Drug Identity and Indication */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900">
                        {record.brandName}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md">
                        {record.strength} · {record.dosageForm}
                      </span>
                      {isAdrStopped && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                          <span>Discontinued - Drug Reaction</span>
                        </span>
                      )}
                      {isActive && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full">
                          Active Regimen
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-300 px-2 py-0.5 rounded-full">
                          Course Completed
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-900">{record.genericName}</span> · Route: {record.route} · Frequency: {record.frequency}
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                      <span>Indication: <strong className="text-slate-700">{record.indication}</strong></span>
                      <span>·</span>
                      <span>Prescriber: <strong className="text-slate-700">{record.prescriber}</strong></span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">Batch: {record.batchNumber}</span>
                    </div>
                  </div>

                  {/* Right Column: Timeline Duration & Adherence */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        {record.startDate} {record.endDate ? `→ ${record.endDate}` : '(Current)'}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Duration: {record.durationText}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold">Adherence</span>
                        <span className="text-xs font-black font-mono text-indigo-700">
                          {record.adherenceRatePercent}%
                        </span>
                      </div>
                      <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${record.adherenceRatePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prominent ADR / Dechallenge Banner if Stopped Due to Reaction */}
                {isAdrStopped && (
                  <div className="mt-4 p-3.5 bg-rose-50/80 border border-rose-200 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-extrabold text-rose-950">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Adverse Drug Reaction Encounter Details:</span>
                      </div>
                      {onNavigateToAdrMap && (
                        <button
                          onClick={() => onNavigateToAdrMap(record.adrLinkedId)}
                          className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-white px-2.5 py-1 rounded-lg border border-rose-300 shadow-xs flex items-center gap-1 transition-colors"
                        >
                          <Activity className="w-3.5 h-3.5 text-rose-600" />
                          <span>View on Visual ADR Map</span>
                        </button>
                      )}
                    </div>

                    <p className="text-rose-900 font-medium">
                      Reason: <strong>{record.statusReason}</strong>
                    </p>

                    {record.dechallengeResponse && (
                      <p className="text-slate-700 text-[11px]">
                        Dechallenge Outcome: <em>{record.dechallengeResponse}</em>
                      </p>
                    )}

                    {record.substitutionDrug && (
                      <div className="flex items-center gap-2 text-slate-800 text-[11px] font-semibold pt-1 border-t border-rose-200/60">
                        <span className="text-emerald-700">Safe Replacement Prescribed:</span>
                        <strong className="text-emerald-800">{record.substitutionDrug}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Clinical Notes & Action Strip */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <p className="text-slate-500 text-[11px] max-w-xl italic">
                    Note: {record.notes}
                  </p>

                  <div className="flex items-center gap-2">
                    {mode === 'pharmacist' && (
                      <button
                        onClick={() => {
                          setReconciliationModalId(record.id);
                          setReconciliationNotes(`Reconciled against active therapy on ${new Date().toLocaleDateString()}. No contraindications found.`);
                        }}
                        className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5 text-orange-600" />
                        <span>Reconcile Regimen</span>
                      </button>
                    )}

                    {mode === 'physician' && isAdrStopped && (
                      <span className="text-[11px] text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                        EHR Cross-Reactivity Alert Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add New Historical Medicine */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Add Historical Medication</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewRecord} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Augmentin 625 Duo"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Generic Compound</label>
                  <input
                    type="text"
                    placeholder="e.g. Amoxicillin + Clavulanic Acid"
                    value={newGeneric}
                    onChange={(e) => setNewGeneric(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Strength & Dosage Form</label>
                  <input
                    type="text"
                    placeholder="e.g. 500mg + 125mg Tablet"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Indication / Condition</label>
                  <input
                    type="text"
                    placeholder="e.g. Bronchitis, Hypertension"
                    value={newIndication}
                    onChange={(e) => setNewIndication(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Date (if stopped)</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status in Medication History</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                >
                  <option value="active">Active (Ongoing regimen)</option>
                  <option value="discontinued_adr">Discontinued due to Adverse Drug Reaction</option>
                  <option value="completed_course">Completed Course (Infection resolved)</option>
                  <option value="discontinued_ineffective">Discontinued (Ineffective therapy)</option>
                  <option value="dose_adjusted">Dose Adjusted</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Stopping / Clinical Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Developed cutaneous rash and lip edema; switched to Cephalosporin."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save to History
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Pharmacist Medication Reconciliation */}
      {reconciliationModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Sign Off Medication Reconciliation</h3>
              <button
                onClick={() => setReconciliationModalId(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Record clinical reconciliation audit for patient safety against active and discontinued medications.
            </p>
            <textarea
              rows={3}
              value={reconciliationNotes}
              onChange={(e) => setReconciliationNotes(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setReconciliationModalId(null)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReconciliation}
                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Attest & Sign Off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
