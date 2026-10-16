import React from 'react';
import { Starship } from '../types/sensor';
import { ShipToken } from './ShipToken';
import { Navigation } from 'lucide-react';

interface SensorSquareProps {
  zoneIndex: number;
  ships: Starship[];
  selectedShipId: string | null;
  isGm: boolean;
  onSelectShip: (shipId: string) => void;
  onMoveSelectedHere?: (zoneIndex: number) => void;
}

export const SensorSquare: React.FC<SensorSquareProps> = ({
  zoneIndex,
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

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl border transition-all duration-150 min-w-[125px] sm:min-w-[155px] md:min-w-[175px] h-[220px] sm:h-[250px] p-2 bg-void-900/90 shadow-lg backdrop-blur select-none
        ${
          ships.some((s) => s.id === selectedShipId)
            ? 'border-cyan-500/80 ring-1 ring-cyan-500/50 bg-void-800/90'
            : 'border-slate-800/90 hover:border-slate-700'
        }
      `}
    >
      {/* Top Header: Zone label and distance marker */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-800/60 text-xs">
        <span className="font-mono font-bold tracking-wider text-slate-300">
          ZONE {zoneIndex}
        </span>
        <span className="text-[10px] font-mono text-slate-500 bg-void-950 px-1.5 py-0.5 rounded border border-slate-800">
          RNG {zoneIndex}
        </span>
      </div>

      {/* Center: Starships placed in this square */}
      <div className="flex-1 flex items-center justify-center py-1 overflow-y-auto">
        {shipCount === 0 ? (
          <div className="flex flex-col items-center justify-center text-slate-700 py-4">
            <span className="text-2xl font-mono opacity-25">·</span>
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

      {/* Bottom Footer: "Move Here" button when a ship is active, or zone indicator */}
      <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between min-h-[28px]">
        {selectedShipId && isTargetForSelected && onMoveSelectedHere && isGm ? (
          <button
            onClick={() => onMoveSelectedHere(zoneIndex)}
            className="w-full flex items-center justify-center gap-1 py-1 px-2 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono transition-colors active:scale-95"
            title={`Move selected ship to Zone ${zoneIndex}`}
          >
            <Navigation className="w-3 h-3 rotate-45" />
            <span>Move Here</span>
          </button>
        ) : (
          <div className="w-full flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
            <span>{shipCount} {shipCount === 1 ? 'vessel' : 'vessels'}</span>
            <span className="opacity-60">Sq {zoneIndex}</span>
          </div>
        )}
      </div>
    </div>
  );
};
