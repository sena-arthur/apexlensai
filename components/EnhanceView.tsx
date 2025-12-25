
import React, { useState } from 'react';
import { EditPreset } from '../types';

interface Props {
  onEnhance: (prompt: string) => void;
  isLoading: boolean;
}

const PRESETS: EditPreset[] = [
  { 
    id: 'sharp', 
    label: 'Super Sharpen', 
    prompt: 'Sharpen all details and textures in this image to make it crystal clear. Ensure edges are defined and noise is removed without introducing artifacts.', 
    icon: 'fa-expand' 
  },
];

const EnhanceView: React.FC<Props> = ({ onEnhance, isLoading }) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onEnhance(customPrompt);
    }
  };

  return (
    <div className="glass-panel rounded-[2rem] p-8 space-y-8 border border-white/10 shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20">
          <i className="fas fa-microchip text-xl"></i>
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Controles IA</h3>
          <p className="text-[10px] text-indigo-400/70 uppercase font-black tracking-widest">Optimization Module</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Aprimoramento Principal</label>
        <div className="grid grid-cols-1 gap-4">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              disabled={isLoading}
              onClick={() => onEnhance(p.prompt)}
              className="flex items-center gap-5 p-6 bg-white/5 border border-white/5 rounded-3xl transition-all group text-left disabled:opacity-50 hover:bg-white/10 hover:border-indigo-500/30"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-3">
                <i className={`fas ${p.icon} text-2xl`}></i>
              </div>
              <div className="flex-1">
                <span className="block text-base font-black text-white uppercase tracking-tight">{p.label}</span>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Modo Ultra High-Def</span>
              </div>
              <i className="fas fa-chevron-right text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all"></i>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-white/5">
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Prompt Neural</label>
            <span className="text-[9px] text-slate-600 font-bold uppercase">Avançado</span>
          </div>
          <div className="relative group">
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Descreva edições específicas... (ex: 'suavizar pele')"
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-700 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !customPrompt.trim()}
              className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-30 uppercase text-[11px] tracking-widest border border-white/5"
            >
              <i className="fas fa-wand-sparkles text-xs"></i>
              Processar Personalizado
            </button>
          </div>
        </form>
      </div>

      <div className="bg-indigo-500/5 p-5 rounded-2xl border border-indigo-500/10">
        <div className="flex gap-4">
          <i className="fas fa-bolt-lightning text-indigo-400/50 text-xs mt-1"></i>
          <p className="text-[9px] text-slate-500 leading-relaxed uppercase font-black tracking-widest">
            O Super Sharpen utiliza algoritmos de super-resolução para preencher detalhes texturais mantendo a fidelidade cromática.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhanceView;
