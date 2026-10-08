import React from 'react';
import { Check } from 'lucide-react';

interface BodyRegion {
  id: string;
  name: string;
  category: string;
  commonSymptoms: string[];
}

const REGIONS: BodyRegion[] = [
  {
    id: 'face_lips',
    name: 'Face, Lips & Eyes',
    category: 'High Alert',
    commonSymptoms: ['Lip swelling / Angioedema', 'Facial puffiness', 'Eye redness / burning', 'Mouth ulcers'],
  },
  {
    id: 'throat_chest',
    name: 'Throat, Airway & Chest',
    category: 'Emergency Check',
    commonSymptoms: ['Shortness of breath', 'Wheezing / tightness', 'Difficulty swallowing', 'Palpitations'],
  },
  {
    id: 'arms_hands',
    name: 'Arms, Hands & Skin',
    category: 'Cutaneous',
    commonSymptoms: ['Red rash / Erythema', 'Severe itching / Pruritus', 'Hives / Urticaria', 'Hand tremors'],
  },
  {
    id: 'abdomen_gi',
    name: 'Stomach & Abdomen',
    category: 'Gastrointestinal',
    commonSymptoms: ['Nausea / Vomiting', 'Abdominal pain', 'Severe diarrhea', 'Loss of appetite'],
  },
  {
    id: 'legs_ankles',
    name: 'Legs, Ankles & Feet',
    category: 'Circulatory / Muscular',
    commonSymptoms: ['Bilateral ankle swelling (Edema)', 'Calf muscle pain / Myalgia', 'Heavy legs', 'Foot numbness'],
  },
  {
    id: 'head_neuro',
    name: 'Head & Neurological',
    category: 'CNS',
    commonSymptoms: ['Severe headache', 'Dizziness / Vertigo', 'Confusion', 'Drowsiness'],
  },
  {
    id: 'systemic',
    name: 'Whole Body / Systemic',
    category: 'General',
    commonSymptoms: ['High fever / Chills', 'Extreme fatigue', 'Generalized itching', 'Unexplained bruising'],
  },
];

interface BodyMapProps {
  selectedRegions: string[];
  onToggleRegion: (regionId: string) => void;
  onSelectSymptom: (symptom: string) => void;
  selectedSymptoms: string[];
}

export const BodyMap: React.FC<BodyMapProps> = ({
  selectedRegions,
  onToggleRegion,
  onSelectSymptom,
  selectedSymptoms,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Interactive Anatomical Body Map
        </label>
        <span className="text-xs text-slate-500">Tap affected anatomical zones</span>
      </div>

      {/* Anatomical Regions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {REGIONS.map((region) => {
          const isSelected = selectedRegions.includes(region.id);
          const isHighAlert = region.id === 'face_lips' || region.id === 'throat_chest';

          return (
            <button
              key={region.id}
              type="button"
              onClick={() => onToggleRegion(region.id)}
              className={`p-3 text-left rounded-xl border transition-all relative ${
                isSelected
                  ? isHighAlert
                    ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-xs ring-1 ring-rose-400'
                    : 'bg-indigo-50 border-indigo-300 text-indigo-950 shadow-xs ring-1 ring-indigo-400'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold leading-tight block">{region.name}</span>
                {isSelected && (
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isHighAlert ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">{region.category}</span>
            </button>
          );
        })}
      </div>

      {/* Recommended Symptoms for Selected Regions */}
      {selectedRegions.length > 0 && (
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <span className="text-xs font-semibold text-slate-700 block">
            Suggested Symptoms based on selected body regions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {REGIONS.filter((r) => selectedRegions.includes(r.id))
              .flatMap((r) => r.commonSymptoms)
              .map((symptom, idx) => {
                const isChecked = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectSymptom(symptom)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition-colors ${
                      isChecked
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-500'
                    }`}
                  >
                    {isChecked ? '✓ ' : '+ '}
                    {symptom}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
