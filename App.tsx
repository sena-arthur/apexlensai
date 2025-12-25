
import React, { useState } from 'react';
import { ImageState } from './types';
import { editImage } from './services/gemini';
import ImageUploader from './components/ImageUploader';
import EnhanceView from './components/EnhanceView';

const App: React.FC = () => {
  const [state, setState] = useState<ImageState>({
    original: null,
    edited: null,
    analysis: null,
    isProcessing: false,
    error: null,
  });

  const [isComparing, setIsComparing] = useState(false);

  const handleImageUpload = (base64: string) => {
    setState({
      original: base64,
      edited: null,
      analysis: null,
      isProcessing: false,
      error: null
    });
    setIsComparing(false);
  };

  const handleEnhance = async (prompt: string) => {
    if (!state.original) return;
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    try {
      const result = await editImage(state.original, prompt);
      setState(prev => ({ ...prev, edited: result, isProcessing: false }));
      setIsComparing(false);
    } catch (err) {
      setState(prev => ({ ...prev, error: (err as Error).message, isProcessing: false }));
    }
  };

  const reset = () => {
    setState({
      original: null,
      edited: null,
      analysis: null,
      isProcessing: false,
      error: null
    });
    setIsComparing(false);
  };

  const displayedImage = isComparing ? state.original : (state.edited || state.original);

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200">
      {/* Dynamic Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-indigo-500/20">
              <i className="fas fa-aperture"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">ApexLens <span className="text-indigo-400">AI</span></h1>
              <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase">Neural Engine 2.5</p>
            </div>
          </div>
          
          {state.original && (
            <button 
              onClick={reset}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-bold transition-all border border-white/10 flex items-center gap-2 group"
            >
              <i className="fas fa-plus group-hover:rotate-90 transition-transform"></i>
              NOVA IMAGEM
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full p-6 md:p-12">
        {!state.original ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
              NITIDEZ <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">DEFINIDA POR IA.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg mb-12 font-medium">
              Transforme fotos de baixa resolução em imagens cristalinas com nosso motor de reconstrução neural.
            </p>
            <ImageUploader onUpload={handleImageUpload} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Preview Section */}
            <div className="lg:col-span-8 space-y-8">
              <div className="glass-panel rounded-[2.5rem] overflow-hidden relative shadow-2xl flex items-center justify-center min-h-[500px] border border-white/10 group">
                {/* Labels */}
                <div className="absolute top-6 left-6 z-10 flex gap-3">
                  <div className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest backdrop-blur-xl border transition-all ${isComparing ? 'bg-orange-500/80 border-orange-400 text-white shadow-lg shadow-orange-500/20' : (state.edited ? 'bg-indigo-500/80 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/10 border-white/20 text-slate-400')}`}>
                    {isComparing ? 'ORIGINAL' : (state.edited ? '✓ APRIMORADA' : 'ORIGINAL')}
                  </div>
                </div>

                {/* Display Image */}
                <img 
                  src={displayedImage || ''} 
                  alt="Review" 
                  className="max-w-full h-auto max-h-[70vh] object-contain transition-all duration-300 group-hover:scale-[1.01]"
                />

                {/* Processing State */}
                {state.isProcessing && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
                    <div className="relative w-20 h-20 mb-8">
                      <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
                      RECONSTRUINDO PIXELS...
                    </p>
                  </div>
                )}

                {/* Desktop Quick Compare */}
                {state.edited && !state.isProcessing && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block">
                    <button 
                      onMouseDown={() => setIsComparing(true)}
                      onMouseUp={() => setIsComparing(false)}
                      onMouseLeave={() => setIsComparing(false)}
                      onTouchStart={() => setIsComparing(true)}
                      onTouchEnd={() => setIsComparing(false)}
                      className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl backdrop-blur-xl border border-white/20 transition-all active:scale-95 select-none"
                    >
                      Segure para ver original
                    </button>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between glass-panel p-6 rounded-3xl border border-white/5 gap-6">
                <button 
                  onClick={reset}
                  className="text-slate-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-colors"
                >
                  <i className="fas fa-trash-alt"></i>
                  Remover
                </button>
                
                <div className="flex gap-4 items-center">
                  {state.edited && (
                    <>
                      <button 
                        onClick={() => setIsComparing(!isComparing)}
                        className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 border ${isComparing ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
                      >
                        <i className={`fas ${isComparing ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        {isComparing ? 'Vendo Original' : 'Comparar'}
                      </button>

                      <a 
                        href={state.edited} 
                        download="apexlens-enhanced.png"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 glow-button"
                      >
                        <i className="fas fa-cloud-arrow-down text-sm"></i>
                        Download HD
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Controls Section */}
            <div className="lg:col-span-4 space-y-6">
              {state.error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl flex items-start gap-4 mb-8 animate-shake">
                  <i className="fas fa-exclamation-triangle mt-1"></i>
                  <p className="text-xs font-bold uppercase tracking-wide">{state.error}</p>
                </div>
              )}

              <EnhanceView 
                onEnhance={handleEnhance} 
                isLoading={state.isProcessing}
              />

              <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-500/5 to-transparent">
                <div className="flex gap-4">
                  <i className="fas fa-shield-halved text-indigo-400 mt-1"></i>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                    Privacidade Total: <br/>
                    Suas imagens são processadas e não ficam armazenadas em nossos servidores após a sessão.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-12 border-t border-white/5 glass-panel">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">
            ApexLens AI © 2024
          </div>
          <div className="flex gap-8">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural 2.5 Flash</span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Ultra Resolution</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
