import React from 'react';
import { X, BookOpen, Compass, ShieldAlert, Eye } from 'lucide-react';

interface RulesQuickRefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesQuickRefModal: React.FC<RulesQuickRefModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-void-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-void-950">
          <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm font-mono">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>SF2E Tech Core — Sensor Rules Quick Reference</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono text-slate-300">
          {/* Section 1 */}
          <div className="bg-void-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-xs">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>1. Linear Sensor Map & Range</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Tactical space combat in Starfinder 2e abstracts vast distances onto a linear sequence of zones (squares). Distance between any two vessels is the difference between their zone numbers. Max Sensor Range determines how far ahead your sensors reach.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-void-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>2. Headings & Off-Guard Flanking</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Every starship maintains a <strong>Heading</strong>: pointing either <strong>Left (◄)</strong> or <strong>Right (►)</strong>. 
            </p>
            <div className="p-2 rounded bg-amber-950/40 border border-amber-500/30 text-amber-200">
              <strong>Off-Guard Rule:</strong> A starship is <em>Off-Guard</em> (-2 to AC) against attacks originating from behind its current heading! Pilots can fly past enemies and turn around to exploit this blind spot.
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-void-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-xs">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>3. Scanner Simulation (Fog of War)</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              The GM can mark ships as <strong>Cloaked / Hidden</strong> (👁️‍🗨️). In <em>GM Mode</em>, hidden ships are visible with a purple stealth badge. When switched to <em>Player View</em>, cloaked vessels vanish from the map until detected by successful scanner actions!
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-void-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-100 text-xs">
              4. Vessel IFF Faction Codes
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 p-1.5 rounded bg-sky-950/60 border border-sky-500/30 text-sky-200">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span>Player Vessel (Blue)</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Allied Ships (Green)</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded bg-rose-950/60 border border-rose-500/30 text-rose-200">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Enemy Ships (Red)</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-200">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Neutral Ships (Yellow)</span>
              </div>
            </div>
          </div>

          {/* Section 5: Legal & Community Use */}
          <div className="bg-void-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-[10px] text-slate-400">
            <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
              <span>5. Legal & Paizo Community Use Policy</span>
            </h4>
            <p className="leading-relaxed">
              This application uses trademarks and/or copyrights owned by Paizo Inc., used under Paizo&apos;s Community Use Policy (<a href="https://paizo.com/communityuse" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">paizo.com/communityuse</a>). We are expressly prohibited from charging you to use or access this content. This application is not published, endorsed, or specifically approved by Paizo. For more information about Paizo Inc. and Paizo products, please visit <a href="https://paizo.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">paizo.com</a>.
            </p>
            <p className="leading-relaxed text-slate-500">
              Starfinder, Starfinder Second Edition, and Pathfinder are registered trademarks or trademarks of Paizo Inc. All rules mechanics are governed under the Open RPG Creative (ORC) License and/or Open Game License (OGL v1.0a).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-void-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-void-800 hover:bg-void-700 text-slate-200 text-xs font-mono transition-colors"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
};
