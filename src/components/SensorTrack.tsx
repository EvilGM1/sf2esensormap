import React, { useRef } from 'react';
import { useSensor } from '../context/SensorContext';
import { SensorSquare } from './SensorSquare';
import {
  ChevronLeft,
  ChevronRight,
  MoveLeft,
  MoveRight,
  Plus,
  Compass,
} from 'lucide-react';

export const SensorTrack: React.FC = () => {
  const {
    sensorRange,
    setSensorRange,
    shiftTrack,
    visibleShips,
    selectedShipId,
    selectShip,
    moveShip,
    playerShip,
    viewMode,
  } = useSensor();

  const isGm = viewMode === 'gm';
  const scrollRef = useRef<HTMLDivElement>(null);

  const playerSquare = playerShip ? playerShip.square : null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Group ships by their zone square
  const shipsByZone: { [zone: number]: typeof visibleShips } = {};
  for (let i = 0; i < sensorRange; i++) {
    shipsByZone[i] = [];
  }
  visibleShips.forEach((ship) => {
    if (shipsByZone[ship.square]) {
      shipsByZone[ship.square].push(ship);
    }
  });

  return (
    <div className="relative w-full py-1">
      {/* Scroll assistance buttons on small screens */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-void-950/90 border border-slate-700/80 text-slate-300 hover:text-white shadow-lg backdrop-blur sm:hidden active:scale-95"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-void-950/90 border border-slate-700/80 text-slate-300 hover:text-white shadow-lg backdrop-blur sm:hidden active:scale-95"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Sensor Track Container */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto pb-4 pt-1 px-4 sm:px-6 flex items-center gap-3 scroll-smooth no-scrollbar"
      >
        {Array.from({ length: sensorRange }, (_, i) => i).map((zoneIndex) => (
          <SensorSquare
            key={zoneIndex}
            zoneIndex={zoneIndex}
            playerSquare={playerSquare}
            ships={shipsByZone[zoneIndex] || []}
            selectedShipId={selectedShipId}
            isGm={isGm}
            onSelectShip={(id) => selectShip(id)}
            onMoveSelectedHere={(targetZone) => {
              if (selectedShipId) {
                moveShip(selectedShipId, targetZone);
              }
            }}
          />
        ))}

        {/* GM "+ Expand Map" button at the end of track */}
        {isGm && (
          <button
            onClick={() => setSensorRange(sensorRange + 1)}
            className="min-w-[70px] h-[230px] sm:h-[260px] flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 hover:border-cyan-500/60 bg-void-950/40 hover:bg-cyan-950/20 text-slate-500 hover:text-cyan-400 font-mono text-xs transition-all p-2"
            title="Add zone to map track"
          >
            <Plus className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase font-bold text-center leading-tight">
              Add Zone
            </span>
          </button>
        )}
      </div>

      {/* GM Track Shifter & Navigation Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-6 text-xs text-slate-400 font-mono mt-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Relative Sensor Scope: {sensorRange} Zones</span>
          </div>

          {/* GM Shift Map Controls (to spawn new zones as ships travel!) */}
          {isGm && (
            <div className="flex items-center gap-1 bg-void-900 border border-slate-800 rounded-lg px-2 py-0.5 text-[11px]">
              <span className="text-slate-500 mr-1">Shift Map:</span>
              <button
                onClick={() => shiftTrack('left')}
                className="p-1 rounded hover:bg-void-800 text-slate-300 hover:text-cyan-400"
                title="Shift all ships Left by 1 zone"
              >
                <MoveLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => shiftTrack('right')}
                className="p-1 rounded hover:bg-void-800 text-slate-300 hover:text-cyan-400"
                title="Shift all ships Right by 1 zone"
              >
                <MoveRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> Player (Blue)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Ally (Green)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Enemy (Red)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Neutral (Yellow)
          </span>
        </div>
      </div>
    </div>
  );
};
