import React, { useState } from 'react';
import {
  Globe2,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  FileText,
  PhoneCall,
  Search,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Download,
  Building2,
  HelpCircle,
  Clock,
  Languages,
  Check,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguage, VernacularMeddraMapping } from '../../types/language';
import {
  SUPPORTED_LANGUAGES,
  VERNACULAR_MEDDRA_MAPPINGS,
  REGIONAL_PV_CENTRES,
} from '../../data/languageData';

interface LanguageSectionProps {
  onNavigateToReport?: () => void;
}

export const LanguageSection: React.FC<LanguageSectionProps> = ({ onNavigateToReport }) => {
  const { language, setLanguage, t, speakPhrase, isSpeaking, stopSpeaking } = useLanguage();

  // Active sub-section within the Language Section
  const [activeSubTab, setActiveSubTab] = useState<'picker' | 'translator' | 'helplines' | 'forms'>('picker');

  // Translator state
  const [selectedMapping, setSelectedMapping] = useState<VernacularMeddraMapping>(
    VERNACULAR_MEDDRA_MAPPINGS[0]
  );
  const [customInput, setCustomInput] = useState('');
  const [filterLang, setFilterLang] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormLang, setSelectedFormLang] = useState<SupportedLanguage>('hi');
  const [fontSizeBoost, setFontSizeBoost] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Filtered vernacular mappings
  const filteredMappings = VERNACULAR_MEDDRA_MAPPINGS.filter((m) => {
    const matchesLang = filterLang === 'all' || m.language === filterLang;
    const matchesSearch =
      m.colloquialPhrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.englishMeaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.meddraTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.suspectedDrugAssociation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLang && matchesSearch;
  });

  const handleTestVernacularSpeech = (phrase: string, langCode: SupportedLanguage) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakPhrase(phrase, langCode);
    }
  };

  const handleSelectMapping = (mapping: VernacularMeddraMapping) => {
    setSelectedMapping(mapping);
    setCustomInput(mapping.colloquialPhrase);
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${
      fontSizeBoost === 'large' ? 'text-[15px]' : fontSizeBoost === 'xlarge' ? 'text-[17px]' : 'text-sm'
    }`}>
      {/* Top Banner: Regional Pharmacovigilance & Multilingual Mission */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Languages className="w-3.5 h-3.5" />
            <span>PvPI Vernacular &amp; Regional Localization Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            {t('languageSectionTitle')}
          </h1>

          <p className="text-orange-50 text-sm sm:text-base leading-relaxed mb-6 font-medium">
            India’s patient population speaks 22 scheduled languages with diverse colloquial symptom expressions. DoseGuard provides direct vernacular symptom-to-MedDRA mapping, multilingual ADR reporting forms (IPC Form 19), regional audio readouts, and zonal AMC helpline routing.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2">
              <span className="font-bold">Active Language:</span>
              <span className="bg-white text-orange-700 font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeName} ({language.toUpperCase()})
              </span>
            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-amber-200" />
              <span className="font-medium">National PvPI Toll-Free:</span>
              <a href="tel:18001803024" className="font-bold underline hover:text-amber-100">
                1800-180-3024
              </a>
            </div>

            <button
              onClick={() => handleTestVernacularSpeech(SUPPORTED_LANGUAGES.find((l) => l.code === language)?.greeting || 'Welcome', language)}
              className="bg-white hover:bg-orange-50 text-orange-900 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5 text-orange-600" />}
              <span>{isSpeaking ? 'Stop Audio' : 'Play Greeting Audio'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border border-orange-200/80 rounded-2xl p-1.5 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          <button
            onClick={() => setActiveSubTab('picker')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'picker'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/60'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>Select App Language (12 Languages)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('translator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'translator'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Vernacular Symptom to MedDRA Translator</span>
          </button>

          <button
            onClick={() => setActiveSubTab('helplines')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'helplines'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/60'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Regional Helplines &amp; PvPI Desks</span>
          </button>

          <button
            onClick={() => setActiveSubTab('forms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'forms'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Multilingual IPC Form 19 (ADR)</span>
          </button>
        </div>

        {/* Accessibility & Font Boost Controls */}
        <div className="hidden lg:flex items-center gap-1.5 pr-2 shrink-0 text-xs">
          <span className="text-slate-500 font-semibold text-[11px]">Script Size:</span>
          {(['normal', 'large', 'xlarge'] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFontSizeBoost(size)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold uppercase ${
                fontSizeBoost === size
                  ? 'bg-orange-100 text-orange-900 border border-orange-300'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {size === 'normal' ? '1x' : size === 'large' ? '1.2x' : '1.4x'}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: LANGUAGE PICKER & DIRECTORY */}
      {activeSubTab === 'picker' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t('selectLanguage')}
              </h2>
              <p className="text-xs text-slate-500">
                Switch active language across dashboards, symptom reporting, medication alerts, and PvPI export schemas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <div
                  key={lang.code}
                  className={`rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-orange-50/90 border-orange-500 shadow-md ring-2 ring-orange-500/20'
                      : 'bg-white border-orange-200/80 hover:border-orange-300 hover:bg-orange-50/30'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-extrabold text-slate-900">
                            {lang.nativeName}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            ({lang.name})
                          </span>
                        </div>
                        <span className="text-[11px] text-orange-700 font-semibold block">
                          {lang.region}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          lang.pvpiStatus === 'Official National'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : lang.pvpiStatus === 'Scheduled Regional'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}
                      >
                        {lang.pvpiStatus}
                      </span>
                    </div>

                    <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/70 mb-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Script:</span>
                        <span className="font-semibold text-slate-800">{lang.script}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Speakers:</span>
                        <span className="font-semibold text-slate-800">{lang.speakersCount}</span>
                      </div>
                      <div className="pt-1 border-t border-slate-200/60">
                        <span className="text-[10px] text-slate-400 block font-medium">Greeting:</span>
                        <span className="text-xs text-slate-700 font-medium italic">
                          "{lang.greeting}"
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-orange-100">
                    <button
                      onClick={() => setLanguage(lang.code)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-white hover:bg-orange-100/70 text-orange-950 border border-orange-200'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Active Language</span>
                        </>
                      ) : (
                        <span>Set as Active</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleTestVernacularSpeech(lang.greeting, lang.code)}
                      title="Listen to native voice pronunciation"
                      className="p-2 rounded-xl border border-orange-200 bg-white hover:bg-orange-50 text-orange-800 transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-orange-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Regional Script Display & Pharmacovigilance Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm">
                  PvPI Multilingual Regulatory Mandate
                </h3>
                <p className="text-xs text-amber-800/90 leading-relaxed mt-0.5">
                  The Indian Pharmacopoeia Commission (IPC) requires that patient-reported adverse reactions in vernacular languages be preserved alongside standardized MedDRA coding to maintain raw narrative fidelity and legal traceability under Indian GCP guidelines.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('translator')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Try Vernacular MedDRA Translator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: VERNACULAR SYMPTOM TO MEDDRA TRANSLATOR */}
      {activeSubTab === 'translator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Preset Regional Colloquial Symptoms */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-orange-200/80 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <span>Regional Colloquial Presets</span>
                  </h3>
                  <span className="text-[11px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-bold">
                    {filteredMappings.length} cases
                  </span>
                </div>

                {/* Filter and Search */}
                <div className="space-y-2 mb-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search symptom, drug, or MedDRA term..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-orange-500 focus:bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Lang:</span>
                    {['all', 'hi', 'mr', 'ta', 'te', 'bn', 'gu', 'kn', 'pa'].map((l) => (
                      <button
                        key={l}
                        onClick={() => setFilterLang(l)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase shrink-0 ${
                          filterLang === l
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mappings List */}
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {filteredMappings.map((mapping) => {
                    const isSelected = selectedMapping.id === mapping.id;
                    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === mapping.language);

                    return (
                      <div
                        key={mapping.id}
                        onClick={() => handleSelectMapping(mapping)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-orange-50/90 border-orange-500 shadow-xs ring-1 ring-orange-500/20'
                            : 'bg-white border-slate-200 hover:border-orange-300 hover:bg-orange-50/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-900 rounded-full">
                            {langInfo?.nativeName} ({mapping.language.toUpperCase()})
                          </span>

                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase ${
                              mapping.urgency === 'EMERGENCY'
                                ? 'bg-red-100 text-red-800 animate-pulse'
                                : mapping.urgency === 'HIGH'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {mapping.urgency}
                          </span>
                        </div>

                        <p className="font-semibold text-xs text-slate-900 mb-1 leading-snug">
                          "{mapping.colloquialPhrase}"
                        </p>

                        <p className="text-[11px] text-slate-500 italic truncate mb-2">
                          Meaning: {mapping.englishMeaning}
                        </p>

                        <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100 text-slate-600">
                          <span className="font-mono text-orange-800 font-bold truncate">
                            MedDRA: {mapping.meddraTerm}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            Code: {mapping.meddraCode}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Interactive MedDRA Classifier & Detail Inspector */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-orange-200/80 rounded-2xl p-5 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-orange-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <Globe2 className="w-5 h-5 text-orange-600" />
                      <span>Live Vernacular Clinical Extraction</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standardizing regional colloquialisms into ICH-MedDRA 27.0 terminology and WHO-UMC causality triage.
                    </p>
                  </div>

                  <button
                    onClick={() => handleTestVernacularSpeech(selectedMapping.colloquialPhrase, selectedMapping.language)}
                    className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5 text-orange-700" />}
                    <span>{isSpeaking ? 'Mute' : 'Listen Dialect'}</span>
                  </button>
                </div>

                {/* Raw Vernacular Input Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Vernacular Raw Patient Narrative (Colloquial Dialect):
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Type or paste symptoms in Hindi, Marathi, Tamil, Bengali, Telugu, Gujarati..."
                      className="w-full p-3 text-sm bg-orange-50/40 border border-orange-200 rounded-xl focus:outline-hidden focus:border-orange-500 font-sans text-slate-900"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Script detected: <strong className="text-slate-700">{selectedMapping.script}</strong> · Language: <strong className="text-slate-700">{selectedMapping.language.toUpperCase()}</strong>
                  </span>
                </div>

                {/* Clinical Extraction Results Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-200/80 pb-1.5">
                    ICH-MedDRA &amp; PvPI Standardized Entity Mapping
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">MedDRA Preferred Term (PT)</span>
                      <span className="font-extrabold text-sm text-slate-900 mt-0.5 block">
                        {selectedMapping.meddraTerm}
                      </span>
                      <span className="font-mono text-[11px] text-orange-700 font-semibold">
                        Code: {selectedMapping.meddraCode}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">System Organ Class (SOC)</span>
                      <span className="font-semibold text-xs text-slate-800 mt-0.5 block leading-tight">
                        {selectedMapping.socCategory}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">English Clinical Translation</span>
                      <span className="font-medium text-xs text-slate-700 mt-0.5 block italic">
                        "{selectedMapping.englishMeaning}"
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Common Suspected Medication Class</span>
                      <span className="font-semibold text-xs text-slate-800 mt-0.5 block text-orange-950">
                        {selectedMapping.suspectedDrugAssociation}
                      </span>
                    </div>
                  </div>

                  {/* Urgency and Red-Flag warning if applicable */}
                  <div
                    className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      selectedMapping.urgency === 'EMERGENCY'
                        ? 'bg-rose-50 border-rose-300 text-rose-950'
                        : selectedMapping.urgency === 'HIGH'
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    }`}
                  >
                    {selectedMapping.urgency === 'EMERGENCY' ? (
                      <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    ) : selectedMapping.urgency === 'HIGH' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs uppercase tracking-wide">
                          Causality Urgency: {selectedMapping.urgency}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5 leading-relaxed font-medium">
                        {selectedMapping.redFlagReason || 'Standard clinical surveillance. Log in ICSR.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500">
                    Compliant with <strong>E2B(R3)</strong> individual case safety report standard.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(
                          `[DoseGuard Vernacular Extraction]\nRaw: ${customInput || selectedMapping.colloquialPhrase}\nLanguage: ${selectedMapping.language}\nMedDRA PT: ${selectedMapping.meddraTerm} (${selectedMapping.meddraCode})\nSOC: ${selectedMapping.socCategory}\nUrgency: ${selectedMapping.urgency}`
                        );
                        alert('Copied standardized MedDRA extraction to clipboard!');
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                    >
                      Copy MedDRA Extraction
                    </button>

                    {onNavigateToReport && (
                      <button
                        onClick={onNavigateToReport}
                        className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <span>Attach to Patient Report</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REGIONAL HELPLINES & PVPI ZONAL NODES */}
      {activeSubTab === 'helplines' && (
        <div className="space-y-6">
          <div className="bg-white border border-orange-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-orange-100">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-orange-600" />
                  <span>National &amp; Zonal ADR Monitoring Centers (PvPI)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Patients and healthcare providers can report adverse drug reactions verbally in their regional languages through official zonal toll-free helplines.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <a
                  href="tel:18001803024"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm hover:from-emerald-700 hover:to-green-700 transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Toll-Free 1800-180-3024</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REGIONAL_PV_CENTRES.map((center) => (
                <div
                  key={center.id}
                  className="rounded-2xl border border-orange-200/90 bg-gradient-to-br from-white to-orange-50/40 p-4 space-y-3 shadow-xs hover:border-orange-300 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full uppercase">
                        {center.regionName}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-1 leading-snug">
                        {center.centerName}
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">{center.city}</span>
                    </div>

                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md shrink-0">
                      Vernacular Ready
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Supported Languages:</span>
                      <span className="font-bold text-slate-800">
                        {center.primaryLanguages.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">States Covered:</span>
                      <span className="font-semibold text-slate-700 text-right truncate max-w-[220px]">
                        {center.statesCovered.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Operating Hours:</span>
                      <span className="font-medium text-slate-600 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{center.helplineTiming}</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-orange-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 truncate">
                      Head: {center.inCharge}
                    </span>

                    <a
                      href={`tel:${center.tollFreeNumber.replace(/[^0-9]/g, '')}`}
                      className="px-3 py-1 bg-white hover:bg-orange-50 border border-orange-300 text-orange-900 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <PhoneCall className="w-3 h-3 text-orange-600" />
                      <span>{center.tollFreeNumber}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp ADR Vernacular Reporting Info */}
            <div className="mt-5 p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  WA
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    Official PvPI WhatsApp ADR Reporting Service
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Patients can send voice notes or text photos of blister packs and symptoms directly in regional languages to <strong>+91 98711 03524</strong>.
                  </p>
                </div>
              </div>

              <a
                href="https://api.whatsapp.com/send?phone=919871103524&text=DoseGuard%20Vernacular%20ADR%20Report"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs"
              >
                Open WhatsApp (+91 98711 03524)
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MULTILINGUAL IPC FORM 19 (SUSPECTED ADR FORM) */}
      {activeSubTab === 'forms' && (
        <div className="space-y-6">
          <div className="bg-white border border-orange-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-100">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <span>Indian Pharmacopoeia Commission - Suspected ADR Reporting Form 19</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Standardized questionnaire translated across regional vernacular dialects for frontline ASHA workers and non-English literate patients.
                </p>
              </div>

              {/* Form Language Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Form Dialect:</span>
                <select
                  value={selectedFormLang}
                  onChange={(e) => setSelectedFormLang(e.target.value as SupportedLanguage)}
                  className="text-xs bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5 font-bold text-orange-950 focus:outline-hidden"
                >
                  <option value="en">English (Official Standard)</option>
                  <option value="hi">हिंदी (Hindi - राष्ट्रीय)</option>
                  <option value="mr">मराठी (Marathi - महाराष्ट्र)</option>
                  <option value="ta">தமிழ் (Tamil - தமிழ்நாடு)</option>
                  <option value="te">తెలుగు (Telugu - ఆంధ్ర/తెలంగాణ)</option>
                  <option value="bn">বাংলা (Bengali - পশ্চিমবঙ্গ)</option>
                  <option value="gu">ગુજરાતી (Gujarati - ગુજરાત)</option>
                  <option value="es">Español (Spanish - OMS)</option>
                  <option value="fr">Français (French - OMS)</option>
                </select>
              </div>
            </div>

            {/* Form Preview Simulator */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <span className="font-bold text-sm text-slate-900">
                    {selectedFormLang === 'hi' && 'संदिग्ध प्रतिकूल दवा प्रतिक्रिया (ADR) रिपोर्टिंग फॉर्म'}
                    {selectedFormLang === 'mr' && 'संशयित औषध दुष्परिणाम (ADR) अहवाल अर्ज'}
                    {selectedFormLang === 'ta' && 'சந்தேகத்திற்குரிய மருந்து பக்கவிளைவு பதிவு படிவம் (படிவம் 19)'}
                    {selectedFormLang === 'bn' && 'সন্দেহভাজন ওষুধের পার্শ্বপ্রতিক্রিয়া রিপোর্টিং ফর্ম'}
                    {selectedFormLang === 'te' && 'అనుమానిత ఔషధ దుష్ప్రభావ రిపోర్టింగ్ ఫారం (ఫారం 19)'}
                    {selectedFormLang === 'gu' && 'શંકાસ્પદ દવાની આડઅસર રિપોર્ટિંગ ફોર્મ (ફોર્મ 19)'}
                    {selectedFormLang === 'en' && 'Suspected Adverse Drug Reaction Reporting Form (IPC Form 19)'}
                    {selectedFormLang === 'es' && 'Formulario de Notificación de Reacciones Adversas a Medicamentos (RAM)'}
                    {selectedFormLang === 'fr' && 'Formulaire de Déclaration des Effets Indésirables Médicamenteux'}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    National Pharmacovigilance Programme of India (PvPI) · Version 2026.1
                  </span>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Form</span>
                </button>
              </div>

              {/* Sections Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Section A: Patient Details */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-orange-950 block border-b border-orange-100 pb-1">
                    A. {selectedFormLang === 'hi' ? 'मरीज का विवरण (Patient Details)' : selectedFormLang === 'mr' ? 'रुग्णाची माहिती' : 'Patient Details'}
                  </span>
                  <div className="space-y-1 text-slate-600">
                    <p>• {selectedFormLang === 'hi' ? 'नाम / मरीज पहचान संख्या (Patient Initials/UHID)' : 'Patient Initials / UHID'}</p>
                    <p>• {selectedFormLang === 'hi' ? 'उम्र एवं लिंग (Age & Gender)' : 'Age & Gender (Cohort: 60+ prioritized)'}</p>
                    <p>• {selectedFormLang === 'hi' ? 'शरीर का वजन (Weight)' : 'Body Weight (kg)'}</p>
                  </div>
                </div>

                {/* Section B: Suspected ADR */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-orange-950 block border-b border-orange-100 pb-1">
                    B. {selectedFormLang === 'hi' ? 'संदिग्ध प्रतिक्रिया (Suspected Reaction)' : selectedFormLang === 'mr' ? 'संशयित दुष्परिणाम' : 'Suspected Adverse Reaction'}
                  </span>
                  <div className="space-y-1 text-slate-600">
                    <p>• {selectedFormLang === 'hi' ? 'प्रतिक्रिया का विस्तृत विवरण (Reaction Description)' : 'Description of reaction / event'}</p>
                    <p>• {selectedFormLang === 'hi' ? 'प्रारंभ होने की तारीख एवं समय (Onset Date/Time)' : 'Onset Date & Time after ingestion'}</p>
                    <p>• {selectedFormLang === 'hi' ? 'गंभीरता मापदंड (Seriousness Criteria): मृत्यु / अस्पताल भर्ती / जीवन को खतरा' : 'Seriousness: Hospitalization / Life threatening'}</p>
                  </div>
                </div>

                {/* Section C: Suspected Medication */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-orange-950 block border-b border-orange-100 pb-1">
                    C. {selectedFormLang === 'hi' ? 'संदिग्ध दवा (Suspected Medication)' : selectedFormLang === 'mr' ? 'संशयित औषध' : 'Suspected Medication'}
                  </span>
                  <div className="space-y-1 text-slate-600">
                    <p>• {selectedFormLang === 'hi' ? 'ब्रांड नाम एवं जेनेरिक नाम (Brand & Generic Name)' : 'Brand Name & Salt / Active Generic'}</p>
                    <p>• {selectedFormLang === 'hi' ? 'बैच नंबर एवं समाप्ति तिथि (Batch No. & Expiry)' : 'Batch Number & Expiry Date'}</p>
                    <p>• {selectedFormLang === 'hi' ? 'दवा की खुराक एवं मार्ग (Dose & Route)' : 'Daily Dose, Frequency and Route (Oral/IV)'}</p>
                  </div>
                </div>

                {/* Section D: Reporter Details */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-orange-950 block border-b border-orange-100 pb-1">
                    D. {selectedFormLang === 'hi' ? 'रिपोर्टकर्ता का विवरण (Reporter Details)' : selectedFormLang === 'mr' ? 'माहिती देणाऱ्याचे नाव' : 'Reporter Details'}
                  </span>
                  <div className="space-y-1 text-slate-600">
                    <p>• {selectedFormLang === 'hi' ? 'नाम एवं संपर्क (Name, Phone, Email)' : 'Name, Telephone, Email'}</p>
                    <p>• {selectedFormLang === 'hi' ? 'पेशा: मरीज / डॉक्टर / फार्मासिस्ट / आशा कार्यकर्ता' : 'Profession: Patient / Doctor / Pharmacist / ASHA Worker'}</p>
                    <p>• {selectedFormLang === 'hi' ? 'संस्थान / पता (Hospital / City)' : 'Hospital, AMC Centre, City'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
