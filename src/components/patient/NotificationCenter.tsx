import React, { useState, useEffect } from 'react';
import { Medicine, MedicationReminder, ReminderNotification } from '../../types/pv';
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Pill,
  Calendar,
  Sparkles,
  PhoneCall,
  X,
  Sliders,
  ShieldAlert,
} from 'lucide-react';

interface NotificationCenterProps {
  medicines: Medicine[];
  reminders: MedicationReminder[];
  onUpdateReminders: (reminders: MedicationReminder[]) => void;
  onTakeDose: (medicineId: string, reminderId: string) => void;
  onSkipDose: (medicineId: string, reminderId: string) => void;
  currentTimeStr?: string; // e.g. "10:30"
  onClose?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  medicines,
  reminders,
  onUpdateReminders,
  onTakeDose,
  onSkipDose,
  currentTimeStr = '10:30',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'missed_and_due' | 'reminders_list' | 'add_reminder'>('missed_and_due');
  const [soundFeedback, setSoundFeedback] = useState<string | null>(null);

  // Form for adding/editing reminder
  const [newReminderMedId, setNewReminderMedId] = useState<string>(medicines[0]?.id || '');
  const [newReminderTime, setNewReminderTime] = useState<string>('08:00');
  const [newReminderSlot, setNewReminderSlot] = useState<MedicationReminder['timeSlot']>('Morning');
  const [newReminderNotes, setNewReminderNotes] = useState<string>('Take with water after breakfast');

  // Play pleasant light-blue audio chime using Web Audio API
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Two-tone soothing harmonic chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5

      osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);

      setSoundFeedback('Chime played ♪');
      setTimeout(() => setSoundFeedback(null), 2000);
    } catch (e) {
      console.log('Audio chime not available:', e);
    }
  };

  // Identify missed doses
  // A reminder is missed if: isEnabled === true, takenToday === false, and scheduledTime < currentTimeStr
  const parseTimeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const currentMinutes = parseTimeToMinutes(currentTimeStr);

  const missedReminders = reminders.filter((r) => {
    if (!r.isEnabled || r.takenToday) return false;
    const remMinutes = parseTimeToMinutes(r.scheduledTime);
    return remMinutes < currentMinutes;
  });

  const dueSoonReminders = reminders.filter((r) => {
    if (!r.isEnabled || r.takenToday) return false;
    const remMinutes = parseTimeToMinutes(r.scheduledTime);
    return remMinutes >= currentMinutes && remMinutes <= currentMinutes + 120; // due in next 2 hours
  });

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r));
    onUpdateReminders(updated);
  };

  const handleToggleSound = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, soundEnabled: !r.soundEnabled } : r));
    onUpdateReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    onUpdateReminders(updated);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const med = medicines.find((m) => m.id === newReminderMedId);
    if (!med) return;

    const newRem: MedicationReminder = {
      id: `rem-${Date.now().toString().slice(-4)}`,
      medicineId: med.id,
      medicineName: med.brandName,
      dosage: med.strength,
      timeSlot: newReminderSlot,
      scheduledTime: newReminderTime,
      instructions: newReminderNotes,
      isEnabled: true,
      soundEnabled: true,
      takenToday: false,
    };

    onUpdateReminders([newRem, ...reminders]);
    setActiveTab('reminders_list');
    playChime();
  };

  return (
    <div className="bg-white rounded-3xl border border-sky-200 shadow-xl overflow-hidden flex flex-col text-slate-900">
      {/* Light Blue Header Banner */}
      <div className="bg-gradient-to-r from-sky-100 via-blue-50 to-sky-50 border-b border-sky-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-sky-950">Medication Reminders & Notification Center</h3>
              {missedReminders.length > 0 && (
                <span className="text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  {missedReminders.length} Missed Dose{missedReminders.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-xs text-sky-800">
              Current Patient Clock: <strong className="font-mono text-sky-900">{currentTimeStr} AM</strong> · Daily Adherence Guardian
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={playChime}
            className="px-2.5 py-1.5 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
            title="Test reminder chime sound"
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Test Sound</span>
          </button>
          {soundFeedback && (
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              {soundFeedback}
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Segmented Navigation in Light Blue Theme */}
      <div className="bg-sky-50/70 p-2 border-b border-sky-200 flex items-center gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('missed_and_due')}
          className={`py-1.5 px-3 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'missed_and_due'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-sky-900 hover:bg-white/80'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>
            Missed & Due Doses ({missedReminders.length + dueSoonReminders.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reminders_list')}
          className={`py-1.5 px-3 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'reminders_list'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-sky-900 hover:bg-white/80'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>All Daily Reminders ({reminders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('add_reminder')}
          className={`py-1.5 px-3 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'add_reminder'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-sky-900 hover:bg-white/80'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Set New Daily Reminder</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
        {/* ================= TAB 1: MISSED DOSE ALERTS & UPCOMING ================= */}
        {activeTab === 'missed_and_due' && (
          <div className="space-y-6">
            {/* Primary Missed Dose Alert Box */}
            {missedReminders.length > 0 ? (
              <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border-2 border-rose-300 rounded-3xl p-5 space-y-4 shadow-sm animate-in fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md animate-bounce">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-rose-950 flex items-center gap-2">
                        <span>Missed Dose Alert Detected!</span>
                        <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-mono uppercase">
                          Action Required
                        </span>
                      </h4>
                      <p className="text-xs text-rose-800 mt-0.5">
                        The scheduled time has passed for the following prescription doses. Please take now or log your status to maintain accurate pharmacovigilance causality records.
                      </p>
                    </div>
                  </div>
                </div>

                {/* List of Missed Reminders */}
                <div className="space-y-3">
                  {missedReminders.map((r) => {
                    const elapsedMin = currentMinutes - parseTimeToMinutes(r.scheduledTime);
                    const hoursPassed = Math.floor(elapsedMin / 60);
                    const minsPassed = elapsedMin % 60;
                    const elapsedText =
                      hoursPassed > 0
                        ? `${hoursPassed} hr ${minsPassed > 0 ? `${minsPassed} min` : ''} overdue`
                        : `${minsPassed} min overdue`;

                    return (
                      <div
                        key={r.id}
                        className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{r.medicineName}</span>
                            <span className="text-xs font-mono font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                              {r.dosage}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              · Scheduled: <strong>{r.scheduledTime} AM</strong>
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            Instructions: <span className="italic">{r.instructions || 'Standard oral administration'}</span>
                          </p>
                          <div className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Scheduled time passed ({elapsedText})</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              onTakeDose(r.medicineId, r.id);
                              playChime();
                            }}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>Take Dose Now ✓</span>
                          </button>
                          <button
                            onClick={() => onSkipDose(r.medicineId, r.id)}
                            className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-800 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
                          >
                            Skip / Withhold
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-center justify-between">
                  <span>
                    💡 <strong>Clinical Guidance:</strong> For polypharmacy patients aged 60+, if you miss a dose by more than 4 hours, do not take a double dose.
                  </span>
                  <a
                    href="tel:108"
                    className="font-bold text-rose-700 hover:underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Helpline</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-sky-50/60 rounded-3xl border border-sky-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-sky-950">No Missed Doses Detected!</h4>
                <p className="text-xs text-sky-800 max-w-md mx-auto">
                  You are completely on schedule with your daily prescriptions. Keep up the excellent adherence to ensure optimal drug safety and effectiveness.
                </p>
              </div>
            )}

            {/* Upcoming Doses Due Soon */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Upcoming Doses Scheduled Today</span>
              </h4>

              {dueSoonReminders.length > 0 ? (
                <div className="space-y-2.5">
                  {dueSoonReminders.map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-2xl flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{r.medicineName}</span>
                          <span className="text-xs text-sky-800 font-mono">({r.dosage})</span>
                          <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full border border-sky-200">
                            Due at {r.scheduledTime}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{r.instructions}</p>
                      </div>

                      <button
                        onClick={() => {
                          onTakeDose(r.medicineId, r.id);
                          playChime();
                        }}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Take Early</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No additional doses due in the next 2 hours.</p>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: REMINDERS LIST ================= */}
        {activeTab === 'reminders_list' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-sky-950">Daily Medication Reminder Schedule</h4>
                <p className="text-xs text-sky-800">
                  Dose Guard alerts you with sound and screen notifications at your prescribed times
                </p>
              </div>
              <button
                onClick={() => setActiveTab('add_reminder')}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Reminder</span>
              </button>
            </div>

            <div className="space-y-3">
              {reminders.map((r) => {
                const isMissed = !r.takenToday && parseTimeToMinutes(r.scheduledTime) < currentMinutes && r.isEnabled;

                return (
                  <div
                    key={r.id}
                    className={`p-4 bg-white rounded-2xl border transition-all ${
                      isMissed
                        ? 'border-rose-300 bg-rose-50/20 shadow-xs'
                        : r.takenToday
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-sky-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{r.medicineName}</span>
                          <span className="text-xs font-mono font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                            {r.dosage}
                          </span>
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {r.timeSlot}
                          </span>
                          {r.takenToday ? (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Taken Today
                            </span>
                          ) : isMissed ? (
                            <span className="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Overdue
                            </span>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-600">
                          <span className="flex items-center gap-1 font-mono font-semibold text-slate-900">
                            <Clock className="w-3.5 h-3.5 text-sky-600" />
                            {r.scheduledTime}
                          </span>
                          <span>· {r.instructions}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleSound(r.id)}
                          className={`p-2 rounded-xl border text-xs transition-colors ${
                            r.soundEnabled
                              ? 'bg-sky-50 text-sky-700 border-sky-300'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}
                          title={r.soundEnabled ? 'Chime sound enabled' : 'Muted'}
                        >
                          {r.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleToggleReminder(r.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                            r.isEnabled
                              ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                              : 'bg-slate-100 text-slate-500 border-slate-300'
                          }`}
                        >
                          {r.isEnabled ? 'Active' : 'Paused'}
                        </button>

                        {!r.takenToday && (
                          <button
                            onClick={() => {
                              onTakeDose(r.medicineId, r.id);
                              playChime();
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                          >
                            Mark Taken
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteReminder(r.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete reminder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: ADD NEW REMINDER ================= */}
        {activeTab === 'add_reminder' && (
          <form onSubmit={handleAddReminder} className="bg-sky-50/60 p-5 rounded-3xl border border-sky-200 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-sky-950">Configure New Daily Reminder</h4>
              <p className="text-xs text-sky-800">
                Set exact reminder times and audio notifications for any prescribed medication
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Medication</label>
                <select
                  value={newReminderMedId}
                  onChange={(e) => setNewReminderMedId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-sky-500"
                >
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brandName} ({m.strength}) - {m.frequency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Scheduled Time (HH:MM)</label>
                <input
                  type="time"
                  value={newReminderTime}
                  onChange={(e) => setNewReminderTime(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-sky-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Time Slot</label>
                <select
                  value={newReminderSlot}
                  onChange={(e) => setNewReminderSlot(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-sky-500"
                >
                  <option value="Morning">Morning (Breakfast / Empty Stomach)</option>
                  <option value="Afternoon">Afternoon (Post-Lunch)</option>
                  <option value="Evening">Evening (Dinner)</option>
                  <option value="Bedtime">Bedtime (Night)</option>
                  <option value="Custom">Custom Interval</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Instructions / Note</label>
                <input
                  type="text"
                  value={newReminderNotes}
                  onChange={(e) => setNewReminderNotes(e.target.value)}
                  placeholder="e.g. Take with warm water after dinner"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('reminders_list')}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Bell className="w-4 h-4" />
                <span>Save Reminder</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-sky-50/80 border-t border-sky-200 px-6 py-3 flex items-center justify-between text-[11px] text-sky-800">
        <span>
          Dose Guard Notification Engine · Reminders trigger sound, visual highlights, and causality recalculations
        </span>
        <span className="font-mono font-semibold">Adherence Mode: Active</span>
      </div>
    </div>
  );
};
