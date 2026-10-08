import React, { useState } from 'react';
import { Medicine } from '../../types/pv';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Pill,
  Sun,
  Sunset,
  Moon,
  Coffee,
  Info,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

interface MedicationTimelineGridProps {
  medicines: Medicine[];
  onUpdateMedicineStatus: (id: string, status: Medicine['status']) => void;
  onOpenReport?: (preselectedMed?: Medicine) => void;
}

interface DoseSlot {
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime';
  label: string;
  hour: string;
  icon: any;
  color: string;
  bgLight: string;
  borderLight: string;
}

const DOSE_SLOTS: DoseSlot[] = [
  {
    timeSlot: 'Morning',
    label: 'Morning (Breakfast & Empty Stomach)',
    hour: '08:00 AM',
    icon: Sun,
    color: 'text-amber-500',
    bgLight: 'bg-amber-500/10',
    borderLight: 'border-amber-500/20',
  },
  {
    timeSlot: 'Afternoon',
    label: 'Afternoon (Post-Lunch)',
    hour: '01:30 PM',
    icon: Coffee,
    color: 'text-blue-500',
    bgLight: 'bg-blue-500/10',
    borderLight: 'border-blue-500/20',
  },
  {
    timeSlot: 'Evening',
    label: 'Evening (Dinner)',
    hour: '07:30 PM',
    icon: Sunset,
    color: 'text-indigo-500',
    bgLight: 'bg-indigo-500/10',
    borderLight: 'border-indigo-500/20',
  },
  {
    timeSlot: 'Bedtime',
    label: 'Night (Bedtime)',
    hour: '10:00 PM',
    icon: Moon,
    color: 'text-purple-500',
    bgLight: 'bg-purple-500/10',
    borderLight: 'border-purple-500/20',
  },
];

const WEEK_DAYS = [
  { day: 'Day 0', date: '01 Oct (Thu)', label: 'Antibiotic Start', isNewMedAdded: true, summary: 'Augmentin 625 started for bronchitis' },
  { day: 'Day 1', date: '02 Oct (Fri)', label: 'Doses Taken', isNormal: true, summary: 'All 6 medications tolerated' },
  { day: 'Day 2', date: '03 Oct (Sat)', label: 'Itching Commenced', hasSymptom: true, symptomType: 'pruritus', summary: 'Mild cutaneous itching noted post dose 3' },
  { day: 'Day 3', date: '04 Oct (Sun)', label: 'Rash & Lip Edema', hasSymptom: true, symptomType: 'emergency', summary: 'Red-flag hypersensitivity & angioedema' },
  { day: 'Day 4', date: '05 Oct (Mon)', label: 'Antibiotic Withheld', isDechallenge: true, summary: 'Augmentin stopped under clinical advice' },
  { day: 'Day 5', date: '06 Oct (Tue)', label: 'Rash Regressing', isImproving: true, summary: 'Positive dechallenge response observed' },
  { day: 'Day 6', date: '07 Oct (Wed)', label: 'Recovery Phase', isNormal: true, summary: 'Baseline maintenance continued safely' },
];

