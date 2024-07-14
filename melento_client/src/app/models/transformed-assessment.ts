export interface TransformedAssessment {
  id: string;
  assessment: {
    id: string;
    aName: string;
    marks: number;
    time: number;
    itinery: Array<{
      question: string;
      options: string[];
      correctAns: string;
    }>;
  };
  attemptNumber: number;
}
