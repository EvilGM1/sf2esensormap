import {
  FrameId,
  FrameBaseInfo,
  FrameLevelStats,
  StarshipWeapon,
  StarshipDrone,
  StationUpgrade,
  InstalledBattleStation,
  PlayerStarshipConfig,
} from '../types/starshipSheet';
import { BattleStationType } from '../types/sensor';

// ---------------------------------------------------------------------------
// 1. OFFICIAL FRAMES BASE INFO (Tech Core pg. 197-199)
// ---------------------------------------------------------------------------
export const FRAME_DEFINITIONS: Record<FrameId, FrameBaseInfo> = {
  bulwark: {
    id: 'bulwark',
    name: 'Bulwark',
    size: 'medium',
    description:
      'A bulky, defensive frame. While it is not the speediest, it is very sturdy and comes with a ramming prow that makes the most of its impressive bulk. Due to its reinforced hull, it can endure battles with minimal shield generation.',
    defaultSensorRange: 5,
    fixedUpgradeName: 'Ramming Prow',
    fixedUpgradeStation: 'pilot',
    baysCount: 4,
  },
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    size: 'medium',
    description:
      'A well-rounded starship frame featuring powerful long-range sensors and unmatched shield generation capabilities. It balances durability with mobility, functioning as an exceptional command bridge for tactical operations.',
    defaultSensorRange: 6,
    fixedUpgradeName: 'Pulse Shield',
    fixedUpgradeStation: 'generator',
    baysCount: 4,
  },
  skirmisher: {
    id: 'skirmisher',
    name: 'Skirmisher',
    size: 'medium',
    description:
      'A swift, battle-ready frame designed for high-speed engagement and rapid vectoring. With built-in rotational thrusters, it outmaneuvers adversaries to catch opponents off-guard while consistently firing ordnance.',
    defaultSensorRange: 4,
    fixedUpgradeName: 'Rotational Thrusters',
    fixedUpgradeStation: 'pilot',
    baysCount: 4,
  },
};

