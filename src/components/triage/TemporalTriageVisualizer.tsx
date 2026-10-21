import React, { useState } from 'react';
import {
  Clock,
  Activity,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Pill,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  User,
  HeartPulse,
  TrendingDown,
  TrendingUp,
  FileText
} from 'lucide-react';

interface TemporalCase {
  id: string;
  patientName: string;
  patientId: string;
  suspectedDrug: string;
  genericName: string;
  reactionName: string;
  latencyClassification: 'Immediate (<1 hour)' | 'Accelerated (1-72 hours)' | 'Delayed (3-10 days)' | 'Late / Chronic (>2 weeks)';
  drugsTimeline: Array<{
    name: string;
    startDay: number;
    endDay: number | null; // null if ongoing
    status: 'Suspected & Stopped' | 'Chronic Concomitant' | 'Supportive Therapy';
    color: string;
    dosage: string;
  }>;
  milestones: Array<{
    day: number;
    time: string;
    title: string;
    description: string;
    severityScore: number; // 0 - 10
    triageLevel: 'NORMAL' | 'MONITOR' | 'EMERGENCY' | 'RECOVERY';
    actionTaken?: string;
  }>;
  naranjoScore: number;
  causalityVerdict: string;
}

const TEMPORAL_CASES: TemporalCase[] = [
  {
    id: 'case-augmentin',
    patientName: 'Ramesh V. Kulkarni',
    patientId: 'PAT-6801',
    suspectedDrug: 'Augmentin 625',
    genericName: 'Amoxicillin 500mg + Clavulanate 125mg',
    reactionName: 'Cutaneous Maculopapular Drug Eruption & Perioral Edema',
    latencyClassification: 'Delayed (3-10 days)',
    drugsTimeline: [
      {
        name: 'Amlodipine 5mg',
        startDay: -180,
        endDay: null,
        status: 'Chronic Concomitant',
        color: 'slate',
        dosage: '5mg Once Daily',
      },
      {
        name: 'Metformin 500mg SR',
        startDay: -365,
        endDay: null,
        status: 'Chronic Concomitant',
        color: 'slate',
        dosage: '500mg Twice Daily',
      },
      {
        name: 'Augmentin 625 (Suspected)',
        startDay: 0,
        endDay: 4,
        status: 'Suspected & Stopped',
        color: 'rose',
        dosage: '625mg Thrice Daily',
      },
      {
        name: 'Cetirizine 10mg (Antidote/Rescue)',
        startDay: 4,
        endDay: 8,
        status: 'Supportive Therapy',
        color: 'emerald',
        dosage: '10mg Bedtime',
      },
    ],
    milestones: [
      {
        day: 0,
        time: 'Day 0 (09:00 AM)',
        title: 'Augmentin 625 Commenced',
        description: 'Prescribed for Lower Respiratory Tract Infection (LRTI) by chest physician.',
        severityScore: 0,
        triageLevel: 'NORMAL',
      },
      {
        day: 2,
        time: 'Day 2 (10:00 PM)',
        title: 'Latent Subclinical Phase',
        description: 'T-cell and IgE sensitization period. No macroscopic clinical manifestations.',
        severityScore: 1,
        triageLevel: 'NORMAL',
      },
      {
        day: 3,
        time: 'Day 3 (06:30 PM)',
        title: 'First Symptom Onset (Latency 78 hrs)',
        description: 'Mild localized pruritus on forearms and chest noticed after evening dose.',
        severityScore: 3,
        triageLevel: 'MONITOR',
        actionTaken: 'Patient reported itchiness via DoseGuard mobile app.',
      },
      {
        day: 4,
        time: 'Day 4 (09:15 AM)',
        title: 'Emergency Peak / Anaphylactoid Alert',
        description: 'Rapid spread to diffuse erythematous maculopapular rash with perioral swelling.',
        severityScore: 8,
        triageLevel: 'EMERGENCY',
        actionTaken: 'Red-Flag alert sent to on-duty pharmacist. Immediate dechallenge recommended.',
      },
      {
        day: 4.5,
        time: 'Day 4 (12:00 PM)',
        title: 'Dechallenge Executed',
        description: 'Augmentin permanently halted. Cetirizine 10mg rescue antihistamine started.',
        severityScore: 6,
        triageLevel: 'RECOVERY',
        actionTaken: 'Physician confirmed drug dechallenge in EHR.',
      },
      {
        day: 5,
        time: 'Day 5 (11:00 AM)',
        title: 'Erythema Regressing (24h Post-Dechallenge)',
        description: 'Pruritus subsided significantly. Facial edema fully resolved.',
        severityScore: 3,
        triageLevel: 'RECOVERY',
      },
      {
        day: 7,
        time: 'Day 7 (05:00 PM)',
        title: 'Complete Resolution / Positive Dechallenge',
        description: 'Skin completely clear with no secondary lesions. Confirmed Positive Dechallenge (+2 Naranjo).',
        severityScore: 0,
        triageLevel: 'NORMAL',
        actionTaken: 'Case finalized for PvPI VigiFlow submission.',
      },
    ],
    naranjoScore: 7,
    causalityVerdict: 'Probable / Likely ADR (Strong Temporal & Dechallenge Concordance)',
  },
  {
    id: 'case-enalapril',
    patientName: 'Sunita M. Patil',
    patientId: 'PAT-4102',
    suspectedDrug: 'Enalapril 5mg',
    genericName: 'Enalapril Maleate (ACE Inhibitor)',
    reactionName: 'Acute Angioedema of Tongue & Larynx',
    latencyClassification: 'Immediate (<1 hour)',
    drugsTimeline: [
      {
        name: 'Enalapril 5mg (Suspected)',
        startDay: 0,
        endDay: 1,
        status: 'Suspected & Stopped',
        color: 'rose',
        dosage: '5mg Once Daily',
      },
      {
        name: 'Adrenaline / Epinephrine IM',
        startDay: 1,
        endDay: 1.5,
        status: 'Supportive Therapy',
        color: 'emerald',
        dosage: '0.5mg Stat IM',
      },
    ],
    milestones: [
      {
        day: 0,
        time: 'Day 0 (08:00 AM)',
        title: 'Enalapril First Dose',
        description: 'Initiated for newly diagnosed Essential Hypertension Stage 1.',
        severityScore: 0,
        triageLevel: 'NORMAL',
      },
      {
        day: 1,
        time: 'Day 1 (08:45 AM)',
        title: 'Acute Laryngeal Tightness (Latency 45 mins)',
        description: 'Tongue swelling and hoarseness within 45 minutes of second morning dose.',
        severityScore: 9,
        triageLevel: 'EMERGENCY',
        actionTaken: 'Emergency SOS 108 activated. Rushed to Sassoon Hospital Casualty.',
      },
      {
        day: 1.2,
        time: 'Day 1 (09:30 AM)',
        title: 'ICU Triage & Bradykinin Dechallenge',
        description: 'IM Adrenaline administered, airway secured. Enalapril permanently blacklisted in EHR.',
        severityScore: 4,
        triageLevel: 'RECOVERY',
      },
      {
        day: 2,
        time: 'Day 2 (12:00 PM)',
        title: 'Full Recovery',
        description: 'Tongue and pharyngeal edema subsided. Substituted with Telmisartan (ARB).',
        severityScore: 0,
        triageLevel: 'NORMAL',
      },
    ],
    naranjoScore: 8,
    causalityVerdict: 'Highly Probable ADR (Hyper-acute Temporal Latency)',
  },
  {
    id: 'case-atorvastatin',
    patientName: 'Devendra K. Rao',
    patientId: 'PAT-5510',
    suspectedDrug: 'Atorvastatin 40mg',
    genericName: 'Atorvastatin Calcium High-Intensity',
    reactionName: 'Subacute Statin-Associated Muscle Symptoms (SAMS / Myalgia)',
    latencyClassification: 'Late / Chronic (>2 weeks)',
    drugsTimeline: [
      {
        name: 'Atorvastatin 40mg (Suspected)',
        startDay: 0,
        endDay: 28,
        status: 'Suspected & Stopped',
        color: 'rose',
        dosage: '40mg Night',
      },
      {
        name: 'Rosuvastatin 5mg (Low Dose Re-challenge)',
        startDay: 42,
        endDay: null,
        status: 'Supportive Therapy',
        color: 'emerald',
        dosage: '5mg Alternate Days',
      },
    ],
    milestones: [
      {
        day: 0,
        time: 'Day 0',
        title: 'Atorvastatin 40mg Started Post-Angioplasty',
        description: 'Initiated for secondary prevention following DES stenting.',
        severityScore: 0,
        triageLevel: 'NORMAL',
      },
      {
        day: 14,
        time: 'Day 14 (Week 2)',
        title: 'Bilateral Proximal Quadriceps Aches',
        description: 'Gradual onset of aching and fatigue without elevated CK.',
        severityScore: 3,
        triageLevel: 'MONITOR',
      },
      {
        day: 28,
        time: 'Day 28 (Week 4)',
        title: 'Severe Nocturnal Muscle Cramps (Severity 7/10)',
        description: 'CK level elevated at 740 IU/L (3x ULN). Drug dechallenged.',
        severityScore: 7,
        triageLevel: 'EMERGENCY',
        actionTaken: 'Atorvastatin suspended for 2-week wash-out window.',
      },
      {
        day: 35,
        time: 'Day 35 (1 Week Post-Dechallenge)',
        title: 'Myalgia Resolving',
        description: 'CK normalized to 142 IU/L. Leg stiffness significantly improved.',
        severityScore: 1,
        triageLevel: 'RECOVERY',
      },
    ],
    naranjoScore: 6,
    causalityVerdict: 'Probable ADR (Classic Delayed Statin Latency Profile)',
  },
];

