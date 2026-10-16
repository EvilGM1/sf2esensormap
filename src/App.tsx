import React, { useState } from 'react';
import { SensorProvider, useSensor } from './context/SensorContext';
import { Header } from './components/Header';
import { SensorTrack } from './components/SensorTrack';
import { ShipDrawer } from './components/ShipDrawer';
import { AddShipModal } from './components/AddShipModal';
import { QrConnectModal } from './components/QrConnectModal';
import { RulesQuickRefModal } from './components/RulesQuickRefModal';
import { GmPinModal } from './components/GmPinModal';
import { BattleStationsModal } from './components/BattleStationsModal';
import { StarshipConsole } from './components/StarshipConsole';
import {
  RotateCcw,
  Eye,
  EyeOff,
  Plus,
  Radio,
  Activity,
  Layers,
  Crosshair,
} from 'lucide-react';

const SensorMapDashboard: React.FC = () => {
  const {
    viewMode,
    visibleShips,
    selectedShipId,
    selectShip,
    flipShipHeading,
    toggleShipHidden,
    playerShip,
    setViewMode,
  } = useSensor();

  const [isAddShipOpen, setIsAddShipOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [isStationsOpen, setIsStationsOpen] = useState(false);

  const isGm = viewMode === 'gm';

  return (
    <div className="min-h-screen flex flex-col bg-void-950 scanline-bg relative pb-32">
      {/* Top Header */}
      <Header
        onOpenAddShip={() => setIsAddShipOpen(true)}
        onOpenQr={() => setIsQrOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenBattleStations={() => setIsStationsOpen(true)}
        onPromptGmPin={() => setIsPinOpen(true)}
      />

      {/* Mode Banner / Station Telemetry Readout */}
      {!isGm ? (
        <div className="bg-sky-950/60 border-b border-sky-500/30 px-4 py-1.5 flex items-center justify-between text-sky-300 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>PLAYER SENSOR CONSOLE — Long-Range Sensors Active</span>
          </div>
          <button
            onClick={() => setIsStationsOpen(true)}
            className="flex items-center gap-1 text-[11px] underline text-cyan-400 hover:text-cyan-300"
          >
            <Crosshair className="w-3 h-3" />
            <span>Crew Stations</span>
          </button>
        </div>
      ) : (
        <div className="bg-void-900/60 border-b border-slate-800/80 px-4 py-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-cyan-400">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>STATION SCANNER: HIGH RES</span>
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline">
              Core Bearing: 090° RELATIVE
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline">
              Player Core: {playerShip ? `Zone ${playerShip.square}` : 'Unassigned'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Security Clearance:</span>
            <span className="text-emerald-400 font-bold">GM AUTHORIZED</span>
          </div>
        </div>
      )}

      {/* Main Tactical Display */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-6">
        {/* Sensor Track Section */}
        <section className="bg-void-900/70 border border-slate-800/90 rounded-2xl p-3 sm:p-5 shadow-2xl backdrop-blur relative overflow-hidden">
          {/* Subtle radar scan background effect */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-cyan-500/10 pointer-events-none" />
          <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full border border-cyan-500/10 pointer-events-none" />

          <div className="flex items-center justify-between mb-3 px-2 relative z-10">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <h2 className="font-mono font-bold text-xs sm:text-sm text-slate-200 uppercase tracking-wider">
                Space Station Scanner Track
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
              <span>
                Contacts: <strong className="text-cyan-400">{visibleShips.length}</strong>
              </span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span className="hidden sm:inline text-[11px] text-slate-500">
                Center: Player Ship
              </span>
            </div>
          </div>

          {/* The Scrollable Line of Squares */}
          <div className="relative z-10">
            <SensorTrack />
          </div>
        </section>

        {/* GM Mode: Target Roster (Encounter Management) */}
        {isGm ? (
          <section className="bg-void-900/40 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-mono font-bold text-xs sm:text-sm text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Target Roster</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  (Tap to select and issue maneuver)
                </span>
              </h3>

              <button
                onClick={() => setIsAddShipOpen(true)}
                className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ship</span>
              </button>
            </div>

            {visibleShips.length === 0 ? (
              <div className="p-6 text-center text-slate-500 font-mono text-xs">
                No contacts on sensor track.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {visibleShips.map((ship) => {
                  const isSelected = ship.id === selectedShipId;
                  const isFacingRight = ship.heading === 'right';

                  const getBadge = () => {
                    switch (ship.faction) {
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
                    <div
                      key={ship.id}
                      onClick={() => selectShip(ship.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-void-800 border-cyan-500/80 ring-1 ring-cyan-500/50'
                          : 'bg-void-950/80 border-slate-800/90 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex flex-col items-center">
                          <span className="text-base font-bold text-slate-200">
                            {isFacingRight ? '►' : '◄'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-mono text-xs font-bold text-slate-100 truncate">
                              {ship.name}
                            </h4>
                            {ship.hidden && (
                              <EyeOff className="w-3 h-3 text-purple-400 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mt-0.5">
                            <span
                              className={`px-1.5 py-0.2 rounded border font-semibold uppercase ${getBadge()}`}
                            >
                              {ship.faction}
                            </span>
                            <span className="px-1 py-0.2 rounded bg-void-900 border border-slate-800 uppercase">
                              {ship.size || 'medium'}
                            </span>
                            <span>Zone {ship.square}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Roster Actions for GM */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => flipShipHeading(ship.id)}
                          className="p-1.5 rounded-lg bg-void-900 hover:bg-void-800 border border-slate-800 text-slate-300 hover:text-white"
                          title="Flip Heading"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                        </button>

                        <button
                          onClick={() => toggleShipHidden(ship.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            ship.hidden
                              ? 'bg-purple-900/60 border-purple-500/60 text-purple-200'
                              : 'bg-void-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                          title={ship.hidden ? 'Reveal to Players' : 'Hide from Players'}
                        >
                          {ship.hidden ? (
                            <EyeOff className="w-3.5 h-3.5 text-purple-300" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          /* Player View: Starship Character Sheet & Tactical Cockpit Bridge Console */
          <StarshipConsole onOpenBattleStations={() => setIsStationsOpen(true)} />
        )}
      </main>

      {/* Floating Bottom Drawer for Selected Ship */}
      <ShipDrawer />

      {/* Modals */}
      <AddShipModal
        isOpen={isAddShipOpen}
        onClose={() => setIsAddShipOpen(false)}
      />

      <QrConnectModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
      />

      <RulesQuickRefModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <GmPinModal
        isOpen={isPinOpen}
        onClose={() => setIsPinOpen(false)}
        onSuccess={() => {
          setIsPinOpen(false);
          setViewMode('gm');
        }}
      />

      <BattleStationsModal
        isOpen={isStationsOpen}
        onClose={() => setIsStationsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <SensorProvider>
      <SensorMapDashboard />
    </SensorProvider>
  );
}
