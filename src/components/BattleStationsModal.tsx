import React, { useState } from 'react';
import { BattleStationType } from '../types/sensor';
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
  description: string;
}

const OFFICIAL_STATION_ACTIONS: StationAction[] = [
  // --- PILOT'S CONSOLE ---
  {
    name: 'Boost Thrusters',
    station: 'pilot',
    cost: '1-action',
    traits: ['Move', 'Station'],
    description:
      'Frequency: Once per turn. The starship moves forward in the direction of its current heading up to a distance equal to its Speed in zones along the sensor map.',
  },
  {
    name: 'Change Heading',
    station: 'pilot',
    cost: '1-action',
    traits: ['Move', 'Station'],
    description:
      'You alter the direction your starship faces along the sensor map (Left ◄ or Right ►). If your vessel was Off-Kilter, this action clears that condition.',
  },
  {
    name: 'Evade',
    station: 'pilot',
    cost: 'varies',
    traits: ['Concentrate', 'Station'],
    description:
      'Engage evasive maneuvers. Spending [1-action] grants your starship a +1 circumstance bonus to AC for 1 round. Spending [2-actions] increases the bonus to +2.',
  },
  {
    name: 'Stick to Cover',
    station: 'pilot',
    cost: '1-action',
    traits: ['Move', 'Station'],
    description:
      'Requirements: Your starship is in the same zone as a starship or object one or more sizes larger than it. You maneuver close to gain standard cover against attacks from other zones.',
  },
  {
    name: 'Fly the Ship (Initiative Activity)',
    station: 'pilot',
    cost: 'free',
    traits: ['Exploration', 'Station'],
    description:
      'If you were actively piloting when combat begins, you Evade as a free action when rolling initiative (+2 circumstance bonus to AC until the start of round 1).',
  },

  // --- GUNNERY ---
  {
    name: 'Strike with Starship Weapon',
    station: 'gunnery',
    cost: '1-action',
    traits: ['Attack', 'Station'],
    description:
      'You take aim and fire the installed starship weapon at a target in weapon range. You roll using your own attack modifier and weapon proficiencies.',
  },
  {
    name: 'Area Fire',
    station: 'gunnery',
    cost: '2-actions',
    traits: ['Area', 'Attack', 'Station'],
    description:
      'If the installed weapon has the Area trait, discharge wide bursts across the target zone, hitting all non-immune starships in the area.',
  },
  {
    name: 'Auto-Fire Salvo',
    station: 'gunnery',
    cost: '2-actions',
    traits: ['Attack', 'Station'],
    description:
      'If the installed weapon possesses the Auto-Fire trait, lay down continuous suppressing fire against vessels occupying the designated zone.',
  },

  // --- GENERATOR ---
  {
    name: 'Boost Battle Station',
    station: 'generator',
    cost: '1-action',
    traits: ['Manipulate', 'Station'],
    description:
      'Re-route primary reactor reserves. Choose another battle station on your ship; that station gains a +1 status bonus to checks and damage rolls for 1 round.',
  },
  {
    name: 'Generate Shields',
    station: 'generator',
    cost: '1-action',
    traits: ['Manipulate', 'Station'],
    description:
      'Channel power to restore 1d4 Shield Points to your vessel (increases by +1d4 every 2 levels starting at level 3, e.g., 2d4 at level 3, 3d4 at level 5).',
  },
  {
    name: 'Reposition Shield',
    station: 'generator',
    cost: 'reaction',
    traits: ['Manipulate', 'Station'],
    description:
      'Trigger: Your starship is hit by an incoming Strike (requires >= 1 SP). Attempt a Crafting or Perception check against the attacker’s Reflex DC to absorb damage without losing shield points.',
  },
  {
    name: 'Vent Power',
    station: 'generator',
    cost: '2-actions',
    traits: ['Evocation', 'Fire', 'Station'],
    description:
      'Frequency: Once per round. Vent superheated plasma to deal 1d10 fire damage to an opposing starship in your zone (0 zones away). The target must make a basic Reflex save against your Crafting DC.',
  },

  // --- SCANNERS ---
  {
    name: 'Seek Starships (Reveal Cloaked)',
    station: 'scanners',
    cost: '1-action',
    traits: ['Concentrate', 'Manipulate', 'Station'],
    description:
      'Sweep sensors across the sensor map within your ship’s sensor range. The GM rolls a secret Computers or Perception check against hidden or cloaked vessels to reveal their positions to the crew.',
  },
  {
    name: 'Target Lock',
    station: 'scanners',
    cost: '1-action',
    traits: ['Concentrate', 'Manipulate', 'Station'],
    description:
      'Lock sensor tracking onto an enemy vessel within range. The target must attempt a Will save against your Computers DC; on failure, your gunners gain tactical lock-on bonuses.',
  },
  {
    name: 'Hack Comms',
    station: 'scanners',
    cost: '1-action',
    traits: ['Concentrate', 'Manipulate', 'Station'],
    description:
      'Requirements: A technological starship is within sensor range. Forcibly open an audio/visual comms channel for 1 minute, allowing verbal social actions (such as Demoralize) across space.',
  },
  {
    name: 'Scan Surroundings (Initiative Activity)',
    station: 'scanners',
    cost: 'free',
    traits: ['Exploration', 'Station'],
    description:
      'If you were actively scanning before combat, you immediately Seek Starships as a free action when rolling initiative.',
  },

  // --- DRONE CONSOLE ---
  {
    name: 'Harry Sensors',
    station: 'drone',
    cost: '1-action',
    traits: ['Manipulate', 'Station'],
    description:
      'Direct deployed drones to fire interference flares at an opposing vessel in your zone. The target must succeed at a Will save against your class/spell DC or become Off-Kilter (or Off-Guard on critical failure).',
  },
  {
    name: 'Intercept Munitions',
    station: 'drone',
    cost: 'reaction',
    traits: ['Manipulate', 'Station'],
    description:
      'Trigger: Your starship is targeted by an incoming Strike. An escort drone intercepts the projectile path, imposing a -2 circumstance penalty to the attacker’s attack roll.',
  },

  // --- MAGIC CONDUIT ---
  {
    name: 'Cast Starship Spell',
    station: 'magic',
    cost: 'varies',
    traits: ['Magical', 'Station'],
    description:
      'Channel your magical spellcasting through the ship’s conduit. Expend a personal spell slot to cast an amplified starship spell from the ship’s repository.',
  },
  {
    name: 'Counter Magic',
    station: 'magic',
    cost: '2-actions',
    traits: ['Concentrate', 'Manipulate', 'Station'],
    description:
      'Attempt a counteract check using your spellcasting proficiency against an incoming magical spell, ritual, or magical space hazard within sensor range.',
  },
  {
    name: 'Scan for Magic',
    station: 'magic',
    cost: '1-action',
    traits: ['Concentrate', 'Detect', 'Station'],
    description:
      'Send out a resonant thaumaturgical pulse to detect whether magical signatures or active starship spells exist within your sensor range.',
  },
];

export const BattleStationsModal: React.FC<BattleStationsModalProps> = ({
  isOpen,
  onClose,
}) => {
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
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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
            const stationInfo = stationTabs.find((s) => s.id === action.station);
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-void-950/80 border border-slate-800/90 hover:border-slate-700 transition-colors flex flex-col gap-2"
              >
                {/* Action Title Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-100 text-sm">
                      {action.name}
                    </h4>
                    {showAllStations && stationInfo && (
                      <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${stationInfo.color}`}>
                        {stationInfo.label}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
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