export const TemporalTriageVisualizer: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-augmentin');
  const [currentDayScrub, setCurrentDayScrub] = useState<number>(4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activeCase = TEMPORAL_CASES.find((c) => c.id === selectedCaseId) || TEMPORAL_CASES[0];

  // Helper to find closest milestone
  const activeMilestone =
    activeCase.milestones
      .filter((m) => m.day <= currentDayScrub)
      .slice(-1)[0] || activeCase.milestones[0];

  // Play animation through timeline
  React.useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDayScrub((prev) => {
          const maxDay = Math.max(...activeCase.milestones.map((m) => m.day));
          if (prev >= maxDay) {
            setIsPlaying(false);
            return prev;
          }
          return Number((prev + 0.5).toFixed(1));
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeCase]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/80 border border-orange-200 rounded-3xl p-6 text-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-900 bg-white border border-orange-300 px-2.5 py-0.5 rounded-full shadow-2xs">
              Pharmacovigilance Latency Analytics
            </span>
            <span className="text-xs text-slate-500 font-mono">WHO-UMC &amp; Naranjo Temporality Core</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Clock className="w-6 h-6 text-orange-600" />
            <span>Temporal Triage &amp; Drug-Reaction Latency Visualizer</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
            Simulate and analyze the exact chronological time-to-onset, drug exposure windows, emergency peak escalation, dechallenge response, and clinical resolution.
          </p>
        </div>

        {/* Case Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-white/90 p-1.5 rounded-2xl border border-orange-200 text-xs shrink-0 self-start md:self-auto">
          {TEMPORAL_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCaseId(c.id);
                setCurrentDayScrub(c.id === 'case-atorvastatin' ? 28 : c.id === 'case-enalapril' ? 1 : 4);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCaseId === c.id
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.suspectedDrug.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Patient & Case Clinical Summary Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 font-bold shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900">{activeCase.patientName}</span>
              <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.2 rounded-md">
                ID: {activeCase.patientId}
              </span>
              <span className="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.2 rounded-full">
                Suspected: {activeCase.suspectedDrug}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Reaction: <strong className="text-slate-900">{activeCase.reactionName}</strong> · Latency Category: <span className="text-orange-700 font-bold">{activeCase.latencyClassification}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-orange-50/80 px-4 py-2.5 rounded-2xl border border-orange-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-orange-800 block">Naranjo Temporality Score</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 font-mono">+{activeCase.naranjoScore}</span>
              <span className="text-xs text-emerald-700 font-bold">/ 10 ({activeCase.causalityVerdict})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Scrubber & Controller */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Interactive Chronological Scrubber (Current Position: Day {currentDayScrub})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Playback' : 'Play Timeline'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentDayScrub(0);
                setIsPlaying(false);
              }}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
              title="Reset to Day 0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={Math.max(...activeCase.milestones.map((m) => m.day))}
            step={0.5}
            value={currentDayScrub}
            onChange={(e) => {
              setCurrentDayScrub(parseFloat(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>Day 0 (Drug Initiated)</span>
            <span>Day {currentDayScrub} (Active Focus)</span>
            <span>Day {Math.max(...activeCase.milestones.map((m) => m.day))} (End of Protocol)</span>
          </div>
        </div>

        {/* Active Stage Callout Card */}
        <div
          className={`p-4 rounded-2xl border-2 transition-all space-y-2 ${
            activeMilestone.triageLevel === 'EMERGENCY'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : activeMilestone.triageLevel === 'MONITOR'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : activeMilestone.triageLevel === 'RECOVERY'
              ? 'bg-teal-50 border-teal-300 text-teal-950'
              : 'bg-emerald-50 border-emerald-300 text-emerald-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full animate-pulse ${
                activeMilestone.triageLevel === 'EMERGENCY'
                  ? 'bg-rose-600'
                  : activeMilestone.triageLevel === 'MONITOR'
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`} />
              <strong className="text-xs font-black uppercase tracking-wider">
                {activeMilestone.time}: {activeMilestone.title}
              </strong>
            </div>

            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono ${
              activeMilestone.triageLevel === 'EMERGENCY'
                ? 'bg-rose-200 text-rose-900 font-extrabold'
                : 'bg-white/80 border text-slate-800'
            }`}>
              Triage Severity: {activeMilestone.severityScore}/10 ({activeMilestone.triageLevel})
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-800">
            {activeMilestone.description}
          </p>

          {activeMilestone.actionTaken && (
            <div className="text-[11px] font-semibold flex items-center gap-1.5 pt-1">
              <span className="text-orange-950 bg-white border border-orange-200 px-2 py-0.5 rounded-md">
                Intervention: {activeMilestone.actionTaken}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Drug Exposure Parallel Tracks vs Symptom Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Graphical Tracks */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Pill className="w-4 h-4 text-orange-600" />
              <span>Concomitant Drug Exposure Windows vs Latency Spike</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">Dechallenge Contrast</span>
          </div>

          {/* Parallel Medication Bars */}
          <div className="space-y-4 text-xs">
            {activeCase.drugsTimeline.map((drug, i) => {
              const maxDay = Math.max(...activeCase.milestones.map((m) => m.day));
              const isSuspected = drug.status === 'Suspected & Stopped';
              const isSupportive = drug.status === 'Supportive Therapy';

              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      {isSuspected && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      {isSupportive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      <span>{drug.name}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {drug.dosage} · {drug.status}
                    </span>
                  </div>

                  {/* Horizontal Bar Graphic */}
                  <div className="h-6 w-full bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200 flex items-center">
                    {/* Scrub marker line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-orange-600 z-20 transition-all duration-300"
                      style={{
                        left: `${(currentDayScrub / maxDay) * 100}%`,
                      }}
                    />

                    {isSuspected ? (
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-rose-700 rounded-lg flex items-center px-3 text-[10px] text-white font-bold transition-all shadow-xs"
                        style={{
                          width: `${((drug.endDay || maxDay) / maxDay) * 100}%`,
                        }}
                      >
                        Active Exposure (Days {drug.startDay} to {drug.endDay}) ➔ Stopped on Day {drug.endDay}
                      </div>
                    ) : isSupportive ? (
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center px-3 text-[10px] text-white font-bold transition-all ml-auto shadow-xs"
                        style={{
                          width: `${(((drug.endDay || maxDay) - drug.startDay) / maxDay) * 100}%`,
                        }}
                      >
                        Rescue Antidote (Days {drug.startDay} to {drug.endDay})
                      </div>
                    ) : (
                      <div
                        className="h-full w-full bg-slate-300 text-slate-700 flex items-center px-3 text-[10px] font-semibold"
                      >
                        Chronic Background Use (&gt;180 Days without ADR) · Temporally Non-Contributory
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Temporal Latency Rule Explanation */}
          <div className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-2xl text-xs space-y-1 text-slate-800">
            <strong className="text-orange-950 font-bold block">
              Pharmacovigilance Temporal Latency Principle:
            </strong>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              When a patient on multiple chronic medications develops an adverse event, the newest medication introduced within the classical latency window (e.g. 72–96 hours for aminopenicillin-induced exanthems) possesses the highest mathematical causality score, while long-tolerated baseline drugs are ruled out.
            </p>
          </div>
        </div>

        {/* Right Column (5 cols): Reaction Severity Graph & Milestones */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-600" />
              <span>Symptom Severity Curve (0-10)</span>
            </h4>
            <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Peak: Day 4
            </span>
          </div>

          {/* Visual Step-bars representing severity */}
          <div className="grid grid-cols-7 gap-1.5 items-end h-40 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            {activeCase.milestones.slice(0, 7).map((m, idx) => {
              const isSelected = activeMilestone.day === m.day;
              const heightPercent = Math.max(10, m.severityScore * 10);

              return (
                <div
                  key={idx}
                  onClick={() => setCurrentDayScrub(m.day)}
                  className="flex flex-col items-center justify-end h-full cursor-pointer group"
                >
                  <span className="text-[9px] font-mono text-slate-400 group-hover:text-slate-900 mb-1">
                    {m.severityScore}/10
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      m.severityScore >= 7
                        ? 'bg-rose-500 group-hover:bg-rose-600'
                        : m.severityScore >= 3
                        ? 'bg-amber-500 group-hover:bg-amber-600'
                        : 'bg-emerald-500 group-hover:bg-emerald-600'
                    } ${isSelected ? 'ring-2 ring-orange-500 shadow-md' : 'opacity-80'}`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-bold text-slate-700 mt-1">
                    D{m.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dechallenge Verification Proof */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1.5 text-emerald-950">
            <div className="flex items-center gap-2 font-black">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Positive Dechallenge Confirmed</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Upon withdrawal of Augmentin 625 at Day 4, symptom score dropped from 8/10 to 0/10 over 72 hours, confirming drug-induced etiology and fulfilling WHO-UMC causality criterion for 'Probable'.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
