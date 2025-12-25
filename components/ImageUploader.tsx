
import React, { useRef, useState } from 'react';

interface Props {
  onUpload: (base64: string) => void;
}

const ImageUploader: React.FC<Props> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full max-w-2xl p-16 glass-panel rounded-[3rem] cursor-pointer border-2 border-dashed transition-all group flex flex-col items-center justify-center text-center ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5'}`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      
      <div className="w-24 h-24 bg-indigo-500/5 rounded-[2rem] flex items-center justify-center text-indigo-400 group-hover:text-white group-hover:bg-indigo-500 transition-all mb-8 border border-indigo-500/20 shadow-2xl">
        <i className="fas fa-arrow-up-from-bracket text-3xl"></i>
      </div>
      
      <h3 className="text-2xl font-black text-white mb-3 tracking-tight uppercase">Upload de Mídia</h3>
      <p className="text-sm text-slate-500 font-medium mb-10">Arraste sua imagem ou clique para explorar arquivos</p>
      
      <div className="flex gap-4">
        {['JPG', 'PNG', 'WEBP'].map(ext => (
          <span key={ext} className="text-[10px] font-black tracking-[0.2em] text-slate-500 border border-white/5 px-4 py-2 rounded-xl bg-white/5">
            {ext}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
