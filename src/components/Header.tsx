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
  LockKeyhole,
  Users,
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
    totalMapTiles,
    setTotalMapTiles,
    playerSensorRange,
    setPlayerSensorRange,
    defaultSensorRange,
    resetSensorRangeToDefault,
    viewMode,
    setViewMode,
    isGmAuthenticated,
    lockGmConsole,
    roomId,
    connectedPlayers,
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
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 font-bold tracking-wider shadow-sm">
                v1.0 UAT
              </span>
              <span className="hidden sm:inline-block text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                Room: {roomId}
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
              <span>SCANNER CORE ACTIVE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              {connectedPlayers > 0 && (
                <span className="text-emerald-400 font-bold flex items-center gap-1 ml-1">
                  <Users className="w-3 h-3" />
                  <span>{connectedPlayers} Synced</span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Center: Controls for GM vs Player and Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
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
              title="Player view: only detected contacts are visible"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Player View</span>
              <span className="sm:hidden">Player</span>
            </button>
          </div>

          {/* GM Controls: Total Zones and Player Sensor Range */}
          {isGm ? (
            <div className="hidden lg:flex items-center gap-3">
              {/* Total Zones */}
              <div className="flex items-center gap-1 bg-void-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono">
                <span className="text-slate-400">Total Zones:</span>
                <button
                  onClick={() => setTotalMapTiles(totalMapTiles - 1)}
                  disabled={totalMapTiles <= 5}
                  className="w-5 h-5 flex items-center justify-center rounded bg-void-950 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold border border-slate-800"
                >
                  -
                </button>
                <span className="font-bold text-cyan-400 px-1">{totalMapTiles}</span>
                <button
                  onClick={() => setTotalMapTiles(totalMapTiles + 1)}
                  disabled={totalMapTiles >= 40}
                  className="w-5 h-5 flex items-center justify-center rounded bg-void-950 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold border border-slate-800"
                >
                  +
                </button>
              </div>

              {/* Player Sensor Range (GM Controlled, down to 0) */}
              <div className="flex items-center gap-1 bg-void-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono">
                <span className="text-slate-400">Player Sensor Rng:</span>
                <button
                  onClick={() => setPlayerSensorRange(playerSensorRange - 1)}
                  disabled={playerSensorRange <= 0}
                  className="w-5 h-5 flex items-center justify-center rounded bg-void-950 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold border border-slate-800"
                >
                  -
                </button>
                <span className={`font-bold px-1 ${playerSensorRange === 0 ? 'text-rose-400' : 'text-sky-400'}`}>
                  {playerSensorRange === 0 ? '0 (BLIND)' : playerSensorRange}
                </span>
                <button
                  onClick={() => setPlayerSensorRange(playerSensorRange + 1)}
                  disabled={playerSensorRange >= 15}
                  className="w-5 h-5 flex items-center justify-center rounded bg-void-950 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold border border-slate-800"
                >
                  +
                </button>
                {playerSensorRange !== defaultSensorRange && (
                  <button
                    onClick={resetSensorRangeToDefault}
                    className="ml-1 px-1.5 py-0.5 rounded text-[10px] text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 flex items-center gap-1 transition-colors border border-amber-500/40"
                    title={`Reset back to default sensor range (${defaultSensorRange} Zones)`}
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Default ({defaultSensorRange})</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Player View: Read-only sensor range readout */
            <div className="hidden md:flex items-center gap-1.5 bg-void-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono">
              <span className="text-slate-400">Sensor Range:</span>
              <span className={`font-bold ${playerSensorRange === 0 ? 'text-rose-400' : 'text-sky-400'}`}>
                {playerSensorRange === 0 ? '0 Zones (Offline)' : `${playerSensorRange} Zones`}
              </span>
            </div>
          )}

          {/* Lock GM Console button if currently authenticated */}
          {isGm && isGmAuthenticated && (
            <button
              onClick={lockGmConsole}
              className="p-1.5 rounded-lg bg-void-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-colors"
              title="Lock GM Console (Switch to Player View)"
            >
              <LockKeyhole className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Audio Beeps Toggle */}
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
            title="Table Connect (QR Code & Live Sync)"
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
              <div className="absolute right-0 mt-2 w-60 rounded-xl bg-void-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs font-mono">
                {/* Mobile Sensor Range adjustment */}
                <div className="p-2 border-b border-slate-800 md:hidden">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-400">My Sensor Range:</span>
                    <span className="font-bold text-sky-400">{playerSensorRange}</span>
                  </div>
                  <div className="flex gap-1 justify-between">
                    {[2, 3, 4, 5, 6].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          setPlayerSensorRange(preset);
                          setShowConfigMenu(false);
                        }}
                        className={`flex-1 py-1 rounded text-center border ${
                          playerSensorRange === preset
                            ? 'bg-sky-950 border-sky-500 text-sky-300 font-bold'
                            : 'bg-void-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  {playerSensorRange !== defaultSensorRange && (
                    <button
                      onClick={() => {
                        resetSensorRangeToDefault();
                        setShowConfigMenu(false);
                      }}
                      className="w-full mt-2 py-1 px-2 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 flex items-center justify-center gap-1.5 text-[11px] hover:bg-amber-900/50"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to Default ({defaultSensorRange} Zones)</span>
                    </button>
                  )}
                </div>

                {/* GM Total Map Tiles adjustment on mobile */}
                {isGm && (
                  <div className="p-2 border-b border-slate-800 lg:hidden">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-slate-400">Total Map Tiles:</span>
                      <span className="font-bold text-cyan-400">{totalMapTiles}</span>
                    </div>
                    <div className="flex gap-1 justify-between">
                      {[10, 15, 20, 25].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => {
                            setTotalMapTiles(preset);
                            setShowConfigMenu(false);
                          }}
                          className={`flex-1 py-1 rounded text-center border ${
                            totalMapTiles === preset
                              ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                              : 'bg-void-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
