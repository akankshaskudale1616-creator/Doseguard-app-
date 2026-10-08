import React, { useState } from 'react';
import { Camera, Sparkles, Image as ImageIcon, AlertCircle, Check, Eye } from 'lucide-react';
import { prescriptionSampleImg } from '../../assets/images';

export const DermatologyComparator: React.FC = () => {
  const [selectedReaction, setSelectedReaction] = useState('maculopapular_drug_eruption');
  const [generatedImage, setGeneratedImage] = useState<string>(prescriptionSampleImg);
  const [isLoading, setIsLoading] = useState(false);

  const REACTIONS = [
    {
      id: 'maculopapular_drug_eruption',
      name: 'Maculopapular Exanthem (Co-Amoxiclav / Antibiotic Rash)',
      description: 'Symmetric erythematous macules and papules that coalesce, typically beginning on trunk/upper limbs 7-10 days (or 2-3 days on re-exposure) post-drug initiation.',
      urgency: 'Moderate (Pharmacist Review)',
    },
    {
      id: 'angioedema_urticaria',
      name: 'Angioedema & Acute Urticaria (Allergic Red Flag)',
      description: 'Localized subcutaneous or submucosal swelling affecting lips, eyelids, tongue, or larynx with erythematous wheals and intense pruritus.',
      urgency: 'EMERGENCY RED FLAG',
    },
    {
      id: 'fixed_drug_eruption',
      name: 'Fixed Drug Eruption (FDE)',
      description: 'Sharply demarcated solitary or few round/oval erythematous violaceous plaques recurring at the exact same anatomic site upon re-exposure.',
      urgency: 'High (Physician Review)',
    },
    {
      id: 'erythema_multiforme',
      name: 'Erythema Multiforme (Target / Iris Lesions)',
      description: 'Targetoid concentric annular rings with central dusky or blistering centers on palms, soles, and forearms.',
      urgency: 'High (Immediate Dermatologist Review)',
    },
  ];

  const handleGenerate = async (reactionId: string) => {
    setSelectedReaction(reactionId);
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-dermatology-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType: reactionId }),
      });
      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeReaction = REACTIONS.find((r) => r.id === selectedReaction) || REACTIONS[0];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header - Warm Light Orange Theme */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/80 border border-orange-200 rounded-3xl p-6 text-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-bold text-slate-900">Clinical Dermatology &amp; Cutaneous ADR Visual Comparator</h2>
            <span className="text-[10px] bg-orange-100 text-orange-900 border border-orange-300 px-2 py-0.5 rounded-full font-bold">
              Clinical Visual Reference
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Compare suspected patient skin reactions against clinically verified adverse cutaneous drug reaction profiles using DoseGuard Reference Engine.
          </p>
        </div>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left: Reaction List (5 cols) */}
        <div className="md:col-span-5 space-y-2.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Select Adverse Reaction Type:
          </span>

          {REACTIONS.map((r) => {
            const isSelected = selectedReaction === r.id;
            const isEmerg = r.urgency.includes('EMERGENCY');

            return (
              <button
                key={r.id}
                onClick={() => handleGenerate(r.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? isEmerg
                      ? 'bg-rose-50 border-rose-400 ring-1 ring-rose-400 shadow-xs'
                      : 'bg-orange-50 border-orange-400 ring-1 ring-orange-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-orange-200 hover:bg-orange-50/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-slate-900 leading-snug">{r.name}</span>
                  {isSelected && (
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        isEmerg ? 'bg-rose-600 text-white' : 'bg-orange-600 text-white'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{r.description}</p>
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-2 ${
                    isEmerg ? 'bg-rose-100 text-rose-800' : 'bg-orange-100 text-orange-900'
                  }`}
                >
                  {r.urgency}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Comparative Inspection Canvas (7 cols) */}
        <div className="md:col-span-7 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-600 block">
                Educational Clinical Visual
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">{activeReaction.name}</h3>
            </div>
            <button
              onClick={() => handleGenerate(selectedReaction)}
              disabled={isLoading}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>{isLoading ? 'Generating Visual...' : 'Regenerate Reference'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Visual Box 1: Reference */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600 block">
                Standard Clinical Reference
              </span>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square flex items-center justify-center">
                {isLoading ? (
                  <div className="text-center p-4 space-y-2">
                    <Sparkles className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
                    <span className="text-xs text-slate-500 block">Rendering clinical morphology...</span>
                  </div>
                ) : (
                  <img
                    src={generatedImage}
                    alt="Clinical reference visual"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded">
                  Clinical Morphology
                </div>
              </div>
            </div>

            {/* Visual Box 2: Patient Observation Guide */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600 block">
                Diagnostic Differentiation Guide
              </span>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 h-full flex flex-col justify-between text-xs space-y-2">
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Key Diagnostic Points:</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {activeReaction.description}
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700">
                  <strong>Pharmacist Check:</strong> Document location, mucosal involvement, and whether blistering or Nikolsky sign is present.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
