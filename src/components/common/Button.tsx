import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Theme } from '../../constants/Theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const containerStyle = [
    styles.base,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    disabled && styles.disabled,
    style,
  ];

  const labelStyle = [
    styles.label,
    styles[`labelSize_${size}`],
    styles[`labelVariant_${variant}`],
    disabled && styles.labelDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Theme.colors.textOnPrimary : Theme.colors.primary}
          size="small"
        />
      ) : (
        <Text style={labelStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.borderRadius.lg,
  },
  size_sm: { paddingVertical: Theme.spacing.sm, paddingHorizontal: Theme.spacing.md },
  size_md: { paddingVertical: 14, paddingHorizontal: Theme.spacing.lg },
  size_lg: { paddingVertical: Theme.spacing.lg, paddingHorizontal: Theme.spacing.xl },

  variant_primary: { backgroundColor: Theme.colors.primary },
  variant_secondary: { backgroundColor: Theme.colors.secondary },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  variant_ghost: { backgroundColor: 'transparent' },

  disabled: { opacity: 0.45 },

  label: { fontWeight: Theme.fontWeight.bold },
  labelSize_sm: { fontSize: Theme.fontSize.sm },
  labelSize_md: { fontSize: Theme.fontSize.md },
  labelSize_lg: { fontSize: Theme.fontSize.lg },

  labelVariant_primary: { color: Theme.colors.textOnPrimary },
  labelVariant_secondary: { color: Theme.colors.textOnPrimary },
  labelVariant_outline: { color: Theme.colors.primary },
  labelVariant_ghost: { color: Theme.colors.primary },

  labelDisabled: { opacity: 0.6 },
});
