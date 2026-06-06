import { useState, useCallback, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  fetchTTSAudio,
  generateFeedbackScript,
  VoiceFeedbackPayload,
} from '../services/voiceService';

export interface VoiceFeedbackState {
  isLoading: boolean;
  isPlaying: boolean;
  error: string | null;
}

export interface UseVoiceFeedbackReturn extends VoiceFeedbackState {
  playFeedback: (payload: VoiceFeedbackPayload) => Promise<void>;
  stop: () => Promise<void>;
}

const isWeb = Platform.OS === 'web';

export function useVoiceFeedback(): UseVoiceFeedbackReturn {
  const [state, setState] = useState<VoiceFeedbackState>({
    isLoading: false,
    isPlaying: false,
    error: null,
  });
  // soundRef holds either expo-av Sound (native) or HTMLAudioElement (web)
  const soundRef = useRef<any>(null);

  useEffect(() => {
    if (!isWeb) {
      // expo-av is native-only; require() avoids bundling it for web
      const { Audio } = require('expo-av');
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
      }).catch(() => {});
    }

    return () => {
      if (soundRef.current) {
        if (isWeb) {
          (soundRef.current as HTMLAudioElement).pause();
        } else {
          soundRef.current.unloadAsync?.().catch?.(() => {});
        }
        soundRef.current = null;
      }
    };
  }, []);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      if (isWeb) {
        (soundRef.current as HTMLAudioElement).pause();
        soundRef.current = null;
      } else {
        try { await soundRef.current.stopAsync(); } catch { /* already stopped */ }
        finally {
          await soundRef.current.unloadAsync?.().catch?.(() => {});
          soundRef.current = null;
        }
      }
    }
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);

  const playFeedback = useCallback(
    async (payload: VoiceFeedbackPayload) => {
      await stop();
      setState({ isLoading: true, isPlaying: false, error: null });

      try {
        const script = generateFeedbackScript(payload);
        const audioUri = await fetchTTSAudio(script);

        if (isWeb) {
          // Use native HTMLAudioElement on web
          const audio = new (globalThis as any).Audio(audioUri) as HTMLAudioElement;
          soundRef.current = audio;
          audio.addEventListener('ended', () => {
            setState((s) => ({ ...s, isPlaying: false }));
            soundRef.current = null;
          });
          await audio.play();
        } else {
          const { Audio } = require('expo-av');
          const { sound } = await Audio.Sound.createAsync(
            { uri: audioUri },
            { shouldPlay: true, volume: 1.0 },
            (status: any) => {
              if (status.isLoaded && status.didJustFinish) {
                setState((s) => ({ ...s, isPlaying: false }));
                soundRef.current?.unloadAsync?.().catch?.(() => {});
                soundRef.current = null;
              }
            },
          );
          soundRef.current = sound;
        }

        setState({ isLoading: false, isPlaying: true, error: null });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '音声の取得・再生に失敗しました';
        setState({ isLoading: false, isPlaying: false, error: message });
      }
    },
    [stop],
  );

  return { ...state, playFeedback, stop };
}
