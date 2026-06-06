import { create } from 'zustand';
import { UserProgress } from '../types';

const XP_PER_LEVEL = 200;

interface ProgressStore {
  progress: UserProgress;
  addXP: (amount: number) => void;
  recordAnswer: (correct: boolean) => void;
  completeQuest: (questId: string) => void;
  incrementStreak: () => void;
}

const initialProgress: UserProgress = {
  level: 1, xp: 0, xpToNextLevel: XP_PER_LEVEL,
  totalAnswered: 0, correctAnswered: 0, completedQuestIds: [], streakDays: 0,
};

export const useProgressStore = create<ProgressStore>((set) => ({
  progress: initialProgress,
  addXP: (amount) => set((state) => {
    const newXP = state.progress.xp + amount;
    const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
    return { progress: { ...state.progress, xp: newXP, level: newLevel, xpToNextLevel: newLevel * XP_PER_LEVEL } };
  }),
  recordAnswer: (correct) => set((state) => ({
    progress: { ...state.progress, totalAnswered: state.progress.totalAnswered + 1, correctAnswered: state.progress.correctAnswered + (correct ? 1 : 0) },
  })),
  completeQuest: (questId) => set((state) => {
    if (state.progress.completedQuestIds.includes(questId)) return state;
    return { progress: { ...state.progress, completedQuestIds: [...state.progress.completedQuestIds, questId] } };
  }),
  incrementStreak: () => set((state) => ({
    progress: { ...state.progress, streakDays: state.progress.streakDays + 1 },
  })),
}));
