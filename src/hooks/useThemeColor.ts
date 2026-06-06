import { Colors, ColorKey } from '../constants/Colors';

export function useThemeColor(colorKey: ColorKey): string {
  return Colors[colorKey];
}
