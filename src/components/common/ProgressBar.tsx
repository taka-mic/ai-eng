import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../../constants/Theme';

interface ProgressBarProps { progress: number; color?: string; height?: number; style?: ViewStyle; }

export function ProgressBar({ progress, color = Theme.colors.primary, height = 8, style }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.track, { height }, style]}>
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: color, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', backgroundColor: Theme.colors.primaryLight, borderRadius: Theme.borderRadius.full, overflow: 'hidden' },
  fill: { borderRadius: Theme.borderRadius.full },
});
