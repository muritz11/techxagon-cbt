export interface QuestionInterface {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizResultInterface {
  student: {
    name: string;
    class: string;
  };
  date: string;
  score: string;
  selectedQuestions: QuestionInterface[];
  selectedAnswers: {
    [key: number]: string;
  };
}
