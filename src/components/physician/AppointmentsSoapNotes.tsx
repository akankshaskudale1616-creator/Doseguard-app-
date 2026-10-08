import React, { useState } from 'react';
import { TelehealthAppointment, ConsultationSoapNote } from '../../types/pv';
import {
  Calendar,
  Clock,
  Video,
  FileText,
  User,
  Plus,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Save,
  Download,
} from 'lucide-react';

interface AppointmentsSoapNotesProps {
  appointments: TelehealthAppointment[];
  onBookAppointment: (apt: TelehealthAppointment) => void;
  soapNotes: ConsultationSoapNote[];
  onAddSoapNote: (note: ConsultationSoapNote) => void;
}

export const AppointmentsSoapNotes: React.FC<AppointmentsSoapNotesProps> = ({
  appointments,
  onBookAppointment,
  soapNotes,
  onAddSoapNote,
}) => {
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number>(0);
  const [subjective, setSubjective] = useState<string>(
    soapNotes[0]?.subjective ||
      '68-year-old male presents with acute pruritic morbilliform eruption and bilateral lower lip edema, 48 hours following Amoxicillin-Clavulanic acid 625mg BID initiation.'
  );
  const [objective, setObjective] = useState<string>(
    soapNotes[0]?.objective ||
      'Vitals: BP 136/84, HR 82, SpO2 97%, Temp 37.1 C. Extensive erythematous macules and papules on anterior chest and forearms. Resolving angioedema of lower vermilion border. No respiratory wheeze or stridor.'
  );
  const [assessment, setAssessment] = useState<string>(
    soapNotes[0]?.assessment ||
      'Drug-induced cutaneous adverse reaction (Type I / Type IV hypersensitivity) secondary to beta-lactam antibiotic. WHO-UMC Causality: Probable (cADR score 84/100).'
  );
  const [plan, setPlan] = useState<string>(
    soapNotes[0]?.plan ||
      '1. Strict permanent penicillin dechallenge; flag EHR with Penicillin Allergy. 2. Switch to Cefuroxime Axetil 500mg BID x 7d. 3. Levocetirizine 5mg at bedtime x 5d. 4. Urgent return precautions for airway compromise.'
  );

  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleSaveSoap = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote: ConsultationSoapNote = {
      id: `SOAP-${Date.now().toString().slice(-4)}`,
      patientId: 'PAT-6801',
      patientName: 'Ramesh V. Kulkarni',
      date: new Date().toISOString().split('T')[0],
      doctorName: 'Dr. Ananya Deshmukh, MD',
      subjective,
      objective,
      assessment,
      plan,
    };
    onAddSoapNote(newNote);
    setSaveSuccess('Clinical SOAP note saved to patient electronic health record!');
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-900 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold">{saveSuccess}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
            EHR Linked
          </span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-orange-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-900 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200 uppercase">
            Clinical Consultations
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">
            Daily Appointments & Structured SOAP Notes Workspace
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage your daily patient schedule (In-person & Virtual Telehealth) and document clinical patient visits in standardized SOAP format.
          </p>
        </div>
      </div>

      {/* Main Grid: Appointments Schedule (40%) + SOAP Notes Editor (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Daily Appointments Schedule */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Today's Appointment Schedule ({appointments.length})
                </h4>
              </div>
              <span className="text-[10px] font-mono bg-orange-100 text-orange-900 px-2 py-0.5 rounded font-bold">
                Live Outpatient Queue
              </span>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm block">{apt.patientName}</span>
                      <span className="text-[11px] font-mono text-slate-500">{apt.patientId} · {apt.specialty}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      apt.type === 'Virtual Telehealth' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {apt.type}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-600" />
                        {apt.dateTime}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic">Chief Complaint: {apt.reason}</p>
                  </div>

                  {apt.meetUrl && (
                    <a
                      href={apt.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Start Virtual Video Consult</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: SOAP Notes Documentation Editor */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                Clinical SOAP Notes Editor (Subjective, Objective, Assessment, Plan)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Patient: Ramesh V. Kulkarni (PAT-6801) · Doctor: Dr. Ananya Deshmukh, MD
              </p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              Standardized EMR Format
            </span>
          </div>

          <form onSubmit={handleSaveSoap} className="space-y-4 text-xs">
            {/* Subjective */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-orange-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-900 flex items-center justify-center text-[11px]">S</span>
                Subjective (Patient Reported History, Chief Complaint, Onset):
              </label>
              <textarea
                rows={3}
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
              />
            </div>

            {/* Objective */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-orange-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 flex items-center justify-center text-[11px]">O</span>
                Objective (Physical Examination, Vitals, Morphology, Lab Findings):
              </label>
              <textarea
                rows={3}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
              />
            </div>

            {/* Assessment */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-orange-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-sky-100 text-sky-900 flex items-center justify-center text-[11px]">A</span>
                Assessment (Diagnosis, Causality Score, Hypersensitivity Classification):
              </label>
              <textarea
                rows={3}
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
              />
            </div>

            {/* Plan */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-orange-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-900 flex items-center justify-center text-[11px]">P</span>
                Plan (Therapeutic Withdrawal, Antimicrobial Switch, Patient Warnings):
              </label>
              <textarea
                rows={3}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Timestamped and cryptographically linked to Sassoon Hospital EHR.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-2xl text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save SOAP Note to EHR</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
