import { BattleStationType, ShipSize } from './sensor';

export type FrameId = 'bulwark' | 'explorer' | 'skirmisher';

export interface FrameBaseInfo {
  id: FrameId;
  name: string;
  size: ShipSize;
  description: string;
  defaultSensorRange: number;
  fixedUpgradeName: string;
  fixedUpgradeStation: BattleStationType;
  baysCount: number;
}

export interface FrameLevelStats {
  level: number;
  hp: number;
  sp: number;
  ac: number;
  fort: number;
  ref: number;
  will: number;
  speed: number; // in zones
}

export interface StarshipWeapon {
  id: string;
  name: string;
  category: 'simple' | 'martial' | 'advanced';
  damageDice: string; // e.g. "1d8"
  damageType: string; // e.g. "Fire", "Piercing", "Acid", "Electricity", "Bludgeoning"
  rangeZones: number; // range in linear zones (e.g. 2, 3, 4, 5, 6)
  traits: string[]; // e.g. ["Tech", "Agile", "Analog", "Ordnance", "Concussive"]
  description: string;
}

export interface StarshipDrone {
  id: string;
  name: string;
  role: string;
  description: string;
  actionsGranted: string[];
}

export interface StationUpgrade {
  id: string;
  name: string;
  level: number;
  usage: BattleStationType;
  traits: string[]; // e.g. ["Starship", "Tech"] or ["Starship", "Magical"]
  description: string;
  actionGranted?: {
    name: string;
    actionsCost: string; // e.g. "1-action", "2-actions", "Reaction"
    traits: string[];
    description: string;
  };
}

export interface InstalledBattleStation {
  id: string; // e.g. "pod-1", "pod-2", "pod-3", etc.
  slotIndex: number; // 0 to 5
  type: BattleStationType | 'empty';
  isFixed: boolean;
  fixedUpgradeName?: string;
  installedWeapon?: StarshipWeapon;
  installedDrone?: StarshipDrone;
  installedUpgrades: StationUpgrade[];
}

export interface PlayerStarshipConfig {
  frameId: FrameId;
  name: string;
  level: number; // 1 to 20
  currentHp: number;
  currentSp: number;
  stations: InstalledBattleStation[]; // 6 slots: 0 and 1 are fixed frame stations, 2-5 are customizable
  notes?: string;
}

export interface SavedShipProfile {
  id: string;
  name: string;
  savedAt: string;
  config: PlayerStarshipConfig;
}

export interface RoomBackupPayload {
  version: string;
  savedAt: string;
  totalMapTiles: number;
  playerSensorRange: number;
  defaultSensorRange: number;
  shipLevel: number;
  shipConfig: PlayerStarshipConfig;
  savedProfiles: SavedShipProfile[];
}
