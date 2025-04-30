"use client"
import React, { useEffect, useState } from 'react';
import { RecordButton } from './RecordButton';
import { PlaybackControls } from './PlaybackControls';
import { SavedIndicator } from './SavedIndicator';
import { AudioVisualizer } from './AudioVisualizer';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';

import { isBrowserCompatible } from '@/utils/audio';

export function VoiceRecorder() {
  const {
    state,
    audioUrl,
    startRecording,
    stopRecording,
    playRecording,
    pausePlayback,
    resetRecording,
    elapsedTime,
  } = useVoiceRecorder(5000); // 5 seconds auto-stop
  const [browserCompatible] = useState(isBrowserCompatible());

  const [showSaved, setShowSaved] = useState(false);
  
  const isRecording = state === 'recording';
  const isPlaying = state === 'playing';
  const isSaved = state === 'saved' || state === 'playing';
  
  // Format time as seconds
  const formattedTime = (elapsedTime / 1000).toFixed(1);
  
  // Show saved indicator when recording is complete
  useEffect(() => {
    if (state === 'saved' && !showSaved) {
      setShowSaved(true);
      const timeout = setTimeout(() => {
        setShowSaved(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [state, showSaved]);
  
  const handleRecordClick = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  if (!browserCompatible) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Voice Recorder
        </h2>
        <p className="text-center text-red-500">
          Your browser doesn't support audio recording. Please try using Chrome, Firefox, or Edge.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <SavedIndicator show={showSaved} />
      
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Voice Recorder
        </h2>
        
        {isRecording && (
          <div className="flex justify-center mb-4">
            <div className="text-xl font-semibold text-red-500 animate-pulse">
              Recording: {formattedTime}s
            </div>
          </div>
        )}
        
        <AudioVisualizer isRecording={isRecording} />
        
        <div className="flex flex-col items-center mt-6">
          <RecordButton 
            isRecording={isRecording}
            onClick={handleRecordClick}
            disabled={isPlaying}
          />
          
          {isSaved && audioUrl && (
            <div className="mt-6 w-full">
              <p className="text-center text-gray-600 mb-2">
                Your recording has been saved!
              </p>
              
              <PlaybackControls
                isPlaying={isPlaying}
                onPlay={playRecording}
                onPause={pausePlayback}
              />
              
              <button
                onClick={resetRecording}
                className="mt-4 w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors"
              >
                Record New
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}