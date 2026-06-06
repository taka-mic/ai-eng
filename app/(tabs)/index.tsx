import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useProgressStore } from '../../store/progressStore';
import { useQuestStore } from '../../store/questStore';
import { Theme } from '../../constants/Theme';
import { Colors } from '../../constants/Colors';
import { Quest } from '../../types';

export default function HomeScreen() {
  const router = useRouter();
  const { progress } = useProgressStore();
  const { allQuests } = useQuestStore();

  const xpInCurrentLevel = progress.xp - (progress.level - 1) * 200;
  const xpProgress = xpInCurrentLevel / 200;
  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.correctAnswered / progress.totalAnswered) * 100)
      : 0;

  const featuredQuests = allQuests.slice(0, 4);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ユーザーステータスカード */}
      <Card elevated style={styles.statusCard}>
        <View style={styles.levelRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{progress.level}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelLabel}>レベル {progress.level}</Text>
            <Text style={styles.xpText}>
              {xpInCurrentLevel} / 200 XP
            </Text>
          </View>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color={Colors.warning} />
            <Text style={styles.streakText}>{progress.streakDays}日</Text>
          </View>
        </View>
        <ProgressBar progress={xpProgress} style={styles.xpBar} />
      </Card>

      {/* 統計カード */}
      <View style={styles.statsRow}>
        <StatCard
          icon="checkmark-circle"
          iconColor={Colors.success}
          value={progress.totalAnswered}
          label="回答数"
        />
        <StatCard
          icon="trophy"
          iconColor={Colors.warning}
          value={`${accuracy}%`}
          label="正答率"
        />
        <StatCard
          icon="flag"
          iconColor={Colors.primary}
          value={progress.completedQuestIds.length}
          label="クリア"
        />
      </View>

      {/* クエスト一覧 */}
      <Text style={styles.sectionTitle}>おすすめクエスト</Text>
      {featuredQuests.map((quest) => (
        <QuestListItem
          key={quest.id}
          quest={quest}
          completed={progress.completedQuestIds.includes(quest.id)}
          onPress={() => router.push(`/quest/${quest.id}`)}
        />
      ))}
    </ScrollView>
  );
}

function StatCard({
  icon,
  iconColor,
  value,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  value: number | string;
  label: string;
}) {
  return (
    <Card style={styles.statCard}>
      <Ionicons name={icon} size={24} color={iconColor} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function QuestListItem({
  quest,
  completed,
  onPress,
}: {
  quest: Quest;
  completed: boolean;
  onPress: () => void;
}) {
  const difficultyColor =
    quest.difficulty === 'easy'
      ? Colors.easy
      : quest.difficulty === 'medium'
      ? Colors.medium
      : Colors.hard;

  const difficultyLabel =
    quest.difficulty === 'easy' ? '基礎' : quest.difficulty === 'medium' ? '標準' : '発展';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card style={styles.questCard}>
        <View style={styles.questLeft}>
          <View style={[styles.questTypeIcon, { backgroundColor: Colors.primaryLight }]}>
            <Ionicons
              name={quest.type === 'vocabulary' ? 'book' : 'pencil'}
              size={20}
              color={Colors.primary}
            />
          </View>
          <View style={styles.questInfo}>
            <Text style={styles.questTitle}>{quest.title}</Text>
            <Text style={styles.questDesc} numberOfLines={1}>
              {quest.description}
            </Text>
            <View style={styles.questMeta}>
              <View style={[styles.diffBadge, { backgroundColor: difficultyColor + '22' }]}>
                <Text style={[styles.diffText, { color: difficultyColor }]}>
                  {difficultyLabel}
                </Text>
              </View>
              <Text style={styles.questMetaText}>
                {quest.totalQuestions}問 · {quest.xpReward} XP
              </Text>
            </View>
          </View>
        </View>
        {completed ? (
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Theme.spacing.md, gap: Theme.spacing.md, paddingBottom: 32 },

  statusCard: { padding: Theme.spacing.lg },
  levelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.md },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  levelNumber: { color: Colors.textOnPrimary, fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.extrabold },
  levelInfo: { flex: 1 },
  levelLabel: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary },
  xpText: { fontSize: Theme.fontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF5E4',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.borderRadius.full,
  },
  streakText: { fontSize: Theme.fontSize.sm, color: Colors.warning, fontWeight: Theme.fontWeight.bold },
  xpBar: {},

  statsRow: { flexDirection: 'row', gap: Theme.spacing.sm },
  statCard: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: Theme.spacing.md },
  statValue: { fontSize: Theme.fontSize.xl, fontWeight: Theme.fontWeight.extrabold, color: Colors.textPrimary },
  statLabel: { fontSize: Theme.fontSize.xs, color: Colors.textSecondary },

  sectionTitle: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary },

  questCard: { flexDirection: 'row', alignItems: 'center', padding: Theme.spacing.md },
  questLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.md },
  questTypeIcon: {
    width: 44,
    height: 44,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questInfo: { flex: 1 },
  questTitle: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.semibold, color: Colors.textPrimary },
  questDesc: { fontSize: Theme.fontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  questMeta: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.sm, marginTop: 6 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Theme.borderRadius.full },
  diffText: { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.semibold },
  questMetaText: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
});
