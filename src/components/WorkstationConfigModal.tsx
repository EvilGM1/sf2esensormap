import React, { useState } from 'react';
import { useSensor } from '../context/SensorContext';
import { BattleStationType } from '../types/sensor';
import {
  InstalledBattleStation,
} from '../types/starshipSheet';
import {
  STARSHIP_WEAPONS,
  STARSHIP_DRONES,
  MAGIC_CONDUIT_SPELL_REPOSITORY,
  getUpgradesForStation,
  getAvailableUpgradeSlots,
} from '../data/starshipData';
import {
  X,
  Crosshair,
  Bot,
  Zap,
  Radio,
  Sparkles,
  Compass,
  Trash2,
  Plus,
  Shield,
  Layers,
} from 'lucide-react';

interface WorkstationConfigModalProps {
  isOpen: boolean;
  slotIndex: number | null;
  onClose: () => void;
}

export const WorkstationConfigModal: React.FC<WorkstationConfigModalProps> = ({
  isOpen,
  slotIndex,
  onClose,
}) => {
  const {
    shipConfig,
    shipLevel,
    setStationInSlot,
    clearStationSlot,
    installUpgradeInSlot,
    removeUpgradeFromSlot,
  } = useSensor();

  if (!isOpen || slotIndex === null) return null;

  const currentStation = shipConfig.stations[slotIndex];
  if (!currentStation) return null;

  const isFixed = currentStation.isFixed;
  const availableUpgradeSlots = getAvailableUpgradeSlots(shipLevel);

  // Local state for configuration selection
  const [selectedType, setSelectedType] = useState<BattleStationType | 'empty'>(
    currentStation.type
  );
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>(
    currentStation.installedWeapon?.id || 'light-laser-cannon'
  );
  const [selectedDroneId, setSelectedDroneId] = useState<string>(
    currentStation.installedDrone?.id || 'repair-drone'
  );
  const [activeTab, setActiveTab] = useState<'station' | 'upgrades'>('station');
  const [showUpgradePicker, setShowUpgradePicker] = useState<boolean>(false);

  const stationOptions: {
    type: BattleStationType;
    label: string;
    icon: React.ReactNode;
    desc: string;
  }[] = [
    {
      type: 'gunnery',
      label: 'Gunnery Workstation',
      icon: <Crosshair className="w-4 h-4 text-rose-400" />,
      desc: 'Ordnance and energy weapon hardpoint for targeting and strikes.',
    },
    {
      type: 'drone',
      label: 'Drone Console',
      icon: <Bot className="w-4 h-4 text-emerald-400" />,
      desc: 'Autonomous construct launcher for repair, sabotage, or minefields.',
    },
    {
      type: 'scanners',
      label: 'Scanners Suite',
      icon: <Radio className="w-4 h-4 text-sky-400" />,
      desc: 'Active radar, seeking cloaked vessels, target locks, and electronic warfare.',
    },
    {
      type: 'generator',
      label: 'Generator Auxiliary',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      desc: 'Extra power shunts for shield generation, kinetic surges, and boosts.',
    },
    {
      type: 'pilot',
      label: 'Pilot Aux / Navigation',
      icon: <Compass className="w-4 h-4 text-cyan-400" />,
      desc: 'Co-pilot thruster controls and evasive maneuvering backups.',
    },
    {
      type: 'magic',
      label: 'Magic Conduit',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      desc: 'Mystical focal array for casting space spells and counter-magic.',
    },
  ];

  const handleSaveStation = () => {
    if (isFixed) return;

    if (selectedType === 'empty') {
      clearStationSlot(slotIndex);
      onClose();
      return;
    }

    const updated: InstalledBattleStation = {
      ...currentStation,
      type: selectedType,
      installedWeapon:
        selectedType === 'gunnery'
          ? STARSHIP_WEAPONS.find((w) => w.id === selectedWeaponId)
          : undefined,
      installedDrone:
        selectedType === 'drone'
          ? STARSHIP_DRONES.find((d) => d.id === selectedDroneId)
          : undefined,
    };

    setStationInSlot(slotIndex, updated);
    onClose();
  };

  const compatibleUpgrades =
    currentStation.type !== 'empty'
      ? getUpgradesForStation(currentStation.type as BattleStationType, shipLevel)
      : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-void-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-void-950">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-100 font-mono text-sm uppercase">
              {isFixed ? `Fixed Frame Workstation (Pod ${slotIndex + 1})` : `Customizable Bay (Pod ${slotIndex + 1})`}
            </h3>
            {isFixed && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 border border-sky-500/40 text-sky-300 font-mono">
                Frame Integrated
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-void-950/60 px-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('station')}
            disabled={isFixed}
            className={`py-2 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'station'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200 disabled:opacity-40'
            }`}
          >
            1. Workstation & Equipment
          </button>
          <button
            onClick={() => setActiveTab('upgrades')}
            className={`py-2 px-3 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'upgrades'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>2. Station Upgrades</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              {currentStation.installedUpgrades.length}/{availableUpgradeSlots}
            </span>
          </button>
        </div>

        {/* Tab 1: Station Type & Weapons / Drones */}
        {activeTab === 'station' && (
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-4 font-mono">
            {isFixed ? (
              <div className="p-3 rounded-xl bg-void-950 border border-slate-800 text-xs text-slate-400">
                This workstation is permanently integrated into your starship frame. Its core configuration cannot be changed, but you can install upgrades as your crew levels up.
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs text-slate-400 block mb-2 font-bold uppercase tracking-wide">
                    Select Workstation Role:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {stationOptions.map((opt) => (
                      <div
                        key={opt.type}
                        onClick={() => setSelectedType(opt.type)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedType === opt.type
                            ? 'bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-500/50 shadow-md'
                            : 'bg-void-950/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {opt.icon}
                          <span className="font-bold text-xs text-slate-100">{opt.label}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{opt.desc}</p>
                      </div>
                    ))}

                    {/* Clear to Empty */}
                    <div
                      onClick={() => setSelectedType('empty')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2 ${
                        selectedType === 'empty'
                          ? 'bg-rose-950/40 border-rose-500/80 text-rose-300'
                          : 'bg-void-950/40 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                      <div>
                        <span className="font-bold text-xs block">Empty Station Bay</span>
                        <span className="text-[10px]">Unused expansion bay</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional Gunnery Weapon Selector */}
                {selectedType === 'gunnery' && (
                  <div className="pt-3 border-t border-slate-800">
                    <label className="text-xs text-rose-300 block mb-2 font-bold uppercase flex items-center gap-1.5">
                      <Crosshair className="w-4 h-4 text-rose-400" />
                      <span>Mount Starship Weapon (Archives of Nethys):</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {STARSHIP_WEAPONS.map((weapon) => (
                        <div
                          key={weapon.id}
                          onClick={() => setSelectedWeaponId(weapon.id)}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            selectedWeaponId === weapon.id
                              ? 'bg-rose-950/60 border-rose-400 text-rose-100 shadow'
                              : 'bg-void-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-100">{weapon.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-void-900 border border-slate-700 text-cyan-300 font-mono">
                              Range {weapon.rangeZones}z
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                            <span className="text-rose-400 font-bold">{weapon.damageDice} {weapon.damageType}</span>
                            <span className="text-slate-500">•</span>
                            <span className="uppercase text-[10px] text-slate-400">{weapon.category}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {weapon.traits.map((t) => (
                              <span
                                key={t}
                                className="text-[9px] px-1 py-0.2 rounded bg-void-900 border border-slate-800 text-slate-400"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conditional Drone Model Selector */}
                {selectedType === 'drone' && (
                  <div className="pt-3 border-t border-slate-800">
                    <label className="text-xs text-emerald-300 block mb-2 font-bold uppercase flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-emerald-400" />
                      <span>Select Drone Model (Archives of Nethys):</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {STARSHIP_DRONES.map((drone) => (
                        <div
                          key={drone.id}
                          onClick={() => setSelectedDroneId(drone.id)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                            selectedDroneId === drone.id
                              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-100 shadow'
                              : 'bg-void-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-100">{drone.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                              {drone.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mb-2">{drone.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {drone.actionsGranted.map((a) => (
                              <span
                                key={a}
                                className="text-[10px] px-1.5 py-0.2 rounded bg-void-900 border border-slate-800 text-cyan-300"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conditional Magic Conduit Spell Repository */}
                {selectedType === 'magic' && (
                  <div className="pt-3 border-t border-purple-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-purple-300 font-bold uppercase flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>Integrated Spell Repository (Tech Core pg. 181):</span>
                      </label>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-bold">
                        4 Spells Loaded
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                      Equipping a Magic Conduit integrates the starship spell repository. Any spellcaster on board can cast these spells by expending their own spell slots (or using cantrips).
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                      {MAGIC_CONDUIT_SPELL_REPOSITORY.map((spell) => (
                        <div
                          key={spell.id}
                          className="p-3 rounded-lg border border-purple-500/30 bg-purple-950/20 text-xs flex flex-col justify-between gap-1.5"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-100">{spell.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/60 border border-purple-500/30 text-purple-200">
                                {spell.isCantrip ? 'Cantrip 1' : `Rank ${spell.rank}`}
                              </span>
                            </div>
                            <div className="text-[10px] text-cyan-300 font-semibold mb-1">
                              Cost: {spell.cost} • Range: {spell.range}
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed mb-1.5 line-clamp-3">
                              {spell.description}
                            </p>
                          </div>

                          <div className="pt-1.5 border-t border-purple-500/20 flex flex-wrap gap-1">
                            {spell.traits.map((t) => (
                              <span
                                key={t}
                                className="text-[9px] px-1.5 py-0.2 rounded bg-void-950 border border-slate-800 text-slate-400"
                              >
                                {t}
                              </span>
                            ))}
                            {spell.defense && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300">
                                Def: {spell.defense}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab 2: Station Upgrades */}
        {activeTab === 'upgrades' && (
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-4 font-mono text-xs">
            {/* Built-in Frame Upgrade Banner if applicable */}
            {currentStation.fixedUpgradeName && (
              <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/40 flex items-start gap-3">
                <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{currentStation.fixedUpgradeName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/50">
                      FRAME INTEGRATED (FREE)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Permanent frame upgrade. Does not count toward your station upgrade slots.
                  </p>
                </div>
              </div>
            )}

            {/* Slots status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-void-950 border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[11px]">Upgrade Slot Capacity:</span>
                <span className="text-slate-200 font-bold">
                  {currentStation.installedUpgrades.length} / {availableUpgradeSlots} Slots Used
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Tier: {shipLevel >= 18 ? 'Paragon (4 Slots)' : shipLevel >= 11 ? 'Elite (3 Slots)' : shipLevel >= 5 ? 'Advanced (2 Slots)' : shipLevel >= 2 ? 'Tactical (1 Slot)' : 'Commercial (0 Slots)'}
              </span>
            </div>

            {/* Installed Upgrades List */}
            <div>
              <label className="text-slate-400 text-xs block mb-2 uppercase font-bold">
                Installed Station Upgrades:
              </label>
              {currentStation.installedUpgrades.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                  {availableUpgradeSlots === 0
                    ? 'No upgrade slots available at Level 1 (Commercial Grade). Level up ship to Level 2 (Tactical Grade) to unlock.'
                    : 'No upgrades currently installed in this station.'}
                </div>
              ) : (
                <div className="space-y-2">
                  {currentStation.installedUpgrades.map((upgrade) => (
                    <div
                      key={upgrade.id}
                      className="p-3 rounded-xl bg-void-950 border border-cyan-500/40 flex items-start justify-between gap-3 shadow"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100">{upgrade.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-void-900 border border-slate-800 text-cyan-400">
                            Item {upgrade.level}+
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{upgrade.description}</p>
                        {upgrade.actionGranted && (
                          <div className="mt-2 text-[10px] p-1.5 rounded bg-void-900 border border-slate-800 text-emerald-300">
                            <strong>Action Granted:</strong> {upgrade.actionGranted.name} ({upgrade.actionGranted.actionsCost})
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeUpgradeFromSlot(slotIndex, upgrade.id)}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/40 transition-colors"
                        title="Remove Upgrade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Upgrade Button & Available Upgrades Picker */}
            {availableUpgradeSlots > currentStation.installedUpgrades.length && (
              <div className="pt-2">
                {!showUpgradePicker ? (
                  <button
                    onClick={() => setShowUpgradePicker(true)}
                    className="w-full py-2.5 rounded-xl border border-dashed border-cyan-500/50 hover:border-cyan-400 bg-void-950/50 hover:bg-cyan-950/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4 text-cyan-400" />
                    <span>Install Upgrade into Empty Slot</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-void-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-cyan-300 text-xs">
                        Select Upgrade for {currentStation.type.toUpperCase()}:
                      </span>
                      <button
                        onClick={() => setShowUpgradePicker(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {compatibleUpgrades.length === 0 ? (
                      <p className="text-slate-500 text-xs text-center py-2">
                        No compatible upgrades available at Level {shipLevel}.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {compatibleUpgrades.map((upgrade) => {
                          const isAlreadyInstalled = currentStation.installedUpgrades.some(
                            (u) => u.id === upgrade.id
                          );
                          return (
                            <div
                              key={upgrade.id}
                              className={`p-2 rounded-lg border flex items-center justify-between gap-2 text-xs transition-all ${
                                isAlreadyInstalled
                                  ? 'opacity-40 bg-void-950 border-slate-800'
                                  : 'bg-void-900 border-slate-800 hover:border-cyan-500/50 cursor-pointer'
                              }`}
                              onClick={() => {
                                if (!isAlreadyInstalled) {
                                  installUpgradeInSlot(slotIndex, upgrade);
                                  setShowUpgradePicker(false);
                                }
                              }}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <strong className="text-slate-200">{upgrade.name}</strong>
                                  <span className="text-[10px] text-slate-500">Lvl {upgrade.level}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 block truncate max-w-sm">
                                  {upgrade.description}
                                </span>
                              </div>
                              <button
                                disabled={isAlreadyInstalled}
                                className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-[11px] font-bold flex-shrink-0"
                              >
                                {isAlreadyInstalled ? 'Installed' : 'Choose'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-void-950 font-mono text-xs">
          <span className="text-slate-500 text-[11px]">
            Strictly synced with official Starfinder 2e Tech Core
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            {!isFixed && activeTab === 'station' && (
              <button
                onClick={handleSaveStation}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow active:scale-95"
              >
                Save Workstation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
