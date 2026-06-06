import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { QuestionCard } from '../components/quest/QuestionCard';
import { AnswerOption } from '../components/quest/AnswerOption';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { useQuestStore } from '../store/questStore';
import { useProgressStore } from '../store/progressStore';
import { Theme } from '../constants/Theme';
import { Colors } from '../constants/Colors';
import { Quest } from '../types';
import { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'Quest'>;
type Phase = 'intro' | 'quiz' | 'result';

export function QuestScreen({ route, navigation }: Props) {
  const { questId } = route.params;
  const { getQuestById, activeSession, startSession, submitAnswer, endSession } = useQuestStore();
  const { addXP, recordAnswer, completeQuest } = useProgressStore();

  const quest = getQuestById(questId);
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  useEffect(() => {
    return () => endSession();
  }, []);

  const handleAbort = useCallback(() => {
    Alert.alert('中断', 'クエストを中断しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '中断する', style: 'destructive',
        onPress: () => { endSession(); navigation.goBack(); },
      },
    ]);
  }, []);

  useEffect(() => {
    if (phase === 'quiz') {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={handleAbort} hitSlop={8}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({ headerLeft: undefined });
    }
  }, [phase]);

  if (!quest) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>クエストが見つかりませんでした。</Text>
        <Button label="戻る" onPress={() => navigation.goBack()} style={styles.backBtn} />
      </View>
    );
  }

  const currentIndex = activeSession?.currentIndex ?? 0;
  const currentQuestion = quest.questions[currentIndex];
  const isLastQuestion = currentIndex === quest.totalQuestions - 1;

  // ─── フェーズ遷移ハンドラー ─────────────────────────────────────────────
  function handleStart() {
    startSession(quest!.id);
    setPhase('quiz');
    setSelectedIndex(null);
    setRevealed(false);
    setResults([]);
  }

  function handleSelectOption(index: number) {
    if (revealed) return;
    setSelectedIndex(index);
  }

  function handleConfirm() {
    if (selectedIndex === null) return;
    const correct = selectedIndex === currentQuestion.correctIndex;
    setRevealed(true);
    recordAnswer(correct);
    setResults((prev) => [...prev, correct]);
  }

  function handleNext() {
    if (selectedIndex === null) return;
    submitAnswer(selectedIndex);
    if (isLastQuestion) {
      const correctCount = [...results].filter(Boolean).length;
      const xpEarned = Math.round((correctCount / quest!.totalQuestions) * quest!.xpReward);
      addXP(xpEarned);
      completeQuest(quest!.id);
      endSession();
      setPhase('result');
    } else {
      setSelectedIndex(null);
      setRevealed(false);
    }
  }

  function getOptionState(index: number) {
    if (!revealed) return selectedIndex === index ? 'selected' : 'default';
    if (index === currentQuestion.correctIndex) return 'correct';
    if (index === selectedIndex) return 'incorrect';
    return 'default';
  }

  // ─── フェーズ別レンダリング ─────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <IntroPhase
        quest={quest}
        onStart={handleStart}
        onBack={() => navigation.goBack()}
      />
    );
  }

  if (phase === 'result') {
    const correctCount = results.filter(Boolean).length;
    return (
      <ResultPhase
        quest={quest}
        correctCount={correctCount}
        results={results}
        onRetry={handleStart}
        onHome={() => navigation.navigate('Tabs')}
      />
    );
  }

  // ─── クイズフェーズ ─────────────────────────────────────────────────────
  return (
    <View style={styles.quizContainer}>
      <View style={styles.progressRow}>
        <ProgressBar progress={currentIndex / quest.totalQuestions} />
      </View>

      <ScrollView
        contentContainerStyle={styles.quizContent}
        showsVerticalScrollIndicator={false}
      >
        <QuestionCard
          questionNumber={currentIndex + 1}
          totalQuestions={quest.totalQuestions}
          questionText={currentQuestion.question}
          category={currentQuestion.category}
          difficulty={currentQuestion.difficulty}
        />

        <View style={styles.options}>
          {currentQuestion.options.map((option, i) => (
            <AnswerOption
              key={i}
              label={option}
              index={i}
              state={getOptionState(i)}
              onPress={() => handleSelectOption(i)}
              disabled={revealed}
            />
          ))}
        </View>

        {revealed && (
          <Card style={styles.explanationCard}>
            <View style={styles.explanationHeader}>
              <Ionicons
                name={selectedIndex === currentQuestion.correctIndex ? 'checkmark-circle' : 'close-circle'}
                size={22}
                color={selectedIndex === currentQuestion.correctIndex ? Colors.success : Colors.danger}
              />
              <Text style={[
                styles.explanationResult,
                { color: selectedIndex === currentQuestion.correctIndex ? Colors.success : Colors.danger },
              ]}>
                {selectedIndex === currentQuestion.correctIndex ? '正解！' : '不正解'}
              </Text>
            </View>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </Card>
        )}
      </ScrollView>

      <View style={styles.actionBar}>
        {!revealed
          ? <Button label="答え合わせ" onPress={handleConfirm} disabled={selectedIndex === null} style={styles.actionBtn} />
          : <Button label={isLastQuestion ? '結果を見る' : '次の問題へ'} onPress={handleNext} style={styles.actionBtn} />
        }
      </View>
    </View>
  );
}

