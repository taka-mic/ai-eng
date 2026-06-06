import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import {
  fetchTTSAudio,
  generateFeedbackScript,
  VoiceFeedbackPayload,
} from '../services/voiceService';

// ─── 公開する状態 ────────────────────────────────────────────────────────────
export interface VoiceFeedbackState {
  isLoading: boolean;  // APIリクエスト中
  isPlaying: boolean;  // 再生中
  error: string | null;
}

export interface UseVoiceFeedbackReturn extends VoiceFeedbackState {
  /** 正解/不正解に応じた音声フィードバックを取得して再生する */
  playFeedback: (payload: VoiceFeedbackPayload) => Promise<void>;
  /** 現在の再生を停止する */
  stop: () => Promise<void>;
}

// ─── Hook 本体 ───────────────────────────────────────────────────────────────
export function useVoiceFeedback(): UseVoiceFeedbackReturn {
  const [state, setState] = useState<VoiceFeedbackState>({
    isLoading: false,
    isPlaying: false,
    error: null,
  });

  // Sound インスタンスを ref で保持（再レンダーをまたいで使うため）
  const soundRef = useRef<Audio.Sound | null>(null);

  // ─── 初期化：iOS のサイレントモードでも再生できるように設定 ──────────────
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
    });

    // アンマウント時に必ずアンロード
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  // ─── 停止 ────────────────────────────────────────────────────────────────
  const stop = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
      } catch {
        // 既に停止済みの場合は無視
      } finally {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    }
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);

  // ─── 再生 ────────────────────────────────────────────────────────────────
  const playFeedback = useCallback(
    async (payload: VoiceFeedbackPayload) => {
      // 多重再生防止：前の音声を止める
      await stop();

      setState({ isLoading: true, isPlaying: false, error: null });

      try {
        // 1. 読み上げ原稿を生成
        const script = generateFeedbackScript(payload);

        // 2. TTS API を呼んでローカルファイル URI を取得
        const audioUri = await fetchTTSAudio(script);

        // 3. Sound オブジェクトを生成して即再生
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true, volume: 1.0 },
          onPlaybackStatusUpdate,
        );
        soundRef.current = sound;

        setState({ isLoading: false, isPlaying: true, error: null });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '音声の取得・再生に失敗しました';
        setState({ isLoading: false, isPlaying: false, error: message });
        // クイズの流れは止めないため、エラーは state に記録するだけ
      }
    },
    [stop],
  );

  // ─── 再生ステータスのコールバック ────────────────────────────────────────
  function onPlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (!status.isLoaded) return;
    if (status.didJustFinish) {
      setState((s) => ({ ...s, isPlaying: false }));
      // 再生完了後にアンロードしてメモリを解放
      soundRef.current?.unloadAsync();
      soundRef.current = null;
    }
  }

  return { ...state, playFeedback, stop };
}
