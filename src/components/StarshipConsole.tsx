import React, { useState } from 'react';
import { useSensor } from '../context/SensorContext';
import { FRAME_DEFINITIONS, getFrameStats, getAvailableUpgradeSlots } from '../data/starshipData';
import { FrameId } from '../types/starshipSheet';
import { WorkstationConfigModal } from './WorkstationConfigModal';
import { HangarProfilesModal } from './HangarProfilesModal';
import { SpellRepositoryModal } from './SpellRepositoryModal';
import {
  Shield,
  Heart,
  Zap,
  Compass,
  Crosshair,
  Bot,
  Radio,
  Sparkles,
  Lock,
  Plus,
  RotateCcw,
  Rocket,
  Edit2,
  Check,
  Layers,
  Wrench,
  Bookmark,
  BookOpen,
} from 'lucide-react';

interface StarshipConsoleProps {
  onOpenBattleStations: () => void;
}

export const StarshipConsole: React.FC<StarshipConsoleProps> = ({
  onOpenBattleStations,
}) => {
  const {
    shipConfig,
    setShipFrame,
    setShipLevel,
    updateShipName,
    adjustHullPoints,
    adjustShieldPoints,
    clearStationSlot,
    playerShip,
    flipShipHeading,
    nudgeShip,
    playerSensorRange,
  } = useSensor();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(shipConfig.name);
  const [activeSlotModal, setActiveSlotModal] = useState<number | null>(null);
  const [isHangarOpen, setIsHangarOpen] = useState(false);
  const [isSpellRepoOpen, setIsSpellRepoOpen] = useState(false);

  const currentStats = getFrameStats(shipConfig.frameId, shipConfig.level);
  const frameInfo = FRAME_DEFINITIONS[shipConfig.frameId];
  const availableUpgradeSlots = getAvailableUpgradeSlots(shipConfig.level);

  const hpPercent = Math.max(0, Math.min(100, Math.round((shipConfig.currentHp / currentStats.hp) * 100)));
  const spPercent = Math.max(0, Math.min(100, Math.round((shipConfig.currentSp / currentStats.sp) * 100)));

  const handleNameSave = () => {
    if (tempName.trim()) {
      updateShipName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const getStationIcon = (type: string) => {
    switch (type) {
      case 'pilot':
        return <Compass className="w-4 h-4 text-cyan-400" />;
      case 'generator':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'gunnery':
        return <Crosshair className="w-4 h-4 text-rose-400" />;
      case 'drone':
        return <Bot className="w-4 h-4 text-emerald-400" />;
      case 'scanners':
        return <Radio className="w-4 h-4 text-sky-400" />;
      case 'magic':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <section className="bg-void-900/80 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur relative overflow-hidden font-mono">
      {/* Subtle cockpit background styling */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full pointer-events-none" />

      {/* Top Bridge Command Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 mb-4 border-b border-slate-800/90 gap-3 relative z-10">
        {/* Ship Identity & Frame Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 shadow-md">
            <Rocket className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-void-950 border border-cyan-500 rounded px-2 py-0.5 text-sm text-slate-100 font-bold focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleNameSave}
                    className="p-1 rounded bg-cyan-600 text-white hover:bg-cyan-500"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-100 tracking-wide">
                    {shipConfig.name}
                  </h3>
                  <button
                    onClick={() => {
                      setTempName(shipConfig.name);
                      setIsEditingName(true);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
                    title="Rename Starship"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Frame Dropdown */}
              <div className="flex items-center gap-1 bg-void-950 border border-cyan-500/40 rounded-lg px-2 py-1 text-xs">
                <span className="text-slate-400">Frame:</span>
                <select
                  value={shipConfig.frameId}
                  onChange={(e) => setShipFrame(e.target.value as FrameId)}
                  className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="explorer" className="bg-void-900 text-slate-200">
                    Explorer (Sensors & Shields)
                  </option>
                  <option value="bulwark" className="bg-void-900 text-slate-200">
                    Bulwark (Armor & Ramming)
                  </option>
                  <option value="skirmisher" className="bg-void-900 text-slate-200">
                    Skirmisher (High Speed & Vectors)
                  </option>
                </select>
              </div>

              {/* Level / Tier Stepper */}
              <div className="flex items-center gap-1 bg-void-950 border border-slate-700 rounded-lg px-2 py-1 text-xs">
                <span className="text-slate-400">Tier:</span>
                <button
                  onClick={() => setShipLevel(shipConfig.level - 1)}
                  disabled={shipConfig.level <= 1}
                  className="w-4 h-4 flex items-center justify-center rounded bg-void-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold"
                >
                  -
                </button>
                <span className="font-bold text-sky-400 px-1">Lvl {shipConfig.level}</span>
                <button
                  onClick={() => setShipLevel(shipConfig.level + 1)}
                  disabled={shipConfig.level >= 20}
                  className="w-4 h-4 flex items-center justify-center rounded bg-void-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
              <span>{frameInfo.name} Frame (Medium)</span>
              <span className="text-slate-600">•</span>
              <span>Baseline Sensors: {frameInfo.defaultSensorRange} Zones</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">Built-in: {frameInfo.fixedUpgradeName}</span>
            </p>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsHangarOpen(true)}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-void-950 hover:bg-void-800 border border-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
            title="Open Hangar to save or load ship builds"
          >
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hangar Fleet</span>
          </button>

          <button
            onClick={onOpenBattleStations}
            className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-950 to-void-900 hover:from-cyan-900 hover:to-void-800 border border-cyan-500/50 text-cyan-200 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>Crew Station Actions</span>
          </button>
        </div>
      </div>

      {/* Vitals HUD Gauges: Hull Points, Shield Points, and Defenses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {/* 1. Hull Points (HP) Integrity Gauge */}
        <div className="p-3.5 rounded-xl bg-void-950/90 border border-slate-800/90 flex flex-col justify-between gap-2 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold uppercase">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Hull Integrity (HP)</span>
            </span>
            <span className="text-sm font-extrabold text-slate-100">
              {shipConfig.currentHp} <span className="text-slate-500 font-normal">/ {currentStats.hp}</span>
            </span>
          </div>

          {/* Health Bar */}
          <div className="w-full h-2.5 bg-void-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                hpPercent > 50 ? 'bg-emerald-500' : hpPercent > 25 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>

          {/* Quick HP Adjustment Buttons */}
          <div className="flex items-center justify-between gap-1 pt-1 text-[11px]">
            <span className="text-slate-500 text-[10px]">Hull Damage / Repair:</span>
            <div className="flex gap-1">
              <button
                onClick={() => adjustHullPoints(-5)}
                className="px-1.5 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold"
              >
                -5
              </button>
              <button
                onClick={() => adjustHullPoints(-1)}
                className="px-1.5 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold"
              >
                -1
              </button>
              <button
                onClick={() => adjustHullPoints(1)}
                className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold"
              >
                +1
              </button>
              <button
                onClick={() => adjustHullPoints(5)}
                className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold"
              >
                +5
              </button>
            </div>
          </div>
        </div>

        {/* 2. Shield Points (SP) Capacitor Gauge */}
        <div className="p-3.5 rounded-xl bg-void-950/90 border border-slate-800/90 flex flex-col justify-between gap-2 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold uppercase">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Shield Capacitors (SP)</span>
            </span>
            <span className="text-sm font-extrabold text-cyan-200">
              {shipConfig.currentSp} <span className="text-slate-500 font-normal">/ {currentStats.sp}</span>
            </span>
          </div>

          {/* Shield Bar */}
          <div className="w-full h-2.5 bg-void-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              style={{ width: `${spPercent}%` }}
            />
          </div>

          {/* Quick SP Adjustment Buttons */}
          <div className="flex items-center justify-between gap-1 pt-1 text-[11px]">
            <span className="text-slate-500 text-[10px]">Shield Deplete / Boost:</span>
            <div className="flex gap-1">
              <button
                onClick={() => adjustShieldPoints(-5)}
                className="px-1.5 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold"
              >
                -5
              </button>
              <button
                onClick={() => adjustShieldPoints(-1)}
                className="px-1.5 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold"
              >
                -1
              </button>
              <button
                onClick={() => adjustShieldPoints(1)}
                className="px-1.5 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold"
              >
                +1
              </button>
              <button
                onClick={() => adjustShieldPoints(5)}
                className="px-1.5 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold"
              >
                +5
              </button>
            </div>
          </div>
        </div>

        {/* 3. Core Telemetry: AC, Speed, Saves & Facing */}
        <div className="p-3.5 rounded-xl bg-void-950/90 border border-slate-800/90 flex flex-col justify-between text-xs">
          <div className="grid grid-cols-3 gap-2 text-center pb-2 border-b border-slate-800/80">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">AC</span>
              <strong className="text-sm text-cyan-300">{currentStats.ac}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Speed</span>
              <strong className="text-sm text-emerald-300">{currentStats.speed}z</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Sensors</span>
              <strong className="text-sm text-sky-300">{playerSensorRange}z</strong>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
            <span>Saves:</span>
            <span>Fort <strong>+{currentStats.fort}</strong></span>
            <span>Ref <strong>+{currentStats.ref}</strong></span>
            <span>Will <strong>+{currentStats.will}</strong></span>
          </div>

          {/* Quick flight vector buttons */}
          {playerShip && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => flipShipHeading(playerShip.id)}
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-void-900 hover:bg-void-800 border border-slate-700 text-slate-200 text-[11px] transition-all"
                title="Change Heading (Turn ⟲)"
              >
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                <span>Turn ({playerShip.heading === 'right' ? '►' : '◄'})</span>
              </button>
              <button
                onClick={() => nudgeShip(playerShip.id, playerShip.heading === 'right' ? 'right' : 'left')}
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 text-[11px] font-bold transition-all"
                title="Boost Thrusters (Forward)"
              >
                <span>Boost ►</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* The 6 Workstation Bridge Pods */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Bridge Workstation Pods (6 Tactical Bays):</span>
          </h4>
          <span className="text-[11px] text-slate-500">
            Upgrades: {availableUpgradeSlots} slot{availableUpgradeSlots !== 1 ? 's' : ''}/station
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {shipConfig.stations.map((station, index) => {
            const isFixed = station.isFixed;
            const isEmpty = station.type === 'empty';

            return (
              <div
                key={station.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isEmpty
                    ? 'bg-void-950/40 border-dashed border-slate-800 hover:border-slate-700'
                    : isFixed
                    ? 'bg-void-950/90 border-slate-800 shadow-md'
                    : 'bg-void-950/90 border-cyan-500/30 hover:border-cyan-500/60 shadow-md'
                }`}
              >
                <div>
                  {/* Pod Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStationIcon(station.type)}
                      <span className="font-bold text-xs text-slate-100 uppercase">
                        {isEmpty ? `Bay ${index + 1}: Empty` : `Pod ${index + 1}: ${station.type}`}
                      </span>
                    </div>

                    {isFixed ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-950/80 border border-sky-500/40 text-sky-300 font-bold uppercase flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Fixed</span>
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-void-900 border border-slate-700 text-slate-400 uppercase">
                        Custom
                      </span>
                    )}
                  </div>

                  {/* Workstation Specific Content */}
                  {isEmpty ? (
                    <div className="py-4 text-center text-slate-500 text-xs">
                      <p>Unassigned Expansion Bay</p>
                      <button
                        onClick={() => setActiveSlotModal(index)}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 underline"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Equip Station</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-xs text-slate-300">
                      {/* Fixed frame upgrade if any */}
                      {station.fixedUpgradeName && (
                        <div className="p-1.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-300 flex items-center gap-1.5">
                          <Shield className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                          <span>Built-in: <strong>{station.fixedUpgradeName}</strong></span>
                        </div>
                      )}

                      {/* Weapon mount */}
                      {station.installedWeapon && (
                        <div className="p-2 rounded bg-rose-950/30 border border-rose-500/30 text-[11px]">
                          <div className="flex items-center justify-between font-bold text-rose-300">
                            <span>{station.installedWeapon.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Range {station.installedWeapon.rangeZones}z
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex gap-2">
                            <span className="text-rose-400 font-bold">
                              {station.installedWeapon.damageDice} {station.installedWeapon.damageType}
                            </span>
                            <span>•</span>
                            <span>{station.installedWeapon.traits.slice(0, 2).join(', ')}</span>
                          </div>
                        </div>
                      )}

                      {/* Drone bay */}
                      {station.installedDrone && (
                        <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-[11px]">
                          <div className="flex items-center justify-between font-bold text-emerald-300">
                            <span>{station.installedDrone.name}</span>
                            <span className="text-[10px] text-emerald-400">Deployed</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {station.installedDrone.role}
                          </p>
                        </div>
                      )}

                      {/* Magic Conduit Spell Repository Card */}
                      {station.type === 'magic' && (
                        <div className="p-2 rounded bg-purple-950/30 border border-purple-500/40 text-[11px]">
                          <div className="flex items-center justify-between font-bold text-purple-300 mb-1">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                              <span>Spell Repository</span>
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/60 border border-purple-500/30 text-purple-200">
                              4 Spells Loaded
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 mb-2 text-[10px] text-slate-300 font-mono">
                            <div className="p-1 rounded bg-void-950 border border-purple-500/20 truncate" title="Cosmic Cannon (Cantrip 1)">
                              ⚡ Cosmic Cannon
                            </div>
                            <div className="p-1 rounded bg-void-950 border border-purple-500/20 truncate" title="Cosmic Bombardment (Rank 1)">
                              💥 Bombardment
                            </div>
                            <div className="p-1 rounded bg-void-950 border border-purple-500/20 truncate" title="Cosmic Fortification (Rank 1)">
                              🛡️ Fortification
                            </div>
                            <div className="p-1 rounded bg-void-950 border border-purple-500/20 truncate" title="Cosmic Repairs (Rank 1)">
                              💚 Repairs
                            </div>
                          </div>
                          <button
                            onClick={() => setIsSpellRepoOpen(true)}
                            className="w-full py-1 px-2 rounded bg-purple-900/50 hover:bg-purple-800/60 border border-purple-500/40 text-purple-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                          >
                            <BookOpen className="w-3 h-3 text-purple-300" />
                            <span>View Spell Repository</span>
                          </button>
                        </div>
                      )}

                      {/* Station Upgrades chips */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {station.installedUpgrades.map((u) => (
                          <span
                            key={u.id}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center gap-1"
                          >
                            <span>{u.name}</span>
                          </span>
                        ))}
                        {availableUpgradeSlots > station.installedUpgrades.length && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-void-900 border border-dashed border-slate-700 text-slate-500">
                            +{availableUpgradeSlots - station.installedUpgrades.length} Slot Available
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Pod Actions Footer */}
                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/80 text-[11px]">
                  <button
                    onClick={() => setActiveSlotModal(index)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                  >
                    <Wrench className="w-3 h-3" />
                    <span>{isFixed ? 'Upgrades' : isEmpty ? 'Equip' : 'Configure'}</span>
                  </button>

                  {!isFixed && !isEmpty && (
                    <button
                      onClick={() => clearStationSlot(index)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                      title="Clear Bay"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workstation Configuration Modal */}
      <WorkstationConfigModal
        isOpen={activeSlotModal !== null}
        slotIndex={activeSlotModal}
        onClose={() => setActiveSlotModal(null)}
      />

      {/* Hangar Bay & Room Presets Modal */}
      <HangarProfilesModal
        isOpen={isHangarOpen}
        onClose={() => setIsHangarOpen(false)}
      />

      {/* Magic Conduit Spell Repository Modal */}
      <SpellRepositoryModal
        isOpen={isSpellRepoOpen}
        onClose={() => setIsSpellRepoOpen(false)}
      />
    </section>
  );
};