// ---------------------------------------------------------------------------
// 2. OFFICIAL STAT PROGRESSION TABLES BY LEVEL (1 to 20) (Archives of Nethys)
// ---------------------------------------------------------------------------
export const FRAME_PROGRESSION: Record<FrameId, Record<number, FrameLevelStats>> = {
  bulwark: {
    1: { level: 1, hp: 27, sp: 10, ac: 17, fort: 9, ref: 6, will: 8, speed: 2 },
    2: { level: 2, hp: 42, sp: 14, ac: 18, fort: 10, ref: 7, will: 9, speed: 2 },
    3: { level: 3, hp: 57, sp: 18, ac: 19, fort: 11, ref: 10, will: 10, speed: 2 },
    4: { level: 4, hp: 72, sp: 22, ac: 20, fort: 12, ref: 11, will: 11, speed: 2 },
    5: { level: 5, hp: 92, sp: 31, ac: 21, fort: 14, ref: 13, will: 13, speed: 2 },
    6: { level: 6, hp: 108, sp: 36, ac: 22, fort: 15, ref: 14, will: 14, speed: 2 },
    7: { level: 7, hp: 124, sp: 41, ac: 25, fort: 18, ref: 15, will: 15, speed: 2 },
    8: { level: 8, hp: 140, sp: 46, ac: 26, fort: 19, ref: 16, will: 16, speed: 2 },
    9: { level: 9, hp: 156, sp: 51, ac: 27, fort: 20, ref: 17, will: 17, speed: 2 },
    10: { level: 10, hp: 172, sp: 66, ac: 28, fort: 21, ref: 18, will: 19, speed: 3 },
    11: { level: 11, hp: 188, sp: 72, ac: 29, fort: 22, ref: 19, will: 22, speed: 3 },
    12: { level: 12, hp: 240, sp: 78, ac: 30, fort: 24, ref: 20, will: 23, speed: 3 },
    13: { level: 13, hp: 258, sp: 84, ac: 33, fort: 25, ref: 21, will: 24, speed: 3 },
    14: { level: 14, hp: 276, sp: 90, ac: 34, fort: 26, ref: 22, will: 25, speed: 3 },
    15: { level: 15, hp: 305, sp: 96, ac: 35, fort: 30, ref: 24, will: 26, speed: 3 },
    16: { level: 16, hp: 324, sp: 102, ac: 36, fort: 31, ref: 25, will: 27, speed: 3 },
    17: { level: 17, hp: 342, sp: 108, ac: 39, fort: 32, ref: 26, will: 28, speed: 3 },
    18: { level: 18, hp: 360, sp: 114, ac: 40, fort: 33, ref: 27, will: 29, speed: 3 },
    19: { level: 19, hp: 378, sp: 120, ac: 41, fort: 34, ref: 28, will: 30, speed: 3 },
    20: { level: 20, hp: 392, sp: 148, ac: 43, fort: 36, ref: 30, will: 33, speed: 3 },
  },
  explorer: {
    1: { level: 1, hp: 24, sp: 11, ac: 15, fort: 8, ref: 6, will: 9, speed: 3 },
    2: { level: 2, hp: 36, sp: 16, ac: 16, fort: 9, ref: 7, will: 10, speed: 3 },
    3: { level: 3, hp: 48, sp: 21, ac: 17, fort: 10, ref: 10, will: 11, speed: 3 },
    4: { level: 4, hp: 60, sp: 26, ac: 18, fort: 11, ref: 11, will: 12, speed: 3 },
    5: { level: 5, hp: 77, sp: 36, ac: 20, fort: 13, ref: 13, will: 14, speed: 3 },
    6: { level: 6, hp: 90, sp: 42, ac: 21, fort: 14, ref: 14, will: 15, speed: 3 },
    7: { level: 7, hp: 103, sp: 48, ac: 24, fort: 15, ref: 15, will: 18, speed: 4 },
    8: { level: 8, hp: 116, sp: 54, ac: 25, fort: 16, ref: 16, will: 19, speed: 4 },
    9: { level: 9, hp: 129, sp: 60, ac: 26, fort: 17, ref: 17, will: 20, speed: 4 },
    10: { level: 10, hp: 142, sp: 66, ac: 28, fort: 18, ref: 19, will: 21, speed: 4 },
    11: { level: 11, hp: 155, sp: 72, ac: 29, fort: 21, ref: 20, will: 22, speed: 4 },
    12: { level: 12, hp: 204, sp: 78, ac: 30, fort: 23, ref: 20, will: 23, speed: 3 },
    13: { level: 13, hp: 220, sp: 84, ac: 33, fort: 24, ref: 21, will: 24, speed: 3 },
    14: { level: 14, hp: 236, sp: 90, ac: 34, fort: 25, ref: 22, will: 25, speed: 3 },
    15: { level: 15, hp: 267, sp: 96, ac: 35, fort: 29, ref: 24, will: 26, speed: 3 },
    16: { level: 16, hp: 284, sp: 102, ac: 36, fort: 30, ref: 25, will: 27, speed: 3 },
    17: { level: 17, hp: 301, sp: 108, ac: 39, fort: 31, ref: 26, will: 28, speed: 3 },
    18: { level: 18, hp: 318, sp: 114, ac: 40, fort: 32, ref: 27, will: 29, speed: 3 },
    19: { level: 19, hp: 335, sp: 120, ac: 41, fort: 33, ref: 28, will: 30, speed: 4 },
    20: { level: 20, hp: 372, sp: 146, ac: 42, fort: 35, ref: 29, will: 32, speed: 4 },
  },
  skirmisher: {
    1: { level: 1, hp: 22, sp: 8, ac: 16, fort: 6, ref: 9, will: 8, speed: 5 },
    2: { level: 2, hp: 32, sp: 12, ac: 17, fort: 7, ref: 10, will: 9, speed: 5 },
    3: { level: 3, hp: 42, sp: 16, ac: 18, fort: 10, ref: 11, will: 10, speed: 5 },
    4: { level: 4, hp: 52, sp: 20, ac: 19, fort: 11, ref: 12, will: 11, speed: 5 },
    5: { level: 5, hp: 67, sp: 29, ac: 21, fort: 13, ref: 14, will: 13, speed: 5 },
    6: { level: 6, hp: 78, sp: 34, ac: 22, fort: 14, ref: 15, will: 14, speed: 5 },
    7: { level: 7, hp: 89, sp: 39, ac: 25, fort: 15, ref: 18, will: 15, speed: 6 },
    8: { level: 8, hp: 100, sp: 44, ac: 26, fort: 16, ref: 19, will: 16, speed: 6 },
    9: { level: 9, hp: 111, sp: 49, ac: 27, fort: 17, ref: 20, will: 17, speed: 6 },
    10: { level: 10, hp: 122, sp: 64, ac: 28, fort: 18, ref: 21, will: 19, speed: 6 },
    11: { level: 11, hp: 133, sp: 70, ac: 29, fort: 19, ref: 22, will: 22, speed: 6 },
    12: { level: 12, hp: 144, sp: 76, ac: 30, fort: 22, ref: 21, will: 23, speed: 4 },
    13: { level: 13, hp: 170, sp: 88, ac: 32, fort: 23, ref: 22, will: 25, speed: 4 },
    14: { level: 14, hp: 196, sp: 100, ac: 33, fort: 24, ref: 23, will: 27, speed: 5 },
    15: { level: 15, hp: 222, sp: 111, ac: 35, fort: 26, ref: 24, will: 29, speed: 5 },
    16: { level: 16, hp: 240, sp: 124, ac: 37, fort: 27, ref: 26, will: 30, speed: 5 },
    17: { level: 17, hp: 258, sp: 138, ac: 39, fort: 28, ref: 27, will: 32, speed: 5 },
    18: { level: 18, hp: 270, sp: 150, ac: 41, fort: 29, ref: 28, will: 33, speed: 5 },
    19: { level: 19, hp: 282, sp: 158, ac: 42, fort: 30, ref: 29, will: 34, speed: 5 },
    20: { level: 20, hp: 292, sp: 166, ac: 43, fort: 31, ref: 30, will: 35, speed: 5 },
  },
};

