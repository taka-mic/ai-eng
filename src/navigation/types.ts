import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

// ─── スタックナビゲーター（タブ + クエスト詳細） ───────────────────────────
export type RootStackParamList = {
  Tabs: undefined;
  Quest: { questId: string };
};

// ─── ボトムタブナビゲーター ──────────────────────────────────────────────
export type TabParamList = {
  Home: undefined;
  Vocabulary: undefined;
  Grammar: undefined;
  Progress: undefined;
};

// ─── 各画面の Props 型エイリアス ─────────────────────────────────────────
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

// useNavigation() の型推論用
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
