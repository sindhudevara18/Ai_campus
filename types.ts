export type Module = 'academic' | 'mood' | 'campus';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  recruitmentStatus: 'open' | 'closed';
  alert?: string;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  deadline: string;
  link: string;
}

export interface MoodEntry {
  date: string;
  score: number;
  note?: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}