// ---------------------------------------------------------------------------
// 3. OFFICIAL STARSHIP WEAPONS (Archives of Nethys)
// ---------------------------------------------------------------------------
export const STARSHIP_WEAPONS: StarshipWeapon[] = [
  {
    id: 'light-laser-cannon',
    name: 'Light Laser Cannon',
    category: 'simple',
    damageDice: '1d8',
    damageType: 'Fire',
    rangeZones: 5,
    traits: ['Tech'],
    description: 'Standard laser emitter calibrated for precision space engagement over long ranges.',
  },
  {
    id: 'coilgun',
    name: 'Coilgun',
    category: 'simple',
    damageDice: '1d6',
    damageType: 'Piercing',
    rangeZones: 3,
    traits: ['Agile', 'Analog'],
    description: 'Electromagnetic rail mechanism firing high-velocity metal projectiles with rapid tracking.',
  },
  {
    id: 'acid-capsule-launcher',
    name: 'Acid Capsule Launcher',
    category: 'simple',
    damageDice: '1d8',
    damageType: 'Acid',
    rangeZones: 4,
    traits: ['Analog'],
    description: 'Pneumatic tube launching pressurized caustic capsules designed to eat through external plating.',
  },
  {
    id: 'fragment-launcher',
    name: 'Fragment Launcher',
    category: 'simple',
    damageDice: '1d8',
    damageType: 'Piercing',
    rangeZones: 2,
    traits: ['Analog', 'Area (Cone)', 'Concussive'],
    description: 'Discharges shrapnel canisters that spray jagged debris across close-range space arcs.',
  },
  {
    id: 'pulsecaster-cannon',
    name: 'Pulsecaster Cannon',
    category: 'simple',
    damageDice: '1d6',
    damageType: 'Electricity',
    rangeZones: 3,
    traits: ['Agile', 'Tech'],
    description: 'Fires high-voltage electronic disruptor bursts to scramble shields and power relays.',
  },
  {
    id: 'starballista',
    name: 'Starballista',
    category: 'simple',
    damageDice: '1d10',
    damageType: 'Piercing',
    rangeZones: 6,
    traits: ['Analog', 'Ordnance', 'Unwieldy'],
    description: 'Massive heavy-draw siege launcher propelling dense armor-piercing kinetic bolts.',
  },
  {
    id: 'asteroid-breacher',
    name: 'Asteroid Breacher',
    category: 'simple',
    damageDice: '1d6',
    damageType: 'Piercing',
    rangeZones: 3,
    traits: ['Concussive', 'Razing', 'Tech', 'Unwieldy'],
    description: 'Modified mining cutter firing concentrated structural-shattering kinetic penetrators.',
  },
  {
    id: 'chain-repeater',
    name: 'Chain Repeater',
    category: 'martial',
    damageDice: '1d8',
    damageType: 'Piercing',
    rangeZones: 2,
    traits: ['Analog', 'Automatic'],
    description: 'Multi-barrel rotary cannon laying down continuous kinetic suppressive fire.',
  },
  {
    id: 'polarizing-beam',
    name: 'Polarizing Beam',
    category: 'martial',
    damageDice: '1d8',
    damageType: 'Electricity',
    rangeZones: 2,
    traits: ['Boost 1d8', 'Ordnance'],
    description: 'Fires ion-polarized beams that destabilize enemy generators and overload defensive grids.',
  },
  {
    id: 'artillery-cannon',
    name: 'Artillery Cannon',
    category: 'advanced',
    damageDice: '1d10',
    damageType: 'Fire',
    rangeZones: 6,
    traits: ['Critical (Flame)', 'Forceful', 'Razing', 'Tech'],
    description: 'Capital-grade plasma artillery weapon delivering devastating long-distance broadsides.',
  },
  {
    id: 'gravity-cannon',
    name: 'Gravity Cannon',
    category: 'advanced',
    damageDice: '1d10',
    damageType: 'Bludgeoning',
    rangeZones: 5,
    traits: ['Area (Line)', 'Ordnance', 'Tech'],
    description: 'Hurls localized singularity waves in a straight corridor through target space.',
  },
  {
    id: 'magnetar-rail',
    name: 'Magnetar Rail',
    category: 'advanced',
    damageDice: '1d10',
    damageType: 'Piercing',
    rangeZones: 6,
    traits: ['Analog', 'Automatic', 'Ordnance'],
    description: 'State-of-the-art superheated relativistic slugthrower cutting through hulls.',
  },
  {
    id: 'aeon-cannon',
    name: 'Aeon Cannon',
    category: 'advanced',
    damageDice: '1d6',
    damageType: 'Fire',
    rangeZones: 4,
    traits: ['Aeon', 'Agile', 'Caster', 'Tech'],
    description: 'Magical-technological hybrid projector that channels spell energy into prismatic lances.',
  },
];

