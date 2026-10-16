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
  Crosshair,
  Volume2,
  VolumeX,
  Lock,
  SlidersHorizontal,
} from 'lucide-react';

interface HeaderProps {
  onOpenAddShip: () => void;
  onOpenQr: () => void;
  onOpenRules: () => void;
  onOpenBattleStations: () => void;
  onPromptGmPin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddShip,
  onOpenQr,
  onOpenRules,
  onOpenBattleStations,
  onPromptGmPin,
}) => {
  const {
    sensorRange,
    setSensorRange,
    viewMode,
    setViewMode,
    isGmAuthenticated,
    audioEnabled,
    toggleAudio,
    resetEncounter,
    loadSampleEncounter,
  } = useSensor();

  const [showConfigMenu, setShowConfigMenu] = useState(false);

  const isGm = viewMode === 'gm';

  const handleGmModeClick = () => {
    if (!isGmAuthenticated) {
      onPromptGmPin();
    } else {
      setViewMode('gm');
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-void-950/95 border-b border-slate-800/90 backdrop-blur-md px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Brand & Radar Scope */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="relative p-1.5 rounded-lg bg-cyan-950/70 border border-cyan-500/50 text-cyan-400 flex items-center justify-center">
            <Radar className="w-5 h-5 animate-spin text-cyan-400" style={{ animationDuration: '8s' }} />
            <span className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300 top-1 right-1 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-extrabold text-xs sm:text-base tracking-wider text-slate-100 font-mono">
                SF2E SENSOR MAP
              </h1>
              <span className="hidden sm:inline-block text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                1420.4 MHz
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
              <span>SCANNER CORE ACTIVE</span>
              <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
            </p>
          </div>
        </div>

        {/* Center: View Switcher (GM Mode with PIN lock vs Player View) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-void-900 border border-slate-800 rounded-lg">
            <button
              onClick={handleGmModeClick}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                isGm
                  ? 'bg-cyan-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full GM controls (Requires PIN)"
            >
              {isGmAuthenticated ? <Shield className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden sm:inline">GM Mode</span>
              <span className="sm:hidden">GM</span>
            </button>

            <button
              onClick={() => setViewMode('player')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                !isGm
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Player view: masked cloaked vessels"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Player View</span>
              <span className="sm:hidden">Player</span>
            </button>
          </div>

          {/* Stepper for Max Sensor Range in GM mode */}
          {isGm && (
            <div className="hidden lg:flex items-center gap-1 bg-void-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono">
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
                disabled={sensorRange >= 30}
                className="w-5 h-5 flex items-center justify-center rounded bg-void-950 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold border border-slate-800"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Audio Synthesizer Beeps Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-1.5 rounded-lg border transition-colors ${
              audioEnabled
                ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300'
                : 'bg-void-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={audioEnabled ? 'Mute Station Scanner Audio' : 'Enable Station Scanner SFX'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Battle Stations & Actions Checklist */}
          <button
            onClick={onOpenBattleStations}
            className="flex items-center gap-1 py-1.5 px-2 sm:px-2.5 rounded-lg bg-void-900 hover:bg-void-800 border border-slate-800 text-cyan-400 font-mono text-xs transition-colors"
            title="Battle Stations & Starship Actions"
          >
            <Crosshair className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Stations</span>
          </button>

          {/* Deploy Ship (GM Mode only) */}
          {isGm && (
            <button
              onClick={onOpenAddShip}
              className="flex items-center gap-1 py-1.5 px-2.5 sm:px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Deploy</span>
            </button>
          )}

          {/* Table Connect QR Modal */}
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

          {/* Settings Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowConfigMenu(!showConfigMenu)}
              className="p-1.5 rounded-lg bg-void-900 hover:bg-void-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Encounter Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {showConfigMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-void-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs font-mono">
                {/* Mobile Sensor Range adjustment */}
                <div className="p-2 border-b border-slate-800 lg:hidden">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-400">Sensor Range:</span>
                    <span className="font-bold text-cyan-400">{sensorRange}</span>
                  </div>
                  <div className="flex gap-1 justify-between">
                    {[5, 7, 9, 11, 15].map((preset) => (
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
                      if (window.confirm('Reset combat map to empty state with only Player ship centered?')) {
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
