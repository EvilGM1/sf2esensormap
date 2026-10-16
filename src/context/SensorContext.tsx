import React, { createContext, useContext, useState, useEffect } from 'react';
import { Starship, ViewMode, ShipSize } from '../types/sensor';
import { soundManager } from '../utils/audio';

interface SensorContextType {
  sensorRange: number;
  viewMode: ViewMode;
  gmPin: string;
  isGmAuthenticated: boolean;
  ships: Starship[];
  selectedShip: Starship | null;
  selectedShipId: string | null;
  playerShip: Starship | null;
  audioEnabled: boolean;
  toggleAudio: () => void;
  setSensorRange: (range: number) => void;
  shiftTrack: (direction: 'left' | 'right') => void;
  setViewMode: (mode: ViewMode) => void;
  authenticateGm: (pin: string) => boolean;
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
  resetEncounter: () => void;
  loadSampleEncounter: () => void;
  visibleShips: Starship[];
}

const STORAGE_KEY = 'sf2e_sensor_map_state_v2';
const DEFAULT_RANGE = 9; // Odd number allows exact center zone (zone 4)
const DEFAULT_PIN = '1234';

const createDefaultEncounter = (range: number): Starship[] => {
  const center = Math.floor(range / 2);
  return [
    {
      id: 'player-primary',
      name: 'Player Starship',
      faction: 'player',
      size: 'medium',
      square: center, // Spawned right in the middle!
      heading: 'right',
      hidden: false,
    },
    {
      id: 'npc-enemy-scout',
      name: 'Hostile Interceptor',
      faction: 'enemy',
      size: 'small',
      square: Math.min(range - 1, center + 2),
      heading: 'left',
      hidden: false,
    },
    {
      id: 'npc-enemy-cruiser',
      name: 'Cruiser (Cloaked)',
      faction: 'enemy',
      size: 'huge',
      square: Math.min(range - 1, center + 3),
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
  const [sensorRange, setSensorRangeState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.sensorRange === 'number' && parsed.sensorRange >= 3) {
          return parsed.sensorRange;
        }
      }
    } catch (e) {}
    return DEFAULT_RANGE;
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

  // Check URL query param: if `?view=player`, force player mode!
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'player') return 'player';
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.viewMode === 'gm' || parsed.viewMode === 'player') {
          return parsed.viewMode;
        }
      }
    } catch (e) {}
    return 'gm';
  });

  const [isGmAuthenticated, setIsGmAuthenticated] = useState<boolean>(() => {
    // If opened directly as GM without url query, default to authenticated on local machine
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'player') return false;
    }
    return true;
  });

  const [ships, setShips] = useState<Starship[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.ships)) {
          return parsed.ships.map((s: Starship) => ({
            ...s,
            size: s.size || 'medium',
          }));
        }
      }
    } catch (e) {}
    return createDefaultEncounter(DEFAULT_RANGE);
  });

  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);

  // Sync to storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          sensorRange,
          viewMode,
          gmPin,
          ships,
        })
      );
    } catch (e) {}
  }, [sensorRange, viewMode, gmPin, ships]);

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

  const setSensorRange = (newRange: number) => {
    const clampedRange = Math.max(3, Math.min(30, newRange));
    setSensorRangeState(clampedRange);
    setShips((prev) =>
      prev.map((ship) => ({
        ...ship,
        square: Math.min(ship.square, clampedRange - 1),
      }))
    );
    soundManager.playBeep(750, 0.04);
  };

  // Shift entire map left or right (spawning/scrolling zones dynamically!)
  const shiftTrack = (direction: 'left' | 'right') => {
    soundManager.playBeep(600, 0.06);
    setShips((prev) =>
      prev.map((s) => {
        const delta = direction === 'left' ? -1 : 1;
        const target = Math.max(0, Math.min(sensorRange - 1, s.square + delta));
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
    const clampedSquare = Math.max(0, Math.min(sensorRange - 1, newShip.square));
    const created: Starship = {
      ...newShip,
      size: newShip.size || 'medium',
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
          updated.square = Math.max(0, Math.min(sensorRange - 1, updated.square));
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
    const clamped = Math.max(0, Math.min(sensorRange - 1, newSquare));
    updateShip(id, { square: clamped });
    soundManager.playBeep(920, 0.04);
  };

  const nudgeShip = (id: string, direction: 'left' | 'right') => {
    setShips((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const delta = direction === 'left' ? -1 : 1;
        const target = Math.max(0, Math.min(sensorRange - 1, s.square + delta));
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

  const resetEncounter = () => {
    const center = Math.floor(sensorRange / 2);
    setShips([
      {
        id: `player-${Date.now()}`,
        name: 'Player Starship',
        faction: 'player',
        size: 'medium',
        square: center, // Spawned right in center!
        heading: 'right',
        hidden: false,
      },
    ]);
    setSelectedShipId(null);
    soundManager.playRadarPulse();
  };

  const loadSampleEncounter = () => {
    setShips(createDefaultEncounter(sensorRange));
    setSelectedShipId(null);
    soundManager.playRadarPulse();
  };

  const visibleShips = ships.filter((ship) => {
    if (viewMode === 'player') {
      return !ship.hidden;
    }
    return true;
  });

  const selectedShip = ships.find((s) => s.id === selectedShipId) || null;
  const playerShip = ships.find((s) => s.faction === 'player') || null;

  return (
    <SensorContext.Provider
      value={{
        sensorRange,
        viewMode,
        gmPin,
        isGmAuthenticated,
        ships,
        selectedShip,
        selectedShipId,
        playerShip,
        audioEnabled,
        toggleAudio,
        setSensorRange,
        shiftTrack,
        setViewMode,
        authenticateGm,
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
        resetEncounter,
        loadSampleEncounter,
        visibleShips,
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
