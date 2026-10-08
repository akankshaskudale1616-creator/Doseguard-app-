import React, { useState } from 'react';
import { DirectChatMessage, TelehealthAppointment } from '../../types/pv';
import {
  MessageSquare,
  Video,
  Send,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  PhoneCall,
  Pill,
} from 'lucide-react';

interface PhysicianPharmacyContactViewProps {
  chatMessages: DirectChatMessage[];
  onSendMessage: (msg: DirectChatMessage) => void;
  appointments: TelehealthAppointment[];
  onBookAppointment: (apt: TelehealthAppointment) => void;
}

export const PhysicianPharmacyContactView: React.FC<PhysicianPharmacyContactViewProps> = ({
  chatMessages,
  onSendMessage,
  appointments,
  onBookAppointment,
}) => {
  const [activeContactTarget, setActiveContactTarget] = useState<'pharmacist' | 'physician'>('physician');
  const [inputText, setInputText] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [appointmentReason, setAppointmentReason] = useState('Cutaneous rash review and medication follow-up');
  const [appointmentType, setAppointmentType] = useState<'Virtual Telehealth' | 'In-person'>('Virtual Telehealth');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const filteredMessages = chatMessages.filter(
    (m) =>
      (m.sender === 'patient' && m.recipient === activeContactTarget) ||
      (m.recipient === 'patient' && m.sender === activeContactTarget)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: DirectChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'patient',
      senderName: 'Ramesh V. Kulkarni (Patient)',
      recipient: activeContactTarget,
      text: inputText.trim(),
      timestamp: 'Just now',
    };

    onSendMessage(newMsg);
    setInputText('');
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: TelehealthAppointment = {
      id: `APT-${Date.now().toString().slice(-3)}`,
      patientId: 'PAT-6801',
      patientName: 'Ramesh V. Kulkarni',
      doctorName: activeContactTarget === 'physician' ? 'Dr. Ananya Deshmukh, MD' : 'Vinayak Joshi, R.Ph.',
      specialty: activeContactTarget === 'physician' ? 'Chest & Internal Medicine' : 'Community Clinical Pharmacy',
      dateTime: 'Tomorrow, 11:00 AM',
      type: appointmentType,
      status: 'Scheduled',
      meetUrl: 'https://meet.jit.si/DoseGuard-Consult-PAT6801',
      reason: appointmentReason,
    };
    onBookAppointment(newApt);
    setIsBookingModalOpen(false);
    setBookingSuccess(`Appointment booked successfully with ${newApt.doctorName} for ${newApt.dateTime}!`);
    setTimeout(() => setBookingSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Booking confirmation alert */}
      {bookingSuccess && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-900 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold">{bookingSuccess}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
            Confirmed
          </span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-sky-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200 uppercase">
            Direct Clinical Link
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">
            Physician & Community Pharmacist Direct Contact
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time encrypted chat for medication queries, side-effect reporting, and 1-click Telehealth appointment scheduling.
          </p>
        </div>

        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Video className="w-4 h-4" />
          <span>Book Telehealth Consultation</span>
        </button>
      </div>

      {/* Main Grid: Scheduled Consultations (40%) + Direct Chat (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Scheduled Telehealth Appointments */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  My Consultations & Appointments ({appointments.length})
                </h4>
              </div>
              <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
                Upcoming
              </span>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 bg-sky-50/50 rounded-2xl border border-sky-200 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm block">{apt.doctorName}</span>
                      <p className="text-xs text-slate-500 font-medium">{apt.specialty}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-white text-sky-900 border border-sky-200 px-2 py-0.5 rounded-full">
                      {apt.type}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-sky-100 text-xs text-slate-700 space-y-1">
                    <div className="flex items-center justify-between text-slate-900 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        {apt.dateTime}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic">Reason: {apt.reason}</p>
                  </div>

                  {apt.meetUrl && (
                    <a
                      href={apt.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Virtual Telehealth Call Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Direct Messaging Console */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex flex-col h-[520px]">
            {/* Target Switcher: [Attending Physician] [Community Pharmacist] */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveContactTarget('physician')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeContactTarget === 'physician'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Dr. Ananya Deshmukh (Physician)</span>
                </button>

                <button
                  onClick={() => setActiveContactTarget('pharmacist')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeContactTarget === 'pharmacist'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Pill className="w-3.5 h-3.5" />
                  <span>Vinayak Joshi, R.Ph. (Pharmacist)</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                Online
              </span>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No previous messages with this clinical contact. Send a question below.
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isPatient = msg.sender === 'patient';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                        {msg.senderName} · {msg.timestamp}
                      </span>
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isPatient
                            ? 'bg-sky-600 text-white rounded-br-xs'
                            : 'bg-slate-100 text-slate-900 rounded-bl-xs border border-slate-200'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSend} className="pt-3 border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeContactTarget === 'physician' ? 'Dr. Deshmukh' : 'Pharmacist Vinayak'} directly...`}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
              <button
                type="submit"
                className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl shadow-xs transition-all active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Telehealth Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-sky-600" />
                <h4 className="text-sm font-bold text-slate-900">Schedule Telehealth Appointment</h4>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Clinician:</label>
                <select
                  value={activeContactTarget}
                  onChange={(e) => setActiveContactTarget(e.target.value as 'physician' | 'pharmacist')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="physician">Dr. Ananya Deshmukh, MD (Attending Chest Physician)</option>
                  <option value="pharmacist">Vinayak Joshi, R.Ph. (Community Clinical Pharmacist)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Consultation Mode:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAppointmentType('Virtual Telehealth')}
                    className={`py-2 rounded-xl font-bold border text-xs ${
                      appointmentType === 'Virtual Telehealth'
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Virtual Video (Meet)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppointmentType('In-person')}
                    className={`py-2 rounded-xl font-bold border text-xs ${
                      appointmentType === 'In-person'
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    In-Person Hospital Visit
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Chief Reason for Consult:</label>
                <input
                  type="text"
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-[11px] text-sky-900">
                <strong>Schedule Window:</strong> Available slot tomorrow at 11:00 AM IST. A video link will be generated automatically.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/20"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
