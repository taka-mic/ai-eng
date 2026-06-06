import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../../constants/Theme';

interface CardProps { children: React.ReactNode; style?: ViewStyle; elevated?: boolean; }

export function Card({ children, style, elevated = false }: CardProps) {
  return <View style={[styles.card, elevated && Theme.shadow.md, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.lg, padding: Theme.spacing.md, borderWidth: 1, borderColor: Theme.colors.border },
});
