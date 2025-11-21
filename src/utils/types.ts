export interface QuestionInterface {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizResultInterface {
  student: AuthStudentInterface | null;
  date: string;
  score: string;
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
