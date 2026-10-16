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
import {
  RotateCcw,
  Eye,
  EyeOff,
  Plus,
  Radio,
  Activity,
  Layers,
  Crosshair,
  Radar,
  Shield,
  ShieldAlert,
  Compass,
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
    playerSensorRange,
    defaultSensorRange,
    shipLevel,
    nudgeShip,
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
          /* Player View: Starship Status & Console Card */
          <section className="bg-void-900/60 border border-sky-500/30 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur relative overflow-hidden">
            {/* Header: Ship Identification */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-950/80 border border-sky-500/40 text-sky-400">
                  <Radar className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono font-bold text-base text-slate-100 uppercase tracking-wide">
                      {playerShip ? playerShip.name : 'Player Starship'}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40">
                      Tier {shipLevel} • Medium Frame
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400">
                    Tactical Starship Console • Telemetry Online
                  </p>
                </div>
              </div>

              {/* Quick Station Access Button */}
              <button
                onClick={() => setIsStationsOpen(true)}
                className="flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-gradient-to-r from-sky-950 to-void-900 hover:from-sky-900 hover:to-void-800 border border-sky-500/40 text-sky-200 font-mono text-xs transition-all shadow-md active:scale-95"
              >
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">Manning & Battle Stations</span>
              </button>
            </div>

            {/* Main 3-Column Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1. Propulsion & Tactical Bearing */}
              <div className="bg-void-950/80 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Propulsion & Heading</span>
                  </span>
                  <div className="font-mono text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>Facing:</span>
                    <span className="text-cyan-300">
                      {playerShip?.heading === 'right' ? 'RIGHT (► Forward)' : 'LEFT (◄ Forward)'}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">
                    Movement is forward along heading. Reverse requires turning.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {playerShip && (
                    <>
                      <button
                        onClick={() => flipShipHeading(playerShip.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-void-800 hover:bg-void-700 border border-slate-700 text-slate-200 font-mono text-xs transition-all active:scale-95"
                        title="Change Heading (Turn)"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Turn (⟲)</span>
                      </button>
                      <button
                        onClick={() => nudgeShip(playerShip.id, playerShip.heading === 'right' ? 'right' : 'left')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 font-mono text-xs transition-all active:scale-95 shadow"
                        title="Boost Thrusters forward"
                      >
                        <span>Boost Thruster ►</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 2. Scanner Telemetry */}
              <div className="bg-void-950/80 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1 flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-sky-400" />
                    <span>Scanner Telemetry</span>
                  </span>
                  <div className="font-mono text-sm font-bold text-slate-100 flex items-center justify-between">
                    <span>Range:</span>
                    <span className={playerSensorRange === 0 ? 'text-rose-400' : 'text-sky-300'}>
                      {playerSensorRange === 0 ? 'OFFLINE (0 Zones)' : `${playerSensorRange} Zones Radius`}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Track Contacts:</span>
                      <span className="text-cyan-400 font-bold">{Math.max(0, visibleShips.length - 1)} detected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scanner Baseline:</span>
                      <span className="text-slate-300">{defaultSensorRange} Zones</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                  <span>Fog of War: Active</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Encrypted
                  </span>
                </div>
              </div>

              {/* 3. Defense Posture & Off-Guard Flank */}
              <div className="bg-void-950/80 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tactical Defense Arc</span>
                  </span>
                  <div className="font-mono text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <span>Off-Guard:</span>
                    <span>{playerShip?.heading === 'right' ? 'LEFT (Rear)' : 'RIGHT (Rear)'}</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">
                    Enemy strikes from your rear flank inflict a -2 circumstance penalty to your AC.
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/30 font-mono text-[11px] text-amber-300/90 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>Guard rear arc using Pilot Evade or turning.</span>
                </div>
              </div>
            </div>

            {/* Quick Battle Station Manning Strip */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400 flex-wrap">
                <span className="text-[11px] uppercase text-slate-500">Battle Stations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Pilot', icon: '🚀' },
                    { name: 'Gunnery', icon: '🎯' },
                    { name: 'Generator', icon: '⚡' },
                    { name: 'Scanners', icon: '📡' },
                    { name: 'Drone', icon: '🤖' },
                    { name: 'Magic', icon: '✨' },
                  ].map((st) => (
                    <button
                      key={st.name}
                      onClick={() => setIsStationsOpen(true)}
                      className="px-2 py-0.5 rounded bg-void-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <span>{st.icon}</span>
                      <span>{st.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-[10px] text-slate-500">
                Tap contacts on the sensor track above for tactical scan
              </span>
            </div>
          </section>
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
