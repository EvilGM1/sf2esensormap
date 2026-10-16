import React, { createContext, useContext, useState, useEffect } from 'react';
import { Starship, ViewMode } from '../types/sensor';

interface SensorContextType {
  sensorRange: number;
  viewMode: ViewMode;
  ships: Starship[];
  selectedShip: Starship | null;
  selectedShipId: string | null;
  setSensorRange: (range: number) => void;
  setViewMode: (mode: ViewMode) => void;
  selectShip: (id: string | null) => void;
  addShip: (ship: Omit<Starship, 'id'>) => void;
  updateShip: (id: string, updates: Partial<Starship>) => void;
  removeShip: (id: string) => void;
  moveShip: (id: string, newSquare: number) => void;
  nudgeShip: (id: string, direction: 'left' | 'right') => void;
  flipShipHeading: (id: string) => void;
  toggleShipHidden: (id: string) => void;
  resetEncounter: () => void;
  loadSampleEncounter: () => void;
  visibleShips: Starship[];
}

const STORAGE_KEY = 'sf2e_sensor_map_state_v1';

const DEFAULT_RANGE = 8;

const INITIAL_SHIPS: Starship[] = [
  {
    id: 'player-primary',
    name: 'Player Starship',
    faction: 'player',
    square: 0,
    heading: 'right',
    hidden: false,
  },
  {
    id: 'npc-enemy-scout',
    name: 'Hostile Scout',
    faction: 'enemy',
    square: 3,
    heading: 'left',
    hidden: false,
  },
  {
    id: 'npc-enemy-fighter',
    name: 'Interceptor (Cloaked)',
    faction: 'enemy',
    square: 5,
    heading: 'left',
    hidden: true,
  },
  {
    id: 'npc-ally-frigate',
    name: 'Allied Patrol',
    faction: 'ally',
    square: 1,
    heading: 'right',
    hidden: false,
  },
];

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
    } catch (e) {
      console.error('Failed to load sensorRange from storage', e);
    }
    return DEFAULT_RANGE;
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.viewMode === 'gm' || parsed.viewMode === 'player') {
          return parsed.viewMode;
        }
      }
    } catch (e) {
      console.error('Failed to load viewMode from storage', e);
    }
    return 'gm';
  });

  const [ships, setShips] = useState<Starship[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.ships)) {
          return parsed.ships;
        }
      }
    } catch (e) {
      console.error('Failed to load ships from storage', e);
    }
    return INITIAL_SHIPS;
  });

  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          sensorRange,
          viewMode,
          ships,
        })
      );
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [sensorRange, viewMode, ships]);

  const setSensorRange = (newRange: number) => {
    const clampedRange = Math.max(3, Math.min(30, newRange));
    setSensorRangeState(clampedRange);
    // Clamp any ships that were beyond the new range
    setShips((prev) =>
      prev.map((ship) => ({
        ...ship,
        square: Math.min(ship.square, clampedRange - 1),
      }))
    );
  };

  const selectShip = (id: string | null) => {
    setSelectedShipId(id);
  };

  const addShip = (newShip: Omit<Starship, 'id'>) => {
    const id = `ship-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const clampedSquare = Math.max(0, Math.min(sensorRange - 1, newShip.square));
    const created: Starship = {
      ...newShip,
      id,
      square: clampedSquare,
    };
    setShips((prev) => [...prev, created]);
    setSelectedShipId(id);
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
  };

  const moveShip = (id: string, newSquare: number) => {
    const clamped = Math.max(0, Math.min(sensorRange - 1, newSquare));
    updateShip(id, { square: clamped });
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
  };

  const flipShipHeading = (id: string) => {
    setShips((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return { ...s, heading: s.heading === 'left' ? 'right' : 'left' };
      })
    );
  };

  const toggleShipHidden = (id: string) => {
    setShips((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return { ...s, hidden: !s.hidden };
      })
    );
  };

  const resetEncounter = () => {
    setShips([
      {
        id: `player-${Date.now()}`,
        name: 'Player Starship',
        faction: 'player',
        square: 0,
        heading: 'right',
        hidden: false,
      },
    ]);
    setSelectedShipId(null);
  };

  const loadSampleEncounter = () => {
    setShips(INITIAL_SHIPS);
    setSensorRangeState(8);
    setSelectedShipId(null);
  };

  // Determine ships visible in current mode:
  // In 'player' view mode, hidden ships are omitted
  // In 'gm' view mode, all ships are visible (with stealth indicator)
  const visibleShips = ships.filter((ship) => {
    if (viewMode === 'player') {
      return !ship.hidden;
    }
    return true;
  });

  const selectedShip = ships.find((s) => s.id === selectedShipId) || null;

  return (
    <SensorContext.Provider
      value={{
        sensorRange,
        viewMode,
        ships,
        selectedShip,
        selectedShipId,
        setSensorRange,
        setViewMode,
        selectShip,
        addShip,
        updateShip,
        removeShip,
        moveShip,
        nudgeShip,
        flipShipHeading,
        toggleShipHidden,
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
