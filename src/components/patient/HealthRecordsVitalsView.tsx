import React, { useState } from 'react';
import { VitalSignEntry, PatientLabResult, PatientDocumentedAllergy } from '../../types/pv';
import {
  Activity,
  Heart,
  Droplet,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Upload,
  FileText,
  Calendar,
  Clock,
  ShieldAlert,
  Thermometer,
  Sparkles,
} from 'lucide-react';

interface HealthRecordsVitalsViewProps {
  vitalsLog: VitalSignEntry[];
  onAddVitals: (v: VitalSignEntry) => void;
  labResults: PatientLabResult[];
  onAddLabResult: (lab: PatientLabResult) => void;
  allergies: PatientDocumentedAllergy[];
  onAddAllergy: (alg: PatientDocumentedAllergy) => void;
}

export const HealthRecordsVitalsView: React.FC<HealthRecordsVitalsViewProps> = ({
  vitalsLog,
  onAddVitals,
  labResults,
  onAddLabResult,
  allergies,
  onAddAllergy,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'vitals' | 'labs' | 'allergies'>('vitals');

  // New Vitals Form State
  const [bpSystolic, setBpSystolic] = useState<number>(130);
  const [bpDiastolic, setBpDiastolic] = useState<number>(82);
  const [bloodGlucose, setBloodGlucose] = useState<number>(128);
  const [glucoseType, setGlucoseType] = useState<'Fasting' | 'Post-Meal' | 'Random'>('Fasting');
  const [heartRate, setHeartRate] = useState<number>(76);
  const [spo2, setSpo2] = useState<number>(98);
  const [tempC, setTempC] = useState<number>(36.8);
  const [vitalsNotes, setVitalsNotes] = useState<string>('');
  const [vitalsSuccess, setVitalsSuccess] = useState<string | null>(null);

  // New Lab Form State
  const [isAddLabOpen, setIsAddLabOpen] = useState(false);
  const [newLabName, setNewLabName] = useState('Serum Creatinine');
  const [newLabCategory, setNewLabCategory] = useState('Renal Function');
  const [newLabValue, setNewLabValue] = useState('1.10');
  const [newLabUnit, setNewLabUnit] = useState('mg/dL');
  const [newLabRange, setNewLabRange] = useState('0.7 - 1.3');

  // New Allergy Form State
  const [isAddAllergyOpen, setIsAddAllergyOpen] = useState(false);
  const [newAllergySubstance, setNewAllergySubstance] = useState('');
  const [newAllergyReaction, setNewAllergyReaction] = useState('');
  const [newAllergySeverity, setNewAllergySeverity] = useState<'Mild' | 'Moderate' | 'Severe (Anaphylaxis)'>('Moderate');

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: VitalSignEntry = {
      id: `vit-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bpSystolic,
      bpDiastolic,
      bloodGlucose,
      glucoseType,
      heartRate,
      spo2,
      tempC,
      notes: vitalsNotes || 'Daily routine measurement logged by patient.',
    };

    onAddVitals(newEntry);
    setVitalsNotes('');
    setVitalsSuccess('Vital signs logged successfully and synced with attending physician!');
    setTimeout(() => setVitalsSuccess(null), 3500);
  };

  const handleSaveLab = (e: React.FormEvent) => {
    e.preventDefault();
    const newLab: PatientLabResult = {
      id: `lab-${Date.now()}`,
      testName: newLabName,
      category: newLabCategory,
      value: newLabValue,
      unit: newLabUnit,
      referenceRange: newLabRange,
      status: 'Normal',
      date: new Date().toISOString().split('T')[0],
    };
    onAddLabResult(newLab);
    setIsAddLabOpen(false);
  };

  const handleSaveAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergySubstance.trim()) return;
    const newAlg: PatientDocumentedAllergy = {
      id: `alg-${Date.now()}`,
      substance: newAllergySubstance.trim(),
      reaction: newAllergyReaction.trim() || 'Cutaneous rash / allergic reaction',
      severity: newAllergySeverity,
      diagnosedDate: new Date().toISOString().split('T')[0],
    };
    onAddAllergy(newAlg);
    setNewAllergySubstance('');
    setNewAllergyReaction('');
    setIsAddAllergyOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Success banner */}
      {vitalsSuccess && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-900 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold">{vitalsSuccess}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
            EHR Updated
          </span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-sky-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200 uppercase">
            Personal Health Record (PHR)
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">
            Health Records, Vitals Tracker & Allergy List
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Track daily blood pressure, blood glucose, and heart rate; maintain lab diagnostics and documented drug allergies.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('vitals')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'vitals'
                ? 'bg-white text-sky-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-sky-600" />
            <span>Vital Signs</span>
          </button>
          <button
            onClick={() => setActiveSubTab('labs')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'labs'
                ? 'bg-white text-sky-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            <span>Lab Results ({labResults.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('allergies')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'allergies'
                ? 'bg-white text-sky-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Allergy List ({allergies.length})</span>
          </button>
        </div>
      </div>

      {/* ================= 1. VITALS LOG & ENTRY FORM ================= */}
      {activeSubTab === 'vitals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Vitals Logger Form (45%) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Plus className="w-4 h-4 text-sky-600" />
              Log New Vital Signs Today
            </h4>

            <form onSubmit={handleSaveVitals} className="space-y-3.5 text-xs">
              {/* Blood Pressure */}
              <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-200/80 space-y-2">
                <span className="font-bold text-rose-950 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-600" />
                  Blood Pressure (mmHg)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">Systolic (Top)</label>
                    <input
                      type="number"
                      value={bpSystolic}
                      onChange={(e) => setBpSystolic(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">Diastolic (Bottom)</label>
                    <input
                      type="number"
                      value={bpDiastolic}
                      onChange={(e) => setBpDiastolic(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Blood Glucose */}
              <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-2">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-amber-600" />
                  Blood Glucose (mg/dL)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">Reading (mg/dL)</label>
                    <input
                      type="number"
                      value={bloodGlucose}
                      onChange={(e) => setBloodGlucose(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">Timing Type</label>
                    <select
                      value={glucoseType}
                      onChange={(e) => setGlucoseType(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    >
                      <option value="Fasting">Fasting</option>
                      <option value="Post-Meal">Post-Meal (2h)</option>
                      <option value="Random">Random</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pulse & SpO2 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Heart Rate (BPM):
                  </label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Oxygen SpO₂ (%):
                  </label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Symptoms or Observations (Optional):
                </label>
                <input
                  type="text"
                  value={vitalsNotes}
                  onChange={(e) => setVitalsNotes(e.target.value)}
                  placeholder="e.g. Felt dizzy after morning medicine, rested for 15 mins..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Activity className="w-4 h-4" />
                <span>Save & Sync Vital Signs</span>
              </button>
            </form>
          </div>

          {/* Right: Vitals Log History (55%) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                Vitals History & Trends ({vitalsLog.length} Records)
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">Last updated: Today</span>
            </div>

            <div className="space-y-3">
              {vitalsLog.map((log) => (
                <div key={log.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{log.date} · {log.time}</span>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                      SpO₂: {log.spo2 || 98}% · Temp: {log.tempC || 36.8}°C
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Pressure</span>
                      <span className="font-mono font-black text-rose-950 text-sm">
                        {log.bpSystolic}/{log.bpDiastolic}
                      </span>
                      <span className="text-[10px] text-slate-400 block">mmHg</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Glucose</span>
                      <span className="font-mono font-black text-amber-950 text-sm">
                        {log.bloodGlucose}
                      </span>
                      <span className="text-[10px] text-amber-800 font-bold block">{log.glucoseType}</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Heart Rate</span>
                      <span className="font-mono font-black text-sky-950 text-sm">
                        {log.heartRate}
                      </span>
                      <span className="text-[10px] text-slate-400 block">BPM</span>
                    </div>
                  </div>

                  {log.notes && (
                    <p className="text-[11px] text-slate-500 italic pt-1">
                      Note: {log.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. LAB TEST RESULTS ================= */}
      {activeSubTab === 'labs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Laboratory Test Results & Diagnostic Panel ({labResults.length})
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Renal parameters (eGFR, Serum Creatinine), allergic biomarkers (AEC, Total IgE), and metabolic panels.
              </p>
            </div>

            <button
              onClick={() => setIsAddLabOpen(true)}
              className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold border border-teal-300 rounded-xl text-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-teal-600" />
              <span>Add / Upload Lab Result</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {labResults.map((lab) => (
              <div key={lab.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{lab.testName}</span>
                    <p className="text-xs text-slate-500">{lab.category}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lab.status === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {lab.status}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-baseline justify-between">
                  <span className="text-lg font-mono font-black text-slate-900">
                    {lab.value} <span className="text-xs font-normal text-slate-500">{lab.unit}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Ref: {lab.referenceRange}</span>
                </div>

                <div className="text-[10px] text-slate-400 font-mono text-right">
                  Report Date: {lab.date}
                </div>
              </div>
            ))}
          </div>

          {/* Add Lab Modal */}
          {isAddLabOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900">Upload / Add Diagnostic Lab Result</h4>
                  <button onClick={() => setIsAddLabOpen(false)} className="text-slate-400 font-bold">✕</button>
                </div>

                <form onSubmit={handleSaveLab} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Test Name:</label>
                    <input
                      type="text"
                      value={newLabName}
                      onChange={(e) => setNewLabName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Category:</label>
                    <input
                      type="text"
                      value={newLabCategory}
                      onChange={(e) => setNewLabCategory(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Result Value:</label>
                      <input
                        type="text"
                        value={newLabValue}
                        onChange={(e) => setNewLabValue(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Unit:</label>
                      <input
                        type="text"
                        value={newLabUnit}
                        onChange={(e) => setNewLabUnit(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Reference Range:</label>
                    <input
                      type="text"
                      value={newLabRange}
                      onChange={(e) => setNewLabRange(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddLabOpen(false)}
                      className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold text-xs shadow-xs"
                    >
                      Save Lab Result
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= 3. DOCUMENTED ALLERGIES LIST ================= */}
      {activeSubTab === 'allergies' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Documented Patient Drug Allergies & Hypersensitivities ({allergies.length})
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically triggers contraindication warnings during physician e-prescribing and pharmacist dispensing.
              </p>
            </div>

            <button
              onClick={() => setIsAddAllergyOpen(true)}
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold border border-rose-300 rounded-xl text-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-rose-600" />
              <span>Add Documented Allergy</span>
            </button>
          </div>

          <div className="space-y-3">
            {allergies.map((alg) => (
              <div key={alg.id} className="p-4 bg-rose-50/50 rounded-2xl border border-rose-300 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span className="font-extrabold text-slate-900 text-sm">{alg.substance}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-rose-600 text-white px-2.5 py-0.5 rounded-full uppercase">
                    {alg.severity}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-slate-700">
                  <span className="font-semibold text-rose-950">Recorded Reaction: </span>
                  {alg.reaction}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Diagnosed / Documented: {alg.diagnosedDate}</span>
                  <span className="text-rose-700 font-bold">High Alert in Prescribing System</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Allergy Modal */}
          {isAddAllergyOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900">Add Drug Allergy / Hypersensitivity</h4>
                  <button onClick={() => setIsAddAllergyOpen(false)} className="text-slate-400 font-bold">✕</button>
                </div>

                <form onSubmit={handleSaveAllergy} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Allergen / Substance:</label>
                    <input
                      type="text"
                      placeholder="e.g. Penicillins, NSAIDs, Sulfa drugs..."
                      value={newAllergySubstance}
                      onChange={(e) => setNewAllergySubstance(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Observed Reaction:</label>
                    <input
                      type="text"
                      placeholder="e.g. Maculopapular rash, angioedema, hives..."
                      value={newAllergyReaction}
                      onChange={(e) => setNewAllergyReaction(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Severity Rating:</label>
                    <select
                      value={newAllergySeverity}
                      onChange={(e) => setNewAllergySeverity(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold"
                    >
                      <option value="Mild">Mild</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Severe (Anaphylaxis)">Severe (Anaphylaxis / Angioedema)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddAllergyOpen(false)}
                      className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold text-xs shadow-xs"
                    >
                      Save Documented Allergy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