// ─── イントロ画面 ──────────────────────────────────────────────────────────
function IntroPhase({
  quest, onStart, onBack,
}: { quest: Quest; onStart: () => void; onBack: () => void }) {
  const diffColor =
    quest.difficulty === 'easy' ? Colors.easy :
    quest.difficulty === 'medium' ? Colors.medium : Colors.hard;
  const diffLabel =
    quest.difficulty === 'easy' ? '基礎' :
    quest.difficulty === 'medium' ? '標準' : '発展';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.introContent}>
      <View style={styles.introIcon}>
        <Ionicons
          name={quest.type === 'vocabulary' ? 'book' : 'pencil'}
          size={48}
          color={Colors.primary}
        />
      </View>
      <Text style={styles.introTitle}>{quest.title}</Text>
      <Text style={styles.introDesc}>{quest.description}</Text>
      <View style={styles.introMeta}>
        <MetaChip icon="help-circle" label={`${quest.totalQuestions}問`} />
        <MetaChip icon="star" label={`${quest.xpReward} XP`} iconColor={Colors.warning} />
        <View style={[styles.metaChip, { backgroundColor: diffColor + '22' }]}>
          <Text style={[styles.metaChipText, { color: diffColor }]}>{diffLabel}</Text>
        </View>
      </View>
      <Button label="クエスト開始！" onPress={onStart} size="lg" style={styles.startBtn} />
      <Button label="戻る" onPress={onBack} variant="ghost" />
    </ScrollView>
  );
}

function MetaChip({
  icon, label, iconColor = Colors.primary,
}: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; iconColor?: string }) {
  return (
    <View style={[styles.metaChip, { backgroundColor: Colors.primaryLight }]}>
      <Ionicons name={icon} size={14} color={iconColor} />
      <Text style={[styles.metaChipText, { color: iconColor }]}>{label}</Text>
    </View>
  );
}

// ─── 結果画面 ──────────────────────────────────────────────────────────────
function ResultPhase({
  quest, correctCount, results, onRetry, onHome,
}: {
  quest: Quest;
  correctCount: number;
  results: boolean[];
  onRetry: () => void;
  onHome: () => void;
}) {
  const score = Math.round((correctCount / quest.totalQuestions) * 100);
  const xpEarned = Math.round((correctCount / quest.totalQuestions) * quest.xpReward);
  const isPerfect = correctCount === quest.totalQuestions;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.resultContent}>
      <Text style={styles.resultEmoji}>{isPerfect ? '🏆' : score >= 60 ? '⭐' : '📚'}</Text>
      <Text style={styles.resultTitle}>
        {isPerfect ? 'パーフェクト！' : score >= 60 ? 'クエストクリア！' : 'もう少し！'}
      </Text>
      <Text style={styles.resultScore}>{score}点</Text>
      <Text style={styles.resultSub}>{correctCount} / {quest.totalQuestions} 問正解</Text>

      <Card style={styles.xpCard}>
        <Ionicons name="star" size={24} color={Colors.warning} />
        <Text style={styles.xpEarned}>+{xpEarned} XP 獲得！</Text>
      </Card>

      <View style={styles.resultAnswers}>
        {results.map((correct, i) => (
          <View key={i} style={styles.resultDot}>
            <Ionicons
              name={correct ? 'checkmark-circle' : 'close-circle'}
              size={28}
              color={correct ? Colors.success : Colors.danger}
            />
            <Text style={styles.resultDotLabel}>問{i + 1}</Text>
          </View>
        ))}
      </View>

      <Button label="もう一度挑戦" onPress={onRetry} style={styles.retryBtn} />
      <Button label="ホームへ戻る"  onPress={onHome} variant="outline" />
    </ScrollView>
  );
}

