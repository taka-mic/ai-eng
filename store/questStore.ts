import { create } from 'zustand';
import { Quest, QuizSession } from '../types';
import { vocabularyQuests } from '../data/vocabulary';
import { grammarQuests } from '../data/grammar';

interface QuestStore {
  allQuests: Quest[];
  activeSession: QuizSession | null;
  startSession: (questId: string) => void;
  submitAnswer: (answerIndex: number) => void;
  endSession: () => void;
  getQuestById: (id: string) => Quest | undefined;
}

const allQuests = [...vocabularyQuests, ...grammarQuests];

export const useQuestStore = create<QuestStore>((set, get) => ({
  allQuests,
  activeSession: null,

  startSession: (questId) => {
    const quest = allQuests.find((q) => q.id === questId);
    if (!quest) return;
    set({
      activeSession: {
        questId,
        currentIndex: 0,
        answers: new Array(quest.totalQuestions).fill(null),
        startedAt: Date.now(),
      },
    });
  },

  submitAnswer: (answerIndex) =>
    set((state) => {
      if (!state.activeSession) return state;
      const newAnswers = [...state.activeSession.answers];
      newAnswers[state.activeSession.currentIndex] = answerIndex;
      return {
        activeSession: {
          ...state.activeSession,
          answers: newAnswers,
          currentIndex: state.activeSession.currentIndex + 1,
        },
      };
    }),

  endSession: () => set({ activeSession: null }),

  getQuestById: (id) => get().allQuests.find((q) => q.id === id),
}));
