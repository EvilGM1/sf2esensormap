import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Starship, ViewMode, ShipSize, Faction } from '../types/sensor';
import { soundManager } from '../utils/audio';
import { tableSync, SyncPayload } from '../utils/sync';

interface SensorContextType {
  totalMapTiles: number; // Total encounter tiles on sensor map (GM controlled)
  playerSensorRange: number; // Player ship's current sensor range (GM controlled, 0 to 15)
  defaultSensorRange: number; // Player ship's baseline/default sensor range (based on ship frame/tech)
  setDefaultSensorRange: (range: number) => void;
  resetSensorRangeToDefault: () => void;
  shipLevel: number; // Player starship level (1 to 20)
  setShipLevel: (level: number) => void;
  viewMode: ViewMode;
  gmPin: string;
  isGmAuthenticated: boolean;
  roomId: string;
  connectedPlayers: number;
  ships: Starship[];
  selectedShip: Starship | null;
  selectedShipId: string | null;
  playerShip: Starship | null;
  audioEnabled: boolean;
  toggleAudio: () => void;
  setTotalMapTiles: (tiles: number) => void;
  setPlayerSensorRange: (range: number) => void;
  shiftTrack: (direction: 'left' | 'right') => void;
  setViewMode: (mode: ViewMode) => void;
  authenticateGm: (pin: string) => boolean;
  lockGmConsole: () => void;
  setGmPin: (pin: string) => void;
  selectShip: (id: string | null) => void;
  addShip: (ship: Omit<Starship, 'id'>) => void;
  updateShip: (id: string, updates: Partial<Starship>) => void;
  removeShip: (id: string) => void;
  moveShip: (id: string, newSquare: number) => void;
  nudgeShip: (id: string, direction: 'left' | 'right') => void;
  flipShipHeading: (id: string) => void;
  toggleShipHidden: (id: string) => void;
  changeShipSize: (id: string, size: ShipSize) => void;
  changeShipFaction: (id: string, faction: Faction) => void;
  resetEncounter: () => void;
  loadSampleEncounter: () => void;
  visibleShips: Starship[];
  activeZoneIndices: number[]; // Zones currently visible based on mode and sensor range
}

const STORAGE_KEY = 'sf2e_sensor_map_state_v3';
const DEFAULT_MAP_TILES = 15;
const DEFAULT_SENSOR_RANGE = 4;
const DEFAULT_PIN = '1234';

