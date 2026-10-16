import React, { useState } from 'react';
import { BattleStationType } from '../types/sensor';
import { useSensor } from '../context/SensorContext';
import {
  X,
  Compass,
  Crosshair,
  Zap,
  Radio,
  Bot,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface BattleStationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StationAction {
  name: string;
  station: BattleStationType;
  cost: '1-action' | '2-actions' | 'reaction' | 'free' | 'varies';
  traits: string[];
  minLevel: number;
  gradeName: string;
  description: string;
}

const OFFICIAL_STATION_ACTIONS: StationAction[] = [
  // --- DRONE CONSOLE ---
  {
    name: 'Deploy Drone',
    station: 'drone',
    cost: '1-action',
    traits: ['Manipulate', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'You deploy one drone that is currently docked in your starship into close orbit around the vessel.',
  },
  {
    name: 'Retrieve Drone',
    station: 'drone',
    cost: '1-action',
    traits: ['Manipulate', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'Requirements: You have at least one drone deployed. You recall a deployed drone back into the starship.',
  },
  {
    name: 'Drone Block',
    station: 'drone',
    cost: 'reaction',
    traits: ['Manipulate', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'Trigger: Your starship would be hit by a Strike. Requirements: At least one drone deployed. You command a drone to intercept incoming fire. Your starship gains resistance against the triggering Strike equal to half your character level. The intercepting drone is retrieved and cannot be deployed again for 10 minutes.',
  },

  // --- GENERATOR ---
  {
    name: 'Boost Battle Station',
    station: 'generator',
    cost: '1-action',
    traits: ['Manipulate', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'Re-route primary reactor reserves. Choose another battle station on your starship; actions at that station gain a +1 status bonus to checks and damage rolls for 1 round.',
  },
  {
    name: 'Generate Shields',
    station: 'generator',
    cost: '1-action',
    traits: ['Manipulate', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'Generate emergency reactor power to gain 1d4 Shield Points. When the starship is 3rd level, and every 2 levels thereafter (5th, 7th, 9th, etc.), increase the Shield Points gained by +1d4.',
  },
  {
    name: 'Reposition Shield',
    station: 'generator',
    cost: 'reaction',
    traits: ['Manipulate', 'Station'],
    minLevel: 2,
    gradeName: 'Tactical Grade',
    description:
      'Trigger: Your starship is hit by a Strike (requires >= 1 SP). Attempt a Crafting or Perception check against the attacking starship’s Reflex DC. On a success, your shields absorb damage up to remaining SP without consuming them (or up to half on failure; critical failure damages Hull Points directly).',
  },
  {
    name: 'Vent Power',
    station: 'generator',
    cost: '2-actions',
    traits: ['Evocation', 'Fire', 'Station'],
    minLevel: 5,
    gradeName: 'Advanced Grade',
    description:
      'Frequency: Once per round. Vent superheated plasma to deal 1d10 fire damage to an opposing starship in your zone (0 zones away). The target must make a basic Reflex save against your Crafting DC.',
  },

  // --- SCANNERS ---
  {
    name: 'Seek Starships (Reveal Cloaked)',
    station: 'scanners',
    cost: '1-action',
    traits: ['Concentrate', 'Manipulate', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'Sweep sensors across the sensor map within your ship’s sensor range. The GM rolls a secret Computers or Perception check against hidden or cloaked vessels to reveal their positions to the crew.',
  },
  {
    name: 'Scan Target',
    station: 'scanners',
    cost: '1-action',
    traits: ['Concentrate', 'Manipulate', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'Scan a starship within sensor range via a Computers check vs. its Will DC to learn its model name, sensor range, and identify its equipped battle stations.',
  },
  {
    name: 'Target Lock',
    station: 'scanners',
    cost: '1-action',
    traits: ['Concentrate', 'Manipulate', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'Lock sensor tracking onto an enemy vessel within range. The target must attempt a Will save against your Computers DC; on failure, the target becomes off-guard to your starship’s Strikes for 1 round.',
  },
  {
    name: 'Hack Comms',
    station: 'scanners',
    cost: '1-action',
    traits: ['Concentrate', 'Manipulate', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'Requirements: A technological starship is within sensor range. Forcibly open an audio/visual comms channel for 1 minute, allowing auditory verbal actions (such as Demoralize) across space.',
  },
  {
    name: 'Hack Battle Station',
    station: 'scanners',
    cost: '1-action',
    traits: ['Concentrate', 'Manipulate', 'Station'],
    minLevel: 2,
    gradeName: 'Tactical Grade',
    description:
      'Target an identified enemy starship’s battle station via Computers check against their Will DC to induce a system malfunction glitch, giving them a -1 penalty to actions.',
  },
  {
    name: 'Hack Munition',
    station: 'scanners',
    cost: 'reaction',
    traits: ['Concentrate', 'Manipulate', 'Station'],
    minLevel: 5,
    gradeName: 'Advanced Grade',
    description:
      'Trigger: Your starship would be hit by a Strike from a tech starship. Scramble incoming weapon guidance via a Computers check against their Reflex DC to impose a -2 penalty to the attack.',
  },

  // --- PILOT'S CONSOLE ---
  {
    name: 'Boost Thrusters',
    station: 'pilot',
    cost: '1-action',
    traits: ['Move', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'Frequency: Once per turn. The starship moves forward in the direction of its current heading up to a distance equal to its Speed in zones along the sensor map.',
  },
  {
    name: 'Change Heading',
    station: 'pilot',
    cost: '1-action',
    traits: ['Move', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'You alter the direction your starship faces along the sensor map (reversing between Left ◄ and Right ►). If your vessel was Off-Kilter, this action clears that condition.',
  },
  {
    name: 'Evade',
    station: 'pilot',
    cost: 'varies',
    traits: ['Concentrate', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'Engage evasive maneuvers. Spending [1-action] grants your starship a +1 circumstance bonus to AC for 1 round. Spending [2-actions] increases the bonus to +2.',
  },
  {
    name: 'Stick to Cover',
    station: 'pilot',
    cost: '1-action',
    traits: ['Move', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'Requirements: Your starship is in the same zone as a starship or object one or more sizes larger than it. You maneuver close to gain standard cover against attacks from other zones.',
  },
  {
    name: 'Fly the Ship (Initiative Activity)',
    station: 'pilot',
    cost: 'free',
    traits: ['Exploration', 'Station'],
    minLevel: 1,
    gradeName: 'Initiative',
    description:
      'If you were actively piloting when combat begins, you Evade as a free action when rolling initiative (+2 circumstance bonus to AC until the start of round 1).',
  },

  // --- GUNNERY ---
  {
    name: 'Strike with Starship Weapon',
    station: 'gunnery',
    cost: '1-action',
    traits: ['Attack', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'You take aim and fire the installed starship weapon at a target in weapon range and arc. You roll using your own attack modifier and weapon proficiencies.',
  },
  {
    name: 'Area Fire',
    station: 'gunnery',
    cost: '2-actions',
    traits: ['Area', 'Attack', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'If the installed weapon has the Area trait, discharge wide bursts across the target zone, hitting all non-immune starships in the area.',
  },
  {
    name: 'Auto-Fire Salvo',
    station: 'gunnery',
    cost: '2-actions',
    traits: ['Attack', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'If the installed weapon possesses the Auto-Fire trait, lay down continuous suppressing fire against vessels occupying the designated zone.',
  },

  // --- MAGIC CONDUIT ---
  {
    name: 'Cast Starship Spell',
    station: 'magic',
    cost: 'varies',
    traits: ['Magical', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'Channel your magical spellcasting through the ship’s conduit. Expend a personal spell slot to cast an amplified starship spell from the ship’s repository.',
  },
  {
    name: 'Scan for Magic',
    station: 'magic',
    cost: '1-action',
    traits: ['Concentrate', 'Detect', 'Station'],
    minLevel: 1,
    gradeName: 'Commercial',
    description:
      'Send out a resonant thaumaturgical pulse to detect whether magical signatures or active starship spells exist within your sensor range.',
  },
  {
    name: 'Counter Magic',
    station: 'magic',
    cost: '2-actions',
    traits: ['Concentrate', 'Manipulate', 'Station'],
    minLevel: 2,
    gradeName: 'Tactical Grade',
    description:
      'Attempt a counteract check using your spellcasting proficiency against an incoming magical spell, ritual, or magical space hazard within sensor range.',
  },
];

export const BattleStationsModal: React.FC<BattleStationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { shipLevel, setShipLevel } = useSensor();

  // Player selects the station they are currently manning
  const [currentStation, setCurrentStation] = useState<BattleStationType>('pilot');
  const [showAllStations, setShowAllStations] = useState<boolean>(false);

  if (!isOpen) return null;

  const stationTabs: { id: BattleStationType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'pilot', label: "Pilot's Console", icon: <Compass className="w-4 h-4" />, color: 'text-sky-400 border-sky-500/50 bg-sky-950/40' },
    { id: 'gunnery', label: 'Gunnery', icon: <Crosshair className="w-4 h-4" />, color: 'text-rose-400 border-rose-500/50 bg-rose-950/40' },
    { id: 'generator', label: 'Generator', icon: <Zap className="w-4 h-4" />, color: 'text-amber-400 border-amber-500/50 bg-amber-950/40' },
    { id: 'scanners', label: 'Scanners', icon: <Radio className="w-4 h-4" />, color: 'text-purple-400 border-purple-500/50 bg-purple-950/40' },
    { id: 'drone', label: 'Drone Console', icon: <Bot className="w-4 h-4" />, color: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/40' },
    { id: 'magic', label: 'Magic Conduit', icon: <Sparkles className="w-4 h-4" />, color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40' },
  ];

  const filteredActions = showAllStations
    ? OFFICIAL_STATION_ACTIONS
    : OFFICIAL_STATION_ACTIONS.filter((a) => a.station === currentStation);

  const getCostBadge = (cost: StationAction['cost']) => {
    switch (cost) {
      case '1-action':
        return '◆ 1 Action';
      case '2-actions':
        return '◆◆ 2 Actions';
      case 'reaction':
        return '↺ Reaction';
      case 'free':
        return '◇ Free Action';
      case 'varies':
        return '◆-◆◆ Varies';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-void-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-void-950">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-100 font-mono text-sm sm:text-base">
              SF2E BATTLE STATIONS & ACTIONS
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Starship Level Selector */}
            <div className="flex items-center gap-1.5 bg-void-900 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-xs">
              <span className="text-slate-400">Starship Level:</span>
              <select
                value={shipLevel}
                onChange={(e) => setShipLevel(parseInt(e.target.value, 10))}
                className="bg-void-950 border border-slate-700 text-cyan-300 font-bold px-2 py-0.5 rounded focus:outline-none focus:border-cyan-500"
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Level {lvl}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Station Selection Bar: "What Station Are You Manning?" */}
        <div className="p-4 bg-void-950 border-b border-slate-800/90 flex flex-col gap-2.5">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <span>Select Station You Are Manning:</span>
            </span>
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
              <input
                type="checkbox"
                checked={showAllStations}
                onChange={(e) => setShowAllStations(e.target.checked)}
                className="rounded bg-void-900 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Show All Stations</span>
            </label>
          </div>

          {/* Station Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {stationTabs.map((st) => {
              const isSelected = currentStation === st.id && !showAllStations;
              return (
                <button
                  key={st.id}
                  onClick={() => {
                    setCurrentStation(st.id);
                    setShowAllStations(false);
                  }}
                  className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-mono transition-all text-left ${
                    isSelected
                      ? `${st.color} font-bold ring-1 ring-cyan-400 shadow-md`
                      : 'bg-void-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {isSelected ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : st.icon}
                  <span className="truncate">{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Cards List */}
        <div className="p-4 overflow-y-auto space-y-3 font-mono text-xs flex-1">
          {filteredActions.map((action, idx) => {
            const isUnlocked = shipLevel >= action.minLevel;
            const stationInfo = stationTabs.find((s) => s.id === action.station);

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-colors flex flex-col gap-2 ${
                  isUnlocked
                    ? 'bg-void-950/80 border-slate-800/90 hover:border-slate-700'
                    : 'bg-void-950/40 border-slate-900 opacity-60'
                }`}
              >
                {/* Action Title Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                      {!isUnlocked && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{action.name}</span>
                    </h4>
                    {showAllStations && stationInfo && (
                      <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${stationInfo.color}`}>
                        {stationInfo.label}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isUnlocked ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-semibold">
                        Requires Level {action.minLevel} ({action.gradeName})
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-void-900 border border-slate-800 text-slate-400">
                        {action.gradeName}
                      </span>
                    )}
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                      {getCostBadge(action.cost)}
                    </span>
                  </div>
                </div>

                {/* Traits Badges */}
                <div className="flex flex-wrap gap-1">
                  {action.traits.map((trait) => (
                    <span
                      key={trait}
                      className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-void-900 border border-slate-800 text-slate-400"
                    >
                      {trait}
                    </span>
                  ))}
                </div>

                {/* Action Description */}
                <p className="text-slate-300 text-xs leading-relaxed">
                  {action.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-void-950 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Characters can move between stations during combat on their turn.</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://2e.aonsrd.com/tactical-starship-combat/battle-stations"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-cyan-400 hover:underline"
            >
              <span>Archives of Nethys Rules</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-void-800 hover:bg-void-700 text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
