import React, { useState, KeyboardEvent } from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const ENHANCEMENTS = [
  { 
    label: "Upscale (1200 DPI)", 
    prompt: "Upscale this image to high resolution (1200 DPI look), increasing detail and texture fidelity.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 11 12 6 7 11"/>
        <line x1="12" x2="12" y1="18" y2="6"/>
      </svg>
    )
  },
  { 
    label: "Upscale (300 DPI)", 
    prompt: "Upscale this image to standard print resolution (300 DPI), improving sharpness suitable for high-quality printing.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 11 12 6 7 11"/>
        <line x1="12" x2="12" y1="18" y2="6"/>
      </svg>
    )
  },
  { 
    label: "Upscale (4K)", 
    prompt: "Upscale this image to 4K Ultra HD resolution, maximizing clarity and fine details.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 11 12 6 7 11"/>
        <line x1="12" x2="12" y1="18" y2="6"/>
      </svg>
    )
  },
  { 
    label: "Fix Lighting", 
    prompt: "Fix lighting, balance exposure, and enhance colors for a natural, vibrant look.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" x2="12" y1="1" y2="3"/>
        <line x1="12" x2="12" y1="21" y2="23"/>
        <line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/>
        <line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/>
        <line x1="1" x2="3" y1="12" y2="12"/>
        <line x1="21" x2="23" y1="12" y2="12"/>
        <line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/>
        <line x1="18.36" x2="19.78" y1="4.22" y2="5.64"/>
      </svg>
    )
  },
  { 
    label: "Color Correction", 
    prompt: "Color correct this image, neutralizing color casts and improving saturation for a professional look.",
    icon: null
  },
  { 
    label: "Remove Background", 
    prompt: "Remove the background and leave the subject on a clean white background.",
    icon: null
  },
];