const createDefaultEncounter = (totalTiles: number): Starship[] => {
  const center = Math.floor(totalTiles / 2);
  return [
    {
      id: 'player-primary',
      name: 'Player Starship',
      faction: 'player',
      size: 'medium', // In RAW SF2E player ships are Medium
      square: center,
      heading: 'right',
      hidden: false,
    },
    {
      id: 'npc-enemy-scout',
      name: 'Hostile Interceptor',
      faction: 'enemy',
      size: 'small',
      square: Math.min(totalTiles - 1, center + 2),
      heading: 'left',
      hidden: false,
    },
    {
      id: 'npc-enemy-cruiser',
      name: 'Heavy Cruiser',
      faction: 'enemy',
      size: 'huge',
      square: Math.min(totalTiles - 1, center + 3),
      heading: 'left',
      hidden: false,
    },
    {
      id: 'npc-enemy-cloaked',
      name: 'Raider (Cloaked)',
      faction: 'enemy',
      size: 'medium',
      square: Math.min(totalTiles - 1, center + 4),
      heading: 'left',
      hidden: true,
    },
    {
      id: 'npc-ally-corvette',
      name: 'Allied Escort',
      faction: 'ally',
      size: 'large',
      square: Math.max(0, center - 2),
      heading: 'right',
      hidden: false,
    },
  ];
};

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('room');
      if (urlRoom) return urlRoom;
    }
    const saved = localStorage.getItem('sf2e_room_id');
    if (saved) return saved;
    const newRoom = Math.random().toString(36).substring(2, 6).toUpperCase();
    try {
      localStorage.setItem('sf2e_room_id', newRoom);
    } catch (e) {}
    return newRoom;
  });

  const [connectedPlayers, setConnectedPlayers] = useState<number>(0);

  // Total Tiles on Encounter Map (GM controlled)
  const [totalMapTiles, setTotalMapTilesState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.totalMapTiles === 'number' && parsed.totalMapTiles >= 5) {
          return parsed.totalMapTiles;
        }
      }
    } catch (e) {}
    return DEFAULT_MAP_TILES;
  });

  // Player Ship's Sensor Range (GM controlled, 0 to 15)
  const [playerSensorRange, setPlayerSensorRangeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.playerSensorRange === 'number' && parsed.playerSensorRange >= 0) {
          return parsed.playerSensorRange;
        }
      }
    } catch (e) {}
    return DEFAULT_SENSOR_RANGE;
  });

  // Player Ship's Baseline/Default Sensor Range (from ship frame & scanner specs)
  const [defaultSensorRange, setDefaultSensorRangeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.defaultSensorRange === 'number' && parsed.defaultSensorRange >= 0) {
          return parsed.defaultSensorRange;
        }
      }
    } catch (e) {}
    return DEFAULT_SENSOR_RANGE;
  });

  // Starship Level (1 to 20)
  const [shipLevel, setShipLevelState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.shipLevel === 'number' && parsed.shipLevel >= 1) {
          return parsed.shipLevel;
        }
      }
    } catch (e) {}
    return 1;
  });

  const [gmPin, setGmPinState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gmPin) return parsed.gmPin;
      }
    } catch (e) {}
    return DEFAULT_PIN;
  });

  // View Mode: Force 'player' if `?view=player` in URL!
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'player') return 'player';
    }
    return 'player'; // Safe default: start in Player View unless PIN is entered!
  });

  // GM Authentication state: false by default until PIN is successfully entered
  const [isGmAuthenticated, setIsGmAuthenticated] = useState<boolean>(false);

  const [ships, setShips] = useState<Starship[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.ships)) {
          return parsed.ships;
        }
      }
    } catch (e) {}
    return createDefaultEncounter(DEFAULT_MAP_TILES);
  });

  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);

  // Setup PeerJS Table Sync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const isPlayerUrl = params.get('view') === 'player';
    const roomParam = params.get('room');

    if (isPlayerUrl && roomParam) {
      // Player mode: connect to host room
      tableSync.initClient(roomParam, (data: SyncPayload) => {
        setTotalMapTilesState(data.totalMapTiles);
        setPlayerSensorRangeState(data.playerSensorRange);
        if (typeof data.defaultSensorRange === 'number') {
          setDefaultSensorRangeState(data.defaultSensorRange);
        }
        if (typeof data.shipLevel === 'number') {
          setShipLevelState(data.shipLevel);
        }
        setShips(data.ships);
      });
    } else {
      // GM Host: initialize room
      tableSync.initHost(roomId, (count) => {
        setConnectedPlayers(count);
      });
    }

    return () => {
      tableSync.cleanup();
    };
  }, [roomId]);

  // Broadcast state changes if GM host
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    tableSync.broadcastState({
      totalMapTiles,
      playerSensorRange,
      defaultSensorRange,
      shipLevel,
      ships,
    });
  }, [totalMapTiles, playerSensorRange, defaultSensorRange, shipLevel, ships]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          totalMapTiles,
          playerSensorRange,
          defaultSensorRange,
          shipLevel,
          gmPin,
          ships,
        })
      );
    } catch (e) {}
  }, [totalMapTiles, playerSensorRange, defaultSensorRange, shipLevel, gmPin, ships]);

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    soundManager.enabled = next;
    if (next) soundManager.playBeep(980, 0.08);
  };

  const authenticateGm = (pin: string): boolean => {
    if (pin === gmPin) {
      setIsGmAuthenticated(true);
      setViewModeState('gm');
      soundManager.playBeep(1200, 0.1);
      return true;
    }
    soundManager.playBeep(240, 0.2, 'sawtooth');
    return false;
  };

  const lockGmConsole = () => {
    setIsGmAuthenticated(false);
    setViewModeState('player');
    setSelectedShipId(null);
    soundManager.playBeep(500, 0.08);
  };

  const setViewMode = (mode: ViewMode) => {
    if (mode === 'player') {
      setViewModeState('player');
      setSelectedShipId(null);
      soundManager.playBeep(640, 0.05);
    } else {
      if (isGmAuthenticated) {
        setViewModeState('gm');
        soundManager.playBeep(880, 0.05);
      }
    }
  };

  const setGmPin = (pin: string) => {
    setGmPinState(pin);
  };

  const setTotalMapTiles = (newTiles: number) => {
    const clamped = Math.max(5, Math.min(40, newTiles));
    setTotalMapTilesState(clamped);
    setShips((prev) =>
      prev.map((ship) => ({
        ...ship,
        square: Math.min(ship.square, clamped - 1),
      }))
    );
    soundManager.playBeep(750, 0.04);
  };

  const setPlayerSensorRange = (newRange: number) => {
    const clamped = Math.max(0, Math.min(15, newRange));
    setPlayerSensorRangeState(clamped);
    soundManager.playBeep(840, 0.04);
  };

  const setDefaultSensorRange = (newRange: number) => {
    const clamped = Math.max(0, Math.min(15, newRange));
    setDefaultSensorRangeState(clamped);
  };

  const resetSensorRangeToDefault = () => {
    setPlayerSensorRangeState(defaultSensorRange);
    soundManager.playBeep(840, 0.04);
  };

  const setShipLevel = (lvl: number) => {
    const clamped = Math.max(1, Math.min(20, lvl));
    setShipLevelState(clamped);
    soundManager.playBeep(880, 0.04);
  };

  const shiftTrack = (direction: 'left' | 'right') => {
    soundManager.playBeep(600, 0.06);
    setShips((prev) =>
      prev.map((s) => {
        const delta = direction === 'left' ? -1 : 1;
        const target = Math.max(0, Math.min(totalMapTiles - 1, s.square + delta));
        return { ...s, square: target };
      })
    );
  };

  const selectShip = (id: string | null) => {
    setSelectedShipId(id);
    if (id) soundManager.playBeep(840, 0.04);
  };

  const addShip = (newShip: Omit<Starship, 'id'>) => {
    const id = `ship-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const clampedSquare = Math.max(0, Math.min(totalMapTiles - 1, newShip.square));
    const created: Starship = {
      ...newShip,
      size: newShip.faction === 'player' ? 'medium' : newShip.size || 'medium',
      id,
      square: clampedSquare,
    };
    setShips((prev) => [...prev, created]);
    setSelectedShipId(id);
    soundManager.playRadarPulse();
  };

  const updateShip = (id: string, updates: Partial<Starship>) => {
    setShips((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updated = { ...s, ...updates };
        if (typeof updated.square === 'number') {
          updated.square = Math.max(0, Math.min(totalMapTiles - 1, updated.square));
        }
        return updated;
      })
    );
  };

  const removeShip = (id: string) => {
    setShips((prev) => prev.filter((s) => s.id !== id));
    if (selectedShipId === id) {
      setSelectedShipId(null);
    }
    soundManager.playBeep(400, 0.08);
  };

  const moveShip = (id: string, newSquare: number) => {
    const clamped = Math.max(0, Math.min(totalMapTiles - 1, newSquare));
    updateShip(id, { square: clamped });
    soundManager.playBeep(920, 0.04);
  };

  const nudgeShip = (id: string, direction: 'left' | 'right') => {
    setShips((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const delta = direction === 'left' ? -1 : 1;
        const target = Math.max(0, Math.min(totalMapTiles - 1, s.square + delta));
        return { ...s, square: target };
      })
    );
    soundManager.playBeep(880, 0.04);
  };

  const flipShipHeading = (id: string) => {
    setShips((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return { ...s, heading: s.heading === 'left' ? 'right' : 'left' };
      })
    );
    soundManager.playBeep(1100, 0.05);
  };

  const toggleShipHidden = (id: string) => {
    setShips((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return { ...s, hidden: !s.hidden };
      })
    );
    soundManager.playBeep(520, 0.08);
  };

  const changeShipSize = (id: string, size: ShipSize) => {
    updateShip(id, { size });
    soundManager.playBeep(780, 0.04);
  };

  const changeShipFaction = (id: string, faction: Faction) => {
    updateShip(id, { faction });
    soundManager.playBeep(880, 0.04);
  };

  const resetEncounter = () => {
    const center = Math.floor(totalMapTiles / 2);
    setShips([
      {
        id: `player-${Date.now()}`,
        name: 'Player Starship',
        faction: 'player',
        size: 'medium',
        square: center,
        heading: 'right',
        hidden: false,
      },
    ]);
    setSelectedShipId(null);
    soundManager.playRadarPulse();
  };

  const loadSampleEncounter = () => {
    setShips(createDefaultEncounter(totalMapTiles));
    setSelectedShipId(null);
    soundManager.playRadarPulse();
  };

  const playerShip = ships.find((s) => s.faction === 'player') || null;
  const playerSquare = playerShip ? playerShip.square : Math.floor(totalMapTiles / 2);

  // Active zone indices:
  // GM sees all zones: 0 to totalMapTiles - 1
  // Player only sees zones within [playerSquare - playerSensorRange, playerSquare + playerSensorRange]
  const activeZoneIndices = React.useMemo(() => {
    if (viewMode === 'gm') {
      return Array.from({ length: totalMapTiles }, (_, i) => i);
    }
    const minZone = Math.max(0, playerSquare - playerSensorRange);
    const maxZone = Math.min(totalMapTiles - 1, playerSquare + playerSensorRange);
    const indices: number[] = [];
    for (let i = minZone; i <= maxZone; i++) {
      indices.push(i);
    }
    return indices;
  }, [viewMode, totalMapTiles, playerSquare, playerSensorRange]);

  // Visible ships:
  // In GM view: all ships are visible (with cloaked badges)
  // In Player view:
  // 1. Must NOT be cloaked (`!hidden`)
  // 2. Must be within the player ship's sensor range!
  const visibleShips = ships.filter((ship) => {
    if (viewMode === 'player') {
      if (ship.hidden) return false;
      const dist = Math.abs(ship.square - playerSquare);
      if (dist > playerSensorRange) return false;
    }
    return true;
  });

  const selectedShip = ships.find((s) => s.id === selectedShipId) || null;

  return (
    <SensorContext.Provider
      value={{
        totalMapTiles,
        playerSensorRange,
        defaultSensorRange,
        setDefaultSensorRange,
        resetSensorRangeToDefault,
        shipLevel,
        setShipLevel,
        viewMode,
        gmPin,
        isGmAuthenticated,
        roomId,
        connectedPlayers,
        ships,
        selectedShip,
        selectedShipId,
        playerShip,
        audioEnabled,
        toggleAudio,
        setTotalMapTiles,
        setPlayerSensorRange,
        shiftTrack,
        setViewMode,
        authenticateGm,
        lockGmConsole,
        setGmPin,
        selectShip,
        addShip,
        updateShip,
        removeShip,
        moveShip,
        nudgeShip,
        flipShipHeading,
        toggleShipHidden,
        changeShipSize,
        changeShipFaction,
        resetEncounter,
        loadSampleEncounter,
        visibleShips,
        activeZoneIndices,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};

export const useSensor = () => {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error('useSensor must be used within a SensorProvider');
  }
  return context;
};
