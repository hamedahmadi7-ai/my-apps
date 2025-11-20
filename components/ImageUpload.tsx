import React, { useCallback, useState, useRef } from 'react';
import { SUPPORTED_MIME_TYPES } from '../types';

interface ImageUploadProps {
  onImageSelected: (file: File, base64: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showMagnifier, setShowMagnifier] = useState(false);
  
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, WebP, HEIC).');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix to get raw base64 for the API
        const base64Data = base64String.split(',')[1];
        onImageSelected(file, base64Data);
        // Reset zoom on new file
        setZoomLevel(1);
        setShowMagnifier(false);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelected]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
  const toggleMagnifier = () => {
    if (showMagnifier) {
        setZoomLevel(1); // Reset on close
    }
    setShowMagnifier(!showMagnifier);
  };

  return (
    <div className="w-full h-full min-h-[300px] border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/30 flex flex-col items-center justify-center relative overflow-hidden group">
      <input
        type="file"
        accept={SUPPORTED_MIME_TYPES.join(',')}
        onChange={handleFileChange}
        className={`absolute inset-0 w-full h-full cursor-pointer z-10 ${showMagnifier ? 'pointer-events-none hidden' : 'opacity-0'}`}
        disabled={showMagnifier}
      />
      
      <div className={`flex flex-col items-center gap-4 p-6 text-center transition-opacity duration-300 ${showMagnifier ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-purple-400 transition-colors">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-200">Upload an image</p>
          <p className="text-sm text-slate-500 mt-1">Drag and drop or click to select</p>
        </div>
        <div className="text-xs text-slate-600 mt-2 bg-slate-900/50 px-3 py-1 rounded-full">
          JPG, PNG, WEBP up to 10MB
        </div>
      </div>
    </div>
  );
};

interface PreviewDisplayProps {
    src: string;
    onReset: () => void;
}

const PreviewDisplay: React.FC<PreviewDisplayProps> = ({ src, onReset }) => {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isMagnifierOpen, setIsMagnifierOpen] = useState(false);

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 5));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
    
    const toggleMagnifier = () => {
        if (isMagnifierOpen) {
            setZoomLevel(1);
        }
        setIsMagnifierOpen(!isMagnifierOpen);
    };

    return (
        <div className="w-full h-full relative bg-slate-900/50">
             {/* Image Container with Scroll Handling */}
             <div className="w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent flex items-center justify-center">
                <div 
                    className="transition-all duration-200 ease-out flex items-center justify-center"
                    style={{ 
                        width: isMagnifierOpen ? `${zoomLevel * 100}%` : '100%', 
                        height: isMagnifierOpen ? `${zoomLevel * 100}%` : '100%',
                        minWidth: '100%',
                        minHeight: '100%'
                    }}
                >
                    <img 
                        src={src} 
                        alt="Preview" 
                        className="max-w-none object-contain"
                        style={{
                             width: isMagnifierOpen && zoomLevel > 1 ? 'auto' : '100%',
                             height: isMagnifierOpen && zoomLevel > 1 ? 'auto' : '100%',
                             maxWidth: isMagnifierOpen && zoomLevel > 1 ? 'none' : '100%',
                             maxHeight: isMagnifierOpen && zoomLevel > 1 ? 'none' : '100%'
                        }}
                    />
                </div>
             </div>

            {/* Toolbar */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                {isMagnifierOpen && (
                    <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-lg p-1 animate-in fade-in slide-in-from-right-4 duration-200">
                        <button 
                            onClick={handleZoomOut}
                            disabled={zoomLevel <= 1}
                            className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Zoom Out"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
                        </button>
                        <span className="text-xs font-mono text-slate-300 w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                        <button 
                            onClick={handleZoomIn}
                            disabled={zoomLevel >= 5}
                            className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Zoom In"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                        </button>
                    </div>
                )}

                <button 
                    onClick={toggleMagnifier}
                    className={`p-2 rounded-lg backdrop-blur-md border transition-all shadow-lg ${isMagnifierOpen ? 'bg-purple-500 text-white border-purple-400' : 'bg-slate-900/80 text-white border-slate-700 hover:bg-slate-800'}`}
                    title="Magnifier Tool"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                        {isMagnifierOpen && <line x1="11" x2="11" y1="8" y2="14"></line>}
                        {isMagnifierOpen && <line x1="8" x2="14" y1="11" y2="11"></line>}
                    </svg>
                </button>

                <button 
                    onClick={onReset}
                    className="p-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 rounded-lg transition-all shadow-lg"
                    title="Remove image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}

const ImageUploadWrapper: React.FC<ImageUploadProps & { previewUrl?: string | null, onReset?: () => void }> = ({ onImageSelected, previewUrl, onReset }) => {
    if (previewUrl && onReset) {
        return <PreviewDisplay src={previewUrl} onReset={onReset} />;
    }
    return <ImageUpload onImageSelected={onImageSelected} />;
};

export default ImageUploadWrapper;
