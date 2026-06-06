import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { fetchTTSAudio, generateFeedbackScript, VoiceFeedbackPayload } from '../services/voiceService';

export interface VoiceFeedbackState {
  isLoading: boolean;
  isPlaying: boolean;
  error: string | null;
}

export interface UseVoiceFeedbackReturn extends VoiceFeedbackState {
  playFeedback: (payload: VoiceFeedbackPayload) => Promise<void>;
  stop: () => Promise<void>;
}

export function useVoiceFeedback(): UseVoiceFeedbackReturn {
  const [state, setState] = useState<VoiceFeedbackState>({ isLoading: false, isPlaying: false, error: null });
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, allowsRecordingIOS: false, staysActiveInBackground: false });
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      try { await soundRef.current.stopAsync(); } catch {}
      finally { await soundRef.current.unloadAsync(); soundRef.current = null; }
    }
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);

  const playFeedback = useCallback(async (payload: VoiceFeedbackPayload) => {
    await stop();
    setState({ isLoading: true, isPlaying: false, error: null });
    try {
      const script = generateFeedbackScript(payload);
      const audioUri = await fetchTTSAudio(script);
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri }, { shouldPlay: true, volume: 1.0 }, onPlaybackStatusUpdate);
      soundRef.current = sound;
      setState({ isLoading: false, isPlaying: true, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : '音声の取得・再生に失敗しました';
      setState({ isLoading: false, isPlaying: false, error: message });
    }
  }, [stop]);

  function onPlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (!status.isLoaded) return;
    if (status.didJustFinish) {
      setState((s) => ({ ...s, isPlaying: false }));
      soundRef.current?.unloadAsync();
      soundRef.current = null;
    }
  }

  return { ...state, playFeedback, stop };
}
