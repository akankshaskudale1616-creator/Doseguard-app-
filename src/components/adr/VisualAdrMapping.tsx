import React, { useState } from 'react';
import {
  VisualAdrEvent,
  OrganSystemType,
  UrgencyLevel,
} from '../../types/pv';
import {
  AlertTriangle,
  ShieldAlert,
  Activity,
  Heart,
  Pill,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  Eye,
  FileText,
  AlertCircle,
  Stethoscope,
  Share2,
  Plus,
  X,
  ExternalLink,
  HelpCircle,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface VisualAdrMappingProps {
  mode: 'patient' | 'pharmacist' | 'physician';
  adrEvents?: VisualAdrEvent[];
  onSelectEvent?: (event: VisualAdrEvent) => void;
  onAddAdrEvent?: (event: VisualAdrEvent) => void;
  onUpdateEventStatus?: (id: string, status: VisualAdrEvent['status'], notes?: string) => void;
  onDechallengeAction?: (id: string, action: string) => void;
  patientName?: string;
  onNavigateToReport?: () => void;
}

interface OrganSystemMeta {
  type: OrganSystemType;
  label: string;
  category: string;
  svgZone: { x: number; y: number }; // Percentage on SVG
  description: string;
  color: string;
}

const ORGAN_SYSTEMS: OrganSystemMeta[] = [
  {
    type: 'cns',
    label: 'Central Nervous System (Brain)',
    category: 'Neurological',
    svgZone: { x: 50, y: 8 },
    description: 'Dizziness, somnolence, confusion, ataxia, headache, seizures',
    color: 'indigo',
  },
  {
    type: 'face_lips',
    label: 'Face, Lips & Perioral',
    category: 'Immune / Cutaneous',
    svgZone: { x: 50, y: 15 },
    description: 'Angioedema, facial swelling, lip tingling, periorbital edema',
    color: 'rose',
  },
  {
    type: 'airway_pulmonary',
    label: 'Airway & Pulmonary (Lungs)',
    category: 'Respiratory',
    svgZone: { x: 50, y: 25 },
    description: 'Bronchospasm, wheezing, dyspnea, dry cough, stridor',
    color: 'amber',
  },
  {
    type: 'cardiovascular',
    label: 'Cardiovascular (Heart)',
    category: 'Circulatory',
    svgZone: { x: 44, y: 31 },
    description: 'Palpitations, tachycardia, QT prolongation, hypotension, bradycardia',
    color: 'red',
  },
  {
    type: 'hepatic',
    label: 'Hepatic (Liver)',
    category: 'Metabolic',
    svgZone: { x: 43, y: 40 },
    description: 'Elevated ALT/AST, cholestatic jaundice, drug-induced liver injury (DILI)',
    color: 'yellow',
  },
  {
    type: 'gi_tract',
    label: 'Gastrointestinal (Stomach & Gut)',
    category: 'Digestive',
    svgZone: { x: 52, y: 45 },
    description: 'Dyspepsia, epigastric burning, nausea, vomiting, GI bleed, diarrhea',
    color: 'orange',
  },
  {
    type: 'renal',
    label: 'Renal (Kidneys)',
    category: 'Excretory',
    svgZone: { x: 50, y: 52 },
    description: 'Creatinine rise, oliguria, acute interstitial nephritis, fluid retention',
    color: 'cyan',
  },
  {
    type: 'skin_cutaneous',
    label: 'Cutaneous (Skin)',
    category: 'Integumentary',
    svgZone: { x: 26, y: 36 },
    description: 'Maculopapular rash, pruritus, urticaria, fixed drug eruption, SJS risk',
    color: 'pink',
  },
  {
    type: 'musculoskeletal',
    label: 'Musculoskeletal (Limbs & Muscles)',
    category: 'Locomotor',
    svgZone: { x: 42, y: 82 },
    description: 'Peripheral edema, myalgia, muscle tenderness, rhabdomyolysis, weakness',
    color: 'blue',
  },
  {
    type: 'hematologic',
    label: 'Hematologic (Blood & Marrow)',
    category: 'Hematology',
    svgZone: { x: 50, y: 64 },
    description: 'Eosinophilia, thrombocytopenia, leukopenia, hemolytic anemia',
    color: 'purple',
  },
];

export const VisualAdrMapping: React.FC<VisualAdrMappingProps> = ({
  mode,
  adrEvents = [],
  onSelectEvent,
  onAddAdrEvent,
  onUpdateEventStatus,
  onDechallengeAction,
  patientName = 'Ramesh V. Kulkarni',
  onNavigateToReport,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    adrEvents[0]?.id || ''
  );
  const [activeOrganFilter, setActiveOrganFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState<string | null>(null);

  // New ADR form state
  const [newOrgan, setNewOrgan] = useState<OrganSystemType>('skin_cutaneous');
  const [newReactionName, setNewReactionName] = useState('');
  const [newDrugName, setNewDrugName] = useState('Augmentin 625 Duo');
  const [newSeverity, setNewSeverity] = useState<'mild' | 'moderate' | 'severe' | 'life_threatening'>('moderate');
  const [newNotes, setNewNotes] = useState('');

  const selectedEvent = adrEvents.find((e) => e.id === selectedEventId) || adrEvents[0];

  const filteredEvents = adrEvents.filter((evt) => {
    if (activeOrganFilter !== 'all' && evt.organSystem !== activeOrganFilter) return false;
    if (severityFilter !== 'all' && evt.severity !== severityFilter) return false;
    return true;
  });

  const handleSelectEvent = (evt: VisualAdrEvent) => {
    setSelectedEventId(evt.id);
    if (onSelectEvent) onSelectEvent(evt);
  };

  const handleSaveNewEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReactionName.trim()) return;

    const organMeta = ORGAN_SYSTEMS.find((o) => o.type === newOrgan);
    const newEvt: VisualAdrEvent = {
      id: `ADR-EVT-${Date.now().toString().slice(-4)}`,
      patientId: 'PAT-6801',
      patientName,
      organSystem: newOrgan,
      organLabel: organMeta?.label || 'General Organ',
      reactionName: newReactionName,
      meddraTerm: newReactionName,
      meddraCode: '10099999',
      meddraSoc: organMeta?.category || 'General disorders',
      suspectedDrug: {
        brandName: newDrugName,
        genericName: newDrugName,
        dose: 'Standard dose',
        route: 'Oral',
        startDate: new Date().toISOString().split('T')[0],
      },
      severity: newSeverity,
      causalityScore: newSeverity === 'life_threatening' ? 86 : newSeverity === 'severe' ? 76 : 60,
      naranjoScore: newSeverity === 'life_threatening' ? 8 : 6,
      causalityCategory: newSeverity === 'life_threatening' || newSeverity === 'severe' ? 'HIGH_PRIORITY_ADR' : 'PROBABLE',
      onsetDate: new Date().toISOString().split('T')[0],
      latencyDays: 1,
      dechallengeStatus: 'In Progress / Suspected Withheld',
      rechallengeStatus: 'Contraindicated (Not re-challenged)',
      outcome: 'Persisting',
      clinicalAction: newNotes || 'Suspected medicine paused pending clinical review.',
      reportedBy: mode === 'patient' ? 'Patient Self-Report' : mode === 'pharmacist' ? 'Clinical Pharmacist' : 'Attending Physician',
      status: 'active_alert',
      coordinates: organMeta?.svgZone || { x: 50, y: 50 },
    };

    if (onAddAdrEvent) {
      onAddAdrEvent(newEvt);
    }
    setSelectedEventId(newEvt.id);
    setIsAddModalOpen(false);
    setNewReactionName('');
    setNewNotes('');
  };

  const getSeverityBadge = (sev: VisualAdrEvent['severity']) => {
    switch (sev) {
      case 'life_threatening':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300 ring-rose-400',
          dot: 'bg-rose-600',
          pulse: 'animate-ping bg-rose-400',
          label: 'Life-Threatening / Emergency',
        };
      case 'severe':
        return {
          bg: 'bg-orange-100 text-orange-900 border-orange-300 ring-orange-400',
          dot: 'bg-orange-600',
          pulse: 'animate-ping bg-orange-400',
          label: 'Severe ADR',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300 ring-amber-400',
          dot: 'bg-amber-500',
          pulse: 'bg-amber-400',
          label: 'Moderate ADR',
        };
      default:
        return {
          bg: 'bg-blue-100 text-blue-900 border-blue-300 ring-blue-400',
          dot: 'bg-blue-500',
          pulse: 'bg-blue-400',
          label: 'Mild ADR',
        };
    }
  };

  // Has multi-organ involvement warning (e.g. Cutaneous + Face/Lip or Liver)
  const activeEvents = adrEvents.filter((e) => e.status !== 'resolved');
  const hasAngioedemaRisk = activeEvents.some((e) => e.organSystem === 'face_lips') && activeEvents.some((e) => e.organSystem === 'skin_cutaneous');

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Visual ADR Mapping System
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {patientName} · ID: PAT-6801 (Age 68)
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                {mode === 'patient' ? 'Patient Self-Care View' : mode === 'pharmacist' ? 'Clinical Pharmacist Audit' : 'Physician Diagnostic View'}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Interactive Anatomical Body & Organ System ADR Map
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Spatial visualization mapping suspected adverse drug reactions across human anatomical zones, organ toxicities, offending compounds, and dechallenge timelines.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Map New Reaction</span>
          </button>
          {mode === 'patient' && onNavigateToReport && (
            <button
              onClick={onNavigateToReport}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-slate-200"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Full Symptom Triage</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-organ safety alert if cutaneous + angioedema */}
      {hasAngioedemaRisk && (
        <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border-2 border-rose-300 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-900 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                  Multi-System Alert
                </span>
                <span className="text-xs text-rose-950 font-extrabold">
                  Co-occurring Cutaneous Erythema & Perioral Angioedema Detected
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1">
                Linked to offending beta-lactam <strong className="text-slate-900">Augmentin 625 Duo</strong>. Potential progression to type-1 immediate hypersensitivity with airway compromise. Dechallenge order active.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="text-xs font-bold text-rose-800 bg-white/80 px-3 py-1.5 rounded-xl border border-rose-300">
              Immediate Withholding Ordered
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Left is Interactive Anatomical Body Map; Right is Detailed ADR Intelligence Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Anatomical Silhouette + Organ System Matrix */}
        <div className="lg:col-span-7 space-y-5">
          {/* Anatomical Body Silhouette Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900">
                  Interactive Human Anatomical Map
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">
                Tap on any pulsating radar hotspot or organ
              </span>
            </div>

            {/* Anatomical Silhouette Interactive Canvas */}
            <div className="relative bg-gradient-to-b from-slate-50 via-sky-50/20 to-slate-100 rounded-2xl border border-slate-200/80 p-4 h-[440px] flex items-center justify-center overflow-hidden">
              {/* Anatomical SVG Human Silhouette */}
              <svg
                viewBox="0 0 240 500"
                className="h-full w-auto max-w-[280px] drop-shadow-md select-none"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(15, 23, 42, 0.08))' }}
              >
                {/* Body Outline Path */}
                <g fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" strokeLinejoin="round">
                  {/* Head & Neck */}
                  <path d="M 120 20 C 105 20, 95 35, 95 55 C 95 72, 105 85, 114 90 L 114 105 L 126 105 L 126 90 C 135 85, 145 72, 145 55 C 145 35, 135 20, 120 20 Z" />
                  
                  {/* Torso & Shoulders */}
                  <path d="M 114 105 C 80 110, 65 130, 55 160 L 45 230 C 42 245, 48 255, 55 255 C 62 255, 68 245, 72 230 L 80 170 C 80 170, 85 240, 88 280 C 90 310, 95 320, 105 320 L 135 320 C 145 320, 150 310, 152 280 C 155 240, 160 170, 160 170 L 168 230 C 172 245, 178 255, 185 255 C 192 255, 198 245, 195 230 L 185 160 C 175 130, 160 110, 126 105 Z" />
                  
                  {/* Legs & Feet */}
                  <path d="M 105 320 L 100 410 L 96 460 C 95 475, 85 480, 80 480 C 75 480, 80 470, 85 450 L 92 400 L 98 320 Z" />
                  <path d="M 135 320 L 140 410 L 144 460 C 145 475, 155 480, 160 480 C 165 480, 160 470, 155 450 L 148 400 L 142 320 Z" />
                </g>

                {/* Anatomical Organ Outlines inside */}
                {/* Brain */}
                <ellipse cx="120" cy="50" rx="16" ry="18" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2,2" />
                {/* Lungs */}
                <ellipse cx="106" cy="155" rx="14" ry="25" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
                <ellipse cx="134" cy="155" rx="14" ry="25" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
                {/* Heart */}
                <path d="M 116 150 C 112 145, 104 148, 104 156 C 104 165, 116 172, 116 172 C 116 172, 128 165, 128 156 C 128 148, 120 145, 116 150 Z" fill="#FCA5A5" stroke="#EF4444" strokeWidth="1.5" />
                {/* Liver */}
                <path d="M 105 185 Q 125 180, 135 190 Q 130 205, 105 200 Z" fill="#FED7AA" stroke="#F97316" strokeWidth="1.2" />
                {/* Stomach */}
                <path d="M 125 195 Q 140 200, 130 215 Q 118 215, 125 195 Z" fill="#FDE68A" stroke="#EAB308" strokeWidth="1.2" />
                {/* Kidneys */}
                <ellipse cx="104" cy="225" rx="7" ry="11" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.2" />
                <ellipse cx="136" cy="225" rx="7" ry="11" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.2" />
              </svg>

              {/* Pulsating Hotspots Overlaid on SVG */}
              {adrEvents.map((evt) => {
                const isSelected = evt.id === selectedEventId;
                const badgeInfo = getSeverityBadge(evt.severity);

                return (
                  <button
                    key={evt.id}
                    onClick={() => handleSelectEvent(evt)}
                    style={{
                      left: `${evt.coordinates.x}%`,
                      top: `${evt.coordinates.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute z-20 group cursor-pointer transition-transform duration-200 ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                    title={`${evt.reactionName} (${evt.suspectedDrug.brandName})`}
                  >
                    {/* Pulsing Radar Ring */}
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          badgeInfo.pulse
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-5 w-5 items-center justify-center text-[10px] font-bold text-white shadow-md border-2 border-white ${
                          badgeInfo.dot
                        } ${isSelected ? 'ring-4 ring-orange-400' : ''}`}
                      >
                        !
                      </span>
                    </span>

                    {/* Tooltip Label */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 -bottom-7 whitespace-nowrap bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md pointer-events-none transition-opacity ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {evt.reactionName.split(' ')[0]}
                    </div>
                  </button>
                );
              })}

              {/* Map Legend Floating Tag */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-2 rounded-xl border border-slate-200/90 text-[10px] space-y-1 shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  <span className="text-slate-700 font-semibold">Life-Threatening / Emergency</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-slate-700 font-semibold">Severe Cutaneous / Organ ADR</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-slate-700 font-semibold">Moderate Drug Toxicity</span>
                </div>
              </div>
            </div>
          </div>

          {/* Organ Systems Filters & Matrix Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-orange-500" />
                <span>Filter by Organ System Class ({adrEvents.length} Recorded ADRs)</span>
              </h3>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setActiveOrganFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    activeOrganFilter === 'all'
                      ? 'bg-orange-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSeverityFilter(severityFilter === 'life_threatening' ? 'all' : 'life_threatening')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    severityFilter === 'life_threatening'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Emergency Only
                </button>
              </div>
            </div>

            {/* Organ Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ORGAN_SYSTEMS.map((org) => {
                const orgEvents = adrEvents.filter((e) => e.organSystem === org.type);
                const hasEvents = orgEvents.length > 0;
                const isSelected = activeOrganFilter === org.type;

                return (
                  <button
                    key={org.type}
                    onClick={() => {
                      if (activeOrganFilter === org.type) {
                        setActiveOrganFilter('all');
                      } else {
                        setActiveOrganFilter(org.type);
                        if (hasEvents) {
                          setSelectedEventId(orgEvents[0].id);
                        }
                      }
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all relative ${
                      isSelected
                        ? 'bg-orange-50 border-orange-400 text-orange-950 ring-2 ring-orange-300'
                        : hasEvents
                        ? 'bg-white border-rose-200 hover:border-rose-300 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 text-slate-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold block leading-tight">
                        {org.label.split('(')[0]}
                      </span>
                      {hasEvents && (
                        <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                          {orgEvents.length}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1 line-clamp-1">
                      {hasEvents ? orgEvents.map((e) => e.reactionName).join(', ') : 'No recorded ADR'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Detailed Selected Reaction Dossier */}
        <div className="lg:col-span-5 space-y-5">
          {selectedEvent ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
              {/* Header with Severity Badge */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        getSeverityBadge(selectedEvent.severity).bg
                      }`}
                    >
                      {getSeverityBadge(selectedEvent.severity).label}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
                      ID: {selectedEvent.id}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {selectedEvent.reactionName}
                  </h3>
                  <span className="text-xs text-slate-500 block">
                    {selectedEvent.organLabel} · MedDRA SOC: {selectedEvent.meddraSoc}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Causality C_ADR</span>
                  <span className="text-lg font-black font-mono text-orange-600">
                    {selectedEvent.causalityScore}/100
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Naranjo: {selectedEvent.naranjoScore} (Definite)
                  </span>
                </div>
              </div>

              {/* Suspected Medication Callout */}
              <div className="p-3.5 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 block mb-1">
                  Offending Suspected Drug
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      {selectedEvent.suspectedDrug.brandName}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      {selectedEvent.suspectedDrug.genericName} ({selectedEvent.suspectedDrug.dose})
                    </span>
                  </div>
                  <span className="text-[11px] font-mono bg-white px-2 py-1 rounded-lg border border-orange-200 font-bold text-orange-900">
                    Lot: {selectedEvent.suspectedDrug.batchNumber || 'AX26-904'}
                  </span>
                </div>
              </div>

              {/* Clinical & Temporal Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] block font-medium">Onset Date & Latency</span>
                  <span className="font-bold text-slate-800">{selectedEvent.onsetDate}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {selectedEvent.latencyDays} days after initiation
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] block font-medium">Dechallenge Status</span>
                  <span className="font-bold text-emerald-800">{selectedEvent.dechallengeStatus}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Outcome: {selectedEvent.outcome}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] block font-medium">MedDRA PT Term</span>
                  <span className="font-bold text-slate-800">{selectedEvent.meddraTerm}</span>
                  <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                    Code: {selectedEvent.meddraCode}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] block font-medium">Rechallenge Rule</span>
                  <span className="font-bold text-rose-800">{selectedEvent.rechallengeStatus}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Cross-reactivity watch</span>
                </div>
              </div>

              {/* Clinical Management & Action Taken */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-orange-600" />
                  <span>Clinical Action & Management Protocol</span>
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {selectedEvent.clinicalAction}
                </p>
              </div>

              {/* Photo Evidence if Available */}
              {selectedEvent.photoEvidenceUrl && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedEvent.photoEvidenceUrl}
                      alt="ADR Evidence"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80';
                      }}
                      className="w-12 h-12 rounded-xl object-cover border border-indigo-300 shadow-xs cursor-pointer"
                      onClick={() => setShowPhotoModal(selectedEvent.photoEvidenceUrl || null)}
                    />
                    <div>
                      <span className="font-bold text-indigo-950 block">Clinical Photo Evidence</span>
                      <span className="text-[11px] text-slate-500">Verified packaging & skin presentation</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPhotoModal(selectedEvent.photoEvidenceUrl || null)}
                    className="px-2.5 py-1.5 bg-white text-indigo-700 rounded-lg font-bold border border-indigo-200 text-xs hover:bg-indigo-100 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </div>
              )}

              {/* Role-Specific Action Bar */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                {mode === 'patient' && (
                  <>
                    <button
                      onClick={() => alert(`Reaction card for ${selectedEvent.reactionName} copied to clipboard.`)}
                      className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Reaction with Doctor</span>
                    </button>
                    {onNavigateToReport && (
                      <button
                        onClick={onNavigateToReport}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
                      >
                        Update Symptoms
                      </button>
                    )}
                  </>
                )}

                {mode === 'pharmacist' && (
                  <>
                    <button
                      onClick={() => {
                        if (onUpdateEventStatus) onUpdateEventStatus(selectedEvent.id, 'escalated', 'Verified by clinical pharmacist. Escalated to prescriber.');
                        alert(`ADR Event ${selectedEvent.id} attested and added to national PvPI dispatch queue.`);
                      }}
                      className="flex-1 py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Dispatch to PvPI ADRMS</span>
                    </button>
                    <button
                      onClick={() => alert(`Naranjo score calculation verified: ${selectedEvent.naranjoScore} points.`)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200"
                    >
                      Audit Score
                    </button>
                  </>
                )}

                {mode === 'physician' && (
                  <>
                    <button
                      onClick={() => {
                        if (onDechallengeAction) onDechallengeAction(selectedEvent.id, 'Discontinuation order approved');
                        alert(`Physician dechallenge order confirmed for ${selectedEvent.suspectedDrug.brandName}. Documented in patient EHR.`);
                      }}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sign Dechallenge Order</span>
                    </button>
                    <button
                      onClick={() => alert(`Alternative antibiotic (Cefuroxime Axetil) substituted in active prescription.`)}
                      className="py-2 px-3 bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-300 rounded-xl text-xs font-bold"
                    >
                      Issue Substitute
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              Select an adverse reaction from the body map to review details.
            </div>
          )}

          {/* Quick Summary of Active Mapped Events */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Longitudinal ADR Registry ({adrEvents.length} Events)
            </h4>
            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {filteredEvents.map((evt) => {
                const isSelected = evt.id === selectedEventId;
                const b = getSeverityBadge(evt.severity);
                return (
                  <div
                    key={evt.id}
                    onClick={() => handleSelectEvent(evt)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-orange-50 border-orange-400 ring-1 ring-orange-300'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${b.dot}`} />
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">
                          {evt.reactionName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {evt.suspectedDrug.brandName} · {evt.onsetDate}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add New Reaction Map Entry */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                <h3 className="text-base font-bold text-slate-900">Map New Adverse Reaction</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewEvent} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Organ System</label>
                <select
                  value={newOrgan}
                  onChange={(e) => setNewOrgan(e.target.value as OrganSystemType)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  {ORGAN_SYSTEMS.map((o) => (
                    <option key={o.type} value={o.type}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reaction Name / Symptoms Observed</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maculopapular rash, angioedema, epigastric burning"
                  value={newReactionName}
                  onChange={(e) => setNewReactionName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Suspected Medicine</label>
                  <input
                    type="text"
                    value={newDrugName}
                    onChange={(e) => setNewDrugName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Severity Assessment</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="mild">Mild (Self-limiting)</option>
                    <option value="moderate">Moderate (Interferes with activity)</option>
                    <option value="severe">Severe (Requires treatment)</option>
                    <option value="life_threatening">Life-Threatening / Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Observations & Immediate Action</label>
                <textarea
                  rows={3}
                  placeholder="Details of symptom onset, vitals, dechallenge advice..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Pin to Visual Map
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Full Photo Evidence Viewer */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm">Medication / Rash Evidence Photo</span>
              <button
                onClick={() => setShowPhotoModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={showPhotoModal}
              alt="Evidence"
              className="w-full h-72 object-cover rounded-2xl border border-slate-200"
            />
            <p className="text-xs text-slate-500">
              Attached to Suspected ADR case {selectedEvent?.id}. Verified by clinical team.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
