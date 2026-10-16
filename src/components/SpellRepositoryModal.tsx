import React, { useState } from 'react';
import { MAGIC_CONDUIT_SPELL_REPOSITORY } from '../data/starshipData';
import {
  X,
  Sparkles,
  Zap,
  Shield,
  Heart,
  Target,
  Crosshair,
  BookOpen,
} from 'lucide-react';

interface SpellRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpellRepositoryModal: React.FC<SpellRepositoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTradition, setSelectedTradition] = useState<string>('all');

  if (!isOpen) return null;

  const traditions = ['all', 'Arcane', 'Divine', 'Occult', 'Primal'];

  const filteredSpells =
    selectedTradition === 'all'
      ? MAGIC_CONDUIT_SPELL_REPOSITORY
      : MAGIC_CONDUIT_SPELL_REPOSITORY.filter((s) =>
          s.traditions.some(
            (t) => t.toLowerCase() === selectedTradition.toLowerCase()
          )
        );

  const getSpellIcon = (id: string) => {
    switch (id) {
      case 'cosmic-cannon':
        return <Crosshair className="w-4 h-4 text-rose-400" />;
      case 'cosmic-bombardment':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'cosmic-fortification':
        return <Shield className="w-4 h-4 text-cyan-400" />;
      case 'cosmic-repairs':
        return <Heart className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-void-900 border border-purple-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-mono">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-void-950">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-950/80 border border-purple-500/50 text-purple-300">
              <Sparkles className="w-4 h-4 animate-pulse text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-100 uppercase tracking-wide">
                  Magic Conduit — Spell Repository
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 font-bold">
                  Tech Core pg. 181
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Official Starship Spells Available to Manned Magic Conduit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Repository Overview Note */}
        <div className="px-5 py-3 bg-purple-950/20 border-b border-purple-500/20 text-xs text-purple-200/90 leading-relaxed flex items-start gap-2.5">
          <BookOpen className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p>
              <strong>The Spell Repository:</strong> When you helm a Magic Conduit, you can cast these starship spells by expending personal spell slots (or using cantrips). All 4 spells belong to the <strong>Arcane, Divine, Occult, and Primal</strong> traditions.
            </p>
            <p className="text-[11px] text-purple-300/70 mt-1">
              • Uses your own spell attack modifier and spell DC • Range is your starship’s <strong>Sensor Range</strong>
            </p>
          </div>
        </div>

        {/* Tradition Filter Tabs */}
        <div className="px-5 py-2.5 bg-void-950/60 border-b border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400">Filter Tradition:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {traditions.map((trad) => (
              <button
                key={trad}
                onClick={() => setSelectedTradition(trad)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  selectedTradition === trad
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-void-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {trad === 'all' ? 'All Traditions (4)' : trad}
              </button>
            ))}
          </div>
        </div>

        {/* Spell Cards List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {filteredSpells.map((spell) => (
            <div
              key={spell.id}
              className="p-4 rounded-xl bg-void-950/90 border border-purple-500/30 hover:border-purple-500/60 transition-all shadow-md"
            >
              {/* Spell Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-2 border-b border-slate-800/80 gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-void-900 border border-slate-700">
                    {getSpellIcon(spell.id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm text-slate-100">
                        {spell.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                        {spell.isCantrip ? 'Cantrip 1' : `Spell Rank ${spell.rank}`}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-void-900 border border-slate-700 text-cyan-300">
                        Cost: {spell.cost}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center gap-2">
                  <span>Range: <strong className="text-slate-200">{spell.range}</strong></span>
                  <span>•</span>
                  <span>Target: <strong className="text-slate-200">{spell.target}</strong></span>
                </div>
              </div>

              {/* Traits Badges */}
              <div className="flex flex-wrap gap-1 mb-2.5">
                {spell.traits.map((t) => (
                  <span
                    key={t}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-void-900 border border-slate-800 text-slate-300 font-semibold"
                  >
                    {t}
                  </span>
                ))}
                {spell.defense && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold flex items-center gap-1">
                    <Target className="w-2.5 h-2.5" />
                    <span>Defense: {spell.defense}</span>
                  </span>
                )}
              </div>

              {/* Spell Effect Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {spell.description}
              </p>

              {/* Heightened Effect */}
              {spell.heightened && (
                <div className="mt-2.5 p-2 rounded-lg bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-200/90 font-medium">
                  <strong className="text-purple-300">{spell.heightened}</strong>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-void-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Cast in combat via <strong>Crew Station Actions ► Magic Conduit</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow"
          >
            Close Repository
          </button>
        </div>
      </div>
    </div>
  );
};
