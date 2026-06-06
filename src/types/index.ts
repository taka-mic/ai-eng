export type QuestionType = 'vocabulary' | 'grammar' | 'reading';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  difficulty: Difficulty;
  totalQuestions: number;
  xpReward: number;
  questions: Question[];
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalAnswered: number;
  correctAnswered: number;
  completedQuestIds: string[];
  streakDays: number;
}

export interface QuizSession {
  questId: string;
  currentIndex: number;
  answers: (number | null)[];
  startedAt: number;
}
