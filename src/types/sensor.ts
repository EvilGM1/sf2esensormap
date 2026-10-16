export type Heading = 'left' | 'right';

export type Faction = 'player' | 'ally' | 'enemy' | 'neutral';

export type ViewMode = 'gm' | 'player';

export interface Starship {
  id: string;
  name: string;
  faction: Faction;
  square: number; // 0 to maxRange - 1
  heading: Heading;
  hidden: boolean; // Scanner simulation: hidden from player view
  notes?: string;
  hullPoints?: number;
  maxHullPoints?: number;
}

export interface SensorConfig {
  sensorRange: number; // Number of zones/squares on map
  viewMode: ViewMode;
}
