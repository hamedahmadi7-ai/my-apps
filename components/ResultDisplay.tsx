import React, { useState } from 'react';

interface ResultDisplayProps {
  originalImage: string;
  generatedImage: string | null;
  isLoading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, generatedImage, isLoading }) => {
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

  if (!generatedImage && !isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800 p-12 min-h-[300px]">
        <div className="text-center text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <p>Generated image will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 h-full">
      <div className="w-full h-full relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl min-h-[400px] flex items-center justify-center group">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-900/80 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-purple-300 font-medium animate-pulse">Thinking with Nano Banana...</p>
          </div>
        ) : null}

        {generatedImage ? (
            <>
                <div className="w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent flex items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
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
                            src={`data:image/png;base64,${generatedImage}`} 
                            alt="Generated Result" 
                            className="max-w-none object-contain shadow-2xl" 
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
                <div className="absolute top-4 right-4 flex items-center gap-2 z-30">
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
                </div>

                <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity flex justify-end pointer-events-none ${isMagnifierOpen ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                    <a 
                      href={`data:image/png;base64,${generatedImage}`}
                      download="nanoedit-upscaled.png"
                      className="pointer-events-auto px-4 py-2 bg-white text-black rounded-lg font-medium flex items-center gap-2 hover:bg-slate-200 transition-colors shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      Download
                    </a>
                 </div>
            </>
        ) : (
           <div className="w-full h-full flex items-center justify-center opacity-20">
             {/* Placeholder for no result yet */}
             <img src={originalImage} alt="Original Placeholder" className="max-w-full max-h-full object-contain blur-sm" />
           </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
