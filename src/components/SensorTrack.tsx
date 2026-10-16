import React, { useRef } from 'react';
import { useSensor } from '../context/SensorContext';
import { SensorSquare } from './SensorSquare';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';

export const SensorTrack: React.FC = () => {
  const {
    sensorRange,
    visibleShips,
    selectedShipId,
    selectShip,
    moveShip,
    viewMode,
  } = useSensor();

  const isGm = viewMode === 'gm';
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -200 : 200;
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
    <div className="relative w-full py-2">
      {/* Scroll assistance buttons on small screens */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-void-950/80 border border-slate-700/80 text-slate-300 hover:text-white shadow-lg backdrop-blur sm:hidden active:scale-95"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-void-950/80 border border-slate-700/80 text-slate-300 hover:text-white shadow-lg backdrop-blur sm:hidden active:scale-95"
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
      </div>

      {/* Track Footnote / Navigation Info */}
      <div className="flex items-center justify-between px-6 text-xs text-slate-400 font-mono mt-1">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Linear Track: 0 to {sensorRange - 1} Zones</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> Player
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Ally
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Enemy
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Neutral
          </span>
        </div>
      </div>
    </div>
  );
};
