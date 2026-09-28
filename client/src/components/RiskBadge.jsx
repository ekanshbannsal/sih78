import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

export default function RiskBadge({ risk = 'LOW', size = 'md', showIcon = true }) {
  const normalized = (risk || 'LOW').toUpperCase();

  const configs = {
    'LOW': {
      bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
      dot: 'bg-emerald-400',
      icon: ShieldCheck,
      label: 'Low Risk'
    },
    'MODERATE': {
      bg: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
      dot: 'bg-amber-400',
      icon: AlertTriangle,
      label: 'Moderate'
    },
    'HIGH': {
      bg: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
      dot: 'bg-orange-400',
      icon: AlertTriangle,
      label: 'High Risk'
    },
    'VERY HIGH': {
      bg: 'bg-rose-500/20 border-rose-500/60 text-rose-400 animate-pulse',
      dot: 'bg-rose-400',
      icon: Flame,
      label: 'Very High Risk'
    }
  };

  const config = configs[normalized] || configs['LOW'];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-bold px-3.5 py-1.5 gap-2'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size] || sizeClasses.md} transition-colors`}
      role="status"
      aria-label={`Forecast risk level: ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{normalized}</span>
    </span>
  );
}
