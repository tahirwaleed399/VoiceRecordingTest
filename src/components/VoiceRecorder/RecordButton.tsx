import React from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

interface RecordButtonProps {
  isRecording: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function RecordButton({ isRecording, onClick, disabled = false }: RecordButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center
        w-16 h-16 rounded-full
        transition-all duration-300 ease-in-out
        ${isRecording 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-blue-500 hover:bg-blue-600'
        }
        disabled:opacity-50 focus:outline-none
        shadow-lg hover:shadow-xl
      `}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? (
        <FaStop className="text-white text-xl" />
      ) : (
        <FaMicrophone className="text-white text-xl" />
      )}
    </button>
  );
}