export const MedicationTimelineGrid: React.FC<MedicationTimelineGridProps> = ({
  medicines,
  onUpdateMedicineStatus,
  onOpenReport,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(3); // Default Day 3 (Sunday Oct 04 - Emergency Event)
  const [filterType, setFilterType] = useState<'all' | 'suspected' | 'active'>('all');
  const [activeViewMode, setActiveViewMode] = useState<'calendar_day' | 'week_matrix'>('calendar_day');

  // Adherence log state: key = `${medId}-${dayIdx}`
  const [takenDoses, setTakenDoses] = useState<Record<string, { taken: boolean; timestamp?: string }>>({
    'med-01-0': { taken: true, timestamp: '08:12 AM' },
    'med-01-1': { taken: true, timestamp: '08:05 AM' },
    'med-01-2': { taken: true, timestamp: '08:30 AM' },
    'med-02-0': { taken: true, timestamp: '01:35 PM' },
    'med-02-1': { taken: true, timestamp: '01:40 PM' },
    'med-02-2': { taken: true, timestamp: '01:25 PM' },
    'med-02-3': { taken: true, timestamp: '01:30 PM' },
    'med-03-0': { taken: true, timestamp: '07:45 PM' },
    'med-03-1': { taken: true, timestamp: '07:50 PM' },
    'med-03-2': { taken: true, timestamp: '07:35 PM' },
    'med-03-3': { taken: true, timestamp: '07:40 PM' },
    'med-04-0': { taken: true, timestamp: '10:05 PM' },
    'med-04-1': { taken: true, timestamp: '10:00 PM' },
    'med-04-2': { taken: true, timestamp: '10:15 PM' },
    'med-04-3': { taken: true, timestamp: '10:10 PM' },
    'med-05-0': { taken: true, timestamp: '07:30 AM' },
    'med-05-1': { taken: true, timestamp: '07:35 AM' },
    'med-05-2': { taken: true, timestamp: '07:32 AM' },
    'med-05-3': { taken: true, timestamp: '07:40 AM' },
    'med-06-0': { taken: true, timestamp: '01:45 PM' },
    'med-06-1': { taken: true, timestamp: '01:40 PM' },
    'med-06-2': { taken: true, timestamp: '01:50 PM' },
    'med-06-3': { taken: true, timestamp: '01:45 PM' },
  });

  const toggleDose = (medId: string, dayIdx: number) => {
    const key = `${medId}-${dayIdx}`;
    setTakenDoses((prev) => {
      const current = prev[key]?.taken;
      if (current) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      } else {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          ...prev,
          [key]: { taken: true, timestamp: timeStr },
        };
      }
    });
  };

  const filteredMeds = medicines.filter((m) => {
    if (filterType === 'suspected') return m.isSuspected;
    if (filterType === 'active') return m.status === 'active';
    return true;
  });

  // Helper to map medication frequency to appropriate time slots
  const getMedSlots = (med: Medicine): DoseSlot['timeSlot'][] => {
    const freq = med.frequency.toLowerCase();
    if (freq.includes('twice') || freq.includes('bd') || freq.includes('b.i.d')) {
      return ['Morning', 'Evening'];
    }
    if (freq.includes('thrice') || freq.includes('tid') || freq.includes('t.i.d')) {
      return ['Morning', 'Afternoon', 'Evening'];
    }
    if (freq.includes('bedtime') || freq.includes('night') || freq.includes('hs')) {
      return ['Bedtime'];
    }
    if (freq.includes('lunch') || freq.includes('post-lunch') || freq.includes('afternoon')) {
      return ['Afternoon'];
    }
    if (freq.includes('morning') || freq.includes('breakfast') || freq.includes('empty stomach') || freq.includes('od')) {
      return ['Morning'];
    }
    return ['Morning'];
  };

  const selectedDayInfo = WEEK_DAYS[selectedDayIndex];

  // Adherence stats
  const totalMedsCount = medicines.length;
  const activeMedsCount = medicines.filter((m) => m.status === 'active').length;
  const suspectedMedsCount = medicines.filter((m) => m.isSuspected).length;

  const currentDayDosesLogged = Object.keys(takenDoses).filter(
    (k) => k.endsWith(`-${selectedDayIndex}`) && takenDoses[k]?.taken
  ).length;

  return (
    <div className="space-y-5">
      {/* Top Hero Banner with Warm Light Orange Theme */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/80 rounded-3xl p-5 sm:p-6 text-slate-900 border border-orange-200 shadow-sm relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-200/80 text-orange-950 border border-orange-300 px-2.5 py-0.5 rounded-full">
                Calendar Timeline & Adherence Grid
              </span>
              <span className="text-xs text-orange-800 font-mono flex items-center gap-1 font-semibold">
                <Clock className="w-3 h-3 text-orange-600" />
                <span>Polypharmacy Cohort (6 Prescriptions)</span>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1.5 flex items-center gap-2">
              <span>Medication Dosing & Temporal Timeline</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
              Track daily dose administration, dosing frequency, and chronological adverse symptom onset to support WHO-UMC temporal causality ($C_{'{'}ADR{'}'}$) verification.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-3 gap-2 bg-white/90 p-2 rounded-2xl border border-orange-200 shadow-xs self-start md:self-auto shrink-0 text-center">
            <div className="px-3 py-1.5">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Active Meds</span>
              <span className="text-base font-extrabold text-slate-900 font-mono">{activeMedsCount}</span>
            </div>
            <div className="px-3 py-1.5 border-x border-orange-100">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Logged Today</span>
              <span className="text-base font-extrabold text-orange-600 font-mono">
                {currentDayDosesLogged}/{filteredMeds.length}
              </span>
            </div>
            <div className="px-3 py-1.5">
              <span className="text-[10px] text-rose-500 block uppercase font-medium">Suspected ADR</span>
              <span className="text-base font-extrabold text-rose-600 font-mono">{suspectedMedsCount}</span>
            </div>
          </div>
        </div>

        {/* View Toggle Bar */}
        <div className="relative z-10 mt-5 pt-4 border-t border-orange-200/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-orange-200 shadow-xs text-xs">
            <button
              onClick={() => setActiveViewMode('calendar_day')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeViewMode === 'calendar_day'
                  ? 'bg-orange-500 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Daily Dose Schedule</span>
            </button>
            <button
              onClick={() => setActiveViewMode('week_matrix')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeViewMode === 'week_matrix'
                  ? 'bg-orange-500 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>7-Day Full Matrix Grid</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-orange-200 shadow-xs text-xs">
            <span className="text-[11px] text-slate-500 px-2 font-medium flex items-center gap-1">
              <Filter className="w-3 h-3 text-orange-500" />
              Filter:
            </span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterType === 'all'
                  ? 'bg-orange-500 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({medicines.length})
            </button>
            <button
              onClick={() => setFilterType('suspected')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterType === 'suspected'
                  ? 'bg-rose-500 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Suspected ADR
            </button>
            <button
              onClick={() => setFilterType('active')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filterType === 'active'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Interactive Calendar Strip */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                7-Day Chronological Reaction Strip
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Tap any day to inspect administered doses and adverse events
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            Oct 01 – Oct 07, 2026
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {WEEK_DAYS.map((item, idx) => {
            const isSelected = selectedDayIndex === idx;
            const isEmergency = item.symptomType === 'emergency';
            const isPruritus = item.symptomType === 'pruritus';

            return (
              <button
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-2 sm:p-3 rounded-2xl border text-xs transition-all relative flex flex-col items-center justify-between min-h-[88px] text-left cursor-pointer ${
                  isSelected
                    ? isEmergency
                      ? 'bg-gradient-to-b from-rose-600 to-rose-700 text-white border-rose-600 shadow-lg ring-2 ring-rose-400/40 transform -translate-y-0.5'
                      : 'bg-gradient-to-b from-indigo-600 to-blue-700 text-white border-indigo-600 shadow-lg ring-2 ring-indigo-400/40 transform -translate-y-0.5'
                    : isEmergency
                    ? 'bg-rose-50 border-rose-200 text-rose-950 hover:bg-rose-100'
                    : isPruritus
                    ? 'bg-amber-50 border-amber-200 text-amber-950 hover:bg-amber-100'
                    : item.isDechallenge
                    ? 'bg-sky-50 border-sky-200 text-sky-950 hover:bg-sky-100'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    {item.day}
                  </span>
                  {item.isNewMedAdded && (
                    <span
                      className="w-2 h-2 rounded-full bg-blue-400 ring-2 ring-white"
                      title="New Medication Initiated"
                    />
                  )}
                </div>

                <div className="my-1 text-center w-full">
                  <span className="text-xs sm:text-sm font-extrabold font-mono block leading-tight">
                    {item.date.split(' ')[0]}
                  </span>
                  <span className={`text-[10px] block ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {item.date.split(' ')[1].replace('(', '').replace(')', '')}
                  </span>
                </div>

                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-semibold truncate max-w-full text-center ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isEmergency
                      ? 'bg-rose-200 text-rose-900 font-bold'
                      : isPruritus
                      ? 'bg-amber-200 text-amber-900 font-medium'
                      : item.isDechallenge
                      ? 'bg-sky-200 text-sky-900 font-medium'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Clinical Context & ADR Alert Banner */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border text-xs shadow-sm transition-all ${
          selectedDayInfo.symptomType === 'emergency'
            ? 'bg-gradient-to-r from-rose-50 via-rose-100/50 to-amber-50 border-rose-200 text-rose-950'
            : selectedDayInfo.symptomType === 'pruritus'
            ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/50 border-amber-200 text-amber-950'
            : selectedDayInfo.isDechallenge
            ? 'bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-sky-200 text-sky-950'
            : selectedDayInfo.isNewMedAdded
            ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border-blue-200 text-blue-950'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                selectedDayInfo.symptomType === 'emergency'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse'
                  : selectedDayInfo.symptomType === 'pruritus'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : selectedDayInfo.isDechallenge
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : selectedDayInfo.isNewMedAdded
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-700 text-white'
              }`}
            >
              {selectedDayInfo.symptomType === 'emergency' ? (
                <ShieldAlert className="w-5 h-5" />
              ) : selectedDayInfo.symptomType === 'pruritus' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : selectedDayInfo.isDechallenge ? (
                <Info className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm uppercase tracking-wide">
                  {selectedDayInfo.day} · {selectedDayInfo.date}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    selectedDayInfo.symptomType === 'emergency'
                      ? 'bg-rose-200 text-rose-900 border border-rose-300'
                      : selectedDayInfo.symptomType === 'pruritus'
                      ? 'bg-amber-200 text-amber-900 border border-amber-300'
                      : selectedDayInfo.isDechallenge
                      ? 'bg-sky-200 text-sky-900 border border-sky-300'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {selectedDayInfo.label}
                </span>
              </div>
              <p className="mt-1 font-medium leading-relaxed max-w-2xl text-slate-700">
                {selectedDayInfo.symptomType === 'emergency'
                  ? 'Critical Red-Flag ADR Triggered: Generalized rash + acute lip angioedema observed 48 hours post Augmentin 625 Duo addition. Temporal causality fit scored as High Priority (84/100).'
                  : selectedDayInfo.symptomType === 'pruritus'
                  ? 'Early Warning: Pruritus began after dose 3 of newly initiated antibiotic. Baseline medications (Metformin, Amlodipine, Aspirin, Pantoprazole, Atorvastatin) stable.'
                  : selectedDayInfo.isDechallenge
                  ? 'Dechallenge Maneuver: Augmentin 625 withheld under clinical advice. Continued monitoring for symptom clearance to confirm positive dechallenge ($R$ parameter).'
                  : selectedDayInfo.summary}
              </p>
            </div>
          </div>

          {onOpenReport && (
            <button
              onClick={() => onOpenReport()}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 shadow-md transition-transform active:scale-95 flex items-center gap-1.5 self-start sm:self-auto ${
                selectedDayInfo.symptomType === 'emergency'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              }`}
            >
              <span>{selectedDayInfo.hasSymptom ? 'View Full ADR Report' : 'Log New Reaction'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ================= VIEW 1: DAILY DOSE SCHEDULE (BY FREQUENCY & TIME SLOTS) ================= */}
      {activeViewMode === 'calendar_day' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>Daily Dosing Schedule</span>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                  {selectedDayInfo.day} ({selectedDayInfo.date})
                </span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Displays exact prescribed dose frequency for each medicine. Tap any dose card to toggle taken status.
              </p>
            </div>

            <span className="text-xs font-mono font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-xl border border-sky-200 self-start sm:self-auto">
              Adherence: {currentDayDosesLogged} of {filteredMeds.length} Doses Logged
            </span>
          </div>

          {/* Dosing Time Slots */}
          <div className="space-y-6">
            {DOSE_SLOTS.map((slot) => {
              const SlotIcon = slot.icon;
              const medsInSlot = filteredMeds.filter((m) => getMedSlots(m).includes(slot.timeSlot));

              if (medsInSlot.length === 0) return null;

              return (
                <div key={slot.timeSlot} className="space-y-3">
                  {/* Slot Title Banner */}
                  <div className="flex items-center justify-between bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl ${slot.bgLight} ${slot.color} flex items-center justify-center font-bold`}>
                        <SlotIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">{slot.label}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                      {slot.hour}
                    </span>
                  </div>

                  {/* Medication Cards in this Time Slot */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {medsInSlot.map((med) => {
                      const doseKey = `${med.id}-${selectedDayIndex}`;
                      const logInfo = takenDoses[doseKey];
                      const isTaken = logInfo?.taken ?? false;
                      const isWithheld = selectedDayIndex >= 4 && med.isSuspected;

                      return (
                        <div
                          key={med.id}
                          className={`p-4 rounded-2xl border transition-all duration-200 ${
                            isWithheld
                              ? 'bg-slate-100/80 border-slate-300 opacity-75'
                              : isTaken
                              ? 'bg-gradient-to-r from-sky-50/70 to-blue-50/40 border-sky-300 shadow-xs'
                              : med.isSuspected
                              ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                              : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 font-bold ${
                                  med.isSuspected
                                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                }`}
                              >
                                <Pill className="w-4 h-4" />
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                                    {med.brandName}
                                  </span>
                                  <span className="text-[11px] font-mono text-slate-500 font-semibold">
                                    ({med.strength})
                                  </span>
                                </div>

                                <span className="text-xs text-slate-600 block mt-0.5">
                                  {med.genericName}
                                </span>

                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                  <span className="text-[10px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                    Freq: {med.frequency}
                                  </span>
                                  <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                    Indication: {med.indication}
                                  </span>
                                  {med.isSuspected && (
                                    <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-300 flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                                      Suspected ADR
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Checkbox / Action Button */}
                            <div className="shrink-0 flex flex-col items-end gap-1.5">
                              {isWithheld ? (
                                <div className="text-right">
                                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-lg block">
                                    Withheld
                                  </span>
                                  <span className="text-[9px] text-slate-400 block mt-0.5">Dechallenge</span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => toggleDose(med.id, selectedDayIndex)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                                    isTaken
                                      ? 'bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-700'
                                      : 'bg-white border border-slate-300 text-slate-700 hover:border-indigo-600 hover:text-indigo-600'
                                  }`}
                                >
                                  {isTaken ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 text-white" />
                                      <span>Taken ✓</span>
                                    </>
                                  ) : (
                                    <span>Mark Taken</span>
                                  )}
                                </button>
                              )}

                              {isTaken && logInfo?.timestamp && (
                                <span className="text-[10px] font-mono text-slate-400">
                                  {logInfo.timestamp}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick Report Side Effect link */}
                          {onOpenReport && (
                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                              <span className="text-slate-400 font-mono">Prescribed by {med.prescriber}</span>
                              <button
                                onClick={() => onOpenReport(med)}
                                className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                              >
                                <span>Report side effect</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= VIEW 2: 7-DAY ADHERENCE & FREQUENCY MATRIX TABLE ================= */}
      {activeViewMode === 'week_matrix' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Full 7-Day Medication Adherence Matrix
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of daily dose compliance across all prescribed regimens from initiation (Day 0) through recovery (Day 6).
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-600 text-white text-[8px] flex items-center justify-center font-bold">✓</span>
                Taken
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-100 text-amber-800 text-[8px] flex items-center justify-center font-bold">⏸</span>
                Withheld (ADR)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded border border-slate-300 text-slate-400 text-[8px] flex items-center justify-center">·</span>
                Scheduled
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/80">
                  <th className="py-3 px-3 rounded-l-xl">Medication & Generic</th>
                  <th className="py-3 px-2">Frequency</th>
                  {WEEK_DAYS.map((d, i) => (
                    <th
                      key={i}
                      className={`py-3 px-2 text-center font-mono ${
                        d.symptomType === 'emergency'
                          ? 'text-rose-700 font-extrabold bg-rose-50/80'
                          : d.symptomType === 'pruritus'
                          ? 'text-amber-700 font-extrabold bg-amber-50/80'
                          : d.isDechallenge
                          ? 'text-sky-700 font-extrabold bg-sky-50/80'
                          : 'text-slate-700'
                      }`}
                    >
                      <span className="block font-bold">{d.day.split(' ')[1]}</span>
                      <span className="text-[9px] font-normal text-slate-400 block leading-tight">
                        {d.date.split(' ')[0]}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMeds.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 block">{med.brandName}</span>
                        {med.isSuspected && (
                          <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded border border-rose-200">
                            ADR
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block">{med.genericName} · {med.strength}</span>
                    </td>
                    <td className="py-3 px-2 text-[11px] text-slate-600 font-medium">
                      {med.frequency}
                    </td>

                    {WEEK_DAYS.map((_, dayIdx) => {
                      const isWithheld = dayIdx >= 4 && med.isSuspected;
                      const isTaken = takenDoses[`${med.id}-${dayIdx}`]?.taken ?? false;

                      return (
                        <td
                          key={dayIdx}
                          onClick={() => !isWithheld && toggleDose(med.id, dayIdx)}
                          className="py-3 px-2 text-center cursor-pointer hover:bg-indigo-50/40"
                        >
                          {isWithheld ? (
                            <span
                              className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300"
                              title="Medication withheld due to suspected ADR"
                            >
                              ⏸
                            </span>
                          ) : isTaken ? (
                            <span
                              className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs"
                              title="Dose confirmed taken"
                            >
                              ✓
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center justify-center w-6 h-6 rounded-lg border border-slate-300 text-slate-400 text-xs hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                              title="Click to mark as taken"
                            >
                              ·
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Temporal Causality & Safety Analysis Card - Warm Light Orange Theme */}
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/70 rounded-3xl p-5 sm:p-6 text-slate-900 border border-orange-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              WHO-UMC Pharmacovigilance Temporal Correlation
            </h4>
          </div>
          <span className="text-[10px] font-mono text-orange-900 bg-orange-200/80 border border-orange-300 px-2.5 py-0.5 rounded-full font-bold">
            $C_{'{'}ADR{'}'} = 84/100$
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          The calendar grid establishes that <strong>Augmentin 625 Duo</strong> was initiated on <strong>Day 0 (Oct 01)</strong>. Symptoms manifested precisely 48 hours later on <strong>Day 2 (Pruritus)</strong> and culminated on <strong>Day 3 (Lip angioedema)</strong>. Chronic baseline medications (Metformin, Amlodipine, Aspirin, Atorvastatin, Pantoprazole) have been safely administered for &gt;12 months without adverse incidents, confirming strong drug-event temporal association.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <div className="p-3 bg-white rounded-xl border border-orange-200 text-xs shadow-xs">
            <span className="text-orange-800 font-mono text-[10px] block uppercase font-bold">1. Drug Initiation</span>
            <span className="font-bold text-slate-900 mt-0.5 block">Day 0 · Oct 01</span>
            <span className="text-[11px] text-slate-600">Augmentin started</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-rose-300 text-xs shadow-xs">
            <span className="text-rose-600 font-mono text-[10px] block uppercase font-bold">2. Acute Reaction</span>
            <span className="font-bold text-slate-900 mt-0.5 block">Day 2–3 · Oct 03–04</span>
            <span className="text-[11px] text-slate-600">Rash + Angioedema</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-amber-300 text-xs shadow-xs">
            <span className="text-amber-800 font-mono text-[10px] block uppercase font-bold">3. Dechallenge Action</span>
            <span className="font-bold text-slate-900 mt-0.5 block">Day 4 · Oct 05</span>
            <span className="text-[11px] text-slate-600">Drug withheld &amp; resolving</span>
          </div>
        </div>
      </div>
    </div>
  );
};
