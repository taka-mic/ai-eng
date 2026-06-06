import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../components/common/Card';
import { useQuestStore } from '../store/questStore';
import { useProgressStore } from '../store/progressStore';
import { Theme } from '../constants/Theme';
import { Colors } from '../constants/Colors';
import { Quest } from '../types';
import { TabScreenProps } from '../navigation/types';

type Props = TabScreenProps<'Vocabulary'>;

export function VocabularyScreen({ navigation }: Props) {
  const { allQuests } = useQuestStore();
  const { progress } = useProgressStore();

  const vocabQuests = allQuests.filter((q) => q.type === 'vocabulary');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.subtitle}>
        入試に出る必須英単語を体系的に学習しよう。クエストをクリアしてレベルアップ！
      </Text>

      {vocabQuests.map((quest) => (
        <QuestCard
          key={quest.id}
          quest={quest}
          completed={progress.completedQuestIds.includes(quest.id)}
          onPress={() => navigation.navigate('Quest', { questId: quest.id })}
        />
      ))}
    </ScrollView>
  );
}

function QuestCard({
  quest,
  completed,
  onPress,
}: {
  quest: Quest;
  completed: boolean;
  onPress: () => void;
}) {
  const diffColor =
    quest.difficulty === 'easy' ? Colors.easy :
    quest.difficulty === 'medium' ? Colors.medium : Colors.hard;
  const diffLabel =
    quest.difficulty === 'easy' ? '基礎' :
    quest.difficulty === 'medium' ? '標準' : '発展';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card elevated style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.diffBadge, { backgroundColor: diffColor + '22' }]}>
            <Text style={[styles.diffText, { color: diffColor }]}>{diffLabel}</Text>
          </View>
          {completed && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.completedText}>クリア済み</Text>
            </View>
          )}
        </View>
        <Text style={styles.title}>{quest.title}</Text>
        <Text style={styles.desc}>{quest.description}</Text>
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Ionicons name="help-circle-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.footerText}>{quest.totalQuestions}問</Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="star-outline" size={14} color={Colors.warning} />
            <Text style={styles.footerText}>{quest.xpReward} XP</Text>
          </View>
          <View style={styles.startButton}>
            <Text style={styles.startText}>{completed ? '再挑戦' : 'スタート'}</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.textOnPrimary} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content:   { padding: Theme.spacing.md, gap: Theme.spacing.md, paddingBottom: 32 },
  subtitle:  { fontSize: Theme.fontSize.sm, color: Colors.textSecondary, lineHeight: 20 },

  card:   { padding: Theme.spacing.lg, gap: Theme.spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  diffBadge:      { paddingHorizontal: 10, paddingVertical: 3, borderRadius: Theme.borderRadius.full },
  diffText:       { fontSize: Theme.fontSize.xs, fontWeight: Theme.fontWeight.bold },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  completedText:  { fontSize: Theme.fontSize.xs, color: Colors.success, fontWeight: Theme.fontWeight.medium },

  title: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.textPrimary },
  desc:  { fontSize: Theme.fontSize.sm, color: Colors.textSecondary, lineHeight: 20 },

  footer:      { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.md, marginTop: 4 },
  footerItem:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText:  { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  startButton: {
    marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary, paddingHorizontal: Theme.spacing.md,
    paddingVertical: 6, borderRadius: Theme.borderRadius.full,
  },
  startText: { fontSize: Theme.fontSize.sm, color: Colors.textOnPrimary, fontWeight: Theme.fontWeight.semibold },
});
