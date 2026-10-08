import React, { useState } from 'react';
import { Medicine, SymptomReport } from '../../types/pv';
import { seniorPatientImg, PATIENT_FALLBACK_AVATAR } from '../../assets/images';
import {
  HeartHandshake,
  User,
  Users,
  ShieldAlert,
  Plus,
  Mic,
  Camera,
  CheckCircle2,
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  AlertTriangle,
  Upload,
  Check,
  Sparkles,
  ChevronRight,
  Pill,
} from 'lucide-react';

interface CaregiverDashboardProps {
  medicines: Medicine[];
  cases: SymptomReport[];
  onSubmitReport: (report: SymptomReport) => void;
  onEmergencyClick: () => void;
  onUpdateMedicineStatus: (id: string, status: Medicine['status']) => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  medicines,
  cases,
  onSubmitReport,
  onEmergencyClick,
  onUpdateMedicineStatus,
}) => {
  const [selectedDependent, setSelectedDependent] = useState<'ramesh' | 'aarav' | 'shanti'>('ramesh');
  const [proxyReportText, setProxyReportText] = useState('');
  const [isConsentGiven, setIsConsentGiven] = useState(true);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [activeCareTab, setActiveCareTab] = useState<'overview' | 'report' | 'reminders' | 'contacts'>('overview');

  const DEPENDENTS = [
    {
      id: 'ramesh',
      name: 'Ramesh V. Kulkarni',
      relationship: 'Father (Elderly, 68 yrs)',
      avatar: seniorPatientImg,
      conditions: 'Hypertension, Type-2 Diabetes, LRTI',
      medCount: 6,
      status: 'Active ADR Under Review (Augmentin 625)',
      urgent: true,
    },
    {
      id: 'aarav',
      name: 'Aarav Kulkarni',
      relationship: 'Son (Paediatric, 5 yrs)',
      avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=256&q=80',
      conditions: 'Childhood Wheezing / Bronchitis',
      medCount: 2,
      status: 'Stable (Salbutamol Inhaler & Syrups)',
      urgent: false,
    },
    {
      id: 'shanti',
      name: 'Shanti Devi',
      relationship: 'Mother-in-law (Elderly, 74 yrs)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      conditions: 'Osteoarthritis, Chronic Renal Stage 2',
      medCount: 4,
      status: 'Scheduled BP Check Today',
      urgent: false,
    },
  ];

  const currentDep = DEPENDENTS.find((d) => d.id === selectedDependent)!;

  const handleProxySubmit = () => {
    if (!proxyReportText.trim()) return;

    const newReport: SymptomReport = {
      id: `CASE-PROXY-${Date.now().toString().slice(-4)}`,
      patientId: selectedDependent === 'ramesh' ? 'PAT-6801' : 'PAT-PED-02',
      patientName: currentDep.name,
      patientAge: selectedDependent === 'ramesh' ? 68 : selectedDependent === 'aarav' ? 5 : 74,
      patientGender: selectedDependent === 'aarav' ? 'Male' : selectedDependent === 'shanti' ? 'Female' : 'Male',
      isElderlyPolypharmacy: selectedDependent === 'ramesh' || selectedDependent === 'shanti',
      reportedAt: new Date().toISOString(),
      inputLanguage: 'mr',
      originalText: proxyReportText,
      translatedText: proxyReportText,
      extractedSymptoms: ['Caregiver reported: Cutaneous rash', 'Facial discomfort'],
      meddraTerms: [
        { pt: 'Rash pruritic', soc: 'Skin disorders', code: '10037868' },
        { pt: 'Facial edema', soc: 'Skin disorders', code: '10016027' },
      ],
      negatedSymptoms: ['No loss of consciousness'],
      severity: 'moderate',
      onsetDate: new Date().toISOString().split('T')[0],
      durationDays: 1,
      bodyLocations: ['Face', 'Arms'],
      emergencyRedFlags: ['Proxy noted lip puffiness'],
      followUpResponses: {},
      outcome: 'persisting',
      urgencyLevel: 'URGENT_CLINICAL',
      completenessScore: 85,
      missingFields: [],
      causality: {
        cAdrTotal: 78,
        category: 'PROBABLE',
        categoryLabel: 'Probable Drug-Related Association',
        userFacingAdvice: 'Caregiver should bring patient to clinic or contact pharmacist today.',
        breakdown: {
          temporalFit_T: { score: 9.0, max: 10, weight: 0.25, contribution: 22.5, rationale: 'Symptoms began shortly after proxy-administered dose.' },
          doseResponse_D: { score: 7.0, max: 10, weight: 0.15, contribution: 10.5, rationale: 'Second daily dose administered.' },
          knownAssociation_K: { score: 9.5, max: 10, weight: 0.20, contribution: 19.0, rationale: 'Known beta-lactam rash frequency.' },
          dechallenge_R: { score: 6.0, max: 10, weight: 0.15, contribution: 9.0, rationale: 'Withholding advised by doctor.' },
          hostFactors_H: { score: 8.5, max: 10, weight: 0.15, contribution: 12.75, rationale: 'Elderly polypharmacy dependent.' },
          alternativeExplanations_A: { score: 2.0, max: 10, weight: 0.10, contribution: 2.0, rationale: 'Secondary infection assessed.' },
        },
        explanation: 'Proxy report by son Rohan Kulkarni logged with signed caregiver consent.',
      },
      reviewStatus: 'pending',
    };

    onSubmitReport(newReport);
    setReportSuccess(true);
    setProxyReportText('');
    setTimeout(() => setReportSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Light Orange & Warm Amber Theme */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/70 border border-orange-200 rounded-3xl p-6 text-slate-900 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-orange-900 bg-orange-200/70 border border-orange-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Proxy Reporter Portal
                </span>
                <span className="text-xs text-orange-800 font-mono font-medium">
                  Rohan Kulkarni (Caregiver ID: CARER-419)
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Family Caregiver &amp; Dependent Safety Console
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Report adverse events on behalf of elderly parents, paediatric children, or low-literacy family members. Track daily medication compliance and connect with community pharmacists.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={onEmergencyClick}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Dependent SOS (108/112)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dependent Selector Row */}
      <div className="bg-white border border-orange-200/80 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-orange-100">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Users className="w-4 h-4 text-orange-600" />
            <span>Select Dependent to Manage:</span>
          </span>
          <span className="text-slate-500 text-[11px]">3 Managed Relatives</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEPENDENTS.map((dep) => (
            <div
              key={dep.id}
              onClick={() => setSelectedDependent(dep.id as any)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                selectedDependent === dep.id
                  ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-1 ring-orange-400'
                  : 'border-slate-200 hover:border-orange-300 bg-white'
              }`}
            >
              <img
                src={dep.avatar}
                alt={dep.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = PATIENT_FALLBACK_AVATAR;
                }}
                className="w-11 h-11 rounded-full object-cover border-2 border-orange-200 shrink-0"
              />
              <div className="min-w-0 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 truncate">{dep.name}</span>
                  {dep.urgent && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  )}
                </div>
                <span className="text-[11px] text-orange-800 font-medium block">
                  {dep.relationship}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {dep.medCount} Active Meds · {dep.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caregiver Actions Navigation */}
      <div className="flex items-center gap-1.5 bg-orange-50/60 p-1.5 rounded-2xl border border-orange-200/80 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveCareTab('overview')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeCareTab === 'overview'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Dependent Dosing &amp; Schedule
        </button>
        <button
          onClick={() => setActiveCareTab('report')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeCareTab === 'report'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Proxy Symptom Report</span>
        </button>
        <button
          onClick={() => setActiveCareTab('reminders')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeCareTab === 'reminders'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Caregiver Dose Checklist</span>
        </button>
        <button
          onClick={() => setActiveCareTab('contacts')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeCareTab === 'contacts'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Pharmacy &amp; Doctor Contacts</span>
        </button>
      </div>

      {/* TAB 1: Dependent Overview & Schedule */}
      {activeCareTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-orange-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {currentDep.name}&apos;s Daily Prescription Schedule
                </h3>
                <p className="text-slate-500 text-xs">
                  Conditions: {currentDep.conditions}
                </p>
              </div>
              <span className="text-[10px] bg-orange-100 text-orange-900 border border-orange-200 px-2.5 py-1 rounded-full font-bold">
                Proxy Verified: Rohan Kulkarni
              </span>
            </div>

            <div className="space-y-2.5">
              {medicines.map((med) => (
                <div
                  key={med.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    med.isSuspected
                      ? 'bg-rose-50/70 border-rose-200'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        med.isSuspected
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      Rx
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{med.brandName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">({med.strength})</span>
                        {med.isSuspected && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded">
                            Suspected ADR
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {med.frequency} · Prescribed by: {med.prescriber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdateMedicineStatus(
                          med.id,
                          med.status === 'active' ? 'stopped' : 'active'
                        )
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        med.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                    >
                      {med.status === 'active' ? 'Administered ✓' : 'Suspended'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Proxy Symptom Report Wizard */}
      {activeCareTab === 'report' && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
          <div className="pb-3 border-b border-orange-100">
            <h3 className="text-sm font-bold text-slate-900">
              Submit Proxy Adverse Event Report for {currentDep.name}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Caregivers can report symptoms noticed in elderly, paediatric, or bedridden patients who cannot operate phones independently.
            </p>
          </div>

          {reportSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-bold flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>Proxy ADR report submitted successfully! Case sent to Community Pharmacist Rajesh Varma for review.</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Describe the symptoms or changes noticed in {currentDep.name}:
              </label>
              <textarea
                rows={3}
                value={proxyReportText}
                onChange={(e) => setProxyReportText(e.target.value)}
                placeholder="e.g. My father started Augmentin 2 days ago and has developed red itchy patches on arms with slight swelling on upper lip..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 leading-relaxed focus:bg-white focus:border-orange-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setProxyReportText(
                    'वडिलांना नवीन गोळी सुरू केल्यापासून अंगावर पुरळ आणि ओठांवर सूज आली आहे. त्यांना खाज येत आहे.'
                  )
                }
                className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-xl border border-orange-200 text-xs font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Use Marathi Voice Preset</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setProxyReportText(
                    'Two days after taking the new antibiotic, severe itching and rash on chest and arms developed with mild lip puffiness.'
                  )
                }
                className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-xl border border-orange-200 text-xs font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Use English Preset</span>
              </button>
            </div>

            <label className="flex items-center gap-2 p-3 bg-orange-50/50 rounded-xl border border-orange-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isConsentGiven}
                onChange={(e) => setIsConsentGiven(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <span className="text-slate-700 text-[11px] leading-relaxed">
                <strong>Proxy Consent Attestation:</strong> I confirm I am the authorized legal caregiver/family proxy for {currentDep.name} and provide consent for transmission to pharmacovigilance reviewers.
              </span>
            </label>

            <button
              onClick={handleProxySubmit}
              disabled={!proxyReportText.trim() || !isConsentGiven}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 text-xs"
            >
              <Check className="w-4 h-4" />
              <span>Submit Proxy Report on Behalf of {currentDep.name}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Caregiver Dose Checklist */}
      {activeCareTab === 'reminders' && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-orange-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Today&apos;s Caregiver Administration Checklist
              </h3>
              <p className="text-slate-500 text-xs">
                Ensure all scheduled doses are logged by family caregiver
              </p>
            </div>
            <span className="text-xs font-bold text-orange-800 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
              Wednesday, 07 Oct 2026
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Morning Dose (8:00 AM)</span>
                <p className="text-slate-600 text-[11px]">Glycomet-GP 1 (Metformin 500mg + Glimepiride 1mg) - with breakfast</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">Administered ✓</span>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-950">Afternoon Dose (1:30 PM)</span>
                <p className="text-rose-900 text-[11px]">Augmentin 625 Duo - Suspected ADR Withheld under Medical Advice</p>
              </div>
              <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg">⛔ Withheld</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Night Dose (8:30 PM)</span>
                <p className="text-slate-600 text-[11px]">Amlodac 5 (Amlodipine 5mg) &amp; Atorva 10 (Atorvastatin 10mg)</p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">Pending 8:30 PM</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Pharmacy Contacts */}
      {activeCareTab === 'contacts' && (
        <div className="bg-white border border-orange-200/80 rounded-3xl p-5 shadow-xs space-y-4 text-xs">
          <div className="pb-3 border-b border-orange-100">
            <h3 className="text-sm font-bold text-slate-900">
              Assigned Healthcare Providers for {currentDep.name}
            </h3>
            <p className="text-slate-500 text-xs">
              Quick contact cards for linked community pharmacist and consulting physicians
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-2">
              <span className="font-bold text-orange-950 uppercase tracking-wider text-[11px] block">
                Primary Community Pharmacist
              </span>
              <p className="font-bold text-slate-900 text-sm">Rajesh Varma, M.Pharm</p>
              <p className="text-slate-600 text-[11px]">Apex Community Pharmacy, Pune (PvPI Network)</p>
              <p className="font-mono text-slate-700 text-[11px]">Ph: +91 98230 44102</p>
              <button
                onClick={() => alert('Initiating secure message to Pharmacist Rajesh Varma...')}
                className="w-full mt-2 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Pharmacist Directly</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Consulting Physician
              </span>
              <p className="font-bold text-slate-900 text-sm">Dr. Ananya Deshmukh, MD</p>
              <p className="text-slate-600 text-[11px]">Chest Medicine · Sassoon General Hospital</p>
              <p className="font-mono text-slate-700 text-[11px]">OPD: Mon–Fri (9 AM – 1 PM)</p>
              <button
                onClick={() => {
                  /* Non-blocking interaction */
                }}
                className="w-full mt-2 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Clinic Helpdesk</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