// ---------------------------------------------------------------------------
// 4. OFFICIAL STARSHIP DRONES (Archives of Nethys)
// ---------------------------------------------------------------------------
export const STARSHIP_DRONES: StarshipDrone[] = [
  {
    id: 'pyrotechnics-drone',
    name: 'Pyrotechnics Drone',
    role: 'Munitions & Mine Warfare',
    description:
      'Drops and remotely detonates shielded starship mines in target space zones to establish defensive perimeters or ambush pursuers.',
    actionsGranted: ['Deploy Drone', 'Install Mines', 'Detonate Mines', 'Drone Block'],
  },
  {
    id: 'repair-drone',
    name: 'Repair Drone',
    role: 'Combat Engineering & Patching',
    description:
      'Autonomous maintenance automaton equipped with plasma welders and shield conduits to patch ruptured hulls and restore power lines during active firefights.',
    actionsGranted: ['Deploy Drone', 'Fetch and Fix', 'Emergency Patch', 'Drone Block'],
  },
  {
    id: 'scramble-drone',
    name: 'Scramble Drone',
    role: 'Electronic Warfare & Decoys',
    description:
      'High-agility decoy platform broadcasting ECM jamming signatures and countermeasure flares to confuse hostile targeting sensors and disrupt incoming ordnance.',
    actionsGranted: ['Deploy Drone', 'Sensor Flare', 'Scramble Lock', 'Drone Block'],
  },
];

