import React from 'react';
import { Starship } from '../types/sensor';
import { EyeOff } from 'lucide-react';

interface ShipTokenProps {
  ship: Starship;
  isSelected: boolean;
  isGm: boolean;
  compact?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export const ShipToken: React.FC<ShipTokenProps> = ({
  ship,
  isSelected,
  isGm,
  compact = false,
  onClick,
}) => {
  const isFacingRight = ship.heading === 'right';

  // Faction color tokens
  const getFactionColors = () => {
    switch (ship.faction) {
      case 'player':
        return {
          fill: '#38bdf8', // Blue
          stroke: '#bae6fd',
          glow: 'rgba(56, 189, 248, 0.4)',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          indicator: 'text-sky-400',
        };
      case 'ally':
        return {
          fill: '#22c55e', // Green
          stroke: '#86efac',
          glow: 'rgba(34, 197, 94, 0.4)',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          indicator: 'text-emerald-400',
        };
      case 'enemy':
        return {
          fill: '#ef4444', // Red
          stroke: '#fca5a5',
          glow: 'rgba(239, 68, 68, 0.4)',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          indicator: 'text-rose-400',
        };
      case 'neutral':
        return {
          fill: '#eab308', // Yellow
          stroke: '#fde047',
          glow: 'rgba(234, 179, 8, 0.4)',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          indicator: 'text-amber-400',
        };
    }
  };

  const colors = getFactionColors();
  const isPlayer = ship.faction === 'player';

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      title={`${ship.name} (${ship.faction.toUpperCase()}) - Facing ${ship.heading.toUpperCase()}${ship.hidden ? ' [CLOAKED]' : ''}`}
      className={`relative group cursor-pointer transition-all duration-200 flex flex-col items-center justify-center
        ${compact ? 'p-1' : 'p-1.5'}
        ${isSelected ? 'scale-105' : 'hover:scale-105 active:scale-95'}
        ${ship.hidden ? (isGm ? 'opacity-65 border-dashed border border-purple-500/50 rounded-lg bg-purple-950/20' : 'hidden') : ''}
      `}
    >
      {/* Selection halo */}
      {isSelected && (
        <div 
          className="absolute -inset-1 rounded-xl bg-cyan-400/20 border border-cyan-400/80 animate-pulse pointer-events-none"
          style={{ boxShadow: `0 0 12px ${colors.glow}` }}
        />
      )}

      {/* SVG Ship Graphic */}
      <div className="relative flex items-center justify-center">
        {isPlayer ? (
          /* Player Starship Chevron */
          <svg
            className={`transition-transform duration-200 drop-shadow-md ${
              compact ? 'w-10 h-8 sm:w-12 sm:h-9' : 'w-12 h-10 sm:w-14 sm:h-11'
            } ${isFacingRight ? '' : 'rotate-180'}`}
            viewBox="0 0 48 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Hull */}
            <path
              d="M6 4L38 18L6 32L14 18L6 4Z"
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Cockpit Core */}
            <polygon
              points="14,18 26,18 20,13 14,15"
              fill="#0369a1"
              stroke="#e0f2fe"
              strokeWidth="1"
            />
            {/* Thruster Glow (opposite of heading) */}
            <circle cx="10" cy="18" r="3.5" fill="#38bdf8" className="animate-ping opacity-60" />
            <circle cx="10" cy="18" r="2.5" fill="#ffffff" />
          </svg>
        ) : (
          /* NPC Starship Triangle */
          <svg
            className={`transition-transform duration-200 drop-shadow-md ${
              compact ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-9 sm:h-9'
            } ${isFacingRight ? '' : 'rotate-180'}`}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Triangle Hull */}
            <polygon
              points="4,6 28,16 4,26 9,16"
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Central sensor dot */}
            <circle cx="15" cy="16" r="2" fill="#ffffff" opacity="0.9" />
          </svg>
        )}

        {/* Cloaked stealth badge in GM mode */}
        {ship.hidden && isGm && (
          <div
            className="absolute -top-1.5 -right-1.5 bg-purple-900 border border-purple-400 text-purple-200 rounded-full p-0.5 shadow"
            title="Hidden from player scanners"
          >
            <EyeOff className="w-3 h-3 text-purple-300" />
          </div>
        )}
      </div>

      {/* Label and Heading Indicator */}
      <div className="flex items-center gap-1 mt-1 max-w-[85px] sm:max-w-[100px] pointer-events-none">
        <span
          className={`text-[10px] sm:text-xs font-semibold truncate px-1 rounded border leading-tight ${colors.badgeBg}`}
        >
          {isFacingRight ? '►' : '◄'} {ship.name}
        </span>
      </div>
    </div>
  );
};
