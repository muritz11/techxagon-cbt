export const QUESTION_LENGTH = 12;
export const QUESTION_WEIGHT = 5;
// quiz duration in seconds
export const QUIZ_DURATION = 600;

export interface QuestionInterface {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizResultInterface {
  student: AuthStudentInterface | null;
  date: string;
  score: number;
  totalQuesions: number;
  quesionWeight: number;
  selectedQuestions: QuestionInterface[];
  selectedAnswers: {
    [key: number]: string;
  };
}

export interface AuthStudentInterface {
  paperId?: number;
  paperTitle?: string;
  name: string;
  class: string;
}
