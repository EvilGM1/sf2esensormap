import React, { useState } from 'react';
import { BattleStationRole } from '../types/sensor';
import {
  X,
  Crosshair,
  Compass,
  Wrench,
  Radio,
  Crown,
  CheckCircle2,
  Circle,
  HelpCircle,
} from 'lucide-react';

interface BattleStationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ActionItem {
  name: string;
  actions: number; // 1, 2, or 3 actions
  minLevel: number;
  description: string;
  role: BattleStationRole;
}

const CREW_ACTIONS: ActionItem[] = [
  // Pilot Actions
  {
    name: 'Maneuver',
    actions: 1,
    minLevel: 1,
    role: 'pilot',
    description: 'Fly your starship along the sensor map up to your speed value.',
  },
  {
    name: 'Turn (Change Heading)',
    actions: 1,
    minLevel: 1,
    role: 'pilot',
    description: 'Flip your heading from Left ◄ to Right ► (or vice-versa) to reposition and avoid rear off-guard flank attacks.',
  },
  {
    name: 'Evade',
    actions: 2,
    minLevel: 1,
    role: 'pilot',
    description: 'Engage evasive thrusters. Grant your ship a +2 circumstance bonus to AC against attacks this round.',
  },
  {
    name: 'Flyby Attack',
    actions: 2,
    minLevel: 4,
    role: 'pilot',
    description: 'Fly past an opposing vessel, change heading, and attack their vulnerable rear off-guard arc in a single movement.',
  },

  // Gunner Actions
  {
    name: 'Fire Starship Weapon',
    actions: 1,
    minLevel: 1,
    role: 'gunner',
    description: 'Fire a mounted weapon at a target in range. Apply range penalty if target is beyond normal range.',
  },
  {
    name: 'Targeted Subsystem Strike',
    actions: 2,
    minLevel: 3,
    role: 'gunner',
    description: 'Take aim at a specific enemy system (Weapons, Engines, or Sensors) to inflict a critical malfunction glitch.',
  },
  {
    name: 'Broadside Salvo',
    actions: 2,
    minLevel: 5,
    role: 'gunner',
    description: 'Discharge all weapons mounted on one side simultaneously at targets in that zone.',
  },

  // Engineer Actions
  {
    name: 'Divert Power (Engines / Weapons)',
    actions: 1,
    minLevel: 1,
    role: 'engineer',
    description: 'Re-route auxiliary power to either increase movement speed by +2 zones or grant +2 damage to weapon attacks.',
  },
  {
    name: 'Overcharge / Rebalance Shields',
    actions: 1,
    minLevel: 1,
    role: 'engineer',
    description: 'Shift shield energy to protect vulnerable quadrants or restore drained shield points.',
  },
  {
    name: 'Quick System Patch',
    actions: 2,
    minLevel: 2,
    role: 'engineer',
    description: 'Repair a glitching battle station to restore it to full operational efficiency.',
  },

  // Science Officer Actions
  {
    name: 'Active Sensor Scan (Reveal Cloaked)',
    actions: 1,
    minLevel: 1,
    role: 'science',
    description: 'Sweep the sensor track to reveal hidden/cloaked ships and scan enemy hull points, shields, and weapon arcs.',
  },
  {
    name: 'Target Lock-On',
    actions: 1,
    minLevel: 1,
    role: 'science',
    description: 'Calibrate targeting sensors on an enemy vessel. Your gunners gain a +1 circumstance bonus on attack rolls against it.',
  },
  {
    name: 'Jam Enemy Sensors',
    actions: 2,
    minLevel: 3,
    role: 'science',
    description: 'Flood electromagnetic channels with white noise, giving enemies a -2 penalty to their sensor checks and lock-ons.',
  },

  // Captain Actions
  {
    name: 'Encourage Crew',
    actions: 1,
    minLevel: 1,
    role: 'captain',
    description: 'Give inspiring directives to grant a crew member a +1 status bonus to their next skill roll.',
  },
  {
    name: 'Demand Extra Effort',
    actions: 2,
    minLevel: 2,
    role: 'captain',
    description: 'Push a crew member at a battle station to grant them 1 extra action this round.',
  },
  {
    name: 'Tactical Coordination',
    actions: 2,
    minLevel: 4,
    role: 'captain',
    description: 'Coordinate pilot and gunner maneuvers so a turn and strike occur in seamless tactical synchrony.',
  },
];

export const BattleStationsModal: React.FC<BattleStationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [shipLevel, setShipLevel] = useState<number>(3);
  const [selectedRoles, setSelectedRoles] = useState<Set<BattleStationRole>>(
    new Set(['pilot', 'gunner', 'engineer', 'science', 'captain'])
  );

  if (!isOpen) return null;

  const toggleRole = (role: BattleStationRole) => {
    const next = new Set(selectedRoles);
    if (next.has(role)) {
      if (next.size > 1) next.delete(role);
    } else {
      next.add(role);
    }
    setSelectedRoles(next);
  };

  const rolesConfig: { id: BattleStationRole; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'pilot', label: 'Pilot', icon: <Compass className="w-4 h-4" />, color: 'text-sky-400 border-sky-500/40 bg-sky-950/40' },
    { id: 'gunner', label: 'Gunner', icon: <Crosshair className="w-4 h-4" />, color: 'text-rose-400 border-rose-500/40 bg-rose-950/40' },
    { id: 'engineer', label: 'Engineer', icon: <Wrench className="w-4 h-4" />, color: 'text-amber-400 border-amber-500/40 bg-amber-950/40' },
    { id: 'science', label: 'Science Officer', icon: <Radio className="w-4 h-4" />, color: 'text-purple-400 border-purple-500/40 bg-purple-950/40' },
    { id: 'captain', label: 'Captain', icon: <Crown className="w-4 h-4" />, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' },
  ];

  const filteredActions = CREW_ACTIONS.filter(
    (action) => selectedRoles.has(action.role) && action.minLevel <= shipLevel
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-void-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-void-950">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-100 font-mono text-sm">
              STARSHIP BATTLE STATIONS & ACTIONS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Selector & Station Filter Checklist */}
        <div className="p-4 bg-void-950 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
          {/* Ship Level */}
          <div className="flex items-center gap-2 bg-void-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Starship Level:</span>
            <select
              value={shipLevel}
              onChange={(e) => setShipLevel(parseInt(e.target.value, 10))}
              className="bg-void-950 border border-slate-700 text-cyan-300 font-bold px-2 py-0.5 rounded focus:outline-none"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => (
                <option key={lvl} value={lvl}>
                  Tier {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Station checklist tags */}
          <div className="flex flex-wrap gap-1.5">
            {rolesConfig.map((r) => {
              const active = selectedRoles.has(r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => toggleRole(r.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all ${
                    active
                      ? `${r.color} font-bold shadow`
                      : 'bg-void-900 border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  {active ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-3.5 h-3.5" />
                  )}
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Cards List */}
        <div className="p-4 overflow-y-auto space-y-2.5 font-mono text-xs">
          {filteredActions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No actions found for selected stations and ship level.
            </div>
          ) : (
            filteredActions.map((action, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-void-950/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-xs sm:text-sm">
                      {action.name}
                    </span>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded border bg-void-900 border-slate-700 text-slate-400">
                      {action.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-bold bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                    <span>{action.actions} {action.actions === 1 ? 'Action' : 'Actions'}</span>
                  </div>
                </div>

                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {action.description}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-void-950 flex items-center justify-between font-mono text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Players can check their assigned battle station on their phones.</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-void-800 hover:bg-void-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
