import React, { useState } from 'react';
import {
  Medicine,
  VitalSignEntry,
  PatientLabResult,
  PatientDocumentedAllergy,
} from '../../types/pv';
import {
  Search,
  User,
  ShieldAlert,
  Activity,
  Heart,
  Droplet,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Pill,
} from 'lucide-react';

interface PatientEhrViewProps {
  medicines: Medicine[];
  vitalsLog: VitalSignEntry[];
  labResults: PatientLabResult[];
  allergies: PatientDocumentedAllergy[];
}

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  caregiver: string;
  diagnoses: string[];
  smokingAlcohol: string;
  insuranceId: string;
}

const PATIENT_DATABASE: PatientRecord[] = [
  {
    id: 'PAT-6801',
    name: 'Ramesh V. Kulkarni',
    age: 68,
    gender: 'Male',
    caregiver: 'Rohan Kulkarni (Son - +91 98230 44102)',
    diagnoses: [
      'Acute Bronchitis (Lower Respiratory Tract Infection)',
      'Essential Hypertension (12 years)',
      'Type 2 Diabetes Mellitus (8 years)',
      'Mild Hyperlipidemia',
    ],
    smokingAlcohol: 'Non-smoker, Non-alcoholic',
    insuranceId: 'PM-JAY / CGHS-MH-88190',
  },
  {
    id: 'PAT-7203',
    name: 'Savitri Bai Deshmukh',
    age: 71,
    gender: 'Female',
    caregiver: 'Sunil Deshmukh (Son)',
    diagnoses: ['Essential Hypertension', 'Chronic Venous Insufficiency', 'Osteoarthritis (Bilateral Knees)'],
    smokingAlcohol: 'Non-smoker',
    insuranceId: 'PM-JAY-77210',
  },
  {
    id: 'PAT-6542',
    name: 'Anil Narayan Patil',
    age: 64,
    gender: 'Male',
    caregiver: 'Rekha Patil (Wife)',
    diagnoses: ['Type 2 Diabetes Mellitus (Diabetic Nephropathy Stage 2)', 'Ischemic Heart Disease (Post-PCI 2022)'],
    smokingAlcohol: 'Former smoker (quit 2020)',
    insuranceId: 'CGHS-MH-44012',
  },
];

export const PatientEhrView: React.FC<PatientEhrViewProps> = ({
  medicines,
  vitalsLog,
  labResults,
  allergies,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('PAT-6801');

  const filteredPatients = PATIENT_DATABASE.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.diagnoses.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentPatient =
    PATIENT_DATABASE.find((p) => p.id === selectedPatientId) || PATIENT_DATABASE[0];
  const latestVitals = vitalsLog[0];

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient database by Name, ID, or Diagnosis..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {filteredPatients.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPatientId(p.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
                selectedPatientId === p.id
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.name} ({p.id})
            </button>
          ))}
        </div>
      </div>

      {/* Main EHR Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Demographics, Diagnoses & Allergies (50%) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Patient Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-base">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">{currentPatient.name}</h3>
                    <span className="text-xs font-mono font-bold bg-orange-100 text-orange-900 px-2 py-0.5 rounded-md">
                      {currentPatient.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Age: {currentPatient.age} yrs · {currentPatient.gender} · {currentPatient.insuranceId}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Active EHR
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Primary Caregiver</span>
              <p className="font-semibold text-slate-900">{currentPatient.caregiver}</p>
            </div>

            {/* Documented Allergies Warning Card */}
            <div className="p-4 bg-rose-50/70 border-2 border-rose-300 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-rose-950 flex items-center gap-1.5 uppercase tracking-wide">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Documented Drug Hypersensitivities & Allergies ({allergies.length})
                </span>
                <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.2 rounded-full">
                  High Alert
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {allergies.map((alg) => (
                  <div key={alg.id} className="p-2.5 bg-white rounded-xl border border-rose-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900">{alg.substance}</span>
                      <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded font-bold">
                        {alg.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{alg.reaction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical History / Diagnoses */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Past Medical Diagnoses & Chronic History:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentPatient.diagnoses.map((diag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-xl text-xs font-medium border border-slate-200"
                  >
                    {diag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Medications & Recent Vitals / Labs (50%) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Active Medications in EHR */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Pill className="w-4 h-4 text-orange-600" />
                Active Medication Regimen ({medicines.length})
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Polypharmacy Cohort</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {medicines.map((med) => (
                <div
                  key={med.id}
                  className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                    med.isSuspected
                      ? 'bg-rose-50 border-rose-300'
                      : med.status === 'stopped'
                      ? 'bg-slate-100 border-slate-200 opacity-60'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{med.brandName}</span>
                      <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200">
                        {med.strength}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{med.genericName} · {med.frequency}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      med.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {med.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vitals & Lab Snapshot */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-600" />
                Latest Vitals & Laboratory Findings
              </h4>
              <span className="text-[10px] font-mono text-slate-500">{latestVitals?.date || 'Today'}</span>
            </div>

            {/* Vitals Row */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">BP</span>
                <span className="font-mono font-black text-rose-950 text-sm">
                  {latestVitals?.bpSystolic}/{latestVitals?.bpDiastolic}
                </span>
                <span className="text-[10px] text-slate-400 block">mmHg</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Glucose</span>
                <span className="font-mono font-black text-amber-950 text-sm">
                  {latestVitals?.bloodGlucose}
                </span>
                <span className="text-[10px] text-amber-800 font-bold block">{latestVitals?.glucoseType}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Heart Rate</span>
                <span className="font-mono font-black text-sky-950 text-sm">
                  {latestVitals?.heartRate}
                </span>
                <span className="text-[10px] text-slate-400 block">BPM</span>
              </div>
            </div>

            {/* Labs Preview */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Key Diagnostic Biomarkers</span>
              {labResults.slice(0, 3).map((lab) => (
                <div key={lab.id} className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{lab.testName}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{lab.value} {lab.unit}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
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
