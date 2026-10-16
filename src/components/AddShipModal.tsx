import React, { useState } from 'react';
import { useSensor } from '../context/SensorContext';
import { Faction, Heading } from '../types/sensor';
import { X, Plus, EyeOff } from 'lucide-react';

interface AddShipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddShipModal: React.FC<AddShipModalProps> = ({ isOpen, onClose }) => {
  const { addShip, sensorRange } = useSensor();

  const [name, setName] = useState('');
  const [faction, setFaction] = useState<Faction>('enemy');
  const [square, setSquare] = useState<number>(Math.floor(sensorRange / 2));
  const [heading, setHeading] = useState<Heading>('left');
  const [hidden, setHidden] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || `${faction.toUpperCase()} Vessel`;
    addShip({
      name: finalName,
      faction,
      square,
      heading,
      hidden,
    });
    setName('');
    onClose();
  };

  const quickPresets = [
    { label: 'Hostile Fighter', faction: 'enemy' as Faction, heading: 'left' as Heading },
    { label: 'Hostile Cruiser', faction: 'enemy' as Faction, heading: 'left' as Heading },
    { label: 'Allied Escort', faction: 'ally' as Faction, heading: 'right' as Heading },
    { label: 'Neutral Freighter', faction: 'neutral' as Faction, heading: 'left' as Heading },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-void-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-void-950">
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Deploy Starship</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Quick Presets
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {quickPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setName(preset.label);
                    setFaction(preset.faction);
                    setHeading(preset.heading);
                  }}
                  className="text-left py-1.5 px-2.5 rounded bg-void-800 hover:bg-void-700 border border-slate-700/80 text-xs font-mono text-slate-300 transition-colors"
                >
                  + {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ship Name */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Ship Designation / Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Raider Delta, Cargo Tug"
              className="w-full px-3 py-2 bg-void-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono text-sm"
              autoFocus
            />
          </div>

          {/* Faction Selection */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Faction / IFF Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFaction('enemy')}
                className={`py-2 px-2 rounded-lg border font-mono text-xs font-bold transition-all ${
                  faction === 'enemy'
                    ? 'bg-rose-950 border-rose-500 text-rose-300 ring-1 ring-rose-500'
                    : 'bg-void-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                🔴 Enemy
              </button>
              <button
                type="button"
                onClick={() => setFaction('ally')}
                className={`py-2 px-2 rounded-lg border font-mono text-xs font-bold transition-all ${
                  faction === 'ally'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                    : 'bg-void-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                🟢 Ally
              </button>
              <button
                type="button"
                onClick={() => setFaction('neutral')}
                className={`py-2 px-2 rounded-lg border font-mono text-xs font-bold transition-all ${
                  faction === 'neutral'
                    ? 'bg-amber-950 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                    : 'bg-void-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                🟡 Neutral
              </button>
              <button
                type="button"
                onClick={() => setFaction('player')}
                className={`py-2 px-2 rounded-lg border font-mono text-xs font-bold transition-all ${
                  faction === 'player'
                    ? 'bg-sky-950 border-sky-500 text-sky-300 ring-1 ring-sky-500'
                    : 'bg-void-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                🔵 Player
              </button>
            </div>
          </div>

          {/* Heading & Starting Square */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Facing / Heading
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setHeading('left')}
                  className={`py-2 rounded-lg border font-mono text-xs transition-all ${
                    heading === 'left'
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500'
                      : 'bg-void-950 border-slate-800 text-slate-400'
                  }`}
                >
                  ◄ Left
                </button>
                <button
                  type="button"
                  onClick={() => setHeading('right')}
                  className={`py-2 rounded-lg border font-mono text-xs transition-all ${
                    heading === 'right'
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500'
                      : 'bg-void-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Right ►
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Starting Zone (0 - {sensorRange - 1})
              </label>
              <select
                value={square}
                onChange={(e) => setSquare(parseInt(e.target.value, 10))}
                className="w-full py-2 px-3 bg-void-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                {Array.from({ length: sensorRange }, (_, i) => (
                  <option key={i} value={i}>
                    Zone {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scanner Stealth Toggle */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono text-slate-300">
              <input
                type="checkbox"
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
                className="w-4 h-4 rounded bg-void-950 border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <span className="flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                Spawn Cloaked (Hidden from Player Scanners)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-all shadow-lg active:scale-95"
            >
              Deploy Starship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
