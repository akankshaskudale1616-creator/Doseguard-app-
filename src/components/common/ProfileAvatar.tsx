import React from 'react';
import { 
  User, 
  Stethoscope, 
  Pill, 
  HeartHandshake, 
  Building2, 
  FileCheck2, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export interface ProfileAvatarProps {
  role?: string;
  name?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBadge?: boolean;
  shape?: 'circle' | 'rounded';
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  role = 'patient',
  name = '',
  initials,
  size = 'md',
  className = '',
  showBadge = false,
  shape = 'circle',
}) => {
  // Normalize role
  const normalizedRole = role.toLowerCase();

  // Generate initials if not provided
  const derivedInitials = React.useMemo(() => {
    if (initials) return initials;
    if (!name) {
      if (normalizedRole.includes('pharmacist')) return 'Rx';
      if (normalizedRole.includes('physician') || normalizedRole.includes('doctor')) return 'Dr';
      if (normalizedRole.includes('caregiver')) return 'CG';
      if (normalizedRole.includes('hospital')) return 'PV';
      if (normalizedRole.includes('amc')) return 'AMC';
      return 'PT';
    }
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [initials, name, normalizedRole]);

  // Dimension mapping
  const sizeClasses = {
    xs: 'w-4 h-4 text-[9px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-14 h-14 text-base',
    '2xl': 'w-16 h-16 text-lg',
  }[size];

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-7 h-7',
    '2xl': 'w-8 h-8',
  }[size];

  // Role-specific theme configuration
  const getTheme = () => {
    if (normalizedRole.includes('pharmacist')) {
      return {
        bg: 'bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600',
        text: 'text-white',
        border: 'border-orange-300 ring-2 ring-orange-200/50',
        Icon: Pill,
        roleLabel: 'Pharmacist',
        badgeColor: 'bg-amber-400',
      };
    }
    if (normalizedRole.includes('physician') || normalizedRole.includes('doctor')) {
      return {
        bg: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700',
        text: 'text-white',
        border: 'border-indigo-300 ring-2 ring-indigo-200/50',
        Icon: Stethoscope,
        roleLabel: 'Physician',
        badgeColor: 'bg-emerald-400',
      };
    }
    if (normalizedRole.includes('caregiver')) {
      return {
        bg: 'bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-700',
        text: 'text-white',
        border: 'border-teal-300 ring-2 ring-teal-200/50',
        Icon: HeartHandshake,
        roleLabel: 'Caregiver',
        badgeColor: 'bg-teal-300',
      };
    }
    if (normalizedRole.includes('hospital')) {
      return {
        bg: 'bg-gradient-to-br from-purple-600 via-violet-600 to-purple-800',
        text: 'text-white',
        border: 'border-purple-300 ring-2 ring-purple-200/50',
        Icon: Building2,
        roleLabel: 'Hospital PV',
        badgeColor: 'bg-purple-300',
      };
    }
    if (normalizedRole.includes('amc')) {
      return {
        bg: 'bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700',
        text: 'text-white',
        border: 'border-rose-300 ring-2 ring-rose-200/50',
        Icon: FileCheck2,
        roleLabel: 'AMC Node',
        badgeColor: 'bg-rose-300',
      };
    }
    // Default: Patient
    return {
      bg: 'bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-600',
      text: 'text-white',
      border: 'border-sky-300 ring-2 ring-sky-200/50',
      Icon: User,
      roleLabel: 'Patient',
      badgeColor: 'bg-emerald-400',
    };
  };

  const theme = getTheme();
  const IconComponent = theme.Icon;
  const roundedClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <div
        className={`${sizeClasses} ${roundedClass} ${theme.bg} ${theme.text} ${theme.border} font-bold flex items-center justify-center shadow-xs transition-transform select-none relative overflow-hidden`}
        title={name ? `${name} (${theme.roleLabel})` : theme.roleLabel}
        aria-label={name ? `${name} profile icon` : `${theme.roleLabel} profile icon`}
      >
        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/25 pointer-events-none" />

        {/* Center Profile Icon */}
        <IconComponent className={`${iconSizes} drop-shadow-xs relative z-10`} />

        {/* Small corner initials badge for larger sizes */}
        {(size === 'xl' || size === '2xl') && (
          <span className="absolute bottom-0.5 right-1 text-[10px] font-mono font-black text-white/90 drop-shadow-xs z-10">
            {derivedInitials}
          </span>
        )}
      </div>

      {/* Online/Active status indicator badge */}
      {showBadge && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${theme.badgeColor} border-2 border-white shadow-xs z-20`}
        />
      )}
    </div>
  );
};

export default ProfileAvatar;
