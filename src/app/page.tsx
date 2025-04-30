import { VoiceRecorder } from '@/components/VoiceRecorder/VoiceRecorder';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Voice Recorder App
        </h1>
        
        <VoiceRecorder />
        
        <p className="text-center text-gray-500 mt-8">
          Speak and your voice will be recorded for 5 seconds.
        </p>
      </div>
    </main>
  );
}