const STYLES = [
  { label: "Retro Vintage", prompt: "Apply a retro vintage aesthetic with film grain and warm color grading." },
  { label: "Cyberpunk Neon", prompt: "Transform into a cyberpunk style with neon lights, dark tones, and futuristic vibes." },
  { label: "Pencil Sketch", prompt: "Convert this image into a detailed pencil sketch." },
  { label: "Oil Painting", prompt: "Turn this image into a classic oil painting with visible brushstrokes." },
];

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onGenerate, isLoading, disabled }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [sharpness, setSharpness] = useState(50);
  const [noiseLevel, setNoiseLevel] = useState(50);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !isLoading) {
        onGenerate();
      }
    }
  };

  const updateSharpness = (value: number) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    setSharpness(clampedValue);
    
    let intensityDesc = "moderate";
    if (clampedValue < 30) intensityDesc = "subtle";
    else if (clampedValue > 75) intensityDesc = "extreme";
    else if (clampedValue > 50) intensityDesc = "high";

    // Construct the sentence
    const newSentence = `Sharpen the image with ${intensityDesc} intensity (${clampedValue}%). Enhance fine details and edge contrast for a crisp, clear look.`;
    
    // Regex to match existing sharpness command (flexible with potential user edits to description)
    const regex = /Sharpen the image with .*? intensity \(\d+%\)\. Enhance fine details and edge contrast for a crisp, clear look\.?/g;

    const currentPrompt = prompt || "";
    let newPrompt = currentPrompt;

    if (currentPrompt.match(regex)) {
      // Replace existing
      newPrompt = currentPrompt.replace(regex, newSentence);
    } else {
      // Append if not found
      // Ensure proper spacing
      const separator = currentPrompt.trim().length > 0 && !currentPrompt.trim().endsWith('.') ? '. ' : ' ';
      newPrompt = (currentPrompt.trim() + separator + newSentence).trim();
    }
    
    setPrompt(newPrompt);
  };

  const updateNoiseLevel = (value: number) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    setNoiseLevel(clampedValue);
    
    let intensityDesc = "moderate";
    if (clampedValue < 30) intensityDesc = "subtle";
    else if (clampedValue > 75) intensityDesc = "strong";
    else if (clampedValue > 50) intensityDesc = "high";

    const newSentence = `Reduce image noise with ${intensityDesc} intensity (${clampedValue}%). Smooth out grain and digital artifacts while preserving main details and textures.`;
    const regex = /Reduce image noise with .*? intensity \(\d+%\)\. Smooth out grain and digital artifacts while preserving main details and textures\.?/g;

    const currentPrompt = prompt || "";
    let newPrompt = currentPrompt;

    if (currentPrompt.match(regex)) {
      newPrompt = currentPrompt.replace(regex, newSentence);
    } else {
      const separator = currentPrompt.trim().length > 0 && !currentPrompt.trim().endsWith('.') ? '. ' : ' ';
      newPrompt = (currentPrompt.trim() + separator + newSentence).trim();
    }

    setPrompt(newPrompt);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Text Area */}
      <div className={`relative rounded-xl bg-slate-800 border transition-all duration-300 ${isFocused ? 'border-purple-500 shadow-lg shadow-purple-500/10' : 'border-slate-700'}`}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Describe how you want to change the image..."
          className="w-full bg-transparent text-slate-100 p-4 min-h-[100px] outline-none resize-none disabled:opacity-50 placeholder:text-slate-500 font-light"
        />
        <div className="absolute bottom-3 right-3">
          <button
            type="button"
            onClick={onGenerate}
            disabled={disabled || isLoading || !prompt.trim()}
            className={`
              flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300
              ${disabled || isLoading || !prompt.trim() 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-md hover:shadow-purple-500/25 transform active:scale-95'}
            `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                  <line x1="16" x2="22" y1="5" y2="5" />
                  <line x1="19" x2="19" y1="2" y2="8" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Fine Tuning Sliders */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${disabled || isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Sharpness Slider */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex justify-between items-center mb-4">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Sharpness
            </label>
            <div className="flex items-center gap-2">
               <input
                  type="number"
                  min="0"
                  max="100"
                  disabled={disabled || isLoading}
                  value={sharpness}
                  onChange={(e) => updateSharpness(parseInt(e.target.value) || 0)}
                  className="w-14 bg-slate-900 text-purple-400 px-2 py-1 rounded border border-slate-700 shadow-sm text-xs font-mono text-center focus:outline-none focus:border-purple-500 transition-colors"
                />
                <span className="text-xs text-slate-500 font-mono">%</span>
            </div>
          </div>
          <div className="relative w-full h-6 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={sharpness}
              onChange={(e) => updateSharpness(parseInt(e.target.value))}
              disabled={disabled || isLoading}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-slate-600 font-medium uppercase tracking-wider px-1">
            <span>Natural</span>
            <span>Crisp</span>
            <span>Extreme</span>
          </div>
        </div>

        {/* Noise Reduction Slider */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex justify-between items-center mb-4">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>
              </svg>
              Denoise
            </label>
            <div className="flex items-center gap-2">
               <input
                  type="number"
                  min="0"
                  max="100"
                  disabled={disabled || isLoading}
                  value={noiseLevel}
                  onChange={(e) => updateNoiseLevel(parseInt(e.target.value) || 0)}
                  className="w-14 bg-slate-900 text-cyan-400 px-2 py-1 rounded border border-slate-700 shadow-sm text-xs font-mono text-center focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <span className="text-xs text-slate-500 font-mono">%</span>
            </div>
          </div>
          <div className="relative w-full h-6 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={noiseLevel}
              onChange={(e) => updateNoiseLevel(parseInt(e.target.value))}
              disabled={disabled || isLoading}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-slate-600 font-medium uppercase tracking-wider px-1">
            <span>Subtle</span>
            <span>Smooth</span>
            <span>Strong</span>
          </div>
        </div>
      </div>

      {/* Enhancements Group */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
          Quick Actions
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {ENHANCEMENTS.map((item, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setPrompt(item.prompt)}
              disabled={disabled || isLoading}
              className={`text-xs font-medium px-3 py-2.5 rounded-lg border transition-all flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 text-center sm:text-left group
                ${disabled || isLoading 
                  ? 'bg-slate-800/30 border-slate-800 text-slate-600 cursor-not-allowed' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:text-indigo-300 cursor-pointer'
                }
              `}
            >
              {item.icon && <span className={disabled || isLoading ? 'text-slate-600' : 'text-indigo-400 group-hover:text-indigo-300 transition-colors'}>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Styles Group */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
          Creative Styles
        </p>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((item, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setPrompt(item.prompt)}
              disabled={disabled || isLoading}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all
                ${disabled || isLoading 
                  ? 'bg-slate-800/30 border-slate-800 text-slate-600 cursor-not-allowed' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-300 cursor-pointer'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;