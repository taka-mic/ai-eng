import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useProgressStore } from '../../store/progressStore';
import { Theme } from '../../constants/Theme';
import { Colors } from '../../constants/Colors';

export default function ProgressScreen() {
  const { progress } = useProgressStore();

  const xpInCurrentLevel = progress.xp - (progress.level - 1) * 200;
  const xpProgress = xpInCurrentLevel / 200;
  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.correctAnswered / progress.totalAnswered) * 100)
      : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* レベルカード */}
      <Card elevated style={styles.levelCard}>
        <View style={styles.levelTop}>
          <View style={styles.levelCircle}>
            <Text style={styles.levelNum}>{progress.level}</Text>
            <Text style={styles.levelLbl}>LV</Text>
          </View>
          <View style={styles.levelDetails}>
            <Text style={styles.levelTitle}>現在のレベル</Text>
            <Text style={styles.xpText}>
              {xpInCurrentLevel} / 200 XP
            </Text>
            <Text style={styles.nextLevel}>
              次のレベルまで {200 - xpInCurrentLevel} XP
            </Text>
          </View>
        </View>
        <ProgressBar progress={xpProgress} height={10} style={styles.xpBar} />
      </Card>

      {/* 統計 */}
      <Text style={styles.sectionTitle}>学習統計</Text>
      <View style={styles.statsGrid}>
        <StatItem
          icon="checkmark-done-circle"
          iconColor={Colors.success}
          value={progress.totalAnswered}
          label="総回答数"
          unit="問"
        />
        <StatItem
          icon="bulb"
          iconColor={Colors.warning}
          value={accuracy}
          label="正答率"
          unit="%"
        />
        <StatItem
          icon="flag"
          iconColor={Colors.primary}
          value={progress.completedQuestIds.length}
          label="クリア済み"
          unit="クエスト"
        />
        <StatItem
          icon="flame"
          iconColor={Colors.secondary}
          value={progress.streakDays}
          label="連続学習"
          unit="日"
        />
      </View>

      {/* 正答数・不正答数 */}
      <Text style={styles.sectionTitle}>回答内訳</Text>
      <Card style={styles.breakdownCard}>
        <BreakdownRow
          label="正解"
          value={progress.correctAnswered}
          total={progress.totalAnswered}
          color={Colors.success}
        />
        <View style={styles.divider} />
        <BreakdownRow
          label="不正解"
          value={progress.totalAnswered - progress.correctAnswered}
          total={progress.totalAnswered}
          color={Colors.danger}
        />
      </Card>

      {/* 励ましメッセージ */}
      <Card style={styles.messageCard}>
        <Ionicons name="rocket" size={32} color={Colors.primary} />
        <Text style={styles.messageText}>
          {progress.totalAnswered === 0
            ? 'さあ、最初のクエストに挑戦しよう！'
            : accuracy >= 80
            ? '素晴らしい！この調子で志望校合格を目指そう！'
            : accuracy >= 60
            ? '順調です！苦手分野を集中して攻略しよう！'
            : 'まだまだこれから！基礎クエストから積み上げよう！'}
        </Text>
      </Card>
    </ScrollView>
  );
}

function StatItem({
  icon,
  iconColor,
  value,
  label,
  unit,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  value: number;
  label: string;
  unit: string;
}) {
  return (
    <Card style={styles.statItem}>
      <Ionicons name={icon} size={28} color={iconColor} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function BreakdownRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? value / total : 0;
  return (
    <View style={styles.breakdownRow}>
      <Text style={styles.breakdownLabel}>{label}</Text>
      <View style={styles.breakdownBarWrapper}>
        <ProgressBar progress={pct} color={color} height={6} />
      </View>
      <Text style={[styles.breakdownValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Theme.spacing.md, gap: Theme.spacing.md, paddingBottom: 32 },

  levelCard: { padding: Theme.spacing.lg },
  levelTop: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.md, marginBottom: Theme.spacing.md },
  levelCircle: {
    width: 64,
    height: 64,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNum: { fontSize: Theme.fontSize.xxl, fontWeight: Theme.fontWeight.extrabold, color: Colors.textOnPrimary, lineHeight: 28 },
  levelLbl: { fontSize: Theme.fontSize.xs, color: Colors.primaryLight, fontWeight: Theme.fontWeight.bold },
  levelDetails: { flex: 1 },
  levelTitle: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary },
  xpText: { fontSize: Theme.fontSize.md, color: Colors.primary, fontWeight: Theme.fontWeight.semibold, marginTop: 2 },
  nextLevel: { fontSize: Theme.fontSize.sm, color: Colors.textMuted, marginTop: 2 },
  xpBar: {},

  sectionTitle: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Theme.spacing.sm },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Theme.spacing.lg,
  },
  statValue: { fontSize: Theme.fontSize.xxl, fontWeight: Theme.fontWeight.extrabold, color: Colors.textPrimary },
  statUnit: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  statLabel: { fontSize: Theme.fontSize.sm, color: Colors.textSecondary },

  breakdownCard: { gap: Theme.spacing.md, padding: Theme.spacing.lg },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.sm },
  breakdownLabel: { fontSize: Theme.fontSize.sm, color: Colors.textSecondary, width: 40 },
  breakdownBarWrapper: { flex: 1 },
  breakdownValue: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold, width: 32, textAlign: 'right' },
  divider: { height: 1, backgroundColor: Colors.divider },

  messageCard: {
    alignItems: 'center',
    gap: Theme.spacing.sm,
    padding: Theme.spacing.lg,
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryLight,
  },
  messageText: {
    fontSize: Theme.fontSize.md,
    color: Colors.primary,
    fontWeight: Theme.fontWeight.medium,
    textAlign: 'center',
    lineHeight: 24,
  },
});
