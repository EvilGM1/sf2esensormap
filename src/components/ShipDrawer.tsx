import React from 'react';
import { useSensor } from '../context/SensorContext';
import { ShipSize, Faction } from '../types/sensor';
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
  Maximize2,
  Radio,
  Palette,
  Crosshair,
} from 'lucide-react';

export const ShipDrawer: React.FC = () => {
  const {
    selectedShip,
    selectShip,
    flipShipHeading,
    nudgeShip,
    moveShip,
    toggleShipHidden,
    changeShipSize,
    changeShipFaction,
    removeShip,
    totalMapTiles,
    viewMode,
    playerShip,
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

  const sizeOptions: { id: ShipSize; label: string }[] = [
    { id: 'tiny', label: 'Tiny' },
    { id: 'small', label: 'Small' },
    { id: 'medium', label: 'Medium' },
    { id: 'large', label: 'Large' },
    { id: 'huge', label: 'Huge' },
    { id: 'gargantuan', label: 'Gargantuan' },
    { id: 'colossal', label: 'Colossal' },
  ];

  const factionOptions: { id: Faction; label: string; activeClass: string }[] = [
    {
      id: 'enemy',
      label: '🔴 Enemy',
      activeClass: 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold',
    },
    {
      id: 'ally',
      label: '🟢 Ally',
      activeClass: 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold',
    },
    {
      id: 'neutral',
      label: '🟡 Neutral',
      activeClass: 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold',
    },
    {
      id: 'player',
      label: '🔵 Player',
      activeClass: 'bg-sky-950/80 border-sky-500 text-sky-300 font-bold',
    },
  ];

  // Calculate relative distance for tactical readout
  const relativeDist = playerShip ? selectedShip.square - playerShip.square : 0;
  const relativeDistLabel =
    relativeDist === 0
      ? 'Co-located in CORE Zone'
      : relativeDist > 0
      ? `+${relativeDist} Zones Ahead`
      : `${relativeDist} Zones Astern`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-void-900/95 border-t border-slate-700/80 backdrop-blur-md shadow-2xl p-4 sm:p-5 transition-transform duration-200">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        {/* Top bar: Ship info & close button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base sm:text-lg text-slate-100 flex items-center gap-2 font-mono">
              <span>{selectedShip.name}</span>
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-mono uppercase border ${getFactionBadge()}`}
            >
              {selectedShip.faction}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono uppercase bg-void-950 border border-slate-700 text-slate-300">
              {selectedShip.size || 'medium'}
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

        {/* --- VIEW BRANCH 1: PLAYER VIEW OF NON-PLAYER CONTACT (READ-ONLY SENSOR SCAN) --- */}
        {!isGm && !isPlayerShip && (
          <div className="flex flex-col gap-3 py-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Relative Distance */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-void-950/80 border border-slate-800">
                <Compass className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div className="font-mono text-xs">
                  <span className="text-slate-500 block text-[10px] uppercase">Relative Range</span>
                  <strong className="text-slate-200">{relativeDistLabel}</strong>
                </div>
              </div>

              {/* Target Heading */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-void-950/80 border border-slate-800">
                <Radio className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div className="font-mono text-xs">
                  <span className="text-slate-500 block text-[10px] uppercase">Target Heading</span>
                  <strong className="text-cyan-300">
                    {selectedShip.heading === 'right' ? 'Heading RIGHT ►' : '◄ Heading LEFT'}
                  </strong>
                </div>
              </div>

              {/* Tactical Vulnerability (Off-Guard flank) */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-void-950/80 border border-amber-500/30">
                <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="font-mono text-xs">
                  <span className="text-slate-500 block text-[10px] uppercase">Tactical Vulnerability</span>
                  <span className="text-amber-300">
                    Off-Guard from {selectedShip.heading === 'right' ? 'LEFT (Rear)' : 'RIGHT (Rear)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Crosshair className="w-3.5 h-3.5" />
                <span>Sensors locked on target. External contact telemetry (Read-Only).</span>
              </span>
              <span className="text-slate-500 hidden sm:inline">
                Use Scanners / Gunnery battle stations to interact
              </span>
            </div>
          </div>
        )}

        {/* --- VIEW BRANCH 2: PLAYER SHIP CONTROL OR GM CONTROLS --- */}
        {(isGm || isPlayerShip) && (
          <>
            {/* Primary Movement & Action Controls Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Change Heading Button (Turn) */}
              <button
                onClick={() => flipShipHeading(selectedShip.id)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-void-800 hover:bg-void-700 border border-slate-700 text-slate-200 font-mono text-sm transition-all active:scale-95 shadow"
                title="Change Heading (Turn around)"
              >
                <RotateCcw className="w-4 h-4 text-cyan-400" />
                <span>
                  Facing: <strong className="text-cyan-300">{selectedShip.heading === 'right' ? 'RIGHT ►' : '◄ LEFT'}</strong>
                </span>
              </button>

              {/* Boost Thrusters (Move Forward in Direction of Heading) */}
              <button
                onClick={() => nudgeShip(selectedShip.id, selectedShip.heading === 'right' ? 'right' : 'left')}
                disabled={
                  selectedShip.heading === 'right'
                    ? selectedShip.square >= totalMapTiles - 1
                    : selectedShip.square <= 0
                }
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 font-mono text-sm transition-all active:scale-95 shadow disabled:opacity-40"
                title="Boost Thrusters (Move 1 zone forward along heading)"
              >
                {selectedShip.heading === 'left' ? <ArrowLeft className="w-4 h-4 text-cyan-400" /> : null}
                <span>Boost Thrusters ({selectedShip.heading === 'right' ? 'Forward ►' : '◄ Forward'})</span>
                {selectedShip.heading === 'right' ? <ArrowRight className="w-4 h-4 text-cyan-400" /> : null}
              </button>

              {/* GM Admin Reverse Nudge */}
              {isGm ? (
                <button
                  onClick={() => nudgeShip(selectedShip.id, selectedShip.heading === 'right' ? 'left' : 'right')}
                  disabled={
                    selectedShip.heading === 'right'
                      ? selectedShip.square <= 0
                      : selectedShip.square >= totalMapTiles - 1
                  }
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-void-800 hover:bg-void-700 disabled:opacity-30 border border-slate-700 text-slate-400 hover:text-slate-200 font-mono text-xs transition-all active:scale-95"
                  title="GM Administrative reposition: Nudge reverse"
                >
                  <span>Nudge Astern (GM)</span>
                </button>
              ) : (
                /* Player view indicator for player ship */
                <div className="flex items-center justify-center py-2 px-3 rounded-lg bg-void-800/50 border border-slate-800 text-slate-300 font-mono text-xs">
                  <Compass className="w-4 h-4 mr-1 text-cyan-400" />
                  <span>Position: Flagship Core (Zone 0)</span>
                </div>
              )}

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
                <div className="flex items-center justify-center gap-1.5 text-amber-400/90 font-mono text-[11px] p-2 bg-void-950/60 rounded-lg border border-amber-500/20">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>
                    Off-Guard: {selectedShip.heading === 'right' ? 'LEFT Flank' : 'RIGHT Flank'}
                  </span>
                </div>
              )}
            </div>

            {/* GM Controls: Faction/Color Reassignment and Ship Size */}
            {isGm && (
              <div className="flex flex-col gap-2 pt-1 border-t border-slate-800/80 font-mono text-xs">
                {/* GM Faction / IFF Color Reassignment */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Faction / Color:</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {factionOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => changeShipFaction(selectedShip.id, opt.id)}
                        className={`px-2 py-0.5 rounded text-[11px] border transition-all ${
                          selectedShip.faction === opt.id
                            ? opt.activeClass
                            : 'bg-void-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GM Size Selector Bar */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ship Size:</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sizeOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => changeShipSize(selectedShip.id, opt.id)}
                        className={`px-2 py-0.5 rounded text-[11px] border transition-all ${
                          (selectedShip.size || 'medium') === opt.id
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-void-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* GM Admin Bar: Zone Jump selector and Delete */}
            {isGm && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono">Jump to Zone:</span>
                  <select
                    value={selectedShip.square}
                    onChange={(e) => moveShip(selectedShip.id, parseInt(e.target.value, 10))}
                    className="bg-void-950 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1 font-mono focus:outline-none focus:border-cyan-500"
                  >
                    {Array.from({ length: totalMapTiles }, (_, i) => (
                      <option key={i} value={i}>
                        Zone {i} {i === selectedShip.square ? '(Current)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tactical Off-guard notice for GM */}
                <div className="flex items-center gap-1.5 text-amber-400/90 font-mono text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>
                    Off-Guard from {selectedShip.heading === 'right' ? 'LEFT (Rear Flank)' : 'RIGHT (Rear Flank)'}
                  </span>
                </div>

                {/* Delete vessel (GM only, non-player) */}
                {!isPlayerShip && (
                  <button
                    onClick={() => removeShip(selectedShip.id)}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2 py-1 rounded transition-colors ml-auto font-mono text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Ship</span>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
