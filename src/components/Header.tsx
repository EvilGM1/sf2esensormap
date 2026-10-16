import React, { useState } from 'react';
import { useSensor } from '../context/SensorContext';
import {
  Radar,
  Plus,
  QrCode,
  RotateCcw,
  BookOpen,
  Sliders,
  Shield,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

interface HeaderProps {
  onOpenAddShip: () => void;
  onOpenQr: () => void;
  onOpenRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddShip,
  onOpenQr,
  onOpenRules,
}) => {
  const {
    sensorRange,
    setSensorRange,
    viewMode,
    setViewMode,
    resetEncounter,
    loadSampleEncounter,
  } = useSensor();

  const [showConfigMenu, setShowConfigMenu] = useState(false);

  const isGm = viewMode === 'gm';

  return (
    <header className="sticky top-0 z-30 w-full bg-void-950/95 border-b border-slate-800/90 backdrop-blur-md px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Radar */}
        <div className="flex items-center gap-2.5">
          <div className="relative p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <Radar className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base tracking-wider text-slate-100 font-mono">
                SF2E SENSOR MAP
              </h1>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                Tech Core
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Tactical Starship Spatial Tracker
            </p>
          </div>
        </div>

        {/* Center: Sensor Range Stepper & GM / Player View Switcher */}
        <div className="flex items-center gap-2">
          {/* View Mode Switcher Toggle */}
          <div className="flex items-center p-0.5 bg-void-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('gm')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                isGm
                  ? 'bg-cyan-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full GM tactical control and cloaked ship tracking"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>GM Mode</span>
            </button>
            <button
              onClick={() => setViewMode('player')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                !isGm
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Player view: only detected contacts are visible"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Player View</span>
            </button>
          </div>

          {/* Sensor Range Stepper (GM Mode only or compact) */}
          {isGm && (
            <div className="hidden md:flex items-center gap-1 bg-void-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono">
              <span className="text-slate-400">Sensor Range:</span>
              <button
                onClick={() => setSensorRange(sensorRange - 1)}
                disabled={sensorRange <= 3}
                className="w-5 h-5 flex items-center justify-center rounded bg-void-950 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold border border-slate-800"
              >
                -
              </button>
              <span className="font-bold text-cyan-400 px-1">{sensorRange}</span>
              <button
                onClick={() => setSensorRange(sensorRange + 1)}
                disabled={sensorRange >= 25}
                className="w-5 h-5 flex items-center justify-center rounded bg-void-950 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold border border-slate-800"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Add Ship Button (GM Mode) */}
          {isGm && (
            <button
              onClick={onOpenAddShip}
              className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Deploy Ship</span>
            </button>
          )}

          {/* Connect / Share QR Code Modal */}
          <button
            onClick={onOpenQr}
            className="p-1.5 rounded-lg bg-void-900 hover:bg-void-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Table Connect (QR Code & Link)"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Rules Quick Ref */}
          <button
            onClick={onOpenRules}
            className="p-1.5 rounded-lg bg-void-900 hover:bg-void-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Starfinder 2e Sensor Map Rules Summary"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
          </button>

          {/* Settings / Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowConfigMenu(!showConfigMenu)}
              className="p-1.5 rounded-lg bg-void-900 hover:bg-void-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Encounter Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showConfigMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-void-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs font-mono">
                {/* Mobile Sensor Range adjustment */}
                <div className="p-2 border-b border-slate-800 md:hidden">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-400">Max Sensor Range:</span>
                    <span className="font-bold text-cyan-400">{sensorRange}</span>
                  </div>
                  <div className="flex gap-1 justify-between">
                    {[5, 8, 10, 12, 15].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          setSensorRange(preset);
                          setShowConfigMenu(false);
                        }}
                        className={`flex-1 py-1 rounded text-center border ${
                          sensorRange === preset
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                            : 'bg-void-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      loadSampleEncounter();
                      setShowConfigMenu(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-void-800 text-slate-300 transition-colors text-left"
                  >
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>Load Demo Encounter</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Reset combat map to empty state with only Player ship?')) {
                        resetEncounter();
                        setShowConfigMenu(false);
                      }
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-950/40 text-rose-400 transition-colors text-left"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-400" />
                    <span>Reset Encounter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
