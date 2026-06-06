import { Quest } from '../types';

export const grammarQuests: Quest[] = [
  {
    id: 'grammar-easy-01', title: '基礎文法クエスト①', description: '時制・助動詞の基本をマスターしよう！',
    type: 'grammar', difficulty: 'easy', totalQuestions: 5, xpReward: 50,
    questions: [
      { id: 'g001', type: 'grammar', difficulty: 'easy', question: '( ) に入る最も適切な語を選べ。\n\nShe ( ) in Tokyo since 2020.', options: ['live', 'lives', 'has lived', 'lived'], correctIndex: 2, explanation: '"since 2020" は継続を表す現在完了形を使う。主語が She なので "has lived"。', category: '時制' },
      { id: 'g002', type: 'grammar', difficulty: 'easy', question: '( ) に入る最も適切な語を選べ。\n\nYou ( ) not park here.', options: ['can', 'must', 'should', 'would'], correctIndex: 1, explanation: '禁止を表すには "must not" を使う。', category: '助動詞' },
      { id: 'g003', type: 'grammar', difficulty: 'easy', question: '( ) に入る最も適切な語を選べ。\n\nThis is the book ( ) I bought yesterday.', options: ['who', 'which', 'whose', 'where'], correctIndex: 1, explanation: '先行詞が物 (the book) で目的格の場合は "which" または "that" を使う。', category: '関係詞' },
      { id: 'g004', type: 'grammar', difficulty: 'easy', question: '( ) に入る最も適切な語を選べ。\n\n( ) he was tired, he continued working.', options: ['Because', 'Although', 'If', 'While'], correctIndex: 1, explanation: '逆接の意味には "Although" を使う。', category: '接続詞' },
      { id: 'g005', type: 'grammar', difficulty: 'easy', question: '( ) に入る最も適切な語を選べ。\n\nThe problem was ( ) difficult to solve.', options: ['so', 'such', 'too', 'very'], correctIndex: 2, explanation: '"too ~ to do" で「～すぎて…できない」。', category: '副詞' },
    ],
  },
  {
    id: 'grammar-medium-01', title: '応用文法クエスト①', description: '仮定法・分詞構文など入試必須文法を攻略！',
    type: 'grammar', difficulty: 'medium', totalQuestions: 5, xpReward: 100,
    questions: [
      { id: 'g101', type: 'grammar', difficulty: 'medium', question: '( ) に入る最も適切な語を選べ。\n\nIf I ( ) you, I would apologize immediately.', options: ['am', 'were', 'had been', 'will be'], correctIndex: 1, explanation: '仮定法過去では be 動詞は "were" を使う。', category: '仮定法' },
      { id: 'g102', type: 'grammar', difficulty: 'medium', question: '( ) に入る最も適切な語を選べ。\n\n( ) from the top, the city looks beautiful.', options: ['See', 'Seen', 'Seeing', 'To see'], correctIndex: 1, explanation: '主語 the city は見られる側なので受動の過去分詞 "Seen"。', category: '分詞構文' },
      { id: 'g103', type: 'grammar', difficulty: 'medium', question: '( ) に入る最も適切な語を選べ。\n\nI wish I ( ) more time to study.', options: ['have', 'had', 'will have', 'would have'], correctIndex: 1, explanation: '"I wish + 仮定法過去" で現在の事実に反する願望を表す。', category: '仮定法' },
      { id: 'g104', type: 'grammar', difficulty: 'medium', question: '( ) に入る最も適切な語を選べ。\n\nNo sooner ( ) he arrived than it started raining.', options: ['had', 'has', 'did', 'was'], correctIndex: 0, explanation: '"No sooner had S V1 than S V2" の倒置構文。', category: '倒置・強調' },
      { id: 'g105', type: 'grammar', difficulty: 'medium', question: '( ) に入る最も適切な語を選べ。\n\nShe had her wallet ( ) on the train.', options: ['steal', 'stealing', 'stolen', 'to steal'], correctIndex: 2, explanation: '"have + 物 + 過去分詞" で被害を表す。財布が「盗まれた」ので "stolen"。', category: '使役・受動' },
    ],
  },
];
