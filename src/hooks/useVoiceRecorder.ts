import { useState, useRef, useCallback, useEffect } from 'react';

type RecordingState = 'idle' | 'recording' | 'saved' | 'playing';

interface UseVoiceRecorderReturn {
  state: RecordingState;
  audioUrl: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  playRecording: () => void;
  pausePlayback: () => void;
  resetRecording: () => void;
  elapsedTime: number;
}

export function useVoiceRecorder(autoStopDuration = 5000): UseVoiceRecorderReturn {
  const [state, setState] = useState<RecordingState>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Clean up function
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);
  
  // Reset recording
  const resetRecording = useCallback(() => {
    cleanup();
    setState('idle');
    setAudioUrl(null);
    setElapsedTime(0);
    audioChunksRef.current = [];
    mediaRecorderRef.current = null;
  }, [cleanup]);
  
    // Stop recording
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          cleanup();
        }
      }, [cleanup]);
  // Start recording
  const startRecording = useCallback(async () => {
    try {
      resetRecording();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        audioChunksRef.current.push(event.data);
      });
      
      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setState('saved');
        
        // Create new audio element for playback
        audioRef.current = new Audio(url);
        
        // Clean up the stream tracks
        stream.getTracks().forEach(track => track.stop());
      });
      
      mediaRecorderRef.current.start();
      setState('recording');
      startTimeRef.current = Date.now();
      
      // Set up auto-stop
      timerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, autoStopDuration);
      
      // Set up timer for UI
      const intervalId = setInterval(() => {
        if (state === 'recording') {
          setElapsedTime(Date.now() - startTimeRef.current);
        }
      }, 100);

      // Clear interval when recording stops
      timerRef.current = setTimeout(() => {
        clearInterval(intervalId);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, autoStopDuration);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [autoStopDuration, resetRecording, state, stopRecording]);
  

  
  // Play recording
  const playRecording = useCallback(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play();
      setState('playing');
      
      audioRef.current.onended = () => {
        setState('saved');
      };
    }
  }, [audioUrl]);
  
  // Pause playback
  const pausePlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState('saved');
    }
  }, []);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      cleanup();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl, cleanup]);
  
  return {
    state,
    audioUrl,
    startRecording,
    stopRecording,
    playRecording,
    pausePlayback,
    resetRecording,
    elapsedTime,
  };
}