import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { Colors } from '../constants/Colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'ページが見つかりません' }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>🔍</Text>
        <Text style={styles.title}>ページが見つかりません</Text>
        <Link href="/" style={styles.link}>
          ホームへ戻る
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.md,
    backgroundColor: Colors.background,
  },
  emoji: { fontSize: 64 },
  title: { fontSize: Theme.fontSize.lg, color: Colors.textSecondary },
  link: { fontSize: Theme.fontSize.md, color: Colors.primary, fontWeight: '600' },
});