// ─── スタイル ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Theme.spacing.md },
  errorText: { fontSize: Theme.fontSize.md, color: Colors.textSecondary },
  backBtn:   { marginTop: Theme.spacing.md },

  quizContainer: { flex: 1, backgroundColor: Colors.background },
  progressRow:   { paddingHorizontal: Theme.spacing.md, paddingTop: Theme.spacing.sm },
  quizContent:   { padding: Theme.spacing.md, gap: Theme.spacing.md, paddingBottom: 100 },
  options:       { gap: Theme.spacing.sm },

  explanationCard:   { backgroundColor: Colors.surfaceVariant },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.sm, marginBottom: Theme.spacing.sm },
  explanationResult: { fontSize: Theme.fontSize.md, fontWeight: Theme.fontWeight.bold },
  explanationText:   { fontSize: Theme.fontSize.sm, color: Colors.textPrimary, lineHeight: 22 },

  actionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Theme.spacing.md, backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  actionBtn: { width: '100%' },

  introContent: { padding: Theme.spacing.xl, alignItems: 'center', gap: Theme.spacing.md, paddingBottom: 48 },
  introIcon: {
    width: 88, height: 88, borderRadius: Theme.borderRadius.xl,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: Theme.spacing.sm,
  },
  introTitle: { fontSize: Theme.fontSize.xxl, fontWeight: Theme.fontWeight.extrabold, color: Colors.textPrimary, textAlign: 'center' },
  introDesc:  { fontSize: Theme.fontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  introMeta:  { flexDirection: 'row', gap: Theme.spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  metaChip:   { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Theme.spacing.md, paddingVertical: 6, borderRadius: Theme.borderRadius.full },
  metaChipText: { fontSize: Theme.fontSize.sm, fontWeight: Theme.fontWeight.semibold },
  startBtn:   { width: '100%', marginTop: Theme.spacing.md },

  resultContent: { padding: Theme.spacing.xl, alignItems: 'center', gap: Theme.spacing.md, paddingBottom: 48 },
  resultEmoji:   { fontSize: 64, marginBottom: Theme.spacing.sm },
  resultTitle:   { fontSize: Theme.fontSize.xxl, fontWeight: Theme.fontWeight.extrabold, color: Colors.textPrimary },
  resultScore:   { fontSize: 64, fontWeight: Theme.fontWeight.extrabold, color: Colors.primary, lineHeight: 72 },
  resultSub:     { fontSize: Theme.fontSize.md, color: Colors.textSecondary },
  xpCard:   { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.sm, backgroundColor: '#FFF8E8', borderColor: Colors.warning, paddingHorizontal: Theme.spacing.xl, paddingVertical: Theme.spacing.md },
  xpEarned: { fontSize: Theme.fontSize.lg, fontWeight: Theme.fontWeight.bold, color: Colors.warning },
  resultAnswers: { flexDirection: 'row', gap: Theme.spacing.md, flexWrap: 'wrap', justifyContent: 'center' },
  resultDot:      { alignItems: 'center', gap: 4 },
  resultDotLabel: { fontSize: Theme.fontSize.xs, color: Colors.textMuted },
  retryBtn: { width: '100%', marginTop: Theme.spacing.sm },
});
