import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../../constants/Theme';

type OptionState = 'default' | 'selected' | 'correct' | 'incorrect';

interface AnswerOptionProps {
  label: string;
  index: number;
  state: OptionState;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function AnswerOption({
  label,
  index,
  state,
  onPress,
  disabled = false,
  style,
}: AnswerOptionProps) {
  return (
    <TouchableOpacity
      style={[styles.container, styles[`state_${state}`], style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <View style={[styles.badge, styles[`badge_${state}`]]}>
        <Text style={[styles.badgeText, styles[`badgeText_${state}`]]}>
          {OPTION_LABELS[index]}
        </Text>
      </View>
      <Text style={[styles.label, styles[`label_${state}`]]} numberOfLines={3}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    gap: Theme.spacing.sm,
  },
  state_default: {
    backgroundColor: Theme.colors.surface,
    borderColor: Theme.colors.border,
  },
  state_selected: {
    backgroundColor: Theme.colors.primaryLight,
    borderColor: Theme.colors.primary,
  },
  state_correct: {
    backgroundColor: '#E8FAF4',
    borderColor: Theme.colors.success,
  },
  state_incorrect: {
    backgroundColor: '#FFF0F0',
    borderColor: Theme.colors.danger,
  },

  badge: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  badge_default: { backgroundColor: Theme.colors.surfaceVariant },
  badge_selected: { backgroundColor: Theme.colors.primary },
  badge_correct: { backgroundColor: Theme.colors.success },
  badge_incorrect: { backgroundColor: Theme.colors.danger },

  badgeText: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.bold },
  badgeText_default: { color: Theme.colors.textSecondary },
  badgeText_selected: { color: Theme.colors.textOnPrimary },
  badgeText_correct: { color: Theme.colors.textOnPrimary },
  badgeText_incorrect: { color: Theme.colors.textOnPrimary },

  label: { flex: 1, fontSize: Theme.fontSize.md, lineHeight: 22 },
  label_default: { color: Theme.colors.textPrimary },
  label_selected: { color: Theme.colors.primary, fontWeight: Theme.fontWeight.medium },
  label_correct: { color: '#1E8A5F', fontWeight: Theme.fontWeight.medium },
  label_incorrect: { color: Theme.colors.danger, fontWeight: Theme.fontWeight.medium },
});
