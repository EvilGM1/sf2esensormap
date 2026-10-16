import React from 'react';
import { Starship, ShipSize } from '../types/sensor';
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
  const isPlayer = ship.faction === 'player';

  // Faction colors
  const getFactionColors = () => {
    switch (ship.faction) {
      case 'player':
        return {
          fill: '#38bdf8', // Player Blue
          stroke: '#bae6fd',
          glow: 'rgba(56, 189, 248, 0.45)',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        };
      case 'ally':
        return {
          fill: '#22c55e', // Green
          stroke: '#86efac',
          glow: 'rgba(34, 197, 94, 0.45)',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'enemy':
        return {
          fill: '#ef4444', // Red
          stroke: '#fca5a5',
          glow: 'rgba(239, 68, 68, 0.45)',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      case 'neutral':
        return {
          fill: '#eab308', // Yellow
          stroke: '#fde047',
          glow: 'rgba(234, 179, 8, 0.45)',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
    }
  };

  // Precise pixel dimensions for every size class
  const getSizeConfig = (size: ShipSize = 'medium') => {
    switch (size) {
      case 'tiny':
        return {
          npcW: 20,
          npcH: 20,
          playerW: 26,
          playerH: 18,
          tag: 'TNY',
        };
      case 'small':
        return {
          npcW: 28,
          npcH: 28,
          playerW: 36,
          playerH: 26,
          tag: 'SML',
        };
      case 'medium':
        return {
          npcW: 36,
          npcH: 36,
          playerW: 48,
          playerH: 34,
          tag: 'MED',
        };
      case 'large':
        return {
          npcW: 48,
          npcH: 48,
          playerW: 64,
          playerH: 46,
          tag: 'LRG',
        };
      case 'huge':
        return {
          npcW: 62,
          npcH: 62,
          playerW: 80,
          playerH: 56,
          tag: 'HUG',
        };
      case 'gargantuan':
        return {
          npcW: 76,
          npcH: 76,
          playerW: 98,
          playerH: 70,
          tag: 'GAR',
        };
      case 'colossal':
        return {
          npcW: 92,
          npcH: 92,
          playerW: 118,
          playerH: 84,
          tag: 'COL',
        };
    }
  };

  // In RAW SF2E player ships are Medium
  const effectiveSize: ShipSize = isPlayer ? 'medium' : ship.size || 'medium';
  const sizeConfig = getSizeConfig(effectiveSize);
  const colors = getFactionColors();

  const width = isPlayer ? sizeConfig.playerW : sizeConfig.npcW;
  const height = isPlayer ? sizeConfig.playerH : sizeConfig.npcH;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      title={`${ship.name} [${sizeConfig.tag}] (${ship.faction.toUpperCase()}) - Facing ${ship.heading.toUpperCase()}${ship.hidden ? ' [CLOAKED]' : ''}`}
      className={`relative group cursor-pointer transition-all duration-200 flex flex-col items-center justify-center
        ${compact ? 'p-0.5' : 'p-1'}
        ${isSelected ? 'scale-105' : 'hover:scale-105 active:scale-95'}
        ${ship.hidden ? (isGm ? 'opacity-65 border-dashed border border-purple-500/60 rounded-lg bg-purple-950/20' : 'hidden') : ''}
      `}
    >
      {/* Selection halo */}
      {isSelected && (
        <div
          className="absolute -inset-1 rounded-xl bg-cyan-400/20 border border-cyan-400/80 animate-pulse pointer-events-none"
          style={{ boxShadow: `0 0 14px ${colors.glow}` }}
        />
      )}

      {/* SVG Ship Graphic with exact pixel dimensions */}
      <div className="relative flex items-center justify-center">
        {isPlayer ? (
          /* High-Tech Player Starship Chevron */
          <svg
            style={{ width: `${width}px`, height: `${height}px` }}
            className={`transition-all duration-200 drop-shadow-md ${
              isFacingRight ? '' : 'rotate-180'
            }`}
            viewBox="0 0 48 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Hull */}
            <path
              d="M6 4L40 18L6 32L14 18L6 4Z"
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Wing Detail Panels */}
            <path d="M10 9L26 16L12 18Z" fill="#0284c7" opacity="0.85" />
            <path d="M10 27L26 20L12 18Z" fill="#0284c7" opacity="0.85" />
            {/* Cockpit Canopy */}
            <polygon
              points="16,18 29,18 23,13 16,14.5"
              fill="#0369a1"
              stroke="#e0f2fe"
              strokeWidth="1.2"
            />
            {/* Thruster Engine Glow */}
            <circle cx="10" cy="18" r="3.5" fill="#38bdf8" className="animate-ping opacity-60" />
            <circle cx="10" cy="18" r="2.5" fill="#ffffff" />
          </svg>
        ) : (
          /* NPC Starship Triangle */
          <svg
            style={{ width: `${width}px`, height: `${height}px` }}
            className={`transition-all duration-200 drop-shadow-md ${
              isFacingRight ? '' : 'rotate-180'
            }`}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Triangle Hull */}
            <polygon
              points="4,5 29,16 4,27 10,16"
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Inner accent */}
            <polygon points="8,10 20,16 8,22 10,16" fill="rgba(0,0,0,0.25)" />
            {/* Center radar signature dot */}
            <circle cx="16" cy="16" r="2" fill="#ffffff" opacity="0.9" />
          </svg>
        )}

        {/* Cloaked stealth badge in GM mode */}
        {ship.hidden && isGm && (
          <div
            className="absolute -top-1.5 -right-1.5 bg-purple-900 border border-purple-400 text-purple-200 rounded-full p-0.5 shadow z-10"
            title="Hidden from player scanners"
          >
            <EyeOff className="w-3 h-3 text-purple-300" />
          </div>
        )}
      </div>

      {/* Label, Heading & Size Tag */}
      <div className="flex items-center gap-1 mt-1 max-w-[120px] pointer-events-none">
        <span
          className={`text-[9px] sm:text-[10px] font-semibold truncate px-1 rounded border leading-tight flex items-center gap-1 ${colors.badgeBg}`}
        >
          <span>{isFacingRight ? '►' : '◄'}</span>
          <span className="truncate">{ship.name}</span>
          <span className="text-[8px] opacity-80 font-mono">[{sizeConfig.tag}]</span>
        </span>
      </div>
    </div>
  );
};
