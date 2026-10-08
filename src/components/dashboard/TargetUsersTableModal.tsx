import React, { useState } from 'react';
import { UserRole, UserGroupProfile } from '../../types/pv';
import { USER_GROUP_PROFILES } from '../../data/mockPvData';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  X,
  Search,
  LogIn,
  Layers,
  Sparkles,
} from 'lucide-react';

interface TargetUsersTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const TargetUsersTableModal: React.FC<TargetUsersTableModalProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  onSelectRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'permissions_matrix'>('table');

  if (!isOpen) return null;

  const categories = ['ALL', ...Array.from(new Set(USER_GROUP_PROFILES.map((u: UserGroupProfile) => u.accessCategory)))];

  const filteredUsers = USER_GROUP_PROFILES.filter((user: UserGroupProfile) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.primaryRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.accessCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.institution.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || user.accessCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const activeUserSpec = USER_GROUP_PROFILES.find((u: UserGroupProfile) => u.id === currentUserRole) || USER_GROUP_PROFILES[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl border border-orange-200 shadow-2xl max-w-5xl w-full overflow-hidden text-slate-900 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header - Warm Light Orange Theme */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/80 border-b border-orange-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-orange-950">
                  Target Users Table · Roles &amp; Permissions Definition
                </h3>
                <span className="text-[10px] font-bold bg-orange-600 text-white px-2 py-0.5 rounded-full uppercase">
                  8 Defined Groups
                </span>
              </div>
              <p className="text-xs text-orange-900/80">
                Specification of target user groups, primary roles, and access categories in DoseGuard. Click &ldquo;Log In As User&rdquo; to switch persona.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active User Banner */}
        <div className="bg-orange-50/60 px-6 py-3 border-b border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={activeUserSpec.avatar}
              alt={activeUserSpec.userName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-orange-300 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium">Active Session:</span>
                <span className="font-bold text-slate-900">{activeUserSpec.userName}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeUserSpec.badgeColor}`}>
                  {activeUserSpec.name} ({activeUserSpec.accessCategory})
                </span>
              </div>
              <span className="text-[11px] text-slate-600">{activeUserSpec.institution}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated &amp; Active
            </span>
          </div>
        </div>

        {/* Search, Filter & View Toggle Bar */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user group, role, or persona..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-orange-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-orange-500"
            >
              {categories.map((cat: string) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-white text-orange-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Target Users Table
            </button>
            <button
              onClick={() => setViewMode('permissions_matrix')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'permissions_matrix' ? 'bg-white text-orange-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Permissions Matrix
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {viewMode === 'table' ? (
            <div className="overflow-x-auto rounded-2xl border border-orange-100 shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-orange-50/80 text-orange-950 font-bold border-b border-orange-200">
                    <th className="py-3 px-4">User Group</th>
                    <th className="py-3 px-4">Primary Role in DoseGuard</th>
                    <th className="py-3 px-4">Access Category</th>
                    <th className="py-3 px-4">Active Persona &amp; Org</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user: UserGroupProfile) => {
                    const isActive = currentUserRole === user.id;

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-orange-50/40 transition-colors ${
                          isActive ? 'bg-orange-50/50 font-medium' : 'bg-white'
                        }`}
                      >
                        {/* User Group Name with Badge */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex items-start gap-2.5">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0 mt-0.5"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block text-xs">{user.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">ID: {user.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Primary Role Description */}
                        <td className="py-3.5 px-4 align-top max-w-xs">
                          <p className="text-slate-800 font-medium leading-relaxed">{user.primaryRole}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {user.permissions.slice(0, 2).map((perm: string, i: number) => (
                              <span
                                key={i}
                                className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-normal"
                              >
                                {perm}
                              </span>
                            ))}
                            {user.permissions.length > 2 && (
                              <span className="text-[10px] text-orange-700 font-semibold">
                                +{user.permissions.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Access Category */}
                        <td className="py-3.5 px-4 align-top">
                          <span
                            className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${user.badgeColor}`}
                          >
                            {user.accessCategory}
                          </span>
                        </td>

                        {/* Persona & Org */}
                        <td className="py-3.5 px-4 align-top">
                          <div>
                            <span className="font-bold text-slate-900 block">{user.userName}</span>
                            <span className="text-[11px] text-slate-500 block">{user.roleTitle}</span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">
                              {user.institution}
                            </span>
                          </div>
                        </td>

                        {/* Action: Login as this user */}
                        <td className="py-3.5 px-4 align-top text-center">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Current User</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                onSelectRole(user.id);
                                onClose();
                              }}
                              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 mx-auto"
                            >
                              <LogIn className="w-3.5 h-3.5" />
                              <span>Log In As User</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* ================= PERMISSIONS MATRIX VIEW ================= */
            <div className="overflow-x-auto rounded-2xl border border-orange-100 shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-orange-50/80 text-orange-950 font-bold border-b border-orange-200">
                    <th className="py-3 px-3">User Group</th>
                    <th className="py-3 px-3">Access Category</th>
                    <th className="py-3 px-3">Core Responsibilities &amp; Key Permissions</th>
                    <th className="py-3 px-3 text-center">Switch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {USER_GROUP_PROFILES.map((u: UserGroupProfile) => {
                    const isActive = currentUserRole === u.id;

                    return (
                      <tr
                        key={u.id}
                        className={`hover:bg-orange-50/30 transition-colors ${
                          isActive ? 'bg-orange-50/50 font-medium' : 'bg-white'
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-full object-cover border border-slate-200"
                            />
                            <span>{u.name}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${u.badgeColor}`}>
                            {u.accessCategory}
                          </span>
                        </td>

                        <td className="py-3 px-3 max-w-md">
                          <div className="flex flex-wrap gap-1">
                            {u.permissions.map((perm: string, pIdx: number) => (
                              <span
                                key={pIdx}
                                className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                              >
                                {perm}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {isActive ? (
                            <span className="text-[10px] text-emerald-700 font-bold">Active</span>
                          ) : (
                            <button
                              onClick={() => {
                                onSelectRole(u.id);
                                onClose();
                              }}
                              className="text-[11px] font-bold text-orange-700 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200 transition-colors"
                            >
                              Switch
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Standards & Compliance Footnote */}
          <div className="bg-orange-50/40 border border-orange-200 rounded-2xl p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>
                <strong>PvPI ADRMS &amp; WHO-UMC Multi-Tenant Role Architecture:</strong> All reports maintain full chain-of-custody from patient recording to regulatory submission.
              </span>
            </div>
            <span className="text-[11px] font-mono text-orange-950 font-semibold whitespace-nowrap">
              ISO 27001 / GCP Compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
