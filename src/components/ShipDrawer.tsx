import React from 'react';
import { useSensor } from '../context/SensorContext';
import {
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Trash2,
  X,
  ShieldAlert,
  Compass,
} from 'lucide-react';

export const ShipDrawer: React.FC = () => {
  const {
    selectedShip,
    selectShip,
    flipShipHeading,
    nudgeShip,
    moveShip,
    toggleShipHidden,
    removeShip,
    sensorRange,
    viewMode,
  } = useSensor();

  if (!selectedShip) return null;

  const isGm = viewMode === 'gm';
  const isPlayerShip = selectedShip.faction === 'player';

  const getFactionBadge = () => {
    switch (selectedShip.faction) {
      case 'player':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'ally':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'enemy':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'neutral':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-void-900/95 border-t border-slate-700/80 backdrop-blur-md shadow-2xl p-4 sm:p-5 transition-transform duration-200">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        {/* Top bar: Ship info & close button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base sm:text-lg text-slate-100 flex items-center gap-2">
              <span>{selectedShip.name}</span>
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-mono uppercase border ${getFactionBadge()}`}
            >
              {selectedShip.faction}
            </span>
            {selectedShip.hidden && isGm && (
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-purple-900/60 text-purple-200 border border-purple-500/40 flex items-center gap-1">
                <EyeOff className="w-3 h-3" /> Cloaked
              </span>
            )}
          </div>

          <button
            onClick={() => selectShip(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close ship details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Controls Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Flip Heading Button */}
          <button
            onClick={() => flipShipHeading(selectedShip.id)}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-void-800 hover:bg-void-700 border border-slate-700 text-slate-200 font-mono text-sm transition-all active:scale-95 shadow"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>
              Facing: <strong className="text-cyan-300">{selectedShip.heading === 'right' ? 'RIGHT ►' : '◄ LEFT'}</strong>
            </span>
          </button>

          {/* Nudge Left Button */}
          <button
            onClick={() => nudgeShip(selectedShip.id, 'left')}
            disabled={selectedShip.square <= 0}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-void-800 hover:bg-void-700 disabled:opacity-40 disabled:hover:bg-void-800 border border-slate-700 text-slate-200 font-mono text-sm transition-all active:scale-95 shadow"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Move Left (Zone {Math.max(0, selectedShip.square - 1)})</span>
          </button>

          {/* Nudge Right Button */}
          <button
            onClick={() => nudgeShip(selectedShip.id, 'right')}
            disabled={selectedShip.square >= sensorRange - 1}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-void-800 hover:bg-void-700 disabled:opacity-40 disabled:hover:bg-void-800 border border-slate-700 text-slate-200 font-mono text-sm transition-all active:scale-95 shadow"
          >
            <span>Move Right (Zone {Math.min(sensorRange - 1, selectedShip.square + 1)})</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Scanner Cloak / Hide Toggle (GM only) */}
          {isGm ? (
            <button
              onClick={() => toggleShipHidden(selectedShip.id)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border font-mono text-sm transition-all active:scale-95 shadow ${
                selectedShip.hidden
                  ? 'bg-purple-900/50 hover:bg-purple-900 border-purple-500/70 text-purple-200'
                  : 'bg-void-800 hover:bg-void-700 border-slate-700 text-slate-300'
              }`}
            >
              {selectedShip.hidden ? (
                <>
                  <Eye className="w-4 h-4 text-purple-300" />
                  <span>Reveal to Players</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 text-slate-400" />
                  <span>Hide from Players</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-center py-2 px-3 rounded-lg bg-void-800/50 border border-slate-800 text-slate-400 font-mono text-xs">
              <Compass className="w-4 h-4 mr-1 text-cyan-400" />
              <span>Current: Zone {selectedShip.square}</span>
            </div>
          )}
        </div>

        {/* Secondary Bar: Zone Jump selector and Delete (if GM and not player ship) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Jump to Zone:</span>
            <select
              value={selectedShip.square}
              onChange={(e) => moveShip(selectedShip.id, parseInt(e.target.value, 10))}
              className="bg-void-950 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1 font-mono focus:outline-none focus:border-cyan-500"
            >
              {Array.from({ length: sensorRange }, (_, i) => (
                <option key={i} value={i}>
                  Zone {i} {i === selectedShip.square ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Tactical Off-guard notice */}
          <div className="flex items-center gap-1.5 text-amber-400/90 font-mono text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>
              Off-Guard from {selectedShip.heading === 'right' ? 'LEFT (Rear)' : 'RIGHT (Rear)'}
            </span>
          </div>

          {/* Delete vessel (GM only, can delete any ship or player ship if desired) */}
          {isGm && !isPlayerShip && (
            <button
              onClick={() => removeShip(selectedShip.id)}
              className="flex items-center gap-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2 py-1 rounded transition-colors ml-auto font-mono text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Ship</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
