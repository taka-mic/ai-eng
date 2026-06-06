import { Platform } from 'react-native';
import { QuestionType } from '../types';

// expo-file-system は Web では動かないため、Native のみ dynamic import する
let FileSystem: typeof import('expo-file-system/legacy') | null = null;
if (Platform.OS !== 'web') {
  FileSystem = require('expo-file-system/legacy');
}

// ─── 環境変数 ────────────────────────────────────────────────────────────────
// EXPO_PUBLIC_ プレフィックスを付けることで Metro バンドラーが展開する。
// ⚠️  direct モードの APIキーは本番ビルドに含めないこと。
const VOICE_MODE   = (process.env.EXPO_PUBLIC_VOICE_MODE    ?? 'proxy') as 'direct' | 'proxy';
const OPENAI_KEY   =  process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';
const OPENAI_VOICE = (process.env.EXPO_PUBLIC_OPENAI_VOICE  ?? 'nova');
const PROXY_URL    =  process.env.EXPO_PUBLIC_VOICE_API_URL  ?? '';

// ─── ペイロード型 ────────────────────────────────────────────────────────────
export interface VoiceFeedbackPayload {
  correct: boolean;
  questionText: string;  // 問題文（例："abundant" の意味として…）
  correctAnswer: string; // 正解の選択肢テキスト
  userAnswer: string;    // ユーザーが選んだ選択肢テキスト
  explanation: string;   // 解説文
  questType: QuestionType;
}

// ─── フィードバック文章の生成 ────────────────────────────────────────────────
export function generateFeedbackScript(payload: VoiceFeedbackPayload): string {
  const { correct, correctAnswer, explanation, questType } = payload;
  const hint = explanation.split('。')[0] + '。';

  if (questType === 'vocabulary') {
    return correct
      ? `正解です！素晴らしい！「${correctAnswer}」、完璧です。${hint}この調子で頑張りましょう！`
      : `惜しい！正解は「${correctAnswer}」でした。${hint}次は絶対に覚えましょう！`;
  }
  return correct
    ? `正解！よく考えましたね。${hint}`
    : `不正解です。正解は「${correctAnswer}」です。${hint}`;
}

// ─── メイン関数：テキストを受け取り、再生可能な URI / URL を返す ─────────────
export async function fetchTTSAudio(text: string): Promise<string> {
  if (VOICE_MODE === 'direct') {
    return fetchFromOpenAI(text);
  }
  return fetchFromProxy(text);
}

// ─── Direct モード：OpenAI TTS API を直接呼ぶ ────────────────────────────────
async function fetchFromOpenAI(text: string): Promise<string> {
  if (!OPENAI_KEY) {
    throw new Error('EXPO_PUBLIC_OPENAI_API_KEY が未設定です。.env を確認してください。');
  }

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: OPENAI_VOICE,
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`OpenAI TTS エラー (${response.status}): ${detail}`);
  }

  return saveAudio(await response.arrayBuffer());
}

// ─── Proxy モード：自前バックエンドを経由する ────────────────────────────────
// バックエンド仕様:
//   POST EXPO_PUBLIC_VOICE_API_URL
//   Body:     { "text": string }
//   Response: audio/mpeg バイナリ
async function fetchFromProxy(text: string): Promise<string> {
  if (!PROXY_URL) {
    throw new Error('EXPO_PUBLIC_VOICE_API_URL が未設定です。.env を確認してください。');
  }

  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Voice Proxy エラー (${response.status}): ${detail}`);
  }

  return saveAudio(await response.arrayBuffer());
}

// ─── プラットフォーム別の音声保存 ────────────────────────────────────────────
// Web  : Blob URL を返す（FileSystem 不要）
// Native: expo-file-system でキャッシュに書き込む
async function saveAudio(buffer: ArrayBuffer): Promise<string> {
  if (Platform.OS === 'web') {
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  }

  if (!FileSystem) throw new Error('FileSystem が利用できません');

  const base64 = arrayBufferToBase64(buffer);
  const uri = `${FileSystem.cacheDirectory}jukken_tts_feedback.mp3`;
  await FileSystem.writeAsStringAsync(uri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return uri;
}

// ─── ArrayBuffer → Base64（チャンク処理でスタックオーバーフロー回避） ─────────
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const CHUNK = 8192;
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}
