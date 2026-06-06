import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { Theme } from '../../constants/Theme';
import { Difficulty } from '../../types';

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  category: string;
  difficulty: Difficulty;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '基礎',
  medium: '標準',
  hard: '発展',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: Theme.colors.easy,
  medium: Theme.colors.medium,
  hard: Theme.colors.hard,
};

export function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  category,
  difficulty,
}: QuestionCardProps) {
  return (
    <Card elevated style={styles.card}>
      <View style={styles.meta}>
        <Text style={styles.counter}>
          問題 {questionNumber} / {totalQuestions}
        </Text>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{category}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: DIFFICULTY_COLORS[difficulty] + '22' }]}>
            <Text style={[styles.tagText, { color: DIFFICULTY_COLORS[difficulty] }]}>
              {DIFFICULTY_LABELS[difficulty]}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.question}>{questionText}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Theme.spacing.lg,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  counter: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    fontWeight: Theme.fontWeight.medium,
  },
  tags: {
    flexDirection: 'row',
    gap: Theme.spacing.xs,
  },
  tag: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.primaryLight,
  },
  tagText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.primary,
    fontWeight: Theme.fontWeight.semibold,
  },
  question: {
    fontSize: Theme.fontSize.lg,
    color: Theme.colors.textPrimary,
    fontWeight: Theme.fontWeight.semibold,
    lineHeight: 28,
  },
});