// ---------------------------------------------------------------------------
// 5. OFFICIAL BATTLE STATION UPGRADES (Archives of Nethys Tech Core pg. 184-186)
// ---------------------------------------------------------------------------
export const STARSHIP_UPGRADES: StationUpgrade[] = [
  // --- Generator Upgrades ---
  {
    id: 'pulse-shield',
    name: 'Pulse Shield',
    level: 1,
    usage: 'generator',
    traits: ['Starship', 'Tech'],
    description:
      'Additional component shielding allowing you to overload the generator without destroying critical systems, emitting a kinetic shockwave.',
    actionGranted: {
      name: 'Activate — Shield Pulse',
      actionsCost: '1-action',
      traits: ['Manipulate', 'Station', 'Tech'],
      description:
        'Discharges a pulsing shield wave affecting starships in your zone or up to 1-2 zones away at higher grades.',
    },
  },
  {
    id: 'gravity-toggle',
    name: 'Gravity Toggle',
    level: 1,
    usage: 'generator',
    traits: ['Starship', 'Tech'],
    description:
      'A master bypass switch that controls artificial gravity onboard the starship, toggling zero-g and standard-g.',
    actionGranted: {
      name: 'Activate — Switch Gravity',
      actionsCost: '1-action',
      traits: ['Manipulate', 'Station'],
      description: 'Enables or disables artificial gravity onboard the starship interior.',
    },
  },
  {
    id: 'mechanic-generator-module',
    name: 'Mechanic Generator Module',
    level: 1,
    usage: 'generator',
    traits: ['Starship', 'Tech'],
    description:
      'Customized wireless terminal tuned to the mechanics neocortex, routing direct bypasses to starship subsystems.',
    actionGranted: {
      name: 'Activate — Modify Starship',
      actionsCost: '1-action',
      traits: ['Manipulate', 'Station'],
      description: 'Grants situational status bonuses to systems and repairs.',
    },
  },
  {
    id: 'solar-generator-crystal',
    name: 'Solar Generator Crystal',
    level: 1,
    usage: 'generator',
    traits: ['Magical', 'Starship'],
    description:
      'Solarian-resonant solar crystal embedded into the core generator, projecting stellar plasma energy outward.',
    actionGranted: {
      name: 'Activate — Nova Shield',
      actionsCost: '1-action',
      traits: ['Concentrate', 'Magical', 'Station'],
      description: 'Surrounds the starship in solar flares, granting temporary resistance.',
    },
  },
  {
    id: 'operators-switchboard',
    name: 'Operator\'s Switchboard',
    level: 3,
    usage: 'generator',
    traits: ['Starship', 'Tech'],
    description:
      'A dense array of reinforced breakers and power shunts that allows rapid simultaneous station overclocking.',
    actionGranted: {
      name: 'Activate — Efficient Boost',
      actionsCost: '1-action',
      traits: ['Manipulate', 'Station'],
      description: 'Expend 1 action to apply Boost Battle Station to two different stations.',
    },
  },
  {
    id: 'tractor-beam',
    name: 'Tractor Beam',
    level: 4,
    usage: 'generator',
    traits: ['Starship', 'Tech'],
    description:
      'High-power graviton emitter that draws smaller or equal-sized starships closer along the linear track.',
    actionGranted: {
      name: 'Activate — Pull Starship',
      actionsCost: '1-action',
      traits: ['Attack', 'Manipulate', 'Station'],
      description:
        'Target within sensor range makes a Fortitude save against Crafting DC or is pulled 1–2 zones closer.',
    },
  },
  {
    id: 'primal-shielding',
    name: 'Primal Shielding',
    level: 5,
    usage: 'generator',
    traits: ['Magical', 'Primal', 'Starship'],
    description:
      'An ancient primal seed entwined around the reactor that generates protective biological foliage over the hull.',
    actionGranted: {
      name: 'Reaction — Shielding Foliage',
      actionsCost: 'Reaction',
      traits: ['Magical', 'Station'],
      description: 'Triggered on incoming strike: Deploy dense living bark shields to absorb damage.',
    },
  },

  // --- Pilot's Console Upgrades ---
  {
    id: 'ramming-prow',
    name: 'Ramming Prow',
    level: 1,
    usage: 'pilot',
    traits: ['Starship', 'Tech'],
    description:
      'Reinforced armored prow and kinetic shock absorbers built into the nose of the starship for direct collision.',
    actionGranted: {
      name: 'Activate — Ramming Speed',
      actionsCost: '2-actions',
      traits: ['Move', 'Attack', 'Station'],
      description: 'Drive forward into an enemy in your zone or adjacent zone, inflicting massive kinetic hull damage.',
    },
  },
  {
    id: 'rotational-thrusters',
    name: 'Rotational Thrusters',
    level: 1,
    usage: 'pilot',
    traits: ['Starship', 'Tech'],
    description:
      'Reactionary gyro-thruster pods mounted around the perimeter, allowing instantaneous reversal and tight banking.',
  },
  {
    id: 'powerful-thrusters',
    name: 'Powerful Thrusters',
    level: 1,
    usage: 'pilot',
    traits: ['Starship', 'Tech'],
    description:
      'Oversized ion thrusters configured to safely handle short overclock surges without blowing fuel manifolds.',
    actionGranted: {
      name: 'Activate — Overload Thrusters',
      actionsCost: '1-action',
      traits: ['Move', 'Station'],
      description: 'Temporarily increase the starship\'s speed by +1 or +2 zones for the round.',
    },
  },
  {
    id: 'thasteron-afterburner',
    name: 'Thasteron Afterburner',
    level: 1,
    usage: 'pilot',
    traits: ['Starship', 'Tech'],
    description: 'High-combustion chemical injectors injecting volatile Thasteron fuel into the burn chambers.',
  },
  {
    id: 'solar-thrusters',
    name: 'Solar Thrusters',
    level: 1,
    usage: 'pilot',
    traits: ['Magical', 'Starship'],
    description: 'Crystalline solar sail foils converting stellar radiation directly into sub-light kinetic drift.',
  },
  {
    id: 'nova-prow',
    name: 'Nova Prow',
    level: 3,
    usage: 'pilot',
    traits: ['Magical', 'Starship'],
    description: 'Solarian plasma matrix encasing the forward hull in incandescent solar fury.',
    actionGranted: {
      name: 'Activate — Nova Ram',
      actionsCost: '2-actions',
      traits: ['Fire', 'Attack', 'Station'],
      description: 'Ram an enemy vessel while discharging bursts of stellar fire that blind sensor arrays.',
    },
  },

  // --- Gunnery Upgrades ---
  {
    id: 'secondary-armaments',
    name: 'Secondary Armaments',
    level: 1,
    usage: 'gunnery',
    traits: ['Starship', 'Tech'],
    description: 'Dual-mount mechanical hardpoints allowing the gunner to toggle between two installed weapons.',
  },
  {
    id: 'gunnery-turret-mount',
    name: 'Gunnery Turret Mount',
    level: 1,
    usage: 'gunnery',
    traits: ['Starship', 'Tech'],
    description: 'Mechanic robotic turret cradle that automates tracking routines for designated firing corridors.',
  },
  {
    id: 'munitions-deflection-unit',
    name: 'Munitions Deflection Unit',
    level: 2,
    usage: 'gunnery',
    traits: ['Starship', 'Tech'],
    description: 'Rapid-traverse point-defense cannon linked directly to proximity radar sensors.',
    actionGranted: {
      name: 'Reaction — Deflect Munition',
      actionsCost: 'Reaction',
      traits: ['Attack', 'Station'],
      description: 'Shoot down incoming missile or bomb ordnance before it impacts the primary hull.',
    },
  },
  {
    id: 'ordnance-hinges',
    name: 'Ordnance Hinges',
    level: 3,
    usage: 'gunnery',
    traits: ['Starship', 'Tech'],
    description: 'Heavy hydraulic articulation gears allowing a heavy forward armament to pivot across arcs.',
    actionGranted: {
      name: 'Activate — Rotate Armament',
      actionsCost: '1-action',
      traits: ['Manipulate', 'Station'],
      description: 'Pivot weapon targeting to engage targets in rear or flank blind spots.',
    },
  },
  {
    id: 'starship-weapon-crystal',
    name: 'Starship Weapon Crystal',
    level: 3,
    usage: 'gunnery',
    traits: ['Magical', 'Starship'],
    description: 'Attuned weapon crystal focusing photonic weapon discharges with piercing solar radiance.',
  },

  // --- Scanners Upgrades ---
  {
    id: 'communications-overlay',
    name: 'Communications Overlay',
    level: 1,
    usage: 'scanners',
    traits: ['Starship', 'Tech'],
    description: 'Voice modulators, deepfake visual filters, and signal disguises integrated into Hack Comms.',
  },
  {
    id: 'security-relay',
    name: 'Security Relay',
    level: 1,
    usage: 'scanners',
    traits: ['Starship', 'Tech'],
    description: 'Pairs external sensors with internal corridor security disks to identify boarded intruders.',
    actionGranted: {
      name: 'Activate — Security Scan',
      actionsCost: '1-action',
      traits: ['Concentrate', 'Station'],
      description: 'Perform a targeted internal scan to detect disguised infiltrators aboard your ship.',
    },
  },
  {
    id: 'cloaking-unit',
    name: 'Cloaking Unit',
    level: 8,
    usage: 'scanners',
    traits: ['Starship', 'Tech'],
    description: 'Quantum phase dampeners that bend light and active radar pulses around the hull.',
    actionGranted: {
      name: 'Activate — Cloak Starship',
      actionsCost: '2-actions',
      traits: ['Concentrate', 'Manipulate', 'Station'],
      description: 'Temporarily mask the starship from enemy sensor maps until offensive actions are taken.',
    },
  },

  // --- Drone Console Upgrades ---
  {
    id: 'drone-shield-protocol',
    name: 'Drone Shield Protocol',
    level: 1,
    usage: 'drone',
    traits: ['Starship', 'Tech'],
    description: 'Advanced kinetic barrier firmware strengthening deployed drones against counter-fire.',
    actionGranted: {
      name: 'Activate — Fetch and Fix',
      actionsCost: '1-action',
      traits: ['Manipulate', 'Station'],
      description: 'Command deployed drone to retrieve floating space debris and repair damaged external components.',
    },
  },
  {
    id: 'mine-deployment-shell',
    name: 'Mine Deployment Shell',
    level: 1,
    usage: 'drone',
    traits: ['Starship', 'Tech'],
    description: 'External magnetic rail rack specifically engineered for planting pyrotechnics drone mines.',
    actionGranted: {
      name: 'Activate — Install Mines',
      actionsCost: '1-action',
      traits: ['Manipulate', 'Station'],
      description: 'Arm and deploy a starship mine into the current or adjacent space zone.',
    },
  },
  {
    id: 'pet-drone-shell',
    name: 'Pet Drone Shell',
    level: 3,
    usage: 'drone',
    traits: ['Starship', 'Tech'],
    description: 'A cozy miniature cockpit allowing a Tiny creature companion to helm drone subroutines.',
    actionGranted: {
      name: 'Activate — Onboard Pet',
      actionsCost: 'Free',
      traits: ['Station'],
      description: 'Tiny companion assists station checks, granting circumstance bonuses to drone maneuvers.',
    },
  },

  // --- Magic Conduit Upgrades ---
  {
    id: 'technomancer-magic-module',
    name: 'Technomancer Magic Module',
    level: 1,
    usage: 'magic',
    traits: ['Magical', 'Starship', 'Tech'],
    description: 'Runic microprocessor board connecting spell slots directly into cybernetic overclock registers.',
  },
];

