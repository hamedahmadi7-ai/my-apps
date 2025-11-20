import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploadWrapper from './components/ImageUpload';
import PromptInput from './components/PromptInput';
import ResultDisplay from './components/ResultDisplay';
import { editImageWithGemini } from './services/geminiService';
import { ImageState } from './types';

const App: React.FC = () => {
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    previewUrl: null,
    base64: null,
    mimeType: null
  });
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = useCallback((file: File, base64: string) => {
    const previewUrl = URL.createObjectURL(file);
    setImageState({
      file,
      previewUrl,
      base64,
      mimeType: file.type
    });
    // Reset previous results
    setGeneratedImage(null);
    setError(null);
    // Default prompt for convenience if empty - focusing on the primary use case
    if (!prompt) {
      setPrompt("Upscale this image to high resolution (1200 DPI look), increasing detail and texture fidelity.");
    }
  }, [prompt]);

  const handleGenerate = useCallback(async () => {
    if (!imageState.base64 || !imageState.mimeType || !prompt) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await editImageWithGemini(
        imageState.base64,
        imageState.mimeType,
        prompt
      );
      setGeneratedImage(resultBase64);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [imageState, prompt]);

  const handleReset = () => {
    setImageState({
      file: null,
      previewUrl: null,
      base64: null,
      mimeType: null
    });
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-purple-500/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 flex items-center gap-3 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" x2="12" y1="8" y2="12"></line>
              <line x1="12" x2="12.01" y1="16" y2="16"></line>
            </svg>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Left Column: Input Controls */}
          <div className="flex flex-col gap-6">
            
            {/* Image Preview / Upload Area */}
            <div className="w-full aspect-[4/3] lg:aspect-square relative rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700 shadow-lg">
              <ImageUploadWrapper 
                onImageSelected={handleImageSelected} 
                previewUrl={imageState.previewUrl}
                onReset={imageState.previewUrl ? handleReset : undefined}
              />
            </div>

            {/* Prompt Input Section */}
            <PromptInput 
              prompt={prompt} 
              setPrompt={setPrompt} 
              onGenerate={handleGenerate} 
              isLoading={isLoading}
              disabled={!imageState.base64}
            />
          </div>

          {/* Right Column: Results */}
          <div className="flex flex-col h-full min-h-[500px]">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                 Result
               </h2>
             </div>
            <ResultDisplay 
              originalImage={imageState.previewUrl || ''}
              generatedImage={generatedImage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
