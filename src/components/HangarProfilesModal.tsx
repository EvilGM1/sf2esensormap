import React, { useState } from 'react';
import { useSensor } from '../context/SensorContext';
import { FRAME_DEFINITIONS } from '../data/starshipData';
import {
  X,
  Bookmark,
  Upload,
  Trash2,
  Rocket,
  Check,
  Copy,
  Database,
} from 'lucide-react';

interface HangarProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HangarProfilesModal: React.FC<HangarProfilesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    shipConfig,
    savedProfiles,
    saveShipProfile,
    loadShipProfile,
    deleteShipProfile,
    exportRoomData,
    importRoomData,
  } = useSensor();

  const [profileName, setProfileName] = useState('');
  const [copied, setCopied] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveShipProfile(profileName);
    setProfileName('');
  };

  const handleCopyJson = () => {
    const json = exportRoomData();
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportSubmit = () => {
    setImportError('');
    const success = importRoomData(importJson);
    if (success) {
      setShowImportBox(false);
      setImportJson('');
      onClose();
    } else {
      setImportError('Invalid backup data format. Please verify JSON string.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-void-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-void-950">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-100 font-mono text-sm uppercase">
              Starship Hangar & Room Presets
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-5 font-mono text-xs">
          {/* Section 1: Save Current Build */}
          <div className="p-3.5 rounded-xl bg-void-950 border border-slate-800">
            <span className="text-slate-400 block mb-2 font-bold uppercase tracking-wide flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              <span>Save Current Starship Configuration:</span>
            </span>
            <form onSubmit={handleSaveProfile} className="flex gap-2">
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder={`e.g. ${shipConfig.name} (${FRAME_DEFINITIONS[shipConfig.frameId].name} Tier ${shipConfig.level})`}
                className="flex-1 bg-void-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow flex items-center gap-1"
              >
                <span>Save</span>
              </button>
            </form>
            <p className="text-[10px] text-slate-500 mt-2">
              Auto-saved locally for this room. Saving a named profile allows you to deploy it anytime without rebuilding.
            </p>
          </div>

          {/* Section 2: Saved Hangar Fleet */}
          <div>
            <label className="text-slate-400 block mb-2 font-bold uppercase tracking-wide flex items-center justify-between">
              <span>Hangar Bay ({savedProfiles.length} Saved Ships):</span>
            </label>

            {savedProfiles.length === 0 ? (
              <div className="p-6 text-center rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                No saved starships in hangar yet. Save your current ship above to store it permanently!
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {savedProfiles.map((profile) => {
                  const frameInfo = FRAME_DEFINITIONS[profile.config.frameId];
                  return (
                    <div
                      key={profile.id}
                      className="p-3 rounded-xl bg-void-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-slate-100 truncate">{profile.name}</strong>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950 border border-sky-500/40 text-sky-300 font-bold uppercase">
                            {frameInfo.name} Tier {profile.config.level}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Saved: {new Date(profile.savedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => {
                            loadShipProfile(profile.id);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-bold text-[11px] flex items-center gap-1 transition-all"
                          title="Deploy this starship to active bridge console"
                        >
                          <Rocket className="w-3 h-3" />
                          <span>Deploy</span>
                        </button>
                        <button
                          onClick={() => deleteShipProfile(profile.id)}
                          className="p-1.5 rounded hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 transition-colors"
                          title="Delete saved starship"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Room Backup / Export / Import */}
          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-slate-400 block mb-2 font-bold uppercase tracking-wide flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Session Backup & Table Transfer:</span>
            </span>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopyJson}
                className="flex-1 py-2 px-3 rounded-xl bg-void-950 hover:bg-void-800 border border-slate-700 text-slate-200 text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Room Backup (JSON)'}</span>
              </button>

              <button
                onClick={() => setShowImportBox(!showImportBox)}
                className="py-2 px-3 rounded-xl bg-void-950 hover:bg-void-800 border border-slate-700 text-slate-200 text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Import Backup</span>
              </button>
            </div>

            {showImportBox && (
              <div className="mt-3 p-3 rounded-xl bg-void-950 border border-amber-500/40 space-y-2">
                <span className="text-amber-300 font-bold block text-[11px]">
                  Paste Room Backup JSON:
                </span>
                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder="Paste exported room backup JSON string here..."
                  rows={3}
                  className="w-full bg-void-900 border border-slate-700 rounded-lg p-2 text-[11px] text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                />
                {importError && (
                  <p className="text-rose-400 text-[10px]">{importError}</p>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowImportBox(false)}
                    className="px-2.5 py-1 rounded text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportSubmit}
                    className="px-3.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs"
                  >
                    Restore Room
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-slate-800 bg-void-950 font-mono text-xs">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