// ---------------------------------------------------------------------------
// 6. HELPER CALCULATION FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Returns the exact official frame stats for a given level (1 to 20).
 */
export function getFrameStats(frameId: FrameId, level: number): FrameLevelStats {
  const table = FRAME_PROGRESSION[frameId] || FRAME_PROGRESSION.explorer;
  const clampedLevel = Math.max(1, Math.min(20, Math.floor(level)));
  return table[clampedLevel] || table[1];
}

/**
 * Returns how many upgrade slots a battle station has at a given ship level:
 * - Level 1: 0 slots
 * - Level 2-4: 1 slot
 * - Level 5-10: 2 slots
 * - Level 11-17: 3 slots
 * - Level 18-20: 4 slots
 */
export function getAvailableUpgradeSlots(shipLevel: number): number {
  if (shipLevel >= 18) return 4;
  if (shipLevel >= 11) return 3;
  if (shipLevel >= 5) return 2;
  if (shipLevel >= 2) return 1;
  return 0;
}

/**
 * Filters the upgrade catalog by station usage and level requirement.
 */
export function getUpgradesForStation(stationType: BattleStationType, shipLevel: number): StationUpgrade[] {
  return STARSHIP_UPGRADES.filter(
    (u) => u.usage === stationType && u.level <= shipLevel
  );
}

