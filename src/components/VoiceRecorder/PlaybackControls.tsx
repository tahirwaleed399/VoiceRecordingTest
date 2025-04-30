import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export function PlaybackControls({ isPlaying, onPlay, onPause }: PlaybackControlsProps) {
  return (
    <div className="flex space-x-4 mt-4">
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="
          flex items-center justify-center
          px-4 py-2 rounded-lg
          bg-indigo-500 hover:bg-indigo-600
          text-white font-medium
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-indigo-400
        "
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <>
            <FaPause className="mr-2" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <FaPlay className="mr-2" />
            <span>Play</span>
          </>
        )}
      </button>
    </div>
  );
}