import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Bot,
  Globe2,
  MapPin,
  Camera,
  Layers,
  Activity,
  User,
  Users,
  Stethoscope,
  Building2,
  Building,
  BarChart2,
  HeartHandshake,
  ChevronDown,
  Sparkles,
  Check,
  Languages,
} from 'lucide-react';
import { UserRole } from '../types/pv';
import { USER_GROUP_PROFILES } from '../data/mockPvData';
import { TargetUsersTableModal } from './dashboard/TargetUsersTableModal';
import { useLanguage } from '../context/LanguageContext';

export type AppTab =
  | 'patient'
  | 'caregiver'
  | 'pharmacist'
  | 'physician'
  | 'hospital_pv'
  | 'amc'
  | 'regulator'
  | 'researcher'
  | 'language'
  | 'chat'
  | 'search'
  | 'maps'
  | 'dermatology'
  | 'analytics'
  | 'architecture';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onEmergencyClick: () => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  emergencyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onEmergencyClick,
  userRole,
  setUserRole,
  emergencyCount,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isUsersTableModalOpen, setIsUsersTableModalOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const { language, setLanguage, t, languages } = useLanguage();

  const currentProfile = USER_GROUP_PROFILES.find((p) => p.id === userRole) || USER_GROUP_PROFILES[0];

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    setActiveTab(role as AppTab);
    setIsRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-200/80 shadow-xs text-slate-900">
      {/* Top Notification Bar: Active Logged In Role Profile */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50/80 to-orange-100/60 border-b border-orange-200/70 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="font-bold text-orange-950 uppercase tracking-wide flex items-center gap-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Logged In Role:</span>
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <img
                src={currentProfile.avatar}
                alt={currentProfile.userName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
                className="w-4 h-4 rounded-full object-cover border border-orange-300"
              />
              <span className="font-bold text-slate-900">
                {currentProfile.userName}
              </span>
            </div>
            <span className="text-slate-400">·</span>
            <span className="text-orange-900 font-semibold bg-white border border-orange-200 px-2 py-0.5 rounded-full shrink-0">
              {currentProfile.name} ({currentProfile.accessCategory})
            </span>
            <span className="text-slate-400 hidden sm:inline">·</span>
            <span className="text-slate-600 hidden sm:inline truncate">
              {currentProfile.institution}
            </span>
          </div>

          {/* Quick Role and Language Switcher Trigger Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Language Switcher Trigger Button */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                  setIsRoleDropdownOpen(false);
                }}
                className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-orange-300 rounded-lg text-orange-950 font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                title="Switch Language / भाषा निवडा"
              >
                <Languages className="w-3.5 h-3.5 text-orange-600" />
                <span className="font-bold">
                  {languages.find((l) => l.code === language)?.nativeName || 'Language'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Dropdown Menu for Languages */}
              {isLangDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl border border-orange-200 shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                  <div className="p-1.5 border-b border-orange-100 mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-orange-950 uppercase tracking-wider">
                      Select Language (भाषा)
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('language');
                        setIsLangDropdownOpen(false);
                      }}
                      className="text-[10px] text-orange-600 hover:underline font-bold"
                    >
                      Portal →
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-0.5">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center justify-between transition-colors ${
                          language === l.code
                            ? 'bg-orange-500 text-white font-bold'
                            : 'text-slate-800 hover:bg-orange-50'
                        }`}
                      >
                        <div>
                          <span className="font-semibold">{l.nativeName}</span>
                          <span className="text-[10px] opacity-75 ml-1">({l.name})</span>
                        </div>
                        {language === l.code && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1.5 mt-1 border-t border-orange-100">
                    <button
                      onClick={() => {
                        setActiveTab('language');
                        setIsLangDropdownOpen(false);
                      }}
                      className="w-full py-1 text-center text-[11px] font-bold text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      Open Full Vernacular Portal →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Role Switcher Trigger Button */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setIsRoleDropdownOpen(!isRoleDropdownOpen);
                  setIsLangDropdownOpen(false);
                }}
                className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-orange-300 rounded-lg text-orange-900 font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-orange-600" />
                <span>Switch User Role (8 Groups)</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

            {/* Dropdown Menu for 8 User Groups */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-white rounded-2xl border border-orange-200 shadow-2xl p-2.5 z-50 animate-in fade-in duration-150">
                <div className="p-2 border-b border-orange-100 mb-1.5">
                  <span className="text-[11px] font-bold text-orange-950 uppercase tracking-wider block">
                    8 Defined User Groups (Roles &amp; Permissions)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Switch active view &amp; test dedicated features according to user role
                  </span>
                </div>

                <div className="max-h-[380px] overflow-y-auto space-y-1">
                  {USER_GROUP_PROFILES.map((p) => {
                    const isSelected = userRole === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectRole(p.id)}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-orange-500 text-white shadow-xs'
                            : 'hover:bg-orange-50/70 text-slate-800'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border ${
                            isSelected ? 'border-white shadow-xs' : 'border-orange-200'
                          }`}
                        >
                          <img
                            src={p.avatar}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs truncate">{p.name}</span>
                            <span
                              className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full uppercase ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-900'
                              }`}
                            >
                              {p.accessCategory}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] block truncate ${
                              isSelected ? 'text-orange-100' : 'text-slate-500'
                            }`}
                          >
                            {p.userName} · {p.primaryRole}
                          </span>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-white shrink-0 self-center" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 mt-2 border-t border-orange-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      setIsUsersTableModalOpen(true);
                    }}
                    className="w-full py-1.5 px-3 bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-orange-600" />
                    <span>View Roles &amp; Permissions Matrix Table</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 p-[1px] shadow-md shadow-orange-500/20">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                  DoseGuard
                </span>
                <span className="hidden sm:inline-block text-[10px] bg-orange-100 text-orange-800 border border-orange-200 font-bold px-2 py-0.5 rounded-full">
                  PvPI v2.4
                </span>
              </div>
              <span className="hidden sm:inline-block text-[11px] text-slate-500 font-medium">
                Digital Pharmacovigilance &amp; Multi-Role Platform
              </span>
            </div>
          </div>

          {/* Blank Middle Space as requested */}
          <div className="flex-1" />

          {/* Zone 3: Primary Actions (Emergency Red Flag Button) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onEmergencyClick}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 rounded-xl shadow-md shadow-rose-600/30 transition-all whitespace-nowrap border border-rose-400/40 animate-pulse"
            >
              <AlertTriangle className="w-4 h-4 text-white" />
              <span>Emergency SOS (108)</span>
            </button>
          </div>
        </div>

        {/* Secondary Navigation Row: Quick Tools & All 8 Roles on Mobile */}
        <div className="flex items-center justify-start gap-1.5 py-2 border-t border-orange-100 overflow-x-auto text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-1 shrink-0">Dashboards:</span>
          {USER_GROUP_PROFILES.map((p) => {
            const isSelected = activeTab === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActiveTab(p.id as AppTab);
                  setUserRole(p.id);
                }}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium ${
                  isSelected ? 'bg-orange-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.name.replace('Community ', '')}
              </button>
            );
          })}

          <span className="text-slate-300 px-1 shrink-0">|</span>
          <span className="text-[10px] uppercase font-bold text-slate-400 px-1 shrink-0">Clinical Tools:</span>

          <button
            onClick={() => setActiveTab('language')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium flex items-center gap-1 ${
              activeTab === 'language' ? 'bg-orange-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Languages className="w-3 h-3 text-orange-600" />
            <span>{t('languagesTab', 'Languages')}</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium flex items-center gap-1 ${
              activeTab === 'chat' ? 'bg-orange-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-3 h-3" />
            <span>Chatbot</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium flex items-center gap-1 ${
              activeTab === 'search' ? 'bg-orange-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe2 className="w-3 h-3" />
            <span>Search Alerts</span>
          </button>
          <button
            onClick={() => setActiveTab('maps')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium flex items-center gap-1 ${
              activeTab === 'maps' ? 'bg-orange-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>AMC Locator</span>
          </button>
          <button
            onClick={() => setActiveTab('dermatology')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium flex items-center gap-1 ${
              activeTab === 'dermatology' ? 'bg-orange-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>Rash Visuals</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium flex items-center gap-1 ${
              activeTab === 'analytics' ? 'bg-orange-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>Signals</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium flex items-center gap-1 ${
              activeTab === 'architecture' ? 'bg-orange-500 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Architecture &amp; Spec</span>
          </button>
        </div>
      </div>

      {/* Target Users Table Modal (Roles & Permissions Definition) */}
      <TargetUsersTableModal
        isOpen={isUsersTableModalOpen}
        onClose={() => setIsUsersTableModalOpen(false)}
        currentUserRole={userRole}
        onSelectRole={handleSelectRole}
      />
    </header>
  );
};
