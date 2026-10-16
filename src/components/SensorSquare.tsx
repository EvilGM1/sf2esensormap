import React from 'react';
import { Starship } from '../types/sensor';
import { ShipToken } from './ShipToken';
import { Navigation } from 'lucide-react';

interface SensorSquareProps {
  zoneIndex: number;
  playerSquare: number | null;
  ships: Starship[];
  selectedShipId: string | null;
  isGm: boolean;
  onSelectShip: (shipId: string) => void;
  onMoveSelectedHere?: (zoneIndex: number) => void;
}

export const SensorSquare: React.FC<SensorSquareProps> = ({
  zoneIndex,
  playerSquare,
  ships,
  selectedShipId,
  isGm,
  onSelectShip,
  onMoveSelectedHere,
}) => {
  const isTargetForSelected =
    selectedShipId && !ships.some((s) => s.id === selectedShipId);

  // Multi-ship layout clustering
  const shipCount = ships.length;
  const isDense = shipCount >= 3;
  const hasPlayerShip = ships.some((s) => s.faction === 'player');

  // Relative distance calculation from Player Ship
  const relativeDistance =
    playerSquare !== null ? zoneIndex - playerSquare : null;

  const getRelativeLabel = () => {
    if (relativeDistance === null) return `Zone ${zoneIndex}`;
    if (relativeDistance === 0) return 'CORE 0';
    if (relativeDistance > 0) return `+${relativeDistance}`;
    return `${relativeDistance}`;
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl border transition-all duration-150 min-w-[135px] sm:min-w-[165px] md:min-w-[185px] h-[230px] sm:h-[260px] p-2 backdrop-blur select-none
        ${
          hasPlayerShip
            ? 'border-sky-500/80 bg-sky-950/20 ring-1 ring-sky-500/30'
            : ships.some((s) => s.id === selectedShipId)
            ? 'border-cyan-500/80 ring-1 ring-cyan-500/50 bg-void-800/90'
            : 'border-slate-800/90 bg-void-900/90 hover:border-slate-700'
        }
      `}
    >
      {/* Top Header: Relative Range and Zone Index */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/70 text-xs font-mono">
        <span
          className={`font-bold tracking-wider px-1.5 py-0.5 rounded text-[11px] ${
            relativeDistance === 0
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
              : 'text-slate-300'
          }`}
        >
          {getRelativeLabel()}
        </span>

        {isGm ? (
          <span className="text-[10px] text-slate-500 bg-void-950 px-1 py-0.5 rounded border border-slate-800">
            Zone {zoneIndex}
          </span>
        ) : (
          <span className="text-[10px] text-slate-500 font-mono">
            {relativeDistance === 0 ? 'SHIP CORE' : relativeDistance! > 0 ? 'AHEAD' : 'AFT'}
          </span>
        )}
      </div>

      {/* Center: Starships placed in this square */}
      <div className="flex-1 flex items-center justify-center py-1 overflow-y-auto overflow-x-hidden">
        {shipCount === 0 ? (
          <div className="flex flex-col items-center justify-center text-slate-700 py-4">
            <span className="text-xl font-mono opacity-25">·</span>
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-40">
              Empty
            </span>
          </div>
        ) : (
          <div
            className={`w-full flex items-center justify-center ${
              isDense
                ? 'grid grid-cols-2 gap-1 items-center justify-items-center'
                : 'flex flex-wrap items-center justify-center gap-2'
            }`}
          >
            {ships.map((ship) => (
              <ShipToken
                key={ship.id}
                ship={ship}
                compact={isDense}
                isSelected={ship.id === selectedShipId}
                isGm={isGm}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectShip(ship.id);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Footer: "Move Here" button or vessel count */}
      <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between min-h-[28px]">
        {selectedShipId && isTargetForSelected && onMoveSelectedHere && isGm ? (
          <button
            onClick={() => onMoveSelectedHere(zoneIndex)}
            className="w-full flex items-center justify-center gap-1 py-1 px-2 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono transition-colors active:scale-95"
            title={`Move selected ship here`}
          >
            <Navigation className="w-3 h-3 rotate-45" />
            <span>Move Here</span>
          </button>
        ) : (
          <div className="w-full flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
            <span>{shipCount} {shipCount === 1 ? 'vessel' : 'vessels'}</span>
            <span className="opacity-60">
              {isGm ? `Zone ${zoneIndex}` : (relativeDistance === 0 ? 'Core Zone' : `Rng ${Math.abs(relativeDistance ?? 0)}`)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
