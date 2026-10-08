import React from 'react';
import { AlertOctagon, PhoneCall, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedRedFlags?: string[];
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  detectedRedFlags = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Urgent Alert Banner */}
        <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-6 h-6 text-white shrink-0 animate-bounce" />
            <div>
              <h2 className="text-lg font-bold">Emergency Warning — Seek Help Now</h2>
              <p className="text-xs text-rose-100">National Medical Helpline: 108 / 112</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-100 hover:text-white hover:bg-rose-700/60 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-900 leading-relaxed font-medium">
            Your symptoms may require urgent medical evaluation. Do not wait for an in-app review.
            Contact local emergency medical services (108 / 112) or go to the nearest hospital casualty/emergency department now.
          </div>

          {detectedRedFlags.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Triggered Red-Flag Indicators
              </h3>
              <div className="space-y-1">
                {detectedRedFlags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-rose-800 bg-rose-100/50 p-2 rounded-lg">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Critical Life-Threatening Red Flags
            </h3>
            <ul className="text-xs text-slate-700 space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>Difficulty breathing, audible wheezing, or choking sensation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>Rapid swelling of lips, tongue, face, or throat (Angioedema / Anaphylaxis)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>Widespread blistering skin, peeling, or ulcerations inside mouth/eyes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>Fainting, sudden collapse, disorientation, or seizure</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>Vomiting blood, black tarry stools, or severe unexplained bleeding</span>
              </li>
            </ul>
          </div>

          {/* Clinical Safety Protocol Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <span className="font-semibold">Important Clinical Safety Directive:</span> Do not independently stop, restart, or rechallenge prescription medications without medical supervision. Always bring all your current medication strips and prescriptions to the hospital.
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href="tel:108"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-xs"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 108 (Ambulance)</span>
            </a>
            <button
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-semibold transition-colors text-center"
            >
              Acknowledge & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
