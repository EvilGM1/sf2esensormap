export type Heading = 'left' | 'right';

export type Faction = 'player' | 'ally' | 'enemy' | 'neutral';

export type ShipSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan' | 'colossal';

export type ViewMode = 'gm' | 'player';

export type BattleStationType =
  | 'pilot'
  | 'gunnery'
  | 'generator'
  | 'scanners'
  | 'drone'
  | 'magic';

export interface Starship {
  id: string;
  name: string;
  faction: Faction;
  size: ShipSize;
  square: number; // 0 to totalMapTiles - 1
  heading: Heading;
  hidden: boolean; // Scanner simulation: cloaked from player view
  notes?: string;
  hullPoints?: number;
  maxHullPoints?: number;
}

export interface SensorConfig {
  totalMapTiles: number; // Total zones on encounter map (GM controlled)
  playerSensorRange: number; // Sensor range of player ship (GM controlled)
  defaultSensorRange?: number; // Player ship default baseline sensor range
  viewMode: ViewMode;
  gmPin: string;
}