/**
 * Creates the default 6 battle stations for a newly selected frame:
 * - Pod 0: Pilot (Fixed, with built-in frame upgrade)
 * - Pod 1: Generator (Fixed, with built-in frame upgrade if Explorer)
 * - Pod 2-5: Customizable Bays (starts with Gunnery + Laser, Scanners, Drone, empty)
 */
export function createDefaultStationsForFrame(frameId: FrameId): InstalledBattleStation[] {
  const info = FRAME_DEFINITIONS[frameId];

  // Pod 0: Pilot
  const pilotStation: InstalledBattleStation = {
    id: 'fixed-pilot',
    slotIndex: 0,
    type: 'pilot',
    isFixed: true,
    fixedUpgradeName: info.fixedUpgradeStation === 'pilot' ? info.fixedUpgradeName : undefined,
    installedUpgrades: [],
  };

  // Pod 1: Generator
  const genStation: InstalledBattleStation = {
    id: 'fixed-generator',
    slotIndex: 1,
    type: 'generator',
    isFixed: true,
    fixedUpgradeName: info.fixedUpgradeStation === 'generator' ? info.fixedUpgradeName : undefined,
    installedUpgrades: [],
  };

  // Pod 2: Gunnery with Light Laser Cannon
  const gunneryStation: InstalledBattleStation = {
    id: 'custom-bay-1',
    slotIndex: 2,
    type: 'gunnery',
    isFixed: false,
    installedWeapon: STARSHIP_WEAPONS.find((w) => w.id === 'light-laser-cannon'),
    installedUpgrades: [],
  };

  // Pod 3: Scanners
  const scannersStation: InstalledBattleStation = {
    id: 'custom-bay-2',
    slotIndex: 3,
    type: 'scanners',
    isFixed: false,
    installedUpgrades: [],
  };

  // Pod 4: Drone Console with Repair Drone
  const droneStation: InstalledBattleStation = {
    id: 'custom-bay-3',
    slotIndex: 4,
    type: 'drone',
    isFixed: false,
    installedDrone: STARSHIP_DRONES.find((d) => d.id === 'repair-drone'),
    installedUpgrades: [],
  };

  // Pod 5: Empty Bay
  const emptyStation: InstalledBattleStation = {
    id: 'custom-bay-4',
    slotIndex: 5,
    type: 'empty',
    isFixed: false,
    installedUpgrades: [],
  };

  return [pilotStation, genStation, gunneryStation, scannersStation, droneStation, emptyStation];
}

/**
 * Creates default PlayerStarshipConfig for a frame.
 */
export function createDefaultPlayerStarship(frameId: FrameId = 'explorer', level: number = 1): PlayerStarshipConfig {
  const stats = getFrameStats(frameId, level);
  return {
    frameId,
    name: 'Player Starship',
    level,
    currentHp: stats.hp,
    currentSp: stats.sp,
    stations: createDefaultStationsForFrame(frameId),
  };
